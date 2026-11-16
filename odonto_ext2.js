/* Extensão 2: agenda por box, recepção/triagem, anamnese, evoluções, supervisão, correção autorizada, documentos. */
(function () {
  'use strict';
  const X = window.OdontoX = { tabs: {}, alert: null };
  const DISC = ['Dentística', 'Periodontia', 'Endodontia', 'Cirurgia Oral', 'Prótese', 'Odontopediatria'];
  const TURMAS = ['Odontologia 7º período', 'Odontologia 8º período'];
  const STUDENTS = ['Lucas Almeida', 'Camila Souza', 'Pedro Lima'], PROFS = ['Profa. Ana Ribeiro', 'Prof. Carlos Mendes'];
  const BOXES = { 'Box 01': 'Clínica 1', 'Box 02': 'Clínica 1', 'Box 03': 'Clínica 2' }, PROF_CAP = 3;
  const ACC = { 'Administração': 'Administração (fictícia)', 'Gestão da clínica': 'Gestão (fictícia)', 'Recepção': 'Recepção (fictícia)', 'Cirurgião-dentista': 'Prof. Carlos Mendes', 'Professor ou supervisor': 'Profa. Ana Ribeiro', 'Aluno ou estagiário': 'Lucas Almeida', 'Financeiro': 'Financeiro (fictício)', 'Estoque ou farmácia': 'Estoque (fictício)' };
  const LOGINS = { 'ana.ribeiro': 'Profa. Ana Ribeiro', 'carlos.mendes': 'Prof. Carlos Mendes' }, DEMO_PASS = 'demo123';
  const who = () => ACC[profile] || profile;
  const DAY = '2026-05-22', todayISO = () => new Date().toISOString().slice(0, 10);
  const mins = t => { const [h, m] = t.split(':'); return h * 60 + +m; };
  const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const restricted = () => '<div class="empty"><strong>Acesso restrito</strong><br>Este conteúdo é visível apenas à equipe autorizada.</div>';
  const aud = (action, ent, reason) => record('auditoria', action + ' · ' + ent, 'Registrado', { action, entity: ent, user: who(), profile, clinic: 'Odontologia', at: stamp(), reason: reason || '' });
  const closeNow = () => { modalDirty = false; $('#modal-root').innerHTML = ''; };
  const isClin = () => can('atendimentos');
  let busy = false;

  Object.assign(entityModule, { fila: 'recepcao', anamnese: 'atendimentos', evolucao: 'atendimentos', autorizacao: 'supervisao', documento: 'atendimentos' });
  Object.assign(entityNames, { fila: 'Fila', anamnese: 'Anamnese', evolucao: 'Evolução', autorizacao: 'Autorização docente', documento: 'Documento' });
  const _v = visible;
  visible = function (r) {
    const t = r.entity_type;
    if (['anamnese', 'evolucao', 'documento', 'autorizacao'].includes(t)) {
      if (!can(entityModule[t]) || profile === 'Financeiro') return false;
      return profile !== 'Aluno ou estagiário' || data(r).patientId === 'P-001';
    }
    if (t === 'fila') return can('recepcao');
    return _v(r);
  };

  /* ---------- Dados fictícios ---------- */
  const fx = (id, t, title, st, p) => { if (!fixtures.some(f => f.entity_id === id)) fixtures.push({ entity_id: id, entity_type: t, title, status: st, payload: JSON.stringify(p), updated_at: '2026-05-22T12:00:00.000Z', demo: true }); };
  const patchFx = (id, p) => { const f = fixtures.find(x => x.entity_id === id); if (f) f.payload = JSON.stringify({ ...JSON.parse(f.payload), ...p }); };
  const slug = n => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]+/g, '.');
  [['P-004', 'Carla Menezes', 'PR-004'], ['P-005', 'Roberto Lima', 'PR-005'], ['P-006', 'Mariana Castro', 'PR-006'], ['P-007', 'Felipe Nogueira', 'PR-007'], ['P-008', 'Bruno Silveira', 'PR-008'], ['P-009', 'Laura Pimentel', 'PR-009'], ['P-010', 'Gustavo Torres', 'PR-010'], ['P-011', 'Ana Luísa Martins', 'PR-011'], ['P-012', 'Eduardo Freitas', 'PR-012'], ['P-013', 'Rafael Campos', 'PR-024'], ['P-014', 'Mariana Lopes', 'PR-037'], ['P-015', 'Rafael Costa', 'PR-014'], ['P-016', 'Mariana Alves', 'PR-027']]
    .forEach(([id, n, pr], i) => fx(id, 'paciente', n, 'Ativo', { idade: (28 + i) + ' anos', sexo: i % 2 ? 'Masculino' : 'Feminino', telefone: '(00) 00000-00' + (10 + i), email: slug(n) + '@example.com', prontuario: pr }));
  ['P-001', 'P-002', 'P-003'].forEach(id => patchFx(id, { email: slug(fixtures.find(f => f.entity_id === id).title) + '@example.com' }));
  patchFx('P-001', { alertas: 'Alergia à penicilina (relatada)', idade: '31 anos', telefone: '(41) 99999-1122' });
  const seed = [['A-101', 'P-004', 'Box 01', '08:00', '08:50', 'Periodontia', 'Pedro Lima', PROFS[1]], ['A-102', 'P-005', 'Box 01', '09:00', '09:50', 'Cirurgia Oral', 'Camila Souza', PROFS[1]], ['A-103', 'P-006', 'Box 01', '10:30', '11:20', 'Prótese', 'Pedro Lima', PROFS[1]],
    ['A-104', 'P-007', 'Box 02', '08:00', '08:50', 'Dentística', 'Camila Souza', PROFS[0]], ['A-105', 'P-008', 'Box 02', '10:00', '10:50', 'Endodontia', 'Pedro Lima', PROFS[0]], ['A-106', 'P-009', 'Box 02', '11:00', '11:50', 'Odontopediatria', 'Camila Souza', PROFS[0]],
    ['A-107', 'P-010', 'Box 03', '08:30', '09:20', 'Periodontia', 'Lucas Almeida', PROFS[1]], ['A-108', 'P-011', 'Box 03', '10:00', '10:50', 'Dentística', 'Camila Souza', PROFS[0]], ['A-109', 'P-012', 'Box 03', '11:00', '11:50', 'Prótese', 'Pedro Lima', PROFS[1]]];
  seed.forEach(([id, p, box, a, b, disc, st, pr]) => fx(id, 'agendamento', 'Consulta · ' + fixtures.find(f => f.entity_id === p).title, 'Agendado', { patientId: p, box, room: BOXES[box], professional: pr, professor: pr, student: st, discipline: disc, turma: TURMAS[0], date: DAY, time: a, end: b, service: disc }));
  patchFx('A-001', { box: 'Box 02', room: 'Clínica 1', professor: PROFS[0], professional: PROFS[0], student: 'Lucas Almeida', discipline: 'Dentística', turma: TURMAS[0], time: '09:00', end: '09:50' });
  patchFx('A-002', { box: 'Box 03', room: 'Clínica 2', professor: PROFS[1], professional: PROFS[1], student: 'Camila Souza', discipline: 'Dentística', turma: TURMAS[0], time: '12:00', end: '12:50' });
  patchFx('A-003', { box: 'Box 01', room: 'Clínica 1', professor: PROFS[0], professional: PROFS[0], student: 'Lucas Almeida', discipline: 'Periodontia', turma: TURMAS[0] });
  fx('F-001', 'fila', 'Fila · Helena Prado', 'Aguardando triagem', { patientId: 'P-001', arrivedAt: '08:12', reason: 'Dor no dente posterior', triage: { queixa: 'Dor no dente posterior, iniciada há 2 dias.', alertas: 'Alergia à penicilina.', discipline: 'Dentística', student: 'Lucas Almeida', professor: PROFS[1] }, history: [] });
  fx('F-002', 'fila', 'Fila · Rafael Campos', 'Aguardando triagem', { patientId: 'P-013', arrivedAt: '08:27', reason: 'Avaliação de restauração', history: [] });
  fx('F-003', 'fila', 'Fila · Mariana Lopes', 'Aguardando triagem', { patientId: 'P-014', arrivedAt: '08:41', reason: 'Sensibilidade dentária', history: [] });
  fx('AN-001', 'anamnese', 'Anamnese · Helena Prado', 'Rascunho', { patientId: 'P-001', version: 1, student: 'Lucas Almeida', professor: PROFS[0], queixa: 'Relata dor ao mastigar no lado inferior direito há cerca de 2 semanas, com sensibilidade ao frio. Nega dor espontânea.', saude: 'Hipertensão arterial sistêmica (controlada). Nega diabetes. Nega cardiopatias.', meds: 'Losartana 50 mg – 1 comprimido ao dia\nOmeprazol 20 mg – 1 comprimido pela manhã', odonto: 'Realizou restaurações há cerca de 3 anos. Nega tratamentos endodônticos.', alergiaKind: 'Relata', alergia: 'Penicilina (reação: urticária). Nega alergia a anestésicos.', history: [] });
  fx('EV-001', 'evolucao', 'Evolução · Helena Prado · Sessão 1', 'Validado', { patientId: 'P-001', n: 1, date: '2025-01-14', student: 'Lucas Almeida', professor: PROFS[0], discipline: 'Dentística', turma: TURMAS[0], version: 1, procLabel: 'Exame clínico e planejamento', registro: 'Exame clínico e planejamento realizados.', orientacoes: 'Retorno em 14 dias.', validatedBy: PROFS[0], validatedAt: '15/01/2025 10:24', history: [{ at: '15/01/2025 10:24', by: PROFS[0], action: 'Validado' }] });
  fx('EV-002', 'evolucao', 'Evolução · Helena Prado · Sessão 2', 'Em revisão', { patientId: 'P-001', n: 2, date: '2025-01-23', time: '14:27', student: 'Lucas Almeida', professor: PROFS[0], discipline: 'Dentística', turma: TURMAS[0], version: 1, procLabel: 'Restauração em resina composta', registro: 'Restauração em resina composta no dente 16. Remoção de tecido cariado, isolamento relativo, condicionamento ácido, adesivo e restauração incremental. Ajuste oclusal e acabamento realizados. Paciente tolerou bem o procedimento, sem intercorrências.', orientacoes: 'Evitar alimentos duros por 24 h. Retorno em 30 dias.', history: [{ at: '22/01/2025 17:08', by: PROFS[0], action: 'Solicitou complementação da descrição do procedimento e do material utilizado.' }] });
  fx('EV-003', 'evolucao', 'Evolução · Rafael Costa · Sessão 1', 'Em revisão', { patientId: 'P-015', n: 1, date: '2025-01-22', student: 'Camila Souza', professor: PROFS[1], discipline: 'Periodontia', turma: TURMAS[1], version: 1, procLabel: 'Raspagem supragengival', registro: 'Raspagem supragengival e polimento.', orientacoes: 'Reforço de higiene.', history: [] });
  fx('EV-004', 'evolucao', 'Evolução · Mariana Alves · Sessão 1', 'Em revisão', { patientId: 'P-016', n: 1, date: '2025-01-22', student: 'Pedro Lima', professor: PROFS[1], discipline: 'Endodontia', turma: TURMAS[1], version: 1, procLabel: 'Tratamento endodôntico', registro: 'Acesso endodôntico e odontometria.', orientacoes: 'Retorno em 7 dias.', history: [] });

  /* ---------- Gravação consistente ---------- */
  function commit(creates = [], updates = []) {
    const list = backendRecords.slice(), now = new Date().toISOString(), seen = new Set();
    for (const [r, patch, st] of updates) {
      if (seen.has(r.entity_id)) return false; seen.add(r.entity_id);
      const next = { ...r, status: st ?? r.status, payload: JSON.stringify({ ...data(r), ...patch }), updated_at: now };
      const i = r.__backendId ? list.findIndex(x => x.__backendId === r.__backendId) : -1;
      if (i >= 0) list[i] = next; else { delete next.demo; list.push({ ...next, __backendId: r.entity_id + '-' + Date.now() }); }
    }
    creates.forEach((r, i) => list.push({ ...r, __backendId: r.entity_id + '-' + Date.now() + '-' + i }));
    return store.persist(list).isOk;
  }
  function run(fn, msg) {
    if (busy) return false; busy = true;
    try { if (!fn()) { toast('Não foi possível gravar. Os dados foram mantidos; tente novamente.'); return false; } toast(msg); render(); return true; }
    finally { busy = false; }
  }
  const hist = (d, action, note) => [...(d.history || []), { at: stamp(), by: who(), action: action + (note ? ': ' + note : '') }];

  /* ---------- Chegada, fila e atendimento ---------- */
  function ensureQueue(a) { // devolve [criar[], entrada existente]
    const ex = of('fila').find(f => data(f).appointmentId === a.entity_id && f.status !== 'Concluído');
    if (ex) return [[], ex];
    const d = data(a), f = record('fila', 'Fila · ' + byId(d.patientId)?.title, 'Aguardando triagem', { patientId: d.patientId, appointmentId: a.entity_id, arrivedAt: new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()), reason: d.service || 'Consulta agendada', history: [] });
    return [[f], null];
  }
  function arrive(a) {
    if (['Cancelado', 'Falta', 'Concluído'].includes(a.status)) return toast('Este agendamento não permite registrar chegada.');
    const [creates, ex] = ensureQueue(a), d = data(a);
    const ups = a.status === 'Chegou' || a.status === 'Em atendimento' ? [] : [[a, { arrivedAt: creates[0] ? data(creates[0]).arrivedAt : d.arrivedAt }, 'Chegou']];
    if (!creates.length && !ups.length) return toast('Chegada já registrada; fila mantida com uma única entrada.');
    run(() => commit([...creates, aud('Chegada registrada', a.entity_id)], ups), 'Chegada registrada e paciente na fila.');
  }
  function startEnc(aid, qid) {
    if (!can('atendimentos', 'cadastrar')) return toast('Ação indisponível para este perfil.');
    const a = aid ? byId(aid) : null, qe = qid ? byId(qid) : null, pt = a ? data(a).patientId : data(qe).patientId;
    let enc = of('atendimento').find(e => (a && data(e).appointmentId === a.entity_id) || (qe && data(e).queueId === qe.entity_id));
    const creates = [], ups = [];
    if (!enc) {
      const ad = a ? data(a) : {}, tr = qe ? data(qe).triage || {} : {};
      enc = record('atendimento', 'Atendimento · ' + byId(pt).title, 'Rascunho', { patientId: pt, professional: ad.student || tr.student || who(), student: ad.student || tr.student, supervisor: ad.professor || tr.professor, type: ad.service || 'Consulta', complaint: tr.queixa || 'A registrar', notes: '', appointmentId: a?.entity_id, queueId: qe?.entity_id, date: new Date().toISOString() });
      creates.push(enc, aud('Atendimento aberto', enc.entity_id));
    }
    if (a && a.status !== 'Em atendimento') ups.push([a, {}, 'Em atendimento']);
    const q = qe || (a && of('fila').find(f => data(f).appointmentId === a.entity_id && f.status !== 'Concluído'));
    if (q && q.status !== 'Em atendimento') ups.push([q, { encounterId: enc.entity_id, history: hist(data(q), 'Atendimento iniciado') }, 'Em atendimento']);
    if (!creates.length && !ups.length) return navigate('atendimentos', enc.entity_id);
    if (run(() => commit(creates, ups), 'Atendimento aberto.')) navigate('atendimentos', enc.entity_id);
  }
  function finishEnc(a) {
    const q = of('fila').find(f => data(f).appointmentId === a.entity_id && f.status !== 'Concluído');
    run(() => commit([aud('Atendimento concluído', a.entity_id)], [[a, {}, 'Concluído'], ...(q ? [[q, { history: hist(data(q), 'Atendimento concluído') }, 'Concluído']] : [])]), 'Atendimento concluído; retirado da fila ativa.');
  }

  /* ---------- Agenda por box ---------- */
  const ag = { date: DAY, mode: 'dia', disc: '', prof: '', student: '', box: '', sel: '' };
  function conflict(a, ignore) {
    if (!a.date || !a.time || !a.end) return 'Preencha data, início e término.';
    if (a.end <= a.time) return 'O término deve ser posterior ao início.';
    if (byId(a.patientId)?.status === 'Inativo') return 'Cadastro inativo: não é possível agendar até a reativação.';
    const same = of('agendamento').filter(x => x.entity_id !== ignore && !['Cancelado', 'Falta'].includes(x.status) && data(x).date === a.date && a.time < data(x).end && a.end > data(x).time);
    if (same.some(x => data(x).box === a.box)) return 'Conflito: o box já está ocupado nesse horário.';
    if (a.student && same.some(x => data(x).student === a.student)) return 'Conflito: o aluno já tem atendimento nesse horário.';
    if (a.professor && same.filter(x => data(x).professor === a.professor).length >= PROF_CAP) return 'Professor acima da capacidade de ' + PROF_CAP + ' boxes simultâneos.';
    if (same.some(x => data(x).patientId === a.patientId)) return 'O paciente já tem consulta sobreposta nesse horário.';
    if (of('bloqueio').some(b => data(b).date === a.date && a.time < data(b).end && a.end > data(b).time && (!data(b).box || data(b).box === a.box || data(b).professional === a.professor))) return 'Horário bloqueado.';
    return '';
  }
  function agendaView() {
    const f = r => { const d = data(r); return (!ag.disc || d.discipline === ag.disc) && (!ag.prof || d.professor === ag.prof) && (!ag.student || d.student === ag.student) && (!ag.box || d.box === ag.box); };
    const all_ = list('agendamento').filter(f), sel = ag.sel && byId(ag.sel);
    const opt = (id, label, arr, v, all) => `<div class="field"><label for="${id}">${label}</label><select id="${id}"><option value="">${all}</option>${arr.map(x => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('')}</select></div>`;
    const card = r => { const d = data(r); return `<button type="button" class="ag-card d-${esc((d.discipline || '').split(' ')[0])} ${ag.sel === r.entity_id ? 'sel' : ''}" data-agsel="${r.entity_id}"><strong>${esc(d.time)}–${esc(d.end)}</strong><br>${esc(byId(d.patientId)?.title || '—')}<br>${esc(d.discipline || d.service || '')} · <em>${esc(r.status)}</em></button>`; };
    let grid;
    if (ag.mode === 'dia') {
      const boxes = Object.keys(BOXES).filter(b => !ag.box || b === ag.box), rows = 20, day = all_.filter(r => data(r).date === ag.date);
      grid = `<div class="ag-grid" style="grid-template-columns:64px repeat(${boxes.length},minmax(150px,1fr));grid-template-rows:auto repeat(${rows},34px)"><div class="ag-head"></div>${boxes.map(b => `<div class="ag-head">${b}<br><small>${day.filter(r => data(r).box === b).length} agendamentos</small></div>`).join('')}
        ${Array.from({ length: rows }, (_, i) => `<div class="ag-time" style="grid-row:${i + 2}">${String(8 + (i >> 1)).padStart(2, '0')}:${i % 2 ? '30' : '00'}</div>`).join('')}
        ${day.map(r => { const d = data(r), bi = boxes.indexOf(d.box); if (bi < 0) return ''; const s = Math.max(0, Math.floor((mins(d.time) - 480) / 30)), n = Math.max(1, Math.ceil((mins(d.end) - mins(d.time)) / 30)); return `<div style="grid-column:${bi + 2};grid-row:${s + 2}/span ${n};display:flex;flex-direction:column;z-index:1">${card(r)}</div>`; }).join('')}</div>`;
    } else {
      const wd = (new Date(ag.date + 'T12:00:00Z').getUTCDay() + 6) % 7, mon = addDays(ag.date, -wd), days = [0, 1, 2, 3, 4].map(i => addDays(mon, i));
      grid = `<div class="ag-grid" style="grid-template-columns:repeat(5,minmax(160px,1fr))">${days.map(dd => `<div class="ag-head">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex'][days.indexOf(dd)]} ${fmtDate(dd)}</div>`).join('')}${days.map(dd => `<div style="padding:4px">${all_.filter(r => data(r).date === dd).sort((a, b) => data(a).time.localeCompare(data(b).time)).map(r => card(r)).join('') || '<small>Sem agendamentos</small>'}</div>`).join('')}</div>`;
    }
    let panel = '<section class="panel"><p class="section-note">Selecione um horário para ver paciente, período, box e equipe.</p></section>';
    if (sel && visible(sel)) {
      const d = data(sel), p = byId(d.patientId), live = !['Cancelado', 'Falta', 'Concluído'].includes(sel.status);
      panel = `<section class="panel"><div class="panel-head"><h2>${esc(p?.title)}</h2>${badge(sel.status)}</div><p>${esc(data(p).prontuario || '')}</p><p style="line-height:1.9"><strong>Data:</strong> ${fmtDate(d.date)}<br><strong>Período:</strong> ${esc(d.time)}–${esc(d.end)}<br><strong>Box:</strong> ${esc(d.box || '—')}<br><strong>Disciplina:</strong> ${esc(d.discipline || '—')}<br><strong>Aluno:</strong> ${esc(d.student || '—')}<br><strong>Professor:</strong> ${esc(d.professor || '—')}${d.series ? `<br><strong>Série:</strong> sessão ${d.seq}/${d.of}` : ''}</p>
        <div class="actions" style="flex-direction:column">${live && (can('recepcao', 'editar') || can('agenda', 'editar')) && !['Chegou', 'Em atendimento'].includes(sel.status) ? `<button class="btn" data-agarrive="${sel.entity_id}">✓ Registrar chegada</button>` : ''}
        ${can('pacientes') ? `<button class="btn secondary" data-agficha="${d.patientId}">Abrir ficha</button>` : ''}
        ${live && can('atendimentos', 'cadastrar') ? `<button class="btn secondary" data-agstart="${sel.entity_id}">Iniciar atendimento</button>` : ''}
        ${sel.status === 'Em atendimento' && can('atendimentos', 'editar') ? `<button class="btn secondary" data-agfinish="${sel.entity_id}">Concluir atendimento</button>` : ''}
        ${live && can('agenda', 'editar') ? `<button class="btn secondary" data-act="reschedule" data-id="${sel.entity_id}">Reagendar</button><button class="btn secondary" data-agabsent="${sel.entity_id}">Registrar falta</button><button class="btn secondary" data-act="cancel" data-id="${sel.entity_id}">Cancelar</button>` : ''}</div>
        ${(d.rescheduleHistory || []).length ? `<p class="section-note">Histórico: ${d.rescheduleHistory.map(h => esc(h.from + ' → ' + h.reason)).join('; ')}</p>` : ''}</section>`;
    }
    return heading('Agenda', 'Agenda clínica escola da Clínica Odontológica – Universidade Positivo.', can('agenda', 'cadastrar') ? '<button class="btn" data-agnew="1">+ Novo agendamento</button>' : '') +
      `<section class="panel"><div class="toolbar">${opt('ag-disc', 'Disciplina', DISC, ag.disc, 'Todas as disciplinas')}${opt('ag-prof', 'Professor', PROFS, ag.prof, 'Todos os professores')}${opt('ag-student', 'Aluno', STUDENTS, ag.student, 'Todos os alunos')}${opt('ag-box', 'Box', Object.keys(BOXES), ag.box, 'Todos os boxes')}</div>
      <div class="actions"><button class="btn small ${ag.mode === 'dia' ? '' : 'secondary'}" data-agmode="dia">Dia</button><button class="btn small ${ag.mode === 'semana' ? '' : 'secondary'}" data-agmode="semana">Semana</button><button class="btn small secondary" data-agnav="-1" aria-label="Anterior">‹</button><strong style="align-self:center">${fmtDate(ag.date)}</strong><button class="btn small secondary" data-agnav="1" aria-label="Próximo">›</button></div></section>
      <div class="split"><div>${grid}</div><div>${panel}</div></div>
      <section class="panel"><h2>Bloqueios e indisponibilidades</h2>${table(list('bloqueio'), 'Nenhum bloqueio registrado.')}</section>`;
  }

  function scheduleFlow() {
    const opts = a => a.map(x => [x, x]);
    openModal('Novo agendamento', `<div class="form-grid">${selectField('patient', 'Paciente *', patientOptions())}${selectField('discipline', 'Disciplina *', opts(DISC))}${selectField('box', 'Box *', opts(Object.keys(BOXES)))}${selectField('student', 'Aluno *', opts(STUDENTS))}${selectField('professor', 'Professor *', opts(PROFS))}${selectField('turma', 'Turma', opts(TURMAS))}${field('date', 'Data *', 'date', ag.date)}${field('time', 'Início *', 'time', '08:00')}${field('end', 'Término *', 'time', '08:50')}${selectField('freq', 'Recorrência', [['', 'Sem recorrência'], ['7', 'Semanal'], ['14', 'Quinzenal']])}${field('count', 'Ocorrências', 'number', '1', 'min="1" max="12"')}</div><span class="error" id="err-time"></span>`, 'Agendar', e => {
      e.preventDefault(); const v = values(), n = v.freq ? Math.min(12, Math.max(1, +v.count || 1)) : 1, series = n > 1 ? uid('serie') : '';
      const occ = Array.from({ length: n }, (_, i) => ({ ...v, date: addDays(v.date, i * (+v.freq || 0)), patientId: v.patient }));
      for (const o of occ) { const m = conflict({ ...o, professor: v.professor }); if (m) return err('time', m + (n > 1 ? ' (' + fmtDate(o.date) + ')' : '')); }
      const creates = occ.map((o, i) => record('agendamento', 'Consulta · ' + byId(v.patient).title, 'Agendado', { patientId: v.patient, box: v.box, room: BOXES[v.box], professional: v.professor, professor: v.professor, student: v.student, discipline: v.discipline, turma: v.turma, date: o.date, time: v.time, end: v.end, service: v.discipline, series, seq: i + 1, of: n }));
      if (run(() => commit([...creates, aud('Agendamento criado', creates[0].entity_id)]), n > 1 ? 'Série de ' + n + ' sessões agendada.' : 'Agendamento criado.')) { closeNow(); ag.date = v.date; render(); }
    });
  }
  function rescheduleFlow(r) {
    const d = data(r);
    openModal('Reagendar', `<div class="form-grid">${field('date', 'Nova data *', 'date', d.date)}${field('time', 'Novo início *', 'time', d.time)}${field('end', 'Novo término *', 'time', d.end)}${textArea('reason', 'Motivo do reagendamento *')}</div><span class="error" id="err-time"></span>`, 'Reagendar', e => {
      e.preventDefault(); const v = values();
      if (!v.reason?.trim()) return err('reason', 'Campo obrigatório.');
      const m = conflict({ ...d, date: v.date, time: v.time, end: v.end }, r.entity_id); if (m) return err('time', m);
      if (run(() => commit([aud('Reagendamento', r.entity_id, v.reason)], [[r, { date: v.date, time: v.time, end: v.end, rescheduleHistory: [...(d.rescheduleHistory || []), { from: fmtDate(d.date) + ' ' + d.time + '–' + d.end, reason: v.reason, at: stamp(), by: who() }] }, r.status]]), 'Reagendado; valores anteriores preservados no histórico.')) closeNow();
    });
  }

  /* ---------- Recepção e triagem ---------- */
  const rc = { stage: 'Aguardando triagem', sel: '' };
  const STAGES = ['Aguardando triagem', 'Em triagem', 'Aguardando atendimento'];
  reception = function () {
    const q = list('fila'), cnt = s => q.filter(f => f.status === s).length;
    const rows = q.filter(f => f.status === rc.stage).sort((a, b) => (data(a).arrivedAt || '').localeCompare(data(b).arrivedAt || ''));
    const sel = byId(rc.sel) && rows.includes(byId(rc.sel)) ? byId(rc.sel) : rows[0];
    let panel = '<section class="panel"><div class="empty">Nenhum paciente selecionado.</div></section>';
    if (sel) {
      const d = data(sel), p = byId(d.patientId), t = d.triage || {}, clin = isClin();
      panel = `<section class="panel"><div class="panel-head"><h2>${esc(p?.title)}</h2>${can('pacientes') ? `<button class="link-btn" data-agficha="${d.patientId}">Ver prontuário ↗</button>` : ''}</div><span class="tag">${esc(data(p).prontuario || '')}</span>
        <p style="line-height:1.8;margin-top:12px"><strong>Motivo da chegada:</strong> ${esc(d.reason || '—')}<br>
        ${clin ? `<strong>Queixa principal:</strong> ${esc(t.queixa || 'Triagem não registrada')}<br><strong>Alertas de saúde:</strong> ${t.alertas ? `<span class="tag bad">${esc(t.alertas)}</span>` : '—'}<br><strong>Prioridade:</strong> ${esc(t.prioridade || '—')}<br>` : '<em class="section-note">Dados clínicos restritos à equipe autorizada.</em><br>'}
        <strong>Disciplina de destino:</strong> ${esc(t.discipline || '—')}<br><strong>Aluno responsável:</strong> ${esc(t.student || '—')}<br><strong>Professor supervisor:</strong> ${esc(t.professor || '—')}</p>
        ${(d.history || []).length ? `<p class="section-note">${d.history.map(h => esc(h.at + ' · ' + h.by + ' · ' + h.action)).join('<br>')}</p>` : ''}
        <div class="actions" style="flex-direction:column">${sel.status !== 'Aguardando atendimento' && can('atendimentos', 'editar') ? `<button class="btn secondary" data-triage="${sel.entity_id}">Nova triagem</button>` : ''}
        ${sel.status !== 'Aguardando atendimento' && can('atendimentos', 'editar') ? `<button class="btn" data-forward="${sel.entity_id}">→ Encaminhar para atendimento</button>` : ''}
        ${sel.status === 'Aguardando atendimento' && can('atendimentos', 'cadastrar') ? `<button class="btn" data-qstart="${sel.entity_id}">Iniciar atendimento</button>` : ''}</div></section>`;
    }
    return heading('Recepção e fila', 'Triagem e encaminhamento de pacientes da Clínica Odontológica Escola.', `<div class="actions">${can('recepcao', 'editar') ? '<button class="btn" data-qarrive="1">Registrar chegada</button>' : ''}${can('atendimentos', 'editar') ? '<button class="btn" data-triage="">Nova triagem</button>' : ''}</div>`) +
      `<div class="tabs">${STAGES.map(s => `<button class="${rc.stage === s ? 'active' : ''}" data-rcstage="${s}">${s} (${cnt(s)})</button>`).join('')}</div>
      <div class="split"><section class="panel">${rows.length ? `<div class="table-wrap"><table><thead><tr><th>Paciente</th><th>Chegada</th><th>Motivo</th><th>Status</th></tr></thead><tbody>${rows.map(f => { const d = data(f); return `<tr><td><button class="link-btn" data-rcsel="${f.entity_id}">${esc(byId(d.patientId)?.title)}</button><br><small>${esc(data(byId(d.patientId)).prontuario)}</small></td><td>${esc(d.arrivedAt)}</td><td>${esc(d.reason)}</td><td>${badge(f.status)}</td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty">Nenhum paciente nesta etapa.</div>'}</section>${panel}</div>`;
  };
  function arriveFlow() {
    const open = of('agendamento').filter(a => ['Agendado', 'Confirmado'].includes(a.status) && data(a).date === DAY);
    openModal('Registrar chegada', `${selectField('appt', 'Agendamento', [['', 'Entrada avulsa (sem agendamento)'], ...open.map(a => [a.entity_id, a.title + ' · ' + data(a).time])])}${selectField('patient', 'Paciente (entrada avulsa)', patientOptions())}${field('reason', 'Motivo', 'text')}`, 'Registrar', e => {
      e.preventDefault(); const v = values();
      if (v.appt) { closeNow(); return arrive(byId(v.appt)); }
      if (!v.patient) return err('patient', 'Identifique o paciente.');
      if (of('fila').some(f => data(f).patientId === v.patient && !data(f).appointmentId && !['Concluído'].includes(f.status))) return err('patient', 'Paciente já está na fila.');
      const f = record('fila', 'Fila · ' + byId(v.patient).title, 'Aguardando triagem', { patientId: v.patient, arrivedAt: new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()), reason: v.reason || 'Entrada avulsa', history: [] });
      if (run(() => commit([f, aud('Chegada avulsa', f.entity_id)]), 'Paciente adicionado à fila.')) closeNow();
    });
  }
  function triageFlow(qid) {
    const waiting = list('fila').filter(f => f.status !== 'Aguardando atendimento' && f.status !== 'Em atendimento' && f.status !== 'Concluído');
    const q = qid ? byId(qid) : null;
    if (!q && !waiting.length) return toast('Não há pacientes na fila para triagem.');
    const t = (q && data(q).triage) || {}, opts = a => a.map(x => [x, x]);
    openModal('Nova triagem', `${q ? '' : selectField('queue', 'Entrada da fila *', waiting.map(f => [f.entity_id, f.title]))}<div class="form-grid">${field('queixa', 'Queixa principal *', 'text', t.queixa)}${field('alertas', 'Alertas pertinentes', 'text', t.alertas)}${selectField('prioridade', 'Prioridade', opts(['Normal', 'Prioritária', 'Urgente']), t.prioridade)}${selectField('discipline', 'Disciplina de destino *', opts(DISC), t.discipline)}${selectField('student', 'Aluno responsável *', opts(STUDENTS), t.student)}${selectField('professor', 'Professor supervisor *', opts(PROFS), t.professor)}${textArea('notes', 'Observações', t.notes)}</div>`, 'Gravar triagem', e => {
      e.preventDefault(); const v = values(), qq = q || byId(v.queue);
      if (!v.queixa?.trim()) return err('queixa', 'Campo obrigatório.');
      const d = data(qq), tri = { queixa: v.queixa, alertas: v.alertas, prioridade: v.prioridade, discipline: v.discipline, student: v.student, professor: v.professor, notes: v.notes, at: stamp(), by: who() };
      if (run(() => commit([aud('Triagem registrada', qq.entity_id)], [[qq, { triage: tri, history: hist(d, d.triage ? 'Triagem alterada' : 'Triagem iniciada') }, 'Em triagem']]), 'Triagem gravada.')) { closeNow(); rc.stage = 'Em triagem'; rc.sel = qq.entity_id; render(); }
    });
  }
  function forward(qid) {
    const f = byId(qid), d = data(f), t = d.triage || {};
    if (!t.queixa || !t.discipline || !t.student || !t.professor) return toast('Registre a triagem com disciplina, aluno e professor antes de encaminhar.');
    if (run(() => commit([aud('Encaminhado para atendimento', f.entity_id)], [[f, { history: hist(d, 'Encaminhado para atendimento') }, 'Aguardando atendimento']]), 'Encaminhado para atendimento.')) rc.stage = 'Aguardando atendimento';
    render();
  }

  /* ---------- Anamnese ---------- */
  const anamOf = pt => of('anamnese').find(r => data(r).patientId === pt);
  X.alert = pt => { const a = anamOf(pt); return a && data(a).alergiaKind === 'Relata' ? 'Alergia relatada · Confirmar no atendimento' : ''; };
  const isAuthor = () => can('atendimentos', 'editar');
  function authFor(r) { return of('autorizacao').find(a => data(a).recordId === r.entity_id && a.status === 'Autorizada' && data(a).versionFrom === (data(r).version || 1)); }
  X.tabs['Anamnese'] = pt => {
    if (!isClin()) return restricted();
    const r = anamOf(pt), d = r ? data(r) : {}, st = r ? r.status : 'Rascunho', auth = r && st === 'Validado' ? authFor(r) : null;
    const edit = isAuthor() && (!r || ['Rascunho', 'Devolvido'].includes(st) || auth), dis = edit ? '' : 'disabled';
    const ta = (id, label, v) => `<div class="field"><label for="${id}">${label}</label><textarea id="${id}" ${dis}>${esc(v || '')}</textarea></div>`;
    return `<h2>Anamnese ${badge(st)} <small>v${d.version || 1}</small></h2>${st === 'Validado' && !auth ? '<div class="notice">Registro validado: edição direta bloqueada. Solicite correção ao professor.</div>' : ''}${auth ? '<div class="notice">Correção autorizada para: ' + esc((data(auth).fields || []).join(', ')) + '. A autorização é de uso único.</div>' : ''}${d.reviewComment && st === 'Devolvido' ? `<div class="notice error-note">Orientação do professor: ${esc(d.reviewComment)}</div>` : ''}
      <div class="grid two-col"><section class="panel">${ta('an-queixa', 'Queixa principal', d.queixa)}${ta('an-meds', 'Medicamentos em uso', d.meds)}${ta('an-odonto', 'Histórico odontológico', d.odonto)}</section>
      <section class="panel">${ta('an-saude', 'Histórico de saúde', d.saude)}<div class="field"><label for="an-kind">Alergias — situação</label><select id="an-kind" ${dis}>${['Relata', 'Nega', 'Desconhecido'].map(k => `<option ${d.alergiaKind === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>${ta('an-alergia', 'Alergias — detalhes', d.alergia)}</section></div>
      <div class="actions" style="justify-content:flex-end"><small style="align-self:center">${r ? 'Última versão: ' + esc(d.version || 1) : 'Sem registro'}</small>${edit ? `<button class="btn secondary" data-ansave="draft" data-pt="${pt}">Salvar rascunho</button><button class="btn" data-ansave="submit" data-pt="${pt}">Enviar para revisão</button>` : st === 'Validado' && isAuthor() ? `<button class="btn secondary" data-reqfix="${r.entity_id}">Solicitar correção</button>` : ''}</div>`;
  };
  function nextVersion(rec, patch, note) {
    const d = data(rec), fix = rec.status === 'Validado', auth = fix ? authFor(rec) : null;
    if (fix && !auth) return null;
    const out = { ...patch, history: hist(d, note) };
    if (fix) { out.version = (d.version || 1) + 1; out.versions = [...(d.versions || []), { v: d.version || 1, snapshot: Object.fromEntries(Object.keys(patch).map(k => [k, d[k]])), validatedBy: d.validatedBy, validatedAt: d.validatedAt }]; out.changedFields = data(auth).fields; out.changedAt = stamp(); out.changedBy = who(); }
    return { patch: out, auth };
  }
  function saveAn(pt, mode) {
    const g = id => ($('#' + id)?.value || '').trim(), patch = { queixa: g('an-queixa'), saude: g('an-saude'), meds: g('an-meds'), odonto: g('an-odonto'), alergiaKind: g('an-kind') || 'Desconhecido', alergia: g('an-alergia') };
    if (mode === 'submit' && (!patch.queixa || !patch.saude)) return toast('Preencha queixa principal e histórico de saúde antes de enviar.');
    const r = anamOf(pt);
    if (!r) { const n = record('anamnese', 'Anamnese · ' + byId(pt).title, mode === 'submit' ? 'Em revisão' : 'Rascunho', { patientId: pt, version: 1, student: who(), professor: PROFS[0], ...patch, history: [{ at: stamp(), by: who(), action: mode === 'submit' ? 'Enviado para revisão' : 'Rascunho salvo' }] }); return run(() => commit([n, aud('Anamnese criada', n.entity_id)]), mode === 'submit' ? 'Enviado para revisão.' : 'Rascunho salvo.'); }
    const fix = r.status === 'Validado';
    if (fix && mode !== 'submit') return toast('Correção autorizada exige envio para revisão.');
    const nv = nextVersion(r, patch, mode === 'submit' ? 'Enviado para revisão' : 'Rascunho salvo'); if (!nv) return toast('Registro validado: solicite correção.');
    run(() => commit([aud('Anamnese atualizada', r.entity_id)], [[r, nv.patch, mode === 'submit' ? 'Em revisão' : r.status], ...(nv.auth ? [[nv.auth, { consumedAt: stamp(), consumedBy: who() }, 'Consumida']] : [])]), mode === 'submit' ? 'Enviado para revisão.' : 'Rascunho salvo.');
  }

  /* ---------- Evoluções ---------- */
  X.tabs['Evoluções'] = pt => {
    if (!isClin()) return restricted();
    const evs = of('evolucao').filter(r => data(r).patientId === pt).sort((a, b) => data(a).n - data(b).n), last = evs[evs.length - 1];
    const target = evs.find(e => ['Rascunho', 'Devolvido'].includes(e.status) || (e.status === 'Validado' && authFor(e)));
    const mode = target ? 'edit' : last && last.status === 'Em revisão' ? 'view' : 'new', cur = target || (mode === 'view' ? last : null), d = cur ? data(cur) : {};
    const plan = of('planoitem').filter(i => data(i).patientId === pt && !['Realizado', 'Cancelado'].includes(i.status));
    const dis = mode === 'view' || !isAuthor() ? 'disabled' : '', n = cur ? d.n : evs.length + 1;
    const procOpts = [...plan.map(i => [i.entity_id, data(i).label + (data(i).tooth ? ' · dente ' + data(i).tooth : '')]), ['livre', 'Outro procedimento (informar no registro)']];
    const lastOne = cur || last, ld = lastOne ? data(lastOne) : {};
    return `<h2>Evolução do atendimento</h2><div class="split"><section class="panel">
      <div class="field"><label>Sessão *</label><input value="Sessão ${n} – ${fmtDate(d.date || todayISO())}" disabled></div>
      <div class="field"><label for="ev-proc">Procedimento realizado *</label><select id="ev-proc" ${dis}>${procOpts.map(([v, l]) => `<option value="${esc(v)}" ${(d.planItemId || 'livre') === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      <div class="field"><label for="ev-reg">Registro da sessão *</label><textarea id="ev-reg" ${dis}>${esc(d.registro || '')}</textarea></div>
      <div class="field"><label for="ev-ori">Orientações e retorno *</label><textarea id="ev-ori" ${dis}>${esc(d.orientacoes || '')}</textarea></div>
      ${mode === 'view' ? '<div class="notice">Em revisão: conteúdo em leitura. O reenvio fica indisponível até a devolução.</div>' : ''}
      <div class="actions" style="justify-content:flex-end">${isAuthor() && mode !== 'view' ? `${cur && cur.status === 'Validado' ? '' : `<button class="btn secondary" data-evsave="draft" data-pt="${pt}" data-id="${cur?.entity_id || ''}">Salvar rascunho</button>`}<button class="btn" data-evsave="submit" data-pt="${pt}" data-id="${cur?.entity_id || ''}">Enviar para revisão</button>` : `<button class="btn" disabled>Enviar para revisão</button>`}</div></section>
      <div><section class="panel"><h3>Revisão do professor</h3>${lastOne ? badge(lastOne.status) : '<span class="tag">Sem registro</span>'}<p style="line-height:1.8"><strong>Aluno:</strong> ${esc(ld.student || '—')}<br><strong>Prof.:</strong> ${esc(ld.professor || '—')}</p>${ld.reviewComment ? `<p class="section-note">Orientação: ${esc(ld.reviewComment)}</p>` : ''}</section>
      <section class="panel"><h3>Histórico de evoluções</h3>${evs.length ? evs.map(e => { const x = data(e); return `<div class="check-row"><span>${badge(e.status)} Sessão ${x.n} – ${fmtDate(x.date)} <small>v${x.version || 1}${x.validatedBy ? ' · revisada por ' + esc(x.validatedBy) + ' em ' + esc(x.validatedAt) : ''}</small>${(x.versions || []).length ? `<br><small>Versões anteriores: ${x.versions.map(v => 'v' + v.v + ' (' + esc(v.validatedBy) + ')').join(', ')}${x.changedFields ? ' · campos alterados: ' + esc(x.changedFields.join(', ')) : ''}</small>` : ''}</span>${e.status === 'Validado' && isAuthor() && !authFor(e) ? `<button class="btn small secondary" data-reqfix="${e.entity_id}">Solicitar correção</button>` : ''}</div>`; }).join('') : '<p class="section-note">Nenhuma evolução.</p>'}</section></div></div>`;
  };
  function saveEv(pt, mode, id) {
    const g = i => ($('#' + i)?.value || '').trim(), reg = g('ev-reg'), ori = g('ev-ori'), ps = g('ev-proc') || 'livre';
    if (mode === 'submit' && (!reg || !ori)) return toast('Preencha o registro da sessão e as orientações.');
    const pi = ps !== 'livre' ? byId(ps) : null, patch = { planItemId: pi ? ps : '', procLabel: pi ? data(pi).label : 'Outro procedimento', registro: reg, orientacoes: ori };
    const r = id ? byId(id) : null;
    if (!r) {
      const n = of('evolucao').filter(e => data(e).patientId === pt).length + 1, a = of('agendamento').find(x => data(x).patientId === pt && x.status === 'Em atendimento');
      const rec = record('evolucao', 'Evolução · ' + byId(pt).title + ' · Sessão ' + n, mode === 'submit' ? 'Em revisão' : 'Rascunho', { patientId: pt, n, date: todayISO(), student: who(), professor: PROFS[0], discipline: 'Dentística', turma: TURMAS[0], version: 1, appointmentId: a?.entity_id || '', ...patch, history: [{ at: stamp(), by: who(), action: mode === 'submit' ? 'Enviado para revisão' : 'Rascunho salvo' }] });
      return run(() => commit([rec, aud('Evolução criada', rec.entity_id)]), mode === 'submit' ? 'Evolução enviada para revisão.' : 'Rascunho salvo.');
    }
    if (r.status === 'Validado' && mode !== 'submit') return toast('Correção autorizada exige envio para revisão.');
    const nv = nextVersion(r, patch, mode === 'submit' ? 'Enviado para revisão' : 'Rascunho salvo'); if (!nv) return toast('Registro validado: solicite correção.');
    run(() => commit([aud('Evolução atualizada', r.entity_id)], [[r, nv.patch, mode === 'submit' ? 'Em revisão' : r.status], ...(nv.auth ? [[nv.auth, { consumedAt: stamp(), consumedBy: who() }, 'Consumida']] : [])]), mode === 'submit' ? 'Enviado para revisão.' : 'Rascunho salvo.');
  }

  /* ---------- Correção autorizada ---------- */
  function reqFix(id) {
    const r = byId(id), d = data(r), isAn = r.entity_type === 'anamnese', fields = isAn ? ['Queixa principal', 'Histórico de saúde', 'Medicamentos', 'Alergias', 'Histórico odontológico'] : ['Procedimento realizado', 'Registro da sessão', 'Orientações e retorno'];
    if (of('autorizacao').some(a => data(a).recordId === id && ['Solicitada', 'Autorizada'].includes(a.status) && data(a).versionFrom === (d.version || 1))) return toast('Já existe pedido de correção em andamento para esta versão.');
    openModal('Solicitar correção', `${textArea('reason', 'Motivo *')}<div class="field span-2"><label>Campos que precisam de ajuste *</label>${fields.map((f, i) => `<label class="check-row"><span><input type="checkbox" name="f_${i}" value="${f}"> ${f}</span></label>`).join('')}<span class="error" id="err-fields"></span></div>`, 'Enviar pedido', e => {
      e.preventDefault(); const v = values(), chosen = fields.filter((f, i) => ('f_' + i) in v);
      if (!v.reason?.trim()) return err('reason', 'Campo obrigatório.'); if (!chosen.length) return err('fields', 'Selecione ao menos um campo.');
      const a = record('autorizacao', 'Correção · ' + r.title, 'Solicitada', { recordId: id, recordType: r.entity_type, patientId: d.patientId, versionFrom: d.version || 1, requestedBy: who(), requestedAt: stamp(), reason: v.reason, fields: chosen, supervisor: d.professor, student: d.student, discipline: d.discipline, turma: d.turma, history: [] });
      if (run(() => commit([a, aud('Correção solicitada', id, v.reason)]), 'Pedido enviado ao supervisor.')) closeNow();
    });
  }
  function authorizeFlow(id) {
    const a = byId(id), d = data(a);
    openModal('Autorizar correção', `<div class="notice">Reautentique com a sua conta de supervisor. Demonstração: <code>ana.ribeiro</code> ou <code>carlos.mendes</code> / senha <code>demo123</code>. A senha não é gravada.</div>${field('login', 'Login *')}${field('pass', 'Senha *', 'password')}`, 'Autorizar', e => {
      e.preventDefault(); const v = values();
      if (LOGINS[v.login] === undefined || v.pass !== DEMO_PASS) return err('pass', 'Credenciais inválidas.');
      if (LOGINS[v.login] !== d.supervisor) return err('login', 'A conta não corresponde ao supervisor vinculado (' + d.supervisor + ').');
      const fresh = byId(d.recordId); if ((data(fresh).version || 1) !== d.versionFrom || fresh.status !== 'Validado') return err('login', 'Versão desatualizada: recarregue o registro.');
      if (a.status !== 'Solicitada') return err('login', 'Esta autorização já foi usada ou decidida.');
      if (run(() => commit([aud('Correção autorizada', a.entity_id)], [[a, { authorizedBy: LOGINS[v.login], authorizedAt: stamp() }, 'Autorizada']]), 'Correção autorizada (uso único).')) { closeNow(); sv.sel = ''; render(); }
    });
  }
  function refuseFix(id) {
    const a = byId(id), c = ($('#sv-comment')?.value || '').trim();
    if (!c) return toast('Informe o motivo da recusa no campo de comentário.');
    run(() => commit([aud('Correção recusada', id, c)], [[a, { refusedBy: who(), refusedAt: stamp(), refusal: c }, 'Recusada']]), 'Pedido recusado.');
  }

  /* ---------- Supervisão acadêmica ---------- */
  const sv = { disc: '', turma: '', status: 'Aguardando revisão', sel: '' };
  function svItems() {
    const out = [];
    [...list('evolucao'), ...list('anamnese')].forEach(r => { const d = data(r); out.push({ r, d, id: r.entity_id, st: r.status === 'Em revisão' ? 'Aguardando revisão' : r.status, label: r.entity_type === 'anamnese' ? 'Anamnese' : 'Evolução' }); });
    list('autorizacao').filter(a => a.status === 'Solicitada').forEach(a => out.push({ r: a, d: data(a), id: a.entity_id, st: 'Aguardando revisão', label: 'Correção solicitada' }));
    return out.filter(i => (!sv.disc || i.d.discipline === sv.disc) && (!sv.turma || i.d.turma === sv.turma) && (sv.status === 'Todos' || i.st === sv.status));
  }
  function supervision() {
    const items = svItems(), cur = items.find(i => i.id === sv.sel) || items[0], pAbbr = i => { const p = byId(i.d.patientId); return [p?.title, data(p).prontuario]; };
    const opt = (id, label, arr, v, all) => `<div class="field"><label for="${id}">${label}</label><select id="${id}"><option value="${all[0]}">${all[1]}</option>${arr.map(x => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('')}</select></div>`;
    let right = '<section class="panel"><div class="empty">Nenhum registro para revisar com os filtros atuais.</div></section>';
    if (cur) {
      const [pn, pr] = pAbbr(cur), d = cur.d, canRev = can('supervisao', 'validar') && profile !== 'Aluno ou estagiário', ver = d.version || 1;
      let body = '', acts = '';
      if (cur.label === 'Correção solicitada') {
        body = `<div class="ro"><strong>Pedido de ${esc(d.requestedBy)} em ${esc(d.requestedAt)}</strong>\nVersão de origem: v${d.versionFrom}\nMotivo: ${esc(d.reason)}\nCampos: ${esc((d.fields || []).join(', '))}</div>`;
        acts = canRev ? `<button class="btn secondary" data-refuse="${cur.id}">Recusar</button><button class="btn" data-authorize="${cur.id}">Autorizar correção</button>` : '';
      } else {
        body = cur.label === 'Anamnese' ? `<div class="ro">Queixa: ${esc(d.queixa)}\nSaúde: ${esc(d.saude)}\nMedicamentos: ${esc(d.meds)}\nAlergias (${esc(d.alergiaKind)}): ${esc(d.alergia)}\nHistórico odontológico: ${esc(d.odonto)}</div>` : `<div class="ro"><strong>${esc(d.procLabel)}</strong>\n${esc(d.registro)}\n\nOrientações: ${esc(d.orientacoes)}</div>`;
        acts = canRev && cur.r.status === 'Em revisão' ? `<button class="btn secondary" data-svreturn="${cur.id}" data-ver="${ver}">Solicitar correção</button><button class="btn" data-svvalidate="${cur.id}" data-ver="${ver}">✓ Validar registro</button>` : cur.r.status === 'Validado' ? `<span class="section-note">Validado por ${esc(d.validatedBy)} em ${esc(d.validatedAt)}.</span>` : '';
      }
      right = `<section class="panel"><div class="crumb">Pacientes / ${esc(pn)}</div><h2>${esc(pn)} <small>${esc(pr)}</small></h2><div class="grid two-col" style="grid-template-columns:repeat(3,1fr)"><div><small>Aluno</small><br><strong>${esc(d.student)}</strong></div><div><small>Disciplina</small><br><strong>${esc(d.discipline)}</strong></div><div><small>Data / versão</small><br><strong>${d.date ? fmtDate(d.date) : fmtDate(d.requestedAt)} · v${ver}</strong></div></div>
        <h3 style="margin-top:16px">${esc(cur.label)} (somente leitura)</h3>${body}
        ${canRev && cur.label !== 'Correção solicitada' && cur.r.status === 'Em revisão' || cur.label === 'Correção solicitada' ? `<div class="field" style="margin-top:12px"><label for="sv-comment">Comentário para o aluno</label><textarea id="sv-comment" placeholder="Digite sua orientação, apontamentos ou ajustes necessários…"></textarea></div>` : ''}
        <div class="actions" style="justify-content:flex-end;margin-top:12px">${can('pacientes') ? `<button class="btn secondary" data-agficha="${d.patientId}">Abrir ficha</button>` : ''}${acts}</div>
        <h3>Histórico de revisões</h3>${(d.history || []).length ? d.history.map(h => `<p class="section-note">🕘 ${esc(h.at)} · ${esc(h.by)} — ${esc(h.action)}</p>`).join('') : '<p class="section-note">Sem histórico.</p>'}</section>`;
    }
    return heading('Supervisão acadêmica', 'Acompanhe e revise os registros clínicos realizados pelos alunos.') +
      `<section class="panel"><div class="toolbar">${opt('sv-disc', 'Disciplina', DISC, sv.disc, ['', 'Todas as disciplinas'])}${opt('sv-turma', 'Turma', TURMAS, sv.turma, ['', 'Todas as turmas'])}<div class="field"><label for="sv-status">Status</label><select id="sv-status">${['Aguardando revisão', 'Devolvido', 'Validado', 'Rascunho', 'Todos'].map(s => `<option ${s === sv.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div></div></section>
      <div class="split q"><section class="panel"><h3>Fila de revisões (${items.length})</h3>${items.map(i => { const [pn, pr] = pAbbr(i); return `<button class="q-item ${cur && cur.id === i.id ? 'sel' : ''}" data-svsel="${i.id}"><span><strong>${esc(pn)}</strong><br><small>${esc(pr)} · ${esc(i.d.discipline || '')} · ${i.label}</small></span>${badge(i.st)}</button>`; }).join('') || '<div class="empty">Fila vazia.</div>'}</section>${right}</div>`;
  }
  function svAct(id, ver, kind) {
    const r = byId(id), d = data(r), c = ($('#sv-comment')?.value || '').trim();
    if ((d.version || 1) !== +ver || r.status !== 'Em revisão') { toast('Registro atualizado por outra ação. Recarregue o registro antes de revisar.'); return render(); }
    if (kind === 'return' && !c) return toast('Informe a justificativa para devolver o registro.');
    const patch = { reviewComment: c, history: hist(d, kind === 'return' ? 'Devolvido para ajustes' : 'Validado', c) }, ups = [];
    if (kind === 'validate') {
      Object.assign(patch, { validatedBy: who(), validatedAt: stamp() });
      if (d.planItemId && byId(d.planItemId)) ups.push([byId(d.planItemId), { executionId: id, executedAt: stamp() }, 'Realizado']);
    }
    run(() => commit([aud(kind === 'return' ? 'Registro devolvido' : 'Registro validado', id, c)], [[r, patch, kind === 'return' ? 'Devolvido' : 'Validado'], ...ups]), kind === 'return' ? 'Registro devolvido ao aluno.' : 'Registro validado e bloqueado para edição direta.');
  }
  const _ml = moduleList;
  moduleList = m => m === 'agenda' ? agendaView() : m === 'supervisao' ? supervision() : _ml(m);

  /* ---------- Documentos ---------- */
  X.tabs['Documentos'] = pt => {
    if (!isClin()) return restricted();
    const ds = of('documento').filter(r => data(r).patientId === pt);
    return `<section class="panel"><div class="panel-head"><h2>Documentos</h2>${isAuthor() ? '<button class="btn" data-prepterm="1">Preparar termo</button>' : ''}</div>${ds.length ? `<div class="table-wrap"><table><thead><tr><th>Documento</th><th>Versão do plano</th><th>Autor</th><th>Data</th><th>Status</th><th></th></tr></thead><tbody>${ds.map(r => { const d = data(r); return `<tr><td>${esc(d.type)}</td><td>${esc(d.planVersion)}</td><td>${esc(d.author)}</td><td>${esc(d.at)}</td><td>${badge(r.status)}${d.acceptedBy ? '<br><small>' + esc(d.acceptedBy) + ' · ' + esc(d.acceptMethod) + ' · ' + esc(d.acceptedAt) + '</small>' : ''}</td><td class="actions"><button class="btn small secondary" data-printdoc="${r.entity_id}">Visualizar / imprimir</button>${r.status === 'Preparado' && isAuthor() ? `<button class="btn small" data-accept="${r.entity_id}">Registrar aceite</button>` : ''}</td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty">Nenhum documento preparado.</div>'}</section>`;
  };
  function prepTerm() {
    const pt = activeDetail, its = of('planoitem').filter(i => data(i).patientId === pt && i.status !== 'Cancelado');
    if (!its.length) return toast('Adicione procedimentos ao plano antes de preparar o termo.');
    const ver = 'Plano v' + its.length + ' (' + its.map(i => i.entity_id.slice(-4)).join('').slice(0, 12) + ')';
    if (of('documento').some(d => data(d).patientId === pt && data(d).planVersion === ver && d.status !== 'Cancelado')) return toast('Já existe termo para esta versão do plano.');
    const doc = record('documento', 'Termo de consentimento · ' + byId(pt).title, 'Preparado', { patientId: pt, type: 'Termo de consentimento informado', planVersion: ver, items: its.map(i => data(i).label + (data(i).tooth ? ' (dente ' + data(i).tooth + ')' : '')), author: who(), at: stamp() });
    run(() => commit([doc, aud('Termo preparado', doc.entity_id)]), 'Termo preparado e vinculado à versão do plano.');
  }
  function acceptFlow(id) {
    openModal('Registrar aceite', `${field('by', 'Paciente ou responsável *')}${selectField('method', 'Método', [['Assinatura no termo impresso', 'Assinatura no termo impresso'], ['Confirmação verbal registrada', 'Confirmação verbal registrada']])}`, 'Registrar', e => {
      e.preventDefault(); const v = values(); if (!v.by?.trim()) return err('by', 'Campo obrigatório.');
      if (run(() => commit([aud('Aceite do termo', id)], [[byId(id), { acceptedBy: v.by, acceptMethod: v.method, acceptedAt: stamp() }, 'Aceito']]), 'Aceite registrado.')) closeNow();
    });
  }
  function printDoc(id) {
    const r = byId(id), d = data(r), p = byId(d.patientId), w = window.open('', '_blank'); if (!w) return toast('Libere pop-ups para imprimir.');
    w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(d.type)}</title><body style="font-family:Inter,sans-serif;padding:32px;line-height:1.6"><h1>${esc(d.type)}</h1><p>Ambiente de demonstração · modelo fictício, sem validade jurídica</p><p>Paciente: ${esc(p?.title)} · Versão: ${esc(d.planVersion)}</p><ul>${d.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul><p>Declaro estar ciente dos procedimentos acima.</p>${d.acceptedBy ? `<p>Aceite: ${esc(d.acceptedBy)} · ${esc(d.acceptMethod)} · ${esc(d.acceptedAt)}</p>` : '<p>Assinatura: ______________________</p>'}`);
    w.document.close(); w.print();
  }

  /* ---------- Painel: Testar o sistema + documentação ---------- */
  const TESTS = [['Agenda e triagem', 'Recepção', 'agenda', null, 'Resumo'], ['Anamnese (alerta de alergia)', 'Cirurgião-dentista', 'pacientes', 'P-001', 'Anamnese'], ['Odontograma e plano (dente 36)', 'Aluno ou estagiário', 'pacientes', 'P-001', 'Odontograma'], ['Revisão acadêmica', 'Professor ou supervisor', 'supervisao', null, 'Resumo'], ['Orçamento parcial', 'Financeiro', 'pacientes', 'P-001', 'Orçamentos'], ['Pagamento e estorno', 'Financeiro', 'pacientes', 'P-001', 'Cobranças']];
  const _dash = dashboard;
  dashboard = () => _dash() + `<section class="panel"><h2>Testar o sistema</h2><p class="section-note">Atalhos para os cenários, com o perfil indicado.</p><div class="actions">${TESTS.map((t, i) => `<button class="btn secondary small" data-testgo="${i}">${t[0]} · ${t[1]}</button>`).join('')}</div></section>`;
  const _doc = documentation;
  documentation = () => _doc() + `<section class="panel"><h2>Atualização: modelo, estados e testes (Odontologia)</h2><p><strong>Entidades novas:</strong> planoitem, achado, fila/triagem, anamnese, evolucao (versionada), autorizacao (uso único), documento, estorno, além de agendamento com box, disciplina, turma, aluno e professor.</p><p><strong>Estados:</strong> registro clínico Rascunho → Em revisão → Devolvido/Validado; correção: Solicitada → Autorizada → Consumida (ou Recusada); fila: Aguardando triagem → Em triagem → Aguardando atendimento → Em atendimento → Concluído; plano: Planejado → Aprovado → Realizado.</p><p><strong>Cálculos:</strong> valores em centavos; recebido líquido = recebimentos − estornos; saldo = total − recebido líquido.</p><p><strong>Migração:</strong> chave antiga <code>clinicas-positivo:odonto</code> copiada para backup e para <code>clinicas-positivo:v2</code>, com referência clínica + ID antigo; reexecutar não duplica.</p><p><strong>Permissões:</strong> simuladas no navegador; em produção validar no servidor. Reautenticação docente usa credenciais fictícias.</p></section>`;

  /* ---------- Eventos ---------- */
  document.addEventListener('click', e => { // captura: reagendamento com box/aluno/professor
    const t = e.target.closest('button'); if (!t || t.dataset.act !== 'reschedule') return;
    const r = byId(t.dataset.id); if (r && r.entity_type === 'agendamento') { e.stopPropagation(); rescheduleFlow(r); }
  }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return; const s = t.dataset;
    if (s.agsel) { ag.sel = s.agsel; render(); }
    else if (s.agmode) { ag.mode = s.agmode; render(); }
    else if (s.agnav) { ag.date = addDays(ag.date, +s.agnav * (ag.mode === 'dia' ? 1 : 7)); render(); }
    else if (s.agnew) scheduleFlow();
    else if (s.agarrive) arrive(byId(s.agarrive));
    else if (s.agstart) startEnc(s.agstart);
    else if (s.agfinish) finishEnc(byId(s.agfinish));
    else if (s.agabsent) { const a = byId(s.agabsent); run(() => commit([aud('Falta registrada', a.entity_id)], [[a, {}, 'Falta']]), 'Falta registrada.'); }
    else if (s.agficha) { if (!can('pacientes')) return toast('Acesso restrito.'); patientTab = 'Resumo'; navigate('pacientes', s.agficha); }
    else if (s.rcstage) { rc.stage = s.rcstage; rc.sel = ''; render(); }
    else if (s.rcsel) { rc.sel = s.rcsel; render(); }
    else if (s.qarrive) arriveFlow();
    else if (s.triage !== undefined) triageFlow(s.triage);
    else if (s.forward) forward(s.forward);
    else if (s.qstart) startEnc('', s.qstart);
    else if (s.ansave) saveAn(s.pt, s.ansave);
    else if (s.evsave) saveEv(s.pt, s.evsave, s.id);
    else if (s.reqfix) reqFix(s.reqfix);
    else if (s.authorize) authorizeFlow(s.authorize);
    else if (s.refuse) refuseFix(s.refuse);
    else if (s.svsel) { sv.sel = s.svsel; render(); }
    else if (s.svvalidate) svAct(s.svvalidate, s.ver, 'validate');
    else if (s.svreturn) svAct(s.svreturn, s.ver, 'return');
    else if (s.prepterm) prepTerm();
    else if (s.accept) acceptFlow(s.accept);
    else if (s.printdoc) printDoc(s.printdoc);
    else if (s.testgo !== undefined) { const x = TESTS[+s.testgo]; profile = x[1]; patientTab = x[4]; navigate(x[2], x[3]); }
  });
  document.addEventListener('change', e => {
    const m = { 'ag-disc': 'disc', 'ag-prof': 'prof', 'ag-student': 'student', 'ag-box': 'box' }[e.target.id];
    if (m) { ag[m] = e.target.value; render(); }
    const n = { 'sv-disc': 'disc', 'sv-turma': 'turma', 'sv-status': 'status' }[e.target.id];
    if (n) { sv[n] = e.target.value; sv.sel = ''; render(); }
  });
  Object.assign(X, { ag, rc, sv, svItems, conflict, commit, run, who, aud, closeNow, ACC, DISC, STUDENTS, PROFS, BOXES, TURMAS });
  render();
})();
