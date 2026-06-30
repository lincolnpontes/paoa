'use strict';

const STORAGE_KEY = 'paoa_lab_v1';
const APP_VERSION = '2.2.1';
const SYNC_URL_KEY = 'paoa_sync_url_v1';
const LAST_LOGIN_KEY = 'paoa_last_login_v1';
const SESSION_TOKEN_KEY = 'paoa_session_token_v1';
const SYNC_META_KEY = 'paoa_sync_meta_v1';
const SYNC_DEBOUNCE_MS = 1400;
const CURE_LIMIT_PPM = 150;
const DEFAULT_CURE_CONCENTRATION_PCT = 7;
const MEAT_CUTS_SOURCE_URL = 'https://nepa.unicamp.br/publicacoes/tabela-taco-pdf/';
const MEDIA_DB_NAME = 'paoa_media_v1';
const MEDIA_STORE_NAME = 'theory_slides';

const PERMISSION_DEFS = [
  { key: 'view.home', group: 'Visualização', label: 'Ver início' },
  { key: 'view.aulas', group: 'Visualização', label: 'Ver aulas e conteúdos' },
  { key: 'view.produtos', group: 'Visualização', label: 'Ver produtos e roteiros' },
  { key: 'view.cronograma', group: 'Visualização', label: 'Ver cronograma' },
  { key: 'view.regras', group: 'Visualização', label: 'Ver regras do laboratório' },
  { key: 'formula.use', group: 'Operação', label: 'Alterar formulações durante a aula' },
  { key: 'manage.products', group: 'Gerenciamento', label: 'Gerenciar produtos, visibilidade e referências' },
  { key: 'manage.ingredients', group: 'Gerenciamento', label: 'Gerenciar insumos' },
  { key: 'manage.formulas', group: 'Gerenciamento', label: 'Gerenciar formulações' },
  { key: 'manage.contents', group: 'Gerenciamento', label: 'Gerenciar conteúdos teóricos' },
  { key: 'manage.schedule', group: 'Gerenciamento', label: 'Gerenciar períodos, aulas e cronograma' },
  { key: 'manage.rules', group: 'Gerenciamento', label: 'Gerenciar regras do laboratório' },
  { key: 'manage.access', group: 'Administração', label: 'Gerenciar perfis e usuários' },
  { key: 'manage.sync', group: 'Administração', label: 'Configurar e forçar sincronização' },
  { key: 'data.export', group: 'Dados', label: 'Exportar backup JSON' },
  { key: 'data.import', group: 'Dados', label: 'Importar backup JSON' },
  { key: 'data.reset', group: 'Dados', label: 'Restaurar base demonstrativa' }
];

const MEAT_CUTS = [
  { id: 'acem', nome: 'Acém bovino', comGordura: 5.9, semGordura: 6.1, fonteCom: 'TACO: acém moído, cru', fonteSem: 'TACO: acém sem gordura, cru' },
  { id: 'fraldinha', nome: 'Fraldinha / flanco bovino', comGordura: 16.1, semGordura: 6.2, fonteCom: 'TACO: fraldinha com gordura, crua', fonteSem: 'TACO: flanco sem gordura, cru' },
  { id: 'peito_bovino', nome: 'Peito bovino', comGordura: null, semGordura: 20.4, fonteSem: 'TACO: peito sem gordura, cru' },
  { id: 'alcatra', nome: 'Miolo de alcatra bovina', comGordura: null, semGordura: 7.8, fonteSem: 'TACO: miolo de alcatra sem gordura, cru' },
  { id: 'coxao_mole', nome: 'Coxão mole bovino', comGordura: null, semGordura: 8.7, fonteSem: 'TACO: coxão mole sem gordura, cru' },
  { id: 'coxao_duro', nome: 'Coxão duro bovino', comGordura: null, semGordura: 6.2, fonteSem: 'TACO: coxão duro sem gordura, cru' },
  { id: 'patinho', nome: 'Patinho bovino', comGordura: null, semGordura: 4.5, fonteSem: 'TACO: patinho sem gordura, cru' },
  { id: 'lagarto', nome: 'Lagarto bovino', comGordura: 5.2, semGordura: null, fonteCom: 'TACO: lagarto, cru; a tabela não especifica retirada de gordura' },
  { id: 'maminha', nome: 'Maminha bovina', comGordura: 7, semGordura: null, fonteCom: 'TACO: maminha, crua; a tabela não especifica retirada de gordura' },
  { id: 'musculo', nome: 'Músculo bovino', comGordura: null, semGordura: 5.5, fonteSem: 'TACO: músculo sem gordura, cru' },
  { id: 'paleta', nome: 'Paleta bovina', comGordura: 7.5, semGordura: 5.7, fonteCom: 'TACO: paleta com gordura, crua', fonteSem: 'TACO: paleta sem gordura, crua' },
  { id: 'contrafile', nome: 'Contrafilé bovino', comGordura: 12.8, semGordura: 6, fonteCom: 'TACO: contrafilé com gordura, cru', fonteSem: 'TACO: contrafilé sem gordura, cru' },
  { id: 'file_mignon', nome: 'Filé mignon bovino', comGordura: null, semGordura: 5.6, fonteSem: 'TACO: filé mignon sem gordura, cru' },
  { id: 'picanha', nome: 'Picanha bovina', comGordura: 14.7, semGordura: 4.7, fonteCom: 'TACO: picanha com gordura, crua', fonteSem: 'TACO: picanha sem gordura, crua' },
  { id: 'costela_bovina', nome: 'Costela bovina', comGordura: 31.8, semGordura: null, fonteCom: 'TACO: costela, crua; a tabela não especifica retirada de gordura' },
  { id: 'cupim', nome: 'Cupim bovino', comGordura: 15.3, semGordura: null, fonteCom: 'TACO: cupim, cru; a tabela não especifica retirada de gordura' },
  { id: 'pernil_suino', nome: 'Pernil suíno', comGordura: 11.1, semGordura: null, fonteCom: 'TACO: porco, pernil, cru' },
  { id: 'lombo_suino', nome: 'Lombo suíno', comGordura: 8.8, semGordura: null, fonteCom: 'TACO: porco, lombo, cru' },
  { id: 'peito_frango', nome: 'Peito de frango', comGordura: 6.7, semGordura: 3, fonteCom: 'TACO: peito de frango com pele, cru', fonteSem: 'TACO: peito de frango sem pele, cru' },
  { id: 'coxa_frango', nome: 'Coxa de frango', comGordura: 9.8, semGordura: 4.9, fonteCom: 'TACO: coxa de frango com pele, crua', fonteSem: 'TACO: coxa de frango sem pele, crua' },
  { id: 'sobrecoxa_frango', nome: 'Sobrecoxa de frango', comGordura: 20.9, semGordura: 9.6, fonteCom: 'TACO: sobrecoxa de frango com pele, crua', fonteSem: 'TACO: sobrecoxa de frango sem pele, crua' },
  { id: 'gordura_bovina', nome: 'Gordura bovina adicionada', comGordura: 100, semGordura: null, fonteCom: 'Gordura de formulação' },
  { id: 'toucinho_suino', nome: 'Toucinho suíno', comGordura: 60.3, semGordura: null, fonteCom: 'TACO: toucinho, cru' },
  { id: 'outro', nome: 'Outro corte ou matéria-prima', comGordura: 0, semGordura: 0, fonteCom: 'Informe o teor analisado ou consultado', fonteSem: 'Informe o teor analisado ou consultado' }
];

const MEAT_CUT_INGREDIENTS = [
  { id: 'ing_corte_acem_moido_cru', nome: 'Acém bovino moído cru', gordura: 5.95, proteina: 19.42, carboidrato: 0, fonte: 'Carne, bovina, acém, moído, cru' },
  { id: 'ing_corte_acem_sem_gordura_cru', nome: 'Acém bovino sem gordura cru', gordura: 6.11, proteina: 20.82, carboidrato: 0, fonte: 'Carne, bovina, acém, sem gordura, cru' },
  { id: 'ing_corte_fraldinha_com_gordura_crua', nome: 'Fraldinha bovina com gordura crua', gordura: 16.15, proteina: 17.58, carboidrato: 0, fonte: 'Carne, bovina, fraldinha, com gordura, crua' },
  { id: 'ing_corte_flanco_sem_gordura_cru', nome: 'Flanco bovino sem gordura cru', gordura: 6.22, proteina: 20, carboidrato: 0, fonte: 'Carne, bovina, flanco, sem gordura, cru' },
  { id: 'ing_corte_peito_bovino_sem_gordura_cru', nome: 'Peito bovino sem gordura cru', gordura: 20.43, proteina: 17.56, carboidrato: 0, fonte: 'Carne, bovina, peito, sem gordura, cru' },
  { id: 'ing_corte_miolo_alcatra_sem_gordura_cru', nome: 'Miolo de alcatra bovina sem gordura cru', gordura: 7.83, proteina: 21.61, carboidrato: 0, fonte: 'Carne, bovina, miolo de alcatra, sem gordura, cru' },
  { id: 'ing_corte_coxao_mole_sem_gordura_cru', nome: 'Coxão mole bovino sem gordura cru', gordura: 8.69, proteina: 21.23, carboidrato: 0, fonte: 'Carne, bovina, coxão mole, sem gordura, cru' },
  { id: 'ing_corte_coxao_duro_sem_gordura_cru', nome: 'Coxão duro bovino sem gordura cru', gordura: 6.22, proteina: 21.51, carboidrato: 0, fonte: 'Carne, bovina, coxão duro, sem gordura, cru' },
  { id: 'ing_corte_patinho_sem_gordura_cru', nome: 'Patinho bovino sem gordura cru', gordura: 4.51, proteina: 21.72, carboidrato: 0, fonte: 'Carne, bovina, patinho, sem gordura, cru' },
  { id: 'ing_corte_lagarto_cru', nome: 'Lagarto bovino cru', gordura: 5.23, proteina: 20.54, carboidrato: 0, fonte: 'Carne, bovina, lagarto, cru' },
  { id: 'ing_corte_maminha_crua', nome: 'Maminha bovina crua', gordura: 7.03, proteina: 20.93, carboidrato: 0, fonte: 'Carne, bovina, maminha, crua' },
  { id: 'ing_corte_musculo_sem_gordura_cru', nome: 'Músculo bovino sem gordura cru', gordura: 5.49, proteina: 21.56, carboidrato: 0, fonte: 'Carne, bovina, músculo, sem gordura, cru' },
  { id: 'ing_corte_paleta_com_gordura_crua', nome: 'Paleta bovina com gordura crua', gordura: 7.46, proteina: 21.41, carboidrato: 0, fonte: 'Carne, bovina, paleta, com gordura, crua' },
  { id: 'ing_corte_paleta_sem_gordura_crua', nome: 'Paleta bovina sem gordura crua', gordura: 5.67, proteina: 21.03, carboidrato: 0, fonte: 'Carne, bovina, paleta, sem gordura, crua' },
  { id: 'ing_corte_contrafile_com_gordura_cru', nome: 'Contrafilé bovino com gordura cru', gordura: 12.81, proteina: 21.15, carboidrato: 0, fonte: 'Carne, bovina, contra-filé, com gordura, cru' },
  { id: 'ing_corte_contrafile_sem_gordura_cru', nome: 'Contrafilé bovino sem gordura cru', gordura: 6, proteina: 24, carboidrato: 0, fonte: 'Carne, bovina, contra-filé, sem gordura, cru' },
  { id: 'ing_corte_file_mignon_sem_gordura_cru', nome: 'Filé mignon bovino sem gordura cru', gordura: 5.61, proteina: 21.6, carboidrato: 0, fonte: 'Carne, bovina, filé mingnon, sem gordura, cru' },
  { id: 'ing_corte_picanha_com_gordura_crua', nome: 'Picanha bovina com gordura crua', gordura: 14.69, proteina: 18.82, carboidrato: 0, fonte: 'Carne, bovina, picanha, com gordura, crua' },
  { id: 'ing_corte_picanha_sem_gordura_crua', nome: 'Picanha bovina sem gordura crua', gordura: 4.74, proteina: 21.25, carboidrato: 0, fonte: 'Carne, bovina, picanha, sem gordura, crua' },
  { id: 'ing_corte_costela_bovina_crua', nome: 'Costela bovina crua', gordura: 31.75, proteina: 16.71, carboidrato: 0, fonte: 'Carne, bovina, costela, crua' },
  { id: 'ing_corte_cupim_cru', nome: 'Cupim bovino cru', gordura: 15.3, proteina: 19.54, carboidrato: 0, fonte: 'Carne, bovina, cupim, cru' },
  { id: 'ing_corte_pernil_suino_cru', nome: 'Pernil suíno cru', gordura: 11.1, proteina: 20.13, carboidrato: 0, fonte: 'Porco, pernil, cru' },
  { id: 'ing_corte_lombo_suino_cru', nome: 'Lombo suíno cru', gordura: 8.77, proteina: 22.6, carboidrato: 0, fonte: 'Porco, lombo, cru' },
  { id: 'ing_corte_peito_frango_com_pele_cru', nome: 'Peito de frango com pele cru', gordura: 6.73, proteina: 20.78, carboidrato: 0, fonte: 'Frango, peito, com pele, cru' },
  { id: 'ing_corte_peito_frango_sem_pele_cru', nome: 'Peito de frango sem pele cru', gordura: 3.02, proteina: 21.53, carboidrato: 0, fonte: 'Frango, peito, sem pele, cru' },
  { id: 'ing_corte_coxa_frango_com_pele_crua', nome: 'Coxa de frango com pele crua', gordura: 9.81, proteina: 17.09, carboidrato: 0, fonte: 'Frango, coxa, com pele, crua' },
  { id: 'ing_corte_coxa_frango_sem_pele_crua', nome: 'Coxa de frango sem pele crua', gordura: 4.86, proteina: 17.81, carboidrato: 0.02, fonte: 'Frango, coxa, sem pele, crua' },
  { id: 'ing_corte_sobrecoxa_frango_com_pele_crua', nome: 'Sobrecoxa de frango com pele crua', gordura: 20.9, proteina: 15.46, carboidrato: 0, fonte: 'Frango, sobrecoxa, com pele, crua' },
  { id: 'ing_corte_sobrecoxa_frango_sem_pele_crua', nome: 'Sobrecoxa de frango sem pele crua', gordura: 9.62, proteina: 17.57, carboidrato: 0, fonte: 'Frango, sobrecoxa, sem pele, crua' },
  { id: 'ing_corte_toucinho_suino_cru', nome: 'Toucinho suíno cru', gordura: 60.26, proteina: 11.48, carboidrato: 0, fonte: 'Toucinho, cru' }
].map(item => ({
  ...item,
  categoria: 'Matéria-prima cárnea',
  tipo: 'materia_prima_carnea',
  subtipo: 'cortes de referência',
  funcao: 'Matéria-prima cárnea de referência para consulta e ajuste de composição.',
  obs: `TACO/NEPA/UNICAMP: ${item.fonte}.`,
  custo: 0,
  usadoNaFormulacao: false,
  proteinaNaoCarnea: false,
  alergeno: false
}));

const TYPES = [
  { value: 'materia_prima_carnea', label: 'Matéria-prima cárnea', subtipos: ['cortes de referência'], exemplos: 'carne bovina, frango, pernil, toucinho, pele suína' },
  { value: 'basico_nao_carneo', label: 'Ingredientes básicos não cárneos', subtipos: [], exemplos: 'água, gelo, sal, açúcar, dextrose' },
  { value: 'condimento_especiaria', label: 'Condimentos e especiarias', subtipos: ['naturais', 'frescos', 'desidratados', 'em pó', 'moídos', 'extratos'], exemplos: 'alho em pó, cebola, pimenta-do-reino preta moída, pimenta branca moída, páprica, noz-moscada moída' },
  { value: 'funcional_nao_aditivo', label: 'Ingredientes funcionais não aditivos', subtipos: ['proteínas', 'amidos/farinhas', 'fibras', 'hidrocoloides usados como ingrediente', 'lácteos', 'ovos'], exemplos: 'proteína de soja, fécula, amido, farinha de rosca, leite em pó, ovo' },
  { value: 'aditivo_alimentar', label: 'Aditivos alimentares', subtipos: ['conservadores', 'antioxidantes', 'estabilizantes', 'emulsificantes', 'espessantes', 'corantes', 'reguladores de acidez', 'realçadores de sabor', 'aromatizantes'], exemplos: 'nitrito, nitrato, eritorbato, fosfato, corante, glutamato' },
  { value: 'coadjuvante_tecnologia', label: 'Coadjuvantes de tecnologia', subtipos: [], exemplos: 'enzimas, agentes de cura/processo, nitrogênio/CO2' },
  { value: 'cultura_fermento', label: 'Culturas e fermentos', subtipos: [], exemplos: 'culturas para salame, fermentação/maturação' },
  { value: 'envoltorio_apresentacao', label: 'Envoltórios e insumos de apresentação', subtipos: ['envoltório comestível', 'envoltório não comestível', 'embalagem', 'clips', 'barbante', 'rótulo'], exemplos: 'tripa natural, tripa de colágeno, embalagem a vácuo' },
  { value: 'mistura_comercial', label: 'Misturas/preparados comerciais', subtipos: ['mistura de cura', 'blend de condimentos', 'preparado funcional'], exemplos: 'condimento para linguiça, sal de cura, mix para hambúrguer' }
];

const LEGACY_TYPE_MAP = {
  carne: 'materia_prima_carnea',
  gordura: 'materia_prima_carnea',
  agua: 'basico_nao_carneo',
  sal: 'basico_nao_carneo',
  condimento: 'condimento_especiaria',
  carboidrato: 'funcional_nao_aditivo',
  proteina_nao_carnea: 'funcional_nao_aditivo',
  aditivo: 'aditivo_alimentar',
  lacteo: 'funcional_nao_aditivo',
  outro: 'funcional_nao_aditivo'
};

const DEFAULT_RULES = [
  { id: 'regra_entrada', numero: '01', titulo: 'Entrada no laboratório', texto: 'Usar jaleco claro fechado, touca sanfonada, calçado fechado e mãos higienizadas antes de iniciar a prática.' },
  { id: 'regra_higiene', numero: '02', titulo: 'Higiene e EPI', texto: 'Manter luvas limpas, prender cabelos sob a touca e evitar adornos, relógios, perfumes fortes ou objetos soltos.' },
  { id: 'regra_bancada', numero: '03', titulo: 'Bancada e utensílios', texto: 'Sanitizar superfícies, separar utensílios por etapa e manter apenas o material necessário sobre a bancada.' },
  { id: 'regra_temperatura', numero: '04', titulo: 'Temperatura e matéria-prima', texto: 'Controlar tempo fora de refrigeração, pesar rapidamente e registrar qualquer alteração observada no produto.' },
  { id: 'regra_equipamentos', numero: '05', titulo: 'Equipamentos', texto: 'Operar moedor, cutter, embutidora e demais equipamentos apenas com autorização e supervisão do professor ou técnico.' },
  { id: 'regra_encerramento', numero: '06', titulo: 'Encerramento', texto: 'Identificar amostras, descartar resíduos corretamente, lavar utensílios e deixar a bancada pronta para a próxima turma.' }
];

const IMAGE_MIGRATIONS = {
  'assets/hamburguer-bovino.png': 'assets/hamburguer-bovino.jpg',
  'assets/linguica-frescal.png': 'assets/linguica-frescal.jpg'
};

const PRODUCT_CATEGORIES = [
  {
    id: 'reestruturados',
    titulo: 'Produtos Reestruturados',
    resumo: 'Produtos reestruturados usam cortes moídos ou fragmentados, sal, água/gelo e trabalho mecânico para reorganizar proteínas e formar uma matriz coesa.',
    topicos: [
      'Extração de proteínas miofibrilares e formação de liga',
      'Distribuição de gordura e impacto em suculência, maciez e rendimento',
      'Modelagem em porções padronizadas e avaliação de perda por cocção',
      'Formulações podem ser calculadas sobre a massa cárnea ou sobre 100% do produto final'
    ],
    perguntas: [
      'O que muda na textura quando a gordura é reduzida?',
      'Por que sal e mistura mecânica ajudam na coesão?',
      'Como interpretar percentuais sobre massa cárnea em vez de produto final?'
    ],
    produtos: ['prod_hamburguer', 'prod_kafta', 'prod_almondega', 'prod_kibe', 'prod_nuggets'],
    insumos: ['ing_carne_bovina_magra', 'ing_gordura_bovina', 'ing_sal', 'ing_agua_gelada', 'ing_alho_po', 'ing_farinha_rosca', 'ing_trigo_kibe']
  },
  {
    id: 'embutidos',
    titulo: 'Produtos Embutidos',
    etiqueta: 'Processos cárneos',
    resumo: 'Produtos embutidos organizam massa cárnea, gordura, condimentos e envoltório para padronizar formato, calibre, textura e conservação.',
    topicos: [
      'Moagem, mistura e controle de temperatura da massa',
      'Função do envoltório natural ou artificial na forma, mordida e aparência',
      'Diferenças entre embutidos frescos, cozidos, curados e dessecados',
      'Controle de bolsas de ar, distribuição de gordura e conservação refrigerada'
    ],
    perguntas: [
      'Como a granulometria muda a aparência e a mordida do produto?',
      'Por que o produto frescal exige atenção maior à refrigeração?',
      'Que falhas de processo aparecem durante o embutimento?'
    ],
    produtos: ['prod_linguica_frescal', 'prod_salsicha'],
    insumos: ['ing_pernil_suino', 'ing_toucinho_suino', 'ing_sal', 'ing_agua_gelada', 'ing_tripa_suina', 'ing_paprica_doce']
  },
  {
    id: 'emulsionados',
    titulo: 'Produtos Emulsionados',
    resumo: 'Produtos emulsionados dependem de trituração fina, gelo, sal e proteínas solubilizadas para estabilizar água, gordura e fase cárnea em uma massa homogênea.',
    topicos: [
      'Controle de temperatura durante cutterização ou processamento fino',
      'Papel do sal, gelo e fosfatos na extração proteica e estabilidade',
      'Formação de emulsão cárnea, textura fina e perda de gordura por cocção',
      'Relação entre produto emulsionado, embutimento e tratamento térmico'
    ],
    perguntas: [
      'O que acontece quando a massa aquece demais durante a emulsificação?',
      'Como gelo, gordura e proteína influenciam estabilidade e textura?',
      'Por que alguns produtos podem pertencer a mais de uma categoria?'
    ],
    produtos: ['prod_pate', 'prod_salsicha'],
    insumos: ['ing_pernil_suino', 'ing_toucinho_suino', 'ing_agua_gelada', 'ing_sal', 'ing_fosfato', 'ing_amido', 'ing_leite_po']
  },
  {
    id: 'marinados',
    titulo: 'Produtos Marinados',
    resumo: 'Produtos marinados usam salmoura, condimentos e tempo de contato para distribuir sabor, ajustar rendimento e discutir difusão, retenção de água e segurança durante a conservação.',
    topicos: [
      'Preparo de marinada e cálculo de concentração dos ingredientes',
      'Difusão de sal, água e condimentos na matriz cárnea',
      'Controle de tempo, temperatura e proporção de marinada',
      'Relação entre rendimento, suculência e padronização de sabor'
    ],
    perguntas: [
      'Como a proporção de marinada altera rendimento e sabor?',
      'Que riscos aparecem se o produto fica tempo excessivo fora de refrigeração?',
      'Como padronizar a aplicação da marinada em lotes pequenos?'
    ],
    produtos: ['prod_pernil_marinado'],
    insumos: ['ing_pernil_suino', 'ing_agua_gelada', 'ing_sal', 'ing_acucar', 'ing_alho_po', 'ing_pimenta_reino']
  },
  {
    id: 'empanados',
    titulo: 'Produtos Empanados',
    resumo: 'Produtos empanados combinam massa cárnea moldada, pré-enfarinhamento, líquido de adesão e cobertura seca para discutir aderência, crocância, rendimento e absorção de óleo.',
    topicos: [
      'Formação de massa cárnea e padronização das porções',
      'Sequência de cobertura: pré-enfarinhamento, líquido de adesão e empanamento',
      'Controle de aderência, perda de cobertura e rendimento',
      'Efeito de cocção ou fritura na textura e aparência'
    ],
    perguntas: [
      'O que melhora a aderência da cobertura?',
      'Como a granulometria da farinha altera crocância?',
      'Que controles reduzem perda de cobertura durante a cocção?'
    ],
    produtos: ['prod_nuggets'],
    insumos: ['ing_peito_frango', 'ing_farinha_rosca', 'ing_ovo_liquido', 'ing_amido', 'ing_sal']
  },
  {
    id: 'curados_cozidos',
    titulo: 'Produtos Curados e Cozidos',
    resumo: 'Produtos curados e cozidos usam salmoura, cura, retenção de água e tratamento térmico para discutir cor, fatiabilidade, rendimento, segurança e padronização.',
    topicos: [
      'Preparo de salmoura e função tecnológica do sal, cura e fosfato',
      'Distribuição da salmoura na peça e tempo de cura',
      'Tratamento térmico, resfriamento e fatiabilidade',
      'Controle de rendimento, cor, textura e enquadramento legal'
    ],
    perguntas: [
      'Como a cura altera cor e sabor do produto?',
      'Qual é o papel do resfriamento na textura e segurança?',
      'Como controlar rendimento sem comprometer identidade do produto?'
    ],
    produtos: ['prod_presunto_suino'],
    insumos: ['ing_pernil_suino', 'ing_agua_gelada', 'ing_sal', 'ing_sal_cura_tipo_1', 'ing_sal_cura_tipo_2', 'ing_fosfato', 'ing_acucar']
  }
];

