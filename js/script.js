const roles = [
   { id: 'gestao', name: 'Gestão institucional', mods: ['dash', 'patients', 'visits', 'agenda', 'pharmacy', 'warehouse', 'cleaning', 'maintenance', 'sim', 'access', 'docs', 'audit'] },
   { id: 'ti', name: 'Tecnologia da Informação', mods: ['dash', 'access', 'docs', 'audit'] },
   { id: 'enfermagem', name: 'Enfermagem', mods: ['dash', 'patients', 'visits', 'agenda'] },
   { id: 'medico', name: 'Equipe médica', mods: ['dash', 'patients', 'agenda'] },
   { id: 'farmacia', name: 'Farmácia', mods: ['dash', 'pharmacy', 'patients'] },
   { id: 'almoxarifado', name: 'Almoxarifado', mods: ['dash', 'warehouse'] },
   { id: 'higienizacao', name: 'Higienização', mods: ['dash', 'cleaning'] },
   { id: 'manutencao', name: 'Manutenção', mods: ['dash', 'maintenance', 'warehouse'] },
   { id: 'recepcao', name: 'Recepção e atendimento', mods: ['dash', 'patients', 'agenda'] },
   { id: 'docente', name: 'Docente / supervisor', mods: ['dash', 'sim'] },
   { id: 'estudante', name: 'Estudante', mods: ['dash', 'sim'] }
];

const mods = [
   ['dash', '⌂', 'Painel'], 
   ['patients', '♡', 'Pacientes e histórico'], 
   ['visits', '▣', 'Visitas de enfermagem'], 
   ['agenda', '◷', 'Agenda e fila'], 
   ['pharmacy', '✚', 'Farmácia'], 
   ['warehouse', '▤', 'Almoxarifado'], 
   ['cleaning', '✧', 'Higienização'], 
   ['maintenance', '⚙', 'Manutenção'], 
   ['sim', '◎', 'Simulador educacional'], 
   ['access', '♙', 'Perfis e permissões'], 
   ['docs', '▧', 'Documentos e assinaturas'], 
   ['audit', '≋', 'Auditoria']
];

const initial = { 
   patients: [
      { id: 'P-1001', name: 'Paciente Demonstração A', birth: '1984-04-12', blood: 'O+', allergies: 'Penicilina (exemplo fictício)', notes: 'Cadastro de treinamento.', history: [{ date: '2026-10-15', kind: 'Consulta', note: 'Registro fictício.' }], exams: [] }, 
      { id: 'P-1002', name: 'Paciente Demonstração B', birth: '1992-08-21', blood: 'A+', allergies: 'Não informado', notes: 'Cadastro de treinamento.', history: [], exams: [] }
   ], 
   visits: [], 
   appointments: [
      { id: 'AG-1001', patient: 'P-1001', date: '2026-10-16T10: 30', professional: 'Equipe demonstração', reason: 'Rotina', status: 'Confirmado' }
   ], 
   meds: [
      { id: 'MED-01', name: 'Medicamento demonstrativo A', stock: 24, min: 8, expiry: '2027-06-30' }, 
      { id: 'MED-02', name: 'Medicamento demonstrativo B', stock: 6, min: 10, expiry: '2027-02-28' }
   ], 
   supplies: [
      { id: 'MAT-01', name: 'Luvas de procedimento (demo)', stock: 120, min: 40 }, 
      { id: 'MAT-02', name: 'Gaze estéril (demo)', stock: 22, min: 30 }, 
      { id: 'MAT-03', name: 'Álcool para higienização (demo)', stock: 15, min: 10 }
   ], 
   cleaning: [], 
   maintenance: [], 
   users: [], 
   docs: [], 
   audit: [], 
   sim: [] 
};

let db, curRole = 'gestao', user = 'gestao', current = 'dash';

function init() {
   try {
      db = JSON.parse(localStorage.getItem('ci_demo_db')) || structuredClone(initial)
   }
   catch (e) {
      db = structuredClone(initial)
   }
   Object.keys(initial).forEach(k => {
      if(db[k] === undefined) db[k] = structuredClone(initial[k])
   });
   document.getElementById('loginrole').innerHTML = roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
   document.getElementById('loginrole').onchange = e => document.getElementById('username').value = e.target.value 
}

function save() { 
   localStorage.setItem('ci_demo_db', JSON.stringify(db)) 
}

function esc(s) { 
   return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) 
}

function log(action, detail = '') { 
   db.audit.unshift({ at: new Date().toLocaleString('pt-BR'), user, role: role().name, action, detail });
   db.audit = db.audit.slice(0, 1000);
   save() 
}

function role() { 
   return roles.find(r => r.id === curRole) || roles[0] 
}

