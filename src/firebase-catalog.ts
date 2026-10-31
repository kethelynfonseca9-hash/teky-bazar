import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  createGoogleProvider,
  db,
  FirestoreErrorInfo,
  formatQuotaErrorMessage,
  handleFirestoreError,
  OperationType,
} from './firebase';

export { auth, db, handleFirestoreError, OperationType };
export type { FirestoreErrorInfo };

const BOOTSTRAPPED_ADMIN_EMAIL = 'kethelyn.fonseca9@gmail.com';
const CHAVE_SEED_INICIAL = 'teky_seed_inicial_concluido';

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

const REVIEW_CONSTRAINTS = {
  ID_MAX_LENGTH: 128,
  ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
  AUTOR_MIN_LENGTH: 2,
  AUTOR_MAX_LENGTH: 60,
  BAIRRO_MIN_LENGTH: 2,
  BAIRRO_MAX_LENGTH: 60,
  NOTA_MIN: 1,
  NOTA_MAX: 5,
  COMENTARIO_MIN_LENGTH: 6,
  COMENTARIO_MAX_LENGTH: 400,
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

export interface CustomerReviewItem {
  id: string;
  autorNome: string;
  bairro: string;
  nota: number;
  comentario: string;
  publicado: boolean;
  authorId: string;
  dataMs: number;
}

declare global {
  interface Window {
    TEKY_CATALOGO?: {
      obterProdutosIniciais: () => CatalogItem[];
      aplicarProdutosFirestore: (
        listaNuvem: CatalogItem[],
        usarListaVaziaNuvem?: boolean
      ) => void;
    };
  }
}

// ============================================================================
// 1. ESTADO E VALIDAÇÃO DEFENSIVA DE DADOS
// ============================================================================
let usuarioAtual: User | null = null;
let ehAdminAutorizado = false;
let unsubscribeAdminProdutos: Unsubscribe | null = null;
let unsubscribeAdminAvaliacoes: Unsubscribe | null = null;
let produtosPublicosCache: CatalogItem[] = [];
let produtosAdminCache: (CatalogItem & { id: string; publicado: boolean; ordem: number })[] = [];
let avaliacoesPublicasCache: CustomerReviewItem[] = [];
let avaliacoesAdminCache: CustomerReviewItem[] = [];
let minhaAvaliacaoCache: CustomerReviewItem | null = null;
let semeandoAutomaticamente = false;
let termoBuscaAdmin = '';
let idConfirmandoExclusao: string | null = null;
let idConfirmandoExclusaoAvaliacao: string | null = null;
let idConfirmandoExclusaoPropriaAvaliacao: string | null = null;
let urlDownloadWebpAtual: string | null = null;

const formatadorBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatadorDataCurta = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
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

function exibirFeedbackAvaliacao(
  mensagem: string,
  tipo: 'info' | 'erro' | 'sucesso' = 'info'
): void {
  const banner = document.getElementById('avaliacao-feedback');
  if (!banner) return;
  banner.textContent = mensagem;
  banner.className = 'admin-feedback-banner';
  if (tipo === 'erro') banner.classList.add('admin-feedback-erro');
  if (tipo === 'sucesso') banner.classList.add('admin-feedback-sucesso');
  banner.hidden = false;
}

function ocultarFeedbackAvaliacao(): void {
  const banner = document.getElementById('avaliacao-feedback');
  if (banner) banner.hidden = true;
}

function reportarErroFirestore(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  contexto: 'admin' | 'avaliacao' = 'admin'
): never {
  const msgCota = formatQuotaErrorMessage(error);
  if (msgCota) {
    if (contexto === 'avaliacao') {
      exibirFeedbackAvaliacao(msgCota, 'erro');
    } else {
      exibirFeedbackAdmin(msgCota, 'erro');
    }
  }
  return handleFirestoreError(error, operationType, path);
}

function marcarSeedInicialConcluido(): void {
  try {
    localStorage.setItem(CHAVE_SEED_INICIAL, '1');
  } catch (_) {
    // Ignora bloqueio de armazenamento privado
  }
}

function seedInicialJaConcluido(): boolean {
  try {
    return localStorage.getItem(CHAVE_SEED_INICIAL) === '1';
  } catch (_) {
    return false;
  }
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
  if (!(PRODUCT_CONSTRAINTS.CATEGORIAS as readonly string[]).includes(categoria)) {
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
    return { ok: false, erro: 'Informe o caminho da imagem (ex.: img/cimento-cp2.webp).' };
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
// 2. SINCRONIZAÇÃO EM TEMPO REAL DO CATÁLOGO PÚBLICO (FIRESTORE -> UI)
// ============================================================================
function sincronizarCatalogoNaVitrine(): void {
  if (!window.TEKY_CATALOGO) return;
  const todosOcultosPeloAdmin =
    ehAdminAutorizado && produtosAdminCache.length > 0 && produtosPublicosCache.length === 0;
  window.TEKY_CATALOGO.aplicarProdutosFirestore(
    produtosPublicosCache,
    todosOcultosPeloAdmin
  );
}

function iniciarEscutaCatalogoPublico(): void {
  const consultaPublica = query(
    collection(db, 'products'),
    where('publicado', '==', true)
  );

  onSnapshot(
    consultaPublica,
    (snapshot) => {
      produtosPublicosCache = snapshot.docs
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

      if (produtosPublicosCache.length > 0) {
        marcarSeedInicialConcluido();
      }
      sincronizarCatalogoNaVitrine();
    },
    (error) => {
      reportarErroFirestore(error, OperationType.LIST, 'products', 'admin');
    }
  );
}

// ============================================================================
// 3. AVALIAÇÕES DE CLIENTES VERIFICADOS (LEITURA EM TEMPO REAL + ENVIO + EDIÇÃO)
// ============================================================================
function extrairDataMillis(valor: unknown): number {
  if (
    valor &&
    typeof valor === 'object' &&
    'toMillis' in valor &&
    typeof (valor as { toMillis: () => number }).toMillis === 'function'
  ) {
    return (valor as { toMillis: () => number }).toMillis();
  }
  return 0;
}

function mapearDocumentoAvaliacao(id: string, d: Record<string, unknown>): CustomerReviewItem {
  const dataMs = extrairDataMillis(d.updatedAt) || extrairDataMillis(d.createdAt) || 0;
  return {
    id,
    autorNome: String(d.autorNome || 'Cliente'),
    bairro: String(d.bairro || 'São Pedro da Aldeia'),
    nota: Math.min(5, Math.max(1, Math.round(Number(d.nota) || 5))),
    comentario: String(d.comentario || ''),
    publicado: Boolean(d.publicado),
    authorId: String(d.authorId || id),
    dataMs,
  };
}

function validarCamposAvaliacao(entrada: {
  autorNome: string;
  bairro: string;
  nota: number;
  comentario: string;
}):
  | {
      ok: true;
      dados: { autorNome: string; bairro: string; nota: number; comentario: string };
    }
  | { ok: false; erro: string } {
  const autorNome = entrada.autorNome.trim().slice(0, REVIEW_CONSTRAINTS.AUTOR_MAX_LENGTH);
  if (autorNome.length < REVIEW_CONSTRAINTS.AUTOR_MIN_LENGTH) {
    return { ok: false, erro: 'Informe seu nome (mínimo 2 caracteres).' };
  }

  const bairro = entrada.bairro.trim().slice(0, REVIEW_CONSTRAINTS.BAIRRO_MAX_LENGTH);
  if (bairro.length < REVIEW_CONSTRAINTS.BAIRRO_MIN_LENGTH) {
    return {
      ok: false,
      erro: 'Informe seu bairro em São Pedro da Aldeia ou região (mínimo 2 caracteres).',
    };
  }

  const nota = Math.round(Number(entrada.nota));
  if (
    !Number.isInteger(nota) ||
    nota < REVIEW_CONSTRAINTS.NOTA_MIN ||
    nota > REVIEW_CONSTRAINTS.NOTA_MAX
  ) {
    return { ok: false, erro: 'Selecione uma nota de 1 a 5 estrelas.' };
  }

  const comentario = entrada.comentario.trim().slice(0, REVIEW_CONSTRAINTS.COMENTARIO_MAX_LENGTH);
  if (comentario.length < REVIEW_CONSTRAINTS.COMENTARIO_MIN_LENGTH) {
    return {
      ok: false,
      erro: 'Escreva um breve comentário sobre sua experiência (mínimo 6 caracteres).',
    };
  }

  return {
    ok: true,
    dados: {
      autorNome,
      bairro,
      nota,
      comentario,
    },
  };
}

function selecionarNotaEstrela(nota: number): void {
  const notaValida = Math.min(5, Math.max(1, Math.round(nota) || 5));
  const inputNota = document.getElementById('avaliacao-nota') as HTMLInputElement | null;
  const legenda = document.getElementById('legenda-estrela-selecionada');
  if (inputNota) inputNota.value = String(notaValida);
  if (legenda) {
    legenda.textContent = `${notaValida} de 5 ${notaValida === 1 ? 'estrela' : 'estrelas'}`;
  }

  document
    .querySelectorAll<HTMLButtonElement>('#seletor-estrelas-avaliacao [data-estrela]')
    .forEach((btn) => {
      const valorBtn = Number(btn.getAttribute('data-estrela'));
      const ativo = valorBtn <= notaValida;
      const selecionadoExato = valorBtn === notaValida;
      btn.classList.toggle('is-active', ativo);
      btn.setAttribute('aria-checked', selecionadoExato ? 'true' : 'false');
    });
}

async function carregarAvaliacaoPropriaDoUsuario(user: User | null): Promise<void> {
  if (!user || !user.emailVerified) {
    minhaAvaliacaoCache = null;
    sincronizarFormularioComAvaliacaoDoUsuario();
    return;
  }

  if (
    user.uid.length > REVIEW_CONSTRAINTS.ID_MAX_LENGTH ||
    !REVIEW_CONSTRAINTS.ID_PATTERN.test(user.uid)
  ) {
    minhaAvaliacaoCache = null;
    return;
  }

  const caminho = `reviews/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'reviews', user.uid));
    if (snap.exists()) {
      minhaAvaliacaoCache = mapearDocumentoAvaliacao(
        snap.id,
        snap.data() as Record<string, unknown>
      );
    } else {
      minhaAvaliacaoCache = null;
    }
    sincronizarFormularioComAvaliacaoDoUsuario();
  } catch (error) {
    reportarErroFirestore(error, OperationType.GET, caminho, 'avaliacao');
  }
}

function obterAvaliacaoAtualDoUsuario(): CustomerReviewItem | null {
  if (!usuarioAtual) return null;
  const publica = avaliacoesPublicasCache.find(
    (item) => item.authorId === usuarioAtual?.uid
  );
  if (publica) return publica;
  if (minhaAvaliacaoCache && minhaAvaliacaoCache.authorId === usuarioAtual.uid) {
    return minhaAvaliacaoCache;
  }
  return null;
}

function sincronizarFormularioComAvaliacaoDoUsuario(forcarPreenchimento = false): void {
  const btnEnviar = document.getElementById('btn-enviar-avaliacao');
  const btnAbrir = document.getElementById('btn-abrir-form-avaliacao');
  const inpNome = document.getElementById('avaliacao-nome') as HTMLInputElement | null;
  const inpBairro = document.getElementById('avaliacao-bairro') as HTMLInputElement | null;
  const inpComentario = document.getElementById(
    'avaliacao-comentario'
  ) as HTMLTextAreaElement | null;

  if (!usuarioAtual) {
    if (btnEnviar) btnEnviar.textContent = 'Entrar com Google e publicar avaliação';
    if (btnAbrir) {
      const span = btnAbrir.querySelector('span');
      if (span) span.textContent = 'Deixar avaliação';
    }
    return;
  }

  const minhaAvaliacao = obterAvaliacaoAtualDoUsuario();

  if (minhaAvaliacao) {
    if (btnEnviar) btnEnviar.textContent = 'Atualizar minha avaliação';
    if (btnAbrir) {
      const span = btnAbrir.querySelector('span');
      if (span) span.textContent = 'Editar minha avaliação';
    }
    if (inpNome && (forcarPreenchimento || !inpNome.value)) {
      inpNome.value = minhaAvaliacao.autorNome;
    }
    if (inpBairro && (forcarPreenchimento || !inpBairro.value)) {
      inpBairro.value = minhaAvaliacao.bairro;
    }
    if (inpComentario && (forcarPreenchimento || !inpComentario.value)) {
      inpComentario.value = minhaAvaliacao.comentario;
    }
    selecionarNotaEstrela(minhaAvaliacao.nota);
  } else {
    if (btnEnviar) btnEnviar.textContent = 'Publicar avaliação verificada';
    if (btnAbrir) {
      const span = btnAbrir.querySelector('span');
      if (span) span.textContent = 'Deixar avaliação';
    }
    if (inpNome && !inpNome.value && usuarioAtual.displayName) {
      inpNome.value = usuarioAtual.displayName.slice(0, REVIEW_CONSTRAINTS.AUTOR_MAX_LENGTH);
    }
  }
}

function alternarPainelAvaliacao(abrir?: boolean, forcarPreenchimento = false): void {
  const form = document.getElementById('painel-form-avaliacao');
  const btnAbrir = document.getElementById('btn-abrir-form-avaliacao');
  if (!form) return;

  const proximoEstado = typeof abrir === 'boolean' ? abrir : form.hidden;
  form.hidden = !proximoEstado;
  btnAbrir?.setAttribute('aria-expanded', proximoEstado ? 'true' : 'false');

  if (proximoEstado) {
    ocultarFeedbackAvaliacao();
    sincronizarFormularioComAvaliacaoDoUsuario(forcarPreenchimento);
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderizarAvaliacoesPublicas(): void {
  const grade = document.getElementById('grade-avaliacoes-clientes');
  const estadoVazio = document.getElementById('estado-vazio-avaliacoes');
  const resumo = document.getElementById('resumo-avaliacoes-loja');
  if (!grade || !estadoVazio) return;

  const total = avaliacoesPublicasCache.length;
  if (total === 0) {
    grade.hidden = true;
    grade.innerHTML = '';
    estadoVazio.hidden = false;
    if (resumo) {
      resumo.textContent =
        'Depoimentos reais verificados de clientes da loja e link direto para o Google Maps';
    }
    return;
  }

  const soma = avaliacoesPublicasCache.reduce((acc, item) => acc + item.nota, 0);
  const mediaFormatada = (soma / total).toFixed(1).replace('.', ',');

  if (resumo) {
    resumo.textContent =
      total === 1
        ? `★ ${mediaFormatada} de 5 · 1 avaliação verificada de cliente`
        : `★ ${mediaFormatada} de 5 · Baseado em ${total} avaliações verificadas de clientes`;
  }

  estadoVazio.hidden = true;
  grade.hidden = false;

  grade.innerHTML = avaliacoesPublicasCache
    .map((item) => {
      const estrelasCheias = '★'.repeat(Math.min(5, Math.max(1, item.nota)));
      const estrelasVazias = '☆'.repeat(Math.max(0, 5 - item.nota));
      const textoData = item.dataMs > 0 ? formatadorDataCurta.format(new Date(item.dataMs)) : '';
      const ehAutor = Boolean(usuarioAtual && usuarioAtual.uid === item.authorId);
      const confirmandoPropria = idConfirmandoExclusaoPropriaAvaliacao === item.id;

      return `
        <article class="review-card">
          <div>
            <div class="review-stars" aria-label="Nota ${item.nota} de 5 estrelas">
              ${estrelasCheias}${estrelasVazias}
            </div>
            <p class="review-comment">${escaparHtmlSeguro(item.comentario)}</p>
          </div>

          <div class="review-author-line">
            <span class="review-author-name">${escaparHtmlSeguro(item.autorNome)}</span>
            <span aria-hidden="true">·</span>
            <span>${escaparHtmlSeguro(item.bairro)}</span>
            ${
              textoData
                ? `<span aria-hidden="true">·</span><span class="tabular-nums">${escaparHtmlSeguro(textoData)}</span>`
                : ''
            }
            ${
              ehAutor
                ? `<span aria-hidden="true">·</span>
                   <button type="button" data-avaliacao-publica-acao="editar" class="link-reset focus-ring">Editar</button>
                   <button type="button" data-avaliacao-publica-acao="excluir" data-id="${escaparHtmlSeguro(item.id)}" class="bag-remove-btn focus-ring">${confirmandoPropria ? 'Confirmar exclusão?' : 'Excluir'}</button>`
                : ''
            }
          </div>
        </article>
      `;
    })
    .join('');
}

function iniciarEscutaAvaliacoesPublicas(): void {
  const consultaAvaliacoes = query(
    collection(db, 'reviews'),
    where('publicado', '==', true)
  );

  onSnapshot(
    consultaAvaliacoes,
    (snapshot) => {
      avaliacoesPublicasCache = snapshot.docs
        .map((docSnap) =>
          mapearDocumentoAvaliacao(docSnap.id, docSnap.data() as Record<string, unknown>)
        )
        .sort((a, b) => b.dataMs - a.dataMs);

      if (usuarioAtual) {
        const naListaPublica = avaliacoesPublicasCache.find(
          (item) => item.authorId === usuarioAtual?.uid
        );
        if (naListaPublica) {
          minhaAvaliacaoCache = naListaPublica;
        }
      }

      renderizarAvaliacoesPublicas();
      sincronizarFormularioComAvaliacaoDoUsuario();
    },
    (error) => {
      reportarErroFirestore(error, OperationType.LIST, 'reviews', 'avaliacao');
    }
  );
}

async function salvarAvaliacaoCliente(evento: Event): Promise<void> {
  evento.preventDefault();
  ocultarFeedbackAvaliacao();

  const inpNome = document.getElementById('avaliacao-nome') as HTMLInputElement | null;
  const inpBairro = document.getElementById('avaliacao-bairro') as HTMLInputElement | null;
  const inpNota = document.getElementById('avaliacao-nota') as HTMLInputElement | null;
  const inpComentario = document.getElementById(
    'avaliacao-comentario'
  ) as HTMLTextAreaElement | null;
  const btnEnviar = document.getElementById('btn-enviar-avaliacao') as HTMLButtonElement | null;

  const validacao = validarCamposAvaliacao({
    autorNome: inpNome?.value || '',
    bairro: inpBairro?.value || '',
    nota: Number(inpNota?.value || 5),
    comentario: inpComentario?.value || '',
  });

  if (!validacao.ok) {
    exibirFeedbackAvaliacao(validacao.erro, 'erro');
    return;
  }

  if (btnEnviar) btnEnviar.disabled = true;

  try {
    let user = auth.currentUser;
    if (!user) {
      const provider = createGoogleProvider();
      try {
        const cred = await signInWithPopup(auth, provider);
        user = cred.user;
      } catch (authErr) {
        const msg = authErr instanceof Error ? authErr.message : '';
        if (msg.includes('popup-closed-by-user')) {
          exibirFeedbackAvaliacao(
            'Confirme sua conta Google na janela de login para publicar sua avaliação verificada.',
            'info'
          );
        } else {
          exibirFeedbackAvaliacao(
            'Não foi possível autenticar com o Google. Tente novamente.',
            'erro'
          );
        }
        return;
      }
    }

    if (!user || !user.emailVerified) {
      exibirFeedbackAvaliacao(
        'É necessário entrar com uma conta Google verificada para publicar avaliações.',
        'erro'
      );
      return;
    }

    if (
      user.uid.length > REVIEW_CONSTRAINTS.ID_MAX_LENGTH ||
      !REVIEW_CONSTRAINTS.ID_PATTERN.test(user.uid)
    ) {
      exibirFeedbackAvaliacao('Identificador de conta inválido.', 'erro');
      return;
    }

    const reviewRef = doc(db, 'reviews', user.uid);
    const caminho = `reviews/${user.uid}`;

    let jaExiste = false;
    let publicadoAtual = true;
    try {
      const existenteSnap = await getDoc(reviewRef);
      jaExiste = existenteSnap.exists();
      if (jaExiste) {
        const dadosExistentes = existenteSnap.data();
        publicadoAtual = Boolean(dadosExistentes?.publicado);
      }
    } catch (errGet) {
      reportarErroFirestore(errGet, OperationType.GET, caminho, 'avaliacao');
    }

    if (jaExiste) {
      try {
        await updateDoc(reviewRef, {
          ...validacao.dados,
          updatedAt: serverTimestamp(),
        });
      } catch (errUpdate) {
        exibirFeedbackAvaliacao('Não foi possível atualizar sua avaliação.', 'erro');
        reportarErroFirestore(errUpdate, OperationType.UPDATE, caminho, 'avaliacao');
      }
    } else {
      try {
        await setDoc(reviewRef, {
          ...validacao.dados,
          publicado: true,
          authorId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (errCreate) {
        exibirFeedbackAvaliacao('Não foi possível publicar sua avaliação.', 'erro');
        reportarErroFirestore(errCreate, OperationType.CREATE, caminho, 'avaliacao');
      }
    }

    minhaAvaliacaoCache = {
      id: user.uid,
      ...validacao.dados,
      publicado: jaExiste ? publicadoAtual : true,
      authorId: user.uid,
      dataMs: Date.now(),
    };
    sincronizarFormularioComAvaliacaoDoUsuario();

    if (jaExiste && !publicadoAtual) {
      exibirFeedbackAvaliacao(
        'Sua avaliação foi atualizada (atualmente oculta pela moderação da loja).',
        'info'
      );
    } else {
      exibirFeedbackAvaliacao(
        jaExiste
          ? 'Sua avaliação verificada foi atualizada com sucesso!'
          : 'Obrigado! Sua avaliação verificada foi publicada no site.',
        'sucesso'
      );
    }
  } finally {
    if (btnEnviar) btnEnviar.disabled = false;
  }
}

async function excluirAvaliacaoPropria(idReview: string): Promise<void> {
  if (!usuarioAtual || usuarioAtual.uid !== idReview) return;
  if (idConfirmandoExclusaoPropriaAvaliacao !== idReview) {
    idConfirmandoExclusaoPropriaAvaliacao = idReview;
    renderizarAvaliacoesPublicas();
    return;
  }

  idConfirmandoExclusaoPropriaAvaliacao = null;
  const caminho = `reviews/${idReview}`;
  try {
    await deleteDoc(doc(db, 'reviews', idReview));
    minhaAvaliacaoCache = null;
    const inpBairro = document.getElementById('avaliacao-bairro') as HTMLInputElement | null;
    const inpComentario = document.getElementById(
      'avaliacao-comentario'
    ) as HTMLTextAreaElement | null;
    if (inpBairro) inpBairro.value = '';
    if (inpComentario) inpComentario.value = '';
    selecionarNotaEstrela(5);
    sincronizarFormularioComAvaliacaoDoUsuario();
    exibirFeedbackAvaliacao('Sua avaliação foi removida do site.', 'info');
  } catch (error) {
    exibirFeedbackAvaliacao('Não foi possível excluir sua avaliação.', 'erro');
    reportarErroFirestore(error, OperationType.DELETE, caminho, 'avaliacao');
  }
}

// ============================================================================
// 4. ESCUTA E OPERAÇÕES DO PAINEL ADMINISTRATIVO (PRODUTOS + AVALIAÇÕES)
// ============================================================================
async function verificarPermissaoAdmin(user: User): Promise<boolean> {
  if (!user.emailVerified) return false;
  if (user.email === BOOTSTRAPPED_ADMIN_EMAIL) return true;

  const adminPath = `admins/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    return snap.exists();
  } catch (error) {
    reportarErroFirestore(error, OperationType.GET, adminPath, 'admin');
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

      if (produtosAdminCache.length > 0) {
        marcarSeedInicialConcluido();
      } else if (
        !snapshot.metadata.fromCache &&
        user.email === BOOTSTRAPPED_ADMIN_EMAIL &&
        !seedInicialJaConcluido() &&
        !semeandoAutomaticamente
      ) {
        void sincronizarCatalogoInicial(true);
      }

      const bannerSeed = document.getElementById('admin-seed-banner');
      if (bannerSeed) {
        bannerSeed.hidden = produtosAdminCache.length > 0;
      }

      sincronizarCatalogoNaVitrine();
      renderizarListaAdmin();
    },
    (error) => {
      reportarErroFirestore(error, OperationType.LIST, 'products', 'admin');
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
      const statusVisibilidade = item.publicado ? '' : ' · Oculto no site';
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
              data-admin-acao="toggle-visibilidade"
              data-id="${escaparHtmlSeguro(item.id)}"
              class="btn-outline-sm focus-ring"
            >
              ${item.publicado ? 'Ocultar' : 'Exibir'}
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

async function sincronizarCatalogoInicial(silencioso = false): Promise<void> {
  if (!usuarioAtual || !ehAdminAutorizado || !window.TEKY_CATALOGO || semeandoAutomaticamente) {
    return;
  }

  semeandoAutomaticamente = true;
  const btn = document.getElementById('btn-sincronizar-iniciais') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;
  if (!silencioso) ocultarFeedbackAdmin();

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
    marcarSeedInicialConcluido();
    exibirFeedbackAdmin(
      'Catálogo inicial sincronizado no Firebase com sucesso! Todas as alterações feitas aqui atualizam a loja em tempo real.',
      'sucesso'
    );
  } catch (error) {
    reportarErroFirestore(error, OperationType.WRITE, 'products', 'admin');
  } finally {
    semeandoAutomaticamente = false;
    if (btn) btn.disabled = false;
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
  const maiorOrdem = produtosAdminCache.reduce((max, p) => Math.max(max, p.ordem || 0), 0);
  const proximaOrdem = ordemExistente > 0 ? ordemExistente : maiorOrdem + 1;

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
      reportarErroFirestore(error, OperationType.UPDATE, caminho, 'admin');
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
      marcarSeedInicialConcluido();
      limparFormularioAdmin();
      exibirFeedbackAdmin('Novo produto adicionado ao catálogo!', 'sucesso');
    } catch (error) {
      exibirFeedbackAdmin('Não foi possível cadastrar o novo produto.', 'erro');
      reportarErroFirestore(error, OperationType.CREATE, caminho, 'admin');
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
    reportarErroFirestore(error, OperationType.UPDATE, caminho, 'admin');
  }
}

async function alternarVisibilidadeProdutoRapida(idProduto: string): Promise<void> {
  const item = produtosAdminCache.find((p) => p.id === idProduto);
  if (!item) return;

  const caminho = `products/${idProduto}`;
  try {
    await updateDoc(doc(db, 'products', idProduto), {
      disponivel: item.disponivel,
      publicado: !item.publicado,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    exibirFeedbackAdmin('Erro ao atualizar visibilidade do produto.', 'erro');
    reportarErroFirestore(error, OperationType.UPDATE, caminho, 'admin');
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
    reportarErroFirestore(error, OperationType.DELETE, caminho, 'admin');
  }
}

// ============================================================================
// 5. MODERAÇÃO DE AVALIAÇÕES NO PAINEL ADMIN + CONVERSOR DE FOTOS PARA .WEBP
// ============================================================================
function iniciarEscutaAdminAvaliacoes(user: User): void {
  if (unsubscribeAdminAvaliacoes) {
    unsubscribeAdminAvaliacoes();
    unsubscribeAdminAvaliacoes = null;
  }

  const referencia =
    user.email === BOOTSTRAPPED_ADMIN_EMAIL
      ? collection(db, 'reviews')
      : query(collection(db, 'reviews'), where('publicado', '==', true));

  unsubscribeAdminAvaliacoes = onSnapshot(
    referencia,
    (snapshot) => {
      avaliacoesAdminCache = snapshot.docs
        .map((docSnap) =>
          mapearDocumentoAvaliacao(docSnap.id, docSnap.data() as Record<string, unknown>)
        )
        .sort((a, b) => b.dataMs - a.dataMs);

      renderizarListaAdminAvaliacoes();
    },
    (error) => {
      reportarErroFirestore(error, OperationType.LIST, 'reviews', 'admin');
    }
  );
}

function renderizarListaAdminAvaliacoes(): void {
  const container = document.getElementById('admin-lista-avaliacoes');
  const contador = document.getElementById('admin-contador-avaliacoes');
  if (!container) return;

  if (contador) {
    const publicadas = avaliacoesAdminCache.filter((item) => item.publicado).length;
    const ocultas = avaliacoesAdminCache.length - publicadas;
    const baseTxt =
      publicadas === 1 ? '1 avaliação publicada' : `${publicadas} avaliações publicadas`;
    contador.textContent = ocultas > 0 ? `${baseTxt} · ${ocultas} oculta(s)` : baseTxt;
  }

  if (avaliacoesAdminCache.length === 0) {
    container.innerHTML = `
      <p class="admin-helper-text">
        Nenhuma avaliação enviada pelos clientes até o momento.
      </p>
    `;
    return;
  }

  container.innerHTML = avaliacoesAdminCache
    .map((item) => {
      const estrelas = '★'.repeat(item.nota) + '☆'.repeat(Math.max(0, 5 - item.nota));
      const confirmando = idConfirmandoExclusaoAvaliacao === item.id;
      const textoData = item.dataMs > 0 ? ` · ${formatadorDataCurta.format(new Date(item.dataMs))}` : '';
      const seloStatus = item.publicado ? ' · Visível no site' : ' · Oculta';

      return `
        <div class="admin-item-row" data-admin-review-id="${escaparHtmlSeguro(item.id)}">
          <div class="admin-item-info">
            <p class="admin-item-title">
              ${escaparHtmlSeguro(estrelas)} · ${escaparHtmlSeguro(item.autorNome)} (${escaparHtmlSeguro(item.bairro)})${escaparHtmlSeguro(textoData)}${seloStatus}
            </p>
            <p class="admin-item-meta">${escaparHtmlSeguro(item.comentario)}</p>
          </div>
          <div class="admin-item-actions">
            <button
              type="button"
              data-admin-review-acao="toggle-visibilidade"
              data-id="${escaparHtmlSeguro(item.id)}"
              class="btn-outline-sm focus-ring"
            >
              ${item.publicado ? 'Ocultar' : 'Republicar'}
            </button>
            <button
              type="button"
              data-admin-review-acao="excluir"
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

async function alternarVisibilidadeAvaliacaoAdmin(idReview: string): Promise<void> {
  const item = avaliacoesAdminCache.find((r) => r.id === idReview);
  if (!item) return;

  const caminho = `reviews/${idReview}`;
  try {
    await updateDoc(doc(db, 'reviews', idReview), {
      publicado: !item.publicado,
      updatedAt: serverTimestamp(),
    });
    exibirFeedbackAdmin(
      !item.publicado
        ? 'Avaliação republicada no site.'
        : 'Avaliação ocultada do mural público.',
      'info'
    );
  } catch (error) {
    exibirFeedbackAdmin('Erro ao atualizar visibilidade da avaliação.', 'erro');
    reportarErroFirestore(error, OperationType.UPDATE, caminho, 'admin');
  }
}

async function excluirAvaliacaoAdmin(idReview: string): Promise<void> {
  if (idConfirmandoExclusaoAvaliacao !== idReview) {
    idConfirmandoExclusaoAvaliacao = idReview;
    renderizarListaAdminAvaliacoes();
    return;
  }

  idConfirmandoExclusaoAvaliacao = null;
  const caminho = `reviews/${idReview}`;
  try {
    await deleteDoc(doc(db, 'reviews', idReview));
    if (usuarioAtual && usuarioAtual.uid === idReview) {
      minhaAvaliacaoCache = null;
      sincronizarFormularioComAvaliacaoDoUsuario();
    }
    exibirFeedbackAdmin('Avaliação removida permanentemente.', 'info');
  } catch (error) {
    exibirFeedbackAdmin('Erro ao remover a avaliação.', 'erro');
    reportarErroFirestore(error, OperationType.DELETE, caminho, 'admin');
  }
}

function gerarSlugArquivoWebp(nomeOriginal: string): string {
  const inputCodigo = (document.getElementById('admin-codigo') as HTMLInputElement | null)?.value || '';
  const baseBruta = inputCodigo.trim() || nomeOriginal.replace(/\.[^.]+$/, '');
  const normalizado = baseBruta
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return normalizado || 'produto-teky';
}

async function converterArquivoFotoParaWebp(arquivo: File): Promise<void> {
  const statusEl = document.getElementById('admin-webp-status');
  const linkDownload = document.getElementById('admin-webp-download') as HTMLAnchorElement | null;
  const inputImagem = document.getElementById('admin-imagem') as HTMLInputElement | null;
  if (!statusEl || !linkDownload) return;

  statusEl.textContent = 'Convertendo e otimizando imagem para WebP...';
  linkDownload.hidden = true;

  const urlTemporaria = URL.createObjectURL(arquivo);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const elemento = new Image();
      elemento.onload = () => resolve(elemento);
      elemento.onerror = () => reject(new Error('Falha ao ler imagem'));
      elemento.src = urlTemporaria;
    });

    const maxDimensao = 720;
    let largura = img.naturalWidth || 720;
    let altura = img.naturalHeight || 720;
    if (largura > maxDimensao || altura > maxDimensao) {
      const escala = Math.min(maxDimensao / largura, maxDimensao / altura);
      largura = Math.max(1, Math.round(largura * escala));
      altura = Math.max(1, Math.round(altura * escala));
    }

    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas indisponível');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, largura, altura);
    ctx.drawImage(img, 0, 0, largura, altura);

    const blobWebp = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', 0.82);
    });

    if (!blobWebp) throw new Error('Navegador não gerou WebP');

    if (urlDownloadWebpAtual) {
      URL.revokeObjectURL(urlDownloadWebpAtual);
    }
    urlDownloadWebpAtual = URL.createObjectURL(blobWebp);

    const slug = gerarSlugArquivoWebp(arquivo.name);
    const nomeFinal = `${slug}.webp`;
    const kbAntes = Math.max(1, Math.round(arquivo.size / 1024));
    const kbDepois = Math.max(1, Math.round(blobWebp.size / 1024));

    linkDownload.href = urlDownloadWebpAtual;
    linkDownload.download = nomeFinal;
    linkDownload.textContent = `Baixar ${nomeFinal} (${kbDepois} KB)`;
    linkDownload.hidden = false;

    statusEl.textContent = `Pronto! Imagem otimizada de ${kbAntes} KB para ${kbDepois} KB (${largura}×${altura}px). Baixe o arquivo abaixo e salve na pasta img/.`;

    if (inputImagem && (!inputImagem.value.trim() || inputImagem.value.trim().startsWith('img/'))) {
      inputImagem.value = `img/${nomeFinal}`;
    }
  } catch (_) {
    statusEl.textContent =
      'Não foi possível converter este arquivo. Escolha uma foto JPG ou PNG válida.';
  } finally {
    URL.revokeObjectURL(urlTemporaria);
  }
}

// ============================================================================
// 6. AUTENTICAÇÃO GOOGLE E EVENTOS DA INTERFACE
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

function registrarEventosAvaliacoesPublicas(): void {
  const btnAbrirForm = document.getElementById('btn-abrir-form-avaliacao');
  const btnVazioAvaliar = document.getElementById('btn-vazio-avaliar');
  const btnCancelarAvaliacao = document.getElementById('btn-cancelar-avaliacao');
  const seletorEstrelas = document.getElementById('seletor-estrelas-avaliacao');
  const formAvaliacao = document.getElementById('painel-form-avaliacao');
  const gradePublica = document.getElementById('grade-avaliacoes-clientes');

  btnAbrirForm?.addEventListener('click', () => alternarPainelAvaliacao());
  btnVazioAvaliar?.addEventListener('click', () => alternarPainelAvaliacao(true));
  btnCancelarAvaliacao?.addEventListener('click', () => alternarPainelAvaliacao(false));

  seletorEstrelas?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-estrela]');
    if (!btn) return;
    selecionarNotaEstrela(Number(btn.getAttribute('data-estrela')));
  });

  formAvaliacao?.addEventListener('submit', (e) => void salvarAvaliacaoCliente(e));

  gradePublica?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-avaliacao-publica-acao]');
    if (!btn) return;
    const acao = btn.getAttribute('data-avaliacao-publica-acao');
    if (acao === 'editar') {
      idConfirmandoExclusaoPropriaAvaliacao = null;
      alternarPainelAvaliacao(true, true);
    } else if (acao === 'excluir') {
      const id = btn.getAttribute('data-id');
      if (id) void excluirAvaliacaoPropria(id);
    }
  });
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
  const listaAvaliacoesAdmin = document.getElementById('admin-lista-avaliacoes');
  const btnConverterWebp = document.getElementById('btn-converter-foto-webp');
  const inputArquivoWebp = document.getElementById(
    'admin-arquivo-foto-webp'
  ) as HTMLInputElement | null;

  const fazerLoginGoogle = async () => {
    ocultarFeedbackAdmin();
    const provider = createGoogleProvider();
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
  btnSeed?.addEventListener('click', () => void sincronizarCatalogoInicial(false));

  chkPromo?.addEventListener('change', () => {
    if (boxPromo) boxPromo.hidden = !chkPromo.checked;
  });

  btnConverterWebp?.addEventListener('click', () => {
    inputArquivoWebp?.click();
  });

  inputArquivoWebp?.addEventListener('change', () => {
    const arquivo = inputArquivoWebp.files?.[0];
    if (arquivo) {
      void converterArquivoFotoParaWebp(arquivo);
      inputArquivoWebp.value = '';
    }
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
    } else if (acao === 'toggle-visibilidade') {
      void alternarVisibilidadeProdutoRapida(id);
    } else if (acao === 'editar') {
      preencherFormularioParaEdicao(id);
    } else if (acao === 'excluir') {
      void excluirProdutoAdmin(id);
    }
  });

  listaAvaliacoesAdmin?.addEventListener('click', (e) => {
    const alvo = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-admin-review-acao]');
    if (!alvo) return;
    const acao = alvo.getAttribute('data-admin-review-acao');
    const id = alvo.getAttribute('data-id');
    if (!id) return;

    if (acao !== 'excluir') {
      idConfirmandoExclusaoAvaliacao = null;
    }

    if (acao === 'toggle-visibilidade') {
      void alternarVisibilidadeAvaliacaoAdmin(id);
    } else if (acao === 'excluir') {
      void excluirAvaliacaoAdmin(id);
    }
  });

  onAuthStateChanged(auth, async (user) => {
    usuarioAtual = user;
    await carregarAvaliacaoPropriaDoUsuario(user);
    renderizarAvaliacoesPublicas();
    sincronizarFormularioComAvaliacaoDoUsuario();

    if (!user) {
      ehAdminAutorizado = false;
      produtosAdminCache = [];
      avaliacoesAdminCache = [];
      if (unsubscribeAdminProdutos) {
        unsubscribeAdminProdutos();
        unsubscribeAdminProdutos = null;
      }
      if (unsubscribeAdminAvaliacoes) {
        unsubscribeAdminAvaliacoes();
        unsubscribeAdminAvaliacoes = null;
      }
      atualizarInterfaceAuth(null, false);
      sincronizarCatalogoNaVitrine();
      return;
    }

    ehAdminAutorizado = await verificarPermissaoAdmin(user);
    atualizarInterfaceAuth(user, ehAdminAutorizado);

    if (ehAdminAutorizado) {
      iniciarEscutaAdmin(user);
      iniciarEscutaAdminAvaliacoes(user);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    iniciarEscutaCatalogoPublico();
    iniciarEscutaAvaliacoesPublicas();
    registrarEventosAvaliacoesPublicas();
    registrarEventosAdmin();
  });
} else {
  iniciarEscutaCatalogoPublico();
  iniciarEscutaAvaliacoesPublicas();
  registrarEventosAvaliacoesPublicas();
  registrarEventosAdmin();
}
