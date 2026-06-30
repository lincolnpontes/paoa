/**
 * PAOA DEA - backend de autenticacao e sincronizacao para Google Apps Script.
 *
 * Implantacao resumida:
 * 1. Crie um projeto no Apps Script e cole este arquivo em Code.gs.
 * 2. Execute prepararInstalacao() uma vez e copie a chave exibida no log.
 * 3. Implante como app da Web: executar como voce; acesso: qualquer pessoa.
 * 4. No PAOA, abra Configuracoes avancadas > Conectar sincronizacao.
 *
 * Senhas nunca sao gravadas em texto puro. As sessoes expiram em 6 horas.
 */

const PAOA_DB_FILE_NAME = 'paoa_dea_database.json';
const PAOA_BACKUP_FOLDER_NAME = 'PAOA DEA Backups';
const PAOA_PROP_DB_FILE_ID = 'PAOA_DB_FILE_ID';
const PAOA_PROP_BACKUP_FOLDER_ID = 'PAOA_BACKUP_FOLDER_ID';
const PAOA_PROP_REVISION = 'PAOA_REVISION';
const PAOA_PROP_BOOTSTRAP_KEY = 'PAOA_BOOTSTRAP_KEY';
const PAOA_MAX_BACKUPS = 30;
const PAOA_SESSION_SECONDS = 21600;
const PAOA_APP_ID = 'paoa_lab';

const PAOA_PERMISSION_KEYS = [
  'view.home', 'view.aulas', 'view.produtos', 'view.cronograma', 'view.regras',
  'formula.use', 'manage.products', 'manage.ingredients', 'manage.formulas',
  'manage.contents', 'manage.schedule', 'manage.rules', 'manage.access',
  'manage.sync', 'data.export', 'data.import', 'data.reset'
];

function doGet() {
  return paoaJson_({
    ok: true,
    app: PAOA_APP_ID,
    initialized: paoaIsInitialized_(),
    message: 'Servico de sincronizacao PAOA DEA ativo.'
  });
}

