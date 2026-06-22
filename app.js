'use strict';

const STORAGE_KEY = 'paoa_lab_v1';
const APP_VERSION = '1.0.0';
const TYPES = [
  { value: 'carne', label: 'Carne / matéria-prima cárnea' },
  { value: 'gordura', label: 'Gordura' },
  { value: 'agua', label: 'Água / gelo' },
  { value: 'sal', label: 'Sal / sais' },
  { value: 'condimento', label: 'Condimento / especiaria' },
  { value: 'carboidrato', label: 'Carboidrato / amido / açúcar' },
  { value: 'proteina_nao_carnea', label: 'Proteína não cárnea' },
  { value: 'aditivo', label: 'Aditivo / coadjuvante' },
  { value: 'lacteo', label: 'Lácteo' },
  { value: 'outro', label: 'Outro' }
];

const DEFAULT_DB = {
  app_id: 'paoa_lab',
  version: APP_VERSION,
  configs: { ultimoProdutoAula: 'prod_hamburguer', filtroInsumo: 'todos' },
  produtos: [
    {
      id: 'prod_hamburguer',
      nome: 'Hambúrguer bovino',
      categoria: 'Produto cárneo reestruturado',
      especie: 'bovina',
      tipo: 'hamburguer',
      descricao: 'Produto cárneo industrializado obtido de carne moída, com ou sem tecido adiposo e ingredientes, moldado e submetido a processo tecnológico adequado.',
      objetivo: 'Compreender o efeito da gordura, do sal, da água gelada e do trabalho mecânico na formação da textura, suculência e rendimento do hambúrguer.',
      parametros: {
        gorduraMax: 25,
        proteinaMin: 15,
        carbMax: 3,
        proteinaNaoCarneaMax: 4,
        proibeProteinaNaoCarnea: false,
        mostrarValidacao: true
      },
      fotos: [],
      fluxo: [
        'Recepção e seleção da matéria-prima',
        'Pesagem dos insumos',
        'Moagem da carne e da gordura',
        'Mistura com sal, água gelada e condimentos',
        'Trabalho mecânico para melhorar a liga',
        'Moldagem em porções padronizadas',
        'Congelamento ou cocção conforme o objetivo da prática',
        'Avaliação de rendimento, textura, suculência e aparência'
      ],
      pontos: [
        'Manter carne e gordura refrigeradas durante a manipulação',
        'Conferir se a soma da formulação está em 100%',
        'Controlar o teor de gordura da formulação',
        'Evitar excesso de água livre',
        'Registrar peso antes e depois da cocção',
        'Conferir limites legais quando houver uso de proteína não cárnea ou carboidratos'
      ],
      perguntas: [
        'Qual foi o papel do sal na formação da textura?',
        'Como a gordura influenciou a suculência e a maciez?',
        'A formulação atende aos parâmetros legais de gordura, proteína e carboidratos?',
        'O que mudaria se fosse usado outro corte ou outra espécie animal?'
      ]
    }
  ],
  insumos: [
    { id: 'ing_carne_bovina_magra', nome: 'Carne bovina magra', categoria: 'Matéria-prima cárnea', tipo: 'carne', funcao: 'Fornece proteínas miofibrilares responsáveis pela estrutura, liga e textura do produto.', obs: 'Para aula, pode-se comparar cortes mais magros e cortes com maior teor de gordura.', gordura: 5, proteina: 20, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_gordura_bovina', nome: 'Gordura bovina', categoria: 'Gordura animal', tipo: 'gordura', funcao: 'Contribui para suculência, sabor, maciez e percepção de palatabilidade.', obs: 'Deve ser bem distribuída para evitar perda excessiva durante a cocção.', gordura: 100, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_agua_gelada', nome: 'Água gelada', categoria: 'Veículo tecnológico', tipo: 'agua', funcao: 'Ajuda na distribuição dos ingredientes, hidratação e controle de temperatura durante a mistura.', obs: 'O excesso pode deixar a massa pouco coesa.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_sal', nome: 'Sal', categoria: 'Condimento / sal', tipo: 'sal', funcao: 'Contribui para sabor e favorece a extração de proteínas miofibrilares, aumentando a liga da massa.', obs: 'Em aula, comparar formulações com diferentes teores de sal mostra diferença de coesão.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_alho_po', nome: 'Alho em pó', categoria: 'Condimento', tipo: 'condimento', funcao: 'Fornece sabor e aroma característicos.', obs: 'Pode ser substituído por alho fresco, ajustando umidade e intensidade.', gordura: 0, proteina: 0, carboidrato: 70, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_proteina_soja', nome: 'Proteína de soja texturizada/fina', categoria: 'Proteína não cárnea', tipo: 'proteina_nao_carnea', funcao: 'Pode contribuir para retenção de água, rendimento e textura, respeitando os limites do produto.', obs: 'Discutir rotulagem, limite legal e impacto sensorial.', gordura: 1, proteina: 50, carboidrato: 30, custo: 0, proteinaNaoCarnea: true, alergeno: true },
    { id: 'ing_amido', nome: 'Amido', categoria: 'Carboidrato', tipo: 'carboidrato', funcao: 'Auxilia na retenção de água e na estabilidade, mas deve respeitar o limite de carboidratos totais do produto.', obs: 'Útil para discutir rendimento e textura.', gordura: 0, proteina: 0, carboidrato: 88, custo: 0, proteinaNaoCarnea: false, alergeno: false }
  ],
  formulacoes: [
    {
      id: 'form_hamb_base',
      produtoId: 'prod_hamburguer',
      nome: 'Hambúrguer bovino base',
      pesoReferencia: 1000,
      rendimento: 82,
      itens: [
        { insumoId: 'ing_carne_bovina_magra', percentual: 76 },
        { insumoId: 'ing_gordura_bovina', percentual: 18 },
        { insumoId: 'ing_agua_gelada', percentual: 3 },
        { insumoId: 'ing_sal', percentual: 1.8 },
        { insumoId: 'ing_alho_po', percentual: 1.2 }
      ],
      observacoes: 'Formulação inicial para discussão do papel da gordura e do sal na estrutura do hambúrguer.'
    }
  ],
  legislacoes: [
    {
      id: 'leg_hamburguer_724_2022',
      produtoId: 'prod_hamburguer',
      titulo: 'Portaria SDA/MAPA nº 724/2022',
      orgao: 'Ministério da Agricultura e Pecuária',
      url: 'https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-animal/legislacao/Port7242022RThamburguer1.pdf',
      resumo: 'Aprova o Regulamento Técnico de Identidade e Qualidade do hambúrguer. Define ingredientes permitidos, denominação de venda e parâmetros físico-químicos como gordura máxima, carboidratos totais máximos e proteína mínima.',
      pontos: [
        'Gordura máxima: 25%',
        'Carboidratos totais máximos: 3%',
        'Proteína mínima: 15%',
        'Proteína não cárnea: máximo de 4% na forma agregada',
        'Quando houver indicação de corte na denominação de venda, não é permitida adição de proteína não cárnea'
      ]
    },
    {
      id: 'leg_rotulagem_anvisa',
      produtoId: null,
      titulo: 'Rotulagem de alimentos - Anvisa',
      orgao: 'Agência Nacional de Vigilância Sanitária',
      url: 'https://www.gov.br/anvisa/pt-br/assuntos/alimentos/rotulagem',
      resumo: 'Página de referência sobre regras de rotulagem de alimentos, incluindo lista de ingredientes, informações nutricionais e cuidados para evitar informações que induzam o consumidor ao erro.',
      pontos: [
        'Útil para discutir denominação de venda',
        'Útil para discutir lista de ingredientes',
        'Útil para discutir informação nutricional e rotulagem frontal'
      ]
    }
  ]
};

let db = loadDB();
let activePage = 'Inicio';
let selectedIngredientFilter = db.configs.filtroInsumo || 'todos';
let pendingInstallPrompt = null;
let tempProductPhotos = [];
let formulaDraftItems = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

window.addEventListener('DOMContentLoaded', init);

function init() {
  setTimeout(() => $('#splashScreen')?.classList.add('hide'), 450);
  setupEvents();
  populateTypeOptions();
  renderAll();
  registerServiceWorker();
}

function setupEvents() {
  $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => setPage(btn.dataset.page)));
  $$('[data-action="open-product"]').forEach(btn => btn.addEventListener('click', () => openProductModal()));
  $$('[data-action="open-ingredient"]').forEach(btn => btn.addEventListener('click', () => openIngredientModal()));
  $$('[data-action="open-formula"]').forEach(btn => btn.addEventListener('click', () => openFormulaModal()));
  $$('[data-close]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.close)));
  $$('.modal-overlay').forEach(overlay => overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeModal(overlay.id); }));
  $$('[data-toggle]').forEach(btn => btn.addEventListener('click', () => $('#' + btn.dataset.toggle)?.classList.toggle('open')));

  $('#searchProdutos')?.addEventListener('input', renderProdutos);
  $('#searchInsumos')?.addEventListener('input', renderInsumos);
  $('#formulaProductFilter')?.addEventListener('change', renderFormulas);
  $('#aulaProdutoSelect')?.addEventListener('change', ev => { db.configs.ultimoProdutoAula = ev.target.value; saveDB(); renderAulas(); });
  $('#btnSalvarProduto')?.addEventListener('click', saveProductFromModal);
  $('#btnExcluirProduto')?.addEventListener('click', deleteProductFromModal);
  $('#produtoFotos')?.addEventListener('change', handleProductPhotos);
  $('#btnSalvarInsumo')?.addEventListener('click', saveIngredientFromModal);
  $('#btnExcluirInsumo')?.addEventListener('click', deleteIngredientFromModal);
  $('#btnSalvarFormula')?.addEventListener('click', saveFormulaFromModal);
  $('#btnExcluirFormula')?.addEventListener('click', deleteFormulaFromModal);
  $('#btnAddFormulaItem')?.addEventListener('click', () => { formulaDraftItems.push({ insumoId: db.insumos[0]?.id || '', percentual: 0 }); renderFormulaItems(); });
  $('#formulaPeso')?.addEventListener('input', renderFormulaItems);
  $('#formulaProduto')?.addEventListener('change', renderFormulaItems);
  $('#btnGerarRelatorio')?.addEventListener('click', showFormulaReport);
  $('#btnCopiarRelatorio')?.addEventListener('click', copyReport);
  $('#btnCopiarRoteiro')?.addEventListener('click', copyLesson);
  $('#btnConfig')?.addEventListener('click', () => openModal('modalConfig'));
  $('#btnExportar')?.addEventListener('click', exportData);
  $('#btnImportar')?.addEventListener('click', () => $('#fileImportar').click());
  $('#fileImportar')?.addEventListener('change', importData);
  $('#btnBaixarModelo')?.addEventListener('click', downloadTemplate);
  $('#btnResetDemo')?.addEventListener('click', resetDemo);

  window.addEventListener('beforeinstallprompt', (ev) => {
    ev.preventDefault();
    pendingInstallPrompt = ev;
    const btn = $('#btnInstall');
    if (btn) btn.hidden = false;
  });
  $('#btnInstall')?.addEventListener('click', async () => {
    if (!pendingInstallPrompt) return toast('A instalação será oferecida pelo navegador quando disponível.');
    pendingInstallPrompt.prompt();
    await pendingInstallPrompt.userChoice;
    pendingInstallPrompt = null;
    $('#btnInstall').hidden = true;
  });
}

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_DB);
    const parsed = JSON.parse(raw);
    return normalizeDB(parsed);
  } catch (err) {
    console.error(err);
    return clone(DEFAULT_DB);
  }
}

