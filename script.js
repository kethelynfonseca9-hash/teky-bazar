/* ==========================================================================
   CONFIGURAÇÕES PRINCIPAIS DA LOJA (FÁCIL EDIÇÃO)
   Suporta também variáveis dinâmicas via Docker (window.ENV_CONFIG)
   ========================================================================== */
const WHATSAPP = (window.ENV_CONFIG && window.ENV_CONFIG.WHATSAPP) || "5522997711986";
const TELEFONE_EXIBICAO = (window.ENV_CONFIG && window.ENV_CONFIG.TELEFONE) || "(22) 99771-1986";
const TELEFONE_LINK = (window.ENV_CONFIG && window.ENV_CONFIG.TELEFONE_LINK) || "+5522997711986";
const ENDERECO_LOJA =
  (window.ENV_CONFIG && window.ENV_CONFIG.ENDERECO) ||
  "Estr. da Cruz – Flexeira (Pinheiros), São Pedro da Aldeia – RJ, CEP 28946-195";
const NOME_LOJA = (window.ENV_CONFIG && window.ENV_CONFIG.NOME_LOJA) || "TEKY BAZAR";
const LINK_INSTAGRAM = (window.ENV_CONFIG && window.ENV_CONFIG.LINK_INSTAGRAM) || "https://instagram.com/tekybazar";

/* ==========================================================================
   COMO TROCAR PELAS FOTOS REAIS DA LOJA:
   1. Salve as fotos reais dos produtos na pasta "img/" ao lado do index.html
      (prefira fotos quadradas em formato .webp ou .jpg, ex.: "img/cimento-cp2.webp").
      Dica: na "Área da Loja" (#admin) há um conversor automático para .webp leve!
   2. No array PRODUTOS abaixo, altere o campo `imagem: "img/nome-do-arquivo.webp"`
      do produto correspondente.
   3. Caso algum arquivo ainda não exista na pasta "img/", o site tenta o .jpg
      equivalente e, se não houver, exibe fundo azul claro com o ícone da categoria.
   ========================================================================== */