function doPost(e) {
  const payload = paoaParsePayload_(e);
  const action = String(payload.action || 'status');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (action === 'status') return paoaJson_({ ok: true, app: PAOA_APP_ID, initialized: paoaIsInitialized_() });
    if (action === 'bootstrap') return paoaJson_(paoaBootstrap_(payload));
    if (action === 'login') return paoaJson_(paoaLogin_(payload));

    const context = paoaRequireSession_(payload.token);
    if (action === 'logout') return paoaJson_(paoaLogout_(payload.token));
    if (action === 'pull') return paoaJson_(paoaPull_(context));
    if (action === 'save') return paoaJson_(paoaSave_(payload, context));
    if (action === 'list_access') return paoaJson_(paoaListAccess_(context));
    if (action === 'save_profile') return paoaJson_(paoaSaveProfile_(payload, context));
    if (action === 'delete_profile') return paoaJson_(paoaDeleteProfile_(payload, context));
    if (action === 'save_user') return paoaJson_(paoaSaveUser_(payload, context));
    if (action === 'delete_user') return paoaJson_(paoaDeleteUser_(payload, context));
    if (action === 'change_pin') return paoaJson_(paoaChangePin_(payload, context));
    return paoaJson_({ ok: false, error: 'Acao invalida.' });
  } catch (err) {
    return paoaJson_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function prepararInstalacao() {
  const props = PropertiesService.getScriptProperties();
  if (paoaIsInitialized_()) throw new Error('A instalacao ja foi concluida.');
  const key = Utilities.getUuid().replace(/-/g, '').slice(0, 16).toUpperCase();
  props.setProperty(PAOA_PROP_BOOTSTRAP_KEY, key);
  console.log('Chave de instalacao PAOA: ' + key);
  return key;
}

function paoaBootstrap_(payload) {
  if (paoaIsInitialized_()) return { ok: false, error: 'O servidor ja foi configurado.' };
  const savedKey = PropertiesService.getScriptProperties().getProperty(PAOA_PROP_BOOTSTRAP_KEY) || '';
  if (!savedKey || String(payload.bootstrapKey || '').trim().toUpperCase() !== savedKey) {
    return { ok: false, error: 'Chave de instalacao invalida.' };
  }
  const adminLogin = paoaNormalizeLogin_(payload.adminLogin);
  const studentLogin = paoaNormalizeLogin_(payload.studentLogin);
  paoaValidateLogin_(adminLogin);
  paoaValidateLogin_(studentLogin);
  if (adminLogin === studentLogin) throw new Error('Os logins do administrador e dos discentes devem ser diferentes.');
  paoaValidatePin_(payload.adminPin);
  paoaValidatePin_(payload.studentPin);
  const now = Date.now();
  const adminProfile = {
    id: 'profile_admin', name: 'Administrador', system: true,
    permissions: paoaPermissionMap_(true), createdAt: now, updatedAt: now
  };
  const studentPermissions = paoaPermissionMap_(false);
  ['view.home', 'view.aulas', 'view.produtos', 'view.cronograma', 'view.regras'].forEach((key) => studentPermissions[key] = true);
  const studentProfile = {
    id: 'profile_student', name: 'Discentes', system: true,
    permissions: studentPermissions, createdAt: now, updatedAt: now
  };
  const db = paoaBaseDb_();
  db.data = paoaNormalizeData_(payload.data);
  db.security.profiles = [adminProfile, studentProfile];
  db.security.users = [
    paoaNewUser_(adminLogin, payload.adminName || 'Administrador', payload.adminPin, adminProfile.id, now),
    paoaNewUser_(studentLogin, payload.studentName || 'Discentes', payload.studentPin, studentProfile.id, now)
  ];
  db.security.audit.push(paoaAudit_('bootstrap', 'Instalacao inicial concluida', adminLogin));
  db.revision = 1;
  db.updatedAt = now;
  paoaWriteDb_(db);
  PropertiesService.getScriptProperties().setProperty(PAOA_PROP_REVISION, '1');
  PropertiesService.getScriptProperties().deleteProperty(PAOA_PROP_BOOTSTRAP_KEY);
  return { ok: true, initialized: true };
}

function paoaLogin_(payload) {
  const login = paoaNormalizeLogin_(payload.login);
  const pin = String(payload.pin || '');
  paoaValidatePin_(pin);
  const rateKey = 'attempt_' + paoaDigestText_(login).slice(0, 24);
  const cache = CacheService.getScriptCache();
  const attempts = Number(cache.get(rateKey) || 0);
  if (attempts >= 8) return { ok: false, error: 'Muitas tentativas. Aguarde alguns minutos.' };
  const db = paoaReadDb_();
  const user = db.security.users.find((item) => item.login === login && item.active !== false);
  if (!user || paoaHashPin_(pin, user.salt) !== user.pinHash) {
    cache.put(rateKey, String(attempts + 1), 600);
    return { ok: false, error: 'Login ou senha incorretos.' };
  }
  cache.remove(rateKey);
  const profile = db.security.profiles.find((item) => item.id === user.profileId);
  if (!profile) return { ok: false, error: 'O perfil deste usuario nao esta disponivel.' };
  const token = Utilities.getUuid() + Utilities.getUuid();
  const tokenKey = paoaSessionKey_(token);
  cache.put(tokenKey, JSON.stringify({ userId: user.id, issuedAt: Date.now() }), PAOA_SESSION_SECONDS);
  user.lastLoginAt = Date.now();
  db.security.audit.push(paoaAudit_('login', 'Acesso realizado', user.login));
  paoaTrimAudit_(db);
  paoaWriteDb_(db);
  return Object.assign({ ok: true, token }, paoaSessionPayload_(db, user, profile));
}

function paoaLogout_(token) {
  CacheService.getScriptCache().remove(paoaSessionKey_(token));
  return { ok: true };
}

function paoaPull_(context) {
  return Object.assign({ ok: true }, paoaSessionPayload_(context.db, context.user, context.profile));
}

function paoaSave_(payload, context) {
  const incoming = paoaNormalizeData_(payload.data);
  const currentRevision = Number(context.db.revision || 0);
  const baseRevision = Number(payload.baseRevision || 0);
  const force = payload.force === true && paoaCan_(context.profile, 'manage.sync');
  if (!force && baseRevision !== currentRevision) {
    return { ok: false, conflict: true, revision: currentRevision, error: 'Existe uma versao mais recente no servidor.' };
  }
  const allowed = paoaEditableSections_(context.profile);
  if (!allowed.length) return { ok: false, error: 'Este perfil nao possui permissao para alterar dados.' };
  paoaBackupDb_(context.db);
  const nextData = paoaApplyAllowedData_(context.db.data, incoming, allowed);
  const revision = currentRevision + 1;
  context.db.data = nextData;
  context.db.revision = revision;
  context.db.updatedAt = Date.now();
  context.db.security.audit.push(paoaAudit_('save', 'Dados sincronizados: ' + allowed.join(', '), context.user.login));
  paoaTrimAudit_(context.db);
  paoaWriteDb_(context.db);
  PropertiesService.getScriptProperties().setProperty(PAOA_PROP_REVISION, String(revision));
  return { ok: true, revision, updatedAt: context.db.updatedAt };
}

function paoaListAccess_(context) {
  paoaAssertCan_(context.profile, 'manage.access');
  return {
    ok: true,
    permissionKeys: PAOA_PERMISSION_KEYS,
    profiles: context.db.security.profiles.map(paoaPublicProfile_),
    users: context.db.security.users.map(paoaPublicUser_)
  };
}

function paoaSaveProfile_(payload, context) {
  paoaAssertCan_(context.profile, 'manage.access');
  const draft = payload.profile || {};
  const name = String(draft.name || '').trim();
  if (name.length < 2) throw new Error('Informe o nome do perfil.');
  const id = String(draft.id || ('profile_' + paoaSafeId_(name) + '_' + Date.now()));
  let profile = context.db.security.profiles.find((item) => item.id === id);
  if (profile && profile.system && id === 'profile_admin' && draft.permissions && draft.permissions['manage.access'] === false) {
    throw new Error('O perfil Administrador precisa manter a permissao de gerenciar acessos.');
  }
  const now = Date.now();
  if (!profile) {
    profile = { id, name, system: false, permissions: paoaPermissionMap_(false), createdAt: now };
    context.db.security.profiles.push(profile);
  }
  profile.name = name;
  profile.permissions = paoaPermissionMap_(false, draft.permissions || {});
  if (profile.id === 'profile_admin') profile.permissions['manage.access'] = true;
  profile.updatedAt = now;
  context.db.security.audit.push(paoaAudit_('profile_save', 'Perfil atualizado: ' + name, context.user.login));
  paoaWriteDb_(context.db);
  return paoaListAccess_(context);
}

function paoaDeleteProfile_(payload, context) {
  paoaAssertCan_(context.profile, 'manage.access');
  const id = String(payload.profileId || '');
  const profile = context.db.security.profiles.find((item) => item.id === id);
  if (!profile) throw new Error('Perfil nao encontrado.');
  if (profile.system) throw new Error('Os perfis principais nao podem ser excluidos.');
  if (context.db.security.users.some((item) => item.profileId === id)) throw new Error('Mova os usuarios deste perfil antes de exclui-lo.');
  context.db.security.profiles = context.db.security.profiles.filter((item) => item.id !== id);
  context.db.security.audit.push(paoaAudit_('profile_delete', 'Perfil excluido: ' + profile.name, context.user.login));
  paoaWriteDb_(context.db);
  return paoaListAccess_(context);
}

function paoaSaveUser_(payload, context) {
  paoaAssertCan_(context.profile, 'manage.access');
  const draft = payload.user || {};
  const login = paoaNormalizeLogin_(draft.login);
  paoaValidateLogin_(login);
  const profileId = String(draft.profileId || '');
  if (!context.db.security.profiles.some((item) => item.id === profileId)) throw new Error('Selecione um perfil valido.');
  let user = draft.id ? context.db.security.users.find((item) => item.id === draft.id) : null;
  if (context.db.security.users.some((item) => item.login === login && (!user || item.id !== user.id))) throw new Error('Este login ja esta em uso.');
  const now = Date.now();
  if (!user) {
    paoaValidatePin_(draft.pin);
    user = paoaNewUser_(login, draft.name, draft.pin, profileId, now);
    context.db.security.users.push(user);
  } else {
    user.login = login;
    user.name = String(draft.name || login).trim();
    user.profileId = profileId;
    user.active = draft.active !== false;
    user.updatedAt = now;
    if (String(draft.pin || '')) {
      paoaValidatePin_(draft.pin);
      user.salt = Utilities.getUuid();
      user.pinHash = paoaHashPin_(draft.pin, user.salt);
    }
  }
  context.db.security.audit.push(paoaAudit_('user_save', 'Usuario atualizado: ' + login, context.user.login));
  paoaWriteDb_(context.db);
  return paoaListAccess_(context);
}

function paoaDeleteUser_(payload, context) {
  paoaAssertCan_(context.profile, 'manage.access');
  const id = String(payload.userId || '');
  if (id === context.user.id) throw new Error('Voce nao pode excluir o proprio acesso.');
  const user = context.db.security.users.find((item) => item.id === id);
  if (!user) throw new Error('Usuario nao encontrado.');
  context.db.security.users = context.db.security.users.filter((item) => item.id !== id);
  context.db.security.audit.push(paoaAudit_('user_delete', 'Usuario excluido: ' + user.login, context.user.login));
  paoaWriteDb_(context.db);
  return paoaListAccess_(context);
}

function paoaChangePin_(payload, context) {
  paoaValidatePin_(payload.currentPin);
  paoaValidatePin_(payload.newPin);
  if (paoaHashPin_(payload.currentPin, context.user.salt) !== context.user.pinHash) throw new Error('A senha atual esta incorreta.');
  context.user.salt = Utilities.getUuid();
  context.user.pinHash = paoaHashPin_(payload.newPin, context.user.salt);
  context.user.updatedAt = Date.now();
  context.db.security.audit.push(paoaAudit_('pin_change', 'Senha alterada', context.user.login));
  paoaWriteDb_(context.db);
  return { ok: true };
}

function paoaRequireSession_(token) {
  const raw = CacheService.getScriptCache().get(paoaSessionKey_(token));
  if (!raw) throw new Error('Sessao expirada. Entre novamente.');
  const session = JSON.parse(raw);
  const db = paoaReadDb_();
  const user = db.security.users.find((item) => item.id === session.userId && item.active !== false);
  if (!user) throw new Error('Usuario inativo ou inexistente.');
  const profile = db.security.profiles.find((item) => item.id === user.profileId);
  if (!profile) throw new Error('Perfil nao encontrado.');
  CacheService.getScriptCache().put(paoaSessionKey_(token), raw, PAOA_SESSION_SECONDS);
  return { db, user, profile };
}

function paoaSessionPayload_(db, user, profile) {
  return {
    revision: Number(db.revision || 0),
    updatedAt: Number(db.updatedAt || 0),
    user: paoaPublicUser_(user),
    profile: paoaPublicProfile_(profile),
    permissions: paoaPermissionMap_(false, profile.permissions || {}),
    data: paoaFilterDataForProfile_(db.data, profile)
  };
}

function paoaFilterDataForProfile_(data, profile) {
  const copy = JSON.parse(JSON.stringify(data || {}));
  if (!paoaCan_(profile, 'view.produtos') && !paoaCan_(profile, 'manage.products')) {
    copy.produtos = [];
    copy.formulacoes = [];
    copy.legislacoes = [];
  }
  if (!paoaCan_(profile, 'view.aulas') && !paoaCan_(profile, 'manage.contents')) {
    if (copy.configs) copy.configs.conteudosTeoricos = [];
  }
  if (!paoaCan_(profile, 'view.cronograma') && !paoaCan_(profile, 'manage.schedule')) {
    if (copy.configs) {
      copy.configs.periodos = [];
      copy.configs.cronograma = [];
      copy.configs.periodoAtivoId = '';
    }
  }
  if (!paoaCan_(profile, 'view.regras') && !paoaCan_(profile, 'manage.rules')) {
    if (copy.configs) copy.configs.regrasLaboratorio = [];
  }
  if (!paoaCan_(profile, 'manage.ingredients') && !paoaCan_(profile, 'manage.formulas') && !paoaCan_(profile, 'view.produtos')) copy.insumos = [];
  return copy;
}

function paoaEditableSections_(profile) {
  const sections = [];
  if (paoaCan_(profile, 'manage.products')) sections.push('products');
  if (paoaCan_(profile, 'manage.ingredients')) sections.push('ingredients');
  if (paoaCan_(profile, 'manage.formulas') || paoaCan_(profile, 'formula.use')) sections.push('formulas');
  if (paoaCan_(profile, 'manage.contents')) sections.push('contents');
  if (paoaCan_(profile, 'manage.schedule')) sections.push('schedule');
  if (paoaCan_(profile, 'manage.rules')) sections.push('rules');
  if (paoaCan_(profile, 'data.import') || paoaCan_(profile, 'data.reset')) sections.push('all_data');
  return Array.from(new Set(sections));
}

function paoaApplyAllowedData_(current, incoming, sections) {
  if (sections.includes('all_data')) return incoming;
  const result = paoaNormalizeData_(current);
  if (sections.includes('products')) {
    result.produtos = incoming.produtos;
    result.legislacoes = incoming.legislacoes;
  }
  if (sections.includes('ingredients')) result.insumos = incoming.insumos;
  if (sections.includes('formulas')) result.formulacoes = incoming.formulacoes;
  result.configs = result.configs || {};
  const sourceConfigs = incoming.configs || {};
  if (sections.includes('contents')) result.configs.conteudosTeoricos = sourceConfigs.conteudosTeoricos || [];
  if (sections.includes('schedule')) {
    result.configs.periodos = sourceConfigs.periodos || [];
    result.configs.periodoAtivoId = sourceConfigs.periodoAtivoId || '';
    result.configs.cronograma = sourceConfigs.cronograma || [];
  }
  if (sections.includes('rules')) result.configs.regrasLaboratorio = sourceConfigs.regrasLaboratorio || [];
  return result;
}

function paoaPermissionMap_(value, source) {
  const result = {};
  PAOA_PERMISSION_KEYS.forEach((key) => result[key] = source && Object.prototype.hasOwnProperty.call(source, key) ? source[key] === true : value === true);
  return result;
}

function paoaCan_(profile, permission) {
  return !!(profile && profile.permissions && profile.permissions[permission] === true);
}

function paoaAssertCan_(profile, permission) {
  if (!paoaCan_(profile, permission)) throw new Error('Seu perfil nao possui permissao para esta acao.');
}

function paoaNormalizeData_(data) {
  const copy = data && typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : {};
  if (copy.app_id && copy.app_id !== PAOA_APP_ID) throw new Error('Banco incompativel com o PAOA DEA.');
  copy.app_id = PAOA_APP_ID;
  copy.configs = copy.configs && typeof copy.configs === 'object' ? copy.configs : {};
  copy.produtos = Array.isArray(copy.produtos) ? copy.produtos : [];
  copy.insumos = Array.isArray(copy.insumos) ? copy.insumos : [];
  copy.formulacoes = Array.isArray(copy.formulacoes) ? copy.formulacoes : [];
  copy.legislacoes = Array.isArray(copy.legislacoes) ? copy.legislacoes : [];
  return copy;
}

function paoaBaseDb_() {
  return {
    app_id: PAOA_APP_ID,
    revision: 0,
    updatedAt: 0,
    data: paoaNormalizeData_({}),
    security: { profiles: [], users: [], audit: [] }
  };
}

function paoaReadDb_() {
  const file = paoaGetDbFile_();
  const text = file.getBlob().getDataAsString('UTF-8');
  if (!text) return paoaBaseDb_();
  const db = JSON.parse(text);
  if (!db || db.app_id !== PAOA_APP_ID) throw new Error('Banco remoto incompativel.');
  db.security = db.security || { profiles: [], users: [], audit: [] };
  db.security.profiles = Array.isArray(db.security.profiles) ? db.security.profiles : [];
  db.security.users = Array.isArray(db.security.users) ? db.security.users : [];
  db.security.audit = Array.isArray(db.security.audit) ? db.security.audit : [];
  db.data = paoaNormalizeData_(db.data);
  return db;
}

function paoaWriteDb_(db) {
  paoaGetDbFile_().setContent(JSON.stringify(db));
}

function paoaGetDbFile_() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty(PAOA_PROP_DB_FILE_ID);
  if (savedId) {
    try { return DriveApp.getFileById(savedId); } catch (err) { props.deleteProperty(PAOA_PROP_DB_FILE_ID); }
  }
  const files = DriveApp.getFilesByName(PAOA_DB_FILE_NAME);
  const file = files.hasNext() ? files.next() : DriveApp.createFile(PAOA_DB_FILE_NAME, JSON.stringify(paoaBaseDb_()), MimeType.PLAIN_TEXT);
  props.setProperty(PAOA_PROP_DB_FILE_ID, file.getId());
  return file;
}