function login() { 
   curRole = document.getElementById('loginrole').value;
   user = document.getElementById('username').value || curRole;
   document.getElementById('login').classList.add('hidden');
   document.getElementById('app').classList.remove('hidden');
   document.getElementById('who').textContent = role().name + ' · ' + user;
   log('Entrada demonstrativa');
   nav();
   go('dash') 
}

function logout() { 
   log('Saída');
   document.getElementById('app').classList.add('hidden');
   document.getElementById('login').classList.remove('hidden') 
}

function nav() { 
   let arr = mods.filter(m => role().mods.includes(m[0]));
   document.getElementById('nav').innerHTML = arr.map(m => `<button data-m="${m[0]}" onclick="go('${m[0]}')">${m[1]} &nbsp; ${m[2]}</button>`).join('');
   document.getElementById('bottom').innerHTML = arr.slice(0, 5).map(m => `<button data-m="${m[0]}" onclick="go('${m[0]}')"><span>${m[1]}</span><span>${m[2].split(' ')[0]}</span></button>`).join('') 
}

function go(m) { 
   if (!role().mods.includes(m)) {
      toast('Perfil sem autorização para este módulo.');
      return 
   }
   current = m;
   nav();
   document.querySelectorAll(`[data-m="${m}"]`).forEach(b => b.classList.add('active'));
   let title = mods.find(x => x[0] === m)[2];
   document.getElementById('main').innerHTML = `<div class="head"><div><div class="eyebrow">Clínicas Inteligentes · ${esc(role().name)}</div><h1>${title}</h1><p class="muted">Informações integradas, responsabilidades definidas e registros rastreáveis.</p></div><div class="actions"><button class="secondary" onclick="exportData()">⇩ Exportar dados</button></div></div>${render(m)}` 
}

function metric(label, n, sub, ico) { 
   return `<div class="card metric"><div><small>${label}</small><div class="num">${n}</div><small>${sub}</small></div><div class="symbol">${ico}</div></div>` 
}

function render(m) { 
   if (m === 'dash') return dash();
   if (m === 'patients') return patients();
   if (m === 'visits') return visits();
   if (m === 'agenda') return agenda();
   if (m === 'pharmacy' || m === 'warehouse') return inventory(m);
   if (m === 'cleaning') return taskTable('cleaning');
   if (m === 'maintenance') return taskTable('maintenance');
   if (m === 'sim') return simulator();
   if (m === 'access') return access();
   if (m === 'docs') return docs();
   if (m === 'audit') return audit();
   return '' 
}

function dash() { 
   let low = [...db.meds, ...db.supplies].filter(x => x.stock <= x.min).length;
   return `<div class="hero"><h2>Bem-vindo, ${esc(user)}.</h2><p>Ambiente demonstrativo para organizar atendimento, recursos e aprendizagem.</p></div><div class="grid">${metric('Cadastros fictícios', db.patients.length, 'Pacientes', '♡')}${metric('Visitas registradas', db.visits.length, 'Nesta demonstração', '▣')}${metric('Alertas de estoque', low, 'Abaixo do mínimo', '⚠')}${metric('Eventos de auditoria', db.audit.length, 'Registro local', '≋')}</div><div class="grid two section"><div class="card"><h2>Atalhos</h2><div class="checks">${mods.filter(m => role().mods.includes(m[0]) && m[0] !== 'dash').map(m => `<button class="secondary" onclick="go('${m[0]}')">${m[1]} ${m[2]} →</button>`).join('')}</div></div><div class="card"><h2>Segurança</h2><p class="notice warn">Use exclusivamente dados fictícios. Este protótipo não é prontuário nem sistema de produção.</p><p class="muted">A Gestão define processos e responsabilidades; TI implementa perfis e controles aprovados.</p></div></div>` 
}

function patients() { 
   return `<div class="toolbar"><input id="ps" placeholder="Buscar nome/código" oninput="filterP()"><button onclick="patientForm()">＋ Novo cadastro</button></div><div class="tablewrap"><table><thead><tr><th>Código</th><th>Paciente fictício</th><th>Sangue/Rh</th><th>Alergias</th><th>Histórico/anexos</th><th>Ações</th></tr></thead><tbody id="prows">${patientRows(db.patients)}</tbody></table></div><p class="notice section">Não inserir dados reais. Alergias e alertas de medicamento precisam de validação clínica antes de uso real.</p>` 
}