const DEFAULT_DB = {
  app_id: 'paoa_lab',
  version: APP_VERSION,
  configs: { ultimoProdutoAula: 'prod_hamburguer', produtoSelecionado: '', filtroInsumo: 'todos', periodoAtivoId: 'periodo_demo', periodos: [], regrasLaboratorio: clone(DEFAULT_RULES), conteudosTeoricos: [], expandedIngredientDefaultsV1: true },
  produtos: [
    {
      id: 'prod_hamburguer',
      nome: 'Hambúrguer bovino',
      categoria: 'Produto cárneo reestruturado',
      categoriaId: 'reestruturados',
      categoriaIds: ['reestruturados'],
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
      fotos: ['assets/hamburguer-bovino.jpg'],
      fluxo: [
        'Recepção e seleção da matéria-prima refrigerada',
        'Pesagem dos insumos conforme a formulação',
        'Moagem da carne e da gordura',
        'Mistura com sal, água gelada e condimentos',
        'Trabalho mecânico para melhorar a extração proteica e a liga',
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
        'Conferir limites legais quando houver proteína não cárnea ou carboidratos'
      ],
      equipamentos: [
        'Balança semianalítica ou balança de bancada',
        'Moedor de carne',
        'Bacias ou bowls de aço inox',
        'Modelador de hambúrguer',
        'Papel filme ou papel manteiga para separação das unidades',
        'Chapa, frigideira ou grill para cocção experimental',
        'Termômetro tipo espeto',
        'Luvas, touca, avental e superfície higienizada'
      ],
      perguntas: [
        'Qual foi o papel do sal na formação da textura?',
        'Como a gordura influenciou a suculência e a maciez?',
        'A formulação atende aos parâmetros legais de gordura, proteína e carboidratos?',
        'O que mudaria se fosse usado outro corte ou outra espécie animal?'
      ]
    },
    {
      id: 'prod_kafta',
      nome: 'Kafta bovina',
      categoria: 'Produto cárneo reestruturado moldado',
      categoriaId: 'reestruturados',
      categoriaIds: ['reestruturados'],
      especie: 'bovina',
      tipo: 'geral',
      descricao: 'Preparação cárnea reestruturada, condimentada e moldada em formato alongado, útil para discutir liga, modelagem, padronização de porções e estabilidade durante cocção.',
      objetivo: 'Avaliar como condimentos, teor de gordura, mistura mecânica e moldagem influenciam coesão, aparência, rendimento e estabilidade da kafta.',
      parametros: {
        gorduraMax: '',
        proteinaMin: '',
        carbMax: '',
        proteinaNaoCarneaMax: '',
        proibeProteinaNaoCarnea: false,
        mostrarValidacao: true
      },
      fotos: ['assets/kafta-bovina.jpg'],
      fluxo: [
        'Seleção da carne e gordura sob refrigeração',
        'Moagem da matéria-prima na granulometria definida',
        'Pesagem dos condimentos conforme a formulação',
        'Mistura até distribuição uniforme e boa coesão da massa',
        'Moldagem em espetos ou porções alongadas padronizadas',
        'Pesagem antes da cocção para cálculo de rendimento',
        'Cocção experimental em chapa, forno ou grelha',
        'Avaliação de perda por cocção, estabilidade, textura e aparência'
      ],
      pontos: [
        'Manter a massa fria para evitar perda de definição e exsudação de gordura',
        'Padronizar peso e formato das porções',
        'Evitar excesso de condimentos secos que fragilizem a coesão',
        'Registrar peso antes e depois da cocção',
        'Observar rachaduras, desprendimento do espeto e perda de suculência'
      ],
      equipamentos: [
        'Balança de bancada',
        'Moedor de carne',
        'Bowls de aço inox',
        'Espetos ou moldes alongados',
        'Espátulas e bandejas',
        'Chapa, forno ou grelha para cocção experimental',
        'Termômetro tipo espeto',
        'Papel filme para padronização e descanso da massa'
      ],
      perguntas: [
        'Como a intensidade da mistura alterou a coesão da kafta?',
        'O formato alongado aumenta ou reduz a perda por cocção?',
        'Quais condimentos interferem mais na percepção sensorial?',
        'Que ajustes fariam a formulação ficar mais estável sem perder suculência?'
      ]
    },
    {
      id: 'prod_almondega',
      nome: 'Almôndega bovina',
      categoria: 'Produto cárneo reestruturado moldado',
      categoriaId: 'reestruturados',
      categoriaIds: ['reestruturados'],
      especie: 'bovina',
      tipo: 'geral',
      descricao: 'Produto cárneo moldado em porções esféricas, adequado para estudar liga, ingredientes de estrutura, perda por cocção, padronização e rendimento.',
      objetivo: 'Compreender o papel de ingredientes ligantes, gordura, mistura e padronização de tamanho na textura, rendimento e aparência da almôndega.',
      parametros: {
        gorduraMax: '',
        proteinaMin: '',
        carbMax: '',
        proteinaNaoCarneaMax: '',
        proibeProteinaNaoCarnea: false,
        mostrarValidacao: true
      },
      fotos: ['assets/almondega-bovina.jpg'],
      fluxo: [
        'Recepção e manutenção da carne refrigerada',
        'Moagem da carne e da gordura',
        'Pesagem dos ingredientes secos e úmidos',
        'Mistura até obtenção de massa coesa e homogênea',
        'Modelagem em unidades com peso padronizado',
        'Pesagem inicial das unidades',
        'Cocção experimental em forno, chapa ou molho padronizado',
        'Cálculo de rendimento e avaliação de textura, cor e formato'
      ],
      pontos: [
        'Controlar o tamanho das unidades para comparar rendimento',
        'Evitar mistura insuficiente, que causa desmanche na cocção',
        'Evitar mistura excessiva, que pode endurecer a textura',
        'Observar efeito de ligantes como ovo e farinha de rosca',
        'Registrar perda de massa e aparência final'
      ],
      equipamentos: [
        'Balança de bancada',
        'Moedor de carne',
        'Bowls de aço inox',
        'Colher dosadora ou porcionador',
        'Bandejas',
        'Forno, chapa ou panela para cocção experimental',
        'Termômetro tipo espeto',
        'Papel filme ou recipiente tampado para descanso'
      ],
      perguntas: [
        'Qual foi a função do ovo ou do ingrediente ligante na estrutura?',
        'Como o tamanho da almôndega altera tempo de cocção e rendimento?',
        'A formulação ficou mais macia ou mais firme do que o esperado?',
        'Que alteração faria sentido para reduzir desmanche sem deixar a textura seca?'
      ]
    },
    {
      id: 'prod_linguica_frescal',
      nome: 'Linguiça frescal suína',
      categoria: 'Embutido cárneo fresco',
      categoriaId: 'embutidos',
      categoriaIds: ['embutidos'],
      especie: 'suína',
      tipo: 'linguica_frescal',
      descricao: 'Produto cárneo fresco, moído, condimentado e embutido em envoltório natural ou artificial, mantido sob refrigeração e sem tratamento térmico no processamento.',
      objetivo: 'Relacionar granulometria, teor de gordura, sal, gelo e embutimento com textura, rendimento, aparência e controle higiênico-sanitário da linguiça frescal.',
      parametros: {
        gorduraMax: 30,
        proteinaMin: 12,
        carbMax: '',
        proteinaNaoCarneaMax: 2.5,
        proibeProteinaNaoCarnea: false,
        mostrarValidacao: true
      },
      fotos: ['assets/linguica-frescal.jpg'],
      fluxo: [
        'Recepção da carne suína, gordura e tripas sob refrigeração',
        'Toalete, corte e padronização dos pedaços para moagem',
        'Moagem da carne e do toucinho na granulometria definida',
        'Pesagem dos condimentos, sal e água gelada',
        'Mistura até distribuição uniforme dos ingredientes',
        'Hidratação e preparo das tripas naturais quando utilizadas',
        'Embutimento sem excesso de ar e torção em gomos padronizados',
        'Embalagem, identificação e conservação refrigerada',
        'Avaliação de rendimento, aparência, coesão e perda por cocção'
      ],
      pontos: [
        'Trabalhar com matéria-prima fria e utensílios higienizados',
        'Evitar aquecimento da massa durante moagem e mistura',
        'Controlar teor de gordura para não ultrapassar o limite do produto frescal',
        'Não utilizar CMS em linguiça frescal',
        'Evitar bolsas de ar e falhas de enchimento no embutimento',
        'Manter o produto refrigerado até a cocção experimental'
      ],
      equipamentos: [
        'Balança de bancada',
        'Moedor de carne',
        'Misturador manual ou bowls de aço inox',
        'Embutidora ou ensacadeira',
        'Tripa suína natural hidratada',
        'Barbante culinário ou amarrador',
        'Agulha fina para retirada de ar',
        'Bandejas, filme plástico e termômetro'
      ],
      perguntas: [
        'Como a granulometria altera textura e aparência?',
        'Qual é o efeito do teor de gordura sobre suculência e perda por cocção?',
        'Como o gelo ajuda no controle de temperatura e distribuição dos condimentos?',
        'Quais diferenças tecnológicas existem entre linguiça frescal, cozida e dessecada?',
        'A formulação atende aos limites de gordura e proteína previstos para linguiças frescais?'
      ]
    },
    {
      id: 'prod_pate',
      nome: 'Patê cárneo',
      categoria: 'Produto cárneo emulsionado/pastoso',
      categoriaId: 'emulsionados',
      categoriaIds: ['emulsionados'],
      especie: 'suína',
      tipo: 'geral',
      descricao: 'Produto cárneo de textura fina e espalhável, adequado para discutir trituração, emulsificação, tratamento térmico, envase e estabilidade de massa pastosa.',
      objetivo: 'Compreender como matéria-prima cárnea, gordura, água/gelo, sal, amido e processamento fino interferem na textura, estabilidade, rendimento e segurança do patê.',
      parametros: {
        gorduraMax: '',
        proteinaMin: '',
        carbMax: '',
        proteinaNaoCarneaMax: '',
        proibeProteinaNaoCarnea: false,
        mostrarValidacao: true
      },
      fotos: ['assets/pate-carneo.jpg'],
      fluxo: [
        'Recepção e seleção da matéria-prima refrigerada',
        'Pesagem de carnes, gordura, água/gelo, sal e ingredientes secos',
        'Pré-cominuição ou moagem da matéria-prima',
        'Processamento fino em cutter ou processador com adição gradual de gelo',
        'Ajuste de condimentos e ingredientes de estabilidade',
        'Envase em potes ou formas adequadas',
        'Tratamento térmico conforme objetivo da prática',
        'Resfriamento rápido, identificação e avaliação de textura, aparência e espalhabilidade'
      ],
      pontos: [
        'Manter a massa fria durante a trituração fina',
        'Adicionar gelo de forma controlada para evitar aquecimento',
        'Observar separação de gordura ou água livre',
        'Padronizar peso de envase para comparar rendimento',
        'Monitorar tempo e temperatura do tratamento térmico',
        'Resfriar rapidamente após o processamento térmico'
      ],
      equipamentos: [
        'Balança de bancada',
        'Moedor, cutter ou processador de alimentos',
        'Bowls de aço inox',
        'Espátulas de silicone',
        'Potes ou formas para envase',
        'Banho-maria, panela ou forno para tratamento térmico',
        'Termômetro tipo espeto',
        'Bandejas e filme plástico'
      ],
      perguntas: [
        'O que indica instabilidade quando aparece água livre ou gordura separada?',
        'Como a temperatura da massa interfere na textura final?',
        'Qual ingrediente teve maior impacto na espalhabilidade?',
        'Como o envase e o resfriamento podem afetar segurança e padronização?'
      ]
    },
    {
      id: 'prod_salsicha',
      nome: 'Salsicha',
      categoria: 'Produto cárneo embutido e emulsionado',
      categoriaId: 'embutidos',
      categoriaIds: ['embutidos', 'emulsionados'],
      especie: 'suína',
      tipo: 'geral',
      descricao: 'Produto cárneo emulsionado, embutido e cozido, usado para integrar conceitos de emulsão cárnea, envoltório, estabilidade, tratamento térmico e resfriamento.',
      objetivo: 'Relacionar cutterização, teor de gordura, gelo, sal, estabilidade da emulsão e embutimento com textura fina, rendimento, aparência e qualidade da salsicha.',
      parametros: {
        gorduraMax: '',
        proteinaMin: '',
        carbMax: '',
        proteinaNaoCarneaMax: '',
        proibeProteinaNaoCarnea: false,
        mostrarValidacao: true
      },
      fotos: ['assets/salsicha.jpg'],
      fluxo: [
        'Recepção e manutenção das matérias-primas sob refrigeração',
        'Corte, pesagem e pré-moagem de carnes e gordura',
        'Cutterização com sal, gelo e ingredientes secos',
        'Acompanhamento da temperatura da massa durante a emulsificação',
        'Embutimento em envoltório apropriado e padronização do calibre',
        'Tratamento térmico até atingir temperatura interna definida',
        'Resfriamento rápido em água fria ou banho de gelo',
        'Avaliação de textura, cor, estabilidade e perda por cocção'
      ],
      pontos: [
        'Evitar aquecimento excessivo durante a cutterização',
        'Adicionar gelo gradualmente para controlar temperatura e hidratação',
        'Observar quebra de emulsão, exsudação e falhas de textura',
        'Evitar bolhas de ar e variação de calibre no embutimento',
        'Monitorar temperatura interna no cozimento',
        'Resfriar rapidamente para interromper cocção e estabilizar textura'
      ],
      equipamentos: [
        'Balança de bancada',
        'Moedor de carne',
        'Cutter, processador ou emulsificador',
        'Embutidora',
        'Envoltório artificial ou natural adequado',
        'Tanque, panela ou banho-maria para cozimento',
        'Banho de gelo para resfriamento',
        'Termômetro tipo espeto e bandejas'
      ],
      perguntas: [
        'Por que a salsicha aparece em Embutidos e em Emulsionados?',
        'Quais sinais indicam quebra de emulsão?',
        'Como temperatura e gelo influenciam textura e rendimento?',
        'O envoltório usado alterou aparência, calibre ou mordida?'
      ]
    },
    {
      id: 'prod_pernil_marinado',
      nome: 'Pernil marinado',
      categoria: 'Produto cárneo marinado',
      categoriaId: 'marinados',
      categoriaIds: ['marinados'],
      especie: 'suína',
      tipo: 'geral',
      descricao: 'Peça ou porção suína submetida à marinada/salmoura condimentada para padronizar sabor, rendimento, maciez e suculência antes da cocção experimental.',
      objetivo: 'Avaliar como concentração da marinada, tempo de contato, temperatura e proporção entre carne e salmoura influenciam rendimento, sabor e textura do pernil.',
      parametros: { gorduraMax: '', proteinaMin: '', carbMax: '', proteinaNaoCarneaMax: '', proibeProteinaNaoCarnea: false, mostrarValidacao: true },
      fotos: ['assets/pernil-marinado.jpg'],
      fluxo: [
        'Recepção e inspeção visual do pernil refrigerado',
        'Toalete e padronização das porções para a prática',
        'Pesagem da carne e preparo da marinada conforme formulação',
        'Aplicação da marinada por imersão, massagem ou injeção didática',
        'Repouso refrigerado pelo tempo definido para contato',
        'Escorrimento, pesagem e registro de ganho ou perda de massa',
        'Cocção experimental com controle de temperatura interna',
        'Resfriamento breve, fatiamento e avaliação de sabor, textura e rendimento'
      ],
      pontos: [
        'Manter o produto refrigerado durante o tempo de marinada',
        'Registrar peso antes e depois da marinada',
        'Evitar excesso de salmoura livre na embalagem ou recipiente',
        'Padronizar tempo de contato entre grupos',
        'Controlar temperatura interna na cocção',
        'Comparar suculência e intensidade de sabor entre formulações'
      ],
      equipamentos: [
        'Balança de bancada',
        'Bowls ou recipientes sanitizados com tampa',
        'Facas e tábuas separadas para carne crua',
        'Medidores ou provetas para preparo da marinada',
        'Bandejas e filme plástico',
        'Forno, chapa ou panela para cocção experimental',
        'Termômetro tipo espeto',
        'Etiquetas para identificação dos tratamentos'
      ],
      perguntas: [
        'A marinada aumentou ou reduziu o peso da matéria-prima?',
        'Qual ingrediente mais influenciou sabor e suculência?',
        'Como tempo de contato e temperatura interferem na segurança do processo?',
        'Que ajuste faria sentido para reduzir sal sem perder percepção de sabor?'
      ]
    },
    {
      id: 'prod_kibe',
      nome: 'Kibe',
      categoria: 'Produto cárneo reestruturado',
      categoriaId: 'reestruturados',
      categoriaIds: ['reestruturados'],
      especie: 'bovina',
      tipo: 'geral',
      descricao: 'Produto cárneo moldado que combina carne moída, trigo hidratado e condimentos, útil para discutir liga, retenção de água, padronização e cocção.',
      objetivo: 'Compreender o efeito do trigo hidratado, da gordura, do sal e da mistura mecânica na coesão, rendimento e textura do kibe.',
      parametros: { gorduraMax: '', proteinaMin: '', carbMax: '', proteinaNaoCarneaMax: '', proibeProteinaNaoCarnea: false, mostrarValidacao: true },
      fotos: ['assets/kibe.jpg'],
      fluxo: [
        'Hidratação do trigo para kibe em água fria e posterior escorrimento',
        'Recepção e moagem da carne refrigerada',
        'Pesagem dos ingredientes conforme a formulação',
        'Mistura da carne, trigo hidratado, sal e condimentos',
        'Trabalho mecânico até obtenção de massa coesa',
        'Modelagem em unidades padronizadas',
        'Cocção experimental em forno, chapa ou fritura controlada',
        'Avaliação de rendimento, coesão, textura e sabor'
      ],
      pontos: [
        'Padronizar hidratação e escorrimento do trigo',
        'Evitar excesso de água livre na massa',
        'Manter a carne fria durante moagem e mistura',
        'Padronizar peso e formato das unidades',
        'Registrar perda de massa após a cocção',
        'Observar desmanche, rachaduras e textura final'
      ],
      equipamentos: [
        'Balança de bancada',
        'Recipiente para hidratação do trigo',
        'Peneira ou escorredor',
        'Moedor de carne',
        'Bowls de aço inox',
        'Porcionador ou molde manual',
        'Forno, chapa ou panela para cocção',
        'Termômetro tipo espeto'
      ],
      perguntas: [
        'Como o trigo hidratado alterou textura e rendimento?',
        'Houve água livre ou desmanche durante a cocção?',
        'A intensidade de mistura foi suficiente para formar liga?',
        'Que diferença seria esperada ao variar o teor de gordura?'
      ]
    },
    {
      id: 'prod_nuggets',
      nome: 'Nuggets',
      categoria: 'Produto cárneo reestruturado empanado',
      categoriaId: 'empanados',
      categoriaIds: ['reestruturados', 'empanados'],
      especie: 'frango',
      tipo: 'geral',
      descricao: 'Produto reestruturado de frango, moldado e empanado, adequado para estudar massa cárnea, adesão de cobertura, rendimento e textura após cocção.',
      objetivo: 'Avaliar como moagem, mistura, moldagem e sistema de empanamento interferem na aderência da cobertura, crocância, rendimento e aceitação visual dos nuggets.',
      parametros: { gorduraMax: '', proteinaMin: '', carbMax: '', proteinaNaoCarneaMax: '', proibeProteinaNaoCarnea: false, mostrarValidacao: true },
      fotos: ['assets/nuggets.jpg'],
      fluxo: [
        'Recepção do frango refrigerado e separação de aparas indesejáveis',
        'Moagem ou processamento grosseiro da carne',
        'Mistura com sal, gelo e ingredientes de liga',
        'Moldagem em unidades padronizadas',
        'Pré-enfarinhamento quando previsto',
        'Passagem em líquido de adesão e cobertura seca',
        'Cocção experimental em forno, air fryer ou fritura controlada',
        'Avaliação de aderência, crocância, rendimento e textura interna'
      ],
      pontos: [
        'Manter a massa fria e coesa antes da moldagem',
        'Padronizar peso e espessura das unidades',
        'Evitar excesso de umidade superficial antes do empanamento',
        'Controlar aderência e perda de cobertura',
        'Monitorar tempo e temperatura de cocção',
        'Registrar rendimento antes e depois da cocção'
      ],
      equipamentos: [
        'Balança de bancada',
        'Moedor ou processador',
        'Bowls de aço inox',
        'Moldes ou porcionador',
        'Bandejas para farinha, líquido de adesão e cobertura',
        'Pegadores ou pinças',
        'Forno, air fryer ou fritadeira controlada',
        'Termômetro tipo espeto'
      ],
      perguntas: [
        'Qual etapa mais influenciou a aderência da cobertura?',
        'A massa manteve formato durante a cocção?',
        'Como a umidade da superfície alterou o empanamento?',
        'Que ajuste reduziria perda de cobertura sem endurecer o produto?'
      ]
    },
    {
      id: 'prod_presunto_suino',
      nome: 'Presunto suíno',
      categoria: 'Produto cárneo curado e cozido',
      categoriaId: 'curados_cozidos',
      categoriaIds: ['curados_cozidos'],
      especie: 'suína',
      tipo: 'geral',
      descricao: 'Produto suíno curado e cozido, usado didaticamente para discutir salmoura, cura, retenção de água, tratamento térmico, resfriamento e fatiabilidade.',
      objetivo: 'Relacionar salmoura, agentes de cura, fosfato, cocção e resfriamento com rendimento, cor, textura, fatiabilidade e segurança do presunto suíno.',
      parametros: { gorduraMax: '', proteinaMin: '', carbMax: '', proteinaNaoCarneaMax: '', proibeProteinaNaoCarnea: false, mostrarValidacao: true },
      fotos: ['assets/presunto-suino.jpg'],
      fluxo: [
        'Recepção do pernil suíno refrigerado',
        'Toalete e padronização da peça ou porções',
        'Preparo da salmoura com ingredientes pesados',
        'Aplicação da salmoura por imersão, massagem ou injeção didática',
        'Repouso refrigerado para cura e distribuição dos ingredientes',
        'Enformagem ou embalagem para cocção',
        'Cocção até temperatura interna definida',
        'Resfriamento, desenformagem, fatiamento e avaliação de rendimento e textura'
      ],
      pontos: [
        'Controlar concentração da salmoura e dos agentes de cura',
        'Manter repouso refrigerado durante a cura',
        'Registrar peso antes e depois da salmoura e da cocção',
        'Evitar aquecimento insuficiente no centro da peça',
        'Resfriar rapidamente após o tratamento térmico',
        'Avaliar fatiabilidade, cor, exsudação e textura'
      ],
      equipamentos: [
        'Balança de bancada',
        'Recipiente para salmoura',
        'Seringa ou injetora manual didática quando disponível',
        'Massageador, saco plástico próprio ou recipiente com tampa',
        'Forma ou embalagem para cocção',
        'Banho-maria, panela ou forno',
        'Termômetro tipo espeto',
        'Faca ou fatiador para avaliação'
      ],
      perguntas: [
        'Como a salmoura alterou peso e textura?',
        'Que efeito a cura teve na cor e no sabor?',
        'O resfriamento influenciou fatiabilidade?',
        'Quais cuidados legais e de segurança devem ser conferidos antes de uso real?'
      ]
    }
  ],
  insumos: [
    { id: 'ing_carne_bovina_magra', nome: 'Carne bovina magra', categoria: 'Matéria-prima cárnea', tipo: 'carne', funcao: 'Fornece proteínas miofibrilares responsáveis pela estrutura, liga e textura do produto.', obs: 'Em aula, comparar cortes mais magros e cortes com maior teor de gordura evidencia diferenças de textura e rendimento.', gordura: 5, proteina: 20, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_gordura_bovina', nome: 'Gordura bovina', categoria: 'Gordura animal', tipo: 'gordura', funcao: 'Contribui para suculência, sabor, maciez e percepção de palatabilidade.', obs: 'Deve ser bem distribuída para evitar perda excessiva durante a cocção.', gordura: 100, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_pernil_suino', nome: 'Pernil suíno magro', categoria: 'Matéria-prima cárnea', tipo: 'carne', funcao: 'Base proteica da linguiça frescal; contribui para estrutura, rendimento e sabor característico.', obs: 'Manter refrigerado e moer frio para reduzir liberação de gordura.', gordura: 8, proteina: 20, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_toucinho_suino', nome: 'Toucinho suíno', categoria: 'Gordura animal', tipo: 'gordura', funcao: 'Ajusta o teor de gordura, melhora suculência e contribui para sabor e textura do embutido.', obs: 'Cortar em cubos e manter frio antes da moagem para preservar definição de partículas.', gordura: 99, proteina: 1, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_peito_frango', nome: 'Peito de frango sem pele', categoria: 'Matéria-prima cárnea', tipo: 'carne', funcao: 'Base proteica magra para produtos de frango reestruturados, contribuindo para liga, textura e rendimento.', obs: 'Manter refrigerado e processar frio para evitar perda de liga e aquecimento da massa.', gordura: 3, proteina: 21, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    ...MEAT_CUT_INGREDIENTS,
    { id: 'ing_agua_gelada', nome: 'Água gelada / gelo', categoria: 'Veículo tecnológico', tipo: 'agua', funcao: 'Ajuda na distribuição dos ingredientes, hidratação e controle de temperatura durante a mistura.', obs: 'O excesso pode deixar a massa pouco coesa ou favorecer exsudação.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_sal', nome: 'Sal', categoria: 'Condimento / sal', tipo: 'sal', funcao: 'Contribui para sabor e favorece a extração de proteínas miofibrilares, aumentando a liga da massa.', obs: 'Em aula, comparar teores de sal mostra diferença de coesão e percepção sensorial.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_sal_cura_tipo_1', nome: 'Sal de cura tipo 1', categoria: 'Mistura/preparado comercial', tipo: 'mistura_comercial', subtipo: 'mistura de cura', curaTipo: 1, funcao: 'Mistura de cura de ação curta, normalmente formulada com nitrito. A concentração real deve ser copiada do rótulo do preparado usado na aula.', obs: 'Uso exclusivamente didático e sob orientação docente. Informe a concentração do produto em mãos e confira a legislação vigente antes de qualquer aplicação.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_sal_cura_tipo_2', nome: 'Sal de cura tipo 2', categoria: 'Mistura/preparado comercial', tipo: 'mistura_comercial', subtipo: 'mistura de cura', curaTipo: 2, funcao: 'Mistura de cura que pode combinar nitrito e nitrato. As concentrações reais devem ser copiadas do rótulo do preparado usado na aula.', obs: 'Uso exclusivamente didático e sob orientação docente. Informe nitrito e nitrato do produto em mãos e confira a legislação vigente antes de qualquer aplicação.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_alho_po', nome: 'Alho em pó', categoria: 'Condimento', tipo: 'condimento', funcao: 'Fornece sabor e aroma característicos.', obs: 'Pode ser substituído por alho fresco, ajustando umidade e intensidade.', gordura: 0, proteina: 0, carboidrato: 70, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_pimenta_reino', nome: 'Pimenta-do-reino preta', categoria: 'Condimento', tipo: 'condimento', subtipo: 'moídos', funcao: 'Ajusta pungência e aroma, ajudando a caracterizar o perfil sensorial do produto.', obs: 'Usar pequenas quantidades para não mascarar diferenças entre formulações.', gordura: 3, proteina: 10, carboidrato: 64, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_paprica_doce', nome: 'Páprica doce', categoria: 'Condimento', tipo: 'condimento', funcao: 'Contribui para cor e aroma suave em embutidos frescais.', obs: 'Permite discutir padronização visual sem depender de corantes.', gordura: 13, proteina: 14, carboidrato: 54, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_acucar', nome: 'Açúcar', categoria: 'Carboidrato', tipo: 'carboidrato', funcao: 'Equilibra sabor e pode contribuir para escurecimento em produtos submetidos à cocção.', obs: 'Em linguiça frescal, usar em baixo teor para ajuste sensorial.', gordura: 0, proteina: 0, carboidrato: 100, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_cebola_desidratada', nome: 'Cebola desidratada', categoria: 'Condimento', tipo: 'condimento', funcao: 'Fornece aroma e dulçor característicos, contribuindo para o perfil sensorial de produtos moldados.', obs: 'Permite padronização melhor que cebola fresca, que varia em umidade.', gordura: 1, proteina: 10, carboidrato: 75, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_salsa_desidratada', nome: 'Salsa desidratada', categoria: 'Condimento / erva', tipo: 'condimento', funcao: 'Adiciona notas herbais e pontos visuais verdes em produtos como kafta e almôndega.', obs: 'Usar em baixo teor para não mascarar diferenças de textura.', gordura: 4, proteina: 22, carboidrato: 51, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_farinha_rosca', nome: 'Farinha de rosca', categoria: 'Ingrediente ligante', tipo: 'carboidrato', funcao: 'Auxilia na absorção de umidade e na estrutura de produtos moldados, reduzindo desmanche durante a cocção.', obs: 'Discutir presença de glúten e impacto sobre textura, rendimento e rotulagem.', gordura: 3, proteina: 13, carboidrato: 72, custo: 0, proteinaNaoCarnea: false, alergeno: true },
    { id: 'ing_trigo_kibe', nome: 'Trigo para kibe', categoria: 'Ingrediente funcional não aditivo', tipo: 'funcional_nao_aditivo', subtipo: 'amidos/farinhas', funcao: 'Absorve água, contribui para corpo, rendimento e textura característica em kibe e produtos moldados.', obs: 'Ingrediente com glúten; padronizar hidratação e escorrimento antes da mistura.', gordura: 1, proteina: 12, carboidrato: 76, custo: 0, proteinaNaoCarnea: false, alergeno: true },
    { id: 'ing_ovo_liquido', nome: 'Ovo líquido', categoria: 'Ingrediente ligante', tipo: 'outro', funcao: 'Contribui para liga, emulsificação parcial e estrutura térmica em produtos moldados.', obs: 'Ingrediente alergênico; útil para comparar formulações com e sem ligante proteico.', gordura: 10, proteina: 12, carboidrato: 1, custo: 0, proteinaNaoCarnea: false, alergeno: true },
    { id: 'ing_tripa_suina', nome: 'Tripa suína natural', categoria: 'Envoltório', tipo: 'outro', funcao: 'Envoltório comestível que dá formato ao embutido e influencia aparência, calibre e mordida.', obs: 'Hidratar, lavar e manter sob boas condições higiênicas antes do embutimento.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, usadoNaFormulacao: false, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_proteina_soja', nome: 'Proteína de soja texturizada/fina', categoria: 'Proteína não cárnea', tipo: 'proteina_nao_carnea', funcao: 'Pode contribuir para retenção de água, rendimento e textura, respeitando os limites do produto.', obs: 'Discutir rotulagem, limite legal, declaração de alergênico e impacto sensorial.', gordura: 1, proteina: 50, carboidrato: 30, custo: 0, proteinaNaoCarnea: true, alergeno: true },
    { id: 'ing_figado_suino', nome: 'Fígado suíno', categoria: 'Matéria-prima cárnea', tipo: 'carne', funcao: 'Contribui para sabor característico, cor e corpo em formulações pastosas como patê.', obs: 'Usar refrigerado e discutir intensidade sensorial quando a proporção aumenta.', gordura: 4, proteina: 20, carboidrato: 4, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_fosfato', nome: 'Fosfato', categoria: 'Aditivo funcional', tipo: 'aditivo', funcao: 'Auxilia na retenção de água, extração proteica e estabilidade de emulsões cárneas, quando permitido.', obs: 'Usar apenas em discussão didática e conferir limites e permissões na legislação vigente para cada produto.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_leite_po', nome: 'Leite em pó', categoria: 'Ingrediente lácteo', tipo: 'lacteo', funcao: 'Contribui para corpo, retenção de água e estabilidade em alguns produtos emulsionados.', obs: 'Ingrediente alergênico; discutir declaração em rótulo quando utilizado.', gordura: 1, proteina: 34, carboidrato: 52, custo: 0, proteinaNaoCarnea: false, alergeno: true },
    { id: 'ing_pimenta_branca', nome: 'Pimenta branca moída', categoria: 'Condimento', tipo: 'condimento', subtipo: 'moídos', funcao: 'Ajusta pungência e aroma com menor impacto visual em massas claras e emulsionadas.', obs: 'Boa opção para comparar sabor suave e acentuado sem alterar muito a aparência.', gordura: 2, proteina: 10, carboidrato: 64, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_amido', nome: 'Amido', categoria: 'Carboidrato', tipo: 'carboidrato', funcao: 'Auxilia na retenção de água e na estabilidade, quando permitido e dentro dos limites do produto.', obs: 'Rendimento, textura e enquadramento legal podem ser comparados quando o teor é alterado.', gordura: 0, proteina: 0, carboidrato: 88, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_fumaca_po', nome: 'Fumaça em pó', categoria: 'Aromatizante', tipo: 'aditivo_alimentar', subtipo: 'aromatizantes', funcao: 'Fornece aroma e sabor defumados de forma concentrada e padronizada.', obs: 'A intensidade varia entre fabricantes; ajustar conforme o produto utilizado.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_fumaca_liquida', nome: 'Fumaça líquida', categoria: 'Aromatizante', tipo: 'aditivo_alimentar', subtipo: 'aromatizantes', funcao: 'Fornece notas defumadas e pode ser distribuída na fase líquida da formulação.', obs: 'Considerar a concentração e as instruções do fabricante.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_cebola_po', nome: 'Cebola em pó', categoria: 'Condimento', tipo: 'condimento_especiaria', subtipo: 'em pó', funcao: 'Fornece aroma e dulçor de cebola com boa padronização e baixa adição de umidade.', obs: 'Pode substituir cebola fresca ou desidratada, ajustando a intensidade.', gordura: 1, proteina: 10, carboidrato: 75, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_paprica_defumada', nome: 'Páprica defumada', categoria: 'Condimento', tipo: 'condimento_especiaria', subtipo: 'em pó', funcao: 'Contribui com cor, aroma e sabor defumado.', obs: 'Usar em baixo teor para não dominar os demais condimentos.', gordura: 13, proteina: 14, carboidrato: 54, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_alecrim_po', nome: 'Alecrim em pó', categoria: 'Condimento / erva', tipo: 'condimento_especiaria', subtipo: 'em pó', funcao: 'Adiciona notas herbais intensas e características.', obs: 'A intensidade é alta; ajustar em pequenas quantidades.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_zaatar', nome: 'Zaatar', categoria: 'Condimento / mistura de especiarias', tipo: 'condimento_especiaria', subtipo: 'naturais', funcao: 'Adiciona perfil herbal, ácido e tostado conforme a composição da mistura.', obs: 'Conferir os ingredientes do produto, pois a composição varia entre fabricantes.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_cominho', nome: 'Cominho', categoria: 'Condimento', tipo: 'condimento_especiaria', subtipo: 'moídos', funcao: 'Fornece aroma quente e terroso característico.', obs: 'Usar em pequenas quantidades para controlar a intensidade.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_hortela', nome: 'Hortelã', categoria: 'Condimento / erva', tipo: 'condimento_especiaria', subtipo: 'frescos', funcao: 'Adiciona frescor e aroma herbal, especialmente em kibe e preparações condimentadas.', obs: 'Quando fresca, considerar a umidade e padronizar a higienização.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_hortela_desidratada', nome: 'Hortelã desidratada', categoria: 'Condimento / erva', tipo: 'condimento_especiaria', subtipo: 'desidratados', funcao: 'Fornece aroma de hortelã com maior estabilidade e padronização.', obs: 'A intensidade pode ser maior que a da erva fresca.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_glutamato_monossodico', nome: 'Glutamato monossódico', categoria: 'Aditivo alimentar', tipo: 'aditivo_alimentar', subtipo: 'realçadores de sabor', funcao: 'Realça a percepção de sabor umami.', obs: 'Usar conforme a finalidade tecnológica e as condições aplicáveis ao produto.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_eritorbato_sodio', nome: 'Eritorbato de sódio', categoria: 'Aditivo alimentar', tipo: 'aditivo_alimentar', subtipo: 'antioxidantes', funcao: 'Atua como antioxidante e pode auxiliar na estabilidade de cor em produtos cárneos.', obs: 'Verificar permissão e limite para a categoria do produto.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_acido_ascorbico', nome: 'Ácido ascórbico', categoria: 'Aditivo alimentar', tipo: 'aditivo_alimentar', subtipo: 'antioxidantes', funcao: 'Atua como antioxidante e regulador de acidez conforme a aplicação.', obs: 'Verificar permissão e limite para a categoria do produto.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_ascorbato_sodio', nome: 'Ascorbato de sódio', categoria: 'Aditivo alimentar', tipo: 'aditivo_alimentar', subtipo: 'antioxidantes', funcao: 'Atua como antioxidante e pode auxiliar na estabilidade da cor.', obs: 'Verificar permissão e limite para a categoria do produto.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false },
    { id: 'ing_extrato_alecrim', nome: 'Extrato de alecrim', categoria: 'Aditivo alimentar', tipo: 'aditivo_alimentar', subtipo: 'antioxidantes', funcao: 'Auxilia no controle da oxidação e também pode contribuir com notas herbais.', obs: 'A composição e a concentração variam entre produtos comerciais.', gordura: 0, proteina: 0, carboidrato: 0, custo: 0, proteinaNaoCarnea: false, alergeno: false }
  ],
  formulacoes: [
    {
      id: 'form_hamb_base',
      produtoId: 'prod_hamburguer',
      nome: 'Hambúrguer bovino',
      pesoReferencia: 1000,
      baseCalculo: 'massa_carnea',
      rendimento: 82,
      itens: [
        { insumoId: 'ing_carne_bovina_magra', percentual: 82 },
        { insumoId: 'ing_gordura_bovina', percentual: 18 },
        { insumoId: 'ing_agua_gelada', percentual: 3 },
        { insumoId: 'ing_sal', percentual: 1.8 },
        { insumoId: 'ing_alho_po', percentual: 1.5 },
        { insumoId: 'ing_cebola_po', percentual: 1 },
        { insumoId: 'ing_fumaca_po', percentual: 0.2 }
      ],
      observacoes: ''
    },
    {
      id: 'form_kafta_base',
      produtoId: 'prod_kafta',
      nome: 'Kafta bovina',
      pesoReferencia: 1000,
      baseCalculo: 'massa_carnea',
      rendimento: 80,
      itens: [
        { insumoId: 'ing_carne_bovina_magra', percentual: 90 },
        { insumoId: 'ing_gordura_bovina', percentual: 10 },
        { insumoId: 'ing_sal', percentual: 1.7 },
        { insumoId: 'ing_alho_po', percentual: 0.6 },
        { insumoId: 'ing_cebola_desidratada', percentual: 1.2 },
        { insumoId: 'ing_pimenta_reino', percentual: 0.2 },
        { insumoId: 'ing_salsa_desidratada', percentual: 0.6 }
      ],
      observacoes: 'Formulação para discutir moldagem, estabilidade no espeto e efeito de condimentos sobre a coesão.'
    },
    {
      id: 'form_almondega_base',
      produtoId: 'prod_almondega',
      nome: 'Almôndega bovina',
      pesoReferencia: 1000,
      baseCalculo: 'massa_carnea',
      rendimento: 78,
      itens: [
        { insumoId: 'ing_carne_bovina_magra', percentual: 88 },
        { insumoId: 'ing_gordura_bovina', percentual: 12 },
        { insumoId: 'ing_ovo_liquido', percentual: 5 },
        { insumoId: 'ing_farinha_rosca', percentual: 4 },
        { insumoId: 'ing_sal', percentual: 1.6 },
        { insumoId: 'ing_alho_po', percentual: 0.4 },
        { insumoId: 'ing_pimenta_reino', percentual: 0.2 },
        { insumoId: 'ing_salsa_desidratada', percentual: 0.5 }
      ],
      observacoes: 'Formulação para comparar o efeito de ingredientes ligantes sobre desmanche, textura e perda por cocção.'
    },
    {
      id: 'form_linguica_base',
      produtoId: 'prod_linguica_frescal',
      nome: 'Linguiça frescal suína',
      pesoReferencia: 2000,
      baseCalculo: 'produto_final',
      rendimento: 92,
      itens: [
        { insumoId: 'ing_pernil_suino', percentual: 72 },
        { insumoId: 'ing_toucinho_suino', percentual: 20 },
        { insumoId: 'ing_agua_gelada', percentual: 4.8 },
        { insumoId: 'ing_sal', percentual: 1.8 },
        { insumoId: 'ing_alho_po', percentual: 0.5 },
        { insumoId: 'ing_paprica_doce', percentual: 0.3 },
        { insumoId: 'ing_fumaca_po', percentual: 0.2 },
        { insumoId: 'ing_pimenta_reino', percentual: 0.2 },
        { insumoId: 'ing_acucar', percentual: 0.2 }
      ],
      observacoes: 'Formulação demonstrativa para observar embutimento, teor de gordura, coesão e perda por cocção em produto frescal.'
    },
    {
      id: 'form_pate_base',
      produtoId: 'prod_pate',
      nome: 'Patê cárneo',
      pesoReferencia: 1000,
      baseCalculo: 'produto_final',
      rendimento: 88,
      itens: [
        { insumoId: 'ing_pernil_suino', percentual: 42 },
        { insumoId: 'ing_figado_suino', percentual: 18 },
        { insumoId: 'ing_toucinho_suino', percentual: 16 },
        { insumoId: 'ing_agua_gelada', percentual: 15 },
        { insumoId: 'ing_amido', percentual: 5 },
        { insumoId: 'ing_sal', percentual: 1.8 },
        { insumoId: 'ing_alho_po', percentual: 0.4 },
        { insumoId: 'ing_pimenta_branca', percentual: 0.2 },
        { insumoId: 'ing_acucar', percentual: 0.6 },
        { insumoId: 'ing_leite_po', percentual: 1 }
      ],
      observacoes: 'Formulação didática em 100% do produto final para observar estabilidade, espalhabilidade e efeito do processamento fino.'
    },
    {
      id: 'form_salsicha_base',
      produtoId: 'prod_salsicha',
      nome: 'Salsicha',
      pesoReferencia: 2000,
      baseCalculo: 'produto_final',
      rendimento: 90,
      itens: [
        { insumoId: 'ing_pernil_suino', percentual: 60 },
        { insumoId: 'ing_toucinho_suino', percentual: 15 },
        { insumoId: 'ing_agua_gelada', percentual: 17.8 },
        { insumoId: 'ing_amido', percentual: 3 },
        { insumoId: 'ing_sal', percentual: 1.8 },
        { insumoId: 'ing_leite_po', percentual: 1 },
        { insumoId: 'ing_acucar', percentual: 0.5 },
        { insumoId: 'ing_alho_po', percentual: 0.3 },
        { insumoId: 'ing_fosfato', percentual: 0.3 },
        { insumoId: 'ing_pimenta_branca', percentual: 0.1 },
        { insumoId: 'ing_fumaca_po', percentual: 0.2 }
      ],
      observacoes: 'Formulação didática fechada em 100% para discutir massa emulsionada, embutimento, cozimento e resfriamento.'
    },
    {
      id: 'form_pernil_marinado_base',
      produtoId: 'prod_pernil_marinado',
      nome: 'Pernil marinado',
      pesoReferencia: 1000,
      baseCalculo: 'massa_carnea',
      rendimento: 88,
      itens: [
        { insumoId: 'ing_pernil_suino', percentual: 100 },
        { insumoId: 'ing_agua_gelada', percentual: 12 },
        { insumoId: 'ing_sal', percentual: 1.8 },
        { insumoId: 'ing_sal_cura_tipo_1', percentual: 0.2142857, cura: { teorPct: 7, ppm: 150 } },
        { insumoId: 'ing_acucar', percentual: 0.8 },
        { insumoId: 'ing_alho_po', percentual: 0.4 },
        { insumoId: 'ing_pimenta_reino', percentual: 0.15 }
      ],
      observacoes: 'Formulação didática sobre a massa cárnea para comparar ganho de massa, sabor e rendimento após marinada.'
    },
    {
      id: 'form_kibe_base',
      produtoId: 'prod_kibe',
      nome: 'Kibe',
      pesoReferencia: 1000,
      baseCalculo: 'massa_carnea',
      rendimento: 80,
      itens: [
        { insumoId: 'ing_carne_bovina_magra', percentual: 88 },
        { insumoId: 'ing_gordura_bovina', percentual: 12 },
        { insumoId: 'ing_trigo_kibe', percentual: 18 },
        { insumoId: 'ing_agua_gelada', percentual: 10 },
        { insumoId: 'ing_sal', percentual: 1.7 },
        { insumoId: 'ing_alho_po', percentual: 0.4 },
        { insumoId: 'ing_pimenta_reino', percentual: 0.2 },
        { insumoId: 'ing_salsa_desidratada', percentual: 0.4 },
        { insumoId: 'ing_hortela', percentual: 1 }
      ],
      observacoes: 'Formulação para discutir hidratação do trigo, liga, coesão e perda por cocção.'
    },
    {
      id: 'form_nuggets_base',
      produtoId: 'prod_nuggets',
      nome: 'Nuggets',
      pesoReferencia: 1000,
      baseCalculo: 'massa_carnea',
      rendimento: 78,
      itens: [
        { insumoId: 'ing_peito_frango', percentual: 100 },
        { insumoId: 'ing_agua_gelada', percentual: 8 },
        { insumoId: 'ing_amido', percentual: 4 },
        { insumoId: 'ing_sal', percentual: 1.6 },
        { insumoId: 'ing_fosfato', percentual: 0.3 },
        { insumoId: 'ing_alho_po', percentual: 0.3 },
        { insumoId: 'ing_pimenta_branca', percentual: 0.1 },
        { insumoId: 'ing_ovo_liquido', percentual: 8 },
        { insumoId: 'ing_farinha_rosca', percentual: 18 }
      ],
      observacoes: 'Formulação didática para observar massa reestruturada, moldagem e aderência da cobertura.'
    },
    {
      id: 'form_presunto_suino_base',
      produtoId: 'prod_presunto_suino',
      nome: 'Presunto suíno',
      pesoReferencia: 1000,
      baseCalculo: 'massa_carnea',
      rendimento: 86,
      itens: [
        { insumoId: 'ing_pernil_suino', percentual: 100 },
        { insumoId: 'ing_agua_gelada', percentual: 18 },
        { insumoId: 'ing_sal', percentual: 2 },
        { insumoId: 'ing_acucar', percentual: 0.8 },
        { insumoId: 'ing_fosfato', percentual: 0.35 },
        { insumoId: 'ing_sal_cura_tipo_1', percentual: 0.2142857, cura: { teorPct: 7, ppm: 150 } }
      ],
      observacoes: 'Formulação didática para discutir salmoura, cura, cocção, resfriamento e fatiabilidade.'
    }
  ],
  legislacoes: [
    {
      id: 'leg_hamburguer_724_2022',
      produtoId: 'prod_hamburguer',
      titulo: 'Portaria SDA/MAPA nº 724/2022',
      orgao: 'Ministério da Agricultura e Pecuária',
      url: 'https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-animal/legislacao/Port7242022RThamburguer1.pdf',
      resumo: 'Aprova o Regulamento Técnico de Identidade e Qualidade do hambúrguer, com definição, denominação de venda, ingredientes e parâmetros físico-químicos.',
      pontos: [
        'Gordura máxima: 25%',
        'Carboidratos totais máximos: 3%',
        'Proteína mínima: 15%',
        'Proteína não cárnea: máximo de 4% na forma agregada',
        'Quando houver indicação de corte na denominação, não é permitida proteína não cárnea'
      ]
    },
    {
      id: 'leg_linguica_in4_2000',
      produtoId: 'prod_linguica_frescal',
      titulo: 'IN SDA/MAPA nº 4/2000 - RTIQ de Linguiça',
      orgao: 'Ministério da Agricultura e Pecuária',
      url: 'https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-animal/legislacao/IN042000salsichamortadelalinguia.pdf',
      resumo: 'Aprova o RTIQ de linguiça e diferencia parâmetros para linguiças frescais, cozidas e dessecadas.',
      pontos: [
        'Linguiças frescais: umidade máxima 70%',
        'Linguiças frescais: gordura máxima 30%',
        'Linguiças frescais: proteína mínima 12%',
        'Proteína animal e/ou vegetal agregada: máximo 2,5%, com regras específicas por denominação',
        'É proibido o uso de CMS em linguiças frescais'
      ]
    },
    {
      id: 'leg_salsicha_in4_2000',
      produtoId: 'prod_salsicha',
      titulo: 'IN SDA/MAPA nº 4/2000 - RTIQ de Salsicha',
      orgao: 'Ministério da Agricultura e Pecuária',
      url: 'https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-animal/legislacao/IN042000salsichamortadelalinguia.pdf',
      resumo: 'Inclui regulamentos técnicos de produtos cárneos como salsicha, mortadela e linguiça, apoiando a discussão de produto embutido e emulsionado.',
      pontos: [
        'Definição e identidade tecnológica da salsicha',
        'Ingredientes permitidos e denominação de venda',
        'Parâmetros físico-químicos e discussão de composição',
        'Conexão entre formulação, estabilidade da emulsão e enquadramento legal'
      ]
    },
    {
      id: 'leg_riispoa_9013',
      produtoId: null,
      titulo: 'RIISPOA - Decreto nº 9.013/2017',
      orgao: 'Presidência da República',
      url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/decreto/d9013.htm',
      resumo: 'Regulamento de inspeção industrial e sanitária de produtos de origem animal. Serve como base geral para discussão de inspeção, registro, estabelecimento e responsabilidades.',
      pontos: [
        'Referência geral para produtos de origem animal',
        'Inspeção, controle higiênico-sanitário e responsabilidades',
        'Deve ser consultado com suas alterações vigentes'
      ]
    },
    {
      id: 'leg_rotulagem_anvisa',
      produtoId: null,
      titulo: 'Rotulagem nutricional - Anvisa',
      orgao: 'Agência Nacional de Vigilância Sanitária',
      url: 'https://www.gov.br/anvisa/pt-br/assuntos/alimentos/rotulagem/rotulagem-nutricional',
      resumo: 'Página de referência sobre rotulagem nutricional de alimentos embalados, incluindo RDC 429/2020 e IN 75/2020.',
      pontos: [
        'Tabela de informação nutricional',
        'Rotulagem frontal',
        'Relação entre formulação, composição e comunicação ao consumidor'
      ]
    },
    {
      id: 'leg_aditivos_carneos_778_211',
      produtoIds: ['prod_pernil_marinado', 'prod_presunto_suino'],
      titulo: 'RDC Anvisa nº 778/2023 e IN Anvisa nº 211/2023',
      orgao: 'Agência Nacional de Vigilância Sanitária',
      url: 'https://www.gov.br/anvisa/pt-br/setorregulado/regularizacao/alimentos/aditivos-alimentares',
      resumo: 'Normas vigentes sobre aditivos alimentares e suas condições de uso, incluindo nitritos e nitratos em categorias de produtos cárneos.',
      pontos: [
        'Sal de cura tipo 1: informe o teor de nitrito do preparado e use 150 ppm como limite',
        'Sal de cura tipo 2: informe o teor combinado de nitrito e nitrato do preparado e use 150 ppm como limite da combinação',
        'A composição do sal de cura comercial deve ser copiada do rótulo do produto utilizado',
        'O cálculo do app estima a quantidade adicionada e não substitui a determinação do resíduo no produto nem a conferência da categoria legal'
      ]
    }
  ]
};

const THEORY_LESSONS = PRODUCT_CATEGORIES;

const CLASS_SCHEDULE = [
  {
    id: 'aula_1',
    aula: 'Aula 1',
    tema: 'Introdução ao laboratório e cálculos percentuais',
    foco: 'Boas práticas, pesagem, leitura de formulações e diferença entre massa cárnea e produto final.',
    produtos: ['prod_hamburguer'],
    categorias: ['reestruturados']
  },
  {
    id: 'aula_2',
    aula: 'Aula 2',
    tema: 'Produtos reestruturados',
    foco: 'Hambúrguer, kafta e almôndega: liga, gordura, modelagem, rendimento e discussão de textura.',
    produtos: ['prod_hamburguer', 'prod_kafta', 'prod_almondega'],
    categorias: ['reestruturados']
  },
  {
    id: 'aula_3',
    aula: 'Aula 3',
    tema: 'Produtos embutidos frescais',
    foco: 'Linguiça frescal: moagem, mistura, embutimento, calibre, conservação refrigerada e perda por cocção.',
    produtos: ['prod_linguica_frescal'],
    categorias: ['embutidos']
  },
  {
    id: 'aula_4',
    aula: 'Aula 4',
    tema: 'Produtos emulsionados e pastosos',
    foco: 'Patê: processamento fino, estabilidade, espalhabilidade, tratamento térmico e resfriamento.',
    produtos: ['prod_pate'],
    categorias: ['emulsionados']
  },
  {
    id: 'aula_5',
    aula: 'Aula 5',
    tema: 'Produto embutido emulsionado',
    foco: 'Salsicha: emulsão cárnea, envoltório, cozimento, resfriamento e pertencimento a mais de uma categoria.',
    produtos: ['prod_salsicha'],
    categorias: ['embutidos', 'emulsionados']
  },
  {
    id: 'aula_6',
    aula: 'Aula 6',
    tema: 'Produtos marinados e empanados',
    foco: 'Pernil marinado e nuggets: marinada, rendimento, moldagem, empanamento, aderência da cobertura e cocção experimental.',
    produtos: ['prod_pernil_marinado', 'prod_nuggets'],
    categorias: ['marinados', 'empanados']
  },
  {
    id: 'aula_7',
    aula: 'Aula 7',
    tema: 'Produtos curados, cozidos e reestruturados',
    foco: 'Presunto suíno e kibe: salmoura/cura, cocção, fatiabilidade, hidratação de ingredientes e estrutura de massa.',
    produtos: ['prod_presunto_suino', 'prod_kibe'],
    categorias: ['curados_cozidos', 'reestruturados']
  },
  {
    id: 'aula_8',
    aula: 'Aula 8',
    tema: 'Discussão técnica e relatório',
    foco: 'Comparação dos roteiros, ajuste de formulações, interpretação de perdas, parâmetros e referências.',
    produtos: ['prod_hamburguer', 'prod_linguica_frescal', 'prod_pate', 'prod_salsicha', 'prod_pernil_marinado', 'prod_kibe', 'prod_nuggets', 'prod_presunto_suino'],
    categorias: ['reestruturados', 'embutidos', 'emulsionados', 'marinados', 'empanados', 'curados_cozidos']
  }
];

let db = loadDB();
let activePage = 'Inicio';
let selectedIngredientFilter = db.configs.filtroInsumo || 'todos';
let activeProductId = db.configs.produtoSelecionado || '';
let pendingInstallPrompt = null;
let tempProductPhotos = [];
let tempIngredientPhoto = '';
let tempTheoryImages = [];
let formulaDraftItems = [];
let activeProductSlideId = 'visao';
let activeProductReturnPage = 'Produtos';
let activeTheoryLessonIndex = 0;
let activeTheoryImageIndex = 0;
let inlineEditTimer = null;
let modalZIndex = 1000;
let pendingConfirmationAction = null;
let pendingConfirmationText = '';
let productVisibilityDraft = false;
let tempProductReferenceDrafts = [];
let scheduleConfigSnapshot = null;
let activeTheorySlideController = null;
const expandedIntensityItems = new Set();
const theoryImageCache = new Map();
let authState = {
  token: sessionStorage.getItem(SESSION_TOKEN_KEY) || '',
  user: null,
  profile: null,
  permissions: {},
  revision: 0
};
let accessState = { profiles: [], users: [] };
let syncTimer = null;
let syncBusy = false;
let syncMeta = loadSyncMeta();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

window.addEventListener('DOMContentLoaded', init);

async function init() {
  await hydrateTheoryImageCache();
  await migrateEmbeddedTheoryImages();
  setupEvents();
  populateTypeOptions();
  populateProductCategoryOptions();
  if ($('#configAppVersion')) $('#configAppVersion').textContent = `Versão ${APP_VERSION}`;
  renderAll();
  registerServiceWorker();
  await initializeSync();
  applyPermissions();
  updateSyncStatus();
  setTimeout(() => $('#splashScreen')?.classList.add('hide'), 250);
}

function setupEvents() {
  $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => setPage(btn.dataset.page)));
  $$('[data-page-target]').forEach(btn => btn.addEventListener('click', () => setPage(btn.dataset.pageTarget)));
  $$('[data-open-url]').forEach(btn => btn.addEventListener('click', () => window.open(btn.dataset.openUrl, '_blank', 'noopener')));
  $$('[data-action="open-product"]').forEach(btn => btn.addEventListener('click', () => openProductModal()));
  $$('[data-action="open-ingredient"]').forEach(btn => btn.addEventListener('click', () => openIngredientModal()));
  $$('[data-action="open-formula"]').forEach(btn => btn.addEventListener('click', () => openFormulaModal()));
  $$('[data-open-config-modal]').forEach(btn => btn.addEventListener('click', () => {
    const requiredPermission = permissionForConfigModal(btn.dataset.openConfigModal);
    if (requiredPermission && !(requiredPermission === 'advanced' ? canAdvanced() : can(requiredPermission))) return toast('Seu perfil não possui acesso a esta área.');
    if (btn.dataset.openConfigModal === 'modalConfigCronograma') beginScheduleConfigSession();
    closeModal('modalConfig');
    openModal(btn.dataset.openConfigModal);
    if (btn.dataset.openConfigModal === 'modalConfigProdutos') renderConfigProdutos();
    if (btn.dataset.openConfigModal === 'modalConfigInsumos') renderInsumos();
    if (btn.dataset.openConfigModal === 'modalConfigCronograma') renderScheduleConfig();
    if (btn.dataset.openConfigModal === 'modalConfigRegras') renderRulesConfig();
    if (btn.dataset.openConfigModal === 'modalConfigConteudos') renderContentConfig();
    if (btn.dataset.openConfigModal === 'modalConfigAcessos') loadAccessManager();
    if (btn.dataset.openConfigModal === 'modalConfigAvancadas') updateSyncStatus();
  }));
  $$('[data-config-tab]').forEach(btn => btn.addEventListener('click', () => setConfigTab(btn.dataset.configTab)));
  $$('[data-close]').forEach(btn => btn.addEventListener('click', () => {
    if (btn.matches('.modal-close[data-close="modalProduto"]') && $('#produtoId')?.value) {
      saveProductFromModal();
      return;
    }
    const modalId = btn.dataset.close;
    closeModal(modalId);
    if (btn.classList.contains('modal-close') && isConfigManagerModal(modalId)) openModal('modalConfig');
  }));
  $$('[data-toggle]').forEach(btn => btn.addEventListener('click', () => $('#' + btn.dataset.toggle)?.classList.toggle('open')));
  // Modais fecham somente por controles explícitos. Clicar no fundo não descarta o painel aberto.

  $('#searchProdutos')?.addEventListener('input', renderProdutos);
  $('#searchConfigProdutos')?.addEventListener('input', renderConfigProdutos);
  $('#searchInsumos')?.addEventListener('input', renderInsumos);
  $('#btnSalvarProduto')?.addEventListener('click', saveProductFromModal);
  $('#btnExcluirProduto')?.addEventListener('click', deleteProductFromModal);
  $('#btnToggleProdutoVisibilidade')?.addEventListener('click', toggleProductVisibilityDraft);
  $('#produtoFotos')?.addEventListener('change', handleProductPhotos);
  $('#btnNovaReferencia')?.addEventListener('click', addProductReferenceDraft);
  $('#btnVincularReferencia')?.addEventListener('click', linkExistingProductReference);
  $('#produtoReferenciasEditor')?.addEventListener('input', updateProductReferenceDraft);
  $('#produtoReferenciasEditor')?.addEventListener('click', removeProductReferenceDraft);
  $('#btnSalvarInsumo')?.addEventListener('click', saveIngredientFromModal);
  $('#btnExcluirInsumo')?.addEventListener('click', deleteIngredientFromModal);
  $('#insumoFoto')?.addEventListener('change', handleIngredientPhoto);
  $('#insumoTipo')?.addEventListener('change', () => populateSubtypeOptions($('#insumoTipo').value));
  $('#btnSalvarFormula')?.addEventListener('click', saveFormulaFromModal);
  $('#btnExcluirFormula')?.addEventListener('click', deleteFormulaFromModal);
  $('#btnAddFormulaItem')?.addEventListener('click', () => {
    formulaDraftItems.push({ insumoId: formulaEligibleIngredients()[0]?.id || '', percentual: 0 });
    renderFormulaItems();
  });
  $('#formulaPeso')?.addEventListener('input', renderFormulaItems);
  $('#formulaProduto')?.addEventListener('change', () => {
    if (!$('#formulaId')?.value) $('#formulaBaseCalculo').value = defaultFormulaBase(findProduct($('#formulaProduto').value));
    renderFormulaItems();
  });
  $('#formulaBaseCalculo')?.addEventListener('change', renderFormulaItems);
  $('#btnGerarRelatorio')?.addEventListener('click', showFormulaReport);
  $('#btnCopiarRelatorio')?.addEventListener('click', copyReport);
  $('#btnCopiarRoteiro')?.addEventListener('click', copyLesson);
  $('#btnConfig')?.addEventListener('click', () => {
    if (syncEnabled() && !authState.user) return showLogin();
    openModal('modalConfig');
  });
  $('#btnLogout')?.addEventListener('click', logout);
  $('#loginForm')?.addEventListener('submit', handleLogin);
  $('#periodoAtivoSelect')?.addEventListener('change', () => setActivePeriod($('#periodoAtivoSelect').value));
  $('#periodoNome')?.addEventListener('change', () => savePeriodField('nome', $('#periodoNome').value));
  $('#periodoInicio')?.addEventListener('change', () => savePeriodField('inicio', $('#periodoInicio').value));
  $('#periodoFim')?.addEventListener('change', () => savePeriodField('fim', $('#periodoFim').value));
  $('#btnNovoPeriodo')?.addEventListener('click', () => createPeriod(false));
  $('#btnArquivarPeriodo')?.addEventListener('click', archiveActivePeriod);
  $('#btnArquivarNovoPeriodo')?.addEventListener('click', () => createPeriod(true));
  $('#btnAdicionarAula')?.addEventListener('click', addScheduleLesson);
  $('#btnCancelarAulas')?.addEventListener('click', cancelScheduleConfig);
  $('#btnSalvarAulas')?.addEventListener('click', saveScheduleConfig);
  $('#btnNovoConteudo')?.addEventListener('click', () => openTheoryContentModal());
  $('#conteudoModo')?.addEventListener('change', updateTheoryContentMode);
  $('#conteudoImagens')?.addEventListener('change', handleTheoryContentImages);
  $('#btnSalvarConteudo')?.addEventListener('click', saveTheoryContent);
  $('#btnExcluirConteudo')?.addEventListener('click', deleteTheoryContent);
  $('#btnCancelarConfirmacao')?.addEventListener('click', closeConfirmation);
  $('#btnConfirmarAcao')?.addEventListener('click', confirmPendingAction);
  $('#confirmacaoTexto')?.addEventListener('input', updateConfirmationButtonState);
  document.addEventListener('keydown', handleTheoryPresentationKey);
  document.addEventListener('keydown', handleProductWorkspaceKey);
  $('#btnAddRule')?.addEventListener('click', addLabRule);
  $('#btnExportar')?.addEventListener('click', exportData);
  $('#btnImportar')?.addEventListener('click', () => $('#fileImportar').click());
  $('#fileImportar')?.addEventListener('change', importData);
  $('#btnBaixarModelo')?.addEventListener('click', downloadTemplate);
  $('#btnResetDemo')?.addEventListener('click', resetDemo);
  $('#btnConfigurarSync')?.addEventListener('click', openSyncSetup);
  $('#btnSalvarSync')?.addEventListener('click', saveSyncSetup);
  $('#btnSyncPull')?.addEventListener('click', requestRemotePull);
  $('#btnSyncPush')?.addEventListener('click', requestRemotePush);
  $('#btnNovoPerfil')?.addEventListener('click', () => openProfileEditor());
  $('#btnSalvarPerfil')?.addEventListener('click', saveProfile);
  $('#btnExcluirPerfil')?.addEventListener('click', deleteProfile);
  $('#btnNovoUsuario')?.addEventListener('click', () => openUserEditor());
  $('#btnSalvarUsuario')?.addEventListener('click', saveUser);
  $('#btnExcluirUsuario')?.addEventListener('click', deleteUser);

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
    if (!raw) return normalizeDB(clone(DEFAULT_DB));
    return normalizeDB(JSON.parse(raw));
  } catch (err) {
    console.error(err);
    return clone(DEFAULT_DB);
  }
}