const PRODUTOS = [
  // 1. Materiais de Construção (5 itens)
  {
    id: 1,
    codigo: "CIM-001",
    nome: "Cimento CSN CP II-E 50kg",
    categoria: "Materiais de Construção",
    preco: 36.9,
    unidade: "saco 50kg",
    descricao: "Cimento Portland composto de secagem rápida e alta resistência para reboco, contrapiso, lajes e fundações em geral.",
    imagem: "img/cimento-cp2.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 35.9
  },
  {
    id: 2,
    codigo: "ARG-002",
    nome: "Argamassa Aliance AC-II 20kg",
    categoria: "Materiais de Construção",
    preco: 24.5,
    unidade: "saco 20kg",
    descricao: "Indicada para assentamento de pisos e revestimentos cerâmicos em áreas internas e externas com excelente aderência.",
    imagem: "img/argamassa-ac2.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: 23.9
  },
  {
    id: 3,
    codigo: "TIJ-003",
    nome: "Tijolo Baiano 8 Furos 9x19x19cm",
    categoria: "Materiais de Construção",
    preco: 890.0,
    unidade: "milheiro",
    descricao: "Bloco cerâmico de vedação bem queimado, medidas uniformes e ótimo isolamento térmico e acústico para alvenaria.",
    imagem: "img/tijolo-baiano.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 1.45
  },
  {
    id: 4,
    codigo: "TIN-004",
    nome: "Tinta Acrílica Fosca Branco Neve 18L",
    categoria: "Materiais de Construção",
    preco: 189.9,
    unidade: "lata 18L",
    descricao: "Tinta acrílica de ótima cobertura, baixo odor e acabamento fosco aveludado para paredes internas e externas.",
    imagem: "img/tinta-acrilica-18l.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 5,
    codigo: "IMP-005",
    nome: "Argamassa Polimérica Impermeabilizante 18kg",
    categoria: "Materiais de Construção",
    preco: 114.9,
    unidade: "caixa 18kg",
    descricao: "Revestimento semiflexível bicomponente ideal para eliminar umidade em rodapés, baldrames, banheiros e áreas frias.",
    imagem: "img/impermeabilizante-18kg.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },

  // 2. Ferragens (5 itens)
  {
    id: 6,
    codigo: "FER-101",
    nome: "Prego Galvanizado com Cabeça 18x27",
    categoria: "Ferragens",
    preco: 18.9,
    unidade: "pacote 1kg",
    descricao: "Pregos de aço galvanizado resistentes à oxidação, ideais para caixarias de obra, telhados e estruturas de madeira.",
    imagem: "img/prego-galvanizado-18x27.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 7,
    codigo: "FER-102",
    nome: "Parafuso Chipboard Phillips 4,0x40mm",
    categoria: "Ferragens",
    preco: 16.5,
    unidade: "caixa 100 un",
    descricao: "Parafuso bicromatizado autoatarraxante para montagem de móveis, MDF, compensados, pinus e buchas plásticas.",
    imagem: "img/parafuso-chipboard-4x40.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 13.9
  },
  {
    id: 8,
    codigo: "FER-103",
    nome: "Kit Dobradiça Aço Inox 3.1/2\" com Parafusos",
    categoria: "Ferragens",
    preco: 34.9,
    unidade: "cartela 3 un",
    descricao: "Jogo com 3 dobradiças reforçadas em aço inox escovado para portas de madeira, abertura suave sem rangidos.",
    imagem: "img/dobradica-inox-35.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 9,
    codigo: "FER-104",
    nome: "Cadeado de Latão Maciço 40mm",
    categoria: "Ferragens",
    preco: 29.9,
    unidade: "unidade",
    descricao: "Cadeado com corpo em latão maciço, haste de aço temperado cromado e acompanha 2 chaves.",
    imagem: "img/cadeado-latao-40mm.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 10,
    codigo: "FER-105",
    nome: "Fechadura Externa Inox Escovado 40mm",
    categoria: "Ferragens",
    preco: 79.9,
    unidade: "conjunto",
    descricao: "Fechadura completa de alta segurança para portas externas de madeira ou perfil metálico com 2 chaves.",
    imagem: "img/fechadura-externa-inox.webp",
    disponivel: false,
    promocao: false,
    precoPromocional: null
  },

  // 3. Madeiras (5 itens)
  {
    id: 11,
    codigo: "MAD-201",
    nome: "Tábua de Pinus Aparelhada 30cm x 3m",
    categoria: "Madeiras",
    preco: 38.0,
    unidade: "peça 3m",
    descricao: "Tábua de pinus seca e aparelhada nos quatro lados, excelente para prateleiras, formas de concreto e marcenaria.",
    imagem: "img/tabua-pinus-30cm.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 33.5
  },
  {
    id: 12,
    codigo: "MAD-202",
    nome: "Caibro de Eucalipto 5x6cm x 3m",
    categoria: "Madeiras",
    preco: 27.9,
    unidade: "peça 3m",
    descricao: "Caibro serrado de eucalipto selecionado, alta firmeza estrutural para telhados, pergolados e escoramentos.",
    imagem: "img/caibro-eucalipto-5x6.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 13,
    codigo: "MAD-203",
    nome: "Sarrafo de Pinus 5cm x 3m",
    categoria: "Madeiras",
    preco: 9.5,
    unidade: "peça 3m",
    descricao: "Sarrafo reto e leve para ripamento de telhados, guias, painéis ripados, artesanato e travamento de caixarias.",
    imagem: "img/sarrafo-pinus-5cm.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 14,
    codigo: "MAD-204",
    nome: "Compensado Naval / Madeirite 12mm",
    categoria: "Madeiras",
    preco: 129.0,
    unidade: "chapa 2,20x1,10m",
    descricao: "Chapa de compensado laminado resistente para formas de concreto armado, divisórias, tapumes e marcenaria.",
    imagem: "img/compensado-naval-12mm.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 15,
    codigo: "MAD-205",
    nome: "Viga de Cambará 6x12cm x 4m",
    categoria: "Madeiras",
    preco: 148.0,
    unidade: "peça 4m",
    descricao: "Viga de madeira nobre resistente a intempéries, ideal para telhados aparentes, varandas e áreas gourmet.",
    imagem: "img/viga-cambara-6x12.webp",
    disponivel: false,
    promocao: false,
    precoPromocional: null
  },

  // 4. Areia (5 itens)
  {
    id: 16,
    codigo: "ARE-301",
    nome: "Areia Média Lavada a Granel",
    categoria: "Areia",
    preco: 145.0,
    unidade: "m³",
    descricao: "Areia média limpa e peneirada, ideal para assentamento de tijolos, chapisco, emboço e preparo de concreto.",
    imagem: "img/areia-media-granel.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 132.0
  },
  {
    id: 17,
    codigo: "ARE-302",
    nome: "Areia Fina Lavada para Reboco",
    categoria: "Areia",
    preco: 155.0,
    unidade: "m³",
    descricao: "Granulometria fina e uniforme, livre de impurezas, perfeita para acabamento liso em reboco interno e externo.",
    imagem: "img/areia-fina-granel.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 18,
    codigo: "ARE-303",
    nome: "Areia Grossa Lavada para Concreto",
    categoria: "Areia",
    preco: 149.0,
    unidade: "m³",
    descricao: "Areia de grãos maiores indicada para concreto estrutural, contrapiso reforçado e bases de pavimentação.",
    imagem: "img/areia-grossa-granel.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 19,
    codigo: "ARE-304",
    nome: "Areia Média Lavada Ensacada 20kg",
    categoria: "Areia",
    preco: 7.9,
    unidade: "saco 20kg",
    descricao: "Praticidade sem sujeira para pequenos reparos, reformas em apartamentos e transporte limpo no porta-malas.",
    imagem: "img/areia-media-saco-20kg.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 20,
    codigo: "ARE-305",
    nome: "Areia Fina Lavada Ensacada 20kg",
    categoria: "Areia",
    preco: 8.5,
    unidade: "saco 20kg",
    descricao: "Saco de 20kg na medida certa para pequenos acabamentos de massa fina, rejuntes rústicos e jardinagem.",
    imagem: "img/areia-fina-saco-20kg.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },

  // 5. Pedra (5 itens)
  {
    id: 21,
    codigo: "PED-401",
    nome: "Pedra Brita 1 a Granel",
    categoria: "Pedra",
    preco: 158.0,
    unidade: "m³",
    descricao: "A brita mais utilizada na construção civil, indispensável para colunas, vigas, lajes e pisos de concreto.",
    imagem: "img/pedra-brita-1-granel.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 144.0
  },
  {
    id: 22,
    codigo: "PED-402",
    nome: "Pedra Brita 2 para Fundação",
    categoria: "Pedra",
    preco: 156.0,
    unidade: "m³",
    descricao: "Granulometria maior indicada para concreto bruto, sapatas, fundações pesadas, drenos e pátios de estacionamento.",
    imagem: "img/pedra-brita-2-granel.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 23,
    codigo: "PED-403",
    nome: "Pedrisco Limpo (Brita 0)",
    categoria: "Pedra",
    preco: 162.0,
    unidade: "m³",
    descricao: "Pedra miúda excelente para vigotas, lajes pré-moldadas, blocos, acabamentos aparentes e calçadas.",
    imagem: "img/pedrisco-brita-0.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 24,
    codigo: "PED-404",
    nome: "Pedra Brita 1 Ensacada 20kg",
    categoria: "Pedra",
    preco: 8.9,
    unidade: "saco 20kg",
    descricao: "Brita 1 limpa em embalagem resistente de 20kg para pequenas concretagens, chumbamentos e drenos de vasos.",
    imagem: "img/pedra-brita-1-saco-20kg.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 25,
    codigo: "PED-405",
    nome: "Pedra Rachão (Pedra de Mão)",
    categoria: "Pedra",
    preco: 168.0,
    unidade: "m³",
    descricao: "Pedra bruta de grande porte para muros de arrimo, gabiões, fundações profundas e sistemas de drenagem.",
    imagem: "img/pedra-rachao.webp",
    disponivel: false,
    promocao: false,
    precoPromocional: null
  },

  // 6. Bazar (5 itens)
  {
    id: 26,
    codigo: "BAZ-501",
    nome: "Caixa Organizadora Transparente 30 Litros",
    categoria: "Bazar",
    preco: 42.9,
    unidade: "unidade",
    descricao: "Caixa plástica reforçada com tampa e travas laterais firmes, ideal para organizar roupas, ferramentas e despensa.",
    imagem: "img/caixa-organizadora-30l.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 34.9
  },
  {
    id: 27,
    codigo: "BAZ-502",
    nome: "Balde Reforçado Multiuso 12 Litros",
    categoria: "Bazar",
    preco: 12.9,
    unidade: "unidade",
    descricao: "Balde em polipropileno de alta resistência com alça anatômica metálica para uso doméstico ou pesado em obras.",
    imagem: "img/balde-reforcado-12l.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 28,
    codigo: "BAZ-503",
    nome: "Vassoura Piaçava Reforçada com Cabo",
    categoria: "Bazar",
    preco: 22.5,
    unidade: "unidade",
    descricao: "Cerdas firmes para limpeza eficiente de quintais, calçadas, garagens e pisos rústicos. Acompanha cabo resistente.",
    imagem: "img/vassoura-piacava.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  },
  {
    id: 29,
    codigo: "BAZ-504",
    nome: "Jogo de Potes Herméticos Empilháveis 5 Peças",
    categoria: "Bazar",
    preco: 49.9,
    unidade: "kit 5 un",
    descricao: "Conjunto de potes livres de BPA com travas laterais e vedação segura para conservar mantimentos secos.",
    imagem: "img/potes-hermeticos-5pc.webp",
    disponivel: true,
    promocao: true,
    precoPromocional: 39.9
  },
  {
    id: 30,
    codigo: "BAZ-505",
    nome: "Cesto Organizador Vazado Grande",
    categoria: "Bazar",
    preco: 19.9,
    unidade: "unidade",
    descricao: "Cesto ventilado com pega lateral confortável para armários de cozinha, lavanderia, banheiro e escritório.",
    imagem: "img/cesto-organizador-vazado.webp",
    disponivel: true,
    promocao: false,
    precoPromocional: null
  }
];

/* ==========================================================================
   CATEGORIAS, SEÇÕES E ESTADO DA INTERFACE
   ========================================================================== */
const CATEGORIAS = [
  "Todos",
  "Materiais de Construção",
  "Ferragens",
  "Madeiras",
  "Areia",
  "Pedra",
  "Bazar"
];

const SECOES_VALIDAS = ["catalogo", "como-comprar", "entrega", "contato", "admin"];

const PRODUTOS_LOCAIS_INICIAIS = PRODUTOS.map((item) => ({ ...item }));
const VERSAO_IMAGENS_CATALOGO = "v2";
const MAPA_IMAGEM_POR_CODIGO = Object.fromEntries(
  PRODUTOS_LOCAIS_INICIAIS.map((item) => [String(item.codigo).trim().toUpperCase(), item.imagem])
);

const CHAVE_SACOLA_ITENS = "teky_lista_orcamento";
const CHAVE_SACOLA_PREFS = "teky_prefs_orcamento";

const estado = {
  secaoAtiva: "catalogo",
  busca: "",
  categoria: "Todos",
  ordem: "padrao",
  disponibilidade: "todos",
  faixaPreco: "todos",
  filtrosAbertos: false,
  menuMobileAberto: false,
  ultimoElementoFocado: null,
  produtoModalAtualId: null,
  qtdModal: 1,
  sacolaAberta: false,
  sacolaItens: [],
  sacolaModalidade: "entrega",
  sacolaBairro: "",
  sacolaObservacao: "",
  confirmandoLimparSacola: false
};

/* ==========================================================================
   FUNÇÕES UTILITÁRIAS (MOEDA, TEXTO, ÍCONES E WHATSAPP)
   ========================================================================== */
const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatarMoeda(valor) {
  return formatadorMoeda.format(valor);
}

function obterPrecoFinal(produto) {
  if (produto.promocao && typeof produto.precoPromocional === "number") {
    return produto.precoPromocional;
  }
  return produto.preco;
}

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function escaparHtml(texto) {
  const mapa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(texto || "").replace(/[&<>"']/g, (c) => mapa[c]);
}

function gerarLinkWhatsAppProduto(produto) {
  const precoExibido = `${formatarMoeda(obterPrecoFinal(produto))} / ${produto.unidade}`;
  const mensagem = `Olá! Vi o catálogo da ${NOME_LOJA} e gostaria de pedir orçamento do item: ${produto.nome} (cód. ${produto.codigo}) – ${precoExibido}`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

function gerarLinkWhatsAppGeral() {
  const mensagem = `Olá! Vim pelo site da ${NOME_LOJA} e gostaria de pedir um orçamento.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

// 12. Mensagem exata solicitada para consulta de frete
function gerarLinkWhatsAppFrete() {
  const mensagem = "Olá! Quero saber o frete para o bairro: ";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

function obterIconeCategoria(categoria, tamanho = 40) {
  const attr = `width="${tamanho}" height="${tamanho}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"`;
  const icones = {
    "Materiais de Construção":
      `<svg ${attr}><rect x="3" y="4" width="8" height="5" rx="1"/><rect x="13" y="4" width="8" height="5" rx="1"/><rect x="7" y="10" width="10" height="5" rx="1"/><rect x="3" y="16" width="8" height="4" rx="1"/><rect x="13" y="16" width="8" height="4" rx="1"/></svg>`,
    Ferragens:
      `<svg ${attr}><path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z"/></svg>`,
    Madeiras:
      `<svg ${attr}><rect x="3" y="5" width="18" height="5" rx="1"/><rect x="3" y="14" width="18" height="5" rx="1"/><path d="M8 7.5h3M15 16.5h3"/></svg>`,
    Areia:
      `<svg ${attr}><path stroke-linecap="round" stroke-linejoin="round" d="M3 19h18L14.5 8.5a3 3 0 0 0-5 0L3 19Z"/><circle cx="12" cy="15" r="0.8" fill="currentColor"/></svg>`,
    Pedra:
      `<svg ${attr}><polygon points="12 4 19 9 17 19 7 19 5 9 12 4"/><path d="M12 4v8l5 7M12 12 7 19"/></svg>`,
    Bazar:
      `<svg ${attr}><path stroke-linecap="round" stroke-linejoin="round" d="M4 9h16l-1.5 10.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 9Z"/><path stroke-linecap="round" d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>`
  };
  return icones[categoria] || icones["Materiais de Construção"];
}

/* ==========================================================================
   ETAPA 2: ALTERNÂNCIA DE TEMA CLARO (PADRÃO) E ESCURO
   Respeita prefers-color-scheme na 1ª visita e salva escolha em localStorage
   ========================================================================== */
function obterTemaAtual() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function usuarioJaEscolheuTema() {
  try {
    const salvo = localStorage.getItem("teky_tema");
    return salvo === "dark" || salvo === "light";
  } catch (_) {
    return false;
  }
}

function aplicarTema(tema, salvar = true) {
  const modoEscuro = tema === "dark";
  const valorTema = modoEscuro ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", valorTema);

  if (salvar) {
    try {
      localStorage.setItem("teky_tema", valorTema);
    } catch (_) {
      // Ignora caso o navegador bloqueie armazenamento local
    }
  }

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", modoEscuro ? "#0A1128" : "#2563EB");
  }

  const btnHeader = document.getElementById("btn-alternar-tema");
  const iconeLua = document.getElementById("icone-tema-lua");
  const iconeSol = document.getElementById("icone-tema-sol");
  const textoHeader = document.getElementById("texto-tema-header");
  const btnMobile = document.getElementById("btn-alternar-tema-mobile");
  const textoMobile = document.getElementById("texto-tema-mobile");

  if (iconeLua) iconeLua.hidden = modoEscuro;
  if (iconeSol) iconeSol.hidden = !modoEscuro;
  if (textoHeader) textoHeader.textContent = modoEscuro ? "Claro" : "Escuro";

  if (btnHeader) {
    btnHeader.setAttribute("aria-pressed", modoEscuro ? "true" : "false");
    btnHeader.setAttribute(
      "aria-label",
      modoEscuro ? "Ativar tema claro" : "Ativar tema escuro"
    );
  }

  if (btnMobile) {
    btnMobile.setAttribute("aria-pressed", modoEscuro ? "true" : "false");
  }
  if (textoMobile) {
    textoMobile.textContent = modoEscuro ? "Ativar tema claro" : "Ativar tema escuro";
  }
}

function alternarTema() {
  const proximo = obterTemaAtual() === "dark" ? "light" : "dark";
  aplicarTema(proximo, true);
}

function acompanharPreferenciaSistema() {
  if (!window.matchMedia) return;
  const midiaEscura = window.matchMedia("(prefers-color-scheme: dark)");
  const aoMudar = (evento) => {
    if (!usuarioJaEscolheuTema()) {
      aplicarTema(evento.matches ? "dark" : "light", false);
    }
  };
  if (typeof midiaEscura.addEventListener === "function") {
    midiaEscura.addEventListener("change", aoMudar);
  }
}

function resolverFontesImagem(caminhoOriginal, codigoProduto) {
  let limpo = String(caminhoOriginal || "").trim();
  const chaveCodigo = String(codigoProduto || "").trim().toUpperCase();

  // Garante imagem única real por código caso haja caminho vazio ou legado salvo na sacola/nuvem
  if ((!limpo || /cat_[a-z0-9_]+/i.test(limpo)) && chaveCodigo && MAPA_IMAGEM_POR_CODIGO[chaveCodigo]) {
    limpo = MAPA_IMAGEM_POR_CODIGO[chaveCodigo];
  }

  const correspondenciaLocal = limpo.match(/^(\.\/)?img\/([a-zA-Z0-9_\-]+)\.(jpg|jpeg|webp)(\?.*)?$/i);
  if (correspondenciaLocal) {
    const slug = correspondenciaLocal[2];
    return {
      srcPrimaria: `img/${slug}.webp?${VERSAO_IMAGENS_CATALOGO}`,
      srcFallback: `img/${slug}.jpg?${VERSAO_IMAGENS_CATALOGO}`
    };
  }
  return {
    srcPrimaria: limpo,
    srcFallback: ""
  };
}

// 9 & 10. Remove skeleton ao carregar, tenta fallback .jpg e, se falhar, exibe placeholder SVG
window.marcarImagemCarregada = function marcarImagemCarregada(elementoImg) {
  if (!elementoImg) return;
  elementoImg.classList.add("img-carregada");
  const container = elementoImg.closest(".img-skeleton") || elementoImg.parentElement;
  if (container) {
    container.classList.add("carregado");
  }
};

window.tratarErroImagem = function tratarErroImagem(elementoImg, categoria, codigo) {
  if (!elementoImg) return;
  const fallbackJpg = elementoImg.getAttribute("data-fallback-src");
  if (fallbackJpg && !elementoImg.dataset.tentouFallback && elementoImg.getAttribute("src") !== fallbackJpg) {
    elementoImg.dataset.tentouFallback = "1";
    elementoImg.src = fallbackJpg;
    return;
  }

  const container = elementoImg.closest(".img-skeleton") || elementoImg.parentElement;
  if (!container) return;
  container.classList.add("carregado");
  container.innerHTML = `
    <div class="img-fallback" role="img" aria-label="Ilustração da categoria ${escaparHtml(categoria)}">
      ${obterIconeCategoria(categoria)}
      <span class="text-xs font-semibold">${escaparHtml(categoria)}</span>
      <span class="text-[11px] opacity-80 tabular-nums">${escaparHtml(codigo)}</span>
    </div>
  `;
};

window.tratarErroMiniaturaSacola = function tratarErroMiniaturaSacola(elementoImg, categoria) {
  if (!elementoImg) return;
  const fallbackJpg = elementoImg.getAttribute("data-fallback-src");
  if (fallbackJpg && !elementoImg.dataset.tentouFallback && elementoImg.getAttribute("src") !== fallbackJpg) {
    elementoImg.dataset.tentouFallback = "1";
    elementoImg.src = fallbackJpg;
    return;
  }
  const container = elementoImg.parentElement;
  if (!container) return;
  container.innerHTML = `<span class="icon-accent">${obterIconeCategoria(categoria, 24)}</span>`;
};

/* ==========================================================================
   1 & 3. NAVEGAÇÃO POR HASH (#catalogo, #como-comprar, #entrega, #contato)
   Compatível com botão "Voltar" do navegador e links diretos
   ========================================================================== */
function alternarMenuMobile(abrir) {
  const menu = document.getElementById("menu-mobile");
  const botao = document.getElementById("btn-menu-mobile");
  const iconeAbrir = document.getElementById("icone-menu-abrir");
  const iconeFechar = document.getElementById("icone-menu-fechar");
  if (!menu || !botao) return;

  estado.menuMobileAberto = typeof abrir === "boolean" ? abrir : !estado.menuMobileAberto;
  menu.hidden = !estado.menuMobileAberto;
  botao.setAttribute("aria-expanded", estado.menuMobileAberto ? "true" : "false");
  if (iconeAbrir) iconeAbrir.hidden = estado.menuMobileAberto;
  if (iconeFechar) iconeFechar.hidden = !estado.menuMobileAberto;
}

function exibirSecao(nomeSecao, rolarTopo = false) {
  const secaoValida = SECOES_VALIDAS.includes(nomeSecao) ? nomeSecao : "catalogo";
  estado.secaoAtiva = secaoValida;

  // Atualiza sublinhado azul em todos os links de navegação (desktop e mobile)
  document.querySelectorAll("[data-secao-link]").forEach((link) => {
    const ativo = link.getAttribute("data-secao-link") === secaoValida;
    if (ativo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Exibe apenas a seção ativa com transição suave
  document.querySelectorAll("[data-secao-painel]").forEach((painel) => {
    const ativo = painel.getAttribute("data-secao-painel") === secaoValida;
    if (ativo) {
      painel.hidden = false;
      painel.classList.remove("secao-animada");
      void painel.offsetWidth;
      painel.classList.add("secao-animada");
    } else {
      painel.hidden = true;
      painel.classList.remove("secao-animada");
    }
  });

  // Fecha menu mobile caso estivesse aberto
  if (estado.menuMobileAberto) {
    alternarMenuMobile(false);
  }

  if (secaoValida === "catalogo") {
    observarCardsProdutosNaGrade(document.getElementById("grade-produtos"), true);
  }

  if (rolarTopo) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function sincronizarSecaoPeloHash(rolarTopo = false) {
  const hashLimpo = (window.location.hash || "").replace(/^#/, "").trim();
  const destino = SECOES_VALIDAS.includes(hashLimpo) ? hashLimpo : "catalogo";
  exibirSecao(destino, rolarTopo);
}

/* ==========================================================================
   14 & 15. STATUS "ABERTO AGORA" / "FECHADO" E DESTAQUE DO DIA NA TABELA
   Horário oficial (fuso de Brasília): Seg–Sex 08h–18h | Sáb 08h–15h | Dom fechado
   ========================================================================== */
function atualizarHorarioFuncionamento() {
  const selo = document.getElementById("selo-status-horario");
  const tabela = document.getElementById("tabela-horarios");

  // Obtém dia e hora atuais no fuso de São Pedro da Aldeia / Brasília
  let diaSemana = new Date().getDay();
  let minutosAtuais = new Date().getHours() * 60 + new Date().getMinutes();

  try {
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date());

    const mapaDias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const wk = partes.find((p) => p.type === "weekday");
    const hr = partes.find((p) => p.type === "hour");
    const mn = partes.find((p) => p.type === "minute");
    if (wk && hr && mn && mapaDias[wk.value] !== undefined) {
      diaSemana = mapaDias[wk.value];
      minutosAtuais = (Number(hr.value) % 24) * 60 + Number(mn.value);
    }
  } catch (_) {
    // Mantém hora local do dispositivo como fallback seguro
  }

  let estaAberto = false;
  if (diaSemana >= 1 && diaSemana <= 5) {
    estaAberto = minutosAtuais >= 8 * 60 && minutosAtuais < 18 * 60;
  } else if (diaSemana === 6) {
    estaAberto = minutosAtuais >= 8 * 60 && minutosAtuais < 15 * 60;
  }

  if (selo) {
    if (estaAberto) {
      selo.textContent = "Aberto agora";
      selo.className = "store-hours-badge store-open";
    } else {
      selo.textContent = "Fechado · abre às 08h";
      selo.className = "store-hours-badge store-closed";
    }
  }

  // Destaca a linha correspondente ao dia de hoje na tabela
  if (tabela) {
    tabela.querySelectorAll("tr[data-dia-semana]").forEach((linha) => {
      const ehHoje = Number(linha.getAttribute("data-dia-semana")) === diaSemana;
      linha.classList.toggle("dia-atual", ehHoje);
      const primeiraCelula = linha.querySelector("td");
      if (primeiraCelula) {
        const nomeBase = primeiraCelula.getAttribute("data-nome-dia") || primeiraCelula.textContent.replace(" (Hoje)", "");
        primeiraCelula.setAttribute("data-nome-dia", nomeBase);
        primeiraCelula.textContent = ehHoje ? `${nomeBase} (Hoje)` : nomeBase;
      }
    });
  }
}

/* ==========================================================================
   7. CONTADOR E PAINEL RECOLHÍVEL DE FILTROS + ORDENAÇÃO E BUSCA
   ========================================================================== */
function contarFiltrosSecundariosAtivos() {
  let total = 0;
  if (estado.ordem !== "padrao") total += 1;
  if (estado.disponibilidade !== "todos") total += 1;
  if (estado.faixaPreco !== "todos") total += 1;
  return total;
}

function alternarPainelFiltros(forcarEstado) {
  const painel = document.getElementById("painel-filtros");
  const botao = document.getElementById("btn-toggle-filtros");
  if (!painel || !botao) return;

  estado.filtrosAbertos = typeof forcarEstado === "boolean" ? forcarEstado : !estado.filtrosAbertos;
  painel.hidden = !estado.filtrosAbertos;
  botao.setAttribute("aria-expanded", estado.filtrosAbertos ? "true" : "false");
}

function filtrarProdutos() {
  const termo = normalizarTexto(estado.busca);

  const filtrados = PRODUTOS.filter((produto) => {
    if (estado.categoria !== "Todos" && produto.categoria !== estado.categoria) {
      return false;
    }

    if (termo) {
      const alvo = normalizarTexto(`${produto.nome} ${produto.codigo} ${produto.categoria}`);
      if (!alvo.includes(termo)) {
        return false;
      }
    }

    if (estado.disponibilidade === "disponiveis" && !produto.disponivel) {
      return false;
    }
    if (estado.disponibilidade === "promocao" && !produto.promocao) {
      return false;
    }

    const precoFinal = obterPrecoFinal(produto);
    if (estado.faixaPreco === "ate-30" && precoFinal > 30) return false;
    if (estado.faixaPreco === "30-100" && (precoFinal < 30 || precoFinal > 100)) return false;
    if (estado.faixaPreco === "acima-100" && precoFinal <= 100) return false;

    return true;
  });

  filtrados.sort((a, b) => {
    if (estado.ordem === "menor-preco") {
      return obterPrecoFinal(a) - obterPrecoFinal(b);
    }
    if (estado.ordem === "maior-preco") {
      return obterPrecoFinal(b) - obterPrecoFinal(a);
    }
    if (estado.ordem === "az") {
      return a.nome.localeCompare(b.nome, "pt-BR");
    }
    return (Number(a.ordem ?? a.id) || 0) - (Number(b.ordem ?? b.id) || 0);
  });

  return filtrados;
}

/* ==========================================================================
   RENDERIZAÇÃO DE CATEGORIAS E CARDS DO CATÁLOGO
   ========================================================================== */
function renderizarCategorias() {
  const containerChips = document.getElementById("lista-categorias");
  const containerCards = document.getElementById("grade-categorias-cards");
  const btnTodasCategorias = document.getElementById("btn-ver-todas-categorias");

  if (containerChips) {
    containerChips.innerHTML = CATEGORIAS.map((cat) => {
      const ativa = estado.categoria === cat;
      return `
        <button
          type="button"
          role="tab"
          aria-selected="${ativa ? "true" : "false"}"
          data-categoria="${escaparHtml(cat)}"
          class="cat-chip focus-ring"
        >
          ${escaparHtml(cat)}
        </button>
      `;
    }).join("");
  }

  if (containerCards) {
    const categoriasLoja = CATEGORIAS.filter((cat) => cat !== "Todos");
    containerCards.innerHTML = categoriasLoja
      .map((cat) => {
        const ativa = estado.categoria === cat;
        const qtdItens = PRODUTOS.filter((item) => item.categoria === cat).length;
        const legendaQtd = qtdItens === 1 ? "1 item" : `${qtdItens} itens`;
        return `
          <button
            type="button"
            data-card-categoria="${escaparHtml(cat)}"
            aria-pressed="${ativa ? "true" : "false"}"
            class="category-visual-card focus-ring"
          >
            <span class="category-card-icon" aria-hidden="true">
              ${obterIconeCategoria(cat, 22)}
            </span>
            <div>
              <p class="category-card-name">${escaparHtml(cat)}</p>
              <p class="category-card-count tabular-nums">${legendaQtd}</p>
            </div>
          </button>
        `;
      })
      .join("");
  }

  if (btnTodasCategorias) {
    btnTodasCategorias.hidden = estado.categoria === "Todos";
  }
}

function obterQuantidadeNaSacola(produto) {
  const item = estado.sacolaItens.find(
    (entrada) =>
      String(entrada.codigo) === String(produto.codigo) ||
      String(entrada.id) === String(produto.id)
  );
  return item ? item.quantidade : 0;
}

function obterRotuloBotaoCardSacola(qtdNaLista) {
  return qtdNaLista > 0 ? `✓ Na lista (${qtdNaLista}) · +1` : "+ Adicionar à lista";
}

function criarCardProduto(produto) {
  const precoFinal = obterPrecoFinal(produto);
  const temPromocao = produto.promocao && typeof produto.precoPromocional === "number";
  const linkWhats = gerarLinkWhatsAppProduto(produto);
  const fontesImg = resolverFontesImagem(produto.imagem, produto.codigo);
  const qtdNaLista = obterQuantidadeNaSacola(produto);

  const seloDisponibilidade = produto.disponivel
    ? '<span class="status-badge status-disponivel">✓ Disponível</span>'
    : '<span class="status-badge status-indisponivel">✕ Indisponível</span>';

  const seloPromocao = temPromocao ? '<span class="promo-tag">Promoção</span>' : "";

  const htmlPrecoAntigo = temPromocao
    ? `<span class="price-old tabular-nums">${formatarMoeda(produto.preco)}</span>`
    : '<span class="price-old invisible" aria-hidden="true">-</span>';

  return `
    <article
      class="product-card focus-ring"
      tabindex="0"
      data-produto-id="${escaparHtml(String(produto.id))}"
      aria-label="Ver detalhes de ${escaparHtml(produto.nome)}"
    >
      <div class="product-media img-skeleton">
        ${seloPromocao}
        <img
          src="${escaparHtml(fontesImg.srcPrimaria)}"
          data-fallback-src="${escaparHtml(fontesImg.srcFallback)}"
          alt="${escaparHtml(produto.nome)} - ${escaparHtml(produto.categoria)} na loja ${escaparHtml(NOME_LOJA)}"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          onload="window.marcarImagemCarregada(this)"
          onerror="window.tratarErroImagem(this, '${escaparHtml(produto.categoria)}', '${escaparHtml(produto.codigo)}')"
        />
      </div>

      <div class="card-body">
        <div>
          <div class="card-meta-top">
            <span class="card-code tabular-nums">Cód. ${escaparHtml(produto.codigo)}</span>
            ${seloDisponibilidade}
          </div>

          <h3 class="card-title">
            ${escaparHtml(produto.nome)}
          </h3>

          <p class="card-desc">
            ${escaparHtml(produto.descricao)}
          </p>
        </div>

        <div class="card-footer-box">
          <div class="price-block">
            ${htmlPrecoAntigo}
            <div class="price-inline">
              <span class="price-current tabular-nums">${formatarMoeda(precoFinal)}</span>
              <span class="price-unit">· ${escaparHtml(produto.unidade)}</span>
            </div>
          </div>

          <div class="card-actions-stack">
            <button
              type="button"
              data-adicionar-sacola="${escaparHtml(String(produto.id))}"
              data-codigo-produto="${escaparHtml(String(produto.codigo))}"
              class="btn-add-bag-card tabular-nums focus-ring ${qtdNaLista > 0 ? "in-bag" : ""}"
              aria-label="Adicionar ${escaparHtml(produto.nome)} à lista de orçamento"
            >
              ${escaparHtml(obterRotuloBotaoCardSacola(qtdNaLista))}
            </button>

            <a
              href="${linkWhats}"
              target="_blank"
              rel="noopener noreferrer"
              data-acao-whatsapp="true"
              class="btn-whatsapp card-whatsapp-btn focus-ring"
              aria-label="Pedir orçamento de ${escaparHtml(produto.nome)} no WhatsApp"
            >
              <svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.33-1.66a11.87 11.87 0 0 0 5.73 1.46h.01c6.55 0 11.89-5.34 11.9-11.9a11.82 11.82 0 0 0-3.45-8.42ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.75.98 1-3.66-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.89-9.89 9.89Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
              </svg>
              <span>Pedir orçamento</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

function atualizarCatalogo() {
  const grade = document.getElementById("grade-produtos");
  const estadoVazio = document.getElementById("estado-vazio");
  const contador = document.getElementById("contador-produtos");
  const btnResetar = document.getElementById("btn-resetar-filtros");
  const btnLimparRapido = document.getElementById("btn-limpar-rapido");
  const btnLimparBusca = document.getElementById("btn-limpar-busca");
  const badgeFiltros = document.getElementById("contador-filtros-ativos");

  const lista = filtrarProdutos();
  const qtdFiltrosSecundarios = contarFiltrosSecundariosAtivos();

  if (badgeFiltros) {
    badgeFiltros.textContent = String(qtdFiltrosSecundarios);
    badgeFiltros.hidden = qtdFiltrosSecundarios === 0;
  }

  const temQualquerFiltro =
    estado.busca.trim() !== "" ||
    estado.categoria !== "Todos" ||
    qtdFiltrosSecundarios > 0;

  if (btnResetar) btnResetar.hidden = qtdFiltrosSecundarios === 0;
  if (btnLimparRapido) btnLimparRapido.hidden = !temQualquerFiltro;
  if (btnLimparBusca) btnLimparBusca.hidden = estado.busca.trim() === "";

  if (contador) {
    contador.textContent =
      lista.length === 1
        ? "1 produto encontrado"
        : `${lista.length} produtos encontrados`;
  }

  if (lista.length === 0) {
    if (observadorCardsCatalogo) {
      observadorCardsCatalogo.disconnect();
      observadorCardsCatalogo = null;
    }
    grade.innerHTML = "";
    grade.hidden = true;
    estadoVazio.hidden = false;
  } else {
    estadoVazio.hidden = true;
    grade.hidden = false;
    grade.innerHTML = lista.map(criarCardProduto).join("");

    // Garante transição imediata para imagens já em cache
    grade.querySelectorAll(".product-media img").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        window.marcarImagemCarregada(img);
      }
    });

    // Ativa animação fade-in + slide-up ao rolar em 60fps via IntersectionObserver
    observarCardsProdutosNaGrade(grade, false);
  }
}

let observadorCardsCatalogo = null;

function observarCardsProdutosNaGrade(grade, preservarRevelados = false) {
  if (observadorCardsCatalogo) {
    observadorCardsCatalogo.disconnect();
    observadorCardsCatalogo = null;
  }

  if (!grade || grade.hidden) return;

  const todosOsCards = Array.from(grade.querySelectorAll(".product-card"));
  if (!todosOsCards.length) return;

  const prefereMenosMovimento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefereMenosMovimento || !("IntersectionObserver" in window)) {
    todosOsCards.forEach((card) => {
      card.classList.remove("card-scroll-reveal", "is-revealed");
      card.style.removeProperty("--card-reveal-delay");
      card.dataset.cardRevealed = "1";
    });
    return;
  }

  const cardsPendentes = [];
  todosOsCards.forEach((card) => {
    if (preservarRevelados && card.dataset.cardRevealed === "1") {
      return;
    }
    card.dataset.cardRevealed = "0";
    card.classList.remove("is-revealed");
    card.classList.add("card-scroll-reveal");
    cardsPendentes.push(card);
  });

  if (!cardsPendentes.length) return;

  // Se o painel do catálogo estiver oculto (ex.: site aberto direto em #entrega), aguarda exibição
  const painelCatalogo = grade.closest("[data-secao-painel]");
  if (painelCatalogo && painelCatalogo.hidden) {
    return;
  }

  observadorCardsCatalogo = new IntersectionObserver(
    (entradas, obs) => {
      const visiveisAgora = entradas
        .filter((entrada) => entrada.isIntersecting)
        .sort((a, b) => {
          const diffTop = a.boundingClientRect.top - b.boundingClientRect.top;
          if (Math.abs(diffTop) > 12) return diffTop;
          return a.boundingClientRect.left - b.boundingClientRect.left;
        });

      if (!visiveisAgora.length) return;

      visiveisAgora.forEach((entrada, indiceLote) => {
        const card = entrada.target;
        obs.unobserve(card);
        if (card.dataset.cardRevealed === "1") return;
        card.dataset.cardRevealed = "1";

        const atrasoMs = Math.min(indiceLote * 55, 220);
        card.style.setProperty("--card-reveal-delay", `${atrasoMs}ms`);

        const limparEstadoTransicao = () => {
          card.classList.remove("card-scroll-reveal", "is-revealed");
          card.style.removeProperty("--card-reveal-delay");
        };

        let finalizado = false;
        const concluirUmaVez = (evento) => {
          if (evento && evento.target !== card) return;
          if (evento && evento.propertyName && evento.propertyName !== "transform") return;
          if (finalizado) return;
          finalizado = true;
          card.removeEventListener("transitionend", concluirUmaVez);
          limparEstadoTransicao();
        };

        card.addEventListener("transitionend", concluirUmaVez);
        window.setTimeout(concluirUmaVez, atrasoMs + 560);

        window.requestAnimationFrame(() => {
          card.classList.add("is-revealed");
        });
      });
    },
    {
      root: null,
      threshold: 0.08,
      rootMargin: "0px 0px -24px 0px"
    }
  );

  cardsPendentes.forEach((card) => observadorCardsCatalogo.observe(card));
}

/* ==========================================================================
   SACOLA / LISTA DE ORÇAMENTO COM MÚLTIPLOS ITENS (PERSISTÊNCIA LOCAL)
   ========================================================================== */
let timerBumpSacola = null;
let timerFeedbackModalLista = null;

function carregarSacolaSalva() {
  try {
    const brutoItens = localStorage.getItem(CHAVE_SACOLA_ITENS);
    if (brutoItens) {
      const lista = JSON.parse(brutoItens);
      if (Array.isArray(lista)) {
        estado.sacolaItens = lista
          .filter((item) => item && item.codigo && item.nome && Number(item.quantidade) > 0)
          .map((item) => ({
            id: item.id,
            codigo: String(item.codigo),
            nome: String(item.nome),
            categoria: String(item.categoria || "Materiais de Construção"),
            precoUnitario: Number(item.precoUnitario) || 0,
            unidade: String(item.unidade || "unidade"),
            imagem: String(item.imagem || ""),
            quantidade: Math.min(999, Math.max(1, Math.round(Number(item.quantidade) || 1)))
          }));
      }
    }

    const brutoPrefs = localStorage.getItem(CHAVE_SACOLA_PREFS);
    if (brutoPrefs) {
      const prefs = JSON.parse(brutoPrefs);
      if (prefs && typeof prefs === "object") {
        estado.sacolaModalidade = prefs.modalidade === "retirada" ? "retirada" : "entrega";
        estado.sacolaBairro = String(prefs.bairro || "").slice(0, 80);
        estado.sacolaObservacao = String(prefs.observacao || "").slice(0, 140);
      }
    }
  } catch (_) {
    estado.sacolaItens = [];
  }

  sincronizarInputsPreferenciasSacola();
  sincronizarPrecosSacolaComCatalogo();
  atualizarInterfaceSacola(false);
}

function salvarSacolaLocal() {
  try {
    localStorage.setItem(CHAVE_SACOLA_ITENS, JSON.stringify(estado.sacolaItens));
    localStorage.setItem(
      CHAVE_SACOLA_PREFS,
      JSON.stringify({
        modalidade: estado.sacolaModalidade,
        bairro: estado.sacolaBairro,
        observacao: estado.sacolaObservacao
      })
    );
  } catch (_) {
    // Ignora bloqueio de armazenamento privado
  }
}

function sincronizarInputsPreferenciasSacola() {
  document.querySelectorAll('input[name="sacola-modalidade"]').forEach((radio) => {
    radio.checked = radio.value === estado.sacolaModalidade;
  });

  const campoBairroWrap = document.getElementById("sacola-campo-bairro-wrap");
  if (campoBairroWrap) {
    campoBairroWrap.hidden = estado.sacolaModalidade === "retirada";
  }

  const inputBairro = document.getElementById("sacola-bairro");
  if (inputBairro && inputBairro.value !== estado.sacolaBairro) {
    inputBairro.value = estado.sacolaBairro;
  }

  const inputObs = document.getElementById("sacola-observacao");
  if (inputObs && inputObs.value !== estado.sacolaObservacao) {
    inputObs.value = estado.sacolaObservacao;
  }
}

function sincronizarPrecosSacolaComCatalogo() {
  if (!estado.sacolaItens.length) return;
  let alterou = false;

  estado.sacolaItens.forEach((entrada) => {
    const atualizado = PRODUTOS.find(
      (p) => String(p.codigo) === String(entrada.codigo) || String(p.id) === String(entrada.id)
    );
    if (atualizado) {
      const novoPreco = obterPrecoFinal(atualizado);
      if (
        entrada.precoUnitario !== novoPreco ||
        entrada.nome !== atualizado.nome ||
        entrada.unidade !== atualizado.unidade ||
        entrada.imagem !== atualizado.imagem
      ) {
        entrada.id = atualizado.id;
        entrada.nome = atualizado.nome;
        entrada.categoria = atualizado.categoria;
        entrada.precoUnitario = novoPreco;
        entrada.unidade = atualizado.unidade;
        entrada.imagem = atualizado.imagem;
        alterou = true;
      }
    }
  });

  if (alterou) {
    salvarSacolaLocal();
  }
}

function sincronizarBotoesSacolaNosCards() {
  document.querySelectorAll("[data-adicionar-sacola]").forEach((botao) => {
    const codigo = botao.getAttribute("data-codigo-produto") || "";
    const id = botao.getAttribute("data-adicionar-sacola") || "";
    const item = estado.sacolaItens.find(
      (entrada) => String(entrada.codigo) === codigo || String(entrada.id) === id
    );
    const qtd = item ? item.quantidade : 0;
    botao.textContent = obterRotuloBotaoCardSacola(qtd);
    botao.classList.toggle("in-bag", qtd > 0);
  });
}

function gerarLinkWhatsAppSacola() {
  if (!estado.sacolaItens.length) {
    return gerarLinkWhatsAppGeral();
  }

  const linhasItens = estado.sacolaItens.map((item) => {
    const subtotal = item.precoUnitario * item.quantidade;
    return `• ${item.quantidade}x ${item.nome} (cód. ${item.codigo}) — ${formatarMoeda(item.precoUnitario)} / ${item.unidade} = ${formatarMoeda(subtotal)}`;
  });

  const totalGeral = estado.sacolaItens.reduce(
    (soma, item) => soma + item.precoUnitario * item.quantidade,
    0
  );

  const bairroLimpo = estado.sacolaBairro.trim();
  const obsLimpa = estado.sacolaObservacao.trim();

  const linhaRecebimento =
    estado.sacolaModalidade === "retirada"
      ? "Recebimento: Retirar na loja (Estr. da Cruz – Flexeira)"
      : bairroLimpo
        ? `Recebimento: Entrega no endereço (Bairro: ${bairroLimpo})`
        : "Recebimento: Entrega no endereço (informarei o bairro a seguir)";

  const partesMensagem = [
    `Olá! Vim pelo catálogo da ${NOME_LOJA} e montei minha lista de orçamento:`,
    "",
    ...linhasItens,
    "",
    `Total estimado dos itens: ${formatarMoeda(totalGeral)}`,
    linhaRecebimento
  ];

  if (obsLimpa) {
    partesMensagem.push(`Observações: ${obsLimpa}`);
  }

  partesMensagem.push("", "Podem confirmar a disponibilidade e o valor final?");

  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(partesMensagem.join("\n"))}`;
}

function atualizarInterfaceSacola(animarBadge = false) {
  const badge = document.getElementById("contador-sacola");
  const btnAbrirSacola = document.getElementById("btn-abrir-sacola");
  const subtitulo = document.getElementById("sacola-subtitulo");
  const boxVazia = document.getElementById("sacola-vazia");
  const boxCheia = document.getElementById("sacola-conteudo-cheio");
  const listaEl = document.getElementById("sacola-lista-itens");
  const rodape = document.getElementById("sacola-rodape");
  const totalEl = document.getElementById("sacola-total-estimado");
  const btnEnviar = document.getElementById("btn-enviar-lista-whatsapp");
  const btnLimpar = document.getElementById("btn-limpar-sacola");
  const notaRodape = document.querySelector(".bag-total-note");

  const totalVolumes = estado.sacolaItens.reduce((acc, item) => acc + item.quantidade, 0);
  const qtdProdutosDistintos = estado.sacolaItens.length;
  const valorTotal = estado.sacolaItens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );

  if (badge) {
    badge.textContent = String(totalVolumes);
    badge.hidden = totalVolumes === 0;
  }

  if (btnAbrirSacola) {
    btnAbrirSacola.setAttribute(
      "aria-label",
      totalVolumes > 0
        ? `Abrir lista de orçamento com ${totalVolumes} ${totalVolumes === 1 ? "item" : "itens"}`
        : "Abrir lista de orçamento"
    );

    if (animarBadge) {
      btnAbrirSacola.classList.add("bag-bump");
      if (timerBumpSacola) clearTimeout(timerBumpSacola);
      timerBumpSacola = setTimeout(() => {
        btnAbrirSacola.classList.remove("bag-bump");
      }, 240);
    }
  }

  if (notaRodape) {
    notaRodape.textContent =
      estado.sacolaModalidade === "retirada"
        ? "(retirada na loja sem taxa de frete)"
        : "(frete a confirmar conforme bairro)";
  }

  if (btnLimpar) {
    btnLimpar.textContent = estado.confirmandoLimparSacola
      ? "Confirmar esvaziar lista?"
      : "Esvaziar lista";
  }

  sincronizarBotoesSacolaNosCards();

  if (!boxVazia || !boxCheia || !listaEl || !rodape) return;

  if (qtdProdutosDistintos === 0) {
    boxVazia.hidden = false;
    boxCheia.hidden = true;
    rodape.hidden = true;
    listaEl.innerHTML = "";
    if (subtitulo) {
      subtitulo.textContent = "Monte sua lista de materiais e envie tudo junto no WhatsApp";
    }
    return;
  }

  boxVazia.hidden = true;
  boxCheia.hidden = false;
  rodape.hidden = false;

  if (subtitulo) {
    const txtProd = qtdProdutosDistintos === 1 ? "1 produto" : `${qtdProdutosDistintos} produtos`;
    const txtVol = totalVolumes === 1 ? "1 volume" : `${totalVolumes} volumes`;
    subtitulo.textContent = `${txtProd} (${txtVol}) na sua lista de orçamento`;
  }

  listaEl.innerHTML = estado.sacolaItens
    .map((item) => {
      const subtotal = item.precoUnitario * item.quantidade;
      const fontesImg = resolverFontesImagem(item.imagem, item.codigo);
      return `
        <div class="bag-item-row" data-sacola-codigo="${escaparHtml(item.codigo)}">
          <div class="bag-item-top">
            <div class="bag-item-thumb">
              <img
                src="${escaparHtml(fontesImg.srcPrimaria)}"
                data-fallback-src="${escaparHtml(fontesImg.srcFallback)}"
                alt="${escaparHtml(item.nome)}"
                loading="lazy"
                referrerpolicy="no-referrer"
                onerror="window.tratarErroMiniaturaSacola(this, '${escaparHtml(item.categoria)}')"
              />
            </div>
            <div class="bag-item-info">
              <p class="bag-item-name">${escaparHtml(item.nome)}</p>
              <p class="bag-item-meta tabular-nums">
                Cód. ${escaparHtml(item.codigo)} · ${formatarMoeda(item.precoUnitario)} / ${escaparHtml(item.unidade)}
              </p>
            </div>
          </div>

          <div class="bag-item-bottom">
            <span class="bag-item-subtotal tabular-nums">${formatarMoeda(subtotal)}</span>

            <div class="bag-item-controls">
              <div class="qty-stepper qty-stepper-sm" aria-label="Quantidade de ${escaparHtml(item.nome)}">
                <button
                  type="button"
                  data-sacola-acao="diminuir"
                  data-codigo="${escaparHtml(item.codigo)}"
                  class="qty-step-btn focus-ring"
                  aria-label="Diminuir quantidade de ${escaparHtml(item.nome)}"
                >−</button>
                <span class="qty-step-val tabular-nums">${item.quantidade}</span>
                <button
                  type="button"
                  data-sacola-acao="aumentar"
                  data-codigo="${escaparHtml(item.codigo)}"
                  class="qty-step-btn focus-ring"
                  aria-label="Aumentar quantidade de ${escaparHtml(item.nome)}"
                >+</button>
              </div>

              <button
                type="button"
                data-sacola-acao="remover"
                data-codigo="${escaparHtml(item.codigo)}"
                class="bag-remove-btn focus-ring"
                aria-label="Remover ${escaparHtml(item.nome)} da lista"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (totalEl) {
    totalEl.textContent = formatarMoeda(valorTotal);
  }

  if (btnEnviar) {
    btnEnviar.href = gerarLinkWhatsAppSacola();
  }
}

function adicionarProdutoNaSacola(produto, quantidade = 1) {
  if (!produto) return;
  const qtdAdicionar = Math.min(999, Math.max(1, Math.round(Number(quantidade) || 1)));
  const precoUnitario = obterPrecoFinal(produto);

  const existente = estado.sacolaItens.find(
    (item) =>
      String(item.codigo) === String(produto.codigo) ||
      String(item.id) === String(produto.id)
  );

  if (existente) {
    existente.quantidade = Math.min(999, existente.quantidade + qtdAdicionar);
    existente.precoUnitario = precoUnitario;
    existente.nome = produto.nome;
    existente.unidade = produto.unidade;
    existente.imagem = produto.imagem;
  } else {
    estado.sacolaItens.push({
      id: produto.id,
      codigo: String(produto.codigo),
      nome: String(produto.nome),
      categoria: String(produto.categoria),
      precoUnitario,
      unidade: String(produto.unidade),
      imagem: String(produto.imagem),
      quantidade: qtdAdicionar
    });
  }

  estado.confirmandoLimparSacola = false;
  salvarSacolaLocal();
  atualizarInterfaceSacola(true);
}

function alterarQuantidadeItemSacola(codigo, delta) {
  const indice = estado.sacolaItens.findIndex((item) => String(item.codigo) === String(codigo));
  if (indice === -1) return;

  const novaQtd = estado.sacolaItens[indice].quantidade + delta;
  if (novaQtd <= 0) {
    estado.sacolaItens.splice(indice, 1);
  } else {
    estado.sacolaItens[indice].quantidade = Math.min(999, novaQtd);
  }

  estado.confirmandoLimparSacola = false;
  salvarSacolaLocal();
  atualizarInterfaceSacola(false);
}

function removerItemDaSacola(codigo) {
  estado.sacolaItens = estado.sacolaItens.filter((item) => String(item.codigo) !== String(codigo));
  estado.confirmandoLimparSacola = false;
  salvarSacolaLocal();
  atualizarInterfaceSacola(false);
}

function acionarLimparSacola() {
  if (!estado.confirmandoLimparSacola) {
    estado.confirmandoLimparSacola = true;
    atualizarInterfaceSacola(false);
    return;
  }
  estado.sacolaItens = [];
  estado.confirmandoLimparSacola = false;
  salvarSacolaLocal();
  atualizarInterfaceSacola(false);
}

function abrirModalSacola() {
  const modalSacola = document.getElementById("modal-sacola");
  const btnFechar = document.getElementById("btn-fechar-sacola");
  if (!modalSacola) return;

  estado.ultimoElementoFocado = document.activeElement;
  estado.sacolaAberta = true;
  estado.confirmandoLimparSacola = false;
  sincronizarInputsPreferenciasSacola();
  atualizarInterfaceSacola(false);

  modalSacola.hidden = false;
  document.body.classList.add("modal-aberto");
  if (btnFechar) btnFechar.focus();
}

function fecharModalSacola() {
  const modalSacola = document.getElementById("modal-sacola");
  const modalProduto = document.getElementById("modal-produto");
  if (!modalSacola || modalSacola.hidden) return;

  modalSacola.hidden = true;
  estado.sacolaAberta = false;
  estado.confirmandoLimparSacola = false;

  if (!modalProduto || modalProduto.hidden) {
    document.body.classList.remove("modal-aberto");
  }

  if (estado.ultimoElementoFocado && typeof estado.ultimoElementoFocado.focus === "function") {
    estado.ultimoElementoFocado.focus();
  }
}

/* ==========================================================================
   MODAL DE DETALHES DO PRODUTO
   ========================================================================== */
function atualizarBotaoModalAdicionarLista(produto, mensagemTemporaria) {
  const btnLista = document.getElementById("modal-btn-adicionar-lista");
  const qtdEl = document.getElementById("modal-qtd-valor");
  if (qtdEl) {
    qtdEl.textContent = String(estado.qtdModal);
  }
  if (!btnLista) return;

  if (mensagemTemporaria) {
    btnLista.textContent = mensagemTemporaria;
    return;
  }

  const jaNaLista = produto ? obterQuantidadeNaSacola(produto) : 0;
  btnLista.textContent =
    jaNaLista > 0
      ? `+ Adicionar (${jaNaLista} na lista)`
      : "+ Adicionar à lista";
}

function abrirModalProduto(idProduto) {
  const produto = PRODUTOS.find((item) => String(item.id) === String(idProduto));
  if (!produto) return;

  estado.ultimoElementoFocado = document.activeElement;
  estado.produtoModalAtualId = produto.id;
  estado.qtdModal = 1;
  if (timerFeedbackModalLista) {
    clearTimeout(timerFeedbackModalLista);
    timerFeedbackModalLista = null;
  }

  const modal = document.getElementById("modal-produto");
  const containerImg = document.getElementById("modal-container-imagem");
  const meta = document.getElementById("modal-meta");
  const disponibilidade = document.getElementById("modal-disponibilidade");
  const titulo = document.getElementById("modal-titulo");
  const descricao = document.getElementById("modal-descricao");
  const precoAntigo = document.getElementById("modal-preco-antigo");
  const precoAtual = document.getElementById("modal-preco-atual");
  const unidade = document.getElementById("modal-unidade");
  const seloPromo = document.getElementById("modal-selo-promocao");
  const btnWhats = document.getElementById("modal-btn-whatsapp");
  const btnFechar = document.getElementById("btn-fechar-modal");

  const temPromocao = produto.promocao && typeof produto.precoPromocional === "number";
  const precoFinal = obterPrecoFinal(produto);
  const fontesImg = resolverFontesImagem(produto.imagem, produto.codigo);

  containerImg.classList.remove("carregado");
  containerImg.innerHTML = `
    <img
      src="${escaparHtml(fontesImg.srcPrimaria)}"
      data-fallback-src="${escaparHtml(fontesImg.srcFallback)}"
      alt="${escaparHtml(produto.nome)} - foto ampliada"
      referrerpolicy="no-referrer"
      onload="window.marcarImagemCarregada(this)"
      onerror="window.tratarErroImagem(this, '${escaparHtml(produto.categoria)}', '${escaparHtml(produto.codigo)}')"
    />
  `;

  const imgModal = containerImg.querySelector("img");
  if (imgModal && imgModal.complete && imgModal.naturalWidth > 0) {
    window.marcarImagemCarregada(imgModal);
  }

  meta.textContent = `${produto.categoria} · Cód. ${produto.codigo}`;
  disponibilidade.innerHTML = produto.disponivel
    ? '<span class="status-badge status-disponivel">✓ Disponível em estoque</span>'
    : '<span class="status-badge status-indisponivel">✕ Indisponível no momento</span>';

  titulo.textContent = produto.nome;
  descricao.textContent = produto.descricao;

  if (temPromocao) {
    precoAntigo.textContent = `De ${formatarMoeda(produto.preco)}`;
    precoAntigo.hidden = false;
    seloPromo.hidden = false;
  } else {
    precoAntigo.hidden = true;
    seloPromo.hidden = true;
  }

  precoAtual.textContent = formatarMoeda(precoFinal);
  unidade.textContent = `· ${produto.unidade}`;
  btnWhats.href = gerarLinkWhatsAppProduto(produto);
  atualizarBotaoModalAdicionarLista(produto);

  modal.hidden = false;
  document.body.classList.add("modal-aberto");
  if (btnFechar) btnFechar.focus();
}

function fecharModalProduto() {
  const modal = document.getElementById("modal-produto");
  const modalSacola = document.getElementById("modal-sacola");
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  if (!modalSacola || modalSacola.hidden) {
    document.body.classList.remove("modal-aberto");
  }

  if (estado.ultimoElementoFocado && typeof estado.ultimoElementoFocado.focus === "function") {
    estado.ultimoElementoFocado.focus();
  }
}

/* ==========================================================================
   16. COPIAR ENDEREÇO COM CONFIRMAÇÃO VISUAL ("Copiado!")
   ========================================================================== */
let timerCopiarEndereco = null;

function copiarEnderecoLoja() {
  const btn = document.getElementById("btn-copiar-endereco");
  const spanTexto = document.getElementById("texto-copiar-endereco");
  if (!btn || !spanTexto) return;

  const concluirCopia = () => {
    spanTexto.textContent = "Copiado!";
    btn.classList.add("copiado-sucesso");
    if (timerCopiarEndereco) clearTimeout(timerCopiarEndereco);
    timerCopiarEndereco = setTimeout(() => {
      spanTexto.textContent = "Copiar endereço";
      btn.classList.remove("copiado-sucesso");
    }, 2200);
  };

  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard.writeText(ENDERECO_LOJA).then(concluirCopia).catch(() => {
      copiarViaFallback(ENDERECO_LOJA, concluirCopia);
    });
  } else {
    copiarViaFallback(ENDERECO_LOJA, concluirCopia);
  }
}

function copiarViaFallback(texto, callback) {
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.className = "sr-only";
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand("copy");
    callback();
  } finally {
    document.body.removeChild(area);
  }
}

/* ==========================================================================
   CONFIGURAÇÃO DE LINKS E DADOS DINÂMICOS DA LOJA
   ========================================================================== */
function aplicarDadosLoja() {
  const linkGeral = gerarLinkWhatsAppGeral();

  document.querySelectorAll("[data-whatsapp-geral]").forEach((el) => {
    el.setAttribute("href", linkGeral);
  });

  const btnFrete = document.getElementById("btn-consultar-frete");
  if (btnFrete) btnFrete.setAttribute("href", gerarLinkWhatsAppFrete());

  const linkInstagramEl = document.getElementById("link-instagram");
  if (linkInstagramEl) linkInstagramEl.setAttribute("href", LINK_INSTAGRAM);

  const rodapeNome = document.getElementById("rodape-nome-loja");
  if (rodapeNome) rodapeNome.textContent = NOME_LOJA;

  const elEndereco = document.getElementById("info-endereco");
  if (elEndereco) elEndereco.textContent = ENDERECO_LOJA;

  const rodapeEndereco = document.getElementById("rodape-endereco");
  if (rodapeEndereco) rodapeEndereco.textContent = ENDERECO_LOJA;

  const elTelefone = document.getElementById("info-telefone");
  if (elTelefone) elTelefone.textContent = TELEFONE_EXIBICAO;

  const rodapeTelefone = document.getElementById("rodape-telefone");
  if (rodapeTelefone) rodapeTelefone.textContent = TELEFONE_EXIBICAO;

  const elTelefoneLink = document.getElementById("info-telefone-link");
  if (elTelefoneLink) elTelefoneLink.setAttribute("href", `tel:${TELEFONE_LINK}`);

  const rodapeTelefoneLink = document.getElementById("rodape-telefone-link");
  if (rodapeTelefoneLink) rodapeTelefoneLink.setAttribute("href", `tel:${TELEFONE_LINK}`);

  const mobileBtnLigar = document.getElementById("mobile-btn-ligar");
  if (mobileBtnLigar) mobileBtnLigar.setAttribute("href", `tel:${TELEFONE_LINK}`);

  const btnLigarAgora = document.getElementById("btn-ligar-agora");
  if (btnLigarAgora) {
    btnLigarAgora.setAttribute("href", `tel:${TELEFONE_LINK}`);
    const span = btnLigarAgora.querySelector("span");
    if (span) span.textContent = `Ligar ${TELEFONE_EXIBICAO}`;
  }

  const anoAtualEl = document.getElementById("ano-atual");
  if (anoAtualEl) anoAtualEl.textContent = String(new Date().getFullYear());

  // SEO dinâmico: canonical e og:url
  try {
    if (window.location.protocol.startsWith("http")) {
      const urlCanonica = window.location.origin + window.location.pathname;
      let linkCanonico = document.getElementById("canonical-link");
      if (!linkCanonico) {
        linkCanonico = document.createElement("link");
        linkCanonico.id = "canonical-link";
        linkCanonico.rel = "canonical";
        document.head.appendChild(linkCanonico);
      }
      linkCanonico.setAttribute("href", urlCanonica);

      let metaOgUrl = document.getElementById("og-url-meta");
      if (!metaOgUrl) {
        metaOgUrl = document.createElement("meta");
        metaOgUrl.id = "og-url-meta";
        metaOgUrl.setAttribute("property", "og:url");
        document.head.appendChild(metaOgUrl);
      }
      metaOgUrl.setAttribute("content", urlCanonica);
    }
  } catch (_) {
    // Ignora em contextos file:// locais
  }

  // Sincroniza URL do mapa e rotas com o endereço completo
  const enderecoCodificado = encodeURIComponent(ENDERECO_LOJA);
  const urlRota = `https://www.google.com/maps/dir//${enderecoCodificado}`;
  const urlEmbedMapa = `https://maps.google.com/maps?q=${enderecoCodificado}&z=16&ie=UTF8&iwloc=&output=embed`;

  const mobileBtnRota = document.getElementById("mobile-btn-rota");
  if (mobileBtnRota) mobileBtnRota.setAttribute("href", urlRota);

  const linkRotaContato = document.getElementById("link-como-chegar-contato");
  if (linkRotaContato) linkRotaContato.setAttribute("href", urlRota);

  const rodapeLinkRota = document.getElementById("rodape-link-rota");
  if (rodapeLinkRota) rodapeLinkRota.setAttribute("href", urlRota);

  const mapaIframe = document.getElementById("mapa-iframe");
  if (mapaIframe) mapaIframe.setAttribute("src", urlEmbedMapa);

  const rodapeMapaIframe = document.getElementById("rodape-mapa-iframe");
  if (rodapeMapaIframe) rodapeMapaIframe.setAttribute("src", urlEmbedMapa);

  const linkMapsAvaliacoes = document.getElementById("link-google-maps-avaliacoes");
  if (linkMapsAvaliacoes) {
    const buscaPerfil = encodeURIComponent(`${NOME_LOJA} ${ENDERECO_LOJA}`);
    linkMapsAvaliacoes.setAttribute(
      "href",
      `https://www.google.com/maps/search/?api=1&query=${buscaPerfil}`
    );
  }
}

function limparTodosFiltros() {
  estado.busca = "";
  estado.categoria = "Todos";
  estado.ordem = "padrao";
  estado.disponibilidade = "todos";
  estado.faixaPreco = "todos";

  document.getElementById("campo-busca").value = "";
  document.getElementById("filtro-ordem").value = "padrao";
  document.getElementById("filtro-disponibilidade").value = "todos";
  document.getElementById("filtro-preco").value = "todos";

  renderizarCategorias();
  atualizarCatalogo();
}

function limparApenasFiltrosSecundarios() {
  estado.ordem = "padrao";
  estado.disponibilidade = "todos";
  estado.faixaPreco = "todos";

  document.getElementById("filtro-ordem").value = "padrao";
  document.getElementById("filtro-disponibilidade").value = "todos";
  document.getElementById("filtro-preco").value = "todos";

  atualizarCatalogo();
}

function rolarParaProdutos() {
  const ancora = document.getElementById("ancora-produtos");
  if (ancora && typeof ancora.scrollIntoView === "function") {
    ancora.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ==========================================================================
   ETAPA 3: FUNDO ANIMADO MODERNO EM CANVAS PURO (MALHA DE PARTÍCULAS AZUIS)
   - Reage suavemente ao mouse/toque
   - Menos partículas em telas pequenas
   - Pausa automaticamente com a aba oculta (visibilitychange)
   - Respeita prefers-reduced-motion
   ========================================================================== */
function iniciarFundoAnimadoCanvas() {
  const canvas = document.getElementById("bg-particles-canvas");
  if (!canvas) return;

  const prefereMenosMovimento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefereMenosMovimento) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let largura = 0;
  let altura = 0;
  let idAnimacao = null;
  let particulas = [];

  const ponteiro = {
    x: null,
    y: null,
    raio: 135
  };

  function criarParticulas() {
    const ehCelular = largura <= 768;
    const quantidade = ehCelular ? 20 : 44;
    particulas = Array.from({ length: quantidade }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * (ehCelular ? 0.28 : 0.38),
      vy: (Math.random() - 0.5) * (ehCelular ? 0.28 : 0.38),
      r: Math.random() * 1.4 + 1.1
    }));
  }

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = window.innerWidth;
    altura = window.innerHeight;
    canvas.width = Math.floor(largura * dpr);
    canvas.height = Math.floor(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    criarParticulas();
  }

  function desenharQuadro() {
    if (document.hidden) {
      idAnimacao = null;
      return;
    }

    ctx.clearRect(0, 0, largura, altura);

    const modoEscuro = obterTemaAtual() === "dark";
    const rgbBase = modoEscuro ? "96, 165, 250" : "37, 99, 235";
    const opacidadePonto = modoEscuro ? 0.38 : 0.24;
    const opacidadeLinhaMax = modoEscuro ? 0.16 : 0.1;
    const distanciaConexao = largura <= 768 ? 105 : 145;

    for (let i = 0; i < particulas.length; i += 1) {
      const p = particulas[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > largura) p.vx *= -1;
      if (p.y < 0 || p.y > altura) p.vy *= -1;

      // Reação suave ao mouse ou toque
      if (ponteiro.x !== null && ponteiro.y !== null) {
        const dxP = p.x - ponteiro.x;
        const dyP = p.y - ponteiro.y;
        const distP = Math.hypot(dxP, dyP);
        if (distP > 0 && distP < ponteiro.raio) {
          const forca = (ponteiro.raio - distP) / ponteiro.raio;
          p.x += (dxP / distP) * forca * 0.55;
          p.y += (dyP / distP) * forca * 0.55;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgbBase}, ${opacidadePonto})`;
      ctx.fill();

      for (let j = i + 1; j < particulas.length; j += 1) {
        const q = particulas[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);

        if (dist < distanciaConexao) {
          const alfa = (1 - dist / distanciaConexao) * opacidadeLinhaMax;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${rgbBase}, ${alfa.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    idAnimacao = window.requestAnimationFrame(desenharQuadro);
  }

  function iniciarLoop() {
    if (!idAnimacao && !document.hidden) {
      idAnimacao = window.requestAnimationFrame(desenharQuadro);
    }
  }

  redimensionar();
  iniciarLoop();

  let timerResize = null;
  window.addEventListener(
    "resize",
    () => {
      if (timerResize) clearTimeout(timerResize);
      timerResize = setTimeout(redimensionar, 150);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointermove",
    (e) => {
      ponteiro.x = e.clientX;
      ponteiro.y = e.clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      ponteiro.x = null;
      ponteiro.y = null;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        ponteiro.x = e.touches[0].clientX;
        ponteiro.y = e.touches[0].clientY;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    () => {
      ponteiro.x = null;
      ponteiro.y = null;
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (idAnimacao) {
        window.cancelAnimationFrame(idAnimacao);
        idAnimacao = null;
      }
    } else {
      iniciarLoop();
    }
  });
}

/* ==========================================================================
   ETAPA 4: ANIMAÇÕES SUAVES DE ENTRADA AO ROLAR (INTERSECTION OBSERVER)
   ========================================================================== */
function iniciarAnimacaoScroll() {
  const elementos = document.querySelectorAll(".reveal-on-scroll");
  if (!elementos.length) return;

  const prefereMenosMovimento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefereMenosMovimento || !("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
  );

  elementos.forEach((el) => observador.observe(el));
}

/* ==========================================================================
   EVENTOS E INICIALIZAÇÃO
   ========================================================================== */
function registrarEventos() {
  const btnMenuMobile = document.getElementById("btn-menu-mobile");
  const btnAlternarTema = document.getElementById("btn-alternar-tema");
  const btnAlternarTemaMobile = document.getElementById("btn-alternar-tema-mobile");
  const btnVerProdutos = document.getElementById("btn-ver-produtos");
  const gradeCategoriasCards = document.getElementById("grade-categorias-cards");
  const btnTodasCategorias = document.getElementById("btn-ver-todas-categorias");
  const btnToggleFiltros = document.getElementById("btn-toggle-filtros");
  const campoBusca = document.getElementById("campo-busca");
  const btnLimparBusca = document.getElementById("btn-limpar-busca");
  const listaCategorias = document.getElementById("lista-categorias");
  const filtroOrdem = document.getElementById("filtro-ordem");
  const filtroDisp = document.getElementById("filtro-disponibilidade");
  const filtroPreco = document.getElementById("filtro-preco");
  const btnResetar = document.getElementById("btn-resetar-filtros");
  const btnLimparRapido = document.getElementById("btn-limpar-rapido");
  const btnVazioLimpar = document.getElementById("btn-vazio-limpar");
  const grade = document.getElementById("grade-produtos");
  const modal = document.getElementById("modal-produto");
  const btnFecharModal = document.getElementById("btn-fechar-modal");
  const btnCopiarEndereco = document.getElementById("btn-copiar-endereco");

  // Alternância entre Tema Claro e Tema Escuro
  if (btnAlternarTema) {
    btnAlternarTema.addEventListener("click", () => alternarTema());
  }
  if (btnAlternarTemaMobile) {
    btnAlternarTemaMobile.addEventListener("click", () => {
      alternarTema();
      if (estado.menuMobileAberto) alternarMenuMobile(false);
    });
  }

  // Botão "Ver produtos" no Hero rola suavemente até o catálogo
  if (btnVerProdutos) {
    btnVerProdutos.addEventListener("click", (e) => {
      e.preventDefault();
      rolarParaProdutos();
    });
  }

  // Clique nos cards visuais de categoria filtra e rola suavemente até os produtos
  if (gradeCategoriasCards) {
    gradeCategoriasCards.addEventListener("click", (e) => {
      const cardCat = e.target.closest("[data-card-categoria]");
      if (!cardCat) return;
      const categoriaClicada = cardCat.getAttribute("data-card-categoria");
      estado.categoria = estado.categoria === categoriaClicada ? "Todos" : categoriaClicada;
      renderizarCategorias();
      atualizarCatalogo();
      rolarParaProdutos();
    });
  }

  if (btnTodasCategorias) {
    btnTodasCategorias.addEventListener("click", () => {
      estado.categoria = "Todos";
      renderizarCategorias();
      atualizarCatalogo();
    });
  }

  // Menu mobile hambúrguer
  if (btnMenuMobile) {
    btnMenuMobile.addEventListener("click", () => alternarMenuMobile());
  }

  // Navegação por hash (funciona com botão Voltar/Avançar do navegador)
  window.addEventListener("hashchange", () => {
    sincronizarSecaoPeloHash(true);
  });

  // Caso o usuário clique no link da seção que já está ativa, fecha o menu mobile suavemente
  document.querySelectorAll("[data-secao-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const alvo = link.getAttribute("data-secao-link");
      if (window.location.hash === `#${alvo}` || (!window.location.hash && alvo === "catalogo")) {
        exibirSecao(alvo, true);
      }
    });
  });

  // Botão recolher/expandir filtros
  btnToggleFiltros.addEventListener("click", () => alternarPainelFiltros());

  // Pesquisa em tempo real
  campoBusca.addEventListener("input", (e) => {
    estado.busca = e.target.value;
    atualizarCatalogo();
  });

  btnLimparBusca.addEventListener("click", () => {
    estado.busca = "";
    campoBusca.value = "";
    campoBusca.focus();
    atualizarCatalogo();
  });

  // Troca de categoria nos chips com rolagem suave no celular
  listaCategorias.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-categoria]");
    if (!botao) return;
    estado.categoria = botao.getAttribute("data-categoria");
    renderizarCategorias();
    atualizarCatalogo();

    const chipAtivo = listaCategorias.querySelector('[aria-selected="true"]');
    if (chipAtivo && typeof chipAtivo.scrollIntoView === "function") {
      chipAtivo.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });

  // Seletores de ordenação e filtros
  filtroOrdem.addEventListener("change", (e) => {
    estado.ordem = e.target.value;
    atualizarCatalogo();
  });

  filtroDisp.addEventListener("change", (e) => {
    estado.disponibilidade = e.target.value;
    atualizarCatalogo();
  });

  filtroPreco.addEventListener("change", (e) => {
    estado.faixaPreco = e.target.value;
    atualizarCatalogo();
  });

  btnResetar.addEventListener("click", limparApenasFiltrosSecundarios);
  btnLimparRapido.addEventListener("click", limparTodosFiltros);
  btnVazioLimpar.addEventListener("click", limparTodosFiltros);

  // Copiar endereço
  if (btnCopiarEndereco) {
    btnCopiarEndereco.addEventListener("click", copiarEnderecoLoja);
  }

  // Clique ou Enter no card abre o modal (ou adiciona à sacola quando clicado em "+ Adicionar à lista")
  grade.addEventListener("click", (e) => {
    const btnAdicionar = e.target.closest("[data-adicionar-sacola]");
    if (btnAdicionar) {
      e.preventDefault();
      e.stopPropagation();
      const idProd = btnAdicionar.getAttribute("data-adicionar-sacola");
      const produto = PRODUTOS.find((item) => String(item.id) === String(idProd));
      if (produto) {
        adicionarProdutoNaSacola(produto, 1);
      }
      return;
    }
    if (e.target.closest("[data-acao-whatsapp]")) return;
    const card = e.target.closest("[data-produto-id]");
    if (card) abrirModalProduto(card.getAttribute("data-produto-id"));
  });

  grade.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target.closest("[data-acao-whatsapp]") || e.target.closest("[data-adicionar-sacola]")) return;
    const card = e.target.closest("[data-produto-id]");
    if (card) {
      e.preventDefault();
      abrirModalProduto(card.getAttribute("data-produto-id"));
    }
  });

  // Controles de quantidade e adição à lista dentro do modal de produto
  const btnModalMenos = document.getElementById("modal-qtd-menos");
  const btnModalMais = document.getElementById("modal-qtd-mais");
  const btnModalAddLista = document.getElementById("modal-btn-adicionar-lista");

  if (btnModalMenos) {
    btnModalMenos.addEventListener("click", () => {
      estado.qtdModal = Math.max(1, estado.qtdModal - 1);
      const prodAtual = PRODUTOS.find((p) => String(p.id) === String(estado.produtoModalAtualId));
      atualizarBotaoModalAdicionarLista(prodAtual);
    });
  }

  if (btnModalMais) {
    btnModalMais.addEventListener("click", () => {
      estado.qtdModal = Math.min(999, estado.qtdModal + 1);
      const prodAtual = PRODUTOS.find((p) => String(p.id) === String(estado.produtoModalAtualId));
      atualizarBotaoModalAdicionarLista(prodAtual);
    });
  }

  if (btnModalAddLista) {
    btnModalAddLista.addEventListener("click", () => {
      const prodAtual = PRODUTOS.find((p) => String(p.id) === String(estado.produtoModalAtualId));
      if (!prodAtual) return;
      adicionarProdutoNaSacola(prodAtual, estado.qtdModal);
      estado.qtdModal = 1;
      atualizarBotaoModalAdicionarLista(prodAtual, "✓ Adicionado à lista!");
      if (timerFeedbackModalLista) clearTimeout(timerFeedbackModalLista);
      timerFeedbackModalLista = setTimeout(() => {
        const prodRef = PRODUTOS.find((p) => String(p.id) === String(estado.produtoModalAtualId));
        atualizarBotaoModalAdicionarLista(prodRef);
      }, 1500);
    });
  }

  // Controles da Gaveta / Modal da Sacola de Orçamento
  const btnAbrirSacola = document.getElementById("btn-abrir-sacola");
  const modalSacola = document.getElementById("modal-sacola");
  const btnFecharSacola = document.getElementById("btn-fechar-sacola");
  const btnSacolaExplorar = document.getElementById("btn-sacola-explorar");
  const listaItensSacola = document.getElementById("sacola-lista-itens");
  const btnLimparSacola = document.getElementById("btn-limpar-sacola");
  const inputSacolaBairro = document.getElementById("sacola-bairro");
  const inputSacolaObs = document.getElementById("sacola-observacao");

  if (btnAbrirSacola) {
    btnAbrirSacola.addEventListener("click", abrirModalSacola);
  }
  if (btnFecharSacola) {
    btnFecharSacola.addEventListener("click", fecharModalSacola);
  }
  if (modalSacola) {
    modalSacola.addEventListener("click", (e) => {
      if (e.target === modalSacola) fecharModalSacola();
    });
  }
  if (btnSacolaExplorar) {
    btnSacolaExplorar.addEventListener("click", () => {
      fecharModalSacola();
      if (estado.secaoAtiva !== "catalogo") {
        window.location.hash = "#catalogo";
        exibirSecao("catalogo", false);
      }
      rolarParaProdutos();
    });
  }
  if (listaItensSacola) {
    listaItensSacola.addEventListener("click", (e) => {
      const btnAcao = e.target.closest("[data-sacola-acao]");
      if (!btnAcao) return;
      const acao = btnAcao.getAttribute("data-sacola-acao");
      const codigo = btnAcao.getAttribute("data-codigo");
      if (!codigo) return;

      if (acao === "diminuir") alterarQuantidadeItemSacola(codigo, -1);
      if (acao === "aumentar") alterarQuantidadeItemSacola(codigo, 1);
      if (acao === "remover") removerItemDaSacola(codigo);
    });
  }

  document.querySelectorAll('input[name="sacola-modalidade"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      estado.sacolaModalidade = e.target.value === "retirada" ? "retirada" : "entrega";
      sincronizarInputsPreferenciasSacola();
      salvarSacolaLocal();
      atualizarInterfaceSacola(false);
    });
  });

  if (inputSacolaBairro) {
    inputSacolaBairro.addEventListener("input", (e) => {
      estado.sacolaBairro = e.target.value.slice(0, 80);
      salvarSacolaLocal();
      const btnEnviar = document.getElementById("btn-enviar-lista-whatsapp");
      if (btnEnviar) btnEnviar.href = gerarLinkWhatsAppSacola();
    });
  }

  if (inputSacolaObs) {
    inputSacolaObs.addEventListener("input", (e) => {
      estado.sacolaObservacao = e.target.value.slice(0, 140);
      salvarSacolaLocal();
      const btnEnviar = document.getElementById("btn-enviar-lista-whatsapp");
      if (btnEnviar) btnEnviar.href = gerarLinkWhatsAppSacola();
    });
  }

  if (btnLimparSacola) {
    btnLimparSacola.addEventListener("click", acionarLimparSacola);
  }

  // Fechamento do modal de produto
  btnFecharModal.addEventListener("click", fecharModalProduto);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModalProduto();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalSacola && !modalSacola.hidden) {
        fecharModalSacola();
        return;
      }
      fecharModalProduto();
      if (estado.menuMobileAberto) alternarMenuMobile(false);
    }
  });
}

window.TEKY_CATALOGO = {
  obterProdutosIniciais() {
    return PRODUTOS_LOCAIS_INICIAIS.map((item) => ({ ...item }));
  },
  aplicarProdutosFirestore(listaNuvem, usarListaVaziaNuvem = false) {
    if (Array.isArray(listaNuvem) && (listaNuvem.length > 0 || usarListaVaziaNuvem)) {
      PRODUTOS.splice(0, PRODUTOS.length, ...listaNuvem);
    } else {
      PRODUTOS.splice(
        0,
        PRODUTOS.length,
        ...PRODUTOS_LOCAIS_INICIAIS.map((item) => ({ ...item }))
      );
    }
    sincronizarPrecosSacolaComCatalogo();
    if (document.getElementById("grade-produtos")) {
      renderizarCategorias();
      atualizarCatalogo();
      atualizarInterfaceSacola(false);
    }
    const modal = document.getElementById("modal-produto");
    if (modal && !modal.hidden && estado.produtoModalAtualId !== null) {
      const aindaExiste = PRODUTOS.find(
        (p) => String(p.id) === String(estado.produtoModalAtualId)
      );
      if (aindaExiste) {
        abrirModalProduto(aindaExiste.id);
      } else {
        fecharModalProduto();
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  aplicarTema(obterTemaAtual(), false);
  acompanharPreferenciaSistema();
  aplicarDadosLoja();
  atualizarHorarioFuncionamento();
  setInterval(atualizarHorarioFuncionamento, 60000);
  carregarSacolaSalva();
  renderizarCategorias();
  registrarEventos();
  atualizarCatalogo();
  sincronizarSecaoPeloHash(false);
  iniciarFundoAnimadoCanvas();
  iniciarAnimacaoScroll();
});
