/**
 * Abertura Cinematográfica (Intro) — TEKY BAZAR
 * Sequência de ~5s em 3 atos contínuos:
 * 1. Projeto (0–1,5s): Planta baixa arquitetônica em SVG + cotas técnicas NBR.
 * 2. Construção (1,5–3,5s): Extrusão isométrica 3D contínua (wireframe -> volumes preenchidos, vidros e brises).
 * 3. Marca (3,5–5,0s): Dissolução luminosa com lens flare, logo metálico TEKY BAZAR com shine sweep,
 *    slogan "CONSTRUINDO POSSIBILIDADES" e botão "ENTRAR NA LOJA" com abertura em cortina de luz.
 */

const INTRO_SESSION_KEY = "teky_intro_vista_v1";
const DURACAO_TOTAL_MS = 5000;
const FASE_CONSTRUCAO_MS = 1500;
const FASE_MARCA_MS = 3500;

interface ParticulaLuz {
  x: number;
  y: number;
  vx: number;
  vy: number;
  raio: number;
  alfaBase: number;
  fase: number;
  matiz: "azul" | "branco" | "ciano";
  ascendente: boolean;
}

/**
 * Projeção isométrica 3D exata (u, v, z) -> coordenadas SVG (800 x 520)
 * Garante alinhamento milimétrico entre a planta 2D (z=0) e a casa 3D (z>0).
 */
