import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import fs from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

const PROJECT_ID = 'demo-teky-bazar-rules';
const OWNER_UID = 'owner_uid_01';
const OWNER_EMAIL = 'kethelyn.fonseca9@gmail.com';
const DELEGATED_ADMIN_UID = 'delegated_admin_02';
const ATTACKER_UID = 'attacker_uid_99';

function buildValidProduct(authorId = OWNER_UID) {
  return {
    codigo: 'CIM-001',
    nome: 'Cimento CSN CP II-E 50kg',
    categoria: 'Materiais de Construção',
    preco: 36.9,
    unidade: 'saco 50kg',
    descricao: 'Cimento Portland composto de secagem rápida e alta resistência.',
    imagem: 'img/cimento-cp2.webp',
    disponivel: true,
    promocao: true,
    precoPromocional: 35.9,
    publicado: true,
    ordem: 1,
    authorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

describe('TEKY BAZAR Firestore Security Rules — Dirty Dozen Suite', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  it('allows verified store owner and delegated admins to manage products and public visitors to query published products', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();

    await assertSucceeds(setDoc(doc(adminDb, 'products', 'prod-1'), buildValidProduct()));

    // Bootstrapped admin grants delegated admin access
    await assertSucceeds(
      setDoc(doc(adminDb, 'admins', DELEGATED_ADMIN_UID), {
        uid: DELEGATED_ADMIN_UID,
        displayName: 'Gerente Loja',
        grantedBy: OWNER_UID,
        createdAt: serverTimestamp(),
      })
    );

    // Delegated admin can update stock/price without changing authorId
    const delegatedDb = testEnv
      .authenticatedContext(DELEGATED_ADMIN_UID, {
        email: 'gerente@example.com',
        email_verified: true,
      })
      .firestore();

    await assertSucceeds(
      updateDoc(doc(delegatedDb, 'products', 'prod-1'), {
        disponivel: false,
        publicado: true,
        updatedAt: serverTimestamp(),
      })
    );

    const publicDb = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(
      getDocs(query(collection(publicDb, 'products'), where('publicado', '==', true)))
    );
  });

  it('Dirty Payload 1: rejects unauthenticated product creation', async () => {
    const anonDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(anonDb, 'products', 'prod-1'), buildValidProduct('anon')));
  });

  it('Dirty Payload 2: rejects spoofed admin email when email_verified is false', async () => {
    const spoofDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: false,
      })
      .firestore();
    await assertFails(setDoc(doc(spoofDb, 'products', 'prod-1'), buildValidProduct(OWNER_UID)));
  });

  it('Dirty Payload 3: rejects product creation by verified non-admin user', async () => {
    const userDb = testEnv
      .authenticatedContext(ATTACKER_UID, {
        email: 'visitor@example.com',
        email_verified: true,
      })
      .firestore();
    await assertFails(setDoc(doc(userDb, 'products', 'prod-1'), buildValidProduct(ATTACKER_UID)));
  });

  it('Dirty Payload 4: rejects identity spoofing where authorId != request.auth.uid', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertFails(setDoc(doc(adminDb, 'products', 'prod-1'), buildValidProduct('other-uid')));
  });

  it('Dirty Payload 5: rejects shadow/ghost field injection', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertFails(
      setDoc(doc(adminDb, 'products', 'prod-1'), {
        ...buildValidProduct(),
        isVerifiedShadowField: true,
      })
    );
  });

  it('Dirty Payload 6: rejects poisoned document IDs', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertFails(setDoc(doc(adminDb, 'products', 'bad$id!spaces'), buildValidProduct()));
  });

  it('Dirty Payload 7: rejects oversized description or unlisted category', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertFails(
      setDoc(doc(adminDb, 'products', 'prod-1'), {
        ...buildValidProduct(),
        descricao: 'A'.repeat(1200),
      })
    );
  });

  it('Dirty Payload 8: rejects invalid promotional price >= regular price', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertFails(
      setDoc(doc(adminDb, 'products', 'prod-1'), {
        ...buildValidProduct(),
        preco: 30,
        promocao: true,
        precoPromocional: 35,
      })
    );
  });

  it('Dirty Payload 9: rejects tampering with immutable authorId or createdAt on update', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertSucceeds(setDoc(doc(adminDb, 'products', 'prod-1'), buildValidProduct()));
    await assertFails(
      updateDoc(doc(adminDb, 'products', 'prod-1'), {
        createdAt: Timestamp.fromMillis(100000),
        updatedAt: serverTimestamp(),
      })
    );
  });

  it('Dirty Payload 10: rejects forged client timestamp instead of serverTimestamp', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertFails(
      setDoc(doc(adminDb, 'products', 'prod-1'), {
        ...buildValidProduct(),
        createdAt: Timestamp.fromMillis(1700000000000),
      })
    );
  });

  it('Dirty Payload 11: rejects blanket unfiltered public list query without where(publicado == true)', async () => {
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertSucceeds(
      setDoc(doc(adminDb, 'products', 'draft-1'), {
        ...buildValidProduct(),
        publicado: false,
      })
    );

    const publicDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDocs(collection(publicDb, 'products')));
    await assertFails(getDoc(doc(publicDb, 'products', 'draft-1')));
  });

  it('Dirty Payload 12: rejects self-assigned admin escalation and admin collection listing', async () => {
    const attackerDb = testEnv
      .authenticatedContext(ATTACKER_UID, {
        email: 'attacker@example.com',
        email_verified: true,
      })
      .firestore();

    await assertFails(
      setDoc(doc(attackerDb, 'admins', ATTACKER_UID), {
        uid: ATTACKER_UID,
        displayName: 'Attacker',
        grantedBy: ATTACKER_UID,
        createdAt: serverTimestamp(),
      })
    );

    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertFails(getDocs(collection(adminDb, 'admins')));
  });

  it('enforces one-per-UID verified customer reviews, safe getDoc pre-checks, admin moderation, and blocks self-republishing', async () => {
    const customerUid = 'customer_01';
    const customerDb = testEnv
      .authenticatedContext(customerUid, {
        email: 'cliente@example.com',
        email_verified: true,
      })
      .firestore();

    // Safe getDoc pre-check before review exists succeeds with exists() === false
    await assertSucceeds(getDoc(doc(customerDb, 'reviews', customerUid)));

    const validReview = {
      autorNome: 'Carlos Mendes',
      bairro: 'Flexeira',
      nota: 5,
      comentario: 'Entrega super rápida de areia e cimento, atendimento nota dez!',
      publicado: true,
      authorId: customerUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Valid 1-per-UID creation succeeds
    await assertSucceeds(setDoc(doc(customerDb, 'reviews', customerUid), validReview));

    // Customer can edit their own review content
    await assertSucceeds(
      updateDoc(doc(customerDb, 'reviews', customerUid), {
        comentario: 'Entrega rápida no mesmo dia e cimento bem armazenado!',
        updatedAt: serverTimestamp(),
      })
    );

    // Spamming a second review under a different ID fails
    await assertFails(setDoc(doc(customerDb, 'reviews', 'review-2'), validReview));

    // Public query with where(publicado == true) succeeds
    const publicDb = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(
      getDocs(query(collection(publicDb, 'reviews'), where('publicado', '==', true)))
    );

    // Store admin can moderate (hide) review without deleting it
    const adminDb = testEnv
      .authenticatedContext(OWNER_UID, {
        email: OWNER_EMAIL,
        email_verified: true,
      })
      .firestore();
    await assertSucceeds(
      updateDoc(doc(adminDb, 'reviews', customerUid), {
        publicado: false,
        updatedAt: serverTimestamp(),
      })
    );

    // Moderated customer cannot flip publicado back to true
    await assertFails(
      updateDoc(doc(customerDb, 'reviews', customerUid), {
        publicado: true,
        updatedAt: serverTimestamp(),
      })
    );

    // Non-owner cannot delete another customer's review
    const attackerDb = testEnv
      .authenticatedContext(ATTACKER_UID, {
        email: 'attacker@example.com',
        email_verified: true,
      })
      .firestore();
    await assertFails(deleteDoc(doc(attackerDb, 'reviews', customerUid)));

    // Store admin can delete review
    await assertSucceeds(deleteDoc(doc(adminDb, 'reviews', customerUid)));
  });
});