function normalizeDB(data) {
  const source = data && typeof data === 'object' ? data : {};
  const resetLegacyBlendDefault = source.version !== APP_VERSION;
  const needsExpandedIngredientDefaults = source.configs?.expandedIngredientDefaultsV1 !== true;
  const merged = Object.assign(clone(DEFAULT_DB), source);
  merged.configs = Object.assign(clone(DEFAULT_DB.configs), source.configs || {});
  merged.configs.regrasLaboratorio = normalizeLabRules(source.configs?.regrasLaboratorio || source.configs?.regras || DEFAULT_RULES);
  merged.configs.conteudosTeoricos = normalizeTheoryContents(source.configs?.conteudosTeoricos || source.conteudosTeoricos, source.configs?.periodos || [])
    .filter(content => !(content.titulo === 'Conteúdo temporário de validação' && content.resumo === 'Resumo de teste'));
  if (merged.configs.filtroInsumo !== 'todos' && !TYPES.some(type => type.value === merged.configs.filtroInsumo)) merged.configs.filtroInsumo = 'todos';
  merged.configs.periodos = normalizeSchedulePeriods(source.configs?.periodos || source.configs?.cronogramaPeriodos, source.configs?.cronograma);
  if (!merged.configs.periodos.some(period => period.id === merged.configs.periodoAtivoId)) {
    merged.configs.periodoAtivoId = (merged.configs.periodos.find(period => !period.arquivado) || merged.configs.periodos[0])?.id || '';
  }
  merged.configs.cronograma = getPeriodById(merged.configs.periodos, merged.configs.periodoAtivoId)?.aulas || normalizeSchedule();
  merged.produtos = mergeDefaults(Array.isArray(source.produtos) ? source.produtos : clone(DEFAULT_DB.produtos), DEFAULT_DB.produtos);
  merged.insumos = mergeDefaults(Array.isArray(source.insumos) ? source.insumos : clone(DEFAULT_DB.insumos), DEFAULT_DB.insumos);
  merged.formulacoes = mergeDefaults(Array.isArray(source.formulacoes) ? source.formulacoes : clone(DEFAULT_DB.formulacoes), DEFAULT_DB.formulacoes);
  merged.legislacoes = mergeDefaults(Array.isArray(source.legislacoes) ? source.legislacoes : clone(DEFAULT_DB.legislacoes), DEFAULT_DB.legislacoes);

  DEFAULT_DB.produtos.forEach(def => {
    const existing = merged.produtos.find(p => p.id === def.id);
    if (existing && (!Array.isArray(existing.fotos) || existing.fotos.length === 0) && def.fotos?.length) existing.fotos = clone(def.fotos);
  });

  merged.produtos.forEach(p => {
    const defaultProduct = DEFAULT_DB.produtos.find(def => def.id === p.id);
    p.categoriaIds = normalizeCategoryIds(p, defaultProduct);
    p.categoriaId = p.categoriaIds[0] || p.categoriaId || inferProductCategoryId(p);
    p.parametros = Object.assign({ gorduraMax: '', proteinaMin: '', carbMax: '', proteinaNaoCarneaMax: '', proibeProteinaNaoCarnea: false, mostrarValidacao: true }, p.parametros || {});
    p.fotos = Array.isArray(p.fotos) ? p.fotos.map(src => IMAGE_MIGRATIONS[src] || src) : [];
    p.fluxo = Array.isArray(p.fluxo) ? p.fluxo : linesFrom(p.fluxo);
    p.pontos = Array.isArray(p.pontos) ? p.pontos : linesFrom(p.pontos);
    p.equipamentos = Array.isArray(p.equipamentos) ? p.equipamentos : (defaultProduct?.equipamentos ? clone(defaultProduct.equipamentos) : linesFrom(p.equipamentos));
    p.perguntas = Array.isArray(p.perguntas) ? p.perguntas : linesFrom(p.perguntas);
    p.oculto = Boolean(p.oculto);
  });
  const legacyCureSalt = merged.insumos.find(i => i.id === 'ing_sal_cura');
  const cureType1 = merged.insumos.find(i => i.id === 'ing_sal_cura_tipo_1');
  if (legacyCureSalt && cureType1) {
    cureType1.custo = toNumber(legacyCureSalt.custo || cureType1.custo);
    cureType1.foto = legacyCureSalt.foto || cureType1.foto || '';
    merged.insumos = merged.insumos.filter(i => i.id !== 'ing_sal_cura');
  }
  merged.insumos.forEach(i => {
    if (i.id === 'ing_pimenta_reino' && ['Pimenta-do-reino', 'Pimenta do reino'].includes(i.nome)) i.nome = 'Pimenta-do-reino preta';
    if (i.id === 'ing_pimenta_branca' && i.nome === 'Pimenta branca') i.nome = 'Pimenta branca moída';
    i.tipo = normalizeIngredientType(i);
    i.subtipo = normalizeIngredientSubtype(i);
    i.categoria = i.categoria || typeLabel(i.tipo);
    i.gordura = toNumber(i.gordura);
    i.proteina = toNumber(i.proteina);
    i.carboidrato = toNumber(i.carboidrato);
    i.custo = toNumber(i.custo);
    i.usadoNaFormulacao = i.usadoNaFormulacao === undefined
      ? i.tipo !== 'envoltorio_apresentacao'
      : i.usadoNaFormulacao !== false;
    i.proteinaNaoCarnea = Boolean(i.proteinaNaoCarnea || isFunctionalProtein(i));
  });
  merged.formulacoes.forEach(f => {
    const product = merged.produtos.find(p => p.id === f.produtoId);
    const hadBaseCalculo = Boolean(f.baseCalculo);
    const defaultFormula = DEFAULT_DB.formulacoes.find(def => def.id === f.id);
    f.nome = cleanFormulaName(f.nome || defaultFormula?.nome || '');
    if (!hadBaseCalculo && defaultFormula && f.id === 'form_hamb_base') {
      f.itens = clone(defaultFormula.itens);
      f.observacoes = defaultFormula.observacoes;
    }
    f.baseCalculo = f.baseCalculo || defaultFormula?.baseCalculo || defaultFormulaBase(product);
    f.pesoReferencia = toNumber(f.pesoReferencia) || 1000;
    f.itens = Array.isArray(f.itens) ? f.itens : [];
    f.itens.forEach(item => {
      if (item.insumoId === 'ing_sal_cura') item.insumoId = 'ing_sal_cura_tipo_1';
      if (ingredientSuggestion(merged.insumos.find(ingredient => ingredient.id === item.insumoId))) item.percentual = roundOneDecimal(item.percentual);
      item.removido = item.removido === true;
      if (item.percentualOriginal === undefined) item.percentualOriginal = toNumber(item.percentual);
      if (isCureSaltId(item.insumoId)) {
        const hasLegacyCure = String(item.cura?.nitritoPct ?? '').trim() !== '' || String(item.cura?.nitratoPct ?? '').trim() !== '';
        item.cura = {
          teorPct: String(item.cura?.teorPct ?? '').trim() !== ''
            ? numberOrBlank(item.cura.teorPct)
            : hasLegacyCure
              ? toNumber(item.cura?.nitritoPct) + toNumber(item.cura?.nitratoPct)
              : DEFAULT_CURE_CONCENTRATION_PCT,
          ppm: String(item.cura?.ppm ?? '').trim() !== '' ? Math.min(CURE_LIMIT_PPM, Math.max(0, toNumber(item.cura.ppm))) : CURE_LIMIT_PPM
        };
        item.percentual = cureSaltPercent(f, item);
      }
    });
    if (f.id === 'form_pernil_marinado_base' && !f.itens.some(item => isCureSaltId(item.insumoId))) {
      f.itens.splice(Math.min(3, f.itens.length), 0, { insumoId: 'ing_sal_cura_tipo_1', percentual: 0.2142857, percentualOriginal: 0.2142857, removido: false, cura: { teorPct: 7, ppm: 150 } });
    }
    if (needsExpandedIngredientDefaults) applyExpandedFormulaDefaults(f);
    f.blendComponentes = normalizeBlendComponents(f.blendComponentes, f, merged.insumos);
    f.materiaPrimaUnica = normalizeSingleMaterial(f.materiaPrimaUnica, f, merged.insumos);
    f.usarBlend = resetLegacyBlendDefault ? false : f.usarBlend === true;
    f.bloqueada = Boolean(f.bloqueada);
    if (String(f.observacoes || '').startsWith('Percentuais calculados sobre')) f.observacoes = '';
  });
  merged.configs.expandedIngredientDefaultsV1 = true;
  merged.legislacoes.forEach(law => {
    law.produtoIds = Array.from(new Set((Array.isArray(law.produtoIds)
      ? law.produtoIds
      : law.produtoId
        ? [law.produtoId]
        : merged.produtos.map(product => product.id)).filter(id => merged.produtos.some(product => product.id === id))));
    law.pontos = (Array.isArray(law.pontos) ? law.pontos : linesFrom(law.pontos)).map(point => String(point)
      .replace(/^Útil para discutir tabela/i, 'Tabela')
      .replace(/^Útil para discutir rotulagem/i, 'Rotulagem')
      .replace(/^Útil para discutir /i, '')
       .replace(/^Útil para conectar /i, 'Relação entre '));
    delete law.produtoId;
  });
  return merged;
}

function mergeDefaults(current, defaults) {
  const list = Array.isArray(current) ? current : [];
  const ids = new Set(list.map(item => item.id));
  defaults.forEach(item => {
    if (!ids.has(item.id)) list.push(clone(item));
  });
  return list;
}

function applyExpandedFormulaDefaults(formula) {
  if (!Array.isArray(formula.itens)) formula.itens = [];
  const ensureItem = (insumoId, percentual, balanceWater = false) => {
    if (formula.itens.some(item => item.insumoId === insumoId)) return;
    formula.itens.push({ insumoId, percentual, percentualOriginal: percentual, removido: false });
    if (balanceWater && formula.baseCalculo === 'produto_final') {
      const water = formula.itens.find(item => item.insumoId === 'ing_agua_gelada' && !item.removido);
      if (water) {
        water.percentual = Math.max(0, toNumber(water.percentual) - percentual);
        water.percentualOriginal = water.percentual;
      }
    }
  };
  if (formula.id === 'form_hamb_base') {
    const dehydratedOnion = formula.itens.find(item => item.insumoId === 'ing_cebola_desidratada');
    if (dehydratedOnion) dehydratedOnion.insumoId = 'ing_cebola_po';
    else ensureItem('ing_cebola_po', 1);
    ensureItem('ing_fumaca_po', 0.2);
  }
  if (formula.id === 'form_linguica_base' || formula.id === 'form_salsicha_base') ensureItem('ing_fumaca_po', 0.2, true);
  if (formula.id === 'form_kibe_base') ensureItem('ing_hortela', 1);
}

function cleanFormulaName(name) {
  return String(name || '').replace(/\s+base$/i, '').trim();
}

function saveDB(options = {}) {
  db.version = APP_VERSION;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    if (!options.skipSync && syncEnabled() && authState.user && hasEditablePermission()) {
      syncMeta.localDirty = true;
      saveSyncMeta();
      scheduleRemoteSave();
      updateSyncStatus();
    }
    return true;
  } catch (err) {
    console.error(err);
    toast('Não foi possível salvar. Remova algumas imagens grandes e tente novamente.');
    return false;
  }
}

function renderAll() {
  renderActivePeriodLabel();
  renderHomeProducts();
  renderProdutos();
  renderConfigProdutos();
  renderInsumos();
  renderCronograma();
  renderScheduleConfig();
  renderContentConfig();
  renderRules();
  renderRulesConfig();
  renderAulas();
  applyPermissions();
}