function normalizeDB(data) {
  const base = clone(DEFAULT_DB);
  const merged = Object.assign(base, data || {});
  merged.configs = Object.assign(base.configs, data?.configs || {});
  merged.produtos = Array.isArray(data?.produtos) ? data.produtos : base.produtos;
  merged.insumos = Array.isArray(data?.insumos) ? data.insumos : base.insumos;
  merged.formulacoes = Array.isArray(data?.formulacoes) ? data.formulacoes : base.formulacoes;
  merged.legislacoes = Array.isArray(data?.legislacoes) ? data.legislacoes : base.legislacoes;
  merged.produtos.forEach(p => {
    p.parametros = Object.assign({ gorduraMax: '', proteinaMin: '', carbMax: '', proteinaNaoCarneaMax: '', proibeProteinaNaoCarnea: false, mostrarValidacao: true }, p.parametros || {});
    p.fotos = Array.isArray(p.fotos) ? p.fotos : [];
    p.fluxo = Array.isArray(p.fluxo) ? p.fluxo : linesFrom(p.fluxo);
    p.pontos = Array.isArray(p.pontos) ? p.pontos : linesFrom(p.pontos);
    p.perguntas = Array.isArray(p.perguntas) ? p.perguntas : linesFrom(p.perguntas);
  });
  merged.insumos.forEach(i => {
    i.gordura = toNumber(i.gordura);
    i.proteina = toNumber(i.proteina);
    i.carboidrato = toNumber(i.carboidrato);
    i.custo = toNumber(i.custo);
  });
  return merged;
}