function paoaBackupDb_(db) {
  const folder = paoaGetBackupFolder_();
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  folder.createFile('paoa_backup_' + stamp + '.json', JSON.stringify(db), MimeType.PLAIN_TEXT);
  const files = [];
  const iterator = folder.getFiles();
  while (iterator.hasNext()) files.push(iterator.next());
  files.sort((a, b) => b.getDateCreated().getTime() - a.getDateCreated().getTime()).slice(PAOA_MAX_BACKUPS).forEach((file) => file.setTrashed(true));
}

function paoaGetBackupFolder_() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty(PAOA_PROP_BACKUP_FOLDER_ID);
  if (savedId) {
    try { return DriveApp.getFolderById(savedId); } catch (err) { props.deleteProperty(PAOA_PROP_BACKUP_FOLDER_ID); }
  }
  const folders = DriveApp.getFoldersByName(PAOA_BACKUP_FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PAOA_BACKUP_FOLDER_NAME);
  props.setProperty(PAOA_PROP_BACKUP_FOLDER_ID, folder.getId());
  return folder;
}

function paoaIsInitialized_() {
  try { return paoaReadDb_().security.users.length > 0; } catch (err) { return false; }
}

function paoaNewUser_(login, name, pin, profileId, now) {
  const salt = Utilities.getUuid();
  return {
    id: 'user_' + paoaSafeId_(login) + '_' + now,
    login,
    name: String(name || login).trim(),
    profileId,
    active: true,
    salt,
    pinHash: paoaHashPin_(pin, salt),
    createdAt: now,
    updatedAt: now,
    lastLoginAt: 0
  };
}

