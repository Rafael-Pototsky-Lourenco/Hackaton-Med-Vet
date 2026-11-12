const modules = [
  ['painel', 'Painel inicial', 'layout-dashboard', 'Geral'],
  ['recepcao', 'Recepção e fila', 'users-round', 'Geral'],
  ['agenda', 'Agenda', 'calendar-days', 'Geral'],
  ['pacientes', 'Pacientes', 'users', 'Cadastros'],
  ['atendimentos', 'Atendimentos e prontuários', 'file-heart', 'Clínica'],
  ['exames', 'Exames e radiografias', 'scan-line', 'Clínica'],
  ['cirurgias', 'Procedimentos', 'clipboard-check', 'Clínica'],
  ['estoque', 'Materiais e estoque', 'package', 'Operação'],
  ['orcamentos', 'Orçamentos e vendas', 'receipt', 'Operação'],
  ['financeiro', 'Caixa e financeiro', 'wallet', 'Operação'],
  ['supervisao', 'Supervisão acadêmica', 'graduation-cap', 'Gestão'],
  ['relatorios', 'Relatórios', 'chart-column', 'Gestão'],
  ['configuracoes', 'Configurações', 'settings', 'Gestão'],
  ['escopo', 'Escopo e validação', 'list-checks', 'Gestão'],
  ['documentacao', 'Documentação técnica', 'book-open', 'Referência']
];

const profiles = [
  'Administração', 'Gestão da clínica', 'Recepção', 'Cirurgião-dentista', 'Professor ou supervisor', 'Aluno ou estagiário', 'Estoque ou farmácia', 'Financeiro'
];

const entityModule = {
  paciente: 'pacientes',
  agendamento: 'agenda',
  atendimento: 'atendimentos',
  exame: 'exames',
  cirurgia: 'cirurgias',
  produto: 'estoque',
  movimento: 'estoque',
  orcamento: 'orcamentos',
  cobranca: 'financeiro',
  pagamento: 'financeiro',
  auditoria: 'relatorios',
  bloqueio: 'agenda',
  adendo: 'atendimentos',
  supervisao: 'supervisao'
};

const entityNames = {
  paciente: 'Paciente',
  agendamento: 'Agendamento',
  atendimento: 'Atendimento',
  exame: 'Exame',
  cirurgia: 'Procedimento',
  produto: 'Produto',
  movimento: 'Movimento',
  orcamento: 'Orçamento',
  cobranca: 'Cobrança',
  pagamento: 'Pagamento',
  auditoria: 'Auditoria',
  bloqueio: 'Bloqueio',
  adendo: 'Adendo',
  supervisao: 'Supervisão'
};

const keyFor = {
  pacientes: 'paciente',
  agenda: 'agendamento',
  atendimentos: 'atendimento',
  exames: 'exame',
  cirurgias: 'cirurgia',
  estoque: 'produto',
  orcamentos: 'orcamento',
  financeiro: 'cobranca',
  supervisao: 'supervisao'
};

const fixtures = [
  ["P-001", "paciente", "Helena Prado", "Ativo", {"idade": "34 anos", "sexo": "Feminino", "telefone": "(00) 00000-0001", "prontuario": "PR-001", "alertas": "Alergia informada a anestésico local; verificar histórico"}],
  ["P-002", "paciente", "Carlos Mendes", "Ativo", {"idade": "52 anos", "sexo": "Masculino", "telefone": "(00) 00000-0002", "prontuario": "PR-002"}],
  ["P-003", "paciente", "Beatriz Lima", "Ativo", {"idade": "27 anos", "sexo": "Feminino", "telefone": "(00) 00000-0003", "prontuario": "PR-003"}],
  ["A-001", "agendamento", "Consulta · Helena Prado", "Confirmado", {"patientId": "P-001", "professional": "Dra. Ana (fictícia)", "room": "Consultório 1", "date": "2026-05-22", "time": "09:00", "end": "09:30", "service": "Consulta"}],
  ["A-002", "agendamento", "Consulta · Carlos Mendes", "Agendado", {"patientId": "P-002", "professional": "Dr. Bruno (fictício)", "room": "Consultório 2", "date": "2026-05-22", "time": "11:00", "end": "11:30", "service": "Consulta"}],
  ["A-003", "agendamento", "Retorno · Beatriz Lima", "Concluído", {"patientId": "P-003", "professional": "Dra. Ana (fictícia)", "room": "Consultório 1", "date": "2026-05-21", "time": "14:00", "end": "14:30", "service": "Retorno"}],
  ["AT-001", "atendimento", "Atendimento · Beatriz Lima", "Finalizado", {"patientId": "P-003", "professional": "Dra. Ana (fictícia)", "type": "Retorno", "complaint": "Retorno de avaliação.", "notes": "Registro clínico fictício para demonstração.", "date": "2026-05-21T14:00:00"}],
  ["EX-001", "exame", "Radiografia panorâmica · Helena Prado", "Resultado disponível", {"patientId": "P-001", "requester": "Dra. Ana (fictícia)", "lab": "Serviço de imagem (fictício)", "result": "Laudo demonstrativo disponível; sem interpretação automática."}],
  ["CIR-001", "cirurgia", "Restauração programada · Helena Prado", "Programada", {"patientId": "P-001", "professional": "Dra. Ana (fictícia)", "room": "Sala de procedimentos", "date": "2026-05-24", "time": "10:00", "duration": "90 min"}],
  ["CIR-002", "cirurgia", "Profilaxia concluída · Carlos Mendes", "Concluída", {"patientId": "P-002", "professional": "Dr. Bruno (fictício)", "room": "Sala de procedimentos", "date": "2026-05-18", "time": "08:00", "duration": "60 min"}],
  ["PROD-001", "produto", "Material de moldagem", "Ativo", {"code": "MAT-001", "unit": "un", "stock": 8, "min": 10, "lot": "LOTE-A", "expiry": "2026-12-31", "priceCents": 1800}],
  ["PROD-002", "produto", "Solução antisséptica", "Ativo", {"code": "MAT-002", "unit": "frasco", "stock": 15, "min": 5, "lot": "LOTE-B", "expiry": "2026-09-30", "priceCents": 2500}],
  ["OR-001", "orcamento", "Orçamento · Helena Prado", "Apresentado", {"patientId": "P-001", "amountCents": 18000, "items": "Plano de tratamento e materiais (previstos)"}],
  ["CO-001", "cobranca", "Conta · Carlos Mendes", "Parcialmente paga", {"patientId": "P-002", "amountCents": 12000, "paidCents": 5000, "origin": "Lançamento manual demonstrativo"}]
].map(([entity_id, entity_type, title, status, payload]) => ({ entity_id, entity_type, title, status, payload: JSON.stringify(payload), updated_at: '2026-05-22T12:00:00.000Z', demo: true }));

let backendRecords = [], ready = false, current = 'painel', profile = profiles[0], activeDetail = null, page = 1, filter = '', sort = 'asc', agendaMode = 'dia', patientTab = 'Resumo', modalDirty = false;
const STORE_KEY = 'clinicas-positivo:odonto';
const store = {
  load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } },
  persist(list) { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); backendRecords = list; return { isOk: true }; } catch { return { isOk: false }; } },
  create(r) { return this.persist([...backendRecords, { ...r, __backendId: r.entity_id + '-' + Date.now() }]); },
  update(r) { return this.persist(backendRecords.map(x => x.__backendId === r.__backendId ? r : x)); }
};

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const data = r => {
  try { return JSON.parse(r.payload || '{}'); } 
  catch { return {}; }
};

const all = () => [...fixtures.filter(f => !backendRecords.some(r => r.entity_id === f.entity_id)), ...backendRecords];
const of = t => all().filter(r => r.entity_type === t);
const byId = id => all().find(r => r.entity_id === id);

const fmtDate = s => {
  if (!s) return '—';
  let p = String(s).slice(0, 10).split('-');
  return p.length === 3 ? p.reverse().join('/') : '—';
};

const money = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((Number(n) || 0) / 100);
const stamp = () => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date());
const uid = p => p.toUpperCase().slice(0, 3) + '-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

function can(module, action = 'visualizar') {
  if (module === 'documentacao') return action === 'visualizar';
  if (profile === 'Administração' || profile === 'Gestão da clínica') return true;
  if (module === 'escopo' || module === 'configuracoes' || module === 'painel') return action === 'visualizar';

  const allowed = {
    'Recepção': ['recepcao', 'agenda', 'pacientes', 'orcamentos'],
    'Cirurgião-dentista': ['recepcao', 'agenda', 'pacientes', 'atendimentos', 'exames', 'cirurgias', 'supervisao'],
    'Professor ou supervisor': ['agenda', 'pacientes', 'atendimentos', 'exames', 'cirurgias', 'supervisao', 'relatorios'],
    'Aluno ou estagiário': ['agenda', 'pacientes', 'atendimentos', 'exames', 'supervisao'],
    'Estoque ou farmácia': ['estoque'],
    'Financeiro': ['pacientes', 'orcamentos', 'financeiro', 'relatorios']
  };

  if (!(allowed[profile] || []).includes(module)) return false;
  if (action === 'visualizar') return true;
  if (action === 'exportar' || action === 'administrar' || action === 'cancelar') return false;
  if (profile === 'Aluno ou estagiário') return module === 'atendimentos' && ['cadastrar', 'editar'].includes(action);
  if (profile === 'Recepção') return ['recepcao', 'agenda', 'pacientes', 'orcamentos'].includes(module) && action !== 'finalizar' && action !== 'validar';
  if (profile === 'Financeiro') return ['orcamentos', 'financeiro'].includes(module) && action !== 'validar';
  if (profile === 'Estoque ou farmácia') return module === 'estoque';
  if (profile === 'Professor ou supervisor' && action === 'validar') return true;
  return action !== 'administrar';
}