function saveDB() {
  db.version = APP_VERSION;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function renderAll() {
  renderDashboard();
  renderHomeProducts();
  renderProdutos();
  renderInsumos();
  renderFormulaFilters();
  renderFormulas();
  renderAulaSelect();
  renderAulas();
  renderLegislacao();
}

function setPage(page) {
  activePage = page;
  $$('.page').forEach(p => p.classList.remove('active'));
  $('#page' + page)?.classList.add('active');
  $$('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));
  $('.content').scrollTop = 0;
  if (page === 'Formulas') renderFormulas();
  if (page === 'Aulas') renderAulas();
}

function renderDashboard() {
  const metrics = [
    ['Produtos', db.produtos.length],
    ['Insumos', db.insumos.length],
    ['Formulações', db.formulacoes.length],
    ['Normas', db.legislacoes.length]
  ];
  $('#dashboardMetrics').innerHTML = metrics.map(([label, value]) => `
    <div class="metric-card"><div class="metric-value">${value}</div><div class="metric-label">${label}</div></div>
  `).join('');
}

function renderHomeProducts() {
  const html = db.produtos.map(productCardHTML).join('') || emptyHTML('Nenhum produto cadastrado.');
  $('#homeProductCards').innerHTML = html;
  $('#homeProductCards').querySelectorAll('[data-product-card]').forEach(card => card.addEventListener('click', () => {
    db.configs.ultimoProdutoAula = card.dataset.productCard;
    saveDB();
    setPage('Aulas');
  }));
}

function renderProdutos() {
  const term = ($('#searchProdutos')?.value || '').toLowerCase().trim();
  const produtos = db.produtos.filter(p => [p.nome, p.categoria, p.especie, p.descricao].join(' ').toLowerCase().includes(term));
  $('#produtosList').innerHTML = produtos.map(p => productListHTML(p)).join('') || emptyHTML('Nenhum produto encontrado.');
  $('#produtosList').querySelectorAll('[data-edit-product]').forEach(el => el.addEventListener('click', () => openProductModal(el.dataset.editProduct)));
}

function productCardHTML(p) {
  const formulas = db.formulacoes.filter(f => f.produtoId === p.id).length;
  return `
    <div class="item-card" data-product-card="${p.id}">
      <div class="item-avatar">${photoOrInitial(p)}</div>
      <div>
        <div class="item-title">${escapeHTML(p.nome)}</div>
        <div class="item-subtitle">${escapeHTML(p.categoria || 'Sem categoria')} · ${formulas} formulação(ões)</div>
        <div class="item-meta">
          ${p.tipo === 'hamburguer' ? '<span class="badge warn">RTIQ hambúrguer</span>' : '<span class="badge info">Produto geral</span>'}
          ${p.fotos?.length ? `<span class="badge ok">${p.fotos.length} foto(s)</span>` : '<span class="badge">sem foto</span>'}
        </div>
      </div>
    </div>`;
}

function productListHTML(p) {
  const formulas = db.formulacoes.filter(f => f.produtoId === p.id);
  const analyses = formulas.map(analyzeFormula).flatMap(a => a.alerts).filter(a => a.type === 'danger');
  return `
    <div class="item-card" data-edit-product="${p.id}">
      <div class="item-avatar">${photoOrInitial(p)}</div>
      <div>
        <div class="item-title">${escapeHTML(p.nome)}</div>
        <div class="item-subtitle">${escapeHTML(p.descricao || p.categoria || 'Sem descrição')}</div>
        <div class="item-meta">
          <span class="badge info">${escapeHTML(p.categoria || 'Sem categoria')}</span>
          <span class="badge">${formulas.length} fórmula(s)</span>
          ${analyses.length ? '<span class="badge danger">alerta técnico</span>' : '<span class="badge ok">sem alerta grave</span>'}
        </div>
      </div>
    </div>`;
}

function renderInsumos() {
  renderIngredientFilters();
  const term = ($('#searchInsumos')?.value || '').toLowerCase().trim();
  const list = db.insumos.filter(i => {
    const okFilter = selectedIngredientFilter === 'todos' || i.tipo === selectedIngredientFilter;
    const okSearch = [i.nome, i.categoria, i.funcao, i.obs].join(' ').toLowerCase().includes(term);
    return okFilter && okSearch;
  });
  $('#insumosList').innerHTML = list.map(i => ingredientHTML(i)).join('') || emptyHTML('Nenhum insumo encontrado.');
  $('#insumosList').querySelectorAll('[data-edit-ingredient]').forEach(el => el.addEventListener('click', () => openIngredientModal(el.dataset.editIngredient)));
}

function renderIngredientFilters() {
  const chips = [{ value: 'todos', label: 'Todos' }, ...TYPES];
  $('#ingredientTypeFilters').innerHTML = chips.map(c => `<button class="chip ${selectedIngredientFilter === c.value ? 'active' : ''}" data-filter="${c.value}">${c.label}</button>`).join('');
  $('#ingredientTypeFilters').querySelectorAll('[data-filter]').forEach(chip => chip.addEventListener('click', () => {
    selectedIngredientFilter = chip.dataset.filter;
    db.configs.filtroInsumo = selectedIngredientFilter;
    saveDB();
    renderInsumos();
  }));
}

function ingredientHTML(i) {
  return `
    <div class="item-card" data-edit-ingredient="${i.id}">
      <div class="item-avatar">${ingredientIcon(i.tipo)}</div>
      <div>
        <div class="item-title">${escapeHTML(i.nome)}</div>
        <div class="item-subtitle">${escapeHTML(i.funcao || 'Sem função tecnológica cadastrada')}</div>
        <div class="item-meta">
          <span class="badge info">${escapeHTML(typeLabel(i.tipo))}</span>
          ${i.proteinaNaoCarnea ? '<span class="badge warn">proteína não cárnea</span>' : ''}
          ${i.alergeno ? '<span class="badge danger">alérgeno</span>' : ''}
          <span class="badge">G ${fmt(i.gordura)}% · P ${fmt(i.proteina)}% · C ${fmt(i.carboidrato)}%</span>
        </div>
      </div>
    </div>`;
}

function renderFormulaFilters() {
  const currentFilter = $('#formulaProductFilter')?.value || 'todos';
  const currentFormulaProduct = $('#formulaProduto')?.value || db.produtos[0]?.id || '';
  const opts = ['<option value="todos">Todos os produtos</option>', ...db.produtos.map(p => `<option value="${p.id}">${escapeHTML(p.nome)}</option>`)].join('');
  $('#formulaProductFilter').innerHTML = opts;
  if (db.produtos.some(p => p.id === currentFilter) || currentFilter === 'todos') $('#formulaProductFilter').value = currentFilter;
  $('#formulaProduto').innerHTML = db.produtos.map(p => `<option value="${p.id}">${escapeHTML(p.nome)}</option>`).join('');
  if (db.produtos.some(p => p.id === currentFormulaProduct)) $('#formulaProduto').value = currentFormulaProduct;
}

function renderFormulas() {
  renderFormulaFilters();
  const filter = $('#formulaProductFilter')?.value || 'todos';
  const formulas = db.formulacoes.filter(f => filter === 'todos' || f.produtoId === filter);
  $('#formulasList').innerHTML = formulas.map(formulaHTML).join('') || emptyHTML('Nenhuma formulação cadastrada.');
  $('#formulasList').querySelectorAll('[data-edit-formula]').forEach(el => el.addEventListener('click', () => openFormulaModal(el.dataset.editFormula)));
}

function formulaHTML(f) {
  const product = findProduct(f.produtoId);
  const analysis = analyzeFormula(f);
  const danger = analysis.alerts.some(a => a.type === 'danger');
  const warn = analysis.alerts.some(a => a.type === 'warn');
  return `
    <div class="item-card" data-edit-formula="${f.id}">
      <div class="item-avatar">🧮</div>
      <div>
        <div class="item-title">${escapeHTML(f.nome)}</div>
        <div class="item-subtitle">${escapeHTML(product?.nome || 'Produto não encontrado')} · soma ${fmt(analysis.totalPct)}%</div>
        <div class="item-meta">
          <span class="badge ${Math.abs(analysis.totalPct - 100) < 0.01 ? 'ok' : 'warn'}">Total ${fmt(analysis.totalPct)}%</span>
          <span class="badge ${analysis.fatPct <= (product?.parametros?.gorduraMax || 999) ? 'ok' : 'danger'}">Gordura ${fmt(analysis.fatPct)}%</span>
          <span class="badge ${danger ? 'danger' : warn ? 'warn' : 'ok'}">${danger ? 'corrigir' : warn ? 'atenção' : 'ok'}</span>
        </div>
      </div>
    </div>`;
}

function renderAulaSelect() {
  $('#aulaProdutoSelect').innerHTML = db.produtos.map(p => `<option value="${p.id}">${escapeHTML(p.nome)}</option>`).join('');
  if (db.configs.ultimoProdutoAula) $('#aulaProdutoSelect').value = db.configs.ultimoProdutoAula;
}

function renderAulas() {
  renderAulaSelect();
  const id = $('#aulaProdutoSelect')?.value || db.produtos[0]?.id;
  const p = findProduct(id);
  if (!p) {
    $('#aulaContent').innerHTML = emptyHTML('Cadastre um produto para montar o roteiro de aula.');
    return;
  }
  const formulas = db.formulacoes.filter(f => f.produtoId === p.id);
  const formulaCards = formulas.map(f => {
    const a = analyzeFormula(f);
    return `<div class="lesson-card"><h3>${escapeHTML(f.nome)}</h3>${analysisHTML(a)}<button class="secondary-btn full" data-edit-formula="${f.id}">Abrir formulação</button></div>`;
  }).join('') || '<div class="notice-card">Nenhuma formulação cadastrada para este produto.</div>';
  $('#aulaContent').innerHTML = `
    <div class="lesson-card">
      <h3>${escapeHTML(p.nome)}</h3>
      <p class="muted">${escapeHTML(p.objetivo || p.descricao || '')}</p>
      <div class="item-meta">
        <span class="badge info">${escapeHTML(p.categoria || 'Sem categoria')}</span>
        ${p.tipo === 'hamburguer' ? '<span class="badge warn">validação legal ativada</span>' : ''}
      </div>
      ${p.fotos?.length ? `<div class="photo-strip">${p.fotos.map(src => `<img class="photo-thumb" src="${src}" alt="Foto do produto">`).join('')}</div>` : ''}
    </div>
    <div class="lesson-card"><h3>Fluxograma</h3>${orderedList(p.fluxo)}</div>
    <div class="lesson-card"><h3>Pontos de controle</h3>${unorderedList(p.pontos)}</div>
    <div class="lesson-card"><h3>Perguntas para discussão</h3>${unorderedList(p.perguntas)}</div>
    <div class="section-header"><div><h2>Formulações da aula</h2><p>Use para cálculo e conferência técnica.</p></div></div>
    ${formulaCards}`;
  $('#aulaContent').querySelectorAll('[data-edit-formula]').forEach(el => el.addEventListener('click', () => openFormulaModal(el.dataset.editFormula)));
}

function renderLegislacao() {
  $('#legislacaoList').innerHTML = db.legislacoes.map(law => {
    const product = law.produtoId ? findProduct(law.produtoId) : null;
    return `<div class="law-card">
      <h3>${escapeHTML(law.titulo)}</h3>
      <div class="item-subtitle">${escapeHTML(law.orgao || '')}${product ? ' · ' + escapeHTML(product.nome) : ' · Geral'}</div>
      <p class="muted">${escapeHTML(law.resumo || '')}</p>
      ${unorderedList(law.pontos || [])}
      ${law.url ? `<button class="secondary-btn full" data-open-url="${escapeHTML(law.url)}">Abrir referência</button>` : ''}
    </div>`;
  }).join('') || emptyHTML('Nenhuma referência legal cadastrada.');
  $('#legislacaoList').querySelectorAll('[data-open-url]').forEach(btn => btn.addEventListener('click', () => window.open(btn.dataset.openUrl, '_blank', 'noopener')));
}

function openProductModal(id = null) {
  const p = id ? findProduct(id) : null;
  $('#produtoId').value = p?.id || '';
  $('#produtoNome').value = p?.nome || '';
  $('#produtoCategoria').value = p?.categoria || '';
  $('#produtoEspecie').value = p?.especie || '';
  $('#produtoTipo').value = p?.tipo || 'geral';
  $('#produtoDescricao').value = p?.descricao || '';
  $('#produtoObjetivo').value = p?.objetivo || '';
  $('#paramGorduraMax').value = p?.parametros?.gorduraMax ?? '';
  $('#paramProteinaMin').value = p?.parametros?.proteinaMin ?? '';
  $('#paramCarbMax').value = p?.parametros?.carbMax ?? '';
  $('#paramPncMax').value = p?.parametros?.proteinaNaoCarneaMax ?? '';
  $('#paramProibePnc').checked = Boolean(p?.parametros?.proibeProteinaNaoCarnea);
  $('#paramMostrarValidacao').checked = p?.parametros?.mostrarValidacao !== false;
  $('#produtoFluxo').value = (p?.fluxo || []).join('\n');
  $('#produtoPontos').value = (p?.pontos || []).join('\n');
  $('#produtoPerguntas').value = (p?.perguntas || []).join('\n');
  tempProductPhotos = clone(p?.fotos || []);
  $('#produtoFotos').value = '';
  renderProductPhotoPreview();
  $('#btnExcluirProduto').style.display = p ? 'inline-flex' : 'none';
  openModal('modalProduto');
}

async function handleProductPhotos(ev) {
  const files = Array.from(ev.target.files || []);
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const dataUrl = await fileToDataURL(file, 1200, 0.82);
    tempProductPhotos.push(dataUrl);
  }
  renderProductPhotoPreview();
}

function renderProductPhotoPreview() {
  const wrap = $('#produtoFotosPreview');
  wrap.innerHTML = tempProductPhotos.map((src, index) => `
    <div class="photo-wrap"><img class="photo-thumb" src="${src}" alt="Foto"><button class="photo-remove" data-remove-photo="${index}">×</button></div>
  `).join('');
  wrap.querySelectorAll('[data-remove-photo]').forEach(btn => btn.addEventListener('click', () => {
    tempProductPhotos.splice(Number(btn.dataset.removePhoto), 1);
    renderProductPhotoPreview();
  }));
}

function saveProductFromModal() {
  const id = $('#produtoId').value || uid('prod');
  const product = {
    id,
    nome: $('#produtoNome').value.trim(),
    categoria: $('#produtoCategoria').value.trim(),
    especie: $('#produtoEspecie').value.trim(),
    tipo: $('#produtoTipo').value,
    descricao: $('#produtoDescricao').value.trim(),
    objetivo: $('#produtoObjetivo').value.trim(),
    parametros: {
      gorduraMax: numberOrBlank($('#paramGorduraMax').value),
      proteinaMin: numberOrBlank($('#paramProteinaMin').value),
      carbMax: numberOrBlank($('#paramCarbMax').value),
      proteinaNaoCarneaMax: numberOrBlank($('#paramPncMax').value),
      proibeProteinaNaoCarnea: $('#paramProibePnc').checked,
      mostrarValidacao: $('#paramMostrarValidacao').checked
    },
    fotos: tempProductPhotos,
    fluxo: linesFrom($('#produtoFluxo').value),
    pontos: linesFrom($('#produtoPontos').value),
    perguntas: linesFrom($('#produtoPerguntas').value)
  };
  if (!product.nome) return toast('Informe o nome do produto.');
  const idx = db.produtos.findIndex(p => p.id === id);
  if (idx >= 0) db.produtos[idx] = product; else db.produtos.push(product);
  db.configs.ultimoProdutoAula = id;
  saveDB();
  closeModal('modalProduto');
  renderAll();
  toast('Produto salvo.');
}

function deleteProductFromModal() {
  const id = $('#produtoId').value;
  if (!id) return;
  const used = db.formulacoes.some(f => f.produtoId === id);
  if (used && !confirm('Este produto possui formulações. Excluir mesmo assim?')) return;
  db.produtos = db.produtos.filter(p => p.id !== id);
  db.formulacoes = db.formulacoes.filter(f => f.produtoId !== id);
  db.legislacoes.forEach(l => { if (l.produtoId === id) l.produtoId = null; });
  saveDB();
  closeModal('modalProduto');
  renderAll();
  toast('Produto excluído.');
}

function populateTypeOptions() {
  $('#insumoTipo').innerHTML = TYPES.map(t => `<option value="${t.value}">${t.label}</option>`).join('');
}

function openIngredientModal(id = null) {
  const i = id ? findIngredient(id) : null;
  $('#insumoId').value = i?.id || '';
  $('#insumoNome').value = i?.nome || '';
  $('#insumoCategoria').value = i?.categoria || '';
  $('#insumoTipo').value = i?.tipo || 'outro';
  $('#insumoFuncao').value = i?.funcao || '';
  $('#insumoObs').value = i?.obs || '';
  $('#insumoGordura').value = i?.gordura ?? 0;
  $('#insumoProteina').value = i?.proteina ?? 0;
  $('#insumoCarbo').value = i?.carboidrato ?? 0;
  $('#insumoCusto').value = i?.custo ?? 0;
  $('#insumoPnc').checked = Boolean(i?.proteinaNaoCarnea);
  $('#insumoAlergeno').checked = Boolean(i?.alergeno);
  $('#btnExcluirInsumo').style.display = i ? 'inline-flex' : 'none';
  openModal('modalInsumo');
}

function saveIngredientFromModal() {
  const id = $('#insumoId').value || uid('ing');
  const ingredient = {
    id,
    nome: $('#insumoNome').value.trim(),
    categoria: $('#insumoCategoria').value.trim(),
    tipo: $('#insumoTipo').value,
    funcao: $('#insumoFuncao').value.trim(),
    obs: $('#insumoObs').value.trim(),
    gordura: toNumber($('#insumoGordura').value),
    proteina: toNumber($('#insumoProteina').value),
    carboidrato: toNumber($('#insumoCarbo').value),
    custo: toNumber($('#insumoCusto').value),
    proteinaNaoCarnea: $('#insumoPnc').checked || $('#insumoTipo').value === 'proteina_nao_carnea',
    alergeno: $('#insumoAlergeno').checked
  };
  if (!ingredient.nome) return toast('Informe o nome do insumo.');
  const idx = db.insumos.findIndex(i => i.id === id);
  if (idx >= 0) db.insumos[idx] = ingredient; else db.insumos.push(ingredient);
  saveDB();
  closeModal('modalInsumo');
  renderAll();
  toast('Insumo salvo.');
}

function deleteIngredientFromModal() {
  const id = $('#insumoId').value;
  if (!id) return;
  const used = db.formulacoes.some(f => f.itens.some(item => item.insumoId === id));
  if (used) return toast('Este insumo está em uma formulação. Remova-o da formulação antes de excluir.');
  db.insumos = db.insumos.filter(i => i.id !== id);
  saveDB();
  closeModal('modalInsumo');
  renderAll();
  toast('Insumo excluído.');
}

function openFormulaModal(id = null) {
  renderFormulaFilters();
  const f = id ? findFormula(id) : null;
  $('#formulaId').value = f?.id || '';
  $('#formulaProduto').value = f?.produtoId || db.produtos[0]?.id || '';
  $('#formulaNome').value = f?.nome || '';
  $('#formulaPeso').value = f?.pesoReferencia || 1000;
  $('#formulaRendimento').value = f?.rendimento ?? '';
  $('#formulaObs').value = f?.observacoes || '';
  formulaDraftItems = clone(f?.itens || [{ insumoId: db.insumos[0]?.id || '', percentual: 100 }]);
  $('#btnExcluirFormula').style.display = f ? 'inline-flex' : 'none';
  renderFormulaItems();
  openModal('modalFormula');
}

function renderFormulaItems() {
  const weight = toNumber($('#formulaPeso').value) || 0;
  $('#formulaItens').innerHTML = formulaDraftItems.map((item, idx) => {
    const grams = weight * (toNumber(item.percentual) / 100);
    return `<tr>
      <td><select data-row-insumo="${idx}">${db.insumos.map(i => `<option value="${i.id}" ${i.id === item.insumoId ? 'selected' : ''}>${escapeHTML(i.nome)}</option>`).join('')}</select></td>
      <td><input type="number" step="0.01" data-row-pct="${idx}" value="${item.percentual}"></td>
      <td><strong>${fmt(grams)} g</strong></td>
      <td><button class="tiny-btn" data-row-del="${idx}" title="Remover">×</button></td>
    </tr>`;
  }).join('');
  $('#formulaItens').querySelectorAll('[data-row-insumo]').forEach(el => el.addEventListener('change', () => { formulaDraftItems[Number(el.dataset.rowInsumo)].insumoId = el.value; renderFormulaItems(); }));
  $('#formulaItens').querySelectorAll('[data-row-pct]').forEach(el => el.addEventListener('input', () => { formulaDraftItems[Number(el.dataset.rowPct)].percentual = toNumber(el.value); renderFormulaItems(); }));
  $('#formulaItens').querySelectorAll('[data-row-del]').forEach(el => el.addEventListener('click', () => { formulaDraftItems.splice(Number(el.dataset.rowDel), 1); renderFormulaItems(); }));
  const draft = getFormulaFromModal(false);
  $('#formulaResumo').innerHTML = analysisHTML(analyzeFormula(draft));
}

function getFormulaFromModal(requireName = true) {
  return {
    id: $('#formulaId').value || uid('form'),
    produtoId: $('#formulaProduto').value,
    nome: $('#formulaNome').value.trim() || (requireName ? '' : 'Formulação em edição'),
    pesoReferencia: toNumber($('#formulaPeso').value) || 1000,
    rendimento: numberOrBlank($('#formulaRendimento').value),
    itens: formulaDraftItems.map(item => ({ insumoId: item.insumoId, percentual: toNumber(item.percentual) })).filter(item => item.insumoId),
    observacoes: $('#formulaObs').value.trim()
  };
}

function saveFormulaFromModal() {
  const formula = getFormulaFromModal(true);
  if (!formula.produtoId) return toast('Selecione um produto.');
  if (!formula.nome) return toast('Informe o nome da formulação.');
  if (!formula.itens.length) return toast('Adicione ao menos um insumo.');
  const idx = db.formulacoes.findIndex(f => f.id === formula.id);
  if (idx >= 0) db.formulacoes[idx] = formula; else db.formulacoes.push(formula);
  saveDB();
  closeModal('modalFormula');
  renderAll();
  toast('Formulação salva.');
}

function deleteFormulaFromModal() {
  const id = $('#formulaId').value;
  if (!id) return;
  if (!confirm('Excluir esta formulação?')) return;
  db.formulacoes = db.formulacoes.filter(f => f.id !== id);
  saveDB();
  closeModal('modalFormula');
  renderAll();
  toast('Formulação excluída.');
}

function analyzeFormula(formula) {
  const product = findProduct(formula.produtoId);
  const weight = toNumber(formula.pesoReferencia) || 1000;
  let totalPct = 0;
  let fatPct = 0;
  let proteinPct = 0;
  let carbPct = 0;
  let pncPct = 0;
  let costTotal = 0;
  formula.itens.forEach(item => {
    const ing = findIngredient(item.insumoId);
    const pct = toNumber(item.percentual);
    if (!ing) return;
    totalPct += pct;
    fatPct += pct * toNumber(ing.gordura) / 100;
    proteinPct += pct * toNumber(ing.proteina) / 100;
    carbPct += pct * toNumber(ing.carboidrato) / 100;
    if (ing.proteinaNaoCarnea || ing.tipo === 'proteina_nao_carnea') pncPct += pct;
    costTotal += (weight * pct / 100 / 1000) * toNumber(ing.custo);
  });
  const alerts = [];
  if (Math.abs(totalPct - 100) < 0.01) alerts.push({ type: 'ok', text: 'A soma da formulação está em 100%.' });
  else alerts.push({ type: 'warn', text: `A soma está em ${fmt(totalPct)}%. Ajuste para 100%.` });
  const params = product?.parametros || {};
  if (product?.tipo === 'hamburguer' && params.mostrarValidacao !== false) {
    addLimitAlert(alerts, fatPct, params.gorduraMax, 'Gordura', 'max');
    addLimitAlert(alerts, proteinPct, params.proteinaMin, 'Proteína estimada', 'min');
    addLimitAlert(alerts, carbPct, params.carbMax, 'Carboidratos estimados', 'max');
    if (params.proibeProteinaNaoCarnea && pncPct > 0) alerts.push({ type: 'danger', text: 'Há proteína não cárnea, mas o produto foi marcado como denominação com corte específico.' });
    else addLimitAlert(alerts, pncPct, params.proteinaNaoCarneaMax, 'Proteína não cárnea agregada', 'max');
  }
  return { product, weight, totalPct, fatPct, proteinPct, carbPct, pncPct, costTotal, alerts };
}

function addLimitAlert(alerts, value, limit, label, mode) {
  if (limit === '' || limit === null || limit === undefined || Number.isNaN(Number(limit))) return;
  const ok = mode === 'max' ? value <= Number(limit) + 0.0001 : value + 0.0001 >= Number(limit);
  alerts.push({ type: ok ? 'ok' : 'danger', text: `${label}: ${fmt(value)}% ${ok ? 'dentro do parâmetro' : 'fora do parâmetro'} (${mode === 'max' ? 'limite máximo' : 'limite mínimo'} ${fmt(limit)}%).` });
}

function analysisHTML(a) {
  return `<div class="analysis-grid">
    <div class="analysis-metric"><strong>${fmt(a.totalPct)}%</strong><span>Soma da fórmula</span></div>
    <div class="analysis-metric"><strong>${fmt(a.fatPct)}%</strong><span>Gordura estimada</span></div>
    <div class="analysis-metric"><strong>${fmt(a.proteinPct)}%</strong><span>Proteína estimada</span></div>
    <div class="analysis-metric"><strong>${fmt(a.carbPct)}%</strong><span>Carboidratos estimados</span></div>
    <div class="analysis-metric"><strong>${fmt(a.pncPct)}%</strong><span>Prot. não cárnea</span></div>
    <div class="analysis-metric"><strong>${money(a.costTotal)}</strong><span>Custo estimado do lote</span></div>
  </div>
  <div class="alert-list">${a.alerts.map(alert => `<div class="alert ${alert.type}">${escapeHTML(alert.text)}</div>`).join('')}</div>`;
}

function showFormulaReport() {
  const formula = getFormulaFromModal(false);
  const text = buildReport(formula);
  $('#relatorioTexto').value = text;
  openModal('modalRelatorio');
}

function buildReport(formula) {
  const product = findProduct(formula.produtoId);
  const analysis = analyzeFormula(formula);
  const lines = [];
  lines.push('RELATÓRIO DA AULA PRÁTICA - PAOA LAB');
  lines.push('');
  lines.push(`Produto: ${product?.nome || 'Não informado'}`);
  lines.push(`Formulação: ${formula.nome}`);
  lines.push(`Peso de cálculo: ${fmt(formula.pesoReferencia)} g`);
  if (formula.rendimento !== '') lines.push(`Rendimento esperado: ${fmt(formula.rendimento)}%`);
  lines.push('');
  lines.push('Formulação:');
  formula.itens.forEach(item => {
    const ing = findIngredient(item.insumoId);
    const grams = formula.pesoReferencia * item.percentual / 100;
    lines.push(`- ${ing?.nome || 'Insumo'}: ${fmt(item.percentual)}% = ${fmt(grams)} g`);
  });
  lines.push('');
  lines.push('Resumo técnico estimado:');
  lines.push(`- Soma da formulação: ${fmt(analysis.totalPct)}%`);
  lines.push(`- Gordura estimada: ${fmt(analysis.fatPct)}%`);
  lines.push(`- Proteína estimada: ${fmt(analysis.proteinPct)}%`);
  lines.push(`- Carboidratos estimados: ${fmt(analysis.carbPct)}%`);
  lines.push(`- Proteína não cárnea agregada: ${fmt(analysis.pncPct)}%`);
  lines.push(`- Custo estimado do lote: ${money(analysis.costTotal)}`);
  lines.push('');
  lines.push('Alertas:');
  analysis.alerts.forEach(a => lines.push(`- ${a.text}`));
  if (formula.observacoes) {
    lines.push('');
    lines.push('Observações:');
    lines.push(formula.observacoes);
  }
  lines.push('');
  lines.push('Roteiro da prática:');
  (product?.fluxo || []).forEach((step, idx) => lines.push(`${idx + 1}. ${step}`));
  lines.push('');
  lines.push('Perguntas para discussão:');
  (product?.perguntas || []).forEach(q => lines.push(`- ${q}`));
  return lines.join('\n');
}

async function copyReport() {
  await copyText($('#relatorioTexto').value);
  toast('Relatório copiado.');
}

async function copyLesson() {
  const p = findProduct($('#aulaProdutoSelect')?.value);
  if (!p) return;
  const text = [
    `ROTEIRO DE AULA PRÁTICA - ${p.nome}`,
    '',
    `Objetivo: ${p.objetivo || ''}`,
    '',
    'Fluxograma:',
    ...(p.fluxo || []).map((s, i) => `${i + 1}. ${s}`),
    '',
    'Pontos de controle:',
    ...(p.pontos || []).map(s => `- ${s}`),
    '',
    'Perguntas:',
    ...(p.perguntas || []).map(s => `- ${s}`)
  ].join('\n');
  await copyText(text);
  toast('Roteiro copiado.');
}

function exportData() {
  downloadJSON(db, `paoa_lab_backup_${dateStamp()}.json`);
  toast('Backup gerado.');
}

function downloadTemplate() {
  downloadJSON(DEFAULT_DB, 'paoa_lab_modelo_dados.json');
}

async function importData(ev) {
  const file = ev.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (!imported.produtos || !imported.insumos) throw new Error('Arquivo inválido');
    db = normalizeDB(imported);
    saveDB();
    renderAll();
    closeModal('modalConfig');
    toast('Dados importados.');
  } catch (err) {
    console.error(err);
    toast('Não foi possível importar esse arquivo.');
  } finally {
    ev.target.value = '';
  }
}