function iso(u: number, v: number, z = 0): [number, number] {
  const x = 400 - 17 * u + 17 * v;
  const y = 382 - 9.8 * u - 9.8 * v - 19.2 * z;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

function pts(lista: Array<[number, number]>): string {
  return lista.map(([x, y]) => `${x},${y}`).join(" ");
}

function caminhoPoligono(lista: Array<[number, number]>, fechado = true): string {
  if (!lista.length) return "";
  const comandos = lista.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  return fechado ? `${comandos} Z` : comandos;
}

function segmento(a: [number, number], b: [number, number]): string {
  return `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
}

/**
 * Constrói o SVG arquitetônico completo (Planta 2D + Cotas + Casa Moderna 3D Isométrica)
 */
function gerarSvgCenaArquitetonica(): string {
  // 1. Laje / terreno externo (z = 0)
  const lajeExterna = caminhoPoligono([
    iso(-1.1, -1.1, 0),
    iso(11.8, -1.1, 0),
    iso(11.8, 10.2, 0),
    iso(-1.1, 10.2, 0)
  ]);

  // 2. Perímetro principal da planta térrea (u: 0..11, v: 0..9, z: 0)
  const perimetroPlanta = caminhoPoligono([
    iso(0, 0, 0),
    iso(11, 0, 0),
    iso(11, 9, 0),
    iso(0, 9, 0)
  ]);

  // Paredes internas da planta baixa (z = 0) com vãos de porta
  const paredesInternas = [
    // Divisória sala / área íntima (u = 5.6, com vão entre v = 2.6 e v = 4.1)
    segmento(iso(5.6, 0, 0), iso(5.6, 2.6, 0)),
    segmento(iso(5.6, 4.1, 0), iso(5.6, 9, 0)),
    // Divisória cozinha / suítes (v = 4.6, com vão entre u = 1.8 e u = 3.2)
    segmento(iso(0, 4.6, 0), iso(1.8, 4.6, 0)),
    segmento(iso(3.2, 4.6, 0), iso(11, 4.6, 0)),
    // Divisória suíte master / banho (u = 8.4, v = 4.6..9)
    segmento(iso(8.4, 4.6, 0), iso(8.4, 9, 0)),
    // Passarela de entrada frontal (pisantes arquitetônicos)
    caminhoPoligono([iso(-1.1, 1.5, 0), iso(0, 1.5, 0), iso(0, 3.8, 0), iso(-1.1, 3.8, 0)]),
    segmento(iso(-0.55, 1.5, 0), iso(-0.55, 3.8, 0))
  ].join(" ");

  // Degraus da escada interna na planta (u: 4.1..5.6, v: 5.2..8.2)
  const degrausEscada: string[] = [];
  for (let i = 0; i <= 5; i++) {
    const vStep = 5.2 + i * 0.6;
    degrausEscada.push(segmento(iso(4.1, vStep, 0), iso(5.6, vStep, 0)));
  }

  // Arcos de abertura de portas na planta (detalhe clássico de projeto arquitetônico)
  const [pPorta1A_x, pPorta1A_y] = iso(5.6, 2.6, 0);
  const [pPorta1B_x, pPorta1B_y] = iso(4.3, 2.6, 0);
  const [pPorta1C_x, pPorta1C_y] = iso(5.6, 4.1, 0);
  const arcoPortaInterna = `M${pPorta1A_x} ${pPorta1A_y} L${pPorta1B_x} ${pPorta1B_y} Q${pPorta1B_x + 4} ${pPorta1C_y + 4} ${pPorta1C_x} ${pPorta1C_y}`;

  const [pPorta2A_x, pPorta2A_y] = iso(1.8, 4.6, 0);
  const [pPorta2B_x, pPorta2B_y] = iso(1.8, 5.9, 0);
  const [pPorta2C_x, pPorta2C_y] = iso(3.2, 4.6, 0);
  const arcoPortaCozinha = `M${pPorta2A_x} ${pPorta2A_y} L${pPorta2B_x} ${pPorta2B_y} Q${pPorta2C_x - 3} ${pPorta2B_y - 4} ${pPorta2C_x} ${pPorta2C_y}`;

  // Cruzamentos de eixos estruturais (pilares na planta)
  const pilaresPlanta = [
    iso(0, 0, 0),
    iso(5.6, 0, 0),
    iso(11, 0, 0),
    iso(0, 4.6, 0),
    iso(5.6, 4.6, 0),
    iso(11, 4.6, 0),
    iso(0, 9, 0),
    iso(11, 9, 0)
  ]
    .map(([cx, cy]) => `<rect x="${(cx - 2.6).toFixed(1)}" y="${(cy - 2.6).toFixed(1)}" width="5.2" height="5.2" rx="0.8" class="bp-pillar-dot" />`)
    .join("");

  // 3. Cotas arquitetônicas NBR (linhas de chamada, linha de cota e ticks 45°)
  const cotaEsqIni = iso(0, -1.9, 0);
  const cotaEsqFim = iso(11, -1.9, 0);
  const cotaEsqMeio = iso(5.5, -2.55, 0);

  const cotaDirIni = iso(-1.9, 0, 0);
  const cotaDirFim = iso(-1.9, 9, 0);
  const cotaDirMeio = iso(-2.65, 4.5, 0);

  const cotaAltIni = iso(-1.8, 9.2, 0);
  const cotaAltFim = iso(-1.8, 9.2, 5.6);
  const cotaAltMeio = iso(-2.3, 9.5, 2.8);

  const linhasCotas = [
    // Cota 12,40 m (fachada esquerda)
    segmento(iso(0, -0.4, 0), iso(0, -2.2, 0)),
    segmento(iso(11, -0.4, 0), iso(11, -2.2, 0)),
    segmento(cotaEsqIni, cotaEsqFim),
    `M${cotaEsqIni[0] - 4} ${cotaEsqIni[1] + 4} L${cotaEsqIni[0] + 4} ${cotaEsqIni[1] - 4}`,
    `M${cotaEsqFim[0] - 4} ${cotaEsqFim[1] + 4} L${cotaEsqFim[0] + 4} ${cotaEsqFim[1] - 4}`,
    // Cota 8,60 m (fachada direita)
    segmento(iso(-0.4, 0, 0), iso(-2.2, 0, 0)),
    segmento(iso(-0.4, 9, 0), iso(-2.2, 9, 0)),
    segmento(cotaDirIni, cotaDirFim),
    `M${cotaDirIni[0] - 4} ${cotaDirIni[1] - 4} L${cotaDirIni[0] + 4} ${cotaDirIni[1] + 4}`,
    `M${cotaDirFim[0] - 4} ${cotaDirFim[1] - 4} L${cotaDirFim[0] + 4} ${cotaDirFim[1] + 4}`
  ].join(" ");

  const linhaCotaAltura = [
    segmento(iso(-0.4, 9.0, 0), iso(-2.1, 9.2, 0)),
    segmento(iso(3.2, 9.0, 5.6), iso(-2.1, 9.2, 5.6)),
    segmento(cotaAltIni, cotaAltFim),
    `M${cotaAltIni[0] - 4} ${cotaAltIni[1] + 3} L${cotaAltIni[0] + 4} ${cotaAltIni[1] - 3}`,
    `M${cotaAltFim[0] - 4} ${cotaAltFim[1] + 3} L${cotaAltFim[0] + 4} ${cotaAltFim[1] - 3}`
  ].join(" ");

  // 4. Volumes 3D — Casa Contemporânea de 2 Pavimentos + Marquise em Balanço
  // Volume térreo (u: 0..11, v: 0..9, z: 0..3.0)
  const faceTerreoEsq = pts([iso(0, 0, 0), iso(11, 0, 0), iso(11, 0, 3.0), iso(0, 0, 3.0)]);
  const faceTerreoDir = pts([iso(0, 0, 0), iso(0, 9, 0), iso(0, 9, 3.0), iso(0, 0, 3.0)]);
  const topoTerreo = pts([iso(0, 0, 3.0), iso(11, 0, 3.0), iso(11, 9, 3.0), iso(0, 9, 3.0)]);

  // Marquise / platibanda em balanço (u: -0.45..11.35, v: -0.45..9.35, z: 3.0..3.38)
  const marquiseFaceEsq = pts([
    iso(-0.45, -0.45, 3.0),
    iso(11.35, -0.45, 3.0),
    iso(11.35, -0.45, 3.38),
    iso(-0.45, -0.45, 3.38)
  ]);
  const marquiseFaceDir = pts([
    iso(-0.45, -0.45, 3.0),
    iso(-0.45, 9.35, 3.0),
    iso(-0.45, 9.35, 3.38),
    iso(-0.45, -0.45, 3.38)
  ]);
  const marquiseTopo = pts([
    iso(-0.45, -0.45, 3.38),
    iso(11.35, -0.45, 3.38),
    iso(11.35, 9.35, 3.38),
    iso(-0.45, 9.35, 3.38)
  ]);

  // Volume superior contemporâneo (u: 3.2..10.6, v: 1.8..8.7, z: 3.38..5.65)
  const faceSupEsq = pts([
    iso(3.2, 1.8, 3.38),
    iso(10.6, 1.8, 3.38),
    iso(10.6, 1.8, 5.65),
    iso(3.2, 1.8, 5.65)
  ]);
  const faceSupDir = pts([
    iso(3.2, 1.8, 3.38),
    iso(3.2, 8.7, 3.38),
    iso(3.2, 8.7, 5.65),
    iso(3.2, 1.8, 5.65)
  ]);
  const coberturaSup = pts([
    iso(2.9, 1.5, 5.65),
    iso(10.8, 1.5, 5.65),
    iso(10.8, 8.9, 5.65),
    iso(2.9, 8.9, 5.65)
  ]);

  // Guarda-corpo de vidro no terraço frontal superior (u: 0.1..3.2, v: 0.1..4.6, z: 3.38..4.05)
  const guardaCorpoEsq = pts([
    iso(0.1, 0.1, 3.38),
    iso(3.2, 0.1, 3.38),
    iso(3.2, 0.1, 4.05),
    iso(0.1, 0.1, 4.05)
  ]);
  const guardaCorpoDir = pts([
    iso(0.1, 0.1, 3.38),
    iso(0.1, 4.4, 3.38),
    iso(0.1, 4.4, 4.05),
    iso(0.1, 0.1, 4.05)
  ]);

  // Painéis de vidro iluminados (janelas panorâmicas e porta pivotante)
  const janelaSalaTerreo = pts([
    iso(1.1, 0, 0.35),
    iso(5.1, 0, 0.35),
    iso(5.1, 0, 2.55),
    iso(1.1, 0, 2.55)
  ]);
  const portaEntradaPivot = pts([
    iso(0, 1.6, 0),
    iso(0, 3.7, 0),
    iso(0, 3.7, 2.65),
    iso(0, 1.6, 2.65)
  ]);
  const janelaCozinhaDir = pts([
    iso(0, 5.1, 0.85),
    iso(0, 8.1, 0.85),
    iso(0, 8.1, 2.45),
    iso(0, 5.1, 2.45)
  ]);
  const janelaSuiteSupEsq = pts([
    iso(4.0, 1.8, 3.72),
    iso(8.8, 1.8, 3.72),
    iso(8.8, 1.8, 5.22),
    iso(4.0, 1.8, 5.22)
  ]);
  const janelaSuiteSupDir = pts([
    iso(3.2, 2.5, 3.72),
    iso(3.2, 7.2, 3.72),
    iso(3.2, 7.2, 5.22),
    iso(3.2, 2.5, 5.22)
  ]);

  // Brise-soleil arquitetônico (ripado vertical na fachada esquerda térrea u: 6.3..9.8)
  const brises: string[] = [];
  for (let uBrise = 6.3; uBrise <= 9.81; uBrise += 0.58) {
    brises.push(segmento(iso(uBrise, 0, 0.35), iso(uBrise, 0, 2.65)));
  }

  // Wireframe 3D (arestas verticais e horizontais que se desenham subindo a partir da planta)
  const wireframe3D = [
    // Pilares principais subindo do térreo
    segmento(iso(0, 0, 0), iso(0, 0, 3.0)),
    segmento(iso(11, 0, 0), iso(11, 0, 3.0)),
    segmento(iso(11, 9, 0), iso(11, 9, 3.0)),
    segmento(iso(0, 9, 0), iso(0, 9, 3.0)),
    segmento(iso(5.6, 0, 0), iso(5.6, 0, 3.0)),
    // Contorno superior do térreo e marquise
    caminhoPoligono([iso(0, 0, 3.0), iso(11, 0, 3.0), iso(11, 9, 3.0), iso(0, 9, 3.0)]),
    caminhoPoligono([
      iso(-0.45, -0.45, 3.38),
      iso(11.35, -0.45, 3.38),
      iso(11.35, 9.35, 3.38),
      iso(-0.45, 9.35, 3.38)
    ]),
    segmento(iso(-0.45, -0.45, 3.0), iso(-0.45, -0.45, 3.38)),
    segmento(iso(11.35, -0.45, 3.0), iso(11.35, -0.45, 3.38)),
    segmento(iso(-0.45, 9.35, 3.0), iso(-0.45, 9.35, 3.38)),
    // Pilares e arestas do pavimento superior
    segmento(iso(3.2, 1.8, 3.38), iso(3.2, 1.8, 5.65)),
    segmento(iso(10.6, 1.8, 3.38), iso(10.6, 1.8, 5.65)),
    segmento(iso(10.6, 8.7, 3.38), iso(10.6, 8.7, 5.65)),
    segmento(iso(3.2, 8.7, 3.38), iso(3.2, 8.7, 5.65)),
    caminhoPoligono([
      iso(2.9, 1.5, 5.65),
      iso(10.8, 1.5, 5.65),
      iso(10.8, 8.9, 5.65),
      iso(2.9, 8.9, 5.65)
    ]),
    // Guarda-corpo e esquadrias
    caminhoPoligono([iso(0.1, 0.1, 3.38), iso(3.2, 0.1, 3.38), iso(3.2, 0.1, 4.05), iso(0.1, 0.1, 4.05)]),
    caminhoPoligono([iso(0.1, 0.1, 3.38), iso(0.1, 4.4, 3.38), iso(0.1, 4.4, 4.05), iso(0.1, 0.1, 4.05)]),
    caminhoPoligono([iso(1.1, 0, 0.35), iso(5.1, 0, 0.35), iso(5.1, 0, 2.55), iso(1.1, 0, 2.55)]),
    segmento(iso(3.1, 0, 0.35), iso(3.1, 0, 2.55)),
    caminhoPoligono([iso(0, 1.6, 0), iso(0, 3.7, 0), iso(0, 3.7, 2.65), iso(0, 1.6, 2.65)]),
    segmento(iso(0, 2.85, 0), iso(0, 2.85, 2.65)),
    caminhoPoligono([iso(0, 5.1, 0.85), iso(0, 8.1, 0.85), iso(0, 8.1, 2.45), iso(0, 5.1, 2.45)]),
    caminhoPoligono([iso(4.0, 1.8, 3.72), iso(8.8, 1.8, 3.72), iso(8.8, 1.8, 5.22), iso(4.0, 1.8, 5.22)]),
    segmento(iso(6.4, 1.8, 3.72), iso(6.4, 1.8, 5.22)),
    caminhoPoligono([iso(3.2, 2.5, 3.72), iso(3.2, 7.2, 3.72), iso(3.2, 7.2, 5.22), iso(3.2, 2.5, 5.22)]),
    ...brises
  ].join(" ");

  // Arestas de brilho intenso (rim light nas quinas principais durante a Construção)
  const arestasBrilho = [
    segmento(iso(0, 0, 0), iso(0, 0, 3.38)),
    segmento(iso(-0.45, -0.45, 3.38), iso(11.35, -0.45, 3.38)),
    segmento(iso(-0.45, -0.45, 3.38), iso(-0.45, 9.35, 3.38)),
    segmento(iso(3.2, 1.8, 3.38), iso(3.2, 1.8, 5.65)),
    segmento(iso(2.9, 1.5, 5.65), iso(10.8, 1.5, 5.65)),
    segmento(iso(2.9, 1.5, 5.65), iso(2.9, 8.9, 5.65))
  ].join(" ");

  const [lblSalaX, lblSalaY] = iso(2.7, 2.2, 0);
  const [lblGourmetX, lblGourmetY] = iso(2.7, 6.8, 0);
  const [lblSuiteX, lblSuiteY] = iso(8.2, 2.3, 0);

  return `
    <svg
      class="intro-arch-svg"
      viewBox="0 0 800 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="intro-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="grad-wall-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#173063" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#0b1734" stop-opacity="0.97" />
        </linearGradient>

        <linearGradient id="grad-wall-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#244a91" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#132959" stop-opacity="0.97" />
        </linearGradient>

        <linearGradient id="grad-roof-slab" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.46" />
          <stop offset="55%" stop-color="#1d3b78" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#0f2147" stop-opacity="0.94" />
        </linearGradient>

        <linearGradient id="grad-marquee-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.92" />
          <stop offset="50%" stop-color="#60a5fa" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#1e40af" stop-opacity="0.88" />
        </linearGradient>

        <linearGradient id="grad-arch-glass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.86" />
          <stop offset="45%" stop-color="#38bdf8" stop-opacity="0.62" />
          <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.45" />
        </linearGradient>

        <radialGradient id="grad-floor-glow" cx="50%" cy="55%" r="48%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.24" />
          <stop offset="100%" stop-color="#050b1f" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Halo sutil sob a edificação -->
      <ellipse cx="400" cy="300" rx="270" ry="135" fill="url(#grad-floor-glow)" class="arch-base-halo" />

      <!-- ATO 1: PLANTA BAIXA 2D E COTAS TÉCNICAS -->
      <g class="layer-blueprint">
        <path d="${lajeExterna}" class="bp-outer-slab" />
        <path d="${perimetroPlanta}" class="bp-draw bp-main-outline" filter="url(#intro-glow-blue)" data-draw-start="0.06" data-draw-end="0.68" />
        <path d="${paredesInternas}" class="bp-draw bp-inner-walls" data-draw-start="0.28" data-draw-end="0.84" />
        <path d="${degrausEscada.join(" ")}" class="bp-draw bp-stairs" data-draw-start="0.45" data-draw-end="0.92" />
        <path d="${arcoPortaInterna} ${arcoPortaCozinha}" class="bp-draw bp-doors" data-draw-start="0.52" data-draw-end="0.95" />
        <g class="bp-pillars-group">${pilaresPlanta}</g>

        <!-- Nomes discretos dos ambientes na planta -->
        <g class="bp-room-labels">
          <text x="${lblSalaX}" y="${lblSalaY}" text-anchor="middle">ESTAR</text>
          <text x="${lblGourmetX}" y="${lblGourmetY}" text-anchor="middle">GOURMET</text>
          <text x="${lblSuiteX}" y="${lblSuiteY}" text-anchor="middle">SUÍTE</text>
        </g>

        <!-- Cotas e medidas arquitetônicas -->
        <g class="bp-dimensions">
          <path d="${linhasCotas}" class="bp-draw bp-dim-line" data-draw-start="0.42" data-draw-end="0.96" />
          <text x="${cotaEsqMeio[0] - 8}" y="${cotaEsqMeio[1]}" text-anchor="end" class="bp-dim-text">12,40 m</text>
          <text x="${cotaDirMeio[0] + 8}" y="${cotaDirMeio[1]}" text-anchor="start" class="bp-dim-text">8,60 m</text>
          <text x="400" y="446" text-anchor="middle" class="bp-dim-meta">PROJETO ARQUITETÔNICO · ÁREA 106,6 m² · ESC 1:100</text>

          <!-- Indicação de Norte Arquitetônico -->
          <g transform="translate(646, 146)" class="bp-compass">
            <circle cx="0" cy="0" r="15" stroke="rgba(147, 197, 253, 0.38)" stroke-width="1" />
            <path d="M0 -11 L4.5 6 L0 2.5 L-4.5 6 Z" fill="#60a5fa" />
            <text x="0" y="-20" text-anchor="middle" class="bp-dim-text">N</text>
          </g>
        </g>
      </g>

      <!-- ATO 2: VOLUMES SÓLIDOS E VIDROS 3D (preenchimento progressivo) -->
      <g class="layer-3d-solids">
        <!-- Paredes do térreo -->
        <polygon points="${faceTerreoEsq}" fill="url(#grad-wall-left)" />
        <polygon points="${faceTerreoDir}" fill="url(#grad-wall-right)" />
        <polygon points="${topoTerreo}" fill="url(#grad-roof-slab)" />

        <!-- Esquadrias iluminadas do térreo -->
        <polygon points="${janelaSalaTerreo}" fill="url(#grad-arch-glass)" />
        <polygon points="${portaEntradaPivot}" fill="url(#grad-arch-glass)" />
        <polygon points="${janelaCozinhaDir}" fill="url(#grad-arch-glass)" />

        <!-- Marquise em balanço -->
        <polygon points="${marquiseTopo}" fill="url(#grad-roof-slab)" />
        <polygon points="${marquiseFaceEsq}" fill="url(#grad-marquee-edge)" />
        <polygon points="${marquiseFaceDir}" fill="url(#grad-marquee-edge)" />

        <!-- Guarda-corpo de vidro -->
        <polygon points="${guardaCorpoEsq}" fill="rgba(125, 211, 252, 0.24)" />
        <polygon points="${guardaCorpoDir}" fill="rgba(186, 230, 253, 0.30)" />

        <!-- Volume do pavimento superior -->
        <polygon points="${faceSupEsq}" fill="url(#grad-wall-left)" />
        <polygon points="${faceSupDir}" fill="url(#grad-wall-right)" />
        <polygon points="${coberturaSup}" fill="url(#grad-roof-slab)" />

        <!-- Janelas panorâmicas superiores -->
        <polygon points="${janelaSuiteSupEsq}" fill="url(#grad-arch-glass)" />
        <polygon points="${janelaSuiteSupDir}" fill="url(#grad-arch-glass)" />
      </g>

      <!-- ATO 2: WIREFRAME 3D E BRILHO NAS ARESTAS -->
      <g class="layer-3d-wireframe">
        <path d="${wireframe3D}" class="wf-draw wf-structure" data-wf-start="0.0" data-wf-end="0.62" />
        <path d="${arestasBrilho}" class="wf-draw wf-edge-highlight" filter="url(#intro-glow-blue)" data-wf-start="0.22" data-wf-end="0.88" />
        <g class="wf-height-dim">
          <path d="${linhaCotaAltura}" class="wf-draw bp-dim-line" data-wf-start="0.30" data-wf-end="0.85" />
          <text x="${cotaAltMeio[0] + 10}" y="${cotaAltMeio[1]}" text-anchor="start" class="bp-dim-text">H = 6,20 m</text>
        </g>
      </g>
    </svg>
  `;
}

/**
 * Sintetizador de áudio sutil via Web Audio API (desligado por padrão, sem arquivos pesados)
 */
class AudioArquitetonicoOpcional {
  private ctx: AudioContext | null = null;
  private ativo = false;
  private tocouConstrucao = false;
  private tocouMarca = false;

  public alternar(): boolean {
    this.ativo = !this.ativo;
    if (this.ativo) {
      this.garantirContexto();
      this.tocarPulsoProjeto();
    } else if (this.ctx && this.ctx.state === "running") {
      this.ctx.suspend().catch(() => {});
    }
    return this.ativo;
  }

  public estaAtivo(): boolean {
    return this.ativo;
  }

  private garantirContexto(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private tocarNotaSuave(freq: number, duracao: number, ganhoMax: number, tipo: OscillatorType = "sine", atraso = 0) {
    if (!this.ativo) return;
    const ctx = this.garantirContexto();
    if (!ctx) return;

    const agora = ctx.currentTime + atraso;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, agora);

    gain.gain.setValueAtTime(0.0001, agora);
    gain.gain.exponentialRampToValueAtTime(ganhoMax, agora + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(agora);
    osc.stop(agora + duracao + 0.04);
  }

  public tocarPulsoProjeto() {
    this.tocarNotaSuave(523.25, 0.45, 0.028, "sine", 0);
    this.tocarNotaSuave(783.99, 0.55, 0.018, "triangle", 0.08);
  }

  public acionarFaseConstrucao() {
    if (this.tocouConstrucao || !this.ativo) return;
    this.tocouConstrucao = true;
    this.tocarNotaSuave(196.0, 1.2, 0.035, "sine", 0);
    this.tocarNotaSuave(293.66, 1.1, 0.024, "triangle", 0.12);
    this.tocarNotaSuave(392.0, 1.0, 0.02, "sine", 0.24);
  }

  public acionarFaseMarca() {
    if (this.tocouMarca || !this.ativo) return;
    this.tocouMarca = true;
    this.tocarNotaSuave(261.63, 1.5, 0.036, "sine", 0);
    this.tocarNotaSuave(392.0, 1.4, 0.028, "sine", 0.08);
    this.tocarNotaSuave(523.25, 1.5, 0.025, "triangle", 0.16);
    this.tocarNotaSuave(659.25, 1.6, 0.02, "sine", 0.26);
  }

  public tocarTransicaoEntradaLoja() {
    if (!this.ativo) return;
    this.tocarNotaSuave(440, 0.35, 0.022, "sine", 0);
    this.tocarNotaSuave(659.25, 0.45, 0.02, "sine", 0.06);
  }

  public destruir() {
    this.ativo = false;
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

function prepararSloganAnimado(sloganEl: HTMLElement | null) {
  if (!sloganEl) return;
  const textoOriginal = (sloganEl.getAttribute("data-slogan") || sloganEl.textContent || "").trim();
  if (!textoOriginal) return;

  sloganEl.setAttribute("aria-label", textoOriginal);
  const chars = Array.from(textoOriginal);
  const centro = (chars.length - 1) / 2;

  sloganEl.innerHTML = chars
    .map((ch, idx) => {
      const offset = (idx - centro).toFixed(2);
      const dist = Math.abs(idx - centro).toFixed(2);
      const conteudo = ch === " " ? "&nbsp;" : ch;
      return `<span class="intro-slogan-char" aria-hidden="true" style="--char-offset:${offset};--char-dist:${dist}">${conteudo}</span>`;
    })
    .join("");
}

interface CaminhoAnimado {
  el: SVGGeometryElement;
  comprimento: number;
  inicio: number;
  fim: number;
}

function coletarCaminhosSvg(raiz: ParentNode, seletor: string, attrInicio: string, attrFim: string): CaminhoAnimado[] {
  const lista: CaminhoAnimado[] = [];
  raiz.querySelectorAll<SVGGeometryElement>(seletor).forEach((el) => {
    try {
      const comprimento = Math.max(1, el.getTotalLength());
      const inicio = Number(el.getAttribute(attrInicio) ?? "0");
      const fim = Number(el.getAttribute(attrFim) ?? "1");
      el.style.strokeDasharray = `${comprimento}`;
      el.style.strokeDashoffset = `${comprimento}`;
      lista.push({ el, comprimento, inicio, fim });
    } catch {
      // Fallback seguro caso algum navegador não calcule comprimento de sub-elemento
    }
  });
  return lista;
}

function clamp01(valor: number): number {
  return Math.max(0, Math.min(1, valor));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function easeInOutQuad(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function inicializarIntroTeky() {
  const htmlEl = document.documentElement;
  const introEl = document.getElementById("intro-teky");

  // Limpa o watchdog de segurança do <head> pois o módulo carregou normalmente
  const w = window as unknown as { __tekyIntroWatchdog?: number };
  if (w.__tekyIntroWatchdog) {
    window.clearTimeout(w.__tekyIntroWatchdog);
  }

  if (!introEl || htmlEl.getAttribute("data-intro-done") === "true") {
    if (introEl) introEl.hidden = true;
    htmlEl.removeAttribute("data-intro-active");
    htmlEl.setAttribute("data-intro-done", "true");
    return;
  }

  // Se já foi vista nesta sessão, garante remoção imediata sem exibir
  let jaVista = false;
  try {
    jaVista = sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    jaVista = false;
  }

  if (jaVista) {
    introEl.hidden = true;
    htmlEl.removeAttribute("data-intro-active");
    htmlEl.setAttribute("data-intro-done", "true");
    return;
  }

  const prefereMovimentoReduzido =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elementos internos da abertura
  const svgHost = document.getElementById("intro-svg-scene");
  const canvas = document.getElementById("intro-fx-canvas") as HTMLCanvasElement | null;
  const parallaxStage = document.getElementById("intro-parallax-stage");
  const btnEntrar = document.getElementById("intro-btn-entrar") as HTMLButtonElement | null;
  const btnPular = document.getElementById("intro-btn-pular") as HTMLButtonElement | null;
  const btnSom = document.getElementById("intro-btn-som") as HTMLButtonElement | null;
  const iconeSomOff = document.getElementById("intro-icone-som-off");
  const iconeSomOn = document.getElementById("intro-icone-som-on");
  const rotuloSom = document.getElementById("intro-rotulo-som");
  const barraProgresso = document.getElementById("intro-progress-fill");
  const rotuloFase = document.getElementById("intro-phase-label");
  const sloganEl = document.getElementById("intro-slogan-text");

  introEl.hidden = false;
  htmlEl.setAttribute("data-intro-active", "true");

  prepararSloganAnimado(sloganEl);

  // Injeta a cena arquitetônica SVG apenas quando animação completa for usada
  let caminhosPlanta: CaminhoAnimado[] = [];
  let caminhosWireframe: CaminhoAnimado[] = [];

  if (!prefereMovimentoReduzido && svgHost) {
    svgHost.innerHTML = gerarSvgCenaArquitetonica();
    caminhosPlanta = coletarCaminhosSvg(svgHost, ".bp-draw", "data-draw-start", "data-draw-end");
    caminhosWireframe = coletarCaminhosSvg(svgHost, ".wf-draw", "data-wf-start", "data-wf-end");
  }

  const audio = new AudioArquitetonicoOpcional();
  let encerrada = false;
  let rafId = 0;
  let focoEntrarAplicado = false;

  // Estado de parallax suave (mouse ou inclinação do celular)
  let alvoParallaxX = 0;
  let alvoParallaxY = 0;
  let atualParallaxX = 0;
  let atualParallaxY = 0;

  // Configuração de partículas adaptativa para celular / hardware modesto
  const telaPequena = window.innerWidth < 768;
  const nucleos = navigator.hardwareConcurrency || 4;
  const qtdParticulas = prefereMovimentoReduzido ? 0 : telaPequena || nucleos <= 4 ? 20 : 48;
  const particulas: ParticulaLuz[] = [];

  let larguraCanvas = window.innerWidth;
  let alturaCanvas = window.innerHeight;
  const ctx2d = !prefereMovimentoReduzido && canvas ? canvas.getContext("2d") : null;

  function redimensionarCanvas() {
    if (!canvas || !ctx2d) return;
    const dpr = Math.min(window.devicePixelRatio || 1, telaPequena ? 1.5 : 2);
    larguraCanvas = window.innerWidth;
    alturaCanvas = window.innerHeight;
    canvas.width = Math.floor(larguraCanvas * dpr);
    canvas.height = Math.floor(alturaCanvas * dpr);
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function criarParticulas() {
    particulas.length = 0;
    const matizes: Array<"azul" | "branco" | "ciano"> = ["azul", "ciano", "branco"];
    for (let i = 0; i < qtdParticulas; i++) {
      const ascendente = i % 3 === 0;
      particulas.push({
        x: Math.random() * larguraCanvas,
        y: Math.random() * alturaCanvas,
        vx: (Math.random() - 0.5) * 0.32,
        vy: ascendente ? -(0.35 + Math.random() * 0.65) : (Math.random() - 0.5) * 0.24,
        raio: ascendente ? 1.2 + Math.random() * 1.8 : 0.8 + Math.random() * 1.4,
        alfaBase: 0.22 + Math.random() * 0.52,
        fase: Math.random() * Math.PI * 2,
        matiz: matizes[i % matizes.length],
        ascendente
      });
    }
  }

  if (ctx2d) {
    redimensionarCanvas();
    criarParticulas();
  }

  function marcarSessaoVista() {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Ignora bloqueio de storage em modo privado restrito
    }
  }

  function finalizarRemocaoDom() {
    if (!introEl) return;
    introEl.hidden = true;
    htmlEl.removeAttribute("data-intro-active");
    htmlEl.removeAttribute("data-intro-closing");
    htmlEl.setAttribute("data-intro-done", "true");
    audio.destruir();

    // Move foco de forma acessível para a loja principal sem causar salto brusco de scroll
    const alvoFocoLoja = document.getElementById("logo-loja") as HTMLElement | null;
    if (alvoFocoLoja) {
      alvoFocoLoja.focus({ preventScroll: true });
    }
  }

  function encerrarIntro() {
    if (encerrada) return;
    encerrada = true;

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    removerListeners();
    marcarSessaoVista();
    audio.tocarTransicaoEntradaLoja();

    // Libera a rolagem da página imediatamente enquanto as cortinas de luz se abrem
    htmlEl.removeAttribute("data-intro-active");
    htmlEl.setAttribute("data-intro-closing", "true");
    introEl?.classList.add("is-opening-curtains");

    const duracaoSaida = prefereMovimentoReduzido ? 120 : 660;
    window.setTimeout(finalizarRemocaoDom, duracaoSaida);
  }

  // Eventos de parallax e teclado
  function aoMoverPonteiro(e: PointerEvent) {
    if (prefereMovimentoReduzido || larguraCanvas <= 0 || alturaCanvas <= 0) return;
    const nx = (e.clientX / larguraCanvas - 0.5) * 2;
    const ny = (e.clientY / alturaCanvas - 0.5) * 2;
    alvoParallaxX = Math.max(-1, Math.min(1, nx));
    alvoParallaxY = Math.max(-1, Math.min(1, ny));
  }

  function aoInclinarCelular(e: DeviceOrientationEvent) {
    if (prefereMovimentoReduzido) return;
    if (typeof e.gamma === "number" && typeof e.beta === "number") {
      alvoParallaxX = Math.max(-1, Math.min(1, e.gamma / 28));
      alvoParallaxY = Math.max(-1, Math.min(1, (e.beta - 45) / 28));
    }
  }

  function aoPressionarTecla(e: KeyboardEvent) {
    if (encerrada) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      encerrarIntro();
      return;
    }

    // Mantém foco contido nos controles visíveis da intro (acessibilidade por Tab)
    if (e.key === "Tab" && introEl) {
      const focaveis = [btnSom, btnPular, btnEntrar].filter(
        (el): el is HTMLButtonElement =>
          Boolean(el && !el.disabled && window.getComputedStyle(el).visibility !== "hidden")
      );
      if (focaveis.length > 0) {
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    }
  }

  function removerListeners() {
    window.removeEventListener("resize", redimensionarCanvas);
    window.removeEventListener("pointermove", aoMoverPonteiro);
    window.removeEventListener("deviceorientation", aoInclinarCelular);
    window.removeEventListener("keydown", aoPressionarTecla, true);
  }

  window.addEventListener("resize", redimensionarCanvas, { passive: true });
  window.addEventListener("pointermove", aoMoverPonteiro, { passive: true });
  window.addEventListener("deviceorientation", aoInclinarCelular, { passive: true });
  window.addEventListener("keydown", aoPressionarTecla, true);

  if (btnEntrar) {
    btnEntrar.addEventListener("click", () => encerrarIntro());
  }
  if (btnPular) {
    btnPular.addEventListener("click", () => encerrarIntro());
  }
  if (btnSom) {
    btnSom.addEventListener("click", () => {
      const ligado = audio.alternar();
      btnSom.setAttribute("aria-pressed", ligado ? "true" : "false");
      btnSom.setAttribute(
        "aria-label",
        ligado ? "Desativar efeito sonoro da abertura" : "Ativar efeito sonoro da abertura"
      );
      if (iconeSomOff) iconeSomOff.hidden = ligado;
      if (iconeSomOn) iconeSomOn.hidden = !ligado;
      if (rotuloSom) rotuloSom.textContent = ligado ? "Som ligado" : "Som";
    });
  }

  // Modo prefers-reduced-motion: exibe direto a tela final estática da marca
  if (prefereMovimentoReduzido) {
    introEl.setAttribute("data-phase", "brand");
    introEl.classList.add("is-cta-ready", "is-reduced-motion");
    if (barraProgresso) barraProgresso.style.transform = "scaleX(1)";
    if (rotuloFase) rotuloFase.textContent = "TEKY BAZAR";
    if (btnEntrar) {
      btnEntrar.disabled = false;
      btnEntrar.focus({ preventScroll: true });
    }
    return;
  }

  // Elementos SVG específicos para controle fino de transform/opacity em 60fps
  const grupoSolidos3D = svgHost?.querySelector<SVGGElement>(".layer-3d-solids") ?? null;
  const grupoPlanta2D = svgHost?.querySelector<SVGGElement>(".layer-blueprint") ?? null;
  const grupoCotas2D = svgHost?.querySelector<SVGGElement>(".bp-dimensions") ?? null;
  const grupoLabelsPlanta = svgHost?.querySelector<SVGGElement>(".bp-room-labels") ?? null;
  const grupoCotaAltura = svgHost?.querySelector<SVGGElement>(".wf-height-dim") ?? null;

  const inicioMs = performance.now();

  function renderizarCanvasParticulasEFlares(decorrido: number) {
    if (!ctx2d) return;
    ctx2d.clearRect(0, 0, larguraCanvas, alturaCanvas);

    const cx = larguraCanvas * 0.5 + atualParallaxX * 14;
    const cy = alturaCanvas * 0.47 + atualParallaxY * 10;

    // Poeira de luz e partículas ascendentes de construção
    const intensidadeConstrucao =
      decorrido >= 1300 && decorrido <= 3700
        ? Math.sin(clamp01((decorrido - 1300) / 2400) * Math.PI)
        : 0;

    for (let i = 0; i < particulas.length; i++) {
      const p = particulas[i];
      const fatorVel = p.ascendente ? 1 + intensidadeConstrucao * 1.45 : 1;
      p.x += p.vx;
      p.y += p.vy * fatorVel;

      if (p.x < -10) p.x = larguraCanvas + 10;
      if (p.x > larguraCanvas + 10) p.x = -10;
      if (p.y < -10) {
        p.y = alturaCanvas + 10;
        if (p.ascendente && intensidadeConstrucao > 0.2) {
          p.x = cx + (Math.random() - 0.5) * Math.min(larguraCanvas * 0.55, 380);
        }
      }
      if (p.y > alturaCanvas + 10) p.y = -10;

      const cintilacao = 0.65 + 0.35 * Math.sin(decorrido * 0.003 + p.fase);
      const alfa = p.alfaBase * cintilacao * (p.ascendente ? 0.55 + intensidadeConstrucao * 0.65 : 0.8);

      ctx2d.beginPath();
      ctx2d.arc(p.x + atualParallaxX * 8, p.y + atualParallaxY * 6, p.raio, 0, Math.PI * 2);
      if (p.matiz === "branco") {
        ctx2d.fillStyle = `rgba(248, 250, 252, ${alfa.toFixed(3)})`;
      } else if (p.matiz === "ciano") {
        ctx2d.fillStyle = `rgba(125, 211, 252, ${alfa.toFixed(3)})`;
      } else {
        ctx2d.fillStyle = `rgba(96, 165, 250, ${alfa.toFixed(3)})`;
      }
      ctx2d.fill();
    }

    // Flash luminoso controlado + Lens Flare anamórfico na transição Casa 3D -> Marca (3,35s a 4,45s)
    if (decorrido >= 3350 && decorrido <= 4650) {
      const tFlare = (decorrido - 3350) / 1300;
      // Pico suave em ~3,62s
      const envelope =
        tFlare < 0.22
          ? easeOutCubic(tFlare / 0.22)
          : Math.pow(1 - clamp01((tFlare - 0.22) / 0.78), 2.1);

      if (envelope > 0.005) {
        ctx2d.save();
        ctx2d.globalCompositeOperation = "lighter";

        // Bloom radial central
        const raioBloom = Math.min(larguraCanvas, alturaCanvas) * (0.28 + tFlare * 0.22);
        const gradBloom = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, raioBloom);
        gradBloom.addColorStop(0, `rgba(240, 249, 255, ${(envelope * 0.78).toFixed(3)})`);
        gradBloom.addColorStop(0.28, `rgba(96, 165, 250, ${(envelope * 0.45).toFixed(3)})`);
        gradBloom.addColorStop(0.65, `rgba(37, 99, 235, ${(envelope * 0.14).toFixed(3)})`);
        gradBloom.addColorStop(1, "rgba(5, 11, 31, 0)");
        ctx2d.fillStyle = gradBloom;
        ctx2d.beginPath();
        ctx2d.arc(cx, cy, raioBloom, 0, Math.PI * 2);
        ctx2d.fill();

        // Feixe horizontal anamórfico (lens flare cinematográfico sutil)
        const meiaLarguraFeixe = Math.min(larguraCanvas * 0.46, 460) * (0.65 + envelope * 0.35);
        const gradFeixe = ctx2d.createLinearGradient(cx - meiaLarguraFeixe, cy, cx + meiaLarguraFeixe, cy);
        gradFeixe.addColorStop(0, "rgba(56, 189, 248, 0)");
        gradFeixe.addColorStop(0.35, `rgba(125, 211, 252, ${(envelope * 0.38).toFixed(3)})`);
        gradFeixe.addColorStop(0.5, `rgba(255, 255, 255, ${(envelope * 0.85).toFixed(3)})`);
        gradFeixe.addColorStop(0.65, `rgba(125, 211, 252, ${(envelope * 0.38).toFixed(3)})`);
        gradFeixe.addColorStop(1, "rgba(56, 189, 248, 0)");

        ctx2d.fillStyle = gradFeixe;
        ctx2d.fillRect(cx - meiaLarguraFeixe, cy - 2.2, meiaLarguraFeixe * 2, 4.4);
        ctx2d.restore();
      }
    }
  }

  function animarQuadro(agora: number) {
    if (encerrada || !introEl) return;

    const decorrido = Math.max(0, agora - inicioMs);
    const progressoGeral = clamp01(decorrido / DURACAO_TOTAL_MS);

    // Suavização de parallax
    atualParallaxX += (alvoParallaxX - atualParallaxX) * 0.08;
    atualParallaxY += (alvoParallaxY - atualParallaxY) * 0.08;

    if (parallaxStage) {
      const tx = (atualParallaxX * 12).toFixed(2);
      const ty = (atualParallaxY * 8).toFixed(2);
      parallaxStage.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }

    // Barra de progresso inferior (somente transform: scaleX)
    if (barraProgresso) {
      barraProgresso.style.transform = `scaleX(${progressoGeral.toFixed(4)})`;
    }

    // Controle dos 3 atos contínuos
    if (decorrido < FASE_CONSTRUCAO_MS) {
      // ATO 1: PROJETO (0 – 1,5s)
      if (introEl.getAttribute("data-phase") !== "blueprint") {
        introEl.setAttribute("data-phase", "blueprint");
        if (rotuloFase) rotuloFase.textContent = "01 · Projeto arquitetônico";
      }

      const t1 = clamp01(decorrido / FASE_CONSTRUCAO_MS);
      for (let i = 0; i < caminhosPlanta.length; i++) {
        const item = caminhosPlanta[i];
        const local = easeOutCubic((t1 - item.inicio) / Math.max(0.05, item.fim - item.inicio));
        item.el.style.strokeDashoffset = `${(item.comprimento * (1 - local)).toFixed(1)}`;
      }

      if (grupoCotas2D) {
        grupoCotas2D.style.opacity = `${easeOutCubic((t1 - 0.36) / 0.55).toFixed(3)}`;
      }
      if (grupoLabelsPlanta) {
        grupoLabelsPlanta.style.opacity = `${(easeOutCubic((t1 - 0.45) / 0.48) * 0.78).toFixed(3)}`;
      }
      if (svgHost) {
        const escalaCam = 0.93 + 0.06 * easeInOutQuad(t1);
        svgHost.style.transform = `translate3d(0, ${(10 * (1 - t1)).toFixed(1)}px, 0) scale(${escalaCam.toFixed(4)})`;
        svgHost.style.opacity = `${clamp01(decorrido / 280).toFixed(3)}`;
      }
    } else if (decorrido < FASE_MARCA_MS) {
      // ATO 2: CONSTRUÇÃO 3D CONTÍNUA (1,5 – 3,5s)
      if (introEl.getAttribute("data-phase") !== "construction") {
        introEl.setAttribute("data-phase", "construction");
        if (rotuloFase) rotuloFase.textContent = "02 · Construção e estrutura 3D";
        audio.acionarFaseConstrucao();
        // Garante planta 100% desenhada
        for (let i = 0; i < caminhosPlanta.length; i++) {
          caminhosPlanta[i].el.style.strokeDashoffset = "0";
        }
      }

      const t2 = clamp01((decorrido - FASE_CONSTRUCAO_MS) / (FASE_MARCA_MS - FASE_CONSTRUCAO_MS));

      // Wireframe 3D se ergue da planta baixa
      for (let i = 0; i < caminhosWireframe.length; i++) {
        const item = caminhosWireframe[i];
        const local = easeOutCubic((t2 - item.inicio) / Math.max(0.05, item.fim - item.inicio));
        item.el.style.strokeDashoffset = `${(item.comprimento * (1 - local)).toFixed(1)}`;
      }

      // Volumes sólidos, vidros e iluminação preenchem suavemente a estrutura
      if (grupoSolidos3D) {
        const alfaSolidos = easeInOutQuad((t2 - 0.24) / 0.58);
        grupoSolidos3D.style.opacity = `${alfaSolidos.toFixed(3)}`;
      }

      // Planta interna suaviza conforme os volumes sólidos cobrem o térreo
      if (grupoLabelsPlanta) {
        grupoLabelsPlanta.style.opacity = `${Math.max(0, 0.78 * (1 - t2 * 1.8)).toFixed(3)}`;
      }
      if (grupoCotas2D) {
        grupoCotas2D.style.opacity = `${Math.max(0.22, 1 - t2 * 0.65).toFixed(3)}`;
      }
      if (grupoCotaAltura) {
        grupoCotaAltura.style.opacity = `${easeOutCubic((t2 - 0.32) / 0.45).toFixed(3)}`;
      }
      if (grupoPlanta2D) {
        grupoPlanta2D.style.opacity = `${(1 - t2 * 0.35).toFixed(3)}`;
      }

      if (svgHost) {
        const escalaCam = 0.99 + 0.05 * easeInOutQuad(t2);
        const elevacaoY = -6 * easeInOutQuad(t2);
        svgHost.style.transform = `translate3d(0, ${elevacaoY.toFixed(1)}px, 0) scale(${escalaCam.toFixed(4)})`;
        svgHost.style.opacity = "1";
      }
    } else {
      // ATO 3: REVELAÇÃO DA MARCA TEKY BAZAR (3,5 – 5,0s+)
      if (introEl.getAttribute("data-phase") !== "brand") {
        introEl.setAttribute("data-phase", "brand");
        if (rotuloFase) rotuloFase.textContent = "TEKY BAZAR · São Pedro da Aldeia";
        audio.acionarFaseMarca();
      }

      // Dissolução luminosa da casa 3D entre 3,5s e 3,92s
      const tDissolve = clamp01((decorrido - FASE_MARCA_MS) / 420);
      if (svgHost) {
        const escalaSaida = 1.04 + 0.08 * easeOutCubic(tDissolve);
        svgHost.style.opacity = `${(1 - easeOutCubic(tDissolve)).toFixed(3)}`;
        svgHost.style.transform = `translate3d(0, ${(-6 - 14 * tDissolve).toFixed(1)}px, 0) scale(${escalaSaida.toFixed(4)})`;
      }

      // Habilita e destaca o botão ENTRAR NA LOJA após revelação do slogan (~4,25s)
      if (decorrido >= 4250 && !focoEntrarAplicado) {
        focoEntrarAplicado = true;
        introEl.classList.add("is-cta-ready");
        if (btnEntrar) {
          btnEntrar.disabled = false;
          if (!document.activeElement || document.activeElement === document.body) {
            btnEntrar.focus({ preventScroll: true });
          }
        }
      }
    }

    if (!document.hidden) {
      renderizarCanvasParticulasEFlares(decorrido);
    }
    rafId = window.requestAnimationFrame(animarQuadro);
  }

  // Foco inicial discreto no botão Pular para usuários de teclado desde o instante 0s
  if (btnEntrar) {
    btnEntrar.disabled = true;
  }

  rafId = window.requestAnimationFrame(animarQuadro);
}

try {
  const wBoot = window as unknown as { __tekyIntroWatchdog?: number };
  if (wBoot.__tekyIntroWatchdog) {
    window.clearTimeout(wBoot.__tekyIntroWatchdog);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarIntroTeky, { once: true });
  } else {
    inicializarIntroTeky();
  }
} catch {
  // Fallback seguro: libera imediatamente a loja principal caso qualquer erro ocorra
  document.documentElement.removeAttribute("data-intro-active");
  document.documentElement.setAttribute("data-intro-done", "true");
  const el = document.getElementById("intro-teky");
  if (el) el.hidden = true;
}
