/* Regression checks for the buildless veterinary prototype. Run: node tests/verify-med-vet.cjs */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const project = path.resolve(__dirname, '../');
function createHarness(initialStorage = {}) {
  const storage = new Map(Object.entries(initialStorage));
  const nodes = new Map();
  const listeners = {};
  const writes = [];
  let failWrites = false;
  class Node {
    constructor(selector) {
      this.selector = selector; this.id = selector.replace(/^#/, '');
      this.innerHTML = ''; this.textContent = ''; this.value = ''; this.disabled = false;
      this.dataset = {}; this.style = {}; this.attributes = {};
      const classes = new Set();
      this.classList = { add: (...x) => x.forEach(c => classes.add(c)), remove: (...x) => x.forEach(c => classes.delete(c)), contains: c => classes.has(c), toggle: c => classes.has(c) ? (classes.delete(c), false) : (classes.add(c), true) };
    }
    addEventListener(type, fn) { (this.listeners ??= {})[type] = fn; }
    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return this.attributes[k] ?? null; }
    removeAttribute(k) { delete this.attributes[k]; }
    focus() {} setSelectionRange() {} click() {} remove() {}
    querySelector(s) { return node(s); }
    querySelectorAll() { return []; }
    closest(s) { return s === 'button' ? this : node(s); }
    checkValidity() { return true; }
  }
  function node(s) { if (!nodes.has(s)) nodes.set(s, new Node(s)); return nodes.get(s); }
  const document = {
    querySelector: node,
    querySelectorAll: () => [],
    getElementById: id => node('#' + id),
    addEventListener(type, fn) { (listeners[type] ??= []).push(fn); },
    createElement: tag => new Node(tag),
    activeElement: null,
    body: node('body')
  };
  const sandbox = {
    console, document, Date, Intl, Math, JSON, Number, String, Object, Array, Map, Set, RegExp,
    innerWidth: 1440, navigator: {}, location: { hash: '' },
    setTimeout: () => 1, clearTimeout: () => {}, Blob,
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    FormData: class { entries() { return Object.entries(sandbox.formValues || {}); } },
    localStorage: {
      getItem: k => storage.has(k) ? storage.get(k) : null,
      setItem(k, v) { if (failWrites) throw new Error('simulated storage failure'); storage.set(k, String(v)); writes.push({ k, v: String(v) }); },
      removeItem: k => storage.delete(k)
    }
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  const run = code => vm.runInContext(code, context);
  for (const name of ['clinicas-data.js', 'med_vet-data.js', 'med_vet.js']) {
    const filename = path.join(project, name);
    if (fs.existsSync(filename)) vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  }
  return {
    run, node, storage, writes, context,
    failWrites(v) { failWrites = v; },
    setValues(values) { sandbox.formValues = values; },
    async submit(values) { sandbox.formValues = values; const button = node('#modal-submit'); button.textContent = 'Gravar registro'; const handler = node('#modal-form').onsubmit; assert.equal(typeof handler, 'function', 'form has submit handler'); return handler({ preventDefault() {}, submitter: button }); },
    async event(type, id, value, dataset = {}) { const target = node('#' + id); target.value = value; target.dataset = dataset; for (const fn of listeners[type] || []) await fn({ target, preventDefault() {} }); }
  };
}

async function main() {
  const results = [];
  async function test(name, fn) { try { await fn(); results.push({ name, ok: true }); console.log('PASS', name); } catch (error) { results.push({ name, ok: false }); console.error('FAIL', name, '\n ', error.stack || error); } finally { h.run("profile='Administração'; filter=''; page=1; activeDetail=null"); } }
  const h = createHarness();

  await test('boot renders the dashboard and preserves existing modules', () => {
    assert.match(h.node('#view').innerHTML, /Painel inicial/);
    assert.match(h.node('#nav-list').innerHTML, /Internamento/);
    assert.match(h.node('#nav-list').innerHTML, /Produtos e estoque/);
    const html = fs.readFileSync(path.join(project, 'med_vet.html'), 'utf8');
    const dataScript = html.indexOf('src="med_vet-data.js"');
    assert.ok(dataScript >= 0 && dataScript < html.indexOf('src="med_vet.js"'), 'HTML must load veterinary data rules before application');
  });
  await test('reception can edit patient and responsible without clinical privileges', () => {
    h.run("profile = 'Recepção'");
    assert.equal(h.run("can('pacientes', 'editar')"), true);
    assert.equal(h.run("can('responsaveis', 'editar')"), true);
    assert.equal(h.run("can('atendimentos', 'editar')"), false);
    assert.match(h.run("patientDetail(byId('P-001'))"), /data-act="edit/);
    assert.match(h.run("detail(byId('T-001'))"), /data-act="edit/);
    h.run("profile = 'Administração'");
  });
  await test('surgery, completed care and discharge have explicit colors', () => {
    for (const value of ['Concluída', 'Alta clínica', 'Executado', 'Realizado']) assert.match(h.run(`badge(${JSON.stringify(value)})`), /\bgood\b/);
    assert.match(h.run("badge('Programada')"), /\bwarn\b/);
    assert.match(h.run("badge('Cancelada')"), /\bbad\b/);
  });
  await test('registration lists expose inclusion date and examinations request date', () => {
    assert.match(h.run("moduleList('pacientes')"), /Data de inclusão/);
    assert.match(h.run("moduleList('responsaveis')"), /Data de inclusão/);
    assert.match(h.run("moduleList('exames')"), /Data de solicitação/);
  });
  await test('new examinations require and persist the selected request date', async () => {
    h.run("createFlow('exame')");
    const before = h.run("of('exame').length");
    await h.submit({ patient: 'P-001', name: 'Exame de regressão', requester: 'Veterinária de teste', requestedAt: '', priority: 'Rotina', lab: '', notes: '' });
    assert.equal(h.run("of('exame').length"), before);
    h.run("createFlow('exame')");
    await h.submit({ patient: 'P-001', name: 'Exame de regressão', requester: 'Veterinária de teste', requestedAt: '2026-11-16', priority: 'Rotina', lab: '', notes: '' });
    const entry = h.run("of('exame').find(x => x.title.includes('Exame de regressão'))");
    assert.equal(JSON.parse(entry.payload).requestedAt, '2026-11-16');
    assert.match(h.run(`detail(byId(${JSON.stringify(entry.entity_id)}))`), /16\/11\/2026/);
    const next = createHarness(Object.fromEntries(h.storage));
    assert.equal(next.run(`data(byId(${JSON.stringify(entry.entity_id)})).requestedAt`), '2026-11-16');
  });
  await test('new patient requires positive finite weight in the front end', async () => {
    for (const weight of ['', '0', '-1', 'NaN']) {
      await h.run("createFlow('paciente')");
      const before = h.run('backendRecords.length');
      await h.submit({ name: 'Teste peso ' + weight, responsavel: 'T-001', weight, species: 'Cão', breed: '', sex: 'Macho', alerts: '' });
      assert.equal(h.run('backendRecords.length'), before);
      assert.ok(h.node('#err-weight').textContent, 'weight receives visual validation');
    }
  });
  await test('reception edits persist without losing patient identity or inclusion date', async () => {
    h.run("profile='Recepção'");
    const included = h.run("byId('P-001').created_at");
    h.run("simpleAction(byId('T-001'), 'editRegistration')");
    await h.submit({ name: 'Marina revisada', phone: '(41) 99999-1111', email: 'marina@example.invalid', contact: 'Telefone', address: 'Endereço de teste', notes: 'Cadastro revisado' });
    assert.equal(h.run("byId('T-001').title"), 'Marina revisada');
    assert.equal(h.run("data(byId('T-001')).telefone"), '(41) 99999-1111');
    h.run("simpleAction(byId('P-001'), 'editRegistration')");
    await h.submit({ name: 'Luna revisada', responsavel: 'T-001', weight: '13.2', species: 'Cão', breed: 'SRD', sex: 'Fêmea', alerts: 'Alerta revisado' });
    assert.equal(h.run("byId('P-001').title"), 'Luna revisada');
    assert.equal(h.run("data(byId('P-001')).peso"), 13.2);
    assert.equal(h.run("data(byId('P-001')).prontuario"), 'PR-001');
    assert.equal(h.run("byId('P-001').created_at"), included);
    const next = createHarness(Object.fromEntries(h.storage));
    assert.equal(next.run("byId('P-001').title"), 'Luna revisada');
    assert.equal(next.run("data(byId('T-001')).telefone"), '(41) 99999-1111');
  });
  await test('agenda has a day selector wired to actual filtering', async () => {
    const html = h.run("moduleList('agenda')");
    assert.match(html, /id="agenda-date"/);
    await h.event('change', 'agenda-date', '2026-05-21');
    const may21 = h.run("moduleList('agenda')");
    assert.ok(may21.includes('Pipoca'));
    assert.ok(!may21.includes('Consulta · Luna'));
    await h.event('change', 'agenda-date', '2026-05-22');
    const may22 = h.run("moduleList('agenda')");
    assert.ok(may22.includes('Luna'));
    assert.ok(!may22.includes('Retorno · Pipoca'));
  });
  await test('agenda combines day, professional, status and room without dropping earlier filters', () => {
    h.run("agendaDate='2026-05-22'; agendaMode='dia'; agendaProfessional='Dra. Ana (fictícia)'; agendaStatus='Confirmado'; agendaRoom='Consultório 1'");
    assert.equal(h.run("agendaRecords(list('agendamento')).length"), 1);
    assert.equal(h.run("agendaRecords(list('agendamento'))[0].entity_id"), 'A-001');
    h.run("agendaRoom='Consultório 2'");
    assert.equal(h.run("agendaRecords(list('agendamento')).length"), 0);
    h.run("agendaProfessional=''; agendaStatus=''; agendaRoom=''; agendaMode='semana'");
    assert.equal(h.run("agendaRecords(list('agendamento')).length"), 3);
    h.run("agendaMode='mes'; agendaDate='2026-06-01'");
    assert.equal(h.run("agendaRecords(list('agendamento')).length"), 0);
    h.run("agendaMode='dia'; agendaDate='2026-05-22'");
  });
  await test('stock exposes numeric availability and separate entry/exit actions', () => {
    const html = h.run("moduleList('estoque')");
    assert.match(html, /Estoque disponível/);
    assert.match(html, /data-act="stockIn"/);
    assert.match(html, /data-act="consume"/);
    assert.match(html, /8/);
  });
  await test('typing a stock filter preserves availability and movement controls', async () => {
    h.run("navigate('estoque')");
    await h.event('input', 'list-filter', 'curativo');
    const filtered = h.node('#view').innerHTML;
    assert.match(filtered, /Estoque disponível/);
    assert.match(filtered, /Material de curativo/);
    assert.ok(!filtered.includes('Solução de limpeza'));
    assert.match(filtered, /data-act="stockIn"/);
    assert.match(filtered, /data-act="consume"/);
    await h.event('input', 'list-filter', '');
    assert.match(h.node('#view').innerHTML, /Solução de limpeza/);
  });
  await test('stock consumption updates balance and movement in one write and survives reload', async () => {
    const before = h.writes.length;
    const amount = h.run("Number(data(byId('PROD-001')).stock)");
    h.run("simpleAction(byId('PROD-001'), 'consume')");
    await h.submit({ product: 'PROD-001', quantity: '2', reason: 'Regressão consumo' });
    assert.equal(h.run("Number(data(byId('PROD-001')).stock)"), amount - 2);
    assert.equal(h.run("of('movimento').filter(r => data(r).productId === 'PROD-001').length"), 1);
    assert.equal(h.writes.length - before, 1, 'product and movement must share one storage write');
    const next = createHarness(Object.fromEntries(h.storage));
    assert.equal(next.run("Number(data(byId('PROD-001')).stock)"), amount - 2);
    assert.equal(next.run("of('movimento').filter(r => data(r).productId === 'PROD-001').length"), 1);
  });
  await test('stock failure rolls back both movement and balance', async () => {
    const before = h.run("Number(data(byId('PROD-001')).stock)");
    const count = h.run("of('movimento').length");
    const persisted = h.storage.get('clinicas-positivo:v2');
    h.run("simpleAction(byId('PROD-001'), 'stockIn')");
    h.failWrites(true);
    try { await h.submit({ product: 'PROD-001', quantity: '3', reason: 'Regressão falha' }); } finally { h.failWrites(false); }
    assert.equal(h.run("Number(data(byId('PROD-001')).stock)"), before);
    assert.equal(h.run("of('movimento').length"), count);
    assert.equal(h.storage.get('clinicas-positivo:v2'), persisted);
  });
  await test('stock rejects insufficient, zero, negative and nonfinite quantities', async () => {
    for (const quantity of ['99999', '0', '-2', 'NaN', 'Infinity']) {
      const before = h.run("Number(data(byId('PROD-001')).stock)");
      const count = h.run("of('movimento').length");
      h.run("simpleAction(byId('PROD-001'), 'consume')");
      await h.submit({ product: 'PROD-001', quantity, reason: 'Quantidade inválida' });
      assert.equal(h.run("Number(data(byId('PROD-001')).stock)"), before);
      assert.equal(h.run("of('movimento').length"), count);
    }
  });
  await test('data rules reject invalid weight, date, surgical status, discharge and procedure', () => {
    const checks = [
      ['paciente', 'Ativo', { peso: '' }],
      ['paciente', 'Ativo', { peso: '1abc' }],
      ['paciente', 'Ativo', { peso: 0 }],
      ['exame', 'Solicitado', {}],
      ['exame', 'Solicitado', { requestedAt: '2026-02-30' }],
      ['cirurgia', 'Cancelado', {}],
      ['cirurgia', 'Cancelada', {}],
      ['produto', 'Ativo', { stock: -1, min: 0 }],
      ['produto', 'Ativo', { stock: null, min: 0 }],
      ['movimento', 'Registrado', { quantity: 0 }],
      ['movimento', 'Registrado', { quantity: 'NaN' }],
      ['internamento', 'Alta clínica', {}],
      ['internamento', 'Alta clínica', { dischargeAt: '2026-11-16' }],
      ['procedimento', 'Realizado', { admissionId: 'INT-001', patientId: 'P-002', performedAt: '2026-11-16T15:00:00-03:00', notes: '', professional: 'Equipe' }]
    ];
    for (const [entity_type, status, payload] of checks) {
      const record = { entity_id: 'RULE-INVALID', entity_type, title: 'Regressão', status, payload: JSON.stringify(payload), created_at: '2026-11-16T15:00:00-03:00' };
      assert.equal(h.run(`MedVetData.validateRecord(${JSON.stringify(record)}).isOk`), false, `${entity_type} ${JSON.stringify(payload)}`);
    }
    assert.equal(h.run("MedVetData.parseWeight('12,4 kg')"), 12.4);
    assert.equal(h.run("MedVetData.parseWeight('2.10')"), 2.1);
    assert.equal(h.run("MedVetData.validTimestamp('2026-02-30T15:00:00-03:00')"), false);
  });
  await test('persistence enforces rules even when forms are bypassed', () => {
    h.run("globalThis.rulesStore = MedVetData.wrap(ClinicasData.open('vet_rules')); rulesStore.load()");
    const before = h.storage.get('clinicas-positivo:v2');
    for (const [entity_type, status, payload] of [
      ['paciente', 'Ativo', { peso: '' }],
      ['exame', 'Solicitado', {}],
      ['cirurgia', 'Inválida', {}],
      ['internamento', 'Alta clínica', {}]
    ]) {
      const record = { entity_id: 'DATA-BYPASS', entity_type, title: 'Tentativa', status, payload: JSON.stringify(payload) };
      assert.equal(h.run(`rulesStore.persist([${JSON.stringify(record)}])`), false);
      assert.ok(h.run('rulesStore.lastError.error'));
      assert.equal(h.storage.get('clinicas-positivo:v2'), before, 'invalid input must not change storage');
    }
  });
  await test('legacy metadata migrates idempotently and inclusion date survives editing', () => {
    const legacy = { entity_id: 'LEG-EX', entity_type: 'exame', title: 'Exame legado', status: 'Solicitado', updated_at: '2026-05-22T01:00:00.000Z', payload: '{}' };
    const normalized = h.run(`MedVetData.normalizeRecord(${JSON.stringify(legacy)})`);
    assert.equal(normalized.created_at, legacy.updated_at);
    assert.equal(JSON.parse(normalized.payload).requestedAt, '2026-05-21', 'migration date follows Sao Paulo');
    assert.equal(JSON.stringify(h.run(`MedVetData.normalizeRecord(${JSON.stringify(normalized)})`)), JSON.stringify(normalized));
    h.run(`globalThis.stableRecord = ${JSON.stringify({ ...normalized, entity_id: 'RULE-STABLE' })}`);
    assert.equal(h.run('rulesStore.persist([stableRecord])'), true);
    assert.equal(h.run("rulesStore.persist([{...rulesStore.load()[0], title:'Renomeado', created_at:'2030-01-01T00:00:00Z'}])"), true);
    assert.equal(h.run('rulesStore.load()[0].created_at'), legacy.updated_at);
  });
  await test('surgery cancellation is a persisted explicit status', async () => {
    h.run("simpleAction(byId('CIR-001'), 'surgeryCancel')");
    await h.submit({ reason: 'Cancelamento de regressão' });
    assert.equal(h.run("byId('CIR-001').status"), 'Cancelada');
    assert.match(h.run("detail(byId('CIR-001'))"), /tag bad/);
    const next = createHarness(Object.fromEntries(h.storage));
    assert.equal(next.run("byId('CIR-001').status"), 'Cancelada');
  });
  await test('hospital procedure links patient and admission and appears in history', async () => {
    h.run("simpleAction(byId('INT-001'), 'procedure')");
    await h.submit({ notes: 'Troca de curativo registrada', professional: 'Equipe de teste', performedAt: '2026-11-16T14:45' });
    const entry = h.run("of('procedimento').find(x => data(x).admissionId === 'INT-001')");
    assert.ok(entry, 'procedure was persisted');
    const payload = JSON.parse(entry.payload);
    assert.equal(payload.patientId, 'P-002');
    assert.equal(payload.professional, 'Equipe de teste');
    assert.ok(payload.performedAt.includes('T'));
    assert.match(h.run("detail(byId('INT-001'))"), /Troca de curativo registrada/);
    const next = createHarness(Object.fromEntries(h.storage));
    assert.match(next.run("detail(byId('INT-001'))"), /Troca de curativo registrada/);
  });
  await test('care becomes green when completed and remains in hospitalization history', async () => {
    h.run("simpleAction(byId('PR-001'), 'execute')");
    await h.submit({ executor: 'Equipe de teste', realTime: '2026-11-16T15:00', notes: 'Cuidado realizado' });
    assert.equal(h.run("byId('PR-001').status"), 'Executado');
    assert.match(h.run("badge(byId('PR-001').status)"), /\bgood\b/);
  });
  await test('hospitalization team can complete care and review its recorded history', async () => {
    const team = createHarness();
    team.run("profile='Equipe de internamento'");
    assert.equal(team.run("can('prescricoes','editar')"), true);
    assert.equal(team.run("can('prescricoes','cadastrar')"), false);
    assert.match(team.run("detail(byId('INT-001'))"), /data-act="execute"/);
    team.run("simpleAction(byId('PR-001'), 'execute')");
    await team.submit({ executor: 'Equipe de internamento', realTime: '2026-11-16T15:05', notes: 'Parâmetros verificados pela equipe' });
    assert.equal(team.run("byId('PR-001').status"), 'Executado');
    const history = team.run("detail(byId('INT-001'))");
    assert.match(history, /Parâmetros verificados pela equipe/);
    assert.match(history, /care-done/);
    const next = createHarness(Object.fromEntries(team.storage));
    assert.match(next.run("detail(byId('INT-001'))"), /Parâmetros verificados pela equipe/);
  });
  await test('hospitalization care cannot be assigned to a different patient', async () => {
    const guard = createHarness();
    const before = guard.run("of('prescricao').length");
    guard.run("createFlow('prescricao','P-002','INT-001')");
    const values = { patient: 'P-001', name: 'Cuidado com vínculo de teste', dose: '', unit: '', route: '', time: '16:00', professional: 'Veterinária de teste', notes: '' };
    await guard.submit(values);
    assert.equal(guard.run("of('prescricao').length"), before, 'mismatching patient must be rejected by the form');
    guard.run("createFlow('prescricao','P-002','INT-001')");
    await guard.submit({ ...values, patient: 'P-002' });
    const entry = guard.run("of('prescricao').find(x => x.title.includes('Cuidado com vínculo de teste'))");
    assert.ok(entry, 'matching admission and patient can save');
    assert.equal(JSON.parse(entry.payload).admissionId, 'INT-001');
    assert.equal(JSON.parse(entry.payload).patientId, 'P-002');
    const admission = { entity_id: 'RULE-ADMISSION', entity_type: 'internamento', title: 'Internamento vinculado', status: 'Internado', payload: JSON.stringify({ patientId: 'P-002' }) };
    const prescription = { entity_id: 'RULE-PRESCRIPTION', entity_type: 'prescricao', title: 'Cuidado inválido', status: 'Ativa', payload: JSON.stringify({ admissionId: admission.entity_id, patientId: 'P-001' }) };
    guard.run("globalThis.relationStore=MedVetData.wrap(ClinicasData.open('relations')); relationStore.load()");
    assert.equal(guard.run(`relationStore.persist(${JSON.stringify([admission, prescription])})`), false, 'data layer must reject conflicting admission and patient');
  });
  await test('discharge requires and persists date and time and renders green', async () => {
    h.run("simpleAction(byId('INT-001'), 'discharge')");
    await h.submit({ reason: 'Orientações registradas', dischargeAt: '' });
    assert.equal(h.run("byId('INT-001').status"), 'Internado');
    h.run("simpleAction(byId('INT-001'), 'discharge')");
    await h.submit({ reason: 'Orientações registradas', dischargeAt: '2026-11-16T16:20' });
    assert.equal(h.run("byId('INT-001').status"), 'Alta clínica');
    assert.equal(h.run("MedVetData.validTimestamp(data(byId('INT-001')).dischargeAt)"), true);
    assert.match(h.run("detail(byId('INT-001'))"), /16:20/);
    assert.match(h.run("badge(byId('INT-001').status)"), /\bgood\b/);
    const next = createHarness(Object.fromEntries(h.storage));
    assert.match(next.run("detail(byId('INT-001'))"), /16:20/);
    assert.equal(next.run("byId('INT-001').status"), 'Alta clínica');
  });

  await test('agenda selection opens and closes the side panel without changing records', async () => {
    const ui = createHarness();
    ui.run("navigate('agenda'); agendaDate='2026-05-22'; render()");
    const before = ui.writes.length;
    await ui.event('click', 'agenda-select-test', '', { agendaSelect: 'A-002' });
    assert.equal(ui.run('activeDetail'), null, 'selection keeps the calendar visible');
    assert.equal(ui.run('selectedAgendaRecord(agendaVisibleRecords(agendaRecords())).entity_id'), 'A-002');
    assert.match(ui.run('agendaSelection(agendaVisibleRecords(agendaRecords()))'), /Mingau/);
    await ui.event('click', 'agenda-close-test', '', { agendaClose: 'true' });
    assert.equal(ui.run('selectedAgendaRecord(agendaRecords())'), null);
    await ui.event('click', 'agenda-select-test', '', { agendaSelect: 'A-001' });
    await ui.event('click', 'patient-file-test', '', { patientFile: 'P-001' });
    assert.equal(ui.run('current'), 'pacientes');
    assert.equal(ui.run('activeDetail'), 'P-001');
    assert.equal(ui.writes.length, before, 'calendar selection must not write clinical records');
  });
  await test('day grid includes early and late appointments and separates overlapping events', () => {
    const ui = createHarness();
    ui.run(`current='agenda'; agendaDate='2026-05-22';
      backendRecords = [
        {...record('agendamento','Consulta antecipada','Agendado',{patientId:'P-003',room:'Consultório 1',date:'2026-05-22',time:'07:15',end:'07:45'}),entity_id:'UI-EARLY'},
        {...record('agendamento','Consulta sobreposta','Cancelado',{patientId:'P-003',room:'Consultório 1',date:'2026-05-22',time:'09:00',end:'09:30'}),entity_id:'UI-OVERLAP'},
        {...record('agendamento','Consulta noturna','Agendado',{patientId:'P-003',room:'Consultório 2',date:'2026-05-22',time:'20:45',end:'21:15'}),entity_id:'UI-LATE'}
      ];`);
    const board = ui.run('agendaBoard(agendaRecords())');
    for (const id of ['A-001', 'A-002', 'UI-EARLY', 'UI-OVERLAP', 'UI-LATE']) {
      assert.equal(board.split(`data-agenda-select="${id}"`).length - 1, 1, `appointment ${id} must render exactly once`);
    }
    assert.match(board, /07:00/);
    assert.match(board, /21:00/);
    const columnOf = id => new RegExp(`data-agenda-select="${id}"[^>]*style="grid-column:(\\d+)`).exec(board)?.[1];
    assert.ok(columnOf('A-001') && columnOf('UI-OVERLAP'));
    assert.notEqual(columnOf('A-001'), columnOf('UI-OVERLAP'), 'overlapping events need separate visible columns');
  });
  await test('week and month layouts keep weekend appointments reachable', async () => {
    const ui = createHarness();
    ui.run(`current='agenda'; agendaDate='2026-05-22';
      backendRecords = [{...record('agendamento','Consulta no domingo','Agendado',{patientId:'P-003',room:'Consultório 1',date:'2026-05-24',time:'10:00',end:'10:30'}),entity_id:'UI-SUNDAY'}]`);
    await ui.event('click', 'agenda-week-test', '', { agendaMode: 'semana' });
    assert.equal(ui.run('agendaMode'), 'semana');
    assert.match(ui.run('agendaBoard(agendaRecords())'), /data-agenda-select="UI-SUNDAY"/);
    await ui.event('click', 'agenda-month-test', '', { agendaMode: 'mes' });
    assert.equal(ui.run('agendaMode'), 'mes');
    const month = ui.run('agendaBoard(agendaRecords())');
    assert.match(month, /data-agenda-select="UI-SUNDAY"/);
    assert.match(month, /aria-label="31\/05\/2026"/);
  });
  await test('agenda side panel respects filters and profile changes', async () => {
    const ui = createHarness();
    ui.run("current='agenda'; agendaDate='2026-05-22'; render()");
    await ui.event('click', 'agenda-select-test', '', { agendaSelect: 'A-002' });
    await ui.event('change', 'agenda-status', 'Confirmado');
    assert.doesNotMatch(ui.run('agendaSelection(agendaVisibleRecords(agendaRecords()))'), /Mingau/);
    await ui.event('click', 'agenda-select-test', '', { agendaSelect: 'A-002' });
    assert.equal(ui.run('selectedAgendaRecord(agendaVisibleRecords(agendaRecords())).entity_id'), 'A-001');
    await ui.event('change', 'agenda-status', '');
    await ui.event('input', 'list-filter', 'Mingau');
    assert.doesNotMatch(ui.run('agendaBoard(agendaVisibleRecords(agendaRecords()))'), /data-agenda-select="A-001"/);
    await ui.event('change', 'profile-select', 'Aluno ou estagiário');
    assert.doesNotMatch(ui.run('agendaSelection(agendaVisibleRecords(agendaRecords()))'), /Mingau/);
    assert.doesNotMatch(ui.run('agendaBoard(agendaVisibleRecords(agendaRecords()))'), /data-agenda-select="A-002"/);
  });
  await test('dashboard daily count and shortcut use today independently of agenda filters', async () => {
    const ui = createHarness();
    ui.run(`backendRecords.push({...record('agendamento','Consulta de hoje','Agendado',{patientId:'P-001',room:'Consultório 1',professional:'Veterinária de teste',date:localDate(),time:'09:00',end:'09:30'}),entity_id:'DASH-TODAY'});
      agendaDate='2001-01-01'; agendaMode='mes'; agendaProfessional='Outro profissional'; agendaStatus='Cancelado'; agendaRoom='Outra sala'; filter='Sem resultado'; page=4;`);
    const html = ui.run('dashboard()');
    const metric = /<button[^>]*data-dashboard-day="([^"]+)"[^>]*>([\s\S]*?)<\/button>/.exec(html);
    assert.ok(metric, 'daily appointment shortcut is available');
    const count = Number(/class="number">(\d+)</.exec(metric[2])[1]);
    assert.equal(count, ui.run("list('agendamento').filter(r => data(r).date === localDate()).length"));
    const writes = ui.writes.length;
    await ui.event('click', 'dashboard-day-test', '', { dashboardDay: metric[1] });
    assert.equal(ui.run('current'), 'agenda');
    assert.equal(ui.run('agendaDate'), ui.run('localDate()'));
    assert.equal(ui.run('agendaMode'), 'dia');
    assert.equal(ui.run('agendaProfessional + agendaStatus + agendaRoom + filter'), '');
    assert.equal(ui.run("agendaRecords().some(r => r.entity_id === 'DASH-TODAY')"), true);
    assert.equal(ui.writes.length, writes, 'opening today must not modify appointments');
  });
  await test('dashboard scenarios open the indicated profile and screen without changing saved records', async () => {
    const ui = createHarness();
    const writes = ui.writes.length, saved = JSON.stringify(Object.fromEntries(ui.storage));
    const scenarios = [
      ['agenda', 'Recepção', 'agenda', null, 'Resumo'],
      ['prontuario', 'Médico-veterinário', 'pacientes', 'P-001', 'Resumo'],
      ['exames', 'Aluno ou estagiário', 'pacientes', 'P-001', 'Exames'],
      ['cirurgias', 'Médico-veterinário', 'cirurgias', 'CIR-001', 'Resumo'],
      ['internamento', 'Equipe de internamento', 'internamento', 'INT-001', 'Resumo'],
      ['supervisao', 'Professor ou supervisor', 'supervisao', null, 'Resumo'],
      ['estoque', 'Estoque ou farmácia', 'estoque', null, 'Resumo'],
      ['financeiro', 'Financeiro', 'financeiro', 'CO-001', 'Resumo']
    ];
    for (const [id, expectedProfile, expectedModule, expectedDetail, expectedTab] of scenarios) {
      await ui.event('click', 'dashboard-scenario-test', '', { dashboardScenario: id });
      assert.equal(ui.run('profile'), expectedProfile);
      assert.equal(ui.node('#profile-select').value, expectedProfile);
      assert.equal(ui.run('current'), expectedModule);
      assert.equal(ui.run('activeDetail'), expectedDetail);
      assert.equal(ui.run('patientTab'), expectedTab);
      assert.equal(ui.run('can(current)'), true);
      if (expectedDetail) assert.equal(ui.run('visible(byId(activeDetail))'), true);
      if (id === 'agenda') {
        assert.equal(ui.run('agendaDate'), '2026-05-22');
        assert.ok(ui.run('agendaRecords().length') > 0, 'demo day exposes the existing sample appointments');
      }
    }
    await ui.event('click', 'dashboard-scenario-test', '', { dashboardScenario: 'unknown' });
    assert.equal(ui.run('profile'), 'Financeiro', 'unknown shortcuts do not change the profile');
    assert.equal(ui.writes.length, writes);
    assert.equal(JSON.stringify(Object.fromEntries(ui.storage)), saved);
  });
  const failed = results.filter(x => !x.ok);
  console.log(`\n${results.length - failed.length}/${results.length} regression checks passed.`);
  if (failed.length) process.exitCode = 1;
}
module.exports = { createHarness, project };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