function resetDemo() {
  if (!confirm('Restaurar a base demonstrativa? Seus dados atuais serão substituídos neste navegador.')) return;
  db = clone(DEFAULT_DB);
  saveDB();
  renderAll();
  closeModal('modalConfig');
  toast('Base demonstrativa restaurada.');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => console.warn('Service worker não registrado', err));
  }
}

function openModal(id) { $('#' + id)?.classList.add('show'); }
function closeModal(id) { $('#' + id)?.classList.remove('show'); }
function findProduct(id) { return db.produtos.find(p => p.id === id); }
function findIngredient(id) { return db.insumos.find(i => i.id === id); }
function findFormula(id) { return db.formulacoes.find(f => f.id === id); }
function toNumber(value) { const n = Number(String(value ?? '').replace(',', '.')); return Number.isFinite(n) ? n : 0; }
function numberOrBlank(value) { if (String(value ?? '').trim() === '') return ''; return toNumber(value); }
function fmt(n) { return (toNumber(n)).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(toNumber(n)) ? 0 : 1 }); }
function money(n) { return toNumber(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function linesFrom(text) { return Array.isArray(text) ? text : String(text || '').split('\n').map(s => s.trim()).filter(Boolean); }
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
function typeLabel(value) { return TYPES.find(t => t.value === value)?.label || 'Outro'; }
function ingredientIcon(type) { return ({ carne: '🥩', gordura: '🧈', agua: '🧊', sal: '🧂', condimento: '🌶️', carboidrato: '🌾', proteina_nao_carnea: '🌱', aditivo: '⚗️', lacteo: '🥛', outro: '📦' })[type] || '📦'; }
function photoOrInitial(p) { return p.fotos?.[0] ? `<img src="${p.fotos[0]}" alt="${escapeHTML(p.nome)}">` : escapeHTML((p.nome || '?').slice(0, 1).toUpperCase()); }
function emptyHTML(text) { return `<div class="notice-card">${escapeHTML(text)}</div>`; }
function orderedList(items) { return `<ol class="lesson-list">${(items || []).map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ol>`; }
function unorderedList(items) { return `<ul class="lesson-list">${(items || []).map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ul>`; }
function dateStamp() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function escapeHTML(str) { return String(str ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200); }
function downloadJSON(data, filename) { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); downloadBlob(blob, filename); }
function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
async function copyText(text) { if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text); const area = document.createElement('textarea'); area.value = text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); }

function fileToDataURL(file, maxSize = 1200, quality = 0.86) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
