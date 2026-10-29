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
      (prefira fotos quadradas em formato .jpg ou .webp, ex.: "img/cimento-cp2.jpg").
   2. No array PRODUTOS abaixo, altere o campo `imagem: "img/nome-do-arquivo.jpg"`
      do produto correspondente.
   3. Caso algum arquivo ainda não exista na pasta "img/", o site exibe
      automaticamente um fundo azul claro (#EAF1FF) com o ícone da categoria.
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
    imagem: "img/cimento-cp2.jpg",
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
    imagem: "img/argamassa-ac2.jpg",
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
    imagem: "img/tijolo-baiano.jpg",
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
    imagem: "img/tinta-acrilica-18l.jpg",
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
    imagem: "img/impermeabilizante-18kg.jpg",
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
    imagem: "img/prego-galvanizado-18x27.jpg",
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
    imagem: "img/parafuso-chipboard-4x40.jpg",
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
    imagem: "img/dobradica-inox-35.jpg",
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
    imagem: "img/cadeado-latao-40mm.jpg",
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
    imagem: "img/fechadura-externa-inox.jpg",
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
    imagem: "img/tabua-pinus-30cm.jpg",
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
    imagem: "img/caibro-eucalipto-5x6.jpg",
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
    imagem: "img/sarrafo-pinus-5cm.jpg",
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
    imagem: "img/compensado-naval-12mm.jpg",
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
    imagem: "img/viga-cambara-6x12.jpg",
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
    imagem: "img/areia-media-granel.jpg",
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
    imagem: "img/areia-fina-granel.jpg",
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
    imagem: "img/areia-grossa-granel.jpg",
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
    imagem: "img/areia-media-saco-20kg.jpg",
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
    imagem: "img/areia-fina-saco-20kg.jpg",
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
    imagem: "img/pedra-brita-1-granel.jpg",
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
    imagem: "img/pedra-brita-2-granel.jpg",
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
    imagem: "img/pedrisco-brita-0.jpg",
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
    imagem: "img/pedra-brita-1-saco-20kg.jpg",
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
    imagem: "img/pedra-rachao.jpg",
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
    imagem: "img/caixa-organizadora-30l.jpg",
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
    imagem: "img/balde-reforcado-12l.jpg",
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
    imagem: "img/vassoura-piacava.jpg",
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
    imagem: "img/potes-hermeticos-5pc.jpg",
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
    imagem: "img/cesto-organizador-vazado.jpg",
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

const estado = {
  secaoAtiva: "catalogo",
  busca: "",
  categoria: "Todos",
  ordem: "padrao",
  disponibilidade: "todos",
  faixaPreco: "todos",
  filtrosAbertos: false,
  menuMobileAberto: false,
  ultimoElementoFocado: null
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
  const mensagem = `Olá! Vi o catálogo da ${NOME_LOJA} e quero saber sobre: ${produto.nome} (cód. ${produto.codigo}) – ${precoExibido}`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

function gerarLinkWhatsAppGeral() {
  const mensagem = `Olá! Vim pelo catálogo online da ${NOME_LOJA} e gostaria de fazer um orçamento.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

// 12. Mensagem exata solicitada para consulta de frete
function gerarLinkWhatsAppFrete() {
  const mensagem = "Olá! Quero saber o frete para o bairro: ";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

function obterIconeCategoria(categoria) {
  const icones = {
    "Materiais de Construção":
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1E5BFF" stroke-width="1.8"><rect x="3" y="4" width="8" height="5" rx="1"/><rect x="13" y="4" width="8" height="5" rx="1"/><rect x="7" y="10" width="10" height="5" rx="1"/><rect x="3" y="16" width="8" height="4" rx="1"/><rect x="13" y="16" width="8" height="4" rx="1"/></svg>',
    Ferragens:
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1E5BFF" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z"/></svg>',
    Madeiras:
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1E5BFF" stroke-width="1.8"><rect x="3" y="5" width="18" height="5" rx="1"/><rect x="3" y="14" width="18" height="5" rx="1"/><path d="M8 7.5h3M15 16.5h3"/></svg>',
    Areia:
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1E5BFF" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 19h18L14.5 8.5a3 3 0 0 0-5 0L3 19Z"/><circle cx="12" cy="15" r="0.8" fill="#1E5BFF"/></svg>',
    Pedra:
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1E5BFF" stroke-width="1.8"><polygon points="12 4 19 9 17 19 7 19 5 9 12 4"/><path d="M12 4v8l5 7M12 12 7 19"/></svg>',
    Bazar:
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1E5BFF" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 9h16l-1.5 10.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 9Z"/><path stroke-linecap="round" d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>'
  };
  return icones[categoria] || icones["Materiais de Construção"];
}

// 9 & 10. Remove skeleton ao carregar ou mostra placeholder #EAF1FF se o arquivo não existir
window.marcarImagemCarregada = function marcarImagemCarregada(elementoImg) {
  if (!elementoImg) return;
  elementoImg.classList.add("img-carregada");
  if (elementoImg.parentElement) {
    elementoImg.parentElement.classList.add("carregado");
  }
};

window.tratarErroImagem = function tratarErroImagem(elementoImg, categoria, codigo) {
  const container = elementoImg.parentElement;
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
  const container = document.getElementById("lista-categorias");
  if (!container) return;

  container.innerHTML = CATEGORIAS.map((cat) => {
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

function criarCardProduto(produto) {
  const precoFinal = obterPrecoFinal(produto);
  const temPromocao = produto.promocao && typeof produto.precoPromocional === "number";
  const linkWhats = gerarLinkWhatsAppProduto(produto);

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
          src="${escaparHtml(produto.imagem)}"
          alt="${escaparHtml(produto.nome)} - ${escaparHtml(produto.categoria)} na loja ${escaparHtml(NOME_LOJA)}"
          loading="lazy"
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

          <a
            href="${linkWhats}"
            target="_blank"
            rel="noopener noreferrer"
            data-acao-whatsapp="true"
            class="btn-whatsapp card-whatsapp-btn focus-ring"
            aria-label="Pedir ${escaparHtml(produto.nome)} no WhatsApp"
          >
            <span>Pedir no WhatsApp</span>
          </a>
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
  }
}

/* ==========================================================================
   MODAL DE DETALHES DO PRODUTO
   ========================================================================== */
function abrirModalProduto(idProduto) {
  const produto = PRODUTOS.find((item) => String(item.id) === String(idProduto));
  if (!produto) return;

  estado.ultimoElementoFocado = document.activeElement;

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

  containerImg.classList.remove("carregado");
  containerImg.innerHTML = `
    <img
      src="${escaparHtml(produto.imagem)}"
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

  modal.hidden = false;
  document.body.classList.add("modal-aberto");
  if (btnFechar) btnFechar.focus();
}

function fecharModalProduto() {
  const modal = document.getElementById("modal-produto");
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  document.body.classList.remove("modal-aberto");

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

  const elTelefone = document.getElementById("info-telefone");
  if (elTelefone) elTelefone.textContent = TELEFONE_EXIBICAO;

  const elTelefoneLink = document.getElementById("info-telefone-link");
  if (elTelefoneLink) elTelefoneLink.setAttribute("href", `tel:${TELEFONE_LINK}`);

  const mobileBtnLigar = document.getElementById("mobile-btn-ligar");
  if (mobileBtnLigar) mobileBtnLigar.setAttribute("href", `tel:${TELEFONE_LINK}`);

  const btnLigarAgora = document.getElementById("btn-ligar-agora");
  if (btnLigarAgora) {
    btnLigarAgora.setAttribute("href", `tel:${TELEFONE_LINK}`);
    const span = btnLigarAgora.querySelector("span");
    if (span) span.textContent = `Ligar ${TELEFONE_EXIBICAO}`;
  }

  // Sincroniza URL do mapa e rotas com o endereço completo
  const enderecoCodificado = encodeURIComponent(ENDERECO_LOJA);
  const urlRota = `https://www.google.com/maps/dir//${enderecoCodificado}`;
  const urlEmbedMapa = `https://maps.google.com/maps?q=${enderecoCodificado}&z=16&ie=UTF8&iwloc=&output=embed`;

  const mobileBtnRota = document.getElementById("mobile-btn-rota");
  if (mobileBtnRota) mobileBtnRota.setAttribute("href", urlRota);

  const linkRotaContato = document.getElementById("link-como-chegar-contato");
  if (linkRotaContato) linkRotaContato.setAttribute("href", urlRota);

  const mapaIframe = document.getElementById("mapa-iframe");
  if (mapaIframe) mapaIframe.setAttribute("src", urlEmbedMapa);
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

/* ==========================================================================
   EVENTOS E INICIALIZAÇÃO
   ========================================================================== */
function registrarEventos() {
  const btnMenuMobile = document.getElementById("btn-menu-mobile");
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

  // Clique ou Enter no card abre o modal
  grade.addEventListener("click", (e) => {
    if (e.target.closest("[data-acao-whatsapp]")) return;
    const card = e.target.closest("[data-produto-id]");
    if (card) abrirModalProduto(card.getAttribute("data-produto-id"));
  });

  grade.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target.closest("[data-acao-whatsapp]")) return;
    const card = e.target.closest("[data-produto-id]");
    if (card) {
      e.preventDefault();
      abrirModalProduto(card.getAttribute("data-produto-id"));
    }
  });

  // Fechamento do modal
  btnFecharModal.addEventListener("click", fecharModalProduto);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModalProduto();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharModalProduto();
      if (estado.menuMobileAberto) alternarMenuMobile(false);
    }
  });
}

window.TEKY_CATALOGO = {
  obterProdutosIniciais() {
    return PRODUTOS_LOCAIS_INICIAIS.map((item) => ({ ...item }));
  },
  aplicarProdutosFirestore(listaNuvem) {
    if (Array.isArray(listaNuvem) && listaNuvem.length > 0) {
      PRODUTOS.splice(0, PRODUTOS.length, ...listaNuvem);
    } else {
      PRODUTOS.splice(
        0,
        PRODUTOS.length,
        ...PRODUTOS_LOCAIS_INICIAIS.map((item) => ({ ...item }))
      );
    }
    if (document.getElementById("grade-produtos")) {
      atualizarCatalogo();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  aplicarDadosLoja();
  atualizarHorarioFuncionamento();
  setInterval(atualizarHorarioFuncionamento, 60000);
  renderizarCategorias();
  registrarEventos();
  atualizarCatalogo();
  sincronizarSecaoPeloHash(false);
});