function paoaPublicUser_(user) {
  return {
    id: user.id, login: user.login, name: user.name, profileId: user.profileId,
    active: user.active !== false, createdAt: user.createdAt || 0,
    updatedAt: user.updatedAt || 0, lastLoginAt: user.lastLoginAt || 0
  };
}

function paoaPublicProfile_(profile) {
  return {
    id: profile.id, name: profile.name, system: profile.system === true,
    permissions: paoaPermissionMap_(false, profile.permissions || {})
  };
}

function paoaAudit_(action, detail, login) {
  return { id: Utilities.getUuid(), action, detail, login, createdAt: Date.now() };
}

function paoaTrimAudit_(db) {
  db.security.audit = (db.security.audit || []).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).slice(0, 300);
}

function paoaNormalizeLogin_(value) {
  return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function paoaValidateLogin_(login) {
  if (!/^[a-z0-9._-]{3,40}$/.test(login)) throw new Error('O login deve ter de 3 a 40 caracteres: letras, numeros, ponto, hifen ou sublinhado.');
}

function paoaValidatePin_(pin) {
  if (!/^\d{6}$/.test(String(pin || ''))) throw new Error('A senha deve ter exatamente 6 digitos numericos.');
}

function paoaHashPin_(pin, salt) {
  return paoaDigestText_(String(salt || '') + '|' + String(pin || '') + '|PAOA_DEA_V1');
}

function paoaDigestText_(text) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(bytes);
}

function paoaSessionKey_(token) {
  if (!token) throw new Error('Entre para continuar.');
  return 'session_' + paoaDigestText_(String(token)).slice(0, 40);
}

function paoaSafeId_(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'item';
}

function paoaParsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function paoaJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