function visible(r) {
  let m = entityModule[r.entity_type];
  if (!can(m)) return false;
  if (profile === 'Aluno ou estagiário') {
    if (!['paciente', 'agendamento', 'atendimento', 'exame', 'supervisao'].includes(r.entity_type)) return false;
    let d = data(r);
    return r.entity_id === 'P-001' || d.patientId === 'P-001' || d.student === 'Aluno(a) Camila (fictício)';
  }
  if (profile === 'Financeiro' && ['atendimento', 'exame', 'cirurgia'].includes(r.entity_type)) return false;
  return true;
}

function list(t) { return of(t).filter(visible); }

function toast(msg) {
  let e = $('#toast');
  e.textContent = msg;
  e.classList.remove('hidden');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.add('hidden'), 4800);
}

function icons() {
  if (window.lucide) lucide.createIcons();
}

function renderNav() {
  let last = '';
  $('#nav-list').innerHTML = modules.filter(m => can(m[0])).map(m => {
    let group = m[3] !== last ? `<div class="nav-group">${m[3]}</div>` : '';
    last = m[3];
    return group + `<button class="nav-btn ${current === m[0] ? 'active' : ''}" type="button" data-nav="${m[0]}" title="${m[1]}" ${current === m[0] ? 'aria-current="page"' : ''}><i data-lucide="${m[2]}"></i><span class="nav-label">${m[1]}</span></button>`;
  }).join('');
  icons();
}

function navigate(m, detail = null, filtered = '') {
  if (!can(m)) {
    toast('Este módulo não está disponível para o perfil simulado.');
    return;
  }
  current = m;
  activeDetail = detail;
  filter = filtered;
  page = 1;
  render();
  $('#sidebar').classList.remove('open');
  $('#main-content').focus();
}

function heading(title, description, action = '') {
  return `<div class="crumb">Início / ${esc(title)}</div><div class="page-heading"><div><h1>${esc(title)}</h1><p>${description}</p></div>${action}</div>`;
}

function badge(s) {
  let bad = /Cancelado|Vencido|Atrasado|Bloqueado|Devolvido/.test(s);
  let good = /Concluído|Finalizado|Avaliado|Pago|Validado|Ativo|Disponível/.test(s);
  return `<span class="tag ${bad ? 'bad' : good ? 'good' : 'warn'}">${esc(s)}</span>`;
}

function recordRow(r) {
  let d = data(r), p = d.patientId ? byId(d.patientId) : null;
  return `<tr>
    <td><button type="button" class="link-btn" data-detail="${esc(r.entity_id)}">${esc(r.title)}</button> ${r.demo ? '<span class="tag fict">Fictício</span>' : ''}</td>
    <td>${p ? esc(p.title) : esc(d.professional || d.telefone || d.code || '—')}</td>
    <td>${badge(r.status)}</td>
    <td>${esc(d.date ? fmtDate(d.date) + (d.time ? ' · ' + d.time : '') : r.entity_id)}</td>
  </tr>`;
}

function table(records, empty = 'Nenhum resultado encontrado.') {
  if (!records.length) return `<div class="empty">${empty}</div>`;
  return `<div class="table-wrap">
    <table>
      <thead><tr><th>Registro</th><th>Vínculo / responsável</th><th>Status</th><th>Data / ID</th></tr></thead>
      <tbody>${records.map(recordRow).join('')}</tbody>
    </table>
  </div>`;
}

function toolbar() {
  return `<div class="toolbar">
    <div class="field"><label for="list-filter">Filtrar lista</label><input id="list-filter" value="${esc(filter)}" placeholder="Nome, status ou ID"></div>
    <div class="field">
      <label for="list-sort">Ordenação</label>
      <select id="list-sort">
        <option value="asc" ${sort === 'asc' ? 'selected' : ''}>Nome A–Z</option>
        <option value="desc" ${sort === 'desc' ? 'selected' : ''}>Nome Z–A</option>
      </select>
    </div>
  </div>`;
}

function paged(records) {
  let q = filter.toLowerCase();
  let filtered = records.filter(r => (r.title + ' ' + r.status + ' ' + r.entity_id).toLowerCase().includes(q))
    .sort((a, b) => sort === 'asc' ? a.title.localeCompare(b.title, 'pt-BR') : b.title.localeCompare(a.title, 'pt-BR'));
  let total = Math.max(1, Math.ceil(filtered.length / 7));
  page = Math.min(page, total);
  
  return table(filtered.slice((page - 1) * 7, page * 7)) + 
    `<div class="pagination">
      <small>${filtered.length} registro(s) · Página ${page} de ${total}</small>
      <button class="btn small secondary" data-page="-1" ${page <= 1 ? 'disabled' : ''}>Anterior</button>
      <button class="btn small secondary" data-page="1" ${page >= total ? 'disabled' : ''}>Próxima</button>
    </div>`;
}

function moduleList(m) {
  let name = modules.find(x => x[0] === m)?.[1] || m, t = keyFor[m], records = t ? list(t) : [];
  let action = can(m, 'cadastrar') ? `<button class="btn" data-new="${t}"><i data-lucide="plus"></i> Novo registro</button>` : '';
  
  let description = {
    pacientes: 'Prontuários únicos e vínculos com responsáveis.',
    agenda: 'Agendamentos e recursos com validação de conflitos.',
    atendimentos: 'Rascunhos, finalização e adendos rastreáveis.',
    exames: 'Solicitações, laudos e avaliação identificada.',
    cirurgias: 'Planejamento e acompanhamento do procedimento.',
    estoque: 'Produtos, lotes e movimentações rastreáveis.',
    orcamentos: 'Valores previstos separados de cobranças realizadas.',
    financeiro: 'Cobranças, recebimentos parciais e saldo.',
    supervisao: 'Revisões vinculadas a aluno e supervisor.'
  }[m] || 'Registros de demonstração.';

  let special = '';

  if (m === 'agenda') {
    special = `<div class="panel">
      <div class="toolbar">
        <div class="field"><label for="agenda-mode">Visualização</label><select id="agenda-mode"><option value="dia" ${agendaMode === 'dia' ? 'selected' : ''}>Diária</option><option value="semana" ${agendaMode === 'semana' ? 'selected' : ''}>Semanal</option><option value="mes" ${agendaMode === 'mes' ? 'selected' : ''}>Mensal</option></select></div>
        <div class="field"><label for="agenda-prof">Profissional</label><select id="agenda-prof"><option value="">Todos</option><option>Dra. Ana (fictícia)</option><option>Dr. Bruno (fictício)</option></select></div>
        <div class="field"><label for="agenda-status">Status</label><select id="agenda-status"><option value="">Todos</option><option>Agendado</option><option>Confirmado</option><option>Chegou</option><option>Aguardando</option><option>Concluído</option></select></div>
        ${can(m, 'cadastrar') ? '<button class="btn secondary" data-new="bloqueio">Bloquear recurso</button>' : ''}
      </div>
      <p class="section-note">Visualização ${agendaMode === 'dia' ? 'diária' : agendaMode === 'semana' ? 'semanal' : 'mensal'} · filtre por profissional e status; sala, serviço e horários constam nos detalhes.</p>
    </div>`;
  }
  
  if (m === 'estoque') {
    special = `<div class="notice">Lotes vencidos não devem ser utilizados. Somente o consumo efetivo gera movimento de estoque. Controles especiais podem depender de requisitos externos.</div>`;
  }

  if (m === 'financeiro') {
    special = `<div class="grid metrics">
      <div class="metric"><span>Faturamento demonstrativo</span><strong class="number">${money(list('cobranca').reduce((a, r) => a + (data(r).amountCents || 0), 0))}</strong></div>
      <div class="metric"><span>Recebido</span><strong class="number">${money(list('cobranca').reduce((a, r) => a + (data(r).paidCents || 0), 0))}</strong></div>
      <div class="metric"><span>Saldo a receber</span><strong class="number">${money(list('cobranca').reduce((a, r) => a + Math.max(0, (data(r).amountCents || 0) - (data(r).paidCents || 0)), 0))}</strong></div>
    </div>`;
  }

  if (m === 'supervisao') {
    special = `<div class="notice">Aluno(a) Camila (fictício) → Supervisora Prof.ª Elisa (fictícia). Rascunhos de alunos exigem revisão antes de finalização ou liberação de documentos.</div>`;
  }

  return heading(name, description, action) + special + 
    `<section class="panel">${toolbar()}${paged(records)}</section>
    ${m === 'agenda' ? `<section class="panel"><h2>Bloqueios e indisponibilidades</h2>${table(list('bloqueio'), 'Nenhum bloqueio registrado.')}</section>` : ''}
    ${m === 'estoque' ? `<section class="panel"><h2>Movimentos de estoque</h2>${table(list('movimento'), 'Nenhuma movimentação registrada.')}</section>` : ''}
    ${m === 'financeiro' ? `<section class="panel"><h2>Pagamentos e caixa</h2>${table(list('pagamento'), 'Nenhum pagamento novo registrado.')}<p class="section-note">Meios eletrônicos só são confirmados por registro manual identificado nesta demonstração. Recibo não é nota fiscal.</p></section>` : ''}`;
}