function setPage(page) {
  const pagePermission = permissionForPage(page);
  if (pagePermission && !can(pagePermission)) return toast('Seu perfil não possui acesso a esta página.');
  activePage = page;
  const topbar = $('.topbar');
  if (topbar) topbar.hidden = page !== 'Inicio';
  if (page !== 'Produtos') $('.content')?.classList.remove('product-mode');
  $$('.page').forEach(p => p.classList.remove('active'));
  $('#page' + page)?.classList.add('active');
  $$('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));
  $('.content').scrollTop = 0;
  if (page === 'Produtos') renderProdutos();
  if (page === 'Cronograma') renderCronograma();
  if (page === 'Aulas') renderAulas();
}

function setConfigTab(tab) {
  $$('.config-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.configTab === tab));
  $$('.config-panel').forEach(panel => panel.classList.remove('active'));
  $('#configPanel' + capitalize(tab))?.classList.add('active');
  if (tab === 'produtos') renderConfigProdutos();
  if (tab === 'insumos') renderInsumos();
  if (tab === 'cronograma') renderScheduleConfig();
}

function loadSyncMeta() {
  try {
    return Object.assign({ initialized: false, localDirty: false, conflict: false, lastSyncAt: 0 }, JSON.parse(localStorage.getItem(SYNC_META_KEY) || '{}'));
  } catch (err) {
    return { initialized: false, localDirty: false, conflict: false, lastSyncAt: 0 };
  }
}

function saveSyncMeta() {
  localStorage.setItem(SYNC_META_KEY, JSON.stringify(syncMeta));
}

function getSyncUrl() {
  return String(localStorage.getItem(SYNC_URL_KEY) || window.PAOA_SYNC_URL || '').trim().replace(/\/+$/, '');
}

function syncEnabled() {
  return /^https:\/\/script\.google\.com\/.+\/exec$/i.test(getSyncUrl());
}

async function initializeSync() {
  if (!syncEnabled()) {
    authState.permissions = permissionMap(true);
    return;
  }
  try {
    const status = await syncRequest('status');
    syncMeta.initialized = status.initialized === true;
    saveSyncMeta();
    if (!status.initialized) {
      authState.permissions = permissionMap(true);
      toast('O servidor está pronto para a configuração inicial.');
      return;
    }
    if (authState.token) {
      try {
        const payload = await syncRequest('pull', {});
        await applySessionPayload(payload);
        return;
      } catch (err) {
        clearSession();
      }
    }
    showLogin();
  } catch (err) {
    authState.permissions = permissionMap(false);
    showLogin('Não foi possível acessar o servidor. Verifique sua conexão e tente novamente.');
  }
}

async function syncRequest(action, payload = {}, urlOverride = '') {
  const url = String(urlOverride || getSyncUrl()).trim().replace(/\/+$/, '');
  if (!url) throw new Error('Informe a URL do Google Apps Script.');
  const body = Object.assign({ action }, payload);
  if (authState.token && !['status', 'login', 'bootstrap'].includes(action)) body.token = authState.token;
  const response = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`Servidor indisponível (${response.status}).`);
  const result = await response.json();
  if (!result.ok && !result.conflict) throw new Error(result.error || 'Não foi possível concluir a operação.');
  return result;
}

function showLogin(message = '') {
  document.body.classList.add('auth-locked');
  $('#loginUsuario').value = localStorage.getItem(LAST_LOGIN_KEY) || '';
  $('#loginSenha').value = '';
  $('#loginError').textContent = message;
  $('#loginError').hidden = !message;
  openModal('modalLogin');
  requestAnimationFrame(() => ($('#loginUsuario').value ? $('#loginSenha') : $('#loginUsuario'))?.focus());
}

async function handleLogin(event) {
  event.preventDefault();
  const login = $('#loginUsuario').value.trim();
  const pin = $('#loginSenha').value;
  const button = $('#btnEntrar');
  $('#loginError').hidden = true;
  if (!/^\d{6}$/.test(pin)) {
    $('#loginError').textContent = 'A senha deve ter exatamente seis dígitos.';
    $('#loginError').hidden = false;
    return;
  }
  button.disabled = true;
  button.textContent = 'Entrando...';
  try {
    const payload = await syncRequest('login', { login, pin });
    authState.token = payload.token;
    sessionStorage.setItem(SESSION_TOKEN_KEY, payload.token);
    localStorage.setItem(LAST_LOGIN_KEY, payload.user.login);
    await applySessionPayload(payload);
    $('#loginSenha').value = '';
    closeModal('modalLogin');
    document.body.classList.remove('auth-locked');
    toast(`Olá, ${payload.user.name}.`);
  } catch (err) {
    $('#loginSenha').value = '';
    $('#loginError').textContent = err.message;
    $('#loginError').hidden = false;
    $('#loginSenha').focus();
  } finally {
    button.disabled = false;
    button.textContent = 'Entrar';
  }
}

async function applySessionPayload(payload) {
  authState.user = payload.user || null;
  authState.profile = payload.profile || null;
  authState.permissions = permissionMap(false, payload.permissions || payload.profile?.permissions || {});
  authState.revision = Number(payload.revision || 0);
  syncMeta.initialized = true;
  syncMeta.conflict = false;
  syncMeta.localDirty = false;
  syncMeta.lastSyncAt = Date.now();
  if (payload.data) await adoptRemoteData(payload.data);
  syncMeta.lastFingerprint = fingerprintData(await buildSyncData());
  saveSyncMeta();
  applyPermissions();
  updateSyncStatus();
}

async function adoptRemoteData(remoteData) {
  const localUi = {
    filtroInsumo: db.configs?.filtroInsumo || 'todos',
    produtoSelecionado: '',
    ultimoProdutoAula: db.configs?.ultimoProdutoAula || ''
  };
  const incoming = clone(remoteData);
  for (const content of incoming.configs?.conteudosTeoricos || []) {
    content.imagens = await Promise.all((content.imagens || []).map(image => String(image).startsWith('data:image/') ? storeTheoryImage(image) : image));
  }
  db = normalizeDB(incoming);
  Object.assign(db.configs, localUi);
  selectedIngredientFilter = db.configs.filtroInsumo || 'todos';
  activeProductId = '';
  saveDB({ skipSync: true });
  await hydrateTheoryImageCache();
  renderAll();
}

async function buildSyncData() {
  const payload = clone(db);
  payload.app_id = 'paoa_lab';
  payload.configs = payload.configs || {};
  delete payload.configs.filtroInsumo;
  delete payload.configs.produtoSelecionado;
  delete payload.configs.ultimoProdutoAula;
  for (const content of payload.configs.conteudosTeoricos || []) {
    content.imagens = (content.imagens || []).map(resolveTheoryImage);
  }
  return payload;
}

function fingerprintData(data) {
  const text = JSON.stringify(data || {});
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${text.length}:${(hash >>> 0).toString(16)}`;
}

function scheduleRemoteSave() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => pushRemoteData().catch(err => console.warn('Sincronização pendente', err)), SYNC_DEBOUNCE_MS);
}

async function pushRemoteData(force = false) {
  if (syncBusy || !syncEnabled() || !authState.user || !hasEditablePermission()) return false;
  syncBusy = true;
  updateSyncStatus('Enviando alterações...');
  try {
    const syncData = await buildSyncData();
    const fingerprint = fingerprintData(syncData);
    if (!force && fingerprint === syncMeta.lastFingerprint) {
      syncMeta.localDirty = false;
      saveSyncMeta();
      return true;
    }
    const result = await syncRequest('save', { data: syncData, baseRevision: authState.revision, force });
    if (result.conflict) {
      syncMeta.conflict = true;
      syncMeta.localDirty = true;
      saveSyncMeta();
      toast('Há uma versão mais recente no servidor. A sincronização foi pausada.');
      return false;
    }
    authState.revision = Number(result.revision || authState.revision);
    syncMeta.localDirty = false;
    syncMeta.conflict = false;
    syncMeta.lastSyncAt = Date.now();
    syncMeta.lastFingerprint = fingerprint;
    saveSyncMeta();
    return true;
  } finally {
    syncBusy = false;
    updateSyncStatus();
  }
}

async function pullRemoteData() {
  if (!syncEnabled() || !authState.user) return false;
  syncBusy = true;
  updateSyncStatus('Baixando dados...');
  try {
    const payload = await syncRequest('pull');
    await applySessionPayload(payload);
    toast('Dados atualizados pelo servidor.');
    return true;
  } finally {
    syncBusy = false;
    updateSyncStatus();
  }
}

function requestRemotePull() {
  if (!authState.user) return showLogin();
  const run = () => pullRemoteData().catch(err => toast(err.message));
  if (!syncMeta.localDirty) return run();
  openConfirmation({
    title: 'Baixar dados do servidor',
    message: 'As alterações locais ainda não enviadas serão descartadas.',
    confirmLabel: 'Baixar e substituir',
    action: run
  });
}

function requestRemotePush() {
  if (!can('manage.sync')) return toast('Seu perfil não pode forçar a sincronização.');
  openConfirmation({
    title: 'Enviar dados ao servidor',
    message: 'Esta ação substituirá as áreas permitidas mesmo se outro dispositivo tiver enviado uma versão mais recente.',
    confirmLabel: 'Enviar mesmo assim',
    action: () => pushRemoteData(true).then(ok => ok && toast('Dados enviados ao servidor.')).catch(err => toast(err.message))
  });
}

async function logout() {
  if (authState.token) syncRequest('logout').catch(() => {});
  clearSession();
  closeModal('modalConfig');
  showLogin();
}

function clearSession() {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  authState = { token: '', user: null, profile: null, permissions: permissionMap(false), revision: 0 };
  applyPermissions();
}

function permissionMap(value, source = {}) {
  const result = {};
  PERMISSION_DEFS.forEach(item => result[item.key] = Object.prototype.hasOwnProperty.call(source, item.key) ? source[item.key] === true : value === true);
  return result;
}

function can(permission) {
  if (!syncEnabled() || !syncMeta.initialized) return true;
  return authState.permissions?.[permission] === true;
}

function requirePermission(permission, message = 'Seu perfil não possui permissão para esta ação.') {
  if (can(permission)) return true;
  toast(message);
  return false;
}

function canEditFormula() {
  return can('formula.use') || can('manage.formulas');
}

function hasEditablePermission() {
  return ['formula.use', 'manage.products', 'manage.ingredients', 'manage.formulas', 'manage.contents', 'manage.schedule', 'manage.rules', 'data.import', 'data.reset'].some(can);
}

function permissionForPage(page) {
  return ({ Inicio: 'view.home', Aulas: 'view.aulas', Produtos: 'view.produtos', Cronograma: 'view.cronograma', Regras: 'view.regras' })[page] || '';
}

function permissionForConfigModal(id) {
  return ({
    modalConfigProdutos: 'manage.products',
    modalConfigInsumos: 'manage.ingredients',
    modalConfigConteudos: 'manage.contents',
    modalConfigCronograma: 'manage.schedule',
    modalConfigRegras: 'manage.rules',
    modalConfigAcessos: 'manage.access',
    modalConfigAvancadas: 'advanced'
  })[id] || '';
}

function isConfigManagerModal(id) {
  return ['modalConfigProdutos', 'modalConfigInsumos', 'modalConfigConteudos', 'modalConfigCronograma', 'modalConfigRegras', 'modalConfigAcessos', 'modalConfigAvancadas'].includes(id);
}

function canAdvanced() {
  return ['manage.sync', 'data.export', 'data.import', 'data.reset'].some(can);
}

function applyPermissions() {
  const pageTargets = { Inicio: 'view.home', Aulas: 'view.aulas', Produtos: 'view.produtos', Cronograma: 'view.cronograma', Regras: 'view.regras' };
  $$('.nav-btn[data-page], [data-page-target]').forEach(el => {
    const page = el.dataset.page || el.dataset.pageTarget;
    el.hidden = Boolean(pageTargets[page]) && !can(pageTargets[page]);
  });
  const configPermissions = {
    modalConfigProdutos: 'manage.products', modalConfigInsumos: 'manage.ingredients', modalConfigConteudos: 'manage.contents',
    modalConfigCronograma: 'manage.schedule', modalConfigRegras: 'manage.rules', modalConfigAcessos: 'manage.access', modalConfigAvancadas: 'advanced'
  };
  $$('[data-open-config-modal]').forEach(el => {
    const permission = configPermissions[el.dataset.openConfigModal];
    el.hidden = el.dataset.openConfigModal === 'modalConfigAcessos' && !syncMeta.initialized
      ? true
      : permission === 'advanced' ? !canAdvanced() : !can(permission);
  });
  const hasConfigAccess = Object.values(configPermissions).some(permission => permission === 'advanced' ? canAdvanced() : can(permission));
  if ($('#btnConfig')) $('#btnConfig').hidden = syncEnabled() && syncMeta.initialized && !hasConfigAccess;
  if ($('#btnLogout')) $('#btnLogout').hidden = !authState.user;
  if ($('#sessionBadge')) {
    $('#sessionBadge').hidden = !authState.user;
    $('#sessionBadge').textContent = authState.user ? `${authState.user.name} · ${authState.profile?.name || ''}` : '';
  }
  if ($('#btnExportar')) $('#btnExportar').hidden = !can('data.export');
  if ($('#btnImportar')) $('#btnImportar').hidden = !can('data.import');
  if ($('#btnBaixarModelo')) $('#btnBaixarModelo').hidden = !can('data.export');
  if ($('#btnResetDemo')) $('#btnResetDemo').hidden = !can('data.reset');
  if ($('#btnConfigurarSync')) $('#btnConfigurarSync').hidden = !can('manage.sync');
  if ($('#btnSyncPush')) $('#btnSyncPush').hidden = !can('manage.sync') || !syncEnabled();
  if ($('#btnSyncPull')) $('#btnSyncPull').hidden = !syncEnabled() || !authState.user;
  document.body.classList.toggle('formula-readonly', !can('formula.use') && !can('manage.formulas'));
  enforceFormulaReadOnly();
  if (permissionForPage(activePage) && !can(permissionForPage(activePage))) {
    const fallback = Object.keys(pageTargets).find(page => can(pageTargets[page]));
    if (fallback) setPage(fallback);
  }
}

function enforceFormulaReadOnly() {
  const locked = document.body.classList.contains('formula-readonly');
  $$('.inline-formula-row input, .inline-formula-row select, .blend-editor input, .blend-editor select, .single-component input, .single-component select').forEach(control => {
    if (locked && !control.disabled) {
      control.dataset.permissionDisabled = 'true';
      control.disabled = true;
    } else if (!locked && control.dataset.permissionDisabled === 'true') {
      delete control.dataset.permissionDisabled;
      control.disabled = false;
    }
  });
}

function updateSyncStatus(temporaryText = '') {
  const title = $('#syncStatusTitle');
  const detail = $('#syncStatusDetail');
  const card = $('#syncStatusCard');
  if (!title || !detail || !card) return;
  card.classList.toggle('connected', syncEnabled() && Boolean(authState.user));
  card.classList.toggle('conflict', syncMeta.conflict === true);
  if (!syncEnabled()) {
    title.textContent = 'Modo local';
    detail.textContent = 'Sincronização ainda não configurada';
  } else if (temporaryText) {
    title.textContent = 'Sincronizando';
    detail.textContent = temporaryText;
  } else if (syncMeta.conflict) {
    title.textContent = 'Conflito de versões';
    detail.textContent = 'Escolha baixar o servidor ou forçar o envio local';
  } else if (!authState.user) {
    title.textContent = syncMeta.initialized ? 'Aguardando login' : 'Servidor não inicializado';
    detail.textContent = getSyncUrl();
  } else {
    title.textContent = syncMeta.localDirty ? 'Alterações pendentes' : 'Sincronizado';
    detail.textContent = syncMeta.lastSyncAt ? `Última sincronização: ${new Date(syncMeta.lastSyncAt).toLocaleString('pt-BR')}` : getSyncUrl();
  }
  if ($('#syncStatusText')) $('#syncStatusText').textContent = syncEnabled()
    ? 'Os dados locais são mantidos para uso offline e sincronizados com o Google Apps Script.'
    : 'Os dados ficam salvos neste navegador. Conecte o Google Apps Script para sincronizar os dispositivos.';
}

function openSyncSetup() {
  if (!can('manage.sync')) return toast('Seu perfil não pode configurar a sincronização.');
  $('#syncUrl').value = getSyncUrl();
  $('#syncBootstrapKey').value = '';
  $('#syncAdminPin').value = '';
  $('#syncStudentPin').value = '';
  $('#syncSetupError').hidden = true;
  $('#bootstrapFields').hidden = syncMeta.initialized === true;
  $('#btnSalvarSync').textContent = syncMeta.initialized ? 'Salvar URL' : 'Conectar';
  openModal('modalConfigurarSync');
}

async function saveSyncSetup() {
  const url = $('#syncUrl').value.trim().replace(/\/+$/, '');
  const error = $('#syncSetupError');
  const button = $('#btnSalvarSync');
  error.hidden = true;
  if (!/^https:\/\/script\.google\.com\/.+\/exec$/i.test(url)) {
    error.textContent = 'Use a URL de implantação do Apps Script terminada em /exec.';
    error.hidden = false;
    return;
  }
  button.disabled = true;
  button.textContent = 'Conectando...';
  try {
    const status = await syncRequest('status', {}, url);
    if (!status.initialized) {
      const adminPin = $('#syncAdminPin').value;
      const studentPin = $('#syncStudentPin').value;
      if (!/^\d{6}$/.test(adminPin) || !/^\d{6}$/.test(studentPin)) throw new Error('As duas senhas devem ter exatamente seis dígitos.');
      await syncRequest('bootstrap', {
        bootstrapKey: $('#syncBootstrapKey').value.trim(),
        adminName: $('#syncAdminName').value.trim(),
        adminLogin: $('#syncAdminLogin').value.trim(),
        adminPin,
        studentName: $('#syncStudentName').value.trim(),
        studentLogin: $('#syncStudentLogin').value.trim(),
        studentPin,
        data: await buildSyncData()
      }, url);
      localStorage.setItem(LAST_LOGIN_KEY, $('#syncAdminLogin').value.trim().toLowerCase());
      syncMeta.initialized = true;
      toast('Servidor configurado. Entre com o perfil administrador.');
    } else {
      syncMeta.initialized = true;
      toast('Endereço de sincronização salvo.');
    }
    localStorage.setItem(SYNC_URL_KEY, url);
    syncMeta.localDirty = false;
    syncMeta.conflict = false;
    saveSyncMeta();
    clearSession();
    $('#syncBootstrapKey').value = '';
    $('#syncAdminPin').value = '';
    $('#syncStudentPin').value = '';
    closeModal('modalConfigurarSync');
    closeModal('modalConfigAvancadas');
    showLogin();
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
  } finally {
    button.disabled = false;
    button.textContent = syncMeta.initialized ? 'Salvar URL' : 'Conectar';
  }
}

async function loadAccessManager() {
  if (!can('manage.access')) return;
  const rootProfiles = $('#accessProfilesList');
  const rootUsers = $('#accessUsersList');
  rootProfiles.innerHTML = '<p class="muted">Carregando perfis...</p>';
  rootUsers.innerHTML = '<p class="muted">Carregando usuários...</p>';
  try {
    const result = await syncRequest('list_access');
    accessState = { profiles: result.profiles || [], users: result.users || [] };
    renderAccessManager();
  } catch (err) {
    rootProfiles.innerHTML = `<p class="form-error">${escapeHTML(err.message)}</p>`;
    rootUsers.innerHTML = '';
  }
}

function renderAccessManager() {
  const profiles = $('#accessProfilesList');
  const users = $('#accessUsersList');
  if (!profiles || !users) return;
  profiles.innerHTML = accessState.profiles.map(profile => {
    const enabled = Object.values(profile.permissions || {}).filter(Boolean).length;
    return `<button type="button" class="access-list-card" data-profile-id="${escapeAttr(profile.id)}"><span><strong>${escapeHTML(profile.name)}</strong><small>${enabled} permissões${profile.system ? ' · perfil principal' : ''}</small></span><b>›</b></button>`;
  }).join('') || emptyHTML('Nenhum perfil cadastrado.');
  users.innerHTML = accessState.users.map(user => {
    const profile = accessState.profiles.find(item => item.id === user.profileId);
    return `<button type="button" class="access-list-card${user.active === false ? ' inactive' : ''}" data-user-id="${escapeAttr(user.id)}"><span><strong>${escapeHTML(user.name || user.login)}</strong><small>${escapeHTML(user.login)} · ${escapeHTML(profile?.name || 'Sem perfil')}${user.active === false ? ' · inativo' : ''}</small></span><b>›</b></button>`;
  }).join('') || emptyHTML('Nenhum usuário cadastrado.');
  profiles.querySelectorAll('[data-profile-id]').forEach(button => button.addEventListener('click', () => openProfileEditor(button.dataset.profileId)));
  users.querySelectorAll('[data-user-id]').forEach(button => button.addEventListener('click', () => openUserEditor(button.dataset.userId)));
}

function openProfileEditor(id = '') {
  const profile = accessState.profiles.find(item => item.id === id) || { id: '', name: '', permissions: permissionMap(false), system: false };
  $('#perfilId').value = profile.id;
  $('#perfilNome').value = profile.name;
  $('#btnExcluirPerfil').hidden = !profile.id || profile.system === true;
  const groups = Array.from(new Set(PERMISSION_DEFS.map(item => item.group)));
  $('#perfilPermissoes').innerHTML = groups.map(group => `<fieldset><legend>${escapeHTML(group)}</legend>${PERMISSION_DEFS.filter(item => item.group === group).map(item => `<label class="permission-option"><input type="checkbox" data-permission-key="${escapeAttr(item.key)}" ${profile.permissions?.[item.key] ? 'checked' : ''} /><span>${escapeHTML(item.label)}</span></label>`).join('')}</fieldset>`).join('');
  openModal('modalPerfilEditor');
}

async function saveProfile() {
  const button = $('#btnSalvarPerfil');
  const profile = {
    id: $('#perfilId').value,
    name: $('#perfilNome').value.trim(),
    permissions: {}
  };
  $$('[data-permission-key]').forEach(input => profile.permissions[input.dataset.permissionKey] = input.checked);
  button.disabled = true;
  try {
    const result = await syncRequest('save_profile', { profile });
    accessState = { profiles: result.profiles || [], users: result.users || [] };
    renderAccessManager();
    closeModal('modalPerfilEditor');
    toast('Perfil salvo.');
  } catch (err) {
    toast(err.message);
  } finally {
    button.disabled = false;
  }
}

function deleteProfile() {
  const id = $('#perfilId').value;
  const profile = accessState.profiles.find(item => item.id === id);
  if (!profile) return;
  openConfirmation({
    title: 'Excluir perfil', message: `Excluir o perfil “${profile.name}”?`, confirmLabel: 'Excluir perfil',
    action: async () => {
      try {
        const result = await syncRequest('delete_profile', { profileId: id });
        accessState = { profiles: result.profiles || [], users: result.users || [] };
        renderAccessManager();
        closeModal('modalPerfilEditor');
        toast('Perfil excluído.');
      } catch (err) { toast(err.message); }
    }
  });
}

function openUserEditor(id = '') {
  const user = accessState.users.find(item => item.id === id) || { id: '', name: '', login: '', profileId: accessState.profiles[0]?.id || '', active: true };
  $('#usuarioId').value = user.id;
  $('#usuarioNome').value = user.name;
  $('#usuarioLogin').value = user.login;
  $('#usuarioPin').value = '';
  $('#usuarioAtivo').checked = user.active !== false;
  $('#usuarioPerfil').innerHTML = accessState.profiles.map(profile => `<option value="${escapeAttr(profile.id)}">${escapeHTML(profile.name)}</option>`).join('');
  $('#usuarioPerfil').value = user.profileId;
  $('#btnExcluirUsuario').hidden = !user.id || user.id === authState.user?.id;
  openModal('modalUsuarioEditor');
}

async function saveUser() {
  const button = $('#btnSalvarUsuario');
  const user = {
    id: $('#usuarioId').value,
    name: $('#usuarioNome').value.trim(),
    login: $('#usuarioLogin').value.trim(),
    pin: $('#usuarioPin').value,
    profileId: $('#usuarioPerfil').value,
    active: $('#usuarioAtivo').checked
  };
  if (!user.id && !/^\d{6}$/.test(user.pin)) return toast('Defina uma senha de seis dígitos para o novo usuário.');
  if (user.pin && !/^\d{6}$/.test(user.pin)) return toast('A senha deve ter exatamente seis dígitos.');
  button.disabled = true;
  try {
    const result = await syncRequest('save_user', { user });
    accessState = { profiles: result.profiles || [], users: result.users || [] };
    renderAccessManager();
    $('#usuarioPin').value = '';
    closeModal('modalUsuarioEditor');
    toast('Usuário salvo.');
  } catch (err) {
    toast(err.message);
  } finally {
    button.disabled = false;
  }
}

function deleteUser() {
  const id = $('#usuarioId').value;
  const user = accessState.users.find(item => item.id === id);
  if (!user) return;
  openConfirmation({
    title: 'Excluir usuário', message: `Excluir o acesso de “${user.login}”?`, confirmLabel: 'Excluir usuário',
    action: async () => {
      try {
        const result = await syncRequest('delete_user', { userId: id });
        accessState = { profiles: result.profiles || [], users: result.users || [] };
        renderAccessManager();
        closeModal('modalUsuarioEditor');
        toast('Usuário excluído.');
      } catch (err) { toast(err.message); }
    }
  });
}

function renderActivePeriodLabel() {
  const el = $('#activePeriodLabel');
  if (!el) return;
  const period = getActivePeriod();
  el.textContent = period?.nome ? `Período ${period.nome}` : '';
}

function renderHomeProducts() {
  const root = $('#homeProductCards');
  if (!root) return;
  root.innerHTML = visibleProducts().map(productCardHTML).join('') || emptyHTML('Nenhum produto cadastrado.');
  root.querySelectorAll('[data-product-card]').forEach(card => card.addEventListener('click', () => {
    openProductWorkspace(card.dataset.productCard);
  }));
}

function productCardHTML(p) {
  const categoryLabel = productCategoryLabel(p);
  const photo = p.fotos?.[0] || '';
  const mediaStyle = photo ? ` style="background-image: url('${escapeAttr(photo)}')"` : '';
  const mediaText = photo ? '' : escapeHTML((p.nome || '?').slice(0, 1).toUpperCase());
  return `
    <button type="button" class="product-tile" data-product-card="${escapeAttr(p.id)}">
      <div class="product-tile-media"${mediaStyle}>${mediaText}</div>
      <div class="product-tile-body">
        <div class="product-tile-title">${escapeHTML(p.nome)}</div>
        <div class="product-tile-subtitle">${escapeHTML(categoryLabel)}</div>
      </div>
    </button>`;
}

function renderProdutos() {
  const overview = $('#produtosOverview');
  const workspace = $('#produtoWorkspace');
  const selected = activeProductId ? findProduct(activeProductId) : null;
  const visibleSelected = selected && !selected.oculto ? selected : null;
  $('.content')?.classList.toggle('product-mode', Boolean(visibleSelected && !($('#searchProdutos')?.value || '').trim()));
  if (visibleSelected && !($('#searchProdutos')?.value || '').trim()) {
    overview.hidden = true;
    workspace.hidden = false;
    workspace.innerHTML = productWorkspaceHTML(visibleSelected);
    bindProductWorkspace(workspace);
    enforceFormulaReadOnly();
    return;
  }
  overview.hidden = false;
  workspace.hidden = true;
  if (activeProductId && (!selected || selected.oculto)) activeProductId = '';
  const term = ($('#searchProdutos')?.value || '').toLowerCase().trim();
  const produtos = visibleProducts().filter(p => [p.nome, p.categoria, p.especie, p.descricao].join(' ').toLowerCase().includes(term));
  $('#produtosList').innerHTML = produtos.map(productListHTML).join('') || emptyHTML('Nenhum produto encontrado.');
  $('#produtosList').querySelectorAll('[data-open-product]').forEach(el => el.addEventListener('click', () => openProductWorkspace(el.dataset.openProduct)));
}

function productListHTML(p) {
  const categoryLabel = productCategoryLabel(p);
  return `
    <button type="button" class="item-card" data-open-product="${escapeAttr(p.id)}">
      <div class="item-avatar">${photoOrInitial(p)}</div>
      <div>
        <div class="item-title">${escapeHTML(p.nome)}</div>
        <div class="item-subtitle">${escapeHTML(categoryLabel || p.categoria || 'Sem categoria')}</div>
      </div>
    </button>`;
}

function renderConfigProdutos() {
  const root = $('#configProdutosList');
  if (!root) return;
  const term = ($('#searchConfigProdutos')?.value || '').toLowerCase().trim();
  const produtos = db.produtos.filter(p => [p.nome, p.categoria, p.especie, p.descricao].join(' ').toLowerCase().includes(term));
  root.innerHTML = produtos.map(productConfigHTML).join('') || emptyHTML('Nenhum produto encontrado.');
  root.querySelectorAll('[data-config-edit-product]').forEach(btn => btn.addEventListener('click', () => openProductModal(btn.dataset.configEditProduct)));
}

function productConfigHTML(p) {
  return `
    <button type="button" class="item-card" data-config-edit-product="${escapeAttr(p.id)}">
      <div class="item-avatar">${photoOrInitial(p)}</div>
      <div>
        <div class="item-title">${escapeHTML(p.nome)}</div>
        <div class="item-subtitle">${escapeHTML(productCategoryLabel(p))}</div>
        ${p.oculto ? '<div class="item-meta"><span class="badge warn">Oculto para alunos</span></div>' : ''}
      </div>
    </button>`;
}

function openProductWorkspace(id, returnPage = activePage) {
  const product = findProduct(id);
  if (!product || product.oculto) return;
  activeProductId = id;
  activeProductSlideId = 'visao';
  activeProductReturnPage = returnPage || activePage || 'Produtos';
  db.configs.produtoSelecionado = id;
  db.configs.ultimoProdutoAula = id;
  saveDB();
  if ($('#searchProdutos')) $('#searchProdutos').value = '';
  closeModal('modalConteudoView');
  closeModal('modalInsumoView');
  setPage('Produtos');
  renderProdutos();
}

function closeProductWorkspace() {
  const returnPage = activeProductReturnPage || 'Produtos';
  activeProductId = '';
  activeProductSlideId = 'visao';
  db.configs.produtoSelecionado = '';
  saveDB();
  $('.content')?.classList.remove('product-mode');
  if (returnPage === 'Produtos') renderProdutos();
  else {
    const workspace = $('#produtoWorkspace');
    const overview = $('#produtosOverview');
    if (workspace) workspace.hidden = true;
    if (overview) overview.hidden = false;
    setPage(returnPage);
  }
  toast('Produto salvo.');
}

function productWorkspaceHTML(p) {
  const formulas = db.formulacoes.filter(f => f.produtoId === p.id);
  const laws = uniqueProductLaws(p.id);
  const categoryLabel = productCategoryLabel(p);
  const photo = p.fotos?.[0] || '';
  const mediaStyle = photo ? ` style="background-image: url('${escapeAttr(photo)}')"` : '';
  const mediaText = photo ? '' : escapeHTML((p.nome || '?').slice(0, 1).toUpperCase());
  const slides = [
    { id: 'visao', label: 'Visão geral' },
    { id: 'fluxo', label: 'Fluxograma' },
    { id: 'controle', label: 'Pontos de controle' },
    { id: 'equipamentos', label: 'Equipamentos' },
    { id: 'formulas', label: 'Formulação do Produto' },
    { id: 'discussao', label: 'Discussão da prática' },
    { id: 'referencias', label: 'Referências' }
  ];
  return `
    <div class="product-slide-deck" data-slide-deck>
      <aside class="product-slide-summary">
        <div class="slide-controls">
          <button type="button" class="back-btn product-back-icon" data-product-back title="Fechar roteiro" aria-label="Fechar roteiro">✕</button>
          <button type="button" class="secondary-btn compact slide-arrow" data-slide-prev aria-label="Slide anterior">➜</button>
          <div class="slide-position" data-slide-position>1 / ${slides.length}</div>
          <button type="button" class="primary-btn compact slide-arrow" data-slide-next aria-label="Próximo slide">➜</button>
        </div>
        <span class="summary-divider" aria-hidden="true"></span>
        <div class="product-slide-summary-scroll">
          ${slides.map((slide, index) => `<button type="button" class="slide-jump ${index === 0 ? 'active' : ''}" data-product-slide="${escapeAttr(slide.id)}"><span>${index + 1}</span><b>${escapeHTML(slide.label)}</b></button>`).join('')}
        </div>
      </aside>

      <div class="product-slide-stage">
        <section class="product-slide active" data-slide-panel="visao">
          <div class="product-detail-hero">
            <div class="product-detail-media"${mediaStyle}>${mediaText}</div>
            <div class="product-detail-copy">
              <div class="hero-label">Roteiro de aula prática</div>
              <h2>${escapeHTML(p.nome)}</h2>
              <div class="category-callout">
                <span>Categoria do produto</span>
                <strong>${escapeHTML(categoryLabel)}</strong>
              </div>
              <p>${escapeHTML(p.objetivo || p.descricao || 'Produto cadastrado para a disciplina.')}</p>
            </div>
          </div>
        </section>

        <section class="product-slide" data-slide-panel="fluxo">
          <div class="slide-card">
            ${slideHeadingHTML('Fluxograma', p.nome)}
            <div class="timeline-list">${timelineHTML(p.fluxo)}</div>
          </div>
        </section>

        <section class="product-slide" data-slide-panel="controle">
          <div class="slide-card">
            ${slideHeadingHTML('Pontos de controle')}
            <div class="control-grid">${(p.pontos || []).map(point => `<div class="control-point">${escapeHTML(point)}</div>`).join('')}</div>
          </div>
        </section>

        <section class="product-slide" data-slide-panel="equipamentos">
          <div class="slide-card">
            ${slideHeadingHTML('Equipamentos')}
            <div class="equipment-grid">${equipmentHTML(p.equipamentos)}</div>
          </div>
        </section>

        <section class="product-slide" data-slide-panel="formulas">
          <div class="formula-slide-card">
            <div class="formula-work-list">
              ${formulas.map(productFormulaHTML).join('') || emptyHTML('Nenhuma formulação cadastrada para este produto.')}
            </div>
          </div>
        </section>

        <section class="product-slide" data-slide-panel="discussao">
          <div class="slide-card">
            ${slideHeadingHTML('Discussão da prática')}
            <div class="discussion-list">${(p.perguntas || []).map((question, index) => `<div class="discussion-question"><span>${index + 1}</span>${escapeHTML(question)}</div>`).join('')}</div>
          </div>
        </section>

        <section class="product-slide" data-slide-panel="referencias">
          <div class="slide-card">
            <div class="slide-title-row">
              ${slideHeadingHTML('Referências')}
              <button type="button" class="secondary-btn compact" data-edit-product-references>Editar referências</button>
            </div>
            <div class="stack-list law-list">${laws.map(lawCardHTML).join('') || emptyHTML('Nenhuma referência vinculada.')}</div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function slideHeadingHTML(label, productName = '') {
  return `<h3 class="slide-heading"><span>${escapeHTML(label)}${productName ? ':' : ''}</span>${productName ? ` <strong>${escapeHTML(productName)}</strong>` : ''}</h3>`;
}

function productFormulaHTML(f) {
  const analysis = analyzeFormula(f);
  const blendState = formulaBlendState(f);
  return `
    <div class="formula-work-card ${f.bloqueada ? 'formula-locked' : ''}" data-formula-card="${escapeAttr(f.id)}">
      <div class="formula-work-head">
        <h3><span>Formulação:</span> <strong>${escapeHTML(cleanFormulaName(f.nome))}</strong></h3>
        <div class="formula-head-actions">
          <button type="button" class="formula-lock-btn ${f.bloqueada ? 'locked' : ''}" data-toggle-formula-lock="${escapeAttr(f.id)}" title="${f.bloqueada ? 'Destravar formulação' : 'Travar formulação'}">${f.bloqueada ? '🔒' : '🔓'}</button>
        </div>
      </div>
      ${blendEditorHTML(f, blendState)}
      ${inlineFormulaEditorHTML(f)}
      <div class="formula-analysis-wrap">${analysisHTML(analysis)}</div>
      <div class="product-action-row">
        <button type="button" class="secondary-btn compact" data-report-formula="${escapeAttr(f.id)}">Relatório</button>
      </div>
    </div>`;
}

function blendToggleButtonHTML(f, state = formulaBlendState(f)) {
  const disabled = f.bloqueada ? ' disabled' : '';
  return `<button type="button" class="blend-toggle-button ${state.useBlend ? 'active' : ''}" data-toggle-blend-button="${escapeAttr(f.id)}" aria-pressed="${state.useBlend}" title="${state.useBlend ? 'Desativar blend' : 'Ativar blend'}"${disabled}>
    <strong>Blend</strong><span class="switch-visual"><i></i></span>
  </button>`;
}

function blendEditorHTML(f, state = formulaBlendState(f)) {
  const firstComponent = state.useBlend ? state.components[0] : state.singleComponent;
  const secondComponent = state.components[1] || defaultSecondBlendComponent(f, state);
  return `<div class="blend-editor">
    <div class="blend-editor-head">
      <div class="blend-editor-title">
        <span>Matéria-prima cárnea</span>
        ${blendToggleButtonHTML(f, state)}
      </div>
    </div>
    <div class="blend-components">
        ${blendComponentHTML(f, firstComponent, 0, { locked: f.bloqueada, label: state.useBlend ? 'Matéria-prima 1' : 'Matéria-prima', single: !state.useBlend })}
        ${state.useBlend ? blendComponentHTML(f, secondComponent, 1, { locked: f.bloqueada, label: 'Matéria-prima 2' }) : ''}
        <div class="blend-result-metrics">
          <div><small>${state.useBlend ? 'Peso do blend' : 'Peso da matéria-prima'}</small><strong>${fmt(state.blendGrams)} g</strong></div>
          <div><small>Gordura estimada</small><strong>${fmt(state.fatPct)}%</strong></div>
        </div>
    </div>
  </div>`;
}

function blendComponentHTML(formula, component, index, options = {}) {
  const fat = blendComponentFat(component);
  const source = blendComponentSourceHTML(component);
  const cut = MEAT_CUTS.find(item => item.id === component.corteId) || MEAT_CUTS[MEAT_CUTS.length - 1];
  const hasReferenceData = blendComponentHasReferenceData(component);
  const disabled = options.locked ? ' disabled' : '';
  const cutAttr = options.single ? `data-single-cut="${escapeAttr(formula.id)}"` : `data-blend-cut="${escapeAttr(formula.id)}" data-blend-index="${index}"`;
  const profileAttr = options.single ? `data-single-profile="${escapeAttr(formula.id)}"` : `data-blend-profile="${escapeAttr(formula.id)}" data-blend-index="${index}"`;
  const gramsAttr = options.single ? `data-single-grams="${escapeAttr(formula.id)}"` : `data-blend-grams="${escapeAttr(formula.id)}" data-blend-index="${index}"`;
  const fatAttr = options.single ? `data-single-fat="${escapeAttr(formula.id)}"` : `data-blend-fat="${escapeAttr(formula.id)}" data-blend-index="${index}"`;
  return `<div class="blend-component-row ${options.single ? 'single-component' : ''}">
    <div class="blend-component-main">
      <div class="form-group">
        <label>${escapeHTML(options.label || 'Matéria-prima')}</label>
        <select ${cutAttr}${disabled}>
          ${MEAT_CUTS.map(cut => `<option value="${escapeAttr(cut.id)}" ${cut.id === component.corteId ? 'selected' : ''}>${escapeHTML(cut.nome)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Perfil</label>
        <select ${profileAttr}${disabled}>
          ${meatProfileOptionsHTML(cut, component.perfil)}
        </select>
      </div>
      <div class="form-group ${options.single ? 'single-meat-weight' : ''}">
        <label>Peso (g)</label>
        <input type="number" min="${options.single ? '1' : '0'}" step="1" value="${escapeAttr(fmtInput(component.gramas))}" ${gramsAttr}${disabled}>
      </div>
      <div class="form-group">
        <label>Gordura (%)</label>
        <input class="${hasReferenceData ? '' : 'missing-reference-value'}" type="number" min="0" max="100" step="0.1" value="${escapeAttr(hasReferenceData ? fmtInput(fat) : '0.0')}" ${fatAttr}${disabled}>
      </div>
    </div>
    <small class="${hasReferenceData ? '' : 'missing-reference-note'}">${source}</small>
  </div>`;
}

function meatProfileOptionsHTML(cut, selected) {
  const profiles = [
    { value: 'com_gordura', label: 'Com gordura', available: cut.comGordura !== null && cut.comGordura !== undefined },
    { value: 'sem_gordura', label: 'Sem gordura', available: cut.semGordura !== null && cut.semGordura !== undefined }
  ];
  return profiles.map(profile => `<option value="${profile.value}" ${profile.value === selected ? 'selected' : ''}>${profile.label}</option>`).join('');
}

function inlineFormulaEditorHTML(f) {
  const editableItems = (f.itens || []).filter(item => !isBlendItem(item.insumoId, f));
  const available = db.insumos.filter(ingredient =>
    ingredient.usadoNaFormulacao !== false &&
    !isMeatIngredient(ingredient) &&
    !(f.itens || []).some(item => item.insumoId === ingredient.id)
  ).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const disabled = f.bloqueada ? ' disabled' : '';
  return `<div class="inline-formula-editor">
    <div class="inline-formula-head">
      <span>Insumos da formulação</span>
      ${f.bloqueada ? '<small>Formulação protegida.</small>' : ''}
    </div>
    ${editableItems.length ? editableItems.map(item => inlineFormulaRowHTML(f, item)).join('') : '<div class="notice-card slim">Sem insumos adicionais nesta formulação.</div>'}
    <div class="formula-add-row">
      <select data-add-ingredient-select="${escapeAttr(f.id)}"${disabled}>
        <option value="">Selecione um insumo cadastrado</option>
        ${available.map(ingredient => `<option value="${escapeAttr(ingredient.id)}">${escapeHTML(ingredient.nome)}</option>`).join('')}
      </select>
      <button type="button" class="secondary-btn compact" data-add-ingredient-formula="${escapeAttr(f.id)}"${disabled}>Adicionar insumo</button>
    </div>
  </div>`;
}

function inlineFormulaRowHTML(f, item) {
    const ing = findIngredient(item.insumoId);
    const pct = toNumber(item.percentual);
    const grams = formulaItemGrams(f, item);
    const suggestion = ingredientSuggestion(ing);
    const removed = item.removido === true;
    const disabled = f.bloqueada || removed ? ' disabled' : '';
    const intensityKey = `${f.id}:${item.insumoId}`;
    const expanded = expandedIntensityItems.has(intensityKey);
    const suggestionHTML = suggestion ? intensityScaleHTML(f, item, pct, suggestion) : '';
    const cureSalt = isCureSaltIngredient(ing);
    const quantityValue = cureSalt ? (String(item.cura?.ppm ?? '').trim() === '' ? CURE_LIMIT_PPM : toNumber(item.cura.ppm)) : pct;
    const quantityUnit = cureSalt ? 'ppm' : '%';
    const quantityAttrs = cureSalt
      ? `data-cure-ppm="${escapeAttr(f.id)}" data-cure-insumo="${escapeAttr(item.insumoId)}"`
      : `data-inline-pct-formula="${escapeAttr(f.id)}" data-inline-pct-insumo="${escapeAttr(item.insumoId)}"`;
    return `<div class="inline-formula-row ${suggestion ? 'has-intensity' : ''} ${cureSalt ? 'has-cure' : ''} ${expanded ? 'editing' : ''} ${removed ? 'removed' : ''}" data-formula-row="${escapeAttr(f.id)}" data-formula-row-insumo="${escapeAttr(item.insumoId)}">
      <div class="inline-formula-name">
        <button type="button" class="inline-link" data-open-ingredient="${escapeAttr(item.insumoId)}">${escapeHTML(ing?.nome || 'Insumo não encontrado')}</button>
      </div>
      ${suggestion ? `<div class="formula-intensity-cell ${expanded ? 'expanded' : ''}">
        <div class="suggestion-panel">
          ${suggestionHTML}
        </div>
      </div>` : ''}
      <label class="pct-field">
        <span>${quantityUnit}</span>
        <input type="text" inputmode="decimal" pattern="[0-9.,]*" value="${escapeAttr(fmtInput(quantityValue))}" ${quantityAttrs}${disabled}${!expanded && !disabled ? ' readonly' : ''}>
      </label>
      <strong class="gram-pill" data-inline-grams="${escapeAttr(f.id)}" data-inline-grams-insumo="${escapeAttr(item.insumoId)}">${cureSalt ? fmtFixed2(grams) : fmt(grams)} g</strong>
      <div class="formula-item-actions">
        ${!removed ? `<button type="button" class="intensity-edit-btn" data-toggle-intensity="${escapeAttr(intensityKey)}" title="${expanded ? 'Concluir ajuste' : 'Editar quantidade'}" aria-expanded="${expanded}"${disabled}>${expanded ? '&#10004;&#65039;' : '✎'}</button>` : ''}
        ${removed
          ? `<button type="button" class="tiny-btn restore formula-item-restore" data-restore-ingredient-formula="${escapeAttr(f.id)}" data-restore-ingredient-id="${escapeAttr(item.insumoId)}" title="Restaurar insumo"${f.bloqueada ? ' disabled' : ''}>↺</button>`
          : `<button type="button" class="tiny-btn formula-item-remove" data-remove-ingredient-formula="${escapeAttr(f.id)}" data-remove-ingredient-id="${escapeAttr(item.insumoId)}" title="Remover insumo"${f.bloqueada ? ' disabled' : ''}>×</button>`}
      </div>
      ${cureSalt && !removed && expanded ? cureCompositionHTML(f, item, ing) : ''}
    </div>`;
}

function cureCompositionHTML(formula, item, ingredient) {
  const cureAgents = numberOrBlank(item.cura?.teorPct) === '' ? DEFAULT_CURE_CONCENTRATION_PCT : numberOrBlank(item.cura?.teorPct);
  const metrics = cureSaltMetrics(formula, item);
  const disabled = formula.bloqueada ? ' disabled' : '';
  const compositionLabel = ingredient.curaTipo === 2
    ? 'Nitrito + nitrato no sal de cura (%) - teor informado no rótulo'
    : 'Nitrito no sal de cura (%) - teor informado no rótulo';
  return `<div class="cure-composition-panel">
    <div class="cure-composition-head">
      <strong>Composição do ${escapeHTML(ingredient.nome.toLowerCase())}</strong>
    </div>
    <div class="cure-composition-grid">
      <label>${compositionLabel}<input type="number" inputmode="decimal" min="0.01" max="100" step="0.01" value="${escapeAttr(fmtInput(cureAgents))}" data-cure-agents="${escapeAttr(formula.id)}" data-cure-insumo="${escapeAttr(item.insumoId)}"${disabled}></label>
      <div class="cure-result"><span>Quantidade calculada para ${fmt(metrics.baseWeightGrams)} g</span><strong>${fmtFixed2(metrics.mixGrams)} g</strong><small>${fmt(metrics.ppm)} ppm · limite legal usado como padrão</small></div>
    </div>
    <p class="cure-legal-note">O cálculo converte o alvo em ppm para gramas do sal de cura conforme o teor declarado no rótulo.</p>
  </div>`;
}

function cureSaltMetrics(formula, item) {
  const ppmValue = String(item?.cura?.ppm ?? '').trim() === '' ? CURE_LIMIT_PPM : toNumber(item.cura.ppm);
  return {
    mixGrams: cureSaltGrams(formula, item),
    baseWeightGrams: toNumber(formula?.pesoReferencia) || 1000,
    ppm: Math.min(CURE_LIMIT_PPM, Math.max(0, ppmValue)),
    concentrationPct: Math.max(0.01, toNumber(item?.cura?.teorPct || DEFAULT_CURE_CONCENTRATION_PCT))
  };
}

function cureSaltGrams(formula, item) {
  const weightKg = (toNumber(formula?.pesoReferencia) || 1000) / 1000;
  const ppmValue = String(item?.cura?.ppm ?? '').trim() === '' ? CURE_LIMIT_PPM : toNumber(item.cura.ppm);
  const ppm = Math.min(CURE_LIMIT_PPM, Math.max(0, ppmValue));
  const concentration = Math.max(0.01, toNumber(item?.cura?.teorPct || DEFAULT_CURE_CONCENTRATION_PCT)) / 100;
  return ppm * weightKg / (concentration * 1000);
}

function cureSaltPercent(formula, item) {
  const weight = toNumber(formula?.pesoReferencia) || 1000;
  return weight > 0 ? cureSaltGrams(formula, item) / weight * 100 : 0;
}

function intensityScaleHTML(formula, item, current, suggestion) {
  const suave = roundOneDecimal(suggestion.suave);
  const acentuado = roundOneDecimal(suggestion.acentuado);
  const levels = intensityLevels(suave, acentuado);
  const range = acentuado - suave;
  const roundedCurrent = roundOneDecimal(current);
  const position = range > 0 ? Math.max(0, Math.min(100, (roundedCurrent - suave) / range * 100)) : 0;
  const exactIndex = levels.findIndex(value => Math.abs(value - roundedCurrent) < 0.001);
  return `<div class="intensity-scale">
    <div class="intensity-track">
      ${levels.map((value, index) => `<span class="intensity-stop ${index === 0 ? 'start' : index === levels.length - 1 ? 'end' : ''}">
        ${index === 0 || index === levels.length - 1 ? `<b>${index === 0 ? 'Suave' : 'Acentuado'}</b>` : ''}
        <button type="button" class="intensity-dot ${index === exactIndex ? 'selected' : ''}" data-suggestion-formula="${escapeAttr(formula.id)}" data-suggestion-insumo="${escapeAttr(item.insumoId)}" data-suggestion-value="${escapeAttr(value.toFixed(1))}" title="${fmtOneDecimal(value)}%" ${formula.bloqueada ? 'disabled' : ''}></button>
        ${index === 0 || index === levels.length - 1 || index === exactIndex ? `<small>${fmtOneDecimal(value)}%</small>` : ''}
      </span>`).join('')}
      ${exactIndex < 0 ? `<span class="intensity-current" style="left:${position.toFixed(1)}%" title="Valor atual: ${fmtOneDecimal(roundedCurrent)}%"><i>${fmtOneDecimal(roundedCurrent)}%</i></span>` : ''}
    </div>
  </div>`;
}

function intensityLevels(start, end) {
  const range = Math.max(0, roundOneDecimal(end) - roundOneDecimal(start));
  const step = Math.max(0.1, Math.ceil((range / 10) * 10 - 0.0001) / 10);
  const levels = [roundOneDecimal(start)];
  for (let value = start + step; value < end - 0.0001 && levels.length < 10; value += step) levels.push(roundOneDecimal(value));
  if (Math.abs(levels[levels.length - 1] - end) > 0.0001) levels.push(roundOneDecimal(end));
  return levels;
}

function bindProductWorkspace(root) {
  root.addEventListener('click', handleProductWorkspaceClick);
  bindFormulaControls(root);
  bindProductSlides(root);
  bindLawLinks(root);
}

function bindFormulaControls(root) {
  root.querySelectorAll('[data-inline-weight]').forEach(input => {
    input.addEventListener('input', () => queueInlineFormulaEdit(() => updateFormulaWeight(input.dataset.inlineWeight, input.value, { silent: true, light: true })));
    input.addEventListener('change', () => updateFormulaWeight(input.dataset.inlineWeight, input.value));
  });
  root.querySelectorAll('[data-inline-pct-formula]').forEach(input => {
    input.addEventListener('input', () => queueInlineFormulaEdit(() => updateFormulaItemPercent(input.dataset.inlinePctFormula, input.dataset.inlinePctInsumo, input.value, { silent: true, light: true })));
    input.addEventListener('change', () => updateFormulaItemPercent(input.dataset.inlinePctFormula, input.dataset.inlinePctInsumo, input.value, { light: true }));
    const selectValue = () => {
      if (input.readOnly || input.disabled) return;
      requestAnimationFrame(() => { try { input.select(); } catch (err) { /* type=number may not expose selection in every browser */ } });
    };
    input.addEventListener('focus', selectValue);
    input.addEventListener('click', selectValue);
  });
  root.querySelectorAll('[data-cure-ppm]').forEach(input => {
    input.addEventListener('input', () => queueInlineFormulaEdit(() => updateCurePpm(input.dataset.curePpm, input.dataset.cureInsumo, input.value, { silent: true, light: true })));
    input.addEventListener('change', () => updateCurePpm(input.dataset.curePpm, input.dataset.cureInsumo, input.value, { light: true }));
    const selectValue = () => {
      if (input.readOnly || input.disabled) return;
      requestAnimationFrame(() => input.select());
    };
    input.addEventListener('focus', selectValue);
    input.addEventListener('click', selectValue);
  });
  root.querySelectorAll('[data-blend-cut]').forEach(input => input.addEventListener('change', () => updateBlendComponent(input.dataset.blendCut, Number(input.dataset.blendIndex), { corteId: input.value, gorduraCustom: '' })));
  root.querySelectorAll('[data-blend-profile]').forEach(input => input.addEventListener('change', () => updateBlendComponent(input.dataset.blendProfile, Number(input.dataset.blendIndex), { perfil: input.value, gorduraCustom: '' })));
  root.querySelectorAll('[data-blend-grams]').forEach(input => {
    input.addEventListener('input', () => queueInlineFormulaEdit(() => updateBlendComponent(input.dataset.blendGrams, Number(input.dataset.blendIndex), { gramas: input.value }, { silent: true })));
    input.addEventListener('change', () => updateBlendComponent(input.dataset.blendGrams, Number(input.dataset.blendIndex), { gramas: input.value }));
  });
  root.querySelectorAll('[data-blend-fat]').forEach(input => input.addEventListener('change', () => updateBlendComponent(input.dataset.blendFat, Number(input.dataset.blendIndex), { gorduraCustom: input.value })));
  root.querySelectorAll('[data-single-cut]').forEach(input => input.addEventListener('change', () => updateSingleMaterial(input.dataset.singleCut, { corteId: input.value, gorduraCustom: '' })));
  root.querySelectorAll('[data-single-profile]').forEach(input => input.addEventListener('change', () => updateSingleMaterial(input.dataset.singleProfile, { perfil: input.value, gorduraCustom: '' })));
  root.querySelectorAll('[data-single-grams]').forEach(input => {
    input.addEventListener('input', () => queueInlineFormulaEdit(() => updateSingleMaterial(input.dataset.singleGrams, { gramas: input.value }, { silent: true })));
    input.addEventListener('change', () => updateSingleMaterial(input.dataset.singleGrams, { gramas: input.value }));
  });
  root.querySelectorAll('[data-single-fat]').forEach(input => input.addEventListener('change', () => updateSingleMaterial(input.dataset.singleFat, { gorduraCustom: input.value })));
  root.querySelectorAll('[data-cure-agents]').forEach(input => {
    input.addEventListener('input', () => queueInlineFormulaEdit(() => updateCureComposition(input.dataset.cureAgents, input.dataset.cureInsumo, { teorPct: input.value }, { silent: true })));
    input.addEventListener('change', () => updateCureComposition(input.dataset.cureAgents, input.dataset.cureInsumo, { teorPct: input.value }));
  });
}

function handleProductWorkspaceClick(event) {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.productBack !== undefined) {
    closeProductWorkspace();
    return;
  }
  if (target.dataset.slidePrev !== undefined || target.dataset.slideNext !== undefined) {
    const controller = target.closest('.product-workspace')?._productSlideController;
    if (!controller) return;
    controller.show(controller.getIndex() + (target.dataset.slideNext !== undefined ? 1 : -1));
    return;
  }
  if (target.dataset.editProductReferences !== undefined) {
    openProductModal(activeProductId);
    return;
  }
  if (target.dataset.reportFormula) {
    showFormulaReport(target.dataset.reportFormula);
    return;
  }
  if (target.dataset.openIngredient) {
    openIngredientView(target.dataset.openIngredient);
    return;
  }
  if (target.dataset.equipmentCheck !== undefined) {
    toggleEquipmentCheck(target);
    return;
  }
  if (target.dataset.toggleFormulaLock) {
    toggleFormulaLock(target.dataset.toggleFormulaLock);
    return;
  }
  if (target.dataset.toggleIntensity) {
    const key = target.dataset.toggleIntensity;
    if (expandedIntensityItems.has(key)) expandedIntensityItems.delete(key);
    else expandedIntensityItems.add(key);
    const row = target.closest('.inline-formula-row');
    const cell = row?.querySelector('.formula-intensity-cell');
    cell?.classList.toggle('expanded', expandedIntensityItems.has(key));
    row?.classList.toggle('editing', expandedIntensityItems.has(key));
    const input = row?.querySelector('[data-inline-pct-formula], [data-cure-ppm]');
    if (input && !input.disabled) {
      input.readOnly = !expandedIntensityItems.has(key);
    }
    target.setAttribute('aria-expanded', String(expandedIntensityItems.has(key)));
    target.title = expandedIntensityItems.has(key) ? 'Concluir ajuste' : 'Editar quantidade';
    if (!target.closest('.suggestion-panel')) target.innerHTML = expandedIntensityItems.has(key) ? '&#10004;&#65039;' : '✎';
    if (row?.classList.contains('has-cure')) refreshActiveFormulaCard(row.dataset.formulaRow);
    return;
  }
  if (target.dataset.toggleBlendButton) {
    const formula = findFormula(target.dataset.toggleBlendButton);
    if (!formula || formula.bloqueada) return;
    updateFormulaBlend(formula.id, { useBlend: formula.usarBlend !== true });
    return;
  }
  if (target.dataset.suggestionFormula) {
    updateFormulaItemPercent(target.dataset.suggestionFormula, target.dataset.suggestionInsumo, target.dataset.suggestionValue);
    return;
  }
  if (target.dataset.addIngredientFormula) {
    const card = target.closest('.formula-work-card');
    const select = card?.querySelector('[data-add-ingredient-select]');
    if (!select?.value) return toast('Selecione um insumo.');
    addFormulaItemInline(target.dataset.addIngredientFormula, select.value);
    return;
  }
  if (target.dataset.removeIngredientFormula) {
    requestFormulaItemRemoval(target.dataset.removeIngredientFormula, target.dataset.removeIngredientId);
    return;
  }
  if (target.dataset.restoreIngredientFormula) {
    restoreFormulaItemInline(target.dataset.restoreIngredientFormula, target.dataset.restoreIngredientId);
  }
}

function bindProductSlides(root) {
  const panels = Array.from(root.querySelectorAll('[data-slide-panel]'));
  const jumps = Array.from(root.querySelectorAll('[data-product-slide]'));
  const summary = root.querySelector('.product-slide-summary-scroll');
  const position = root.querySelector('[data-slide-position]');
  let index = Math.max(0, panels.findIndex(panel => panel.dataset.slidePanel === activeProductSlideId));
  const show = (nextIndex) => {
    index = Math.max(0, Math.min(panels.length - 1, nextIndex));
    activeProductSlideId = panels[index]?.dataset.slidePanel || 'visao';
    panels.forEach((panel, panelIndex) => panel.classList.toggle('active', panelIndex === index));
    jumps.forEach((jump, jumpIndex) => jump.classList.toggle('active', jumpIndex === index));
    if (position) position.textContent = `${index + 1} / ${panels.length}`;
    const activeJump = jumps[index];
    if (activeJump && summary && summary.scrollWidth > summary.clientWidth) {
      const summaryRect = summary.getBoundingClientRect();
      const jumpRect = activeJump.getBoundingClientRect();
      const targetLeft = summary.scrollLeft + jumpRect.left - summaryRect.left - (summary.clientWidth - jumpRect.width) / 2;
      const maxLeft = Math.max(0, summary.scrollWidth - summary.clientWidth);
      summary.scrollTo({ left: Math.max(0, Math.min(maxLeft, targetLeft)), behavior: 'smooth' });
    }
  };
  root._productSlideController = { show, getIndex: () => index };
  jumps.forEach((jump, jumpIndex) => jump.addEventListener('click', () => show(jumpIndex)));
  const stage = root.querySelector('.product-slide-stage');
  let pointerStart = null;
  let touchStart = null;
  let lastSwipeAt = 0;
  const completeSwipe = (start, endX, endY) => {
    if (!start || Date.now() - lastSwipeAt < 250) return;
    const deltaX = endX - start.x;
    const deltaY = endY - start.y;
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
    lastSwipeAt = Date.now();
    show(index + (deltaX < 0 ? 1 : -1));
  };
  stage?.addEventListener('pointerdown', event => {
    if (!window.matchMedia('(max-width: 760px)').matches) return;
    if (event.isPrimary === false || event.target.closest('input, select, textarea, button, a')) return;
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  stage?.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const start = pointerStart;
    pointerStart = null;
    completeSwipe(start, event.clientX, event.clientY);
  });
  stage?.addEventListener('pointercancel', () => { pointerStart = null; });
  stage?.addEventListener('touchstart', event => {
    if (!window.matchMedia('(max-width: 760px)').matches || event.target.closest('input, select, textarea, button, a')) return;
    const touch = event.touches[0];
    if (touch) touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  stage?.addEventListener('touchend', event => {
    const touch = event.changedTouches[0];
    const start = touchStart;
    touchStart = null;
    if (touch) completeSwipe(start, touch.clientX, touch.clientY);
  }, { passive: true });
  stage?.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  show(index);
}

function renderInsumos() {
  renderIngredientFilters();
  const term = ($('#searchInsumos')?.value || '').toLowerCase().trim();
  const list = db.insumos.filter(i => {
    const okFilter = selectedIngredientFilter === 'todos' || i.tipo === selectedIngredientFilter;
    const okSearch = [i.nome, i.categoria, typeLabel(i.tipo), i.subtipo, i.funcao, i.obs].join(' ').toLowerCase().includes(term);
    return okFilter && okSearch;
  });
  $('#insumosList').innerHTML = list.map(ingredientHTML).join('') || emptyHTML('Nenhum insumo encontrado.');
  $('#insumosList').querySelectorAll('[data-edit-ingredient]').forEach(el => el.addEventListener('click', () => openIngredientModal(el.dataset.editIngredient)));
}

function renderIngredientFilters() {
  const chips = [{ value: 'todos', label: 'Todos' }, ...TYPES];
  $('#ingredientTypeFilters').innerHTML = chips.map(c => `<button type="button" class="chip ${selectedIngredientFilter === c.value ? 'active' : ''}" data-filter="${escapeAttr(c.value)}">${escapeHTML(c.label)}</button>`).join('');
  $('#ingredientTypeFilters').querySelectorAll('[data-filter]').forEach(chip => chip.addEventListener('click', () => {
    selectedIngredientFilter = chip.dataset.filter;
    db.configs.filtroInsumo = selectedIngredientFilter;
    saveDB();
    renderInsumos();
  }));
}

function ingredientHTML(i) {
  const avatar = i.foto ? `<img src="${escapeAttr(i.foto)}" alt="">` : escapeHTML(ingredientIcon(i.tipo));
  return `
    <button type="button" class="item-card" data-edit-ingredient="${escapeAttr(i.id)}">
      <div class="item-avatar">${avatar}</div>
      <div>
        <div class="item-title">${escapeHTML(i.nome)}</div>
        <div class="item-subtitle">${escapeHTML(i.funcao || 'Sem função tecnológica cadastrada')}</div>
        <div class="item-meta">
          <span class="badge info">${escapeHTML(typeLabel(i.tipo))}</span>
          ${i.subtipo ? `<span class="badge">${escapeHTML(capitalizeFirst(i.subtipo))}</span>` : ''}
          ${i.usadoNaFormulacao === false ? '<span class="badge">Fora da formulação</span>' : ''}
          ${i.proteinaNaoCarnea ? '<span class="badge warn">proteína agregada</span>' : ''}
          ${i.alergeno ? '<span class="badge danger">alérgeno</span>' : ''}
          <span class="badge">G ${fmt(i.gordura)}% · P ${fmt(i.proteina)}% · C ${fmt(i.carboidrato)}%</span>
        </div>
      </div>
    </button>`;
}

function renderFormulaFilters() {
  const currentFormulaProduct = $('#formulaProduto')?.value || db.produtos[0]?.id || '';
  $('#formulaProduto').innerHTML = db.produtos.map(p => `<option value="${escapeAttr(p.id)}">${escapeHTML(p.nome)}</option>`).join('');
  if (db.produtos.some(p => p.id === currentFormulaProduct)) $('#formulaProduto').value = currentFormulaProduct;
}

function renderFormulas() {
  if (!$('#formulasList')) return;
  renderFormulaFilters();
  const filter = 'todos';
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
    <button type="button" class="item-card" data-edit-formula="${escapeAttr(f.id)}">
      <div class="item-avatar">∑</div>
      <div>
        <div class="item-title">${escapeHTML(cleanFormulaName(f.nome))}</div>
        <div class="item-subtitle">${escapeHTML(product?.nome || 'Produto não encontrado')}</div>
        <div class="item-meta">
          <span class="badge ${limitBadge(analysis.fatPct, product?.parametros?.gorduraMax, 'max')}">Gordura ${fmt(analysis.fatPct)}%</span>
          <span class="badge ${danger ? 'danger' : warn ? 'warn' : 'ok'}">${danger ? 'corrigir' : warn ? 'atenção' : 'ok'}</span>
        </div>
      </div>
    </button>`;
}

function renderRules() {
  const root = $('#rulesGrid');
  if (!root) return;
  const rules = normalizeLabRules(db.configs.regrasLaboratorio);
  root.innerHTML = rules.map(ruleCardHTML).join('') || emptyHTML('Nenhuma regra cadastrada.');
}

function ruleCardHTML(rule, index) {
  return `<article class="rule-card">
    <span>${escapeHTML(rule.numero || String(index + 1).padStart(2, '0'))}</span>
    <strong>${escapeHTML(rule.titulo || 'Regra')}</strong>
    <p>${escapeHTML(rule.texto || '')}</p>
  </article>`;
}

function renderCronograma() {
  const root = $('#cronogramaContent');
  if (!root) return;
  const period = getActivePeriod();
  const schedule = getVisibleSchedule();
  root.innerHTML = `
    ${period ? `<div class="period-banner">
      <strong>${escapeHTML(period.nome)}</strong>
      <span>${periodDateLabel(period)}</span>
    </div>` : ''}
    <div class="calendar-list">
      ${schedule.length ? schedule.map(scheduleCardHTML).join('') : emptyHTML('Nenhuma aula cadastrada para este período.')}
    </div>
    <div class="notice-card">
      O cronograma pode ser ajustado conforme a oferta da disciplina. Os roteiros e as aulas teóricas permanecem conectados para consulta rápida durante a prática.
    </div>`;
  bindInternalLinks(root);
  root.querySelectorAll('[data-open-category]').forEach(btn => btn.addEventListener('click', () => setPage('Aulas')));
}

function scheduleCardHTML(item, index) {
  const categoryChips = (item.categorias || []).map(id => {
    const content = getTheoryContent(id);
    return content ? `<button type="button" class="link-chip soft" data-open-category="${escapeAttr(id)}">${escapeHTML(content.titulo)}</button>` : '';
  }).join('');
  const date = scheduleDateParts(item.dia);
  return `<article class="calendar-card">
    <div class="calendar-index ${item.dia ? 'has-date' : ''}">
      ${item.dia ? `<span>${escapeHTML(date.weekday)}</span><strong>${escapeHTML(date.day)}</strong><b>${escapeHTML(date.month)}</b><em>${escapeHTML(date.year)}</em>` : '<span>DATA</span><strong>--</strong><b>---</b><em>A definir</em>'}
    </div>
    <div class="calendar-body">
      <h3 class="calendar-lesson-title"><span>${lessonNumberLabel(index)}:</span> ${escapeHTML(item.tema)}</h3>
      <p>${escapeHTML(item.foco)}</p>
      ${item.local ? `<div class="calendar-local">${escapeHTML(item.local)}</div>` : ''}
      ${item.observacao ? `<div class="calendar-note">${escapeHTML(item.observacao)}</div>` : ''}
      <div class="linked-block">
        <div class="linked-title">Teoria relacionada</div>
        <div class="link-chip-row">${categoryChips}</div>
      </div>
      <div class="linked-block">
        <div class="linked-title">Roteiros da aula</div>
        ${linkedProductChipsHTML(item.produtos || [])}
      </div>
    </div>
  </article>`;
}

function linkedProductChipsHTML(ids) {
  const chips = ids.map(id => {
    const product = findProduct(id);
    if (!product || product.oculto) return '';
    return `<button type="button" class="link-chip soft" data-open-product="${escapeAttr(id)}">${escapeHTML(product.nome)}</button>`;
  }).join('');
  return `<div class="link-chip-row">${chips || '<span class="muted">Nenhum roteiro vinculado.</span>'}</div>`;
}

function getSchedulePeriods() {
  if (!Array.isArray(db.configs.periodos) || !db.configs.periodos.length) {
    db.configs.periodos = normalizeSchedulePeriods([], db.configs.cronograma);
  }
  if (!db.configs.periodos.some(period => period.id === db.configs.periodoAtivoId)) {
    db.configs.periodoAtivoId = (db.configs.periodos.find(period => !period.arquivado) || db.configs.periodos[0])?.id || '';
  }
  return db.configs.periodos;
}

function getPeriodById(periods, id) {
  return (periods || []).find(period => period.id === id);
}

function getActivePeriod() {
  const periods = getSchedulePeriods();
  return getPeriodById(periods, db.configs.periodoAtivoId) || periods[0] || null;
}

function getSchedule() {
  const period = getActivePeriod();
  if (!period) return [];
  period.aulas = normalizeSchedule(period.aulas || [], false);
  db.configs.cronograma = period.aulas;
  return period.aulas;
}

function getVisibleSchedule() {
  return getSchedule().filter(item => !item.oculta);
}

function visibleProducts() {
  return db.produtos.filter(product => !product.oculto);
}

function normalizeSchedulePeriods(source = [], legacySchedule = []) {
  const hasSourcePeriods = Array.isArray(source) && source.length;
  const current = hasSourcePeriods ? source : [{
    id: 'periodo_demo',
    nome: 'Período atual',
    inicio: '',
    fim: '',
    arquivado: false,
    aulas: legacySchedule
  }];
  return current.map((period, index) => ({
    id: period.id || uid('periodo'),
    nome: period.nome || period.titulo || `Período ${index + 1}`,
    inicio: period.inicio || '',
    fim: period.fim || '',
    arquivado: Boolean(period.arquivado),
    aulas: normalizeSchedule(period.aulas || period.cronograma || (index === 0 ? legacySchedule : []), !hasSourcePeriods && index === 0)
  }));
}

function normalizeSchedule(source = [], fillDefaults = true) {
  const current = Array.isArray(source) ? source : [];
  if (fillDefaults) {
    return CLASS_SCHEDULE.map((item, index) => normalizeScheduleItem(current.find(row => row.id === item.id) || current[index] || {}, item, index));
  }
  return current.map((item, index) => normalizeScheduleItem(item, {}, index));
}

function normalizeScheduleItem(saved = {}, fallback = {}, index = 0) {
  const item = {
    id: saved.id || fallback.id || uid('aula'),
    aula: saved.aula || fallback.aula || `Aula ${index + 1}`,
    dia: saved.dia || fallback.dia || '',
    tema: saved.tema || fallback.tema || '',
    foco: saved.foco || fallback.foco || '',
    local: saved.local || fallback.local || '',
    observacao: saved.observacao || fallback.observacao || '',
    oculta: Boolean(saved.oculta),
    produtos: Array.isArray(saved.produtos) ? saved.produtos : clone(fallback.produtos || []),
    categorias: Array.isArray(saved.categorias) ? saved.categorias : clone(fallback.categorias || [])
  };
  item.conteudo = normalizeLessonContent(saved.conteudo || saved.conteudoTeorico, fallback.conteudo, item);
  return item;
}

function normalizeLessonContent(source = {}, fallback = {}, lesson = {}) {
  const content = source && typeof source === 'object' ? source : {};
  const base = fallback && typeof fallback === 'object' ? fallback : {};
  return {
    modo: content.modo === 'slides' ? 'slides' : 'texto',
    titulo: content.titulo || base.titulo || lesson.tema || '',
    texto: content.texto || content.corpo || base.texto || '',
    imagens: Array.isArray(content.imagens) ? content.imagens : clone(base.imagens || [])
  };
}

function normalizeTheoryContents(source = [], periods = []) {
  const saved = Array.isArray(source) ? source : [];
  const legacyLessons = (Array.isArray(periods) ? periods : []).flatMap(period => Array.isArray(period?.aulas) ? period.aulas : []);
  const defaults = PRODUCT_CATEGORIES.map(category => {
    const current = saved.find(item => item.id === category.id) || {};
    const legacy = legacyLessons.find(lesson => (lesson.categorias || []).includes(category.id) && (lesson.conteudo?.texto || lesson.conteudo?.imagens?.length))?.conteudo || {};
    return {
      id: category.id,
      titulo: current.titulo || category.titulo,
      resumo: current.resumo || legacy.texto || category.resumo,
      topicos: Array.isArray(current.topicos) ? current.topicos : clone(category.topicos || []),
      perguntas: Array.isArray(current.perguntas) ? current.perguntas : clone(category.perguntas || []),
      modo: current.modo === 'slides' || legacy.modo === 'slides' ? 'slides' : 'texto',
      imagens: Array.isArray(current.imagens) ? current.imagens : clone(legacy.imagens || []),
      produtos: Array.isArray(current.produtos) ? current.produtos : clone(category.produtos || []),
      insumos: Array.isArray(current.insumos) ? current.insumos : clone(category.insumos || []),
      padrao: true
    };
  });
  const custom = saved.filter(item => !PRODUCT_CATEGORIES.some(category => category.id === item.id)).map(item => ({
    id: item.id || uid('conteudo'),
    titulo: item.titulo || 'Novo conteúdo',
    resumo: item.resumo || '',
    topicos: Array.isArray(item.topicos) ? item.topicos : [],
    perguntas: Array.isArray(item.perguntas) ? item.perguntas : [],
    modo: item.modo === 'slides' ? 'slides' : 'texto',
    imagens: Array.isArray(item.imagens) ? item.imagens : [],
    produtos: Array.isArray(item.produtos) ? item.produtos : [],
    insumos: Array.isArray(item.insumos) ? item.insumos : [],
    padrao: false
  }));
  return [...defaults, ...custom];
}

function getTheoryContents() {
  db.configs.conteudosTeoricos = normalizeTheoryContents(db.configs.conteudosTeoricos, db.configs.periodos);
  return db.configs.conteudosTeoricos;
}

function getTheoryContent(id) {
  return getTheoryContents().find(item => item.id === id);
}

function normalizeLabRules(source = []) {
  const list = Array.isArray(source) && source.length ? source : DEFAULT_RULES;
  return list.map((rule, index) => ({
    id: rule.id || uid('regra'),
    numero: rule.numero || String(index + 1).padStart(2, '0'),
    titulo: rule.titulo || rule.nome || `Regra ${index + 1}`,
    texto: rule.texto || rule.descricao || ''
  }));
}

function renderScheduleConfig() {
  const root = $('#configCronogramaList');
  if (!root) return;
  const period = getActivePeriod();
  renderPeriodControls(period);
  const schedule = getSchedule();
  root.innerHTML = schedule.map(scheduleConfigHTML).join('') || emptyHTML('Nenhuma aula cadastrada neste período.');
  root.querySelectorAll('[data-schedule-field]').forEach(input => input.addEventListener('change', () => saveScheduleField(input)));
  root.querySelectorAll('[data-schedule-product]').forEach(input => input.addEventListener('change', () => saveScheduleLinkField(input, 'produtos')));
  root.querySelectorAll('[data-schedule-category]').forEach(input => input.addEventListener('change', () => saveScheduleLinkField(input, 'categorias')));
  root.querySelectorAll('[data-delete-schedule]').forEach(btn => btn.addEventListener('click', () => deleteScheduleLesson(Number(btn.dataset.deleteSchedule))));
  root.querySelectorAll('[data-toggle-schedule-visibility]').forEach(btn => btn.addEventListener('click', () => toggleScheduleVisibility(Number(btn.dataset.toggleScheduleVisibility))));
}

function beginScheduleConfigSession() {
  scheduleConfigSnapshot = {
    periodos: clone(getSchedulePeriods()),
    periodoAtivoId: db.configs.periodoAtivoId
  };
}

function cancelScheduleConfig() {
  if (scheduleConfigSnapshot) {
    db.configs.periodos = clone(scheduleConfigSnapshot.periodos);
    db.configs.periodoAtivoId = scheduleConfigSnapshot.periodoAtivoId;
    db.configs.cronograma = getActivePeriod()?.aulas || [];
    saveDB();
    renderAll();
  }
  scheduleConfigSnapshot = null;
  closeModal('modalConfigCronograma');
  toast('Alterações das aulas canceladas.');
}

function saveScheduleConfig() {
  db.configs.cronograma = getActivePeriod()?.aulas || [];
  saveDB();
  scheduleConfigSnapshot = null;
  closeModal('modalConfigCronograma');
  renderAll();
  toast('Aulas salvas.');
}

function renderContentConfig() {
  const root = $('#configConteudosList');
  if (!root) return;
  root.innerHTML = getTheoryContents().map(contentConfigHTML).join('') || emptyHTML('Nenhum conteúdo cadastrado.');
  root.querySelectorAll('[data-edit-content]').forEach(btn => btn.addEventListener('click', () => openTheoryContentModal(btn.dataset.editContent)));
}

function contentConfigHTML(content) {
  return `<button type="button" class="content-list-card" data-edit-content="${escapeAttr(content.id)}">
    <div>
      <strong>${escapeHTML(content.titulo)}</strong>
    </div>
    <b>›</b>
  </button>`;
}

function openTheoryContentModal(id = '') {
  const content = id ? getTheoryContent(id) : null;
  $('#conteudoId').value = content?.id || '';
  $('#conteudoTitulo').value = content?.titulo || '';
  $('#conteudoModo').value = content?.modo || 'texto';
  $('#conteudoResumo').value = content?.resumo || '';
  $('#conteudoTopicos').value = (content?.topicos || []).join('\n');
  $('#conteudoPerguntas').value = (content?.perguntas || []).join('\n');
  tempTheoryImages = clone(content?.imagens || []);
  $('#conteudoImagens').value = '';
  renderTheoryContentLinks(content);
  renderTheoryContentImages();
  updateTheoryContentMode();
  $('#btnExcluirConteudo').style.display = content && !content.padrao ? 'inline-flex' : 'none';
  openModal('modalConteudoEditor');
}

function updateTheoryContentMode() {
  const fields = $('#conteudoTextoFields');
  if (fields) fields.hidden = $('#conteudoModo')?.value === 'slides';
}

function renderTheoryContentLinks(content) {
  const selectedProducts = new Set(content?.produtos || []);
  const selectedIngredients = new Set(content?.insumos || []);
  $('#conteudoProdutos').innerHTML = db.produtos.map(product => `<label class="check-pill"><input type="checkbox" value="${escapeAttr(product.id)}" ${selectedProducts.has(product.id) ? 'checked' : ''}><span>${escapeHTML(product.nome)}</span></label>`).join('');
  $('#conteudoInsumos').innerHTML = db.insumos.map(ingredient => `<label class="check-pill"><input type="checkbox" value="${escapeAttr(ingredient.id)}" ${selectedIngredients.has(ingredient.id) ? 'checked' : ''}><span>${escapeHTML(ingredient.nome)}</span></label>`).join('');
}

async function handleTheoryContentImages(ev) {
  const files = Array.from(ev.target.files || []).filter(file => file.type.startsWith('image/'));
  try {
    for (const file of files) {
      const dataUrl = await fileToDataURL(file, 1600, 0.8);
      tempTheoryImages.push(await storeTheoryImage(dataUrl));
    }
  } catch (err) {
    console.error(err);
    toast('Não foi possível preparar uma das imagens.');
  }
  ev.target.value = '';
  renderTheoryContentImages();
}

function renderTheoryContentImages() {
  const root = $('#conteudoImagensPreview');
  root.innerHTML = tempTheoryImages.map((ref, index) => `<div class="photo-wrap content-photo-wrap">
    <img class="content-photo-thumb" src="${escapeAttr(resolveTheoryImage(ref))}" alt="Slide ${index + 1}">
    <button type="button" class="photo-remove" data-remove-theory-image="${index}" aria-label="Remover imagem">×</button>
  </div>`).join('');
  root.querySelectorAll('[data-remove-theory-image]').forEach(btn => btn.addEventListener('click', () => {
    tempTheoryImages.splice(Number(btn.dataset.removeTheoryImage), 1);
    renderTheoryContentImages();
  }));
}

function saveTheoryContent() {
  if (!requirePermission('manage.contents')) return;
  const id = $('#conteudoId').value || uid('conteudo');
  const existing = getTheoryContent(id);
  const content = {
    id,
    titulo: $('#conteudoTitulo').value.trim(),
    modo: $('#conteudoModo').value === 'slides' ? 'slides' : 'texto',
    resumo: $('#conteudoResumo').value.trim(),
    topicos: linesFrom($('#conteudoTopicos').value),
    perguntas: linesFrom($('#conteudoPerguntas').value),
    imagens: clone(tempTheoryImages),
    produtos: Array.from($('#conteudoProdutos').querySelectorAll('input:checked')).map(input => input.value),
    insumos: Array.from($('#conteudoInsumos').querySelectorAll('input:checked')).map(input => input.value),
    padrao: Boolean(existing?.padrao)
  };
  if (!content.titulo) return toast('Informe o nome do conteúdo.');
  db.configs.conteudosTeoricos = getTheoryContents();
  const previousContents = clone(db.configs.conteudosTeoricos);
  const index = db.configs.conteudosTeoricos.findIndex(item => item.id === id);
  if (index >= 0) db.configs.conteudosTeoricos[index] = content; else db.configs.conteudosTeoricos.push(content);
  if (!saveDB()) {
    db.configs.conteudosTeoricos = previousContents;
    return;
  }
  cleanupUnusedTheoryImages();
  closeModal('modalConteudoEditor');
  renderContentConfig();
  renderScheduleConfig();
  renderAulas();
  renderCronograma();
  renderProdutos();
  toast('Conteúdo salvo.');
}

function deleteTheoryContent() {
  if (!requirePermission('manage.contents')) return;
  const id = $('#conteudoId').value;
  const content = getTheoryContent(id);
  if (!content || content.padrao) return;
  openConfirmation({
    title: 'Excluir conteúdo',
    message: `Deseja excluir "${content.titulo}"? Esta ação também remove o vínculo desse assunto com o cronograma.`,
    confirmLabel: 'Excluir',
    action: () => performTheoryContentDeletion(id)
  });
}

function performTheoryContentDeletion(id) {
  db.configs.conteudosTeoricos = db.configs.conteudosTeoricos.filter(item => item.id !== id);
  getSchedulePeriods().forEach(period => period.aulas.forEach(lesson => {
    lesson.categorias = (lesson.categorias || []).filter(contentId => contentId !== id);
  }));
  saveDB();
  cleanupUnusedTheoryImages();
  closeModal('modalConteudoEditor');
  renderContentConfig();
  renderScheduleConfig();
  renderAulas();
  renderCronograma();
  toast('Conteúdo excluído.');
}

function renderPeriodControls(period) {
  const select = $('#periodoAtivoSelect');
  if (!select || !period) return;
  const periods = getSchedulePeriods();
  select.innerHTML = periods.map(p => `<option value="${escapeAttr(p.id)}" ${p.id === period.id ? 'selected' : ''}>${escapeHTML(p.nome)}${p.arquivado ? ' (arquivado)' : ''}</option>`).join('');
  $('#periodoNome').value = period.nome || '';
  $('#periodoInicio').value = period.inicio || '';
  $('#periodoFim').value = period.fim || '';
  const archiveBtn = $('#btnArquivarPeriodo');
  if (archiveBtn) archiveBtn.textContent = period.arquivado ? 'Reativar período' : 'Arquivar período';
}

function scheduleConfigHTML(item, index) {
  return `<article class="config-schedule-card">
    <div class="config-schedule-head">
      <div>
        <strong>${lessonNumberLabel(index)}</strong>
        ${item.oculta ? '<span class="badge warn">Oculta para alunos</span>' : ''}
      </div>
      <div class="config-schedule-actions">
        <button type="button" class="visibility-toggle compact ${item.oculta ? 'locked' : ''}" data-toggle-schedule-visibility="${index}" title="Ocultar ou mostrar aula">${item.oculta ? '🔒 Oculta' : '🔓 Visível'}</button>
        <button type="button" class="tiny-btn" data-delete-schedule="${index}" title="Excluir aula">×</button>
      </div>
    </div>
    <div class="form-grid two-cols">
      <div class="form-group">
        <label>Tema</label>
        <input type="text" value="${escapeAttr(item.tema || '')}" data-schedule-field="tema" data-schedule-index="${index}">
      </div>
      <div class="form-group">
        <label>Dia da aula</label>
        <input type="date" value="${escapeAttr(item.dia || '')}" data-schedule-field="dia" data-schedule-index="${index}">
      </div>
    </div>
    <div class="form-group">
      <label>Local</label>
      <input type="text" value="${escapeAttr(item.local || '')}" data-schedule-field="local" data-schedule-index="${index}" placeholder="Ex: Laboratório">
    </div>
    <div class="form-group">
      <label>Foco da aula</label>
      <textarea rows="2" data-schedule-field="foco" data-schedule-index="${index}">${escapeHTML(item.foco || '')}</textarea>
    </div>
    <div class="form-group">
      <label>Observação</label>
      <textarea rows="2" data-schedule-field="observacao" data-schedule-index="${index}" placeholder="Opcional">${escapeHTML(item.observacao || '')}</textarea>
    </div>
    <div class="schedule-link-grid">
      <div>
        <div class="linked-title">Produtos vinculados</div>
        <div class="check-pill-grid">${scheduleProductChecks(item, index)}</div>
      </div>
      <div>
        <div class="linked-title">Aulas teóricas vinculadas</div>
        <div class="check-pill-grid">${scheduleCategoryChecks(item, index)}</div>
      </div>
    </div>
  </article>`;
}

function scheduleProductChecks(item, index) {
  const selected = new Set(item.produtos || []);
  return db.produtos.map(p => `<label class="check-pill"><input type="checkbox" ${selected.has(p.id) ? 'checked' : ''} data-schedule-product="${escapeAttr(p.id)}" data-schedule-index="${index}"><span>${escapeHTML(p.nome)}</span></label>`).join('');
}

function scheduleCategoryChecks(item, index) {
  const selected = new Set(item.categorias || []);
  return getTheoryContents().map(content => `<label class="check-pill"><input type="checkbox" ${selected.has(content.id) ? 'checked' : ''} data-schedule-category="${escapeAttr(content.id)}" data-schedule-index="${index}"><span>${escapeHTML(content.titulo)}</span></label>`).join('');
}

function renderRulesConfig() {
  const root = $('#configRulesList');
  if (!root) return;
  db.configs.regrasLaboratorio = normalizeLabRules(db.configs.regrasLaboratorio);
  root.innerHTML = db.configs.regrasLaboratorio.map(labRuleConfigHTML).join('') || emptyHTML('Nenhuma regra cadastrada.');
  root.querySelectorAll('[data-rule-field]').forEach(input => input.addEventListener('change', () => saveLabRuleField(input)));
  root.querySelectorAll('[data-delete-rule]').forEach(btn => btn.addEventListener('click', () => deleteLabRule(btn.dataset.deleteRule)));
}

function labRuleConfigHTML(rule, index) {
  return `<article class="config-rule-card">
    <div class="config-schedule-head">
      <strong>${escapeHTML(rule.numero || String(index + 1).padStart(2, '0'))} · ${escapeHTML(rule.titulo || 'Regra')}</strong>
      <button type="button" class="tiny-btn" data-delete-rule="${escapeAttr(rule.id)}" title="Excluir regra">×</button>
    </div>
    <div class="form-grid two-cols">
      <div class="form-group">
        <label>Número</label>
        <input type="text" value="${escapeAttr(rule.numero || '')}" data-rule-field="numero" data-rule-id="${escapeAttr(rule.id)}">
      </div>
      <div class="form-group">
        <label>Título</label>
        <input type="text" value="${escapeAttr(rule.titulo || '')}" data-rule-field="titulo" data-rule-id="${escapeAttr(rule.id)}">
      </div>
    </div>
    <div class="form-group">
      <label>Texto da regra</label>
      <textarea rows="3" data-rule-field="texto" data-rule-id="${escapeAttr(rule.id)}">${escapeHTML(rule.texto || '')}</textarea>
    </div>
  </article>`;
}

function saveLabRuleField(input) {
  const rule = db.configs.regrasLaboratorio.find(item => item.id === input.dataset.ruleId);
  if (!rule) return;
  rule[input.dataset.ruleField] = input.value;
  saveDB();
  renderRules();
  renderRulesConfig();
  toast('Regra atualizada.');
}

function addLabRule() {
  if (!requirePermission('manage.rules')) return;
  db.configs.regrasLaboratorio = normalizeLabRules(db.configs.regrasLaboratorio);
  const next = db.configs.regrasLaboratorio.length + 1;
  db.configs.regrasLaboratorio.push({ id: uid('regra'), numero: String(next).padStart(2, '0'), titulo: 'Nova regra', texto: '' });
  saveDB();
  renderRules();
  renderRulesConfig();
  toast('Regra adicionada.');
}

function deleteLabRule(id) {
  if (!requirePermission('manage.rules')) return;
  if (!id) return;
  if (!confirm('Excluir esta regra?')) return;
  db.configs.regrasLaboratorio = db.configs.regrasLaboratorio.filter(rule => rule.id !== id);
  saveDB();
  renderRules();
  renderRulesConfig();
  toast('Regra excluída.');
}

function saveScheduleField(input) {
  if (!requirePermission('manage.schedule')) return;
  const index = Number(input.dataset.scheduleIndex);
  const field = input.dataset.scheduleField;
  const schedule = getSchedule();
  if (!schedule[index] || !field) return;
  schedule[index][field] = input.value;
  saveDB();
  renderCronograma();
  renderContentConfig();
  renderAulas();
  toast('Cronograma atualizado.');
}

function toggleScheduleVisibility(index) {
  const schedule = getSchedule();
  if (!schedule[index]) return;
  schedule[index].oculta = !schedule[index].oculta;
  saveDB();
  renderScheduleConfig();
  renderCronograma();
  renderAulas();
  toast(schedule[index].oculta ? 'Aula ocultada dos alunos.' : 'Aula visível para os alunos.');
}

function saveScheduleLinkField(input, field) {
  const index = Number(input.dataset.scheduleIndex);
  const schedule = getSchedule();
  if (!schedule[index]) return;
  const selector = field === 'produtos' ? `[data-schedule-product][data-schedule-index="${index}"]` : `[data-schedule-category][data-schedule-index="${index}"]`;
  const attr = field === 'produtos' ? 'scheduleProduct' : 'scheduleCategory';
  schedule[index][field] = $$(selector).filter(el => el.checked).map(el => el.dataset[attr]);
  saveDB();
  renderCronograma();
  renderAulas();
  toast('Vínculo atualizado.');
}

function setActivePeriod(id) {
  if (!requirePermission('manage.schedule')) return;
  if (!getSchedulePeriods().some(period => period.id === id)) return;
  db.configs.periodoAtivoId = id;
  saveDB();
  renderActivePeriodLabel();
  renderScheduleConfig();
  renderContentConfig();
  renderCronograma();
  renderAulas();
}

function savePeriodField(field, value) {
  const period = getActivePeriod();
  if (!period) return;
  period[field] = value;
  saveDB();
  renderActivePeriodLabel();
  renderCronograma();
  renderScheduleConfig();
  toast('Período atualizado.');
}

function createPeriod(archiveCurrent = false) {
  const current = getActivePeriod();
  if (archiveCurrent && current) current.arquivado = true;
  const year = new Date().getFullYear();
  const period = { id: uid('periodo'), nome: `Novo período ${year}`, inicio: '', fim: '', arquivado: false, aulas: [] };
  getSchedulePeriods().push(period);
  db.configs.periodoAtivoId = period.id;
  saveDB();
  renderActivePeriodLabel();
  renderScheduleConfig();
  renderContentConfig();
  renderCronograma();
  renderAulas();
  toast(archiveCurrent ? 'Período arquivado e novo período criado.' : 'Novo período criado.');
}

function archiveActivePeriod() {
  const period = getActivePeriod();
  if (!period) return;
  period.arquivado = !period.arquivado;
  saveDB();
  renderActivePeriodLabel();
  renderScheduleConfig();
  renderContentConfig();
  renderCronograma();
  renderAulas();
  toast(period.arquivado ? 'Período arquivado.' : 'Período reativado.');
}

function addScheduleLesson() {
  const period = getActivePeriod();
  if (!period) return;
  period.aulas.push(normalizeScheduleItem({ aula: lessonNumberLabel(period.aulas.length), tema: '', foco: '', produtos: [], categorias: [] }, {}, period.aulas.length));
  saveDB();
  renderScheduleConfig();
  renderContentConfig();
  renderAulas();
  renderCronograma();
  toast('Aula adicionada.');
}

function deleteScheduleLesson(index) {
  const period = getActivePeriod();
  if (!period?.aulas?.[index]) return;
  if (!confirm('Excluir esta aula do cronograma?')) return;
  period.aulas.splice(index, 1);
  saveDB();
  renderScheduleConfig();
  renderContentConfig();
  renderAulas();
  renderCronograma();
  toast('Aula excluída.');
}

function periodDateLabel(period) {
  const start = formatScheduleDate(period?.inicio);
  const end = formatScheduleDate(period?.fim);
  if (start && end) return `${start} a ${end}${period.arquivado ? ' · arquivado' : ''}`;
  if (start) return `Início ${start}${period.arquivado ? ' · arquivado' : ''}`;
  if (period?.arquivado) return 'Arquivado';
  return 'Período ativo';
}

function formatScheduleDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('-');
  if (year && month && day) return `${day}/${month}/${year}`;
  return value;
}

function scheduleDateParts(value) {
  if (!value) return { day: '--', weekday: 'DATA', month: '---', year: 'A definir' };
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return { day: value, weekday: 'DATA', month: '', year: '' };
  return {
    day: String(date.getDate()).padStart(2, '0'),
    weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
    month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
    year: String(date.getFullYear())
  };
}

function lessonNumberLabel(index) {
  return `Aula ${String(Number(index) + 1).padStart(2, '0')}`;
}

function renderAulaSelect() {
  if (!$('#aulaProdutoSelect')) return;
  $('#aulaProdutoSelect').innerHTML = db.produtos.map(p => `<option value="${escapeAttr(p.id)}">${escapeHTML(p.nome)}</option>`).join('');
  if (db.configs.ultimoProdutoAula && db.produtos.some(p => p.id === db.configs.ultimoProdutoAula)) $('#aulaProdutoSelect').value = db.configs.ultimoProdutoAula;
}

function renderAulas() {
  const root = $('#aulaContent');
  const schedule = getVisibleSchedule();
  if (!schedule.length) {
    root.innerHTML = emptyHTML('Nenhuma aula cadastrada no período ativo.');
    return;
  }
  activeTheoryLessonIndex = Math.max(0, Math.min(schedule.length - 1, activeTheoryLessonIndex));
  const activeLessonLaws = uniqueLawsForProducts(schedule[activeTheoryLessonIndex]?.produtos || []);
  root.innerHTML = `
    <div class="lesson-tabs" role="tablist">
      ${schedule.map((item, index) => `<button type="button" class="lesson-tab ${index === activeTheoryLessonIndex ? 'active' : ''}" data-theory-lesson="${index}">${lessonNumberLabel(index)}</button>`).join('')}
    </div>
    <div class="theory-lesson-list">
      ${schedule.map((item, index) => theoryScheduleLessonHTML(item, index)).join('')}
    </div>
    <div class="section-header"><div><h2>Referências legais</h2></div></div>
    <div class="stack-list law-list">${activeLessonLaws.map(lawCardHTML).join('') || emptyHTML('Nenhuma referência vinculada aos produtos desta aula.')}</div>`;
  root.querySelectorAll('[data-theory-lesson]').forEach(btn => btn.addEventListener('click', () => {
    activeTheoryLessonIndex = Number(btn.dataset.theoryLesson);
    activeTheoryImageIndex = 0;
    renderAulas();
  }));
  bindTheorySlides(root);
  root.querySelectorAll('[data-view-theory-content]').forEach(btn => btn.addEventListener('click', () => openTheoryContentView(btn.dataset.viewTheoryContent)));
  bindInternalLinks(root);
  bindLawLinks(root);
}

function theoryScheduleLessonHTML(item, index) {
  const categories = (item.categorias || []).map(getTheoryContent).filter(Boolean);
  return `<article class="theory-lesson-panel ${index === activeTheoryLessonIndex ? 'active' : ''}" data-theory-panel="${index}">
    <header class="theory-lesson-header">
      <div>
        <span>${lessonNumberLabel(index)}${item.dia ? ` · ${escapeHTML(formatScheduleDate(item.dia))}` : ''}</span>
        <h3>${escapeHTML(item.tema || lessonNumberLabel(index))}</h3>
      </div>
    </header>
    <div class="theory-subject-list">
      ${categories.map(theorySubjectListHTML).join('') || '<div class="notice-card slim">Nenhum assunto teórico vinculado a esta aula.</div>'}
    </div>
    <div class="lesson-links">
      ${(item.produtos || []).length ? `<div class="linked-block"><div class="linked-title">Roteiros</div>${linkedProductsHTML(item.produtos)}</div>` : ''}
    </div>
  </article>`;
}

function theorySubjectListHTML(content) {
  return `<button type="button" class="theory-subject-button" data-view-theory-content="${escapeAttr(content.id)}">
    <div>
      <strong>${escapeHTML(content.titulo)}</strong>
    </div>
    <b>›</b>
  </button>`;
}

function openTheoryContentView(id) {
  const content = getTheoryContent(id);
  if (!content) return toast('Conteúdo não encontrado.');
  $('#conteudoViewTitle').textContent = content.titulo;
  $('#conteudoViewBody').innerHTML = theoryLessonHTML(content, false);
  bindTheorySlides($('#conteudoViewBody'));
  bindInternalLinks($('#conteudoViewBody'));
  openModal('modalConteudoView');
}

function theorySlidesHTML(images) {
  const index = 0;
  return `<div class="theory-slides" data-theory-slides tabindex="0">
    <div class="theory-slide-frame">
      ${images.map((ref, imageIndex) => `<img src="${escapeAttr(resolveTheoryImage(ref))}" alt="Slide ${imageIndex + 1}" class="${imageIndex === index ? 'active' : ''}" data-theory-image="${imageIndex}">`).join('')}
    </div>
    <div class="theory-slide-controls">
      <button type="button" class="secondary-btn compact" data-theory-slide-prev>Voltar</button>
      <strong data-theory-slide-position>${index + 1} / ${images.length}</strong>
      <div class="theory-slide-actions">
        <button type="button" class="icon-command" data-theory-slide-fullscreen title="Tela cheia">⛶</button>
        <button type="button" class="primary-btn compact" data-theory-slide-next>Avançar</button>
      </div>
    </div>
  </div>`;
}

function bindTheorySlides(root) {
  root.querySelectorAll('[data-theory-slides]').forEach(wrap => {
    const images = Array.from(wrap.querySelectorAll('[data-theory-image]'));
    const position = wrap.querySelector('[data-theory-slide-position]');
    let index = 0;
    const show = next => {
      index = Math.max(0, Math.min(images.length - 1, next));
      images.forEach((image, imageIndex) => image.classList.toggle('active', imageIndex === index));
      if (position) position.textContent = `${index + 1} / ${images.length}`;
    };
    wrap.querySelector('[data-theory-slide-prev]')?.addEventListener('click', () => show(index - 1));
    wrap.querySelector('[data-theory-slide-next]')?.addEventListener('click', () => show(index + 1));
    wrap.querySelector('[data-theory-slide-fullscreen]')?.addEventListener('click', () => toggleTheoryFullscreen(wrap));
    wrap.addEventListener('click', () => {
      activeTheorySlideController = { wrap, show, getIndex: () => index, count: images.length };
      wrap.focus({ preventScroll: true });
    });
    activeTheorySlideController = { wrap, show, getIndex: () => index, count: images.length };
    requestAnimationFrame(() => wrap.focus({ preventScroll: true }));
  });
}

function renderLegislacao() {
  if (!$('#legislacaoList')) return;
  $('#legislacaoList').innerHTML = db.legislacoes.map(lawCardHTML).join('') || emptyHTML('Nenhuma referência legal cadastrada.');
  bindLawLinks($('#legislacaoList'));
}

function theoryLessonHTML(lesson, showTitle = true) {
  const content = getTheoryContent(lesson.id) || lesson;
  const showSlides = content.modo === 'slides' && content.imagens?.length;
  return `<article class="theory-card">
    ${showTitle ? `<h3>${escapeHTML(content.titulo)}</h3>` : ''}
    ${showSlides ? theorySlidesHTML(content.imagens) : `
      <p>${escapeHTML(content.resumo)}</p>
      <div class="theory-columns">
        <div>
          <h4>Tópicos</h4>
          ${unorderedList(content.topicos)}
        </div>
        <div>
          <h4>Perguntas</h4>
          ${unorderedList(content.perguntas)}
        </div>
      </div>`}
    <div class="linked-block">
      <div class="linked-title">Roteiros</div>
      ${linkedProductsHTML(content.produtos || [])}
    </div>
    <div class="linked-block">
      <div class="linked-title">Insumos citados</div>
      ${linkedIngredientsHTML(content.insumos || [])}
    </div>
  </article>`;
}

function linkedProductsHTML(ids) {
  return `<div class="linked-product-grid">${ids.map(id => {
    const p = findProduct(id);
    if (!p || p.oculto) return '';
    const photo = Array.isArray(p.fotos) ? p.fotos.find(Boolean) : '';
    const media = photo
      ? `<img src="${escapeAttr(photo)}" alt="">`
      : `<span>${escapeHTML(String(p.nome || '?').slice(0, 1).toUpperCase())}</span>`;
    return `<button type="button" class="linked-product-card" data-open-product="${escapeAttr(id)}">
      <div>${media}</div>
      <strong>${escapeHTML(p.nome)}</strong>
    </button>`;
  }).join('')}</div>`;
}

function linkedIngredientsHTML(ids) {
  return `<div class="link-chip-row">${ids.map(id => {
    const i = findIngredient(id);
    return i ? `<button type="button" class="link-chip" data-open-ingredient="${escapeAttr(id)}">${escapeHTML(i.nome)}</button>` : '';
  }).join('')}</div>`;
}

function bindInternalLinks(root) {
  root?.querySelectorAll('[data-open-product]').forEach(btn => btn.addEventListener('click', () => openProductWorkspace(btn.dataset.openProduct)));
  root?.querySelectorAll('[data-open-ingredient]').forEach(btn => btn.addEventListener('click', () => openIngredientView(btn.dataset.openIngredient)));
}

function lawCardHTML(law) {
  const linkedProducts = (law.produtoIds || []).map(findProduct).filter(Boolean);
  const linkLabel = linkedProducts.length > 1
    ? `Compartilhada entre ${linkedProducts.length} produtos`
    : linkedProducts[0]?.nome || 'Sem produto vinculado';
  return `<details class="law-card">
    <summary class="law-summary">
      <span class="law-marker" aria-hidden="true">●</span>
      <h3>${escapeHTML(lawDisplayTitle(law))}</h3>
      <p>${escapeHTML(law.resumo || '')}</p>
      <span class="law-toggle" aria-hidden="true">+</span>
    </summary>
    <div class="law-details">
      <div class="item-subtitle">${escapeHTML(law.orgao || '')} · ${escapeHTML(linkLabel)}</div>
      ${unorderedList(law.pontos || [])}
      ${law.url ? `<button type="button" class="secondary-btn full" data-open-url="${escapeAttr(law.url)}">Abrir referência</button>` : ''}
    </div>
  </details>`;
}

function lawAppliesToProduct(law, productId) {
  return Array.isArray(law?.produtoIds) && law.produtoIds.includes(productId);
}

function lawDedupKey(law) {
  return String(law?.url || law?.titulo || law?.id || '').trim().toLocaleLowerCase('pt-BR');
}

function uniqueProductLaws(productId) {
  return uniqueLawsForProducts([productId]);
}

function uniqueLawsForProducts(productIds = []) {
  const wanted = new Set(productIds);
  const seen = new Set();
  return db.legislacoes.filter(law => (law.produtoIds || []).some(id => wanted.has(id))).filter(law => {
    const key = lawDedupKey(law);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function lawDisplayTitle(law) {
  const labels = {
    leg_hamburguer_724_2022: 'Portaria SDA/MAPA nº 724/2022 - RTIQ do hambúrguer',
    leg_linguica_in4_2000: 'IN SDA/MAPA nº 4/2000 - RTIQ de linguiça',
    leg_salsicha_in4_2000: 'IN SDA/MAPA nº 4/2000 - RTIQ de salsicha',
    leg_riispoa_9013: 'Decreto nº 9.013/2017 - RIISPOA',
    leg_rotulagem_anvisa: 'RDC nº 429/2020 e IN nº 75/2020 - Rotulagem nutricional'
  };
  return labels[law.id] || law.titulo || 'Referência legal';
}

function bindLawLinks(root) {
  root?.querySelectorAll('[data-open-url]').forEach(btn => btn.addEventListener('click', () => window.open(btn.dataset.openUrl, '_blank', 'noopener')));
}

function openProductModal(id = null) {
  if (!requirePermission('manage.products')) return;
  const p = id ? findProduct(id) : null;
  productVisibilityDraft = Boolean(p?.oculto);
  $('#produtoId').value = p?.id || '';
  $('#produtoNome').value = p?.nome || '';
  $('#produtoCategoria').value = p?.categoria || '';
  setMultiSelectValues($('#produtoCategoriaDidatica'), normalizeCategoryIds(p));
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
  $('#produtoEquipamentos').value = (p?.equipamentos || []).join('\n');
  $('#produtoPerguntas').value = (p?.perguntas || []).join('\n');
  tempProductReferenceDrafts = p ? uniqueProductLaws(p.id).map(clone) : [];
  renderProductReferenceDrafts();
  tempProductPhotos = clone(p?.fotos || []);
  $('#produtoFotos').value = '';
  renderProductPhotoPreview();
  $('#btnExcluirProduto').style.display = p ? 'inline-flex' : 'none';
  renderProductVisibilityButton();
  openModal('modalProduto');
}

function renderProductReferenceDrafts() {
  const wrap = $('#produtoReferenciasEditor');
  const select = $('#produtoReferenciaExistente');
  if (!wrap || !select) return;
  const linkedIds = new Set(tempProductReferenceDrafts.map(law => law.id));
  const available = db.legislacoes.filter(law => !linkedIds.has(law.id));
  select.innerHTML = `<option value="">Selecione uma referência cadastrada</option>${available.map(law => `<option value="${escapeAttr(law.id)}">${escapeHTML(lawDisplayTitle(law))}</option>`).join('')}`;
  wrap.innerHTML = tempProductReferenceDrafts.length ? tempProductReferenceDrafts.map((law, index) => `
    <div class="reference-editor-card" data-reference-index="${index}">
      <div class="reference-editor-head">
        <strong>Referência ${index + 1}</strong>
        <button type="button" class="tiny-btn" data-remove-reference="${index}" title="Desvincular deste produto">×</button>
      </div>
      <div class="form-grid two-cols">
        <div class="form-group"><label>Título</label><input type="text" data-reference-field="titulo" value="${escapeAttr(law.titulo || '')}"></div>
        <div class="form-group"><label>Órgão ou fonte</label><input type="text" data-reference-field="orgao" value="${escapeAttr(law.orgao || '')}"></div>
      </div>
      <div class="form-group"><label>Link original</label><input type="url" data-reference-field="url" value="${escapeAttr(law.url || '')}" placeholder="https://..."></div>
      <div class="form-group"><label>Resumo</label><textarea rows="2" data-reference-field="resumo">${escapeHTML(law.resumo || '')}</textarea></div>
      <div class="form-group"><label>Pontos principais, um por linha</label><textarea rows="3" data-reference-field="pontos">${escapeHTML((law.pontos || []).join('\n'))}</textarea></div>
    </div>`).join('') : '<div class="notice-card slim">Nenhuma referência vinculada a este produto.</div>';
}

function addProductReferenceDraft() {
  tempProductReferenceDrafts.push({ id: uid('leg'), produtoIds: [], titulo: '', orgao: '', url: '', resumo: '', pontos: [] });
  renderProductReferenceDrafts();
  $('#produtoReferenciasEditor .reference-editor-card:last-child input')?.focus();
}

function linkExistingProductReference() {
  const id = $('#produtoReferenciaExistente')?.value;
  const law = db.legislacoes.find(item => item.id === id);
  if (!law) return toast('Selecione uma referência existente.');
  tempProductReferenceDrafts.push(clone(law));
  renderProductReferenceDrafts();
}

function updateProductReferenceDraft(event) {
  const field = event.target?.dataset?.referenceField;
  const index = Number(event.target?.closest('[data-reference-index]')?.dataset.referenceIndex);
  if (!field || !Number.isInteger(index) || !tempProductReferenceDrafts[index]) return;
  tempProductReferenceDrafts[index][field] = field === 'pontos' ? linesFrom(event.target.value) : event.target.value;
}

function removeProductReferenceDraft(event) {
  const button = event.target.closest('[data-remove-reference]');
  if (!button) return;
  tempProductReferenceDrafts.splice(Number(button.dataset.removeReference), 1);
  renderProductReferenceDrafts();
}

function saveProductReferences(productId) {
  const draftIds = new Set(tempProductReferenceDrafts.map(law => law.id));
  db.legislacoes.forEach(law => {
    if (lawAppliesToProduct(law, productId) && !draftIds.has(law.id)) {
      law.produtoIds = law.produtoIds.filter(id => id !== productId);
    }
  });
  tempProductReferenceDrafts.forEach(draft => {
    if (!String(draft.titulo || '').trim()) return;
    let law = db.legislacoes.find(item => item.id === draft.id);
    if (!law) {
      law = { id: draft.id || uid('leg'), produtoIds: [] };
      db.legislacoes.push(law);
    }
    Object.assign(law, {
      titulo: String(draft.titulo || '').trim(),
      orgao: String(draft.orgao || '').trim(),
      url: String(draft.url || '').trim(),
      resumo: String(draft.resumo || '').trim(),
      pontos: Array.isArray(draft.pontos) ? draft.pontos : linesFrom(draft.pontos)
    });
    law.produtoIds = Array.from(new Set([...(law.produtoIds || []), productId]));
  });
  db.legislacoes = db.legislacoes.filter(law => (law.produtoIds || []).length > 0);
}

function toggleProductVisibilityDraft() {
  productVisibilityDraft = !productVisibilityDraft;
  renderProductVisibilityButton();
}

function renderProductVisibilityButton() {
  const button = $('#btnToggleProdutoVisibilidade');
  if (!button) return;
  button.classList.toggle('locked', productVisibilityDraft);
  button.textContent = productVisibilityDraft ? '🔒 Oculto' : '🔓 Visível';
  button.title = productVisibilityDraft ? 'Mostrar produto para os alunos' : 'Ocultar produto dos alunos';
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
    <div class="photo-wrap"><img class="photo-thumb" src="${escapeAttr(src)}" alt="Foto"><button type="button" class="photo-remove" data-remove-photo="${index}">×</button></div>
  `).join('');
  wrap.querySelectorAll('[data-remove-photo]').forEach(btn => btn.addEventListener('click', () => {
    tempProductPhotos.splice(Number(btn.dataset.removePhoto), 1);
    renderProductPhotoPreview();
  }));
}

function saveProductFromModal() {
  if (!requirePermission('manage.products')) return;
  const id = $('#produtoId').value || uid('prod');
  const categoriaIds = multiSelectValues($('#produtoCategoriaDidatica'));
  const product = {
    id,
    nome: $('#produtoNome').value.trim(),
    categoria: $('#produtoCategoria').value.trim(),
    categoriaId: categoriaIds[0] || '',
    categoriaIds,
    especie: findProduct(id)?.especie || '',
    tipo: findProduct(id)?.tipo || inferProductTypeFromName($('#produtoNome').value),
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
    equipamentos: linesFrom($('#produtoEquipamentos').value),
    perguntas: linesFrom($('#produtoPerguntas').value)
  };
  product.oculto = productVisibilityDraft;
  if (!product.nome) return toast('Informe o nome do produto.');
  product.categoriaIds = product.categoriaIds.length ? product.categoriaIds : inferProductCategoryIds(product);
  product.categoriaId = product.categoriaIds[0] || inferProductCategoryId(product);
  const idx = db.produtos.findIndex(p => p.id === id);
  if (idx >= 0) db.produtos[idx] = product; else db.produtos.push(product);
  saveProductReferences(id);
  activeProductId = id;
  db.configs.ultimoProdutoAula = id;
  db.configs.produtoSelecionado = id;
  saveDB();
  closeModal('modalProduto');
  renderAll();
  toast('Produto salvo.');
}

function deleteProductFromModal() {
  if (!requirePermission('manage.products')) return;
  const id = $('#produtoId').value;
  if (!id) return;
  const product = findProduct(id);
  if (!product) return;
  openConfirmation({
    title: 'Excluir produto',
    message: `Para excluir "${product.nome}" e suas formulações, digite exatamente "quero excluir".`,
    confirmLabel: 'Excluir produto',
    requireText: 'quero excluir',
    action: () => performProductDeletion(id)
  });
}

function performProductDeletion(id) {
  db.produtos = db.produtos.filter(p => p.id !== id);
  db.formulacoes = db.formulacoes.filter(f => f.produtoId !== id);
  db.legislacoes.forEach(law => { law.produtoIds = (law.produtoIds || []).filter(productId => productId !== id); });
  db.legislacoes = db.legislacoes.filter(law => law.produtoIds.length > 0);
  activeProductId = '';
  db.configs.produtoSelecionado = '';
  saveDB();
  closeModal('modalProduto');
  renderAll();
  toast('Produto excluído.');
}

function populateTypeOptions() {
  $('#insumoTipo').innerHTML = TYPES.map(t => `<option value="${escapeAttr(t.value)}">${escapeHTML(t.label)}</option>`).join('');
  populateSubtypeOptions($('#insumoTipo')?.value || TYPES[0]?.value);
}

function populateSubtypeOptions(type, selected = '') {
  const select = $('#insumoSubtipo');
  if (!select) return;
  const options = ingredientSubtypes(type);
  select.innerHTML = [`<option value="">Sem subdivisão</option>`, ...options.map(value => `<option value="${escapeAttr(value)}">${escapeHTML(capitalizeFirst(value))}</option>`)].join('');
  if (selected && options.includes(selected)) select.value = selected;
}

function populateProductCategoryOptions() {
  const select = $('#produtoCategoriaDidatica');
  if (!select) return;
  select.innerHTML = PRODUCT_CATEGORIES.map(category => `<option value="${escapeAttr(category.id)}">${escapeHTML(theoryTitle(category.id))}</option>`).join('');
}

function openIngredientModal(id = null) {
  if (!requirePermission('manage.ingredients')) return;
  const i = id ? findIngredient(id) : null;
  $('#insumoId').value = i?.id || '';
  $('#insumoNome').value = i?.nome || '';
  $('#insumoTipo').value = i ? normalizeIngredientType(i) : TYPES[0].value;
  populateSubtypeOptions($('#insumoTipo').value, i?.subtipo || '');
  $('#insumoFuncao').value = i?.funcao || '';
  $('#insumoObs').value = i?.obs || '';
  $('#insumoGordura').value = i?.gordura ?? 0;
  $('#insumoProteina').value = i?.proteina ?? 0;
  $('#insumoCarbo').value = i?.carboidrato ?? 0;
  $('#insumoCusto').value = i?.custo ?? 0;
  $('#insumoUsadoNaFormulacao').checked = i ? i.usadoNaFormulacao !== false : true;
  $('#insumoPnc').checked = Boolean(i?.proteinaNaoCarnea);
  $('#insumoAlergeno').checked = Boolean(i?.alergeno);
  tempIngredientPhoto = i?.foto || '';
  $('#insumoFoto').value = '';
  renderIngredientPhotoPreview();
  $('#btnExcluirInsumo').style.display = i ? 'inline-flex' : 'none';
  openModal('modalInsumo');
}

async function handleIngredientPhoto(ev) {
  const file = Array.from(ev.target.files || []).find(item => item.type.startsWith('image/'));
  if (!file) return;
  tempIngredientPhoto = await fileToDataURL(file, 1000, 0.82);
  renderIngredientPhotoPreview();
}

function renderIngredientPhotoPreview() {
  const wrap = $('#insumoFotoPreview');
  if (!wrap) return;
  wrap.innerHTML = tempIngredientPhoto ? `
    <div class="photo-wrap"><img class="photo-thumb" src="${escapeAttr(tempIngredientPhoto)}" alt="Foto"><button type="button" class="photo-remove" data-remove-ingredient-photo>×</button></div>
  ` : '';
  wrap.querySelector('[data-remove-ingredient-photo]')?.addEventListener('click', () => {
    tempIngredientPhoto = '';
    $('#insumoFoto').value = '';
    renderIngredientPhotoPreview();
  });
}

function openIngredientView(id = null) {
  const i = findIngredient(id);
  if (!i) return toast('Insumo não encontrado.');
  $('#insumoViewTitle').textContent = i.nome;
  $('#insumoViewContent').innerHTML = `
    <div class="ingredient-view-card">
      ${i.foto ? `<img class="ingredient-view-photo" src="${escapeAttr(i.foto)}" alt="">` : ''}
      <div class="item-meta">
        <span class="badge info">${escapeHTML(typeLabel(i.tipo))}</span>
        ${i.subtipo ? `<span class="badge">${escapeHTML(capitalizeFirst(i.subtipo))}</span>` : ''}
        ${i.usadoNaFormulacao === false ? '<span class="badge">Fora da formulação</span>' : ''}
        ${i.alergeno ? '<span class="badge danger">alérgeno</span>' : ''}
        ${i.proteinaNaoCarnea ? '<span class="badge warn">proteína agregada</span>' : ''}
      </div>
      <div class="ingredient-view-section">
        <h3>Função tecnológica</h3>
        <p>${escapeHTML(i.funcao || 'Função não cadastrada.')}</p>
      </div>
      ${i.obs ? `<div class="ingredient-view-section"><h3>Observação</h3><p>${escapeHTML(i.obs)}</p></div>` : ''}
      <div class="analysis-grid ingredient-metrics">
        <div class="analysis-metric"><strong>${fmt(i.gordura)}%</strong><span>Gordura</span></div>
        <div class="analysis-metric"><strong>${fmt(i.proteina)}%</strong><span>Proteína</span></div>
        <div class="analysis-metric"><strong>${fmt(i.carboidrato)}%</strong><span>Carboidrato</span></div>
      </div>
    </div>`;
  openModal('modalInsumoView');
}

function saveIngredientFromModal() {
  if (!requirePermission('manage.ingredients')) return;
  const id = $('#insumoId').value || uid('ing');
  const existingIngredient = findIngredient(id);
  const ingredient = {
    id,
    nome: $('#insumoNome').value.trim(),
    categoria: typeLabel($('#insumoTipo').value),
    tipo: $('#insumoTipo').value,
    subtipo: $('#insumoSubtipo').value,
    funcao: $('#insumoFuncao').value.trim(),
    obs: $('#insumoObs').value.trim(),
    gordura: toNumber($('#insumoGordura').value),
    proteina: toNumber($('#insumoProteina').value),
    carboidrato: toNumber($('#insumoCarbo').value),
    custo: toNumber($('#insumoCusto').value),
    usadoNaFormulacao: $('#insumoUsadoNaFormulacao').checked,
    proteinaNaoCarnea: $('#insumoPnc').checked || isFunctionalProtein({ tipo: $('#insumoTipo').value, subtipo: $('#insumoSubtipo').value, nome: $('#insumoNome').value }),
    alergeno: $('#insumoAlergeno').checked,
    foto: tempIngredientPhoto,
    ...(existingIngredient?.curaTipo ? { curaTipo: existingIngredient.curaTipo } : {})
  };
  if (!ingredient.nome) return toast('Informe o nome do insumo.');
  const idx = db.insumos.findIndex(i => i.id === id);
  if (idx >= 0) db.insumos[idx] = ingredient; else db.insumos.push(ingredient);
  saveDB();
  closeModal('modalInsumo');
  renderAll();
  if ($('#modalFormula')?.classList.contains('show')) {
    renderFormulaFilters();
    renderFormulaItems();
  }
  toast('Insumo salvo.');
}

function deleteIngredientFromModal() {
  if (!requirePermission('manage.ingredients')) return;
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

function openFormulaModal(id = null, productId = null) {
  if (!requirePermission('manage.formulas')) return;
  renderFormulaFilters();
  const f = id ? findFormula(id) : null;
  const selectedProduct = productId || activeProductId || db.produtos[0]?.id || '';
  const product = findProduct(f?.produtoId || selectedProduct);
  $('#formulaId').value = f?.id || '';
  $('#formulaProduto').value = f?.produtoId || selectedProduct;
  $('#formulaNome').value = f?.nome || '';
  $('#formulaPeso').value = f?.pesoReferencia || 1000;
  $('#formulaBaseCalculo').value = f?.baseCalculo || defaultFormulaBase(product);
  $('#formulaRendimento').value = f?.rendimento ?? '';
  $('#formulaObs').value = f?.observacoes || '';
  formulaDraftItems = clone(f?.itens || [{ insumoId: formulaEligibleIngredients()[0]?.id || '', percentual: 100 }]);
  $('#btnExcluirFormula').style.display = f ? 'inline-flex' : 'none';
  renderFormulaItems();
  openModal('modalFormula');
}

function renderFormulaItems() {
  const draft = getFormulaFromModal(false);
  $('#formulaItens').innerHTML = formulaDraftItems.map((item, idx) => {
    const grams = formulaItemGrams(draft, item);
    const options = formulaEligibleIngredients(item.insumoId);
    return `<tr>
      <td><select data-row-insumo="${idx}">${options.map(i => `<option value="${escapeAttr(i.id)}" ${i.id === item.insumoId ? 'selected' : ''}>${escapeHTML(i.nome)}</option>`).join('')}</select></td>
      <td><input type="number" step="0.1" data-row-pct="${idx}" value="${escapeAttr(item.percentual)}"></td>
      <td><strong data-row-grams="${idx}">${fmt(grams)} g</strong></td>
      <td><button type="button" class="tiny-btn" data-row-del="${idx}" title="Remover">×</button></td>
    </tr>`;
  }).join('');
  $('#formulaItens').querySelectorAll('[data-row-insumo]').forEach(el => el.addEventListener('change', () => {
    formulaDraftItems[Number(el.dataset.rowInsumo)].insumoId = el.value;
    renderFormulaSummary();
  }));
  $('#formulaItens').querySelectorAll('[data-row-pct]').forEach(el => el.addEventListener('input', () => {
    const idx = Number(el.dataset.rowPct);
    formulaDraftItems[idx].percentual = toNumber(el.value);
    const draft = getFormulaFromModal(false);
    const grams = formulaItemGrams(draft, formulaDraftItems[idx]);
    const gramsCell = $(`[data-row-grams="${idx}"]`);
    if (gramsCell) gramsCell.textContent = `${fmt(grams)} g`;
    renderFormulaSummary();
  }));
  $('#formulaItens').querySelectorAll('[data-row-del]').forEach(el => el.addEventListener('click', () => {
    formulaDraftItems.splice(Number(el.dataset.rowDel), 1);
    renderFormulaItems();
  }));
  renderFormulaSummary();
}

function formulaEligibleIngredients(currentId = '') {
  return db.insumos
    .filter(ingredient => ingredient.usadoNaFormulacao !== false || ingredient.id === currentId)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function renderFormulaSummary() {
  const draft = getFormulaFromModal(false);
  $('#formulaResumo').innerHTML = analysisHTML(analyzeFormula(draft));
}

function getFormulaFromModal(requireName = true) {
  const existing = findFormula($('#formulaId').value);
  return {
    id: $('#formulaId').value || uid('form'),
    produtoId: $('#formulaProduto').value,
    nome: $('#formulaNome').value.trim() || (requireName ? '' : 'Formulação em edição'),
    pesoReferencia: toNumber($('#formulaPeso').value) || 1000,
    baseCalculo: $('#formulaBaseCalculo').value || defaultFormulaBase(findProduct($('#formulaProduto').value)),
    rendimento: numberOrBlank($('#formulaRendimento').value),
    itens: formulaDraftItems.map(item => ({
      insumoId: item.insumoId,
      percentual: toNumber(item.percentual),
      ...(isCureSaltId(item.insumoId) ? { cura: clone(item.cura || { teorPct: DEFAULT_CURE_CONCENTRATION_PCT, ppm: CURE_LIMIT_PPM }) } : {})
    })).filter(item => item.insumoId),
    observacoes: $('#formulaObs').value.trim(),
    usarBlend: existing?.usarBlend === true,
    blendComponentes: clone(existing?.blendComponentes || []),
    materiaPrimaUnica: clone(existing?.materiaPrimaUnica || null),
    bloqueada: Boolean(existing?.bloqueada)
  };
}

function saveFormulaFromModal() {
  if (!requirePermission('manage.formulas')) return;
  const formula = getFormulaFromModal(true);
  if (!formula.produtoId) return toast('Selecione um produto.');
  if (!formula.nome) return toast('Informe o nome da formulação.');
  if (!formula.itens.length) return toast('Adicione ao menos um insumo.');
  formula.itens.forEach(item => {
    if (!isCureSaltId(item.insumoId)) return;
    item.cura = item.cura || { teorPct: DEFAULT_CURE_CONCENTRATION_PCT, ppm: CURE_LIMIT_PPM };
    item.percentual = cureSaltPercent(formula, item);
  });
  const idx = db.formulacoes.findIndex(f => f.id === formula.id);
  if (idx >= 0) db.formulacoes[idx] = formula; else db.formulacoes.push(formula);
  activeProductId = formula.produtoId;
  db.configs.produtoSelecionado = formula.produtoId;
  db.configs.ultimoProdutoAula = formula.produtoId;
  saveDB();
  closeModal('modalFormula');
  renderAll();
  toast('Formulação salva.');
}

function deleteFormulaFromModal() {
  if (!requirePermission('manage.formulas')) return;
  const id = $('#formulaId').value;
  if (!id) return;
  if (!confirm('Excluir esta formulação?')) return;
  db.formulacoes = db.formulacoes.filter(f => f.id !== id);
  saveDB();
  closeModal('modalFormula');
  renderAll();
  toast('Formulação excluída.');
}

function updateFormulaWeight(formulaId, value, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula) return;
  formula.pesoReferencia = Math.max(1, toNumber(value) || 1);
  saveInlineFormulaEdit('Peso atualizado.', { ...options, formulaId });
}

function updateFormulaBase(formulaId, value, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula) return;
  formula.baseCalculo = value === 'produto_final' ? 'produto_final' : 'massa_carnea';
  saveInlineFormulaEdit('Base de cálculo atualizada.', { ...options, formulaId });
}

function updateFormulaItemPercent(formulaId, insumoId, value, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || !insumoId || formula.bloqueada) return;
  const item = ensureFormulaItem(formula, insumoId);
  const ingredient = findIngredient(insumoId);
  item.percentual = Math.max(0, ingredientSuggestion(ingredient) ? roundOneDecimal(value) : toNumber(value));
  saveInlineFormulaEdit('Percentual atualizado.', { ...options, formulaId });
}

function updateCureComposition(formulaId, insumoId, changes = {}, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada || !isCureSaltId(insumoId)) return;
  const item = ensureFormulaItem(formula, insumoId);
  item.cura = item.cura || { teorPct: DEFAULT_CURE_CONCENTRATION_PCT, ppm: CURE_LIMIT_PPM };
  if (Object.prototype.hasOwnProperty.call(changes, 'teorPct')) item.cura.teorPct = Math.max(0.01, toNumber(changes.teorPct) || DEFAULT_CURE_CONCENTRATION_PCT);
  item.cura.ppm = Math.min(CURE_LIMIT_PPM, Math.max(0, String(item.cura.ppm ?? '').trim() === '' ? CURE_LIMIT_PPM : toNumber(item.cura.ppm)));
  item.percentual = cureSaltPercent(formula, item);
  saveInlineFormulaEdit('Composição do sal de cura atualizada.', { ...options, formulaId });
}

function updateCurePpm(formulaId, insumoId, value, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada || !isCureSaltId(insumoId)) return;
  const item = ensureFormulaItem(formula, insumoId);
  item.cura = item.cura || { teorPct: DEFAULT_CURE_CONCENTRATION_PCT, ppm: CURE_LIMIT_PPM };
  item.cura.ppm = Math.min(CURE_LIMIT_PPM, Math.max(0, toNumber(value)));
  item.cura.teorPct = Math.max(0.01, toNumber(item.cura.teorPct || DEFAULT_CURE_CONCENTRATION_PCT));
  item.percentual = cureSaltPercent(formula, item);
  saveInlineFormulaEdit('Sal de cura recalculado.', { ...options, formulaId });
}

function addFormulaItemInline(formulaId, insumoId) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  const ingredient = findIngredient(insumoId);
  if (!formula || !ingredient || formula.bloqueada) return;
  const existing = (formula.itens || []).find(item => item.insumoId === insumoId);
  if (existing?.removido) return restoreFormulaItemInline(formulaId, insumoId);
  if (existing) return toast('Esse insumo já está na formulação.');
  const suggestion = ingredientSuggestion(ingredient);
  const newItem = {
    insumoId,
    percentual: suggestion?.suave ?? 0.1,
    ...(isCureSaltIngredient(ingredient) ? { cura: { teorPct: DEFAULT_CURE_CONCENTRATION_PCT, ppm: CURE_LIMIT_PPM } } : {})
  };
  if (isCureSaltIngredient(ingredient)) newItem.percentual = cureSaltPercent(formula, newItem);
  formula.itens.push(newItem);
  saveInlineFormulaEdit('Insumo adicionado.', { formulaId });
}

function removeFormulaItemInline(formulaId, insumoId) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  const item = (formula.itens || []).find(row => row.insumoId === insumoId);
  if (!item) return;
  if (isDefaultFormulaItem(formula, insumoId)) {
    item.removido = true;
    item.percentualOriginal = item.percentualOriginal ?? toNumber(item.percentual);
  } else {
    formula.itens = (formula.itens || []).filter(row => row.insumoId !== insumoId);
  }
  saveInlineFormulaEdit('Insumo removido.', { formulaId });
}

function restoreFormulaItemInline(formulaId, insumoId) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  const item = (formula.itens || []).find(row => row.insumoId === insumoId);
  if (!item) return;
  item.removido = false;
  if (toNumber(item.percentual) === 0 && item.percentualOriginal !== undefined) item.percentual = item.percentualOriginal;
  saveInlineFormulaEdit('Insumo restaurado.', { formulaId });
}

function requestFormulaItemRemoval(formulaId, insumoId) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  const ingredient = findIngredient(insumoId);
  openConfirmation({
    title: 'Excluir insumo',
    message: `Deseja excluir "${ingredient?.nome || 'este insumo'}" desta formulação?`,
    confirmLabel: 'Excluir',
    action: () => removeFormulaItemInline(formulaId, insumoId)
  });
}

function toggleFormulaLock(formulaId) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula) return;
  formula.bloqueada = !formula.bloqueada;
  saveInlineFormulaEdit(formula.bloqueada ? 'Formulação travada.' : 'Formulação destravada.', { formulaId });
}

function updateFormulaBlend(formulaId, changes = {}, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  const previous = formulaBlendState(formula);
  const useBlend = changes.useBlend ?? previous.useBlend;

  if (!useBlend) {
    const first = previous.components[0] || previous.singleComponent;
    const total = Math.max(1, toNumber(previous.blendGrams ?? changes.blendGrams ?? formula.pesoReferencia) || 1);
    formula.usarBlend = false;
    formula.materiaPrimaUnica = {
      id: formula.materiaPrimaUnica?.id || uid('materia'),
      corteId: first?.corteId || 'acem',
      perfil: first?.perfil || normalizeMeatProfile('', first?.corteId || 'acem'),
      gramas: total,
      gorduraCustom: first?.gorduraCustom ?? ''
    };
    setFormulaWeightFromBlendTotal(formula, total);
    saveInlineFormulaEdit('Blend atualizado.', { ...options, formulaId });
    return;
  }

  formula.usarBlend = true;
  const single = normalizeSingleMaterial(formula.materiaPrimaUnica, formula);
  formula.blendComponentes = normalizeBlendComponents(formula.blendComponentes, formula);
  if (formula.blendComponentes.length < 2) {
    formula.blendComponentes[0] = { ...single, id: formula.blendComponentes[0]?.id || uid('blend') };
    formula.blendComponentes.push(defaultSecondBlendComponent(formula, { singleComponent: single }));
  }
  saveInlineFormulaEdit('Blend atualizado.', { ...options, formulaId });
}

function defaultSecondBlendComponent(formula, state = {}) {
  const first = state.singleComponent || state.components?.[0] || normalizeSingleMaterial(formula.materiaPrimaUnica, formula);
  const isPork = first.corteId.includes('suino');
  return {
    id: uid('blend'),
    corteId: isPork ? 'toucinho_suino' : 'gordura_bovina',
    perfil: 'com_gordura',
    gramas: 0,
    gorduraCustom: ''
  };
}

function updateBlendComponent(formulaId, index, changes = {}, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  formula.blendComponentes = normalizeBlendComponents(formula.blendComponentes, formula);
  const component = formula.blendComponentes[index];
  if (!component) return;
  if (Object.prototype.hasOwnProperty.call(changes, 'corteId')) {
    component.corteId = MEAT_CUTS.some(cut => cut.id === changes.corteId) ? changes.corteId : 'outro';
    component.perfil = normalizeMeatProfile(component.perfil, component.corteId);
  }
  if (Object.prototype.hasOwnProperty.call(changes, 'perfil')) component.perfil = normalizeMeatProfile(changes.perfil, component.corteId);
  if (Object.prototype.hasOwnProperty.call(changes, 'gramas')) component.gramas = Math.max(0, toNumber(changes.gramas));
  if (Object.prototype.hasOwnProperty.call(changes, 'gorduraCustom')) component.gorduraCustom = changes.gorduraCustom === '' ? '' : Math.max(0, Math.min(100, toNumber(changes.gorduraCustom)));
  formula.usarBlend = true;
  const total = formula.blendComponentes.reduce((sum, item) => sum + toNumber(item.gramas), 0);
  if (total > 0) setFormulaWeightFromBlendTotal(formula, total);
  saveInlineFormulaEdit('Blend atualizado.', { ...options, formulaId });
}

function addBlendComponent(formulaId) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  formula.blendComponentes = normalizeBlendComponents(formula.blendComponentes, formula);
  formula.blendComponentes.push({ id: uid('blend'), corteId: 'acem', perfil: 'sem_gordura', gramas: 0, gorduraCustom: '' });
  formula.usarBlend = true;
  saveInlineFormulaEdit('Componente adicionado.', { formulaId });
}

function removeBlendComponent(formulaId, index) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  formula.blendComponentes = normalizeBlendComponents(formula.blendComponentes, formula);
  if (formula.blendComponentes.length <= 1) return toast('O blend precisa manter ao menos um componente.');
  formula.blendComponentes.splice(index, 1);
  const total = formula.blendComponentes.reduce((sum, item) => sum + toNumber(item.gramas), 0);
  if (total > 0) setFormulaWeightFromBlendTotal(formula, total);
  saveInlineFormulaEdit('Componente removido.', { formulaId });
}

function updateSingleMaterial(formulaId, changes = {}, options = {}) {
  if (!canEditFormula()) return;
  const formula = findFormula(formulaId);
  if (!formula || formula.bloqueada) return;
  formula.materiaPrimaUnica = normalizeSingleMaterial(formula.materiaPrimaUnica, formula);
  const component = formula.materiaPrimaUnica;
  if (Object.prototype.hasOwnProperty.call(changes, 'corteId')) {
    component.corteId = MEAT_CUTS.some(cut => cut.id === changes.corteId) ? changes.corteId : 'outro';
    component.perfil = normalizeMeatProfile(component.perfil, component.corteId);
  }
  if (Object.prototype.hasOwnProperty.call(changes, 'perfil')) component.perfil = normalizeMeatProfile(changes.perfil, component.corteId);
  if (Object.prototype.hasOwnProperty.call(changes, 'gramas')) component.gramas = Math.max(1, toNumber(changes.gramas) || 1);
  if (Object.prototype.hasOwnProperty.call(changes, 'gorduraCustom')) component.gorduraCustom = changes.gorduraCustom === '' ? '' : Math.max(0, Math.min(100, toNumber(changes.gorduraCustom)));
  formula.usarBlend = false;
  setFormulaWeightFromBlendTotal(formula, component.gramas);
  saveInlineFormulaEdit('Matéria-prima atualizada.', { ...options, formulaId });
}

function queueInlineFormulaEdit(callback) {
  clearTimeout(inlineEditTimer);
  inlineEditTimer = setTimeout(callback, 650);
}

function saveInlineFormulaEdit(message, options = {}) {
  const currentSlide = $('#produtoWorkspace .product-slide.active')?.dataset.slidePanel;
  const scrollTop = $('.content')?.scrollTop || 0;
  if (currentSlide) activeProductSlideId = currentSlide;
  saveDB();
  const updated = options.light && options.formulaId
    ? refreshFormulaNumbers(options.formulaId)
    : refreshActiveFormulaCard(options.formulaId);
  if (!updated) {
    renderProdutos();
    if (currentSlide) $('#produtoWorkspace [data-product-slide="' + cssEscape(currentSlide) + '"]')?.click();
  }
  requestAnimationFrame(() => {
    if ($('.content')) $('.content').scrollTop = scrollTop;
  });
  if (!options.silent) toast(message);
}

function refreshActiveFormulaCard(formulaId) {
  const formula = findFormula(formulaId);
  const card = formulaId ? $('#produtoWorkspace [data-formula-card="' + cssEscape(formulaId) + '"]') : null;
  if (!formula || !card) return false;
  card.outerHTML = productFormulaHTML(formula);
  const newCard = $('#produtoWorkspace [data-formula-card="' + cssEscape(formulaId) + '"]');
  if (newCard) bindFormulaControls(newCard);
  return true;
}

function refreshFormulaNumbers(formulaId) {
  const formula = findFormula(formulaId);
  const card = formulaId ? $('#produtoWorkspace [data-formula-card="' + cssEscape(formulaId) + '"]') : null;
  if (!formula || !card) return false;
  (formula.itens || []).forEach(item => {
    const grams = card.querySelector('[data-inline-grams="' + cssEscape(formulaId) + '"][data-inline-grams-insumo="' + cssEscape(item.insumoId) + '"]');
    if (grams) grams.textContent = `${isCureSaltId(item.insumoId) ? fmtFixed2(formulaItemGrams(formula, item)) : fmt(formulaItemGrams(formula, item))} g`;
  });
  const analysis = card.querySelector('.formula-analysis-wrap');
  if (analysis) analysis.innerHTML = analysisHTML(analyzeFormula(formula));
  return true;
}

function ensureFormulaItem(formula, insumoId) {
  formula.itens = Array.isArray(formula.itens) ? formula.itens : [];
  let item = formula.itens.find(row => row.insumoId === insumoId);
  if (!item) {
    item = { insumoId, percentual: 0 };
    formula.itens.push(item);
  }
  return item;
}

function isDefaultFormulaItem(formula, insumoId) {
  const def = DEFAULT_DB.formulacoes.find(item => item.id === formula?.id);
  return Boolean(def?.itens?.some(item => item.insumoId === insumoId));
}

function formulaBlendSourceItems(formula, ingredients = db.insumos) {
  return (formula?.itens || []).filter(item => !item.removido && isMeatIngredient((ingredients || []).find(ingredient => ingredient.id === item.insumoId)));
}

function setFormulaWeightFromBlendTotal(formula, blendTotal) {
  const meatPct = formulaBlendSourceItems(formula).reduce((sum, item) => sum + formulaItemPercent(item), 0);
  if (formulaBaseMode(formula) === 'produto_final' && meatPct > 0 && meatPct < 100) {
    formula.pesoReferencia = Math.max(1, blendTotal / (meatPct / 100));
    return;
  }
  formula.pesoReferencia = Math.max(1, blendTotal);
}

function isBlendItem(insumoId, formula) {
  const item = (formula?.itens || []).find(row => row.insumoId === insumoId);
  return Boolean(item && isMeatIngredient(findIngredient(insumoId)));
}

function formulaBlendState(formula) {
  const useBlend = formula.usarBlend === true;
  const components = normalizeBlendComponents(formula.blendComponentes, formula).map(component => ({
    ...component,
    cut: MEAT_CUTS.find(cut => cut.id === component.corteId) || MEAT_CUTS[MEAT_CUTS.length - 1]
  }));
  const singleComponent = normalizeSingleMaterial(formula.materiaPrimaUnica, formula);
  const blendGrams = components.reduce((sum, item) => sum + toNumber(item.gramas), 0) || toNumber(formula.pesoReferencia);
  const fatGrams = components.reduce((sum, item) => sum + toNumber(item.gramas) * blendComponentFat(item) / 100, 0);
  const activeComponents = useBlend ? components : [singleComponent];
  const activeGrams = useBlend ? blendGrams : toNumber(singleComponent.gramas);
  const activeFatGrams = activeComponents.reduce((sum, item) => sum + toNumber(item.gramas) * blendComponentFat(item) / 100, 0);
  return {
    useBlend,
    components,
    singleComponent,
    blendGrams: activeGrams || toNumber(formula.pesoReferencia),
    fatGrams: activeFatGrams,
    fatPct: activeGrams ? activeFatGrams / activeGrams * 100 : 0
  };
}

function normalizeSingleMaterial(source, formula, ingredients = db.insumos) {
  if (source && typeof source === 'object') {
    const corteId = MEAT_CUTS.some(cut => cut.id === source.corteId) ? source.corteId : 'outro';
    return {
      id: source.id || uid('materia'),
      corteId,
      perfil: normalizeMeatProfile(source.perfil, corteId),
      gramas: Math.max(1, toNumber(source.gramas) || toNumber(formula?.pesoReferencia) || 1000),
      gorduraCustom: source.gorduraCustom === '' || source.gorduraCustom === undefined ? '' : Math.max(0, Math.min(100, toNumber(source.gorduraCustom)))
    };
  }
  const inferred = normalizeBlendComponents(formula?.blendComponentes, formula, ingredients)[0];
  return {
    id: uid('materia'),
    corteId: inferred?.corteId || 'acem',
    perfil: inferred?.perfil || normalizeMeatProfile('', inferred?.corteId || 'acem'),
    gramas: toNumber(formula?.pesoReferencia) || 1000,
    gorduraCustom: inferred?.gorduraCustom ?? ''
  };
}

function normalizeBlendComponents(source, formula, ingredients = db.insumos) {
  if (Array.isArray(source) && source.length) {
    return source.map(component => {
      const corteId = MEAT_CUTS.some(cut => cut.id === component.corteId) ? component.corteId : 'outro';
      return {
        id: component.id || uid('blend'),
        corteId,
        perfil: normalizeMeatProfile(component.perfil, corteId),
        gramas: Math.max(0, toNumber(component.gramas)),
        gorduraCustom: component.gorduraCustom === '' || component.gorduraCustom === undefined ? '' : Math.max(0, Math.min(100, toNumber(component.gorduraCustom)))
      };
    });
  }
  const inferred = formulaBlendSourceItems(formula, ingredients).map(item => {
    const ingredient = (ingredients || []).find(row => row.id === item.insumoId);
    const mapping = {
      ing_carne_bovina_magra: 'acem',
      ing_gordura_bovina: 'gordura_bovina',
      ing_pernil_suino: 'pernil_suino',
      ing_toucinho_suino: 'toucinho_suino'
    };
    return {
      id: uid('blend'),
      corteId: mapping[item.insumoId] || 'outro',
      perfil: normalizeMeatProfile('sem_gordura', mapping[item.insumoId] || 'outro'),
      gramas: formulaItemGrams(formula, item),
      gorduraCustom: mapping[item.insumoId] ? '' : toNumber(ingredient?.gordura)
    };
  });
  return inferred.length ? inferred : [{ id: uid('blend'), corteId: 'acem', perfil: 'sem_gordura', gramas: toNumber(formula?.pesoReferencia) || 1000, gorduraCustom: '' }];
}

function blendComponentFat(component) {
  if (component?.gorduraCustom !== '' && component?.gorduraCustom !== undefined) return Math.max(0, Math.min(100, toNumber(component.gorduraCustom)));
  const cut = MEAT_CUTS.find(item => item.id === component?.corteId) || MEAT_CUTS[MEAT_CUTS.length - 1];
  const profile = normalizeMeatProfile(component?.perfil, cut.id);
  return profile === 'com_gordura' ? toNumber(cut.comGordura) : toNumber(cut.semGordura);
}

function blendComponentSource(component) {
  const cut = MEAT_CUTS.find(item => item.id === component?.corteId) || MEAT_CUTS[MEAT_CUTS.length - 1];
  if (component?.gorduraCustom !== '' && component?.gorduraCustom !== undefined) return 'Teor de gordura ajustado pelo usuário para esta matéria-prima.';
  const profile = normalizeMeatProfile(component?.perfil, cut.id);
  const source = profile === 'com_gordura' ? cut.fonteCom : cut.fonteSem;
  return source || 'Não há dados de composição para este perfil na TACO/NEPA/UNICAMP. Informe o teor medido ou obtido em outra referência.';
}

function blendComponentSourceHTML(component) {
  const cut = MEAT_CUTS.find(item => item.id === component?.corteId) || MEAT_CUTS[MEAT_CUTS.length - 1];
  if (component?.gorduraCustom !== '' && component?.gorduraCustom !== undefined) {
    return 'Teor de gordura ajustado pelo usuário para esta matéria-prima.';
  }
  const profile = normalizeMeatProfile(component?.perfil, cut.id);
  const source = profile === 'com_gordura' ? cut.fonteCom : cut.fonteSem;
  const sourceLabel = `<a href="${MEAT_CUTS_SOURCE_URL}" target="_blank" rel="noopener">TACO/NEPA/UNICAMP</a>`;
  if (!source) {
    return `${sourceLabel}: não há dados para este perfil. Informe o teor medido ou outra referência.`;
  }
  return `${sourceLabel}: ${escapeHTML(String(source).replace(/^TACO:\s*/i, '').trim())}`;
}

function blendComponentHasReferenceData(component) {
  if (component?.gorduraCustom !== '' && component?.gorduraCustom !== undefined) return true;
  const cut = MEAT_CUTS.find(item => item.id === component?.corteId) || MEAT_CUTS[MEAT_CUTS.length - 1];
  const profile = normalizeMeatProfile(component?.perfil, cut.id);
  const value = profile === 'com_gordura' ? cut.comGordura : cut.semGordura;
  return value !== null && value !== undefined;
}

function normalizeMeatProfile(profile, cutId) {
  const cut = MEAT_CUTS.find(item => item.id === cutId) || MEAT_CUTS[MEAT_CUTS.length - 1];
  const migrated = profile === 'normal' ? 'com_gordura' : profile === 'magra' ? 'sem_gordura' : profile;
  if (migrated === 'com_gordura' || migrated === 'sem_gordura') return migrated;
  if (cut.semGordura !== null && cut.semGordura !== undefined) return 'sem_gordura';
  return 'com_gordura';
}

function ingredientSuggestion(ingredient) {
  const name = String(ingredient?.nome || '').toLowerCase();
  const isSeasoning = ingredient?.tipo === 'condimento_especiaria';
  const isSaltOrSugar = ['ing_sal', 'ing_acucar'].includes(ingredient?.id) || /\bsal\b/.test(name) || name.includes('açúcar') || name.includes('acucar') || name.includes('dextrose');
  if (!ingredient || (!isSeasoning && !isSaltOrSugar)) return null;
  const byId = {
    ing_sal: { suave: 1.5, acentuado: 2 },
    ing_alho_po: { suave: 0.5, acentuado: 1.5 },
    ing_pimenta_reino: { suave: 0.1, acentuado: 0.4 },
    ing_pimenta_branca: { suave: 0.1, acentuado: 0.4 },
    ing_paprica_doce: { suave: 0.2, acentuado: 0.7 },
    ing_paprica_defumada: { suave: 0.2, acentuado: 0.7 },
    ing_cebola_desidratada: { suave: 0.6, acentuado: 1.5 },
    ing_cebola_po: { suave: 0.5, acentuado: 1.5 },
    ing_salsa_desidratada: { suave: 0.2, acentuado: 0.8 },
    ing_alecrim_po: { suave: 0.1, acentuado: 0.5 },
    ing_zaatar: { suave: 0.3, acentuado: 1 },
    ing_cominho: { suave: 0.1, acentuado: 0.5 },
    ing_hortela: { suave: 0.5, acentuado: 1.5 },
    ing_hortela_desidratada: { suave: 0.2, acentuado: 0.8 },
    ing_acucar: { suave: 0.2, acentuado: 0.8 }
  };
  if (byId[ingredient?.id]) return byId[ingredient.id];
  const byType = {
    basico_nao_carneo: { suave: 1.5, acentuado: 2 },
    condimento_especiaria: { suave: 0.3, acentuado: 1 }
  };
  return byType[ingredient?.tipo] || null;
}

function isCureSaltId(id) {
  return ['ing_sal_cura_tipo_1', 'ing_sal_cura_tipo_2'].includes(id);
}

function isCureSaltIngredient(ingredient) {
  return isCureSaltId(ingredient?.id) || ingredient?.subtipo === 'mistura de cura';
}

function productCategories(product) {
  return normalizeCategoryIds(product).map(id => PRODUCT_CATEGORIES.find(category => category.id === id)).filter(Boolean);
}

function productCategory(product) {
  return productCategories(product)[0] || PRODUCT_CATEGORIES.find(category => category.produtos.includes(product?.id));
}

function productCategoryLabel(product) {
  const categories = productCategories(product);
  if (!categories.length) return 'Categoria não definida';
  return categories.map(category => theoryTitle(category.id)).join(' + ');
}

function theoryTitle(id) {
  return getTheoryContent(id)?.titulo || PRODUCT_CATEGORIES.find(category => category.id === id)?.titulo || 'Assunto teórico';
}

function normalizeCategoryIds(product, defaultProduct = null) {
  const ids = [];
  const add = (id) => {
    if (id && PRODUCT_CATEGORIES.some(category => category.id === id) && !ids.includes(id)) ids.push(id);
  };
  (Array.isArray(product?.categoriaIds) ? product.categoriaIds : []).forEach(add);
  add(product?.categoriaId);
  (Array.isArray(defaultProduct?.categoriaIds) ? defaultProduct.categoriaIds : []).forEach(add);
  add(defaultProduct?.categoriaId);
  inferProductCategoryIds(product).forEach(add);
  return ids;
}

function inferProductCategoryIds(product) {
  const ids = PRODUCT_CATEGORIES.filter(category => category.produtos.includes(product?.id)).map(category => category.id);
  if (product?.tipo === 'linguica_frescal') ids.push('embutidos');
  const categoryText = String(product?.categoria || '').toLowerCase();
  if (product?.tipo === 'hamburguer' || categoryText.includes('reestruturado')) ids.push('reestruturados');
  if (categoryText.includes('emulsionado')) ids.push('emulsionados');
  if (categoryText.includes('embutido')) ids.push('embutidos');
  return Array.from(new Set(ids));
}

function inferProductCategoryId(product) {
  return inferProductCategoryIds(product)[0] || '';
}

function defaultFormulaBase(product) {
  const categoryIds = normalizeCategoryIds(product);
  return categoryIds.includes('reestruturados') ? 'massa_carnea' : 'produto_final';
}

function formulaBaseMode(formula, product = findProduct(formula?.produtoId)) {
  return formula?.baseCalculo || defaultFormulaBase(product);
}

function formulaBaseLabel(mode) {
  return mode === 'massa_carnea' ? 'Massa cárnea/carne base' : 'Produto final';
}

function formulaItemPercent(item) {
  return item?.removido ? 0 : toNumber(item?.percentual);
}

function formulaItemGrams(formula, item) {
  if (isCureSaltId(item?.insumoId)) return cureSaltGrams(formula, item);
  return (toNumber(formula?.pesoReferencia) || 0) * formulaItemPercent(item) / 100;
}

function timelineHTML(items) {
  const list = Array.isArray(items) ? items : [];
  return list.map((item, index) => `<div class="timeline-step">
    <div class="timeline-marker"><span>${index + 1}</span>${index ? '<i aria-hidden="true"></i>' : ''}</div>
    <p>${escapeHTML(item)}</p>
  </div>`).join('');
}

function equipmentHTML(items) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return '<div class="notice-card slim">Nenhum equipamento cadastrado para esta prática.</div>';
  return list.map((item, index) => `<button type="button" class="equipment-item" data-equipment-check="${index}"><span></span>${escapeHTML(item)}</button>`).join('');
}

function toggleEquipmentCheck(btn) {
  btn.classList.toggle('checked');
  const mark = btn.querySelector('span');
  if (mark) mark.textContent = btn.classList.contains('checked') ? '✓' : '';
}

function analyzeFormula(formula) {
  const product = findProduct(formula.produtoId);
  const baseMode = formulaBaseMode(formula, product);
  const weight = toNumber(formula.pesoReferencia) || 1000;
  let totalPct = 0;
  let meatBasePct = 0;
  let finalWeight = 0;
  let fatGrams = 0;
  let proteinGrams = 0;
  let carbGrams = 0;
  let pncGrams = 0;
  let costTotal = 0;
  let sourceMeatGrams = 0;
  let sourceMeatProteinGrams = 0;
  const blendState = formulaBlendState(formula);
  const useDetailedBlend = (blendState.useBlend ? blendState.components.length : Boolean(blendState.singleComponent));
  formula.itens.forEach(item => {
    const ing = findIngredient(item.insumoId);
    const pct = formulaItemPercent(item);
    if (!ing) return;
    const grams = formulaItemGrams(formula, item);
    totalPct += pct;
    const meatIngredient = isMeatIngredient(ing);
    if (meatIngredient) {
      meatBasePct += pct;
      sourceMeatGrams += grams;
      sourceMeatProteinGrams += grams * toNumber(ing.proteina) / 100;
    }
    if (!(useDetailedBlend && meatIngredient)) {
      finalWeight += grams;
      fatGrams += grams * toNumber(ing.gordura) / 100;
      proteinGrams += grams * toNumber(ing.proteina) / 100;
      carbGrams += grams * toNumber(ing.carboidrato) / 100;
    }
    if (ing.proteinaNaoCarnea || isFunctionalProtein(ing)) pncGrams += grams;
    costTotal += (grams / 1000) * toNumber(ing.custo);
  });
  if (useDetailedBlend) {
    const activeComponents = blendState.useBlend ? blendState.components : [blendState.singleComponent];
    const sourceProteinRate = sourceMeatGrams ? sourceMeatProteinGrams / sourceMeatGrams : 0;
    finalWeight += blendState.blendGrams;
    fatGrams += blendState.fatGrams;
    proteinGrams += activeComponents.reduce((sum, component) => {
      const fatRate = blendComponentFat(component) / 100;
      const physicallyPossibleProteinRate = Math.max(0, 1 - fatRate);
      return sum + toNumber(component.gramas) * Math.min(sourceProteinRate, physicallyPossibleProteinRate);
    }, 0);
  }
  const compositionWeight = finalWeight || weight;
  const fatPct = compositionWeight ? fatGrams / compositionWeight * 100 : 0;
  const proteinPct = compositionWeight ? proteinGrams / compositionWeight * 100 : 0;
  const carbPct = compositionWeight ? carbGrams / compositionWeight * 100 : 0;
  const pncPct = compositionWeight ? pncGrams / compositionWeight * 100 : 0;
  const alerts = [];
  const params = product?.parametros || {};
  if (product && params.mostrarValidacao !== false) {
    addLimitAlert(alerts, fatPct, params.gorduraMax, 'Gordura', 'max');
    addLimitAlert(alerts, proteinPct, params.proteinaMin, 'Proteína estimada', 'min');
    addLimitAlert(alerts, carbPct, params.carbMax, 'Carboidratos estimados', 'max');
    const pncLabel = product.tipo === 'linguica_frescal' ? 'Proteína agregada' : 'Proteína não cárnea agregada';
    if (params.proibeProteinaNaoCarnea && pncPct > 0) alerts.push({ type: 'danger', text: `${pncLabel}: há ingrediente marcado como proteína agregada, mas o produto não permite esse uso.` });
    else addLimitAlert(alerts, pncPct, params.proteinaNaoCarneaMax, pncLabel, 'max');
  }
  return { product, baseMode, baseLabel: formulaBaseLabel(baseMode), weight, totalPct, meatBasePct, finalWeight, fatPct, proteinPct, carbPct, pncPct, costTotal, alerts };
}

function addLimitAlert(alerts, value, limit, label, mode) {
  if (limit === '' || limit === null || limit === undefined || Number.isNaN(Number(limit))) return;
  const ok = mode === 'max' ? value <= Number(limit) + 0.0001 : value + 0.0001 >= Number(limit);
  alerts.push({ type: ok ? 'ok' : 'danger', text: `${label}: ${fmt(value)}% ${ok ? 'dentro do parâmetro' : 'fora do parâmetro'} (${mode === 'max' ? 'limite máximo' : 'limite mínimo'} ${fmt(limit)}%).` });
}

function analysisHTML(a) {
  const importantAlerts = a.alerts.filter(alert => alert.type !== 'ok');
  return `<div class="analysis-grid">
    <div class="analysis-metric"><strong>${fmt(a.finalWeight)} g</strong><span>Massa final estimada</span></div>
    <div class="analysis-metric"><strong>${fmt(a.fatPct)}%</strong><span>Gordura estimada</span></div>
    <div class="analysis-metric"><strong>${fmt(a.proteinPct)}%</strong><span>Proteína estimada</span></div>
    <div class="analysis-metric"><strong>${fmt(a.carbPct)}%</strong><span>Carboidratos estimados</span></div>
    <div class="analysis-metric"><strong>${fmt(a.pncPct)}%</strong><span>Prot. agregada</span></div>
    <div class="analysis-metric"><strong>${money(a.costTotal)}</strong><span>Custo estimado do lote</span></div>
  </div>
  ${importantAlerts.length ? `<div class="alert-list">${importantAlerts.map(alert => `<div class="alert ${alert.type}">${escapeHTML(alert.text)}</div>`).join('')}</div>` : ''}`;
}

function showFormulaReport(formulaId = null) {
  const formula = formulaId ? findFormula(formulaId) : getFormulaFromModal(false);
  if (!formula) return toast('Formulação não encontrada.');
  $('#relatorioTexto').value = buildReport(formula);
  openModal('modalRelatorio');
}

function buildReport(formula) {
  const product = findProduct(formula.produtoId);
  const analysis = analyzeFormula(formula);
  const lines = [];
  lines.push('RELATÓRIO DA AULA PRÁTICA - PROCESSAMENTO DE ALIMENTOS DE ORIGEM ANIMAL');
  lines.push('');
  lines.push(`Produto: ${product?.nome || 'Não informado'}`);
  lines.push(`Formulação: ${cleanFormulaName(formula.nome)}`);
  lines.push(`Base de cálculo: ${analysis.baseLabel}`);
  lines.push(`Peso base: ${fmt(formula.pesoReferencia)} g`);
  lines.push(`Massa final estimada: ${fmt(analysis.finalWeight)} g`);
  if (formula.rendimento !== '') lines.push(`Rendimento esperado: ${fmt(formula.rendimento)}%`);
  lines.push('');
  const blend = formulaBlendState(formula);
  if (blend.useBlend && blend.components.length) {
    lines.push('Blend de matérias-primas:');
    blend.components.forEach(component => {
      lines.push(`- ${component.cut.nome} (${component.perfil === 'com_gordura' ? 'com gordura' : 'sem gordura'}): ${fmt(component.gramas)} g, gordura de referência ${fmt(blendComponentFat(component))}%`);
    });
    lines.push(`- Gordura estimada do blend: ${fmt(blend.fatPct)}%`);
    lines.push('');
  } else if (blend.singleComponent) {
    const cut = MEAT_CUTS.find(item => item.id === blend.singleComponent.corteId);
    lines.push(`Matéria-prima cárnea: ${cut?.nome || 'Não informada'} (${blend.singleComponent.perfil === 'com_gordura' ? 'com gordura' : 'sem gordura'}), ${fmt(blend.singleComponent.gramas)} g`);
    lines.push('');
  }
  lines.push('Formulação:');
  formula.itens.forEach(item => {
    const ing = findIngredient(item.insumoId);
    const grams = formulaItemGrams(formula, item);
    const cureSalt = isCureSaltIngredient(ing);
    lines.push(`- ${ing?.nome || 'Insumo'}: ${item.removido ? 'removido da prática' : cureSalt ? `${fmt(String(item.cura?.ppm ?? '').trim() === '' ? CURE_LIMIT_PPM : item.cura.ppm)} ppm = ${fmtFixed2(grams)} g` : `${fmt(item.percentual)}% = ${fmt(grams)} g`}`);
    if (!item.removido && isCureSaltIngredient(ing)) {
      const cure = cureSaltMetrics(formula, item);
      const label = ing.curaTipo === 2 ? 'Nitrito + nitrato no preparado' : 'Nitrito no preparado';
      lines.push(`  ${label}: ${fmt(cure.concentrationPct)}% informado no rótulo; alvo ${fmt(cure.ppm)} ppm`);
    }
  });
  lines.push('');
  lines.push('Resumo técnico estimado:');
  lines.push(`- Gordura estimada: ${fmt(analysis.fatPct)}%`);
  lines.push(`- Proteína estimada: ${fmt(analysis.proteinPct)}%`);
  lines.push(`- Carboidratos estimados: ${fmt(analysis.carbPct)}%`);
  lines.push(`- Proteína agregada: ${fmt(analysis.pncPct)}%`);
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
  const p = findProduct(activeProductId || db.configs.ultimoProdutoAula || db.produtos[0]?.id);
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
  if (!requirePermission('data.export')) return;
  const backup = clone(db);
  (backup.configs?.conteudosTeoricos || []).forEach(content => {
    content.imagens = (content.imagens || []).map(resolveTheoryImage);
  });
  downloadJSON(backup, `paoa_lab_backup_${dateStamp()}.json`);
  toast('Backup gerado.');
}

function downloadTemplate() {
  downloadJSON(DEFAULT_DB, 'paoa_lab_modelo_dados.json');
}

async function importData(ev) {
  if (!requirePermission('data.import')) return;
  const file = ev.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (!imported.produtos || !imported.insumos) throw new Error('Arquivo inválido');
    db = normalizeDB(imported);
    for (const content of db.configs?.conteudosTeoricos || []) {
      content.imagens = await Promise.all((content.imagens || []).map(image => String(image).startsWith('data:image/') ? storeTheoryImage(image) : image));
    }
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
  if (!requirePermission('data.reset')) return;
  if (!confirm('Restaurar a base demonstrativa? Seus dados atuais serão substituídos neste navegador.')) return;
  db = normalizeDB(clone(DEFAULT_DB));
  saveDB();
  renderAll();
  closeModal('modalConfig');
  toast('Base demonstrativa restaurada.');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js?v=57').then(registration => registration.update()).catch(err => console.warn('Service worker não registrado', err));
  }
}

function openModal(id) {
  const modal = $('#' + id);
  if (!modal) return;
  modal.style.zIndex = String(++modalZIndex);
  modal.classList.add('show');
  modal.scrollTop = 0;
  const panel = modal.querySelector('.modal');
  if (panel) panel.scrollTop = 0;
  requestAnimationFrame(() => {
    modal.scrollTop = 0;
    if (panel) panel.scrollTop = 0;
  });
}
function closeModal(id) {
  $('#' + id)?.classList.remove('show');
  if (id === 'modalConteudoView') {
    activeTheorySlideController?.wrap?.classList.remove('presentation-fullscreen');
    activeTheorySlideController = null;
  }
}
function openConfirmation({ title = 'Confirmar ação', message = '', confirmLabel = 'Confirmar', requireText = '', action } = {}) {
  pendingConfirmationAction = typeof action === 'function' ? action : null;
  pendingConfirmationText = String(requireText || '');
  $('#confirmacaoTitulo').textContent = title;
  $('#confirmacaoMensagem').textContent = message;
  $('#btnConfirmarAcao').textContent = confirmLabel;
  $('#confirmacaoTextoWrap').hidden = !pendingConfirmationText;
  $('#confirmacaoTexto').value = '';
  $('#confirmacaoTextoLabel').textContent = pendingConfirmationText ? `Digite: ${pendingConfirmationText}` : '';
  updateConfirmationButtonState();
  openModal('modalConfirmacao');
  if (pendingConfirmationText) requestAnimationFrame(() => $('#confirmacaoTexto')?.focus());
}
function closeConfirmation() {
  pendingConfirmationAction = null;
  pendingConfirmationText = '';
  closeModal('modalConfirmacao');
}
function updateConfirmationButtonState() {
  const button = $('#btnConfirmarAcao');
  if (!button) return;
  button.disabled = Boolean(pendingConfirmationText) && $('#confirmacaoTexto').value.trim().toLowerCase() !== pendingConfirmationText.toLowerCase();
}
function confirmPendingAction() {
  if (pendingConfirmationText && $('#confirmacaoTexto').value.trim().toLowerCase() !== pendingConfirmationText.toLowerCase()) return;
  const action = pendingConfirmationAction;
  pendingConfirmationAction = null;
  pendingConfirmationText = '';
  closeModal('modalConfirmacao');
  action?.();
}
function handleProductWorkspaceKey(event) {
  if (event.defaultPrevented || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  const root = $('#produtoWorkspace');
  const controller = root?._productSlideController;
  if (!root || root.hidden || !root.closest('.page')?.classList.contains('active') || !controller) return;
  if ($('.modal-overlay.show')) return;
  const tag = String(event.target?.tagName || '').toLowerCase();
  if (event.target?.isContentEditable || ['input', 'textarea', 'select'].includes(tag)) return;
  event.preventDefault();
  controller.show(controller.getIndex() + (event.key === 'ArrowRight' ? 1 : -1));
}
function handleTheoryPresentationKey(event) {
  const controller = activeTheorySlideController;
  if (!controller?.wrap?.isConnected || !$('#modalConteudoView')?.classList.contains('show')) return;
  const tag = String(event.target?.tagName || '').toLowerCase();
  if (['input', 'textarea', 'select'].includes(tag)) return;
  if (event.key === 'F5' || event.key === 'Enter') {
    event.preventDefault();
    toggleTheoryFullscreen(controller.wrap);
    return;
  }
  if (event.key === 'Escape' && controller.wrap.classList.contains('presentation-fullscreen')) {
    event.preventDefault();
    controller.wrap.classList.remove('presentation-fullscreen');
    return;
  }
  if (event.key === ' ' || event.key === 'ArrowRight') {
    event.preventDefault();
    controller.show(controller.getIndex() + 1);
    return;
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    controller.show(controller.getIndex() - 1);
  }
}
function toggleTheoryFullscreen(wrap) {
  if (!wrap) return;
  wrap.classList.toggle('presentation-fullscreen');
  wrap.focus({ preventScroll: true });
}
function findProduct(id) { return db.produtos.find(p => p.id === id); }
function findIngredient(id) { return db.insumos.find(i => i.id === id); }
function findFormula(id) { return db.formulacoes.find(f => f.id === id); }
function toNumber(value) { const n = Number(String(value ?? '').replace(',', '.')); return Number.isFinite(n) ? n : 0; }
function numberOrBlank(value) { if (String(value ?? '').trim() === '') return ''; return toNumber(value); }
function roundOneDecimal(value) { return Math.round((toNumber(value) + Number.EPSILON) * 10) / 10; }
function fmtOneDecimal(value) { return roundOneDecimal(value).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
function fmtFixed2(value) { return toNumber(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmt(n) { return toNumber(n).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(toNumber(n)) ? 0 : 1 }); }
function fmtInput(n) {
  const value = Math.round(toNumber(n) * 100) / 100;
  return Number.isInteger(value) ? String(value) : String(value).replace(',', '.');
}
function money(n) { return toNumber(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function linesFrom(text) { return Array.isArray(text) ? text : String(text || '').split('\n').map(s => s.trim()).filter(Boolean); }
function multiSelectValues(select) { return Array.from(select?.selectedOptions || []).map(option => option.value).filter(Boolean); }
function setMultiSelectValues(select, values) {
  const wanted = new Set(values || []);
  Array.from(select?.options || []).forEach(option => { option.selected = wanted.has(option.value); });
}
function cssEscape(value) { return window.CSS?.escape ? CSS.escape(value) : String(value).replace(/["\\]/g, '\\$&'); }
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
function capitalize(text) { return String(text || '').charAt(0).toUpperCase() + String(text || '').slice(1); }
function capitalizeFirst(text) { return capitalize(String(text || '').trim()); }
function ingredientSubtypes(type) { return TYPES.find(t => t.value === type)?.subtipos || []; }
function normalizeIngredientType(ingredient = {}) {
  const id = ingredient.id || '';
  const text = [ingredient.nome, ingredient.categoria, ingredient.tipo].join(' ').toLowerCase();
  if (isCureSaltId(id) || text.includes('sal de cura')) return 'mistura_comercial';
  if (id === 'ing_tripa_suina' || text.includes('tripa') || text.includes('envoltório') || text.includes('embalagem')) return 'envoltorio_apresentacao';
  if (id === 'ing_fosfato' || text.includes('nitrito') || text.includes('nitrato') || text.includes('fosfato') || text.includes('eritorbato')) return 'aditivo_alimentar';
  if (id === 'ing_agua_gelada' || id === 'ing_sal' || id === 'ing_acucar' || text.includes('água') || text.includes('gelo') || /\bsal\b/.test(text) || text.includes('açúcar') || text.includes('acucar') || text.includes('dextrose')) return 'basico_nao_carneo';
  if (id.includes('carne') || id.includes('gordura') || id.includes('pernil') || id.includes('toucinho') || id.includes('figado') || id.includes('fígado') || text.includes('matéria-prima cárnea') || text.includes('gordura animal')) return 'materia_prima_carnea';
  if (text.includes('condimento') || text.includes('pimenta') || text.includes('alho') || text.includes('cebola') || text.includes('páprica') || text.includes('salsa')) return 'condimento_especiaria';
  if (text.includes('cultura') || text.includes('fermento')) return 'cultura_fermento';
  if (text.includes('mix') || text.includes('mistura') || text.includes('preparado')) return 'mistura_comercial';
  return LEGACY_TYPE_MAP[ingredient.tipo] || (TYPES.some(t => t.value === ingredient.tipo) ? ingredient.tipo : 'funcional_nao_aditivo');
}
function normalizeIngredientSubtype(ingredient = {}) {
  const type = normalizeIngredientType(ingredient);
  const existing = ingredient.subtipo;
  if (existing && ingredientSubtypes(type).includes(existing)) return existing;
  const text = [ingredient.nome, ingredient.categoria, ingredient.tipo].join(' ').toLowerCase();
  if (type === 'condimento_especiaria') {
    if (ingredient.id === 'ing_pimenta_reino' || ingredient.id === 'ing_pimenta_branca' || text.includes('moíd') || text.includes('moid')) return 'moídos';
    if (text.includes('pó') || text.includes('po')) return 'em pó';
    if (text.includes('desidrat')) return 'desidratados';
    if (text.includes('fresc')) return 'frescos';
  }
  if (type === 'funcional_nao_aditivo') {
    if (text.includes('proteína') || text.includes('proteina')) return 'proteínas';
    if (text.includes('amido') || text.includes('farinha') || text.includes('fécula') || text.includes('fecula')) return 'amidos/farinhas';
    if (text.includes('leite') || text.includes('lácteo') || text.includes('lacteo')) return 'lácteos';
    if (text.includes('ovo')) return 'ovos';
  }
  if (type === 'envoltorio_apresentacao') {
    if (text.includes('tripa') || text.includes('comestível') || text.includes('comestivel')) return 'envoltório comestível';
    if (text.includes('embalagem')) return 'embalagem';
  }
  return '';
}
function isMeatIngredient(ingredient) { return normalizeIngredientType(ingredient || {}) === 'materia_prima_carnea'; }
function isFunctionalProtein(ingredient = {}) {
  const type = normalizeIngredientType(ingredient);
  const subtype = ingredient.subtipo || normalizeIngredientSubtype(ingredient);
  return type === 'funcional_nao_aditivo' && subtype === 'proteínas';
}
function typeLabel(value) { return TYPES.find(t => t.value === value)?.label || 'Outro'; }
function inferProductTypeFromName(name = '') {
  const text = String(name).toLowerCase();
  if (text.includes('hamb')) return 'hamburguer';
  if (text.includes('lingui')) return 'linguica_frescal';
  return 'geral';
}
function productTypeLabel(value) {
  return ({ hamburguer: 'RTIQ hambúrguer', linguica_frescal: 'RTIQ linguiça frescal', geral: 'Produto geral' })[value] || 'Produto geral';
}
function ingredientIcon(type) {
  return ({ materia_prima_carnea: 'MP', basico_nao_carneo: 'B', condimento_especiaria: 'CE', funcional_nao_aditivo: 'FN', aditivo_alimentar: 'AD', coadjuvante_tecnologia: 'CT', cultura_fermento: 'CF', envoltorio_apresentacao: 'EA', mistura_comercial: 'MC' })[type] || 'IN';
}
function photoOrInitial(p) {
  return p.fotos?.[0] ? `<img src="${escapeAttr(p.fotos[0])}" alt="${escapeAttr(p.nome)}">` : escapeHTML((p.nome || '?').slice(0, 1).toUpperCase());
}
function emptyHTML(text) { return `<div class="notice-card">${escapeHTML(text)}</div>`; }
function orderedList(items) { return `<ol class="lesson-list">${(items || []).map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ol>`; }
function unorderedList(items) { return `<ul class="lesson-list">${(items || []).map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ul>`; }
function dateStamp() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function escapeHTML(str) { return String(str ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function escapeAttr(str) { return escapeHTML(str); }
function limitBadge(value, limit, mode) {
  if (limit === '' || limit === null || limit === undefined || Number.isNaN(Number(limit))) return 'info';
  return mode === 'max' ? (value <= Number(limit) + 0.0001 ? 'ok' : 'danger') : (value + 0.0001 >= Number(limit) ? 'ok' : 'danger');
}
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
}
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

function openMediaDB() {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(MEDIA_STORE_NAME)) database.createObjectStore(MEDIA_STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function hydrateTheoryImageCache() {
  try {
    const database = await openMediaDB();
    if (!database) return;
    const records = await new Promise((resolve, reject) => {
      const request = database.transaction(MEDIA_STORE_NAME, 'readonly').objectStore(MEDIA_STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    records.forEach(record => theoryImageCache.set(record.id, record.dataUrl));
    database.close();
    cleanupUnusedTheoryImages();
  } catch (err) {
    console.error(err);
  }
}

async function storeTheoryImage(dataUrl) {
  const database = await openMediaDB();
  if (!database) return dataUrl;
  const id = `idb:${uid('slide')}`;
  await new Promise((resolve, reject) => {
    const request = database.transaction(MEDIA_STORE_NAME, 'readwrite').objectStore(MEDIA_STORE_NAME).put({ id, dataUrl });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  database.close();
  theoryImageCache.set(id, dataUrl);
  return id;
}

async function migrateEmbeddedTheoryImages() {
  let changed = false;
  for (const content of db.configs?.conteudosTeoricos || []) {
    const migrated = [];
    for (const image of content.imagens || []) {
      if (String(image).startsWith('data:image/')) {
        migrated.push(await storeTheoryImage(image));
        changed = true;
      } else {
        migrated.push(image);
      }
    }
    content.imagens = migrated;
  }
  if (changed) saveDB();
}

function resolveTheoryImage(ref) {
  return String(ref || '').startsWith('idb:') ? theoryImageCache.get(ref) || '' : ref;
}

async function cleanupUnusedTheoryImages() {
  const used = new Set((db.configs?.conteudosTeoricos || []).flatMap(content => content.imagens || []).filter(ref => String(ref).startsWith('idb:')));
  try {
    const database = await openMediaDB();
    if (!database) return;
    const obsolete = Array.from(theoryImageCache.keys()).filter(id => !used.has(id));
    if (obsolete.length) {
      const transaction = database.transaction(MEDIA_STORE_NAME, 'readwrite');
      obsolete.forEach(id => transaction.objectStore(MEDIA_STORE_NAME).delete(id));
      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      });
      obsolete.forEach(id => theoryImageCache.delete(id));
    }
    database.close();
  } catch (err) {
    console.error(err);
  }
}

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
