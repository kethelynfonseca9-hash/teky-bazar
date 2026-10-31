import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// ============================================================================
// 1. INICIALIZAÇÃO CENTRAL DO FIREBASE (firebase-applet-config.json)
// ============================================================================
export { firebaseConfig };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export function createGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

// ============================================================================
// 2. VALIDAÇÃO DE CONEXÃO COM O FIRESTORE NA INICIALIZAÇÃO
// ============================================================================
async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

// ============================================================================
// 3. DIAGNÓSTICO PADRONIZADO DE ERROS E COTA DO FIRESTORE
// ============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function formatQuotaErrorMessage(error: unknown): string | null {
  const msg = error instanceof Error ? error.message : String(error);
  if (
    msg.includes("Quota exceeded for quota metric 'Free daily read units per project (free tier database)'")
  ) {
    const upgradeUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data?openUpgradeDialog=true`;
    return `Limite diário gratuito de leituras atingido. A cota será renovada amanhã ou você pode ampliar o plano em: ${upgradeUrl}`;
  }
  if (msg.includes('Quota exceeded')) {
    return 'Limite diário gratuito do banco de dados atingido. A cota é renovada automaticamente no dia seguinte (consulte o plano Spark em https://firebase.google.com/pricing#cloud-firestore).';
  }
  return null;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