function dashboard() {
  let cards = [
    ['Consultas do dia', of('agendamento').filter(r => data(r).date === '2026-05-22').length, 'agenda', ''],
    ['Pacientes aguardando', of('agendamento').filter(r => ['Chegou', 'Aguardando'].includes(r.status)).length, 'recepcao', ''],
    ['Atendimentos em andamento', of('atendimento').filter(r => r.status === 'Rascunho').length, 'atendimentos', 'Rascunho'],
    ['Procedimentos programados', of('cirurgia').filter(r => r.status === 'Programada').length, 'cirurgias', 'Programada'],
    ['Exames aguardando avaliação', of('exame').filter(r => r.status === 'Resultado disponível').length, 'exames', 'Resultado disponível'],
    ['Aguardando supervisão', of('atendimento').filter(r => r.status === 'Aguardando supervisão').length, 'supervisao', ''],
    ['Contas a receber', of('cobranca').filter(r => (data(r).amountCents || 0) > (data(r).paidCents || 0)).length, 'financeiro', ''],
    ['Estoque mínimo', of('produto').filter(r => (data(r).stock || 0) <= (data(r).min || 0)).length, 'estoque', '']
  ].filter(x => can(x[2]));
  
  return heading('Painel inicial', `Visão operacional do perfil simulado: ${profile}. Indicadores baseados nos registros visíveis.`) +
    `<div class="grid metrics">${cards.map(c => `<button class="metric" data-nav="${c[2]}" data-filter="${esc(c[3])}"><span>${c[0]}</span><strong class="number">${c[1]}</strong><span class="caption">Abrir lista filtrada →</span></button>`).join('')}</div>
    <div class="grid two-col">
      <section class="panel">
        <div class="panel-head"><h2>Próximos passos</h2></div>
        <p class="section-note">Comece pelos cadastros, confira a agenda e abra um atendimento. Cada registro mantém seus vínculos por ID.</p>
        <div class="actions">
          <button class="btn secondary" data-nav="pacientes">Ver pacientes</button>
          <button class="btn secondary" data-nav="agenda">Ver agenda</button>
        </div>
      </section>
      <section class="panel">
        <h2>Estado da demonstração</h2>
        <p>${ready ? `${backendRecords.length} registro(s) no armazenamento local; exemplos fictícios identificados separadamente.` : 'Aguardando leitura dos dados...'}</p>
        <p class="section-note">Nenhuma ação é executada em sistemas da instituição.</p>
      </section>
    </div>`;
}

