/* Extensão 3: encaminhamentos entre clínicas (base compartilhada) — Pendente → Aceito → Agendado → Concluído. */
(function () {
  'use strict';
  const X = window.OdontoX, SH = ClinicasData.shared(), ME = 'Odontologia', OTHERS = ['Fisioterapia', 'Nutrição', 'Psicologia'];
  const ALLOW = { 'Pendente': ['Aceito', 'Recusado', 'Cancelado'], 'Aceito': ['Agendado', 'Cancelado'], 'Agendado': ['Concluído', 'Cancelado'] };
  const OPEN = Object.keys(ALLOW), pd = r => JSON.parse(r.payload || '{}');
  const rows = () => SH.load().filter(r => r.entity_type === 'encaminhamento');
  const ref = id => rows().find(r => r.entity_id === id);
  const note = (d, action, why) => [...(d.history || []), { at: stamp(), by: X.who(), action: action + (why ? ': ' + why : '') }];

  function mut(sh, id, status, patch, action, why) {
    const i = sh.findIndex(x => x.entity_id === id), d = pd(sh[i]);
    sh[i] = { ...sh[i], status, updated_at: new Date().toISOString(), payload: JSON.stringify({ ...d, ...patch, history: note(d, action, why) }) };
  }
  // Uma única escrita: encaminhamento compartilhado + registros locais da Odontologia.
  function tx(fnShared, fnLocal) {
    const sh = SH.load(), loc = backendRecords.slice();
    if (fnShared) fnShared(sh); if (fnLocal) fnLocal(loc);
    const ok = ClinicasData.open('odonto').persist(loc, sh); if (ok) backendRecords = loc; return ok;
  }
  const can2 = (r, to) => (ALLOW[r.status] || []).includes(to);

  X.tabs['Encaminhamentos'] = pt => {
    if (!can('pacientes')) return '<div class="empty"><strong>Acesso restrito</strong></div>';
    const rs = rows().filter(r => pd(r).patientId === pt && (pd(r).from === ME || pd(r).to === ME));
    const edit = can('pacientes', 'editar');
    const acts = r => { const d = pd(r), inc = d.to === ME, b = (k, l, c = 'secondary') => `<button class="btn small ${c}" data-${k}="${r.entity_id}">${l}</button>`; let o = '';
      if (inc && r.status === 'Pendente') o += b('rfaccept', 'Aceitar', '') + b('rfrefuse', 'Recusar');
      if (inc && r.status === 'Aceito') o += b('rfsched', 'Agendar', '');
      if (inc && r.status === 'Agendado') o += b('rfdone', 'Concluir', '');
      if (OPEN.includes(r.status) && r.status !== 'Pendente' || (r.status === 'Pendente' && d.from === ME)) o += b('rfcancel', 'Cancelar');
      return edit ? o : ''; };
    return `<section class="panel"><div class="panel-head"><h2>Encaminhamentos</h2>${edit ? '<button class="btn" data-rfnew="1">+ Novo encaminhamento</button>' : ''}</div>
      ${rs.length ? `<div class="table-wrap"><table><thead><tr><th>Origem → destino</th><th>Autor</th><th>Data</th><th>Motivo</th><th>Situação</th><th></th></tr></thead><tbody>${rs.map(r => { const d = pd(r); return `<tr><td>${esc(d.from)} → ${esc(d.to)}</td><td>${esc(d.author)}</td><td>${esc(d.at)}</td><td>${esc(d.motivo)}${d.reason ? '<br><small>Motivo: ' + esc(d.reason) + '</small>' : ''}</td><td>${badge(r.status)}${d.destEncounterId ? '<br><small>Atend. ' + esc(d.destEncounterId) + '</small>' : ''}</td><td class="actions">${acts(r)}</td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty">Nenhum encaminhamento para este paciente.</div>'}
      <p class="section-note">O destino usa o mesmo cadastro (ID global) do paciente. Só o motivo resumido é compartilhado; o prontuário continua sujeito às permissões da origem.</p></section>`;
  };

  function newFlow() {
    const pt = activeDetail;
    openModal('Novo encaminhamento', `${selectField('dir', 'Direção', [['out', 'Enviar da Odontologia para outra clínica'], ['in', 'Simular recebimento de outra clínica (demonstração)']])}${selectField('clinic', 'Outra clínica *', OTHERS.map(c => [c, c]))}${textArea('motivo', 'Motivo resumido *')}`, 'Criar encaminhamento', e => {
      e.preventDefault(); const v = values();
      if (!v.motivo?.trim()) return err('motivo', 'Campo obrigatório.');
      const from = v.dir === 'out' ? ME : v.clinic, to = v.dir === 'out' ? v.clinic : ME;
      if (rows().some(r => pd(r).patientId === pt && pd(r).from === from && pd(r).to === to && OPEN.includes(r.status))) return err('motivo', 'Já existe encaminhamento em aberto para este destino.');
      const r = { ...record('encaminhamento', 'Encaminhamento · ' + byId(pt).title, 'Pendente', { patientId: pt, from, to, author: X.who(), at: stamp(), motivo: v.motivo, history: [{ at: stamp(), by: X.who(), action: 'Criado' }] }) }; r.__backendId = r.entity_id + '-' + Date.now();
      if (X.run(() => tx(sh => sh.push(r), loc => loc.push(X.aud('Encaminhamento criado', r.entity_id))), 'Encaminhamento criado.')) X.closeNow();
    });
  }
  function reasonFlow(id, status, title) {
    openModal(title, textArea('reason', 'Motivo *'), 'Confirmar', e => {
      e.preventDefault(); const v = values(), r = ref(id);
      if (!v.reason?.trim()) return err('reason', 'Campo obrigatório.');
      if (!r || !can2(r, status)) return err('reason', 'Transição não permitida a partir de ' + (r?.status || '—') + '.');
      if (X.run(() => tx(sh => mut(sh, id, status, { reason: v.reason }, title, v.reason), loc => loc.push(X.aud(title, id, v.reason))), title + ' registrado.')) X.closeNow();
    });
  }
  function accept(id) { const r = ref(id); if (!r || !can2(r, 'Aceito')) return toast('Transição não permitida.'); X.run(() => tx(sh => mut(sh, id, 'Aceito', {}, 'Aceito'), loc => loc.push(X.aud('Encaminhamento aceito', id))), 'Encaminhamento aceito.'); }
  function done(id) { const r = ref(id); if (!r || !can2(r, 'Concluído')) return toast('Transição não permitida.'); X.run(() => tx(sh => mut(sh, id, 'Concluído', {}, 'Concluído'), loc => loc.push(X.aud('Encaminhamento concluído', id))), 'Encaminhamento concluído.'); }
  function schedFlow(id) {
    const o = a => a.map(x => [x, x]);
    openModal('Agendar encaminhamento', `<div class="form-grid">${selectField('discipline', 'Disciplina *', o(X.DISC))}${selectField('box', 'Box *', o(Object.keys(X.BOXES)))}${selectField('student', 'Aluno *', o(X.STUDENTS))}${selectField('professor', 'Professor *', o(X.PROFS))}${field('date', 'Data *', 'date', '2026-05-25')}${field('time', 'Início *', 'time', '14:00')}${field('end', 'Término *', 'time', '14:50')}</div><span class="error" id="err-time"></span>`, 'Agendar', e => {
      e.preventDefault(); const v = values(), r = ref(id); if (!r || !can2(r, 'Agendado')) return err('time', 'Transição não permitida.');
      const d = pd(r), m = X.conflict({ ...v, patientId: d.patientId }); if (m) return err('time', m);
      const ag = record('agendamento', 'Consulta · ' + byId(d.patientId).title, 'Agendado', { patientId: d.patientId, box: v.box, room: X.BOXES[v.box], professional: v.professor, professor: v.professor, student: v.student, discipline: v.discipline, turma: X.TURMAS[0], date: v.date, time: v.time, end: v.end, service: v.discipline, referralId: id }); ag.__backendId = ag.entity_id + '-' + Date.now();
      if (X.run(() => tx(sh => mut(sh, id, 'Agendado', { destEncounterId: ag.entity_id }, 'Agendado'), loc => loc.push(ag, X.aud('Encaminhamento agendado', id))), 'Agendado no box ' + v.box + '.')) X.closeNow();
    });
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return; const s = t.dataset;
    if (s.rfnew) newFlow(); else if (s.rfaccept) accept(s.rfaccept); else if (s.rfrefuse) reasonFlow(s.rfrefuse, 'Recusado', 'Recusa');
    else if (s.rfcancel) reasonFlow(s.rfcancel, 'Cancelado', 'Cancelamento'); else if (s.rfsched) schedFlow(s.rfsched); else if (s.rfdone) done(s.rfdone);
  });
  render();
})();