function patientRows(a) { 
   return a.map(p => `<tr><td>${p.id}</td><td><b>${esc(p.name)}</b><br><small>${esc(p.birth)}</small></td><td>${esc(p.blood || 'Não informado')}</td><td>${p.allergies && p.allergies !== 'Não informado' ? `<span class="pill red">⚠ ${esc(p.allergies)}</span>` : 'Não informado'}</td><td>${p.history.length} registros · ${p.exams.length} anexos</td><td><button onclick="viewP('${p.id}')">Histórico</button> <button class="secondary" onclick="patientForm('${p.id}')">Editar</button></td></tr>`).join('') || '<tr><td colspan="6">Nenhum cadastro.</td></tr>' 
}

function filterP() { 
   let q = document.getElementById('ps').value.toLowerCase();
   document.getElementById('prows').innerHTML = patientRows(db.patients.filter(p => (p.name + p.id).toLowerCase().includes(q))) 
}

function patientForm(id) { 
   if (!['gestao', 'medico', 'recepcao', 'enfermagem', 'farmacia'].includes(curRole)) return toast('Perfil sem permissão.');
   let p = db.patients.find(x => x.id === id) || { id: 'P-' + Date.now().toString().slice(-6), name: '', birth: '', blood: '', allergies: 'Não informado', notes: '', history: [], exams: [] };
   modal(id ? 'Editar cadastro' : 'Novo cadastro', `<form onsubmit="saveP(event, '${p.id}')"><div class="form"><div class="field"><label>Nome fictício</label><input name="name" required value="${esc(p.name)}"></div><div class="field"><label>Nascimento</label><input type="date" name="birth" value="${esc(p.birth)}"></div><div class="field"><label>Tipo sanguíneo / Rh</label><select name="blood">${['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não informado'].map(x => `<option ${p.blood === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div><div class="field"><label>Alergias (demo)</label><input name="allergies" value="${esc(p.allergies)}"></div><div class="field full"><label>Observações</label><textarea name="notes">${esc(p.notes)}</textarea></div></div><button>Salvar cadastro</button></form>`) 
}

function saveP(e, id) { 
   e.preventDefault();
   let f = new FormData(e.target), p = db.patients.find(x => x.id === id), o = { id, name: f.get('name'), birth: f.get('birth'), blood: f.get('blood'), allergies: f.get('allergies'), notes: f.get('notes') };
   if(p) Object.assign(p, o);
   else db.patients.push({ ...o, history: [], exams: [] });
   save();
   log('Cadastro demonstrativo', id);
   closeModal();
   go('patients');
   toast('Cadastro salvo localmente.') 
}

function viewP(id) { 
   let p = db.patients.find(x => x.id === id);
   modal('Histórico · ' + p.name, `<div class="notice">Dados fictícios. O histórico real deve ter controle de acesso e auditoria no servidor.</div><h3>Observações</h3><p>${esc(p.notes)}</p><h3>Histórico</h3>${p.history.map(h => `<div class="card section"><b>${esc(h.kind)}</b> · ${esc(h.date)}<p>${esc(h.note)}</p></div>`).join('') || '<p class="muted">Sem registros adicionais.</p>'} <h3 class="section">Anexar exame/documento (metadados apenas)</h3><form onsubmit="addExam(event, '${id}')"><div class="form"><div class="field"><label>Tipo</label><select name="type"><option>Exame laboratorial</option><option>Imagem</option><option>Receita</option><option>Encaminhamento</option></select></div><div class="field"><label>Arquivo PDF/imagem</label><input type="file" name="file" accept=".pdf, image/*" required></div></div><p><small>O conteúdo não é enviado; só nome, tipo e data ficam no navegador.</small></p><button>Registrar anexo</button></form><h3 class="section">Adicionar observação</h3><form onsubmit="addHistory(event, '${id}')"><div class="field"><label>Tipo</label><select name="kind"><option>Observação adicional</option><option>Atendimento</option><option>Orientação</option><option>Encaminhamento</option></select></div><div class="field section"><label>Registro</label><textarea name="note" required></textarea></div><button>Adicionar histórico</button></form><h3 class="section">Anexos</h3>${p.exams.map(x => `<p>${esc(x.name)} · ${esc(x.type)} · ${esc(x.date)}</p>`).join('') || 'Nenhum anexo'}`) 
}

function addHistory(e, id) { 
   e.preventDefault();
   let f = new FormData(e.target), p = db.patients.find(x => x.id === id);
   p.history.unshift({ date: new Date().toLocaleString('pt-BR'), kind: f.get('kind'), note: f.get('note') });
   save();
   log('Histórico atualizado', id);
   viewP(id) 
}

function addExam(e, id) { 
   e.preventDefault();
   let f = new FormData(e.target), file = f.get('file');
   db.patients.find(x => x.id === id).exams.push({ name: file.name, type: f.get('type'), date: new Date().toLocaleDateString('pt-BR') });
   save();
   log('Metadados de anexo registrados', file.name);
   viewP(id) 
}

const ITEMS = ['Higiene das mãos e precauções aplicáveis', 'Conferência dos equipamentos', 'Conferência de materiais e insumos', 'Registros de medicamentos', 'Condições do ambiente e higienização', 'Dispositivos e acessos', 'Ocorrências e riscos identificados', 'Materiais utilizados', 'Outros itens'];
const REFS = ['Avaliação da enfermagem responsável', 'Avaliação médica conforme protocolo', 'Avaliação multiprofissional', 'Reposição de materiais', 'Manutenção de equipamento', 'Solicitação de higienização', 'Registro de queixa ou solicitação', 'Monitoramento e reavaliação', 'Encaminhamento a outro setor', 'Outro encaminhamento'];

function checkHtml(name, a, def = '') {
   return `<div class="checks">${a.map(x => `<label class="check"><input type="checkbox" name="${name}" value="${esc(x)}" ${x === def ? 'checked' : ''}>${esc(x)}</label>`).join('')}</div>`
}

function visits() {
   return `<div class="hero"><h2>Visita à beira do leito</h2><p>Unidade, quarto, leito, queixa, verificações e encaminhamentos múltiplos.</p></div><button onclick="visitForm()">＋ Registrar visita</button><div class="tablewrap section"><table><thead><tr><th>Data/hora</th><th>Local</th><th>Paciente</th><th>Situação</th><th>Profissional</th><th>Detalhes</th></tr></thead><tbody>${db.visits.map(v => `<tr><td>${esc(v.at)}</td><td>${esc(v.unit)} · Quarto ${esc(v.room)} · Leito ${esc(v.bed)}</td><td>${esc(v.patientName)}</td><td>${esc(v.situation)}</td><td>${esc(v.author)}</td><td><button class="secondary" onclick="viewVisit('${v.id}')">Abrir</button></td></tr>`).join('') || '<tr><td colspan="6">Nenhuma visita.</td></tr>'}</tbody></table></div>`
}

function visitForm() {
   if (!['gestao', 'enfermagem'].includes(curRole)) return toast('Perfil sem permissão.');
   modal('Nova visita de enfermagem', `<form onsubmit="saveVisit(event)"><div class="form"><div class="field"><label>Unidade</label><input name="unit" required></div><div class="field"><label>Quarto</label><input name="room" required></div><div class="field"><label>Leito</label><input name="bed" required></div><div class="field"><label>Paciente fictício</label><select name="patient">${db.patients.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></div><div class="field full"><label>Situação / queixa</label><input name="situation" required></div><div class="field full"><label>Relato</label><textarea name="report" required></textarea></div><div class="field full"><label>C. Itens verificados — selecione vários</label>${checkHtml('items', ITEMS, 'Conferência dos equipamentos')}</div><div class="field full"><label>D. Encaminhamentos — selecione vários</label>${checkHtml('refs', REFS)}<label class="check"><input type="checkbox" name="confirm" required> Confirmo que revisei este registro demonstrativo.</label></div><div class="field full"><label>Descreva outro encaminhamento, se selecionado</label><input name="other"></div></div><p class="notice">Este checklist não comprova execução de procedimento nem substitui protocolos assistenciais.</p><button>Salvar visita</button></form>`) 
}

function saveVisit(e) { 
   e.preventDefault();
   let f = new FormData(e.target);
   if (f.getAll('refs').includes('Outro encaminhamento') && !f.get('other').trim()) return toast('Descreva o outro encaminhamento.');
   let p = db.patients.find(p => p.id === f.get('patient')), v = { id: 'VIS-' + Date.now(), at: new Date().toLocaleString('pt-BR'), unit: f.get('unit'), room: f.get('room'), bed: f.get('bed'), patient: p.id, patientName: p.name, situation: f.get('situation'), report: f.get('report'), items: f.getAll('items'), refs: f.getAll('refs'), other: f.get('other'), author: user };
   db.visits.unshift(v);
   p.history.unshift({ date: v.at, kind: 'Visita de enfermagem (demo)', note: v.situation + '. ' + v.report });
   save();
   log('Visita registrada', v.id);
   closeModal();
   go('visits');
   toast('Visita demonstrativa registrada.') 
}

function viewVisit(id) { 
   let v = db.visits.find(x => x.id === id);
   modal('Detalhes da visita', `<p><b>Local:</b> ${esc(v.unit)}, quarto ${esc(v.room)}, leito ${esc(v.bed)}</p><p><b>Paciente:</b> ${esc(v.patientName)}</p><p><b>Situação:</b> ${esc(v.situation)}</p><p>${esc(v.report)}</p><h3>Itens verificados</h3>${v.items.map(x => `<span class="pill">${esc(x)}</span> `).join('')}<h3>Encaminhamentos</h3>${v.refs.map(x => `<span class="pill blue">${esc(x)}</span> `).join('')}<p>${esc(v.other)}</p><small>${esc(v.author)} · ${esc(v.at)}</small>`) 
}

function agenda() { 
   return `<div class="toolbar"><button onclick="apptForm()">＋ Novo agendamento</button></div><div class="tablewrap"><table><thead><tr><th>Data/hora</th><th>Paciente</th><th>Profissional</th><th>Motivo</th><th>Status</th><th>Ação</th></tr></thead><tbody>${db.appointments.map(a => `<tr><td>${esc(a.date)}</td><td>${esc(db.patients.find(p => p.id === a.patient)?.name || a.patient)}</td><td>${esc(a.professional)}</td><td>${esc(a.reason)}</td><td><span class="pill">${esc(a.status)}</span></td><td><button class="secondary" onclick="apptStatus('${a.id}')">Status</button></td></tr>`).join('')}</tbody></table></div>` 
}

function apptForm() { 
   modal('Novo agendamento', `<form onsubmit="saveAppt(event)"><div class="form"><div class="field"><label>Paciente</label><select name="patient">${db.patients.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></div><div class="field"><label>Data/hora</label><input type="datetime-local" name="date" required></div><div class="field"><label>Profissional</label><input name="professional" required></div><div class="field"><label>Motivo</label><input name="reason" required></div></div><button>Salvar</button></form>`) 
}

function saveAppt(e) { 
   e.preventDefault();
   let f = new FormData(e.target);
   db.appointments.push({ id: 'AG-' + Date.now(), patient: f.get('patient'), date: f.get('date'), professional: f.get('professional'), reason: f.get('reason'), status: 'Agendado' });
   save();
   log('Agendamento criado');
   closeModal();
   go('agenda') 
}

function apptStatus(id) { 
   let a = db.appointments.find(x => x.id === id);
   modal('Atualizar agendamento', `<form onsubmit="saveApptStatus(event, '${id}')"><div class="field"><label>Status</label><select name="status">${['Agendado', 'Confirmado', 'Em atendimento', 'Concluído', 'Cancelado', 'Faltou'].map(x => `<option ${a.status === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div><button class="section">Salvar</button></form>`) 
}

function saveApptStatus(e, id) { 
   e.preventDefault();
   db.appointments.find(x => x.id === id).status = new FormData(e.target).get('status');
   save();
   log('Status de agendamento atualizado', id);
   closeModal();
   go('agenda') 
}

function inventory(m) { 
   let key = m === 'pharmacy' ? 'meds' : 'supplies', arr = db[key];
   return `<div class="grid two"><div class="card"><h2>Resumo</h2><div class="grid two">${metric('Itens', arr.length, 'cadastrados', '▤')}${metric('Abaixo do mínimo', arr.filter(x => x.stock <= x.min).length, 'reposição a avaliar', '⚠')}</div></div><div class="card"><h2>Movimentação</h2><form onsubmit="stockMove(event, '${key}')"><div class="field"><label>Item</label><select name="id">${arr.map(x => `<option value="${x.id}">${esc(x.name)} · ${x.stock}</option>`).join('')}</select></div><div class="field section"><label>Movimento</label><select name="type"><option value="in">Entrada/reposição</option><option value="out">Saída/consumo</option></select></div><div class="field section"><label>Quantidade</label><input name="qty" type="number" min="1" required></div><div class="field section"><label>Motivo</label><input name="reason" required></div><button class="section">Registrar</button></form></div></div><div class="tablewrap section"><table><thead><tr><th>Código</th><th>Item</th><th>Saldo</th><th>Mínimo</th>${key === 'meds' ? '<th>Validade</th>' : ''}<th>Situação</th></tr></thead><tbody>${arr.map(x => `<tr><td>${x.id}</td><td>${esc(x.name)}</td><td>${x.stock}</td><td>${x.min}</td>${key === 'meds' ? `<td>${x.expiry}</td>` : ''}<td>${x.stock <= x.min ? '<span class="pill orange">Repor</span>' : '<span class="pill green">Regular</span>'}</td></tr>`).join('')}</tbody></table></div>` 
}

function stockMove(e, key) { 
   e.preventDefault();
   if (!['gestao', 'farmacia', 'almoxarifado'].includes(curRole)) return toast('Perfil sem permissão.');
   let f = new FormData(e.target), x = db[key].find(x => x.id === f.get('id')), q = Number(f.get('qty'));
   if (f.get('type') === 'out' && q > x.stock) return toast('Saldo insuficiente.');
   x.stock += f.get('type') === 'in' ? q : -q;
   save();
   log('Movimentação de estoque', x.name + '; ' + f.get('type') + '; ' + q + '; ' + f.get('reason'));
   go(key === 'meds' ? 'pharmacy' : 'warehouse') 
}

function taskTable(key) { 
   let clean = key === 'cleaning', arr = db[key];
   return `${clean ? '<div class="notice">Fluxos de higienização e prevenção de infecções precisam ser aprovados pela equipe responsável e seguir protocolos institucionais.</div>' : ''}<button class="section" onclick="taskForm('${key}')">＋ ${clean ? 'Nova ordem de higienização' : 'Solicitar manutenção'}</button><div class="tablewrap section"><table><thead><tr><th>Código</th><th>Local/equipamento</th><th>Tipo/problema</th><th>Responsável</th><th>Prioridade</th><th>Status</th><th>Ação</th></tr></thead><tbody>${arr.map(x => `<tr><td>${x.id}</td><td>${esc(x.location)}</td><td>${esc(x.type || x.problem)}</td><td>${esc(x.owner)}</td><td>${esc(x.priority)}</td><td>${esc(x.status)}</td><td><button class="secondary" onclick="taskStatus('${key}', '${x.id}')">Atualizar</button></td></tr>`).join('') || '<tr><td colspan="7">Nenhuma ordem.</td></tr>'}</tbody></table></div>` 
}

function taskForm(key) { 
   let c = key === 'cleaning';
   modal(c ? 'Nova ordem de higienização' : 'Solicitação de manutenção', `<form onsubmit="saveTask(event, '${key}')"><div class="form"><div class="field"><label>Unidade / quarto / equipamento</label><input name="location" required></div><div class="field"><label>Prioridade</label><select name="priority"><option>Normal</option><option>Alta</option><option>Urgente</option></select></div>${c ? `<div class="field"><label>Tipo</label><select name="type"><option>Rotina</option><option>Terminal</option><option>Após solicitação</option><option>Área de alto contato</option></select></div>` : `<div class="field"><label>Problema</label><input name="problem" required></div>`}<div class="field"><label>Responsável/equipe</label><input name="owner" required></div></div><button class="section">Criar</button></form>`) 
}

function saveTask(e, key) { 
   e.preventDefault();
   let o = Object.fromEntries(new FormData(e.target).entries());
   o.id = (key === 'cleaning' ? 'HIG-' : 'MAN-') + Date.now().toString().slice(-6);
   o.status = 'Pendente';
   db[key].unshift(o);
   save();
   log('Ordem criada', o.id);
   closeModal();
   go(key) 
}

function taskStatus(key, id) { 
   let x = db[key].find(x => x.id === id);
   modal('Atualizar ordem', `<form onsubmit="saveTaskStatus(event, '${key}', '${id}')"><div class="field"><label>Status</label><select name="status">${['Pendente', 'Em execução', 'Aguardando material', 'Concluída', 'Cancelada'].map(s => `<option ${x.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div><div class="field section"><label>Observação</label><textarea name="note">${esc(x.note || '')}</textarea></div><button class="section">Salvar</button></form>`) 
}

function saveTaskStatus(e, key, id) { 
   e.preventDefault();
   let f = new FormData(e.target), x = db[key].find(x => x.id === id);
   x.status = f.get('status');
   x.note = f.get('note');
   save();
   log('Ordem atualizada', id + ' ' + x.status);
   closeModal();
   go(key) 
}

function simulator() { 
   return `<div class="hero"><h2>Simulador educacional</h2><p>Casos fictícios, níveis de dificuldade e feedback de aprendizagem.</p></div><div class="grid three">${[['inicial', 'Inicial', 'Comunicação e organização'], ['intermediário', 'Intermediário', 'Registro e priorização'], ['avançado', 'Avançado', 'Coordenação e encaminhamentos']].map(s => `<div class="card"><h2>${s[1]}</h2><p>${s[2]}</p><button onclick="scenario('${s[0]}')">Iniciar</button></div>`).join('')}</div><div id="scenario" class="section"></div><div class="card section"><h2>Histórico de aprendizagem</h2>${db.sim.map(s => `<p>${esc(s.level)} · ${esc(s.at)} · ${esc(s.result)}</p>`).join('') || 'Nenhum cenário concluído.'}</div>` 
}

function scenario(level) { 
   modal('Cenário de treinamento · ' + level, `<p>Um usuário informa que não recebeu retorno sobre uma solicitação. Qual a melhor conduta?</p><form onsubmit="finishScenario(event, '${level}')"><div class="field"><label>Resposta</label><select name="answer"><option value="">Selecione...</option><option value="ok">Verificar as informações, registrar com clareza e encaminhar pelo fluxo aprovado.</option><option value="bad">Supor os dados que faltam e encerrar sem retorno.</option><option value="bad">Compartilhar dados em canal não autorizado.</option></select></div><button class="section">Enviar resposta</button></form>`) 
}

function finishScenario(e, level) { 
   e.preventDefault();
   let ok = new FormData(e.target).get('answer') === 'ok';
   db.sim.unshift({ level, at: new Date().toLocaleString('pt-BR'), result: ok ? 'Conduta alinhada' : 'Revisar registro, comunicação e privacidade' });
   save();
   log('Cenário concluído', level);
   closeModal();
   go('sim');
   toast(ok ? 'Boa escolha: registre e encaminhe com segurança.' : 'Revise os princípios de segurança e registro.') 
}

function access() { 
   if (!['gestao', 'ti'].includes(curRole)) return '<p class="notice">Acesso restrito à Gestão e TI.</p>';
   return `<p class="notice">Governança: a Gestão define e aprova processos e responsabilidades; TI implementa as regras. Perfis abaixo são propostas iniciais, sujeitas à validação institucional.</p><button onclick="userForm()">＋ Cadastrar usuário demonstrativo</button> <button class="secondary" onclick="matrix()">Ver matriz de permissões</button><div class="tablewrap section"><table><thead><tr><th>Usuário</th><th>Perfil</th><th>Área</th><th>Status</th><th>Ação</th></tr></thead><tbody>${db.users.map(u => `<tr><td>${esc(u.name)}<br><small>${esc(u.username)}</small></td><td>${esc(roles.find(r => r.id === u.role)?.name)}</td><td>${esc(u.area)}</td><td>${u.active ? 'Ativo' : 'Suspenso'}</td><td><button class="secondary" onclick="toggleUser('${u.id}')">${u.active ? 'Suspender' : 'Reativar'}</button></td></tr>`).join('') || '<tr><td colspan="5">Nenhum usuário cadastrado.</td></tr>'}</tbody></table></div><h2 class="section">Perfis propostos</h2><div class="grid two">${roles.map(r => `<div class="card"><h2>${r.name}</h2><small>Módulos: ${r.mods.map(m => mods.find(x => x[0] === m)[2]).join(', ')}</small></div>`).join('')}</div>` 
}

function userForm() { 
   modal('Cadastrar usuário demonstrativo', `<form onsubmit="saveUser(event)"><div class="form"><div class="field"><label>Nome</label><input name="name" required></div><div class="field"><label>Identificador de acesso demo</label><input name="username" required></div><div class="field"><label>Perfil</label><select name="role">${roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}</select></div><div class="field"><label>Área</label><input name="area" required></div></div><p class="notice section">Este formulário não cria credenciais de acesso reais. Produção exige provedor de identidade e autenticação segura.</p><button class="section">Salvar</button></form>`) 
}

function saveUser(e) { 
   e.preventDefault();
   let f = new FormData(e.target);
   db.users.push({ id: 'USR-' + Date.now(), name: f.get('name'), username: f.get('username'), role: f.get('role'), area: f.get('area'), active: true });
   save();
   log('Usuário demonstrativo cadastrado', f.get('username'));
   closeModal();
   go('access') 
}

function toggleUser(id) { 
   let u = db.users.find(u => u.id === id);
   u.active = !u.active;
   save();
   log('Status do usuário alterado', u.username);
   go('access') 
}

function matrix() { 
   modal('Matriz de permissões inicial', `<div class="tablewrap"><table><thead><tr><th>Perfil</th><th>Módulos</th><th>Governança</th></tr></thead><tbody>${roles.map(r => `<tr><td>${r.name}</td><td>${r.mods.map(m => mods.find(x => x[0] === m)[2]).join(', ')}</td><td>Proposta; depende de aprovação da Gestão e implementação da TI.</td></tr>`).join('')}</tbody></table></div>`) 
}

function docs() { 
   return `<div class="notice warn">A assinatura desenhada é apenas demonstrativa. Não é assinatura digital certificada nem prova de identidade. Autenticação facial não está implementada.</div><div class="grid two section"><div class="card"><h2>Registrar documento</h2><form onsubmit="saveDoc(event)"><div class="field"><label>Tipo</label><select name="type"><option>Termo de responsabilidade</option><option>Aprovação administrativa</option><option>Ordem de serviço</option><option>Registro de treinamento</option><option>Outro</option></select></div><div class="field section"><label>Descrição/referência</label><input name="desc" required></div><div class="field section"><label>Responsável</label><input name="signer" value="${esc(user)}" required></div><label class="check section"><input type="checkbox" name="confirm" required> Confirmo que é um registro de demonstração.</label><button class="section">Registrar intenção de assinatura</button></form></div><div class="card"><h2>Segurança prevista</h2><ul><li>Assinatura conforme finalidade e validade jurídica necessária.</li><li>Autenticação adicional em ações críticas.</li><li>Biometria facial somente após avaliação de privacidade e segurança.</li><li>Alternativas acessíveis e recuperação de acesso.</li><li>Auditoria protegida em servidor na versão real.</li></ul></div></div><div class="tablewrap section"><table><thead><tr><th>Data/hora</th><th>Tipo</th><th>Descrição</th><th>Responsável</th><th>Natureza</th></tr></thead><tbody>${db.docs.map(d => `<tr><td>${esc(d.at)}</td><td>${esc(d.type)}</td><td>${esc(d.desc)}</td><td>${esc(d.signer)}</td><td><span class="pill orange">Demonstração</span></td></tr>`).join('') || '<tr><td colspan="5">Nenhum documento registrado.</td></tr>'}</tbody></table></div>` 
}

function saveDoc(e) { 
   e.preventDefault();
   let f = new FormData(e.target);
   db.docs.unshift({ at: new Date().toLocaleString('pt-BR'), type: f.get('type'), desc: f.get('desc'), signer: f.get('signer') });
   save();
   log('Intenção de assinatura demonstrativa', f.get('desc'));
   closeModal();
   go('docs') 
}

function audit() { 
   return `<div class="toolbar"><input id="aq" placeholder="Filtrar auditoria..." oninput="filterAudit()"><button class="secondary" onclick="exportAudit()">Exportar CSV</button></div><div class="tablewrap"><table><thead><tr><th>Data/hora</th><th>Usuário</th><th>Perfil</th><th>Ação</th><th>Detalhe</th></tr></thead><tbody id="arows">${auditRows(db.audit)}</tbody></table></div><p class="muted section">Logs locais podem ser alterados no navegador e não substituem auditoria protegida em servidor.</p>` 
}

function auditRows(a) { 
   return a.map(x => `<tr><td>${esc(x.at)}</td><td>${esc(x.user)}</td><td>${esc(x.role)}</td><td>${esc(x.action)}</td><td>${esc(x.detail)}</td></tr>`).join('') || '<tr><td colspan="5">Sem eventos.</td></tr>' 
}

function filterAudit() { 
   let q = document.getElementById('aq').value.toLowerCase();
   document.getElementById('arows').innerHTML = auditRows(db.audit.filter(x => (x.user + x.role + x.action + x.detail).toLowerCase().includes(q))) 
}

function csv(rows) { 
   return rows.map(r => r.map(x => '"' + String(x ?? '').replace(/"/g, '""') + '"').join(';')).join('\n') 
}

function exportAudit() { 
   download('auditoria_demo.csv', csv([['Data/hora', 'Usuário', 'Perfil', 'Ação', 'Detalhe'], ...db.audit.map(x => [x.at, x.user, x.role, x.action, x.detail])])) 
}

function exportData() { 
   download('clinicas_inteligentes_demo.json', JSON.stringify({ aviso: 'Dados fictícios de demonstração', exportadoEm: new Date().toISOString(), db }, null, 2));
   log('Exportação de dados') 
}

function download(name, text) { 
   let a = document.createElement('a'), url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset = utf-8' }));
   a.href = url;
   a.download = name;
   a.click();
   URL.revokeObjectURL(url) 
}

function profile() { 
   modal('Perfil e segurança', `<div class="card"><h2>${esc(user)}</h2><p>${esc(role().name)}</p></div><p class="notice section">O login atual é apenas seleção de perfil, não autenticação real. Produção requer autenticação institucional, MFA, controle no servidor, gestão de sessão, criptografia e auditoria protegida.</p><p>Gestão aprova processos e permissões; TI configura os controles. Dados biométricos são sensíveis e exigem avaliação jurídica e de privacidade.</p>`) 
}

function modal(title, body) { 
   document.getElementById('mtitle').textContent = title;
   document.getElementById('mbody').innerHTML = body;
   document.getElementById('modalbg').classList.add('open') 
}

function closeModal() { 
   document.getElementById('modalbg').classList.remove('open') 
}

function toast(s) { 
   let t = document.getElementById('toast');
   t.textContent = s;
   t.classList.add('show');
   setTimeout(() => t.classList.remove('show'), 2600) 
}

window.addEventListener('keydown', e => { 
   if(e.key === 'Escape') closeModal() 
});

init();