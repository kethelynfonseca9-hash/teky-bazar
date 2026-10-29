import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// ============================================================================
// 1. INICIALIZAÇÃO DO FIREBASE (Firestore + Google Auth)
// ============================================================================
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const BOOTSTRAPPED_ADMIN_EMAIL = 'kethelyn.fonseca9@gmail.com';

// Constantes de validação sincronizadas exatamente com firebase-blueprint.json e firestore.rules
const PRODUCT_CONSTRAINTS = {
  ID_MAX_LENGTH: 128,
  ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
  CODIGO_MIN_LENGTH: 2,
  CODIGO_MAX_LENGTH: 24,
  CODIGO_PATTERN: /^[A-Za-z0-9_\-]+$/,
  NOME_MIN_LENGTH: 2,
  NOME_MAX_LENGTH: 120,
  CATEGORIAS: [
    'Materiais de Construção',
    'Ferragens',
    'Madeiras',
    'Areia',
    'Pedra',
    'Bazar',
  ] as const,
  UNIDADE_MIN_LENGTH: 1,
  UNIDADE_MAX_LENGTH: 30,
  DESCRICAO_MIN_LENGTH: 4,
  DESCRICAO_MAX_LENGTH: 500,
  IMAGEM_MIN_LENGTH: 4,
  IMAGEM_MAX_LENGTH: 500,
  PRECO_MAX: 1000000,
  ORDEM_MIN: 1,
  ORDEM_MAX: 10000,
};

export interface CatalogItem {
  id: string | number;
  codigo: string;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  descricao: string;
  imagem: string;
  disponivel: boolean;
  promocao: boolean;
  precoPromocional: number | null;
  publicado?: boolean;
  ordem?: number;
  authorId?: string;
}

declare global {
  interface Window {
    TEKY_CATALOGO?: {
      obterProdutosIniciais: () => CatalogItem[];
      aplicarProdutosFirestore: (listaNuvem: CatalogItem[]) => void;
    };
  }
}

// ============================================================================
// 2. TESTE DE CONEXÃO COM FIRESTORE NA INICIALIZAÇÃO
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
// 3. TRATAMENTO PADRONIZADO DE ERROS DO FIRESTORE
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

function verificarErroCota(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes('Quota exceeded')) {
    exibirFeedbackAdmin(
      `Limite diário gratuito do banco de dados atingido. A cota é renovada automaticamente no dia seguinte. Detalhes em https://firebase.google.com/pricing#cloud-firestore`,
      'erro'
    );
    return true;
  }
  return false;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  verificarErroCota(error);
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

// ============================================================================
// 4. ESTADO E VALIDAÇÃO DEFENSIVA DE DADOS
// ============================================================================
let usuarioAtual: User | null = null;
let ehAdminAutorizado = false;
let unsubscribeAdminProdutos: Unsubscribe | null = null;
let produtosAdminCache: (CatalogItem & { id: string; publicado: boolean; ordem: number })[] = [];
let termoBuscaAdmin = '';
let idConfirmandoExclusao: string | null = null;

const formatadorBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function escaparHtmlSeguro(texto: string): string {
  const mapa: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(texto || '').replace(/[&<>"']/g, (c) => mapa[c] || c);
}

function exibirFeedbackAdmin(
  mensagem: string,
  tipo: 'info' | 'erro' | 'sucesso' = 'info'
): void {
  const banner = document.getElementById('admin-feedback');
  if (!banner) return;
  banner.textContent = mensagem;
  banner.className = 'admin-feedback-banner';
  if (tipo === 'erro') banner.classList.add('admin-feedback-erro');
  if (tipo === 'sucesso') banner.classList.add('admin-feedback-sucesso');
  banner.hidden = false;
}

function ocultarFeedbackAdmin(): void {
  const banner = document.getElementById('admin-feedback');
  if (banner) banner.hidden = true;
}

interface ValidatedProductFields {
  codigo: string;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  descricao: string;
  imagem: string;
  disponivel: boolean;
  promocao: boolean;
  precoPromocional: number;
  publicado: boolean;
  ordem: number;
}

function validarCamposProduto(entrada: {
  codigo: string;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  descricao: string;
  imagem: string;
  disponivel: boolean;
  promocao: boolean;
  precoPromocional: number;
  publicado: boolean;
  ordem: number;
}): { ok: true; dados: ValidatedProductFields } | { ok: false; erro: string } {
  const codigo = entrada.codigo.trim().toUpperCase().slice(0, PRODUCT_CONSTRAINTS.CODIGO_MAX_LENGTH);
  if (
    codigo.length < PRODUCT_CONSTRAINTS.CODIGO_MIN_LENGTH ||
    !PRODUCT_CONSTRAINTS.CODIGO_PATTERN.test(codigo)
  ) {
    return {
      ok: false,
      erro: 'Informe um código válido com 2 a 24 letras, números ou hífen (ex.: CIM-001).',
    };
  }

  const nome = entrada.nome.trim().slice(0, PRODUCT_CONSTRAINTS.NOME_MAX_LENGTH);
  if (nome.length < PRODUCT_CONSTRAINTS.NOME_MIN_LENGTH) {
    return { ok: false, erro: 'Informe o nome completo do produto (mínimo 2 caracteres).' };
  }

  const categoria = entrada.categoria.trim();
  if (
    !(PRODUCT_CONSTRAINTS.CATEGORIAS as readonly string[]).includes(categoria)
  ) {
    return { ok: false, erro: 'Selecione uma categoria válida da lista.' };
  }

  const preco = Number(entrada.preco);
  if (!Number.isFinite(preco) || preco <= 0 || preco > PRODUCT_CONSTRAINTS.PRECO_MAX) {
    return { ok: false, erro: 'Informe um preço normal maior que R$ 0,00.' };
  }

  const unidade = entrada.unidade.trim().slice(0, PRODUCT_CONSTRAINTS.UNIDADE_MAX_LENGTH);
  if (unidade.length < PRODUCT_CONSTRAINTS.UNIDADE_MIN_LENGTH) {
    return { ok: false, erro: 'Informe a unidade de venda (ex.: saco 50kg, unidade, m³).' };
  }

  const descricao = entrada.descricao.trim().slice(0, PRODUCT_CONSTRAINTS.DESCRICAO_MAX_LENGTH);
  if (descricao.length < PRODUCT_CONSTRAINTS.DESCRICAO_MIN_LENGTH) {
    return { ok: false, erro: 'Informe uma descrição curta (mínimo 4 caracteres).' };
  }

  const imagem = entrada.imagem.trim().slice(0, PRODUCT_CONSTRAINTS.IMAGEM_MAX_LENGTH);
  if (imagem.length < PRODUCT_CONSTRAINTS.IMAGEM_MIN_LENGTH) {
    return { ok: false, erro: 'Informe o caminho da imagem (ex.: img/cimento-cp2.jpg).' };
  }

  const promocao = Boolean(entrada.promocao);
  const precoPromocionalBruto = Number(entrada.precoPromocional || 0);
  let precoPromocional = 0;

  if (promocao) {
    if (
      !Number.isFinite(precoPromocionalBruto) ||
      precoPromocionalBruto <= 0 ||
      precoPromocionalBruto >= preco
    ) {
      return {
        ok: false,
        erro: 'O preço promocional deve ser maior que zero e menor que o preço normal.',
      };
    }
    precoPromocional = Number(precoPromocionalBruto.toFixed(2));
  }

  const ordemInt = Math.min(
    PRODUCT_CONSTRAINTS.ORDEM_MAX,
    Math.max(PRODUCT_CONSTRAINTS.ORDEM_MIN, Math.round(Number(entrada.ordem) || 1))
  );

  return {
    ok: true,
    dados: {
      codigo,
      nome,
      categoria,
      preco: Number(preco.toFixed(2)),
      unidade,
      descricao,
      imagem,
      disponivel: Boolean(entrada.disponivel),
      promocao,
      precoPromocional,
      publicado: Boolean(entrada.publicado),
      ordem: ordemInt,
    },
  };
}

// ============================================================================
// 5. SINCRONIZAÇÃO EM TEMPO REAL DO CATÁLOGO PÚBLICO
// ============================================================================
function iniciarEscutaCatalogoPublico(): void {
  const consultaPublica = query(
    collection(db, 'products'),
    where('publicado', '==', true)
  );

  onSnapshot(
    consultaPublica,
    (snapshot) => {
      const lista = snapshot.docs
        .map((docSnap) => {
          const d = docSnap.data();
          const emPromo = Boolean(d.promocao) && Number(d.precoPromocional) > 0;
          return {
            id: docSnap.id,
            codigo: String(d.codigo || ''),
            nome: String(d.nome || ''),
            categoria: String(d.categoria || 'Materiais de Construção'),
            preco: Number(d.preco) || 0,
            unidade: String(d.unidade || 'unidade'),
            descricao: String(d.descricao || ''),
            imagem: String(d.imagem || ''),
            disponivel: Boolean(d.disponivel),
            promocao: emPromo,
            precoPromocional: emPromo ? Number(d.precoPromocional) : null,
            ordem: Number(d.ordem) || 9999,
          } satisfies CatalogItem;
        })
        .sort((a, b) => (a.ordem || 9999) - (b.ordem || 9999));

      if (window.TEKY_CATALOGO) {
        window.TEKY_CATALOGO.aplicarProdutosFirestore(lista);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  );
}

// ============================================================================
// 6. ESCUTA E OPERAÇÕES DO PAINEL ADMINISTRATIVO
// ============================================================================
async function verificarPermissaoAdmin(user: User): Promise<boolean> {
  if (!user.emailVerified) return false;
  if (user.email === BOOTSTRAPPED_ADMIN_EMAIL) return true;

  const adminPath = `admins/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    return snap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, adminPath);
  }
}

function iniciarEscutaAdmin(user: User): void {
  if (unsubscribeAdminProdutos) {
    unsubscribeAdminProdutos();
    unsubscribeAdminProdutos = null;
  }

  const referencia =
    user.email === BOOTSTRAPPED_ADMIN_EMAIL
      ? collection(db, 'products')
      : query(collection(db, 'products'), where('authorId', '==', user.uid));

  unsubscribeAdminProdutos = onSnapshot(
    referencia,
    (snapshot) => {
      produtosAdminCache = snapshot.docs
        .map((docSnap) => {
          const d = docSnap.data();
          const emPromo = Boolean(d.promocao) && Number(d.precoPromocional) > 0;
          return {
            id: docSnap.id,
            codigo: String(d.codigo || ''),
            nome: String(d.nome || ''),
            categoria: String(d.categoria || 'Materiais de Construção'),
            preco: Number(d.preco) || 0,
            unidade: String(d.unidade || 'unidade'),
            descricao: String(d.descricao || ''),
            imagem: String(d.imagem || ''),
            disponivel: Boolean(d.disponivel),
            promocao: emPromo,
            precoPromocional: emPromo ? Number(d.precoPromocional) : null,
            publicado: Boolean(d.publicado),
            ordem: Number(d.ordem) || 9999,
            authorId: String(d.authorId || ''),
          };
        })
        .sort((a, b) => a.ordem - b.ordem);

      const bannerSeed = document.getElementById('admin-seed-banner');
      if (bannerSeed) {
        bannerSeed.hidden = produtosAdminCache.length > 0;
      }

      renderizarListaAdmin();
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  );
}

function renderizarListaAdmin(): void {
  const container = document.getElementById('admin-lista-produtos');
  const contador = document.getElementById('admin-contador-produtos');
  if (!container) return;

  const filtro = termoBuscaAdmin.trim().toLowerCase();
  const filtrados = produtosAdminCache.filter((item) => {
    if (!filtro) return true;
    return (
      item.nome.toLowerCase().includes(filtro) ||
      item.codigo.toLowerCase().includes(filtro) ||
      item.categoria.toLowerCase().includes(filtro)
    );
  });

  if (contador) {
    contador.textContent =
      produtosAdminCache.length === 1
        ? '1 item salvo na nuvem'
        : `${produtosAdminCache.length} itens salvos na nuvem`;
  }

  if (filtrados.length === 0) {
    container.innerHTML = `
      <p class="admin-helper-text">
        ${
          produtosAdminCache.length === 0
            ? 'Nenhum produto salvo na nuvem ainda. Use o botão acima para publicar os 30 produtos iniciais ou cadastre um novo item ao lado.'
            : 'Nenhum produto corresponde à busca.'
        }
      </p>
    `;
    return;
  }

  container.innerHTML = filtrados
    .map((item) => {
      const precoExibido =
        item.promocao && typeof item.precoPromocional === 'number'
          ? `${formatadorBRL.format(item.precoPromocional)} (Promo · era ${formatadorBRL.format(item.preco)})`
          : formatadorBRL.format(item.preco);

      const statusEstoque = item.disponivel ? 'Disponível' : 'Indisponível';
      const statusVisibilidade = item.publicado ? '' : ' · Oculto';
      const confirmando = idConfirmandoExclusao === item.id;

      return `
        <div class="admin-item-row" data-admin-id="${escaparHtmlSeguro(item.id)}">
          <div class="admin-item-info">
            <p class="admin-item-title">${escaparHtmlSeguro(item.nome)}</p>
            <p class="admin-item-meta tabular-nums">
              Cód. ${escaparHtmlSeguro(item.codigo)} · ${escaparHtmlSeguro(precoExibido)} / ${escaparHtmlSeguro(item.unidade)} · ${statusEstoque}${statusVisibilidade}
            </p>
          </div>

          <div class="admin-item-actions">
            <button
              type="button"
              data-admin-acao="toggle-estoque"
              data-id="${escaparHtmlSeguro(item.id)}"
              class="btn-outline-sm focus-ring"
            >
              ${item.disponivel ? 'Marcar indisponível' : 'Marcar disponível'}
            </button>

            <button
              type="button"
              data-admin-acao="editar"
              data-id="${escaparHtmlSeguro(item.id)}"
              class="btn-outline-sm focus-ring"
            >
              Editar
            </button>

            <button
              type="button"
              data-admin-acao="excluir"
              data-id="${escaparHtmlSeguro(item.id)}"
              class="btn-danger-sm focus-ring"
            >
              ${confirmando ? 'Confirmar exclusão?' : 'Excluir'}
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

async function sincronizarCatalogoInicial(): Promise<void> {
  if (!usuarioAtual || !ehAdminAutorizado || !window.TEKY_CATALOGO) return;

  const btn = document.getElementById('btn-sincronizar-iniciais') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;
  ocultarFeedbackAdmin();

  const iniciais = window.TEKY_CATALOGO.obterProdutosIniciais();
  const batch = writeBatch(db);

  iniciais.forEach((item, idx) => {
    const docId = `prod-${String(idx + 1).padStart(3, '0')}`;
    const promoValida =
      Boolean(item.promocao) &&
      typeof item.precoPromocional === 'number' &&
      item.precoPromocional > 0 &&
      item.precoPromocional < item.preco;

    const validado = validarCamposProduto({
      codigo: String(item.codigo),
      nome: String(item.nome),
      categoria: String(item.categoria),
      preco: Number(item.preco),
      unidade: String(item.unidade),
      descricao: String(item.descricao),
      imagem: String(item.imagem),
      disponivel: Boolean(item.disponivel),
      promocao: promoValida,
      precoPromocional: promoValida ? Number(item.precoPromocional) : 0,
      publicado: true,
      ordem: idx + 1,
    });

    if (validado.ok && usuarioAtual) {
      batch.set(doc(db, 'products', docId), {
        ...validado.dados,
        authorId: usuarioAtual.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  });

  try {
    await batch.commit();
    exibirFeedbackAdmin(
      'Catálogo inicial publicado na nuvem com sucesso! Qualquer alteração feita aqui atualizará o site em tempo real.',
      'sucesso'
    );
  } catch (error) {
    if (btn) btn.disabled = false;
    handleFirestoreError(error, OperationType.WRITE, 'products');
  }
}

function preencherFormularioParaEdicao(idProduto: string): void {
  const item = produtosAdminCache.find((p) => p.id === idProduto);
  if (!item) return;

  (document.getElementById('admin-produto-id') as HTMLInputElement).value = item.id;
  (document.getElementById('admin-produto-ordem') as HTMLInputElement).value = String(item.ordem);
  (document.getElementById('admin-codigo') as HTMLInputElement).value = item.codigo;
  (document.getElementById('admin-categoria') as HTMLSelectElement).value = item.categoria;
  (document.getElementById('admin-nome') as HTMLInputElement).value = item.nome;
  (document.getElementById('admin-preco') as HTMLInputElement).value = String(item.preco);
  (document.getElementById('admin-unidade') as HTMLInputElement).value = item.unidade;

  const chkPromo = document.getElementById('admin-promocao') as HTMLInputElement;
  const boxPromo = document.getElementById('admin-campo-preco-promo');
  const inpPromo = document.getElementById('admin-preco-promocional') as HTMLInputElement;
  chkPromo.checked = item.promocao;
  if (boxPromo) boxPromo.hidden = !item.promocao;
  inpPromo.value = item.promocao && item.precoPromocional ? String(item.precoPromocional) : '';

  (document.getElementById('admin-imagem') as HTMLInputElement).value = item.imagem;
  (document.getElementById('admin-descricao') as HTMLTextAreaElement).value = item.descricao;
  (document.getElementById('admin-disponivel') as HTMLInputElement).checked = item.disponivel;
  (document.getElementById('admin-publicado') as HTMLInputElement).checked = item.publicado;

  const titulo = document.getElementById('titulo-form-admin');
  if (titulo) titulo.textContent = `Editar produto · ${item.codigo}`;

  const btnCancelar = document.getElementById('btn-cancelar-edicao');
  if (btnCancelar) btnCancelar.hidden = false;

  document.getElementById('form-admin-produto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function limparFormularioAdmin(): void {
  const form = document.getElementById('form-admin-produto') as HTMLFormElement | null;
  if (form) form.reset();

  (document.getElementById('admin-produto-id') as HTMLInputElement).value = '';
  (document.getElementById('admin-produto-ordem') as HTMLInputElement).value = '';
  (document.getElementById('admin-disponivel') as HTMLInputElement).checked = true;
  (document.getElementById('admin-publicado') as HTMLInputElement).checked = true;

  const boxPromo = document.getElementById('admin-campo-preco-promo');
  if (boxPromo) boxPromo.hidden = true;

  const titulo = document.getElementById('titulo-form-admin');
  if (titulo) titulo.textContent = 'Cadastrar novo produto';

  const btnCancelar = document.getElementById('btn-cancelar-edicao');
  if (btnCancelar) btnCancelar.hidden = true;
}

async function salvarFormularioProduto(evento: Event): Promise<void> {
  evento.preventDefault();
  if (!usuarioAtual || !ehAdminAutorizado) return;
  ocultarFeedbackAdmin();

  const idExistente = (document.getElementById('admin-produto-id') as HTMLInputElement).value.trim();
  const ordemExistente = Number(
    (document.getElementById('admin-produto-ordem') as HTMLInputElement).value
  );
  const proximaOrdem =
    ordemExistente > 0 ? ordemExistente : produtosAdminCache.length + 1;

  const resultado = validarCamposProduto({
    codigo: (document.getElementById('admin-codigo') as HTMLInputElement).value,
    categoria: (document.getElementById('admin-categoria') as HTMLSelectElement).value,
    nome: (document.getElementById('admin-nome') as HTMLInputElement).value,
    preco: Number((document.getElementById('admin-preco') as HTMLInputElement).value),
    unidade: (document.getElementById('admin-unidade') as HTMLInputElement).value,
    promocao: (document.getElementById('admin-promocao') as HTMLInputElement).checked,
    precoPromocional: Number(
      (document.getElementById('admin-preco-promocional') as HTMLInputElement).value || 0
    ),
    imagem: (document.getElementById('admin-imagem') as HTMLInputElement).value,
    descricao: (document.getElementById('admin-descricao') as HTMLTextAreaElement).value,
    disponivel: (document.getElementById('admin-disponivel') as HTMLInputElement).checked,
    publicado: (document.getElementById('admin-publicado') as HTMLInputElement).checked,
    ordem: proximaOrdem,
  });

  if (!resultado.ok) {
    exibirFeedbackAdmin(resultado.erro, 'erro');
    return;
  }

  const btnSalvar = document.getElementById('btn-salvar-produto') as HTMLButtonElement | null;
  if (btnSalvar) btnSalvar.disabled = true;

  if (idExistente && PRODUCT_CONSTRAINTS.ID_PATTERN.test(idExistente)) {
    const caminho = `products/${idExistente}`;
    try {
      await updateDoc(doc(db, 'products', idExistente), {
        ...resultado.dados,
        updatedAt: serverTimestamp(),
      });
      limparFormularioAdmin();
      exibirFeedbackAdmin('Produto atualizado com sucesso!', 'sucesso');
    } catch (error) {
      exibirFeedbackAdmin('Não foi possível salvar a alteração do produto.', 'erro');
      handleFirestoreError(error, OperationType.UPDATE, caminho);
    } finally {
      if (btnSalvar) btnSalvar.disabled = false;
    }
  } else {
    const novoId = `prod-${Date.now()}`.slice(0, PRODUCT_CONSTRAINTS.ID_MAX_LENGTH);
    const caminho = `products/${novoId}`;
    try {
      await setDoc(doc(db, 'products', novoId), {
        ...resultado.dados,
        authorId: usuarioAtual.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      limparFormularioAdmin();
      exibirFeedbackAdmin('Novo produto adicionado ao catálogo!', 'sucesso');
    } catch (error) {
      exibirFeedbackAdmin('Não foi possível cadastrar o novo produto.', 'erro');
      handleFirestoreError(error, OperationType.CREATE, caminho);
    } finally {
      if (btnSalvar) btnSalvar.disabled = false;
    }
  }
}

async function alternarDisponibilidadeRapida(idProduto: string): Promise<void> {
  const item = produtosAdminCache.find((p) => p.id === idProduto);
  if (!item) return;

  const caminho = `products/${idProduto}`;
  try {
    await updateDoc(doc(db, 'products', idProduto), {
      disponivel: !item.disponivel,
      publicado: item.publicado,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    exibirFeedbackAdmin('Erro ao atualizar disponibilidade do produto.', 'erro');
    handleFirestoreError(error, OperationType.UPDATE, caminho);
  }
}

async function excluirProdutoAdmin(idProduto: string): Promise<void> {
  if (idConfirmandoExclusao !== idProduto) {
    idConfirmandoExclusao = idProduto;
    renderizarListaAdmin();
    return;
  }

  idConfirmandoExclusao = null;
  const caminho = `products/${idProduto}`;
  try {
    await deleteDoc(doc(db, 'products', idProduto));
    exibirFeedbackAdmin('Produto removido da nuvem.', 'info');
  } catch (error) {
    exibirFeedbackAdmin('Erro ao excluir o produto.', 'erro');
    handleFirestoreError(error, OperationType.DELETE, caminho);
  }
}

// ============================================================================
// 7. AUTENTICAÇÃO GOOGLE E EVENTOS DA INTERFACE
// ============================================================================
function atualizarInterfaceAuth(user: User | null, autorizado: boolean): void {
  const loginBox = document.getElementById('admin-login-box');
  const negadoBox = document.getElementById('admin-negado-box');
  const conteudoBox = document.getElementById('admin-conteudo');
  const emailConectado = document.getElementById('admin-usuario-email');
  const emailNegado = document.getElementById('admin-negado-email');

  if (!user) {
    if (loginBox) loginBox.hidden = false;
    if (negadoBox) negadoBox.hidden = true;
    if (conteudoBox) conteudoBox.hidden = true;
    return;
  }

  if (!autorizado) {
    if (loginBox) loginBox.hidden = true;
    if (negadoBox) negadoBox.hidden = false;
    if (conteudoBox) conteudoBox.hidden = true;
    if (emailNegado) emailNegado.textContent = user.email || user.uid;
    return;
  }

  if (loginBox) loginBox.hidden = true;
  if (negadoBox) negadoBox.hidden = true;
  if (conteudoBox) conteudoBox.hidden = false;
  if (emailConectado) emailConectado.textContent = user.email || user.displayName || 'Administrador';
}

function registrarEventosAdmin(): void {
  const btnLogin = document.getElementById('btn-admin-google-login');
  const btnLogout = document.getElementById('btn-admin-logout');
  const btnLogoutNegado = document.getElementById('btn-admin-sair-negado');
  const btnSeed = document.getElementById('btn-sincronizar-iniciais');
  const chkPromo = document.getElementById('admin-promocao') as HTMLInputElement | null;
  const boxPromo = document.getElementById('admin-campo-preco-promo');
  const formProduto = document.getElementById('form-admin-produto');
  const btnCancelar = document.getElementById('btn-cancelar-edicao');
  const inputBuscaAdmin = document.getElementById('admin-busca-produtos') as HTMLInputElement | null;
  const listaContainer = document.getElementById('admin-lista-produtos');

  const fazerLoginGoogle = async () => {
    ocultarFeedbackAdmin();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      if (!msg.includes('popup-closed-by-user')) {
        exibirFeedbackAdmin('Não foi possível concluir o login com Google. Tente novamente.', 'erro');
      }
    }
  };

  const encerrarSessao = async () => {
    ocultarFeedbackAdmin();
    await signOut(auth);
  };

  btnLogin?.addEventListener('click', () => void fazerLoginGoogle());
  btnLogout?.addEventListener('click', () => void encerrarSessao());
  btnLogoutNegado?.addEventListener('click', () => void encerrarSessao());
  btnSeed?.addEventListener('click', () => void sincronizarCatalogoInicial());

  chkPromo?.addEventListener('change', () => {
    if (boxPromo) boxPromo.hidden = !chkPromo.checked;
  });

  formProduto?.addEventListener('submit', (e) => void salvarFormularioProduto(e));
  btnCancelar?.addEventListener('click', () => limparFormularioAdmin());

  inputBuscaAdmin?.addEventListener('input', () => {
    termoBuscaAdmin = inputBuscaAdmin.value;
    renderizarListaAdmin();
  });

  listaContainer?.addEventListener('click', (e) => {
    const alvo = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-admin-acao]');
    if (!alvo) return;
    const acao = alvo.getAttribute('data-admin-acao');
    const id = alvo.getAttribute('data-id');
    if (!id) return;

    if (acao !== 'excluir') {
      idConfirmandoExclusao = null;
    }

    if (acao === 'toggle-estoque') {
      void alternarDisponibilidadeRapida(id);
    } else if (acao === 'editar') {
      preencherFormularioParaEdicao(id);
    } else if (acao === 'excluir') {
      void excluirProdutoAdmin(id);
    }
  });

  onAuthStateChanged(auth, async (user) => {
    usuarioAtual = user;
    if (!user) {
      ehAdminAutorizado = false;
      if (unsubscribeAdminProdutos) {
        unsubscribeAdminProdutos();
        unsubscribeAdminProdutos = null;
      }
      atualizarInterfaceAuth(null, false);
      return;
    }

    ehAdminAutorizado = await verificarPermissaoAdmin(user);
    atualizarInterfaceAuth(user, ehAdminAutorizado);

    if (ehAdminAutorizado) {
      iniciarEscutaAdmin(user);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    iniciarEscutaCatalogoPublico();
    registrarEventosAdmin();
  });
} else {
  iniciarEscutaCatalogoPublico();
  registrarEventosAdmin();
}