function reception() {
  let rows = list('agendamento').filter(r => ['Confirmado', 'Agendado', 'Chegou', 'Aguardando', 'Em atendimento'].includes(r.status));
  return heading('Recepção e fila', 'Chegada registrada manualmente; prioridade clínica não é atribuída automaticamente.', can('agenda', 'cadastrar') ? '<button class="btn" data-new="agendamento">Novo agendamento</button>' : '') + 
    `<section class="panel">
      <h2>Fila de atendimento</h2>
      ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>Paciente</th><th>Horário / chegada</th><th>Profissional</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows.map(r => {
        let d = data(r);
        return `<tr>
          <td>${esc(byId(d.patientId)?.title || '—')} <span class="tag fict">Fictício</span></td>
          <td>${fmtDate(d.date)} ${esc(d.time)}${d.arrivedAt ? ' · chegada ' + esc(d.arrivedAt) : ''}</td>
          <td>${esc(d.professional)}</td>
          <td>${badge(r.status)}</td>
          <td class="actions">
            ${!d.arrivedAt && can('recepcao', 'editar') ? `<button class="btn small secondary" data-act="arrive" data-id="${r.entity_id}">Registrar chegada</button>` : ''}
            ${can('atendimentos', 'cadastrar') ? `<button class="btn small secondary" data-start="${r.entity_id}">Abrir atendimento</button>` : ''}
            <button class="btn small secondary" data-detail="${r.entity_id}">Detalhes</button>
          </td>
        </tr>`;
      }).join('')}</tbody></table></div>` : '<div class="empty">Nenhum paciente na fila.</div>'}
    </section>`;
}

function patientDetail(r) {
  let d = data(r), tabs = ['Resumo', 'Histórico clínico', 'Consultas', 'Exames', 'Procedimentos', 'Conta/cobranças'].filter(x => x !== 'Conta/cobranças' || can('financeiro'));
  let related = all().filter(x => data(x).patientId === r.entity_id && visible(x));
  let types = { 'Histórico clínico': ['atendimento', 'adendo'], 'Consultas': ['agendamento'], 'Exames': ['exame'], 'Procedimentos': ['cirurgia'], 'Conta/cobranças': ['cobranca'] };
  
  let content = patientTab === 'Resumo' ? 
    `<div class="grid two-col">
      <div class="panel"><h2>Identificação</h2>
        <p><strong>Prontuário:</strong> ${esc(d.prontuario || r.entity_id)}<br>
        <strong>Idade:</strong> ${esc(d.idade || 'Não informado')}<br>
        <strong>Contato:</strong> ${esc(d.telefone || 'Não informado')}<br>
        <strong>Sexo:</strong> ${esc(d.sexo || 'Não informado')}<br>
        <strong>Situação:</strong> ${esc(r.status)}</p>
      </div>
      <div class="panel"><h2>Alertas clínicos</h2>
        <p>${esc(d.alertas || 'Não informado — não equivale a ausência de alergias ou reações.')}</p>
        <p class="section-note">Histórico do paciente permanece associado ao prontuário quando o responsável muda.</p>
      </div>
    </div>` : 
    `<section class="panel">${table(related.filter(x => types[patientTab]?.includes(x.entity_type)), 'Nenhum registro nesta aba.')}</section>`;
  
  return heading(r.title, 'Paciente fictício · ' + (d.prontuario || r.entity_id), '<button class="btn secondary" data-nav="pacientes">Voltar à lista</button>') +
    `<div class="tabs" role="tablist" aria-label="Seções do paciente">${tabs.map(t => `<button role="tab" class=" ${patientTab === t ? 'active' : ''}" aria-selected="${patientTab === t}" data-tab="${t}">${t}</button>`).join('')}</div>${content}`;
}

function detail(r) {
  if (!r || !visible(r)) return '<div class="empty">Registro indisponível para este perfil.</div>';
  if (r.entity_type === 'paciente') return patientDetail(r);
  
  let d = data(r), m = entityModule[r.entity_type], related = d.patientId ? byId(d.patientId) : null;
  let lines = Object.entries(d).filter(([k]) => !['patientId'].includes(k)).map(([k, v]) => `<div><strong>${esc(({ professional: 'Profissional', room: 'Sala', date: 'Data', time: 'Hora', end: 'Término', complaint: 'Queixa principal', notes: 'Registro', result: 'Laudo', stock: 'Estoque', priceCents: 'Preço', amountCents: 'Valor', paidCents: 'Recebido', reason: 'Motivo', student: 'Aluno', supervisor: 'Supervisor', unit: 'Unidade', lot: 'Lote', expiry: 'Validade', origin: 'Origem', arrivedAt: 'Chegada' }[k] || k))}:</strong> ${esc(k === 'date' || k === 'expiry' ? fmtDate(v) : k.endsWith('Cents') ? money(v) : v)}</div>`).join('');
  let acts = [];
  
  const add = (label, act, permission = 'editar') => { if (can(m, permission)) acts.push(`<button class="btn small secondary" data-act="${act}" data-id="${r.entity_id}">${label}</button>`); };
  
  if (r.entity_type === 'agendamento') {
    if (!['Cancelado', 'Concluído'].includes(r.status)) { add('Registrar chegada', 'arrive'); add('Reagendar', 'reschedule'); add('Cancelar', 'cancel', 'cancelar'); }
    if (can('atendimentos', 'cadastrar')) acts.push(`<button class="btn small" data-start="${r.entity_id}">Abrir atendimento</button>`);
    add('Copiar confirmação', 'copy');
  }
  if (r.entity_type === 'atendimento') {
    if (r.status === 'Rascunho') {
      add('Continuar rascunho', 'edit');
      if (profile === 'Aluno ou estagiário') add('Enviar para supervisão', 'submit');
      else add('Finalizar', 'finalize', 'finalizar');
    }
    if (r.status === 'Aguardando supervisão' && can('supervisao', 'validar')) { add('Validar versão', 'validate', 'validar'); add('Devolver', 'return', 'validar'); }
    if (r.status === 'Finalizado') { add('Adicionar adendo', 'addendum'); if (can('exames', 'cadastrar')) acts.push(`<button class="btn small secondary" data-new="exame" data-patient="${esc(d.patientId || '')}">Solicitar exame</button>`); }
  }
  if (r.entity_type === 'exame') { if (r.status === 'Solicitado') add('Anexar resultado textual', 'result'); if (r.status === 'Resultado disponível') add('Registrar avaliação', 'evaluate', 'validar'); }
  if (r.entity_type === 'cirurgia') { if (r.status === 'Programada') { add('Iniciar procedimento', 'surgeryStart'); } if (r.status === 'Em andamento') add('Concluir procedimento', 'surgeryFinish'); }
  if (r.entity_type === 'produto') { add('Entrada de estoque', 'stockIn'); add('Consumo clínico', 'consume'); }
  if (r.entity_type === 'orcamento') { add('Aprovar itens', 'approve'); add('Aprovação parcial', 'partial'); }
  if (r.entity_type === 'cobranca' && can('financeiro', 'editar')) { add('Receber parcialmente', 'pay'); add('Estornar lançamento', 'reverse', 'cancelar'); }
  
  return heading(r.title, `${entityNames[r.entity_type] || 'Registro'} · ID ${r.entity_id} · ${r.demo ? 'Registro fictício de exemplo' : 'Registro de demonstração'}`, `<button class="btn secondary" data-nav="${m}">Voltar</button>`) +
    `<section class="panel"><div class="panel-head"><h2>Detalhes</h2>${badge(r.status)}</div><div class="grid two-col" style="line-height:1.9"><div><strong>Paciente:</strong> ${esc(related?.title || 'Não se aplica')}<br><strong>Identificador:</strong> ${esc(r.entity_id)}<br><strong>Atualizado:</strong> ${esc(r.demo ? 'Exemplo fictício' : stamp())}</div><div>${lines || 'Sem informações adicionais.'}</div></div><div class="actions" style="margin-top:20px">${acts.join('')}</div></section>
    ${r.entity_type === 'atendimento' ? `<section class="panel"><h2>Adendos e revisão</h2>${table(all().filter(x => ['adendo', 'supervisao'].includes(x.entity_type) && data(x).parentId === r.entity_id), 'Nenhum adendo ou comentário.')}</section>` : ''}
    ${r.entity_type === 'cobranca' ? `<section class="panel"><h2>Saldo</h2><strong>${money(Math.max(0, (d.amountCents || 0) - (d.paidCents || 0)))}</strong><p class="section-note">Pagamento parcial não encerra a conta. Alta clínica é independente do saldo.</p></section>` : ''}`;
}

function settings() {
  let actions = ['visualizar', 'cadastrar', 'editar', 'finalizar', 'validar', 'cancelar', 'exportar', 'administrar'];
  return heading('Configurações', 'Perfis e matriz de ações — simulação, sem autenticação real.') +
    `<section class="panel"><h2>Perfil em uso</h2><p>${esc(profile)} · altere o perfil no cabeçalho para observar acessos diferentes.</p><div class="notice">Em produção, a autorização deve ser validada no servidor; esconder botões não protege dados. Não utilize dados reais nesta demonstração.</div></section>
    <section class="panel"><h2>Matriz de permissões simuladas</h2><div class="table-wrap"><table><thead><tr><th>Módulo</th>${actions.map(a => `<th>${a}</th>`).join('')}</tr></thead><tbody>${modules.filter(x => !['painel', 'escopo', 'configuracoes'].includes(x[0])).map(m => `<tr><td>${m[1]}</td>${actions.map(a => `<td aria-label="${can(m[0], a) ? 'Permitido' : 'Restrito'}">${can(m[0], a) ? '✓' : '—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
    <section class="panel"><h2>Dependências para uso real</h2><p class="section-note">Autenticação, autorização no servidor, sessões seguras, recuperação de acesso, criptografia, backups e restauração, controle de anexos, retenção de dados, monitoramento e revisão institucional precisam de projeto e validação independentes. Esta interface não declara conformidade legal, validade jurídica nem segurança de produção.</p></section>`;
}

function scope() {
  let tests = [['Navegação entre módulos', 'Executado'], ['Cadastro e busca em registros gravados', 'Executado'], ['Conflito básico de agenda', 'Executado'], ['Rascunho, supervisão e adendo', 'Executado'], ['Pagamento parcial e saldo', 'Executado'], ['Controle básico de estoque', 'Executado'], ['Autorização no servidor', 'Não executado'], ['Integração de mensagens e laboratório', 'Não executado'], ['Assinatura digital certificada', 'Não aplicável'], ['Emissão fiscal', 'Não executado']];
  return heading('Escopo e validação', 'Transparência sobre o que esta demonstração faz e o que não faz.') +
    `<div class="grid two-col"><section class="panel"><h2>Recursos implementados</h2><p class="section-note">Navegação, busca filtrada pelo perfil simulado, cadastros vinculados, agenda com conflito, chegada, rascunho e adendo, submissão acadêmica, exames, procedimentos, movimentos de estoque e recebimento parcial. Registros de exemplo e novos registros são identificáveis.</p><h2>Armazenamento disponível</h2><p class="section-note">Novos registros e alterações são salvos no armazenamento local (localStorage) deste navegador. Os exemplos iniciais são dados fictícios embutidos na demonstração. Ao limpar os dados do navegador ou usar outro dispositivo, os registros criados não estarão disponíveis.</p></section><section class="panel"><h2>Dependências e riscos</h2><p class="section-note">Sem conexão com WhatsApp, e-mail, equipamentos, laboratórios, pagamentos, assinaturas ou emissão fiscal. Não há autorização no servidor nem gestão segura de anexos. O uso com dados reais exigiria segurança, revisão clínica, jurídica e institucional, testes e implantação próprios. Não há aprovação ou implantação declarada.</p></section></div>
    <section class="panel"><h2>Checklist de testes do ambiente</h2><div class="checklist">${tests.map(([a, b]) => `<div class="check-row"><span>${a}</span>${badge(b)}</div>`).join('')}</div><p class="section-note" style="margin-top:14px">“Executado” indica comportamento implementado na interface, não homologação institucional ou teste de produção.</p></section>`;
}

function reports() {
  let count = t => list(t).length;
  return heading('Relatórios', 'Resumo operacional dos registros visíveis ao perfil.') +
    `<div class="grid metrics">${['paciente', 'agendamento', 'atendimento', 'exame', 'cirurgia'].map(t => `<div class="metric"><span>${entityNames[t]}s</span><strong class="number">${count(t)}</strong></div>`).join('')}</div>
    <section class="panel"><h2>Auditoria de ações</h2>${table(list('auditoria'), 'Nenhuma ação nova registrada nesta sessão de dados.')}${can('relatorios', 'exportar') ? '<button class="btn secondary" id="export-btn" style="margin-top:15px">Exportar resumo CSV</button>' : '<p class="section-note">Exportação restrita para este perfil.</p>'}</section>`;
}

function documentation() {
  const sections = [
    // Array with all the document text sections
    ['contexto', 'Contexto e problema', `<p>Uma clínica odontológica universitária coordena agendamentos, atendimentos, exames de imagem, procedimentos, materiais e cobranças entre equipes, estudantes e turnos. Registros dispersos podem dificultar continuidade clínica e rastreabilidade de decisões. Registros dispersos podem dificultar continuidade clínica, localização de informações e rastreabilidade de decisões.</p><div class="doc-callout"><strong>Limite da fonte:</strong> esta documentação descreve a demonstração visível nesta página e propõe requisitos para um eventual sistema clínico. Não constitui especificação institucional aprovada.</div>`],
    ['objetivos', 'Objetivos e escopo', `<p><strong>Objetivos propostos:</strong> manter vínculos entre pacientes e episódios; apoiar agenda e fila; registrar decisões clínicas e procedimentos; dar visibilidade a materiais, cobranças e supervisão.</p><p><strong>Escopo demonstrado:</strong> cadastros, agenda, recepção, atendimentos, exames, procedimentos, estoque, orçamentos, financeiro, supervisão e relatórios básicos. <strong>Fora do escopo atual:</strong> operação clínica real, autenticação forte, integrações externas, anexos binários, emissão fiscal e assinatura certificada.</p>`],
    ['arquitetura', 'Visão geral da arquitetura', `<p><span class="doc-label observed">Observado na demonstração</span> Interface web de página única com navegação por módulos, regras no navegador e registros de demonstração gravados no armazenamento local do navegador; exemplos fictícios estão embutidos na página. A interface não representa uma arquitetura de produção.</p><p><span class="doc-label">A confirmar</span> Serviços de domínio, banco transacional, fila de eventos, armazenamento de ficheiros, fronteiras de rede, estratégia multiunidade e hospedagem. Para produção, autorização e validação devem ocorrer no servidor, não apenas na interface.</p>`],
    ['modulos', 'Módulos e responsabilidades', `<div class="table-wrap"><table><thead><tr><th>Módulo</th><th>Responsabilidade esperada</th><th>Estado</th></tr></thead><tbody><tr><td>Recepção e agenda</td><td>Marcar, reagendar, bloquear recursos, registrar chegada e acompanhar fila.</td><td>Demonstração</td></tr><tr><td>Cadastro de pacientes</td><td>Identificação e histórico longitudinal do paciente.</td><td>Demonstração</td></tr><tr><td>Atendimentos, exames e procedimentos</td><td>Episódios, registros clínicos, solicitações e resultados e acompanhamento de procedimentos.</td><td>Demonstração</td></tr><tr><td>Estoque</td><td>Materiais, lotes, validade, entradas e consumo.</td><td>Demonstração</td></tr><tr><td>Orçamentos e financeiro</td><td>Previsão de custos, cobranças, pagamentos parciais e saldo.</td><td>Demonstração</td></tr><tr><td>Supervisão e relatórios</td><td>Revisão académica e indicadores operacionais básicos.</td><td>Demonstração</td></tr></tbody></table></div>`],
    ['fluxos', 'Principais fluxos do sistema', `<ol><li><strong>Entrada:</strong> cadastrar paciente → agendar → registrar chegada → abrir atendimento.</li><li><strong>Clínico:</strong> criar rascunho → finalizar ou enviar à supervisão → registrar adendo quando aplicável; solicitar exame → registrar resultado → avaliação identificada.</li><li><strong>Procedimentos:</strong> programar procedimento → registrar início e conclusão.</li><li><strong>Operacional:</strong> registrar entrada ou consumo de materiais → acompanhar saldo; apresentar orçamento → criar cobrança → registrar recebimento parcial.</li></ol><p>Estes fluxos são representações funcionais da demonstração; critérios clínicos e aprovações formais permanecem a confirmar.</p>`],
    ['dados', 'Modelo de dados e entidades', `<p><span class="doc-label observed">Observado</span> O armazenamento da demonstração usa <code>entity_id</code>, <code>entity_type</code>, <code>title</code>, <code>status</code>, <code>payload</code> (JSON em texto) e <code>updated_at</code>. O vínculo <code>patientId</code> fica no payload; não há modelo relacional de produção definido.</p><div class="table-wrap"><table><thead><tr><th>Entidade conceptual</th><th>Relações principais</th><th>Notas</th></tr></thead><tbody><tr><td>Paciente</td><td>Prontuário único</td><td>Identidade e prontuário único a definir em produção.</td></tr><tr><td>Agendamento · Atendimento</td><td>Ambos → paciente</td><td>Atendimento pode nascer de agendamento ou entrada direta.</td></tr><tr><td>Exame · Procedimento</td><td>Cada um → paciente</td><td>Resultados e execução têm ciclos próprios.</td></tr><tr><td>Produto · Movimento</td><td>Movimento → produto</td><td>Lote, validade e unidade de medida requerem normalização.</td></tr><tr><td>Orçamento · Cobrança · Pagamento</td><td>→ paciente; pagamento → cobrança</td><td>Valores em centavos; reconciliação a definir.</td></tr></tbody></table></div><p><span class="doc-label">A confirmar</span> Cardinalidades, chaves, unicidade, versionamento, política de exclusão e esquema migrável.</p>`],
    ['permissoes', 'Perfis de utilizador e permissões', `<p>Perfis simulados: Administração, Gestão da clínica, Recepção, Cirurgião-dentista, Professor ou supervisor, Aluno ou estagiário, Estoque ou farmácia e Financeiro. A interface mostra módulos e ações conforme o perfil escolhido, mas <strong>não autentica nem protege dados no servidor</strong>.</p><p><span class="doc-label">Decisão a confirmar</span> Matriz oficial por recurso e ação (ler, criar, editar, validar, finalizar, cancelar, exportar e administrar), segregação por unidade, acesso de emergência, delegação e revisão periódica de acessos.</p>`],
    ['apis', 'APIs e integrações', `<p><span class="doc-label observed">Observado</span> A demonstração usa a armazenamento local do navegador (localStorage) para registros; não expõe API pública nem envia mensagens ou pagamentos.</p><p><span class="doc-label">A confirmar</span> Contratos REST/eventos, autenticação entre sistemas, versionamento, idempotência, limites, retentativas, webhooks e mapeamentos para laboratório, comunicação, meios de pagamento, emissão fiscal e equipamentos. Nenhum endpoint ou fornecedor está especificado.</p>`],
    ['requisitos', 'Requisitos funcionais e não funcionais', `<h3>Funcionais propostos</h3><ul><li>RF-01: cadastrar pacientes e manter registros rastreáveis.</li><li>RF-02: gerir agenda com detecção de conflitos de sala e profissional.</li><li>RF-03: registrar atendimentos, solicitação e avaliação de exames e procedimentos.</li><li>RF-04: registrar autoria, hora e justificativas em cada ação.</li><li>RF-05: registrar movimentos de estoque, cobranças e pagamentos sem apagar histórico.</li></ul><h3>Não funcionais a acordar</h3><ul><li>Disponibilidade, tempos de resposta, capacidade, acessibilidade WCAG 2.2 AA e suporte a dispositivos.</li><li>Consistência transacional, retenção, interoperabilidade, desempenho de busca e recuperação de desastre.</li></ul><p><span class="doc-label">A confirmar</span> Metas mensuráveis, cargas de referência e níveis de serviço.</p>`],
    ['seguranca', 'Segurança, privacidade e auditoria', `<p>Esta página contém dados fictícios; o seletor de perfil é simulado. Não inserir dados clínicos ou pessoais reais. Para uso real, projetar autenticação, autorização no servidor, criptografia em trânsito e repouso, proteção de sessões, minimização de dados, gestão de consentimento/base legal aplicável, retenção e resposta a incidentes.</p><p>Auditoria esperada: ator autenticado, ação, recurso, instante, origem e mudanças relevantes, com integridade e acesso restrito. O módulo de auditoria demonstrativo <strong>não comprova</strong> trilha completa ou imutável.</p>`],
    ['observabilidade', 'Observabilidade e tratamento de erros', `<p><span class="doc-label observed">Observado</span> Falhas de carregamento e gravação exibem mensagens na interface; não há monitoramento operacional de produção documentado.</p><p><span class="doc-label">A confirmar</span> Logs estruturados sem dados sensíveis, métricas, rastreamento distribuído, alertas, correlação por requisição, estratégia de retentativa, filas de falhas e procedimentos de suporte. Erros parciais em operações de múltiplas gravações exigem reconciliação.</p>`],
    ['implantacao', 'Implantação e ambientes', `<p><span class="doc-label observed">Observado</span> A versão atual é uma demonstração web estática; não há implantação institucional declarada.</p><p><span class="doc-label">A confirmar</span> Ambientes de desenvolvimento, testes, homologação e produção; infraestrutura, segregação de credenciais, migrações, revisão de mudanças, estratégia de release/rollback, configuração e residência de dados.</p>`],
    ['backup', 'Backup e recuperação', `<p><span class="doc-label">A confirmar</span> Política de cópias, frequência, retenção, cifragem, localização, responsáveis, RPO, RTO e exercícios de restauração. O armazenamento local do navegador utilizado pela demonstração não deve ser interpretada como plano institucional de backup ou recuperação.</p>`],
    ['testes', 'Testes e critérios de aceitação', `<ul><li>Unitários: validações, estados e cálculos de saldo.</li><li>Integração: vínculos entre entidades, conflitos de agenda e gravações compostas.</li><li>End-to-end: chegada até atendimento finalizado, supervisão e pagamento parcial.</li><li>Segurança e privacidade: controle de acesso no servidor, isolamento, auditoria e retenção.</li><li>Resiliência: falha de rede, concorrência, recuperação e restauração de backup.</li><li>Acessibilidade e usabilidade: teclado, leitores de ecrã e fluxos por perfil.</li></ul><p><span class="doc-label">A confirmar</span> Plano, responsáveis, evidências e critérios de homologação institucional. A existência de fluxos nesta demonstração não significa que tenham sido homologados.</p>`],
    ['riscos', 'Riscos e trade-offs', `<ul><li><strong>Armazenamento flexível vs. integridade:</strong> payload JSON facilita protótipo, mas limita validação e consultas consistentes.</li><li><strong>Regras no cliente vs. segurança:</strong> feedback imediato não substitui controle transacional e autorização no servidor.</li><li><strong>Gravações sequenciais vs. atomicidade:</strong> movimento e saldo, ou pagamento e cobrança, podem ficar divergentes se uma etapa falhar.</li><li><strong>Dados demonstrativos vs. operação:</strong> exemplos simplificados não representam complexidade clínica, fiscal e regulatória real.</li></ul>`],
    ['evolucao', 'Plano de evolução', `<ol><li><strong>Descoberta:</strong> validar processos, responsáveis, requisitos legais e matriz de permissões com as equipas.</li><li><strong>Desenho:</strong> definir modelo de domínio, contratos, segurança, auditoria e critérios de qualidade.</li><li><strong>Fundação:</strong> implementar ambientes, identidade, persistência transacional, observabilidade e backups.</li><li><strong>Entrega incremental:</strong> priorizar cadastros e agenda; depois prontuário e financeiro, com testes por etapa.</li><li><strong>Homologação:</strong> simular cenários reais com dados de teste antes de qualquer implantação autorizada.</li></ol><p>Sequência proposta, sujeita a decisão institucional.</p>`],
    ['aberto', 'Questões em aberto', `<ul><li>Quem é o patrocinador e quem aprova regras clínicas, financeiras e académicas?</li><li>Quais unidades, volume de atendimento e fluxos prioritários devem ser suportados?</li><li>Qual é a matriz oficial de acesso, inclusive para estudantes e supervisores?</li><li>Quais integrações são obrigatórias e quais fornecedores/contratos existem?</li><li>Quais prazos de retenção, requisitos de privacidade e jurisdição se aplicam?</li><li>Quais são os objetivos de disponibilidade, RPO, RTO e orçamento?</li><li>Como serão tratados migração, anexos, assinatura, receituário e documentos fiscais?</li></ul>`]
  ];
  return `<div class="crumb">Referência / Documentação técnica</div><div class="doc-hero"><span class="tag">DOCUMENTO DE REFERÊNCIA · DEMONSTRAÇÃO</span><h1>Sistema de gestão clínica odontológica</h1><p>Documentação técnica navegável do escopo demonstrativo e dos pontos que exigem validação antes de qualquer utilização real.</p><div class="doc-meta"><span>Versão documental: 1.0</span><span>Estado: proposta para validação</span><span>Idioma: português</span><span>Responsável pela aprovação: a confirmar</span></div></div><div class="doc-layout"><nav class="panel doc-toc" aria-label="Índice da documentação"><strong>Nesta página</strong><div class="doc-toc-links">${sections.map(([id, title]) => `<a href="#doc-${id}">${title}</a>`).join('')}</div></nav><div class="doc-body">${sections.map(([id, title, body], i) => `<section id="doc-${id}" class="panel" aria-labelledby="doc-title-${id}"><h2 id="doc-title-${id}">${String(i + 1).padStart(2, '0')} · ${title}</h2>${body}</section>`).join('')}</div></div>`;
}

function render() {
  renderNav();
  $('#profile-select').value = profile;
  let view = activeDetail ? detail(byId(activeDetail)) : current === 'painel' ? dashboard() : current === 'recepcao' ? reception() : current === 'configuracoes' ? settings() : current === 'escopo' ? scope() : current === 'relatorios' ? reports() : current === 'documentacao' ? documentation() : moduleList(current);
  $('#view').innerHTML = view;
  icons();
}

function field(id, label, type = 'text', value = '', extra = '') {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${esc(value)}" ${extra}><span class="error" id="err-${id}"></span></div>`;
}

function selectField(id, label, options, chosen = '') {
  return `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}">${options.map(([v, n]) => `<option value="${esc(v)}" ${v === chosen ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select><span class="error" id="err-${id}"></span></div>`;
}

function patientOptions() { return list('paciente').map(r => [r.entity_id, r.title + ' · ' + (data(r).prontuario || r.entity_id)]); }
function textArea(id, label, value = '') { return `<div class="field span-2"><label for="${id}">${label}</label><textarea id="${id}" name="${id}">${esc(value)}</textarea><span class="error" id="err-${id}"></span></div>`; }

function openModal(title, content, submit = 'Gravar registro', handler = null) {
  $('#modal-root').innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">${esc(title)}</h2><button class="icon-btn" type="button" id="close-modal" aria-label="Fechar"><i data-lucide="x"></i></button></div><form id="modal-form" novalidate>${content}<div id="modal-feedback" role="alert"></div><div class="actions" style="justify-content:flex-end;margin-top:20px"><button type="button" class="btn secondary" id="cancel-modal">Cancelar</button><button type="submit" class="btn">${submit}</button></div></form></div></div>`;
  modalDirty = false;
  $('#modal-form').addEventListener('input', () => modalDirty = true);
  $('#modal-form').onsubmit = handler;
  $('#modal-title').focus?.();
  icons();
  $('#modal-form input,#modal-form select,#modal-form textarea')?.focus();
}

function closeModal() {
  if (modalDirty) {
    let ok = $('#modal-feedback');
    if (ok) {
      ok.innerHTML = '<div class="notice">Há alterações não salvas. Clique novamente em “Cancelar” ou “Fechar” para descartá-las.</div>';
      modalDirty = false;
      return;
    }
  }
  $('#modal-root').innerHTML = '';
}

function err(id, msg) {
  let el = $('#err-' + id);
  if (el) el.textContent = msg;
  let input = $('#' + id);
  if (input) input.setAttribute('aria-invalid', 'true');
}

function values() { return Object.fromEntries(new FormData($('#modal-form')).entries()); }

function record(type, title, statusText, payload) {
  return { entity_id: uid(type), entity_type: type, title, status: statusText, payload: JSON.stringify(payload), updated_at: new Date().toISOString() };
}

async function saveNew(r, button) {
  if (backendRecords.length >= 999) { toast('Limite de 999 registros atingido.'); return false; }
  button.disabled = true; button.textContent = 'Gravando...';
  try {
    let res = store.create(r);
    if (!res.isOk) {
      $('#modal-feedback').innerHTML = '<div class="notice error-note">Não foi possível confirmar a gravação. Atualize os dados antes de tentar novamente.</div>';
      return false;
    }
    modalDirty = false;
    $('#modal-root').innerHTML = '';
    toast('Registro gravado no navegador.');
    return true;
  } catch (e) {
    $('#modal-feedback').innerHTML = '<div class="notice error-note">Erro de salvamento. Confira a conexão e tente novamente após atualizar.</div>';
    return false;
  } finally {
    button.disabled = false;
    button.textContent = 'Gravar registro';
  }
}

async function updateRecord(r, patch, statusText, button) {
  if (r.demo) {
    let copy = { entity_id: r.entity_id, entity_type: r.entity_type, title: r.title, status: statusText ?? r.status, payload: JSON.stringify({ ...data(r), ...patch }), updated_at: new Date().toISOString() };
    return saveNew(copy, button);
  }
  let source = backendRecords.find(x => x.__backendId === r.__backendId);
  if (!source) { toast('Registro mudou. Atualize antes de editar.'); return false; }
  button.disabled = true;
  let old = button.textContent;
  button.textContent = 'Gravando...';
  try {
    let result = store.update({ ...source, status: statusText ?? r.status, payload: JSON.stringify({ ...data(r), ...patch }), updated_at: new Date().toISOString() });
    if (!result.isOk) {
      $('#modal-feedback').innerHTML = '<div class="notice error-note">Não foi possível confirmar a alteração. Atualize antes de tentar novamente.</div>';
      return false;
    }
    modalDirty = false;
    $('#modal-root').innerHTML = '';
    toast('Alteração gravada no navegador.');
    return true;
  } catch (e) {
    $('#modal-feedback').innerHTML = '<div class="notice error-note">Falha ao gravar alteração.</div>';
    return false;
  } finally {
    button.disabled = false;
    button.textContent = old;
  }
}

async function createFlow(type, patientId = '') {
  if (!can(entityModule[type] || 'agenda', 'cadastrar')) return toast('Ação indisponível para este perfil.');
  let title = 'Novo ' + (entityNames[type] || 'registro').toLowerCase(), html = '', initial = patientId || patientOptions()[0]?.[0] || '';
  
  if (type === 'paciente') html = `<div class="form-grid">${field('name', 'Nome do paciente *')}${field('phone', 'Telefone (opcional)', 'tel')}${field('age', 'Idade (opcional)')}${selectField('sex', 'Sexo', [['Não informado', 'Não informado'], ['Feminino', 'Feminino'], ['Masculino', 'Masculino']])}${textArea('alerts', 'Alertas, alergias e reações (não preencher como normal automaticamente)')}</div><div id="duplicate-warning" class="notice">Possíveis duplicidades por nome serão exibidas antes da gravação. Não há união automática.</div>`;
  else if (type === 'agendamento' || type === 'bloqueio') html = `<div class="form-grid">${type === 'agendamento' ? selectField('patient', 'Paciente *', patientOptions()) : field('name', 'Motivo do bloqueio *')}${selectField('professional', 'Profissional / recurso', [['Dra. Ana (fictícia)', 'Dra. Ana (fictícia)'], ['Dr. Bruno (fictício)', 'Dr. Bruno (fictício)']])}${selectField('room', 'Sala', [['Consultório 1', 'Consultório 1'], ['Consultório 2', 'Consultório 2'], ['Sala de procedimentos', 'Sala de procedimentos']])}${field('date', 'Data *', 'date')}${field('time', 'Início *', 'time')}${field('end', 'Fim *', 'time')}${type === 'agendamento' ? field('service', 'Serviço', 'text', 'Consulta') : ''}${textArea('notes', 'Observações ou justificativa de encaixe')}</div>`;
  else if (type === 'atendimento') html = `<div class="form-grid">${selectField('patient', 'Paciente *', patientOptions(), initial)}${selectField('kind', 'Tipo', [['Consulta', 'Consulta'], ['Retorno', 'Retorno'], ['Sem agendamento', 'Sem agendamento']])}${field('professional', 'Profissional *', 'text', profile === 'Aluno ou estagiário' ? 'Aluno(a) Camila (fictício)' : 'Dra. Ana (fictícia)')}${field('complaint', 'Queixa principal *')}${textArea('notes', 'Anamnese, exame físico, parâmetros com unidades, conduta e orientações — diferencie não informado, não avaliado e normal')}${profile === 'Aluno ou estagiário' ? field('supervisor', 'Supervisor *', 'text', 'Prof.ª Elisa (fictícia)') : ''}</div><p class="section-note">Rascunho pode ser continuado depois. Nenhum diagnóstico ou achado é gerado automaticamente.</p>`;
  else if (type === 'exame') html = `<div class="form-grid">${selectField('patient', 'Paciente *', patientOptions(), initial)}${field('name', 'Exame solicitado *')}${field('requester', 'Solicitante *', 'text', 'Dra. Ana (fictícia)')}${selectField('priority', 'Prioridade informada', [['Rotina', 'Rotina'], ['Prioritário', 'Prioritário']])}${field('lab', 'Serviço de imagem ou laboratório')}${textArea('notes', 'Observações')}</div>`;
  else if (type === 'cirurgia') html = `<div class="form-grid">${selectField('patient', 'Paciente *', patientOptions(), initial)}${field('name', 'Procedimento *')}${field('professional', 'Dentista *', 'text', 'Dra. Ana (fictícia)')}${field('anesthetist', 'Auxiliar (opcional)')}${field('room', 'Sala', 'text', 'Sala de procedimentos')}${field('date', 'Data *', 'date')}${field('time', 'Horário *', 'time')}${field('duration', 'Duração prevista (min)', 'number', '', 'min="1"')}${textArea('notes', 'Avaliação, consentimentos e checklist (sem protocolos automáticos)')}</div>`;
  else if (type === 'produto') html = `<div class="form-grid">${field('name', 'Nome do produto *')}${field('code', 'Código interno *')}${selectField('category', 'Categoria', [['Material', 'Material'], ['Medicamento', 'Medicamento'], ['Venda', 'Venda'], ['Serviço sem estoque', 'Serviço sem estoque']])}${field('unit', 'Unidade de consumo *', 'text', 'un')}${field('stock', 'Quantidade inicial', 'number', '0', 'min="0" step="0.01"')}${field('min', 'Estoque mínimo', 'number', '0', 'min="0" step="0.01"')}${field('lot', 'Lote')}${field('expiry', 'Validade', 'date')}${field('price', 'Preço (R$)', 'number', '0', 'min="0" step="0.01"')}</div>`;
  else if (type === 'orcamento' || type === 'cobranca') html = `<div class="form-grid">${selectField('patient', 'Paciente *', patientOptions(), initial)}${field('name', type === 'orcamento' ? 'Descrição do orçamento *' : 'Descrição da cobrança *')}${field('amount', 'Valor (R$) *', 'number', '', 'min="0.01" step="0.01"')}${textArea('notes', 'Itens, origem e observações')}</div>`;
  else { toast('Este fluxo deve ser iniciado pelo registro relacionado.'); return; }

  openModal(title, html, 'Gravar registro', async e => {
    e.preventDefault();
    let v = values(), button = e.submitter;
    let required = ({ paciente: ['name'], agendamento: ['patient', 'date', 'time', 'end'], bloqueio: ['name', 'date', 'time', 'end'], atendimento: ['patient', 'professional', 'complaint'], exame: ['patient', 'name', 'requester'], cirurgia: ['patient', 'name', 'professional', 'date', 'time'], produto: ['name', 'code', 'unit'] })[type] || ['patient', 'name', 'amount'];
    
    let invalid = false;
    required.forEach(k => { if (!v[k]?.trim()) { err(k, 'Campo obrigatório.'); invalid = true; } });
    if (invalid) return;

    if (type === 'paciente' && of('paciente').some(r => r.title.toLowerCase() === v.name.toLowerCase())) { err('name', 'Possível duplicidade: mesmo nome. Confira antes de continuar.'); return; }
    if (['agendamento', 'bloqueio'].includes(type)) {
      if (v.end <= v.time) { err('end', 'O término deve ser posterior ao início.'); return; }
      let clash = [...of('agendamento'), ...of('bloqueio')].some(r => {
        let d = data(r);
        return r.status !== 'Cancelado' && d.date === v.date && v.time < (d.end || '23:59') && v.end > d.time && (d.professional === v.professional || d.room === v.room);
      });
      if (clash) { err('time', 'Conflito de profissional ou sala neste intervalo. Escolha outro horário. Encaixes exigem autorização e justificativa não disponíveis neste perfil de fluxo.'); return; }
    }
    if (type === 'produto' && v.expiry && v.expiry < new Date().toISOString().slice(0, 10)) { err('expiry', 'Lote vencido não pode entrar como disponível.'); return; }
    
    let id = uid(type), p = {}, name = v.name || byId(v.patient)?.title || 'Registro';
    if (type === 'paciente') p = { telefone: v.phone, idade: v.age, sexo: v.sex, alertas: v.alerts, prontuario: 'PR-' + id.slice(-7) };
    if (type === 'agendamento' || type === 'bloqueio') p = { patientId: v.patient, professional: v.professional, room: v.room, date: v.date, time: v.time, end: v.end, service: v.service, notes: v.notes };
    if (type === 'atendimento') p = { patientId: v.patient, professional: v.professional, type: v.kind, complaint: v.complaint, notes: v.notes, student: profile === 'Aluno ou estagiário' ? v.professional : '', supervisor: v.supervisor || '', date: new Date().toISOString() };
    if (type === 'exame') p = { patientId: v.patient, requester: v.requester, priority: v.priority, lab: v.lab, notes: v.notes };
    if (type === 'cirurgia') p = { patientId: v.patient, professional: v.professional, anesthetist: v.anesthetist, room: v.room, date: v.date, time: v.time, duration: v.duration + ' min', notes: v.notes };
    if (type === 'produto') p = { code: v.code, category: v.category, unit: v.unit, stock: Number(v.stock), min: Number(v.min), lot: v.lot, expiry: v.expiry, priceCents: Math.round(Number(v.price) * 100) };
    if (type === 'orcamento' || type === 'cobranca') p = { patientId: v.patient, amountCents: Math.round(Number(v.amount) * 100), paidCents: 0, items: v.notes, origin: 'Lançamento manual demonstrativo' };
    
    let statuses = { paciente: 'Ativo', agendamento: 'Agendado', bloqueio: 'Bloqueado', atendimento: 'Rascunho', exame: 'Solicitado', cirurgia: 'Programada', produto: 'Ativo', orcamento: 'Rascunho', cobranca: 'Em aberto' };
    let r = { entity_id: id, entity_type: type, title: type === 'agendamento' ? 'Consulta · ' + name : type === 'paciente' || type === 'produto' ? name : (entityNames[type] || type) + ' · ' + name, status: statuses[type], payload: JSON.stringify(p), updated_at: new Date().toISOString() };
    
    if (await saveNew(r, button)) { activeDetail = id; render(); }
  });
  
  if (type === 'paciente') {
    $('#name').addEventListener('input', () => {
      let same = of('paciente').filter(r => r.title.toLowerCase().includes($('#name').value.toLowerCase()) && $('#name').value.length > 1);
      $('#duplicate-warning').textContent = same.length ? 'Possíveis duplicidades: ' + same.map(x => x.title + ' (' + data(x).prontuario + ')').join(', ') + '. Não serão unidas automaticamente.' : 'Nenhuma duplicidade por nome encontrada; confira responsável e demais informações.';
    });
  }
}

function simpleAction(r, act) {
  let d = data(r), title = '', html = '', label = 'Registrar ação';
  const reason = (text = 'Motivo *') => textArea('reason', text);
  
  if (act === 'arrive') { title = 'Registrar chegada'; html = field('arrival', 'Horário de chegada *', 'time', new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())); }
  else if (act === 'reschedule') { title = 'Reagendar'; html = `<div class="form-grid">${field('date', 'Nova data *', 'date', d.date)}${field('time', 'Novo início *', 'time', d.time)}${field('end', 'Novo término *', 'time', d.end)}${reason('Motivo do reagendamento *')}</div>`; }
  else if (act === 'cancel' || act === 'reverse') { title = act === 'cancel' ? 'Cancelar sem apagar' : 'Estornar sem apagar'; html = reason(); }
  else if (act === 'copy') {
    let text = `Confirmação demonstrativa: ${r.title}, ${fmtDate(d.date)} às ${d.time}. O envio por WhatsApp ou e-mail depende de integração não conectada.`;
    navigator.clipboard?.writeText(text).then(() => toast('Mensagem copiada. Nenhum envio foi realizado.')).catch(() => toast(text));
    return;
  }
  else if (act === 'edit') { title = 'Continuar rascunho'; html = `<div class="form-grid">${field('complaint', 'Queixa principal *', 'text', d.complaint)}${textArea('notes', 'Registro clínico', d.notes)}</div>`; }
  else if (act === 'submit') { title = 'Enviar para supervisão'; html = field('supervisor', 'Supervisor *', 'text', d.supervisor || 'Prof.ª Elisa (fictícia)'); }
  else if (act === 'finalize') { title = 'Finalizar atendimento'; html = `<div class="notice">O registro finalizado não será sobrescrito. Correções posteriores usam adendo.</div>${field('author', 'Profissional responsável *', 'text', d.professional)}`; }
  else if (act === 'addendum') { title = 'Adicionar adendo'; html = `${reason('Motivo da correção *')}${textArea('notes', 'Conteúdo do adendo *')}${field('author', 'Autor *', 'text', profile)}`; }
  else if (act === 'validate' || act === 'return') { title = act === 'validate' ? 'Validar versão' : 'Devolver para correção'; html = reason(act === 'validate' ? 'Comentário da revisão *' : 'Orientação para correção *'); }
  else if (act === 'result') { title = 'Registrar laudo'; html = `${selectField('lab', 'Origem do laboratório', [['Interno', 'Interno'], ['Externo', 'Externo']])}${textArea('result', 'Texto ou referência do laudo *')}<p class="section-note">Resultado disponível não significa avaliado. Anexos binários não são armazenados nesta demonstração.</p>`; }
  else if (act === 'evaluate') { title = 'Avaliar resultado'; html = `${field('evaluator', 'Profissional avaliador *', 'text', profile)}${textArea('notes', 'Registro da avaliação *')}`; }
  else if (act === 'surgeryStart' || act === 'surgeryFinish') { title = act === 'surgeryStart' ? 'Iniciar procedimento' : 'Concluir procedimento'; html = reason(act === 'surgeryStart' ? 'Checklist e confirmação de identidade/procedimento *' : 'Descrição do procedimento e orientações *'); }
  else if (act === 'admit') { createFlow(d.patientId); return; }
  else if (act === 'consume' || act === 'stockIn') { title = act === 'stockIn' ? 'Entrada de estoque' : 'Registrar consumo clínico'; html = `${selectField('product', 'Produto *', list('produto').map(x => [x.entity_id, x.title]))}${field('quantity', 'Quantidade *', 'number', '1', 'min="0.01" step="0.01"')}${reason('Justificativa / vínculo *')}`; }
  else if (act === 'approve' || act === 'partial') { title = act === 'approve' ? 'Aprovar orçamento' : 'Aprovar parcialmente'; html = `${field('responsible', 'Responsável pela confirmação *')}${selectField('method', 'Forma de confirmação', [['Verbal registrada', 'Verbal registrada'], ['E-mail informado', 'E-mail informado']])}${act === 'partial' ? reason('Itens aprovados *') : textArea('notes', 'Observações')}`; }
  else if (act === 'pay') { title = 'Receber pagamento parcial'; html = `${field('amount', 'Valor recebido (R$) *', 'number', '', 'min="0.01" step="0.01"')}${selectField('method', 'Meio informado', [['Dinheiro', 'Dinheiro'], ['PIX confirmado manualmente', 'PIX confirmado manualmente'], ['Cartão confirmado manualmente', 'Cartão confirmado manualmente']])}${field('operator', 'Operador *', 'text', profile)}`; }
  else return toast('Ação indisponível.');

  openModal(title, html, label, async e => {
    e.preventDefault();
    let v = values(), button = e.submitter;
    let required = ({ paciente: ['name'], agendamento: ['patient', 'date', 'time', 'end'], bloqueio: ['name', 'date', 'time', 'end'], atendimento: ['patient', 'professional', 'complaint'], exame: ['patient', 'name', 'requester'], cirurgia: ['patient', 'name', 'professional', 'date', 'time'], produto: ['name', 'code', 'unit'] })[type] || ['patient', 'name', 'amount'];
    for (let k of required) { if (!v[k]?.trim()) { err(k, 'Campo obrigatório.'); return; } }
    
    let patch = {}, statusText = r.status, extra = null;
    
    if (act === 'arrive') { patch.arrivedAt = v.arrival; statusText = 'Chegou'; }
    if (act === 'reschedule') {
      if (v.end <= v.time) { err('end', 'Término deve ser posterior ao início.'); return; }
      if (of('agendamento').some(x => x.entity_id !== r.entity_id && x.status !== 'Cancelado' && data(x).date === v.date && v.time < data(x).end && v.end > data(x).time && (data(x).professional === d.professional || data(x).room === d.room))) { err('time', 'Conflito com profissional ou sala.'); return; }
      patch = { date: v.date, time: v.time, end: v.end, rescheduleHistory: [...(d.rescheduleHistory || []), { from: d.date + ' ' + d.time, reason: v.reason, at: stamp() }] };
    }
    if (act === 'cancel') { patch.cancelReason = v.reason; statusText = 'Cancelado'; }
    if (act === 'reverse') { patch.reverseReason = v.reason; statusText = 'Estornado'; }
    if (act === 'edit') patch = { complaint: v.complaint, notes: v.notes };
    if (act === 'submit') { patch.supervisor = v.supervisor; statusText = 'Aguardando supervisão'; }
    if (act === 'finalize') { patch.finalizedBy = v.author; patch.finalizedAt = stamp(); statusText = 'Finalizado'; }
    if (act === 'validate') { patch.validatedBy = profile; patch.reviewComment = v.reason; statusText = 'Finalizado'; }
    if (act === 'return') { patch.reviewComment = v.reason; statusText = 'Rascunho'; }
    if (act === 'result') { patch = { lab: v.lab, result: v.result, resultAt: stamp() }; statusText = 'Resultado disponível'; }
    if (act === 'evaluate') { patch = { evaluator: v.evaluator, evaluatedAt: stamp(), evaluation: v.notes }; statusText = 'Avaliado'; }
    if (act === 'surgeryStart') { patch.checklist = v.reason; statusText = 'Em andamento'; }
    if (act === 'surgeryFinish') { patch.description = v.reason; statusText = 'Concluída'; }
    if (act === 'approve' || act === 'partial') { patch = { confirmedBy: v.responsible, confirmationMethod: v.method, approvedItems: v.reason || d.items, confirmedAt: stamp() }; statusText = act === 'approve' ? 'Aprovado' : 'Parcialmente aprovado'; }
    if (act === 'pay') {
      let cents = Math.round(Number(v.amount) * 100), balance = (d.amountCents || 0) - (d.paidCents || 0);
      if (cents <= 0 || cents > balance) { err('amount', 'Valor deve ser maior que zero e não exceder o saldo ' + money(balance) + '.'); return; }
      patch = { paidCents: (d.paidCents || 0) + cents };
      statusText = patch.paidCents >= d.amountCents ? 'Paga' : 'Parcialmente paga';
      extra = record('pagamento', 'Recebimento · ' + r.title, 'Confirmado manualmente', { chargeId: r.entity_id, amountCents: cents, method: v.method, operator: v.operator, at: stamp() });
    }
    if (['consume', 'stockIn'].includes(act)) {
      let product = byId(v.product), pd = data(product), qty = Number(v.quantity);
      if (!product || qty <= 0) { err('quantity', 'Informe quantidade válida.'); return; }
      if (act !== 'stockIn' && pd.expiry && pd.expiry < new Date().toISOString().slice(0, 10)) { err('product', 'Lote vencido não pode ser usado.'); return; }
      if (act !== 'stockIn' && qty > Number(pd.stock)) { err('quantity', 'Estoque insuficiente; estoque negativo bloqueado.'); return; }
      
      let movement = record('movimento', (act === 'stockIn' ? 'Entrada' : 'Consumo') + ' · ' + product.title, 'Registrado', { productId: product.entity_id, quantity: qty, unit: pd.unit, reason: v.reason, originId: r.entity_id, operator: profile, at: stamp() });
      if (!await saveNew(movement, button)) return;
      let updated = await updateRecord(product, { stock: Number(pd.stock) + (act === 'stockIn' ? qty : -qty) }, null, button);
      if (!updated) return;
      
      toast('Movimento registrado; atualização do saldo confirmada.');
      render(); return;
    }
    
    if (act === 'addendum') {
      let entry = record('adendo', 'Adendo · ' + r.title, 'Registrado', { parentId: r.entity_id, patientId: d.patientId, reason: v.reason || '', notes: v.notes, author: v.author, at: stamp() });
      if (await saveNew(entry, button)) render();
      return;
    }
    
    if (extra) {
      if (!await saveNew(extra, button)) return;
      let b = $('#modal-form button[type=submit]') || button;
      if (await updateRecord(r, patch, statusText, b)) render();
      return;
    }
    
    if (await updateRecord(r, patch, statusText, button)) render();
  });
}

function search() {
  let q = $('#global-search').value.trim().toLowerCase(), box = $('#search-results');
  if (!q) { box.classList.add('hidden'); return; }
  
  let hits = all().filter(visible).filter(r => (r.title + ' ' + r.entity_id + ' ' + r.status).toLowerCase().includes(q)).slice(0, 8);
  box.innerHTML = hits.length ? hits.map(r => `<button type="button" data-search-id="${esc(r.entity_id)}"><strong>${esc(r.title)}</strong><br><small>${esc(entityNames[r.entity_type] || r.entity_type)} · ${esc(r.entity_id)} ${r.demo ? '· Fictício' : ''}</small></button>`).join('') : '<div class="empty">Nenhum resultado permitido para este perfil.</div>';
  box.classList.remove('hidden');
}

document.addEventListener('click', e => {
  let t = e.target.closest('button');
  if (!t) return;
  
  if (t.id === 'menu-toggle') { $('#sidebar').classList.toggle(innerWidth < 900 ? 'open' : 'compact'); return; }
  if (t.id === 'notifications-btn') { toast('Notificações: consulte cuidados pendentes, exames e supervisão no painel.'); return; }
  if (t.id === 'close-modal' || t.id === 'cancel-modal') { closeModal(); return; }
  if (t.dataset.nav) { navigate(t.dataset.nav, null, t.dataset.filter || ''); return; }
  if (t.dataset.new) { createFlow(t.dataset.new, t.dataset.patient || ''); return; }
  if (t.dataset.detail) { activeDetail = t.dataset.detail; patientTab = 'Resumo'; render(); return; }
  
  if (t.dataset.searchId) {
    let r = byId(t.dataset.searchId);
    $('#search-results').classList.add('hidden');
    $('#global-search').value = '';
    navigate(entityModule[r.entity_type], r.entity_id);
    return;
  }
  
  if (t.dataset.tab) { patientTab = t.dataset.tab; render(); return; }
  if (t.dataset.page) { page += Number(t.dataset.page); render(); return; }
  if (t.dataset.start) { let a = byId(t.dataset.start); createFlow('atendimento', data(a).patientId); return; }
  if (t.dataset.act) { let r = byId(t.dataset.id); if (r) simpleAction(r, t.dataset.act); return; }
  
  if (t.id === 'export-btn') {
    let rows = [['tipo', 'id', 'titulo', 'status'], ...all().filter(visible).map(r => [r.entity_type, r.entity_id, r.title, r.status])];
    let csv = rows.map(row => row.map(s => '"' + String(s).replaceAll('"', '""') + '"').join(';')).join('\n');
    let blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    let url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url;
    a.download = 'resumo-demonstracao.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Resumo CSV gerado com registros permitidos.');
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'global-search') search();
  if (e.target.id === 'list-filter') {
    filter = e.target.value;
    page = 1;
    let pos = e.target.selectionStart;
    let panel = e.target.closest('.panel');
    panel.innerHTML = toolbar() + paged(list(keyFor[current]));
    $('#list-filter').focus();
    $('#list-filter').setSelectionRange(pos, pos);
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'profile-select') {
    profile = e.target.value;
    activeDetail = null;
    filter = '';
    if (!can(current)) current = 'painel';
    render();
    toast('Perfil alterado apenas para simulação.');
  }
  if (e.target.id === 'list-sort') { sort = e.target.value; render(); }
  if (e.target.id === 'agenda-mode') { agendaMode = e.target.value; render(); }
  if (e.target.id === 'agenda-prof' || e.target.id === 'agenda-status') { filter = e.target.value; render(); }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if ($('#modal-root').innerHTML) closeModal();
    else $('#search-results').classList.add('hidden');
  }
});

$('#profile-select').innerHTML = profiles.map(p => `<option>${p}</option>`).join('');

icons();
backendRecords = store.load();
ready = true;
render();
