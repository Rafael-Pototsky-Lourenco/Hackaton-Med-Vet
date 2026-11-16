/* Extensão da Clínica Odontológica: ficha com abas, odontograma, plano, orçamento, cobrança, recebimento e estorno. */
(function () {
  'use strict';
  entityModule.planoitem = 'atendimentos'; entityModule.achado = 'atendimentos'; entityModule.estorno = 'financeiro';
  Object.assign(entityNames, { planoitem: 'Item do plano', achado: 'Achado', estorno: 'Estorno' });

  const CATALOG = [['PR-01', 'Restauração em resina composta', 30000], ['PR-02', 'Raspagem supragengival e polimento', 12000], ['PR-03', 'Exodontia simples', 15000], ['PR-04', 'Tratamento endodôntico', 45000], ['PR-05', 'Aplicação de selante', 6000]];
  const FACES = ['Oclusal', 'Mesial', 'Distal', 'Vestibular', 'Lingual/Palatina'];
  const FINDINGS = ['Cárie', 'Fratura', 'Restauração insatisfatória', 'Mancha branca', 'Mobilidade'];
  const QUADS = {
    'Permanente': [[18, 17, 16, 15, 14, 13, 12, 11], [21, 22, 23, 24, 25, 26, 27, 28], [48, 47, 46, 45, 44, 43, 42, 41], [31, 32, 33, 34, 35, 36, 37, 38]],
    'Decídua': [[55, 54, 53, 52, 51], [61, 62, 63, 64, 65], [85, 84, 83, 82, 81], [71, 72, 73, 74, 75]]
  };
  let od = { tooth: '', face: 'Oclusal', dent: 'Permanente', proc: CATALOG[0][0], finding: '' }, busy = false;
  const sum = a => a.reduce((s, x) => s + x, 0);
  const restricted = () => '<div class="empty"><strong>Acesso restrito</strong><br>Este conteúdo é visível apenas à equipe autorizada.</div>';
  const items = pt => of('planoitem').filter(r => data(r).patientId === pt && r.status !== 'Cancelado');
  const aud = (action, ent, reason) => record('auditoria', action + ' · ' + ent, 'Registrado', { action, entity: ent, user: profile, clinic: 'Odontologia', at: stamp(), reason: reason || '' });
  const closeModalNow = () => { modalDirty = false; $('#modal-root').innerHTML = ''; };

  const _vis = visible;
  visible = function (r) {
    if (['planoitem', 'achado'].includes(r.entity_type)) {
      if (!can('atendimentos')) return false;
      return profile !== 'Aluno ou estagiário' || data(r).patientId === 'P-001';
    }
    if (r.entity_type === 'estorno') return can('financeiro');
    return _vis(r);
  };

  // Gravação atômica: valida tudo antes e persiste o conjunto de uma vez.
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
    if (busy) return false;
    busy = true;
    try { if (!fn()) { toast('Não foi possível gravar. Os dados preenchidos foram mantidos; tente novamente.'); return false; } toast(msg); render(); return true; }
    finally { busy = false; }
  }

  /* ---------- Ficha do paciente ---------- */
  function odontogram(pt) {
    if (!can('atendimentos')) return restricted();
    const its = items(pt), sel = String(od.tooth);
    const st = t => { const x = its.filter(i => String(data(i).tooth) === String(t)); return x.some(i => i.status === 'Realizado') ? 'done' : x.length ? 'planned' : ''; };
    const SHAPE = { inc: 'M9 3 Q16 0 23 3 L21 17 Q20 27 16 27 Q12 27 11 17Z', can: 'M16 0 Q23 6 22 14 L20 26 Q16 29 12 26 L10 14 Q9 6 16 0Z', pre: 'M7 5 Q16 1 25 5 L23 16 Q22 26 16 26 Q10 26 9 16Z', mol: 'M4 6 Q4 1 10 2 Q16 5 22 2 Q28 1 28 6 L27 16 Q26 27 22 27 Q19 20 16 20 Q13 20 10 27 Q6 27 5 16Z' };
    const kind = t => { const n = t % 10, dec = t > 50; return n <= 2 ? 'inc' : n === 3 ? 'can' : dec ? 'mol' : n <= 5 ? 'pre' : 'mol'; };
    const btn = (t, upper) => `<button type="button" class="tooth ${st(t)} ${String(t) === sel ? 'sel' : ''}" data-tooth="${t}" aria-pressed="${String(t) === sel}" aria-label="Dente ${t}">${upper ? `<b>${t}</b>` : ''}<svg viewBox="0 0 32 30" width="30" height="28" aria-hidden="true"><path d="${SHAPE[kind(t)]}"/></svg>${upper ? '' : `<b>${t}</b>`}</button>`;
    const q = QUADS[od.dent], row = (a, b, up) => `<div class="arch"><div>${a.map(t => btn(t, up)).join('')}</div><i class="sep"></i><div>${b.map(t => btn(t, up)).join('')}</div></div>`;
    const found = sel ? of('achado').filter(a => data(a).patientId === pt && String(data(a).tooth) === sel) : [];
    const canEdit = can('atendimentos', 'editar');
    return `<div class="grid two-col" style="grid-template-columns:2fr 1fr">
      <section class="panel"><h2>Odontograma</h2>
        <div class="actions">${['Permanente', 'Decídua'].map(d => `<button type="button" class="btn small secondary chip-btn" data-dent="${d}" aria-pressed="${od.dent === d}">${d}</button>`).join('')}</div>
        ${row(q[0], q[1], true)}${row(q[2], q[3], false)}
        <div class="legend"><span>▢ Sem registro</span><span style="color:#916012">■ Planejado/aprovado</span><span style="color:#136c4c">■ Realizado</span><span style="color:#13789a">■ Dente ativo</span></div>
      </section>
      <section class="panel"><h2>${sel ? 'Dente ' + esc(sel) : 'Nenhum dente selecionado'}</h2>
        ${sel ? `<strong>Superfície</strong><div class="actions" style="margin:8px 0 14px">${FACES.map(f => `<button type="button" class="btn small secondary chip-btn" data-face="${f}" aria-pressed="${od.face === f}">${f}</button>`).join('')}</div>
        <div class="field"><label for="od-finding">Achado clínico</label><select id="od-finding"><option value="">Selecione o achado clínico…</option>${FINDINGS.map(f => `<option ${od.finding === f ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
        <div class="field" style="margin-top:10px"><label for="od-proc">Procedimento do catálogo</label><select id="od-proc">${CATALOG.map(c => `<option value="${c[0]}" ${od.proc === c[0] ? 'selected' : ''}>${esc(c[1])} · ${money(c[2])}</option>`).join('')}</select></div>
        ${found.length ? `<p class="section-note">Achados: ${found.map(a => esc(data(a).desc) + ' (' + esc(data(a).face) + ')').join('; ')}</p>` : ''}
        ${canEdit ? '<button type="button" class="btn" style="width:100%;margin-top:14px" data-addplan="1">+ Adicionar ao plano</button>' : ''}` : '<p class="section-note">Selecione um dente no odontograma para escolher a face e adicionar ao plano.</p>'}
        ${canEdit ? '<button type="button" class="btn secondary small" style="margin-top:10px" data-addplan="general">Procedimento geral (sem dente)</button>' : ''}
      </section></div>`;
  }

  function planTab(pt) {
    if (!can('atendimentos')) return restricted();
    const its = items(pt);
    const rows = its.map(i => { const d = data(i); return `<tr><td>${esc(d.stage || 'Procedimentos')}</td><td>${esc(d.label)}</td><td>${esc(d.tooth || '—')}</td><td>${esc(d.tooth ? d.face : '—')}</td><td>${d.qty}</td><td>${money(d.priceCents * d.qty)}</td><td>${badge(i.status)}${d.budgetId ? ' <small>Orç. ' + esc(d.budgetId) + '</small>' : ''}</td></tr>`; }).join('');
    return `<section class="panel"><div class="panel-head"><h2>Plano de tratamento</h2><div class="actions">
      ${can('atendimentos', 'editar') ? '<button class="btn secondary" data-tab="Odontograma">+ Adicionar procedimento</button>' : ''}
      ${can('atendimentos', 'editar') ? '<button class="btn secondary" data-prepterm="1">Preparar termo</button>' : ''}${can('orcamentos', 'cadastrar') ? '<button class="btn" data-genbudget="1">Gerar orçamento</button>' : ''}</div></div>
      ${its.length ? `<div class="table-wrap"><table><thead><tr><th>Etapa</th><th>Procedimento</th><th>Dente</th><th>Face</th><th>Qtd</th><th>Valor</th><th>Situação</th></tr></thead><tbody>${rows}</tbody></table></div>` : '<div class="empty">Nenhum procedimento no plano. Use o odontograma para adicionar.</div>'}</section>`;
  }

  function budgetsTab(pt) {
    if (!can('orcamentos')) return restricted();
    const bs = of('orcamento').filter(b => data(b).patientId === pt);
    if (!bs.length) return '<section class="panel"><div class="empty">Nenhum orçamento para este paciente.</div></section>';
    return bs.map(b => {
      const d = data(b), L = d.itemsList || [], billed = new Set(of('cobranca').filter(c => data(c).budgetId === b.entity_id).flatMap(c => data(c).itemIds || []));
      const canApprove = can('orcamentos', 'editar') && L.length && ['Rascunho', 'Apresentado', 'Parcialmente aprovado'].includes(b.status);
      const canBill = can('financeiro', 'editar') && L.some(i => i.approved);
      return `<section class="panel"><div class="panel-head"><h2>${esc(b.title)} · ${esc(b.entity_id)}</h2>${badge(b.status)}</div>
        <p class="section-note">Validade: ${fmtDate(d.validUntil)} · Total: ${money(d.amountCents)}</p>
        ${L.length ? `<div class="checklist">${L.map(i => `<div class="check-row"><span>${i.approved ? '✔ ' : ''}${esc(i.label)} · dente ${esc(i.tooth || '—')} ${esc(i.tooth ? i.face : '')} ×${i.qty}${billed.has(i.id) ? ' <span class="tag good">Cobrado</span>' : ''}</span><strong>${money(i.priceCents * i.qty)}</strong></div>`).join('')}</div>` : `<p>${esc(d.items || '')}</p>`}
        <div class="actions" style="margin-top:12px">${canApprove ? `<button class="btn small" data-approve="${b.entity_id}">Aprovar itens</button>` : ''}${canBill ? `<button class="btn small secondary" data-genbill="${b.entity_id}">Gerar cobrança</button>` : ''}<button class="btn small secondary" data-printbudget="${b.entity_id}">Imprimir</button></div></section>`;
    }).join('');
  }

  function chargesTab(pt) {
    if (!can('financeiro')) return restricted();
    const cs = of('cobranca').filter(c => data(c).patientId === pt), ids = cs.map(c => c.entity_id);
    const pays = of('pagamento').filter(p => ids.includes(data(p).chargeId)), ests = of('estorno').filter(e => ids.includes(data(e).chargeId));
    const row = c => { const d = data(c); return `<tr><td><button class="link-btn" data-nav="financeiro" data-open="${c.entity_id}">${esc(c.title)}</button></td><td>${money(d.amountCents)}</td><td>${money(d.paidCents || 0)}</td><td>${money((d.amountCents || 0) - (d.paidCents || 0))}</td><td>${badge(c.status)}</td></tr>`; };
    return `<section class="panel"><h2>Cobranças</h2>${cs.length ? `<div class="table-wrap"><table><thead><tr><th>Cobrança</th><th>Total</th><th>Recebido líquido</th><th>Saldo</th><th>Situação</th></tr></thead><tbody>${cs.map(row).join('')}</tbody></table></div>` : '<div class="empty">Nenhuma cobrança.</div>'}</section>
      <section class="panel"><h2>Recebimentos e estornos</h2>${pays.length || ests.length ? `<div class="table-wrap"><table><thead><tr><th>Tipo</th><th>Recibo / ref.</th><th>Valor</th><th>Forma / motivo</th><th>Data</th><th>Situação</th></tr></thead><tbody>
        ${pays.map(p => { const d = data(p); return `<tr><td>Recebimento</td><td>${esc(d.receiptNo)}</td><td>${money(d.amountCents)}</td><td>${esc(d.method)}</td><td>${esc(d.at)}</td><td>${badge(p.status)}</td></tr>`; }).join('')}
        ${ests.map(e => { const d = data(e); return `<tr><td>Estorno</td><td>${esc(byId(d.paymentId) ? data(byId(d.paymentId)).receiptNo : '')}</td><td>−${money(d.amountCents)}</td><td>${esc(d.reason)}</td><td>${esc(d.at)}</td><td>${badge('Estornado')}</td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty">Nenhum recebimento.</div>'}</section>`;
  }

  patientDetail = function (r) {
    const d = data(r), pt = r.entity_id, clin = can('atendimentos');
    const tabs = ['Resumo', 'Anamnese', 'Odontograma', 'Plano', 'Evoluções', 'Exames', 'Documentos', 'Orçamentos', 'Cobranças', 'Histórico clínico', 'Consultas', 'Encaminhamentos', 'Procedimentos'].filter(t => t !== 'Cobranças' || can('financeiro'));
    if (!tabs.includes(patientTab)) patientTab = 'Resumo';
    const types = { 'Histórico clínico': ['atendimento', 'adendo'], 'Consultas': ['agendamento'], 'Exames': ['exame'], 'Procedimentos': ['cirurgia'] };
    const related = all().filter(x => data(x).patientId === pt && visible(x));
    const pend = clin ? items(pt).filter(i => !['Realizado', 'Cancelado'].includes(i.status)).length : null;
    let content;
    if (patientTab === 'Resumo') content = `<div class="grid two-col"><div class="panel"><h2>Identificação</h2><p><strong>Prontuário:</strong> ${esc(d.prontuario || pt)}<br><strong>Idade:</strong> ${esc(d.idade || 'Não informado')}<br><strong>Contato:</strong> ${esc(d.telefone || 'Não informado')}<br><strong>Situação:</strong> ${esc(r.status)}${pend === null ? '' : `<br><strong>Procedimentos pendentes:</strong> ${pend}`}</p></div>
      <div class="panel"><h2>Alertas clínicos</h2>${clin ? `<p>${esc(d.alertas || 'Não informado — não equivale a ausência de alergias ou reações.')}</p>` : '<p class="section-note">Dados clínicos restritos à equipe autorizada.</p>'}</div></div>`;
    else if (patientTab === 'Odontograma') content = odontogram(pt);
    else if (patientTab === 'Plano') content = planTab(pt);
    else if (patientTab === 'Orçamentos') content = budgetsTab(pt);
    else if (patientTab === 'Cobranças') content = chargesTab(pt);
    else if (window.OdontoX && OdontoX.tabs[patientTab]) content = OdontoX.tabs[patientTab](pt);
    else content = `<section class="panel">${table(related.filter(x => types[patientTab]?.includes(x.entity_type)), 'Nenhum registro nesta aba.')}</section>`;
    return `<div class="crumb"><button class="link-btn" data-nav="pacientes">Pacientes</button> / ${esc(r.title)}</div>
      <section class="panel"><div class="patient-head"><h1 style="margin:0">${esc(r.title)}</h1><span class="tag">${esc(d.prontuario || pt)}</span><span>${esc(d.idade || '')}</span><span>${esc(d.sexo || '')}</span>${clin && (window.OdontoX?.alert(pt) || d.alertas) ? `<span class="tag warn">⚠ ${esc(window.OdontoX?.alert(pt) || d.alertas)}</span>` : ''}</div></section>
      <div class="tabs" role="tablist" aria-label="Seções do paciente">${tabs.map(t => `<button role="tab" class="${patientTab === t ? 'active' : ''}" aria-selected="${patientTab === t}" data-tab="${t}">${t}</button>`).join('')}</div>${content}`;
  };

  /* ---------- Ações ---------- */
  function addPlan(general) {
    const pt = activeDetail;
    if (!can('atendimentos', 'editar')) return toast('Ação indisponível para este perfil.');
    if (!general && !od.tooth) return toast('Selecione um dente.');
    const proc = CATALOG.find(c => c[0] === od.proc) || CATALOG[0], tooth = general ? '' : String(od.tooth), creates = [];
    let fid = '';
    if (!general && od.finding) { const f = record('achado', 'Achado · dente ' + tooth + ' · ' + od.finding, 'Registrado', { patientId: pt, tooth, face: od.face, desc: od.finding, author: profile, date: new Date().toISOString().slice(0, 10) }); fid = f.entity_id; creates.push(f); }
    const it = record('planoitem', proc[1] + (tooth ? ' · dente ' + tooth : ' · geral'), 'Planejado', { patientId: pt, tooth, face: tooth ? od.face : '', dentition: od.dent, code: proc[0], label: proc[1], qty: 1, priceCents: proc[2], findingId: fid, stage: 'Procedimentos', author: profile });
    creates.push(it, aud('Item adicionado ao plano', it.entity_id));
    run(() => commit(creates), 'Procedimento adicionado ao plano.');
  }

  function genBudget() {
    const pt = activeDetail, ps = items(pt).filter(i => i.status === 'Planejado' && !data(i).budgetId);
    if (!ps.length) return toast('Nenhum item planejado sem orçamento.');
    const L = ps.map(i => { const d = data(i); return { id: i.entity_id, label: d.label, tooth: d.tooth, face: d.face, qty: d.qty, priceCents: d.priceCents, approved: false }; });
    const until = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    const b = record('orcamento', 'Orçamento · ' + byId(pt).title, 'Apresentado', { patientId: pt, amountCents: sum(L.map(i => i.priceCents * i.qty)), paidCents: 0, items: L.map(i => i.label).join('; '), itemsList: L, validUntil: until });
    run(() => commit([b, aud('Orçamento gerado', b.entity_id)], ps.map(i => [i, { budgetId: b.entity_id }])), 'Orçamento gerado.');
  }

  function approveFlow(b) {
    const d = data(b), L = d.itemsList || [];
    if (!L.length) return simpleAction(b, 'approve');
    const html = `<div class="field span-2"><label>Itens a aprovar *</label>${L.map(i => `<label class="check-row"><span><input type="checkbox" name="it_${i.id}" ${i.approved ? 'checked' : ''}> ${esc(i.label)} · dente ${esc(i.tooth || '—')} ${esc(i.tooth ? i.face : '')} ×${i.qty}</span><strong>${money(i.priceCents * i.qty)}</strong></label>`).join('')}<span class="error" id="err-items"></span></div>
      <div class="form-grid">${field('responsible', 'Responsável pela confirmação *', 'text', byId(d.patientId)?.title || '')}${selectField('method', 'Método de confirmação', [['Verbal registrada', 'Verbal registrada'], ['E-mail informado', 'E-mail informado'], ['Assinatura no termo', 'Assinatura no termo']])}</div>`;
    openModal('Aprovar orçamento', html, 'Confirmar aprovação', e => {
      e.preventDefault(); const v = values();
      if (!v.responsible?.trim()) return err('responsible', 'Campo obrigatório.');
      const fresh = byId(b.entity_id), fl = data(fresh).itemsList;
      const nl = fl.map(i => ({ ...i, approved: ('it_' + i.id) in v })), ok = nl.filter(i => i.approved);
      if (!ok.length) return err('items', 'Selecione ao menos um item.');
      const ups = [[fresh, { itemsList: nl, approvedCents: sum(ok.map(i => i.priceCents * i.qty)), confirmedBy: v.responsible, confirmationMethod: v.method, confirmedAt: stamp() }, ok.length === nl.length ? 'Aprovado' : 'Parcialmente aprovado']];
      ok.forEach(i => { const pi = byId(i.id); if (pi && pi.status === 'Planejado') ups.push([pi, {}, 'Aprovado']); });
      if (run(() => commit([aud('Orçamento aprovado', fresh.entity_id)], ups), 'Aprovação registrada.')) closeModalNow();
    });
  }

  function genBill(bid) {
    const b = byId(bid), d = data(b), L = (d.itemsList || []).filter(i => i.approved);
    const ex = of('cobranca').filter(c => data(c).budgetId === bid), covered = new Set(ex.flatMap(c => data(c).itemIds || []));
    const pend = L.filter(i => !covered.has(i.id));
    if (!pend.length) {
      if (ex.length) { toast('Cobrança já existente: abrindo a cobrança.'); return navigate('financeiro', ex[ex.length - 1].entity_id); }
      return toast('Aprove ao menos um item antes de gerar a cobrança.');
    }
    const c = record('cobranca', 'Cobrança · ' + byId(d.patientId).title, 'Em aberto', { patientId: d.patientId, budgetId: bid, itemIds: pend.map(i => i.id), amountCents: sum(pend.map(i => i.priceCents * i.qty)), paidCents: 0, origin: 'Orçamento ' + bid });
    run(() => commit([c, aud('Cobrança gerada', c.entity_id)]), 'Cobrança gerada somente para os itens aprovados.');
  }

  function payFlow(c) {
    const d = data(c), bal = (d.amountCents || 0) - (d.paidCents || 0), key = 'K' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    if (bal <= 0) return toast('Cobrança sem saldo a receber.');
    openModal('Receber pagamento', `<div class="notice">Saldo atual: <strong>${money(bal)}</strong></div><div class="form-grid">${field('amount', 'Valor recebido (R$) *', 'number', '', 'min="0.01" step="0.01"')}${selectField('method', 'Forma de pagamento', [['Pix', 'Pix'], ['Cartão', 'Cartão'], ['Dinheiro', 'Dinheiro'], ['Boleto', 'Boleto']])}${field('operator', 'Operador *', 'text', profile)}</div><p class="section-note">Confirmação manual simulada.</p>`, 'Confirmar recebimento', e => {
      e.preventDefault(); const v = values(), cents = Math.round(Number(v.amount) * 100);
      const fresh = byId(c.entity_id), fd = data(fresh), fb = (fd.amountCents || 0) - (fd.paidCents || 0);
      if (!(cents > 0)) return err('amount', 'Informe um valor maior que zero.');
      if (cents > fb) return err('amount', 'Valor maior que o saldo (' + money(fb) + ').');
      if (!v.operator?.trim()) return err('operator', 'Campo obrigatório.');
      if (of('pagamento').some(p => data(p).idem === key)) { closeModalNow(); return toast('Pagamento já registrado.'); }
      const rec = record('pagamento', 'Recebimento · ' + fresh.title, 'Confirmado', { chargeId: fresh.entity_id, patientId: fd.patientId, amountCents: cents, method: v.method, operator: v.operator, at: stamp(), idem: key, reversedCents: 0, receiptNo: 'REC-' + String(of('pagamento').length + 1).padStart(4, '0') });
      const paid = (fd.paidCents || 0) + cents;
      if (run(() => commit([rec, aud('Recebimento confirmado', rec.entity_id)], [[fresh, { paidCents: paid }, paid >= fd.amountCents ? 'Paga' : 'Parcialmente paga']]), 'Recebimento confirmado · recibo ' + data(rec).receiptNo + '.')) closeModalNow();
    });
  }

  function reverseFlow(c) {
    if (!can('financeiro', 'estornar')) return toast('Estorno exige permissão própria (Financeiro, Gestão ou Administração).');
    const avail = p => data(p).amountCents - (data(p).reversedCents || 0);
    const pays = of('pagamento').filter(p => data(p).chargeId === c.entity_id && avail(p) > 0);
    if (!pays.length) return toast('Não há recebimento disponível para estorno.');
    openModal('Estornar recebimento', `${selectField('pay', 'Recebimento *', pays.map(p => [p.entity_id, data(p).receiptNo + ' · ' + money(avail(p)) + ' disponível']))}${field('amount', 'Valor a estornar (R$) *', 'number', '', 'min="0.01" step="0.01"')}${textArea('reason', 'Motivo *')}`, 'Confirmar estorno', e => {
      e.preventDefault(); const v = values(), p = byId(v.pay), cents = Math.round(Number(v.amount) * 100);
      if (!(cents > 0)) return err('amount', 'Informe um valor maior que zero.');
      if (cents > avail(p)) return err('amount', 'Estorno acima do valor disponível (' + money(avail(p)) + ').');
      if (!v.reason?.trim()) return err('reason', 'Campo obrigatório.');
      const fresh = byId(c.entity_id), fd = data(fresh), pd = data(p), paid = (fd.paidCents || 0) - cents, rev = (pd.reversedCents || 0) + cents;
      const es = record('estorno', 'Estorno · ' + pd.receiptNo, 'Confirmado', { paymentId: p.entity_id, chargeId: fresh.entity_id, patientId: fd.patientId, amountCents: cents, reason: v.reason, operator: profile, at: stamp() });
      const st = paid <= 0 ? 'Em aberto' : paid >= fd.amountCents ? 'Paga' : 'Parcialmente paga';
      if (run(() => commit([es, aud('Estorno', es.entity_id, v.reason)], [[p, { reversedCents: rev }, rev >= pd.amountCents ? 'Estornado' : 'Parcialmente estornado'], [fresh, { paidCents: paid }, st]]), 'Estorno registrado. Saldo atualizado.')) closeModalNow();
    });
  }

  function printBudget(bid) {
    const b = byId(bid), d = data(b), p = byId(d.patientId), L = d.itemsList || [];
    const w = window.open('', '_blank'); if (!w) return toast('Libere pop-ups para imprimir.');
    w.document.write(`<!doctype html><meta charset="utf-8"><title>Orçamento ${esc(bid)}</title><body style="font-family:Inter,sans-serif;padding:32px"><h1>Orçamento odontológico</h1><p>Ambiente de demonstração · dados fictícios</p><p>Paciente: ${esc(p?.title)} · Validade: ${fmtDate(d.validUntil)}</p><table border="1" cellpadding="8" style="border-collapse:collapse;width:100%"><tr><th>Procedimento</th><th>Dente</th><th>Face</th><th>Qtd</th><th>Valor</th></tr>${L.map(i => `<tr><td>${esc(i.label)}</td><td>${esc(i.tooth || '—')}</td><td>${esc(i.face || '—')}</td><td>${i.qty}</td><td>${money(i.priceCents * i.qty)}</td></tr>`).join('')}</table><h2>Total: ${money(d.amountCents)}</h2>`);
    w.document.close(); w.print();
  }

  /* ---------- Eventos ---------- */
  document.addEventListener('click', e => { // captura: assume o recebimento/estorno de cobranças antes do fluxo antigo
    const t = e.target.closest('button'), a = t?.dataset.act;
    if (a !== 'pay' && a !== 'reverse') return;
    const r = byId(t.dataset.id); if (!r || r.entity_type !== 'cobranca') return;
    e.stopPropagation(); a === 'pay' ? payFlow(r) : reverseFlow(r);
  }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return; const ds = t.dataset;
    if (ds.tooth) { od.tooth = ds.tooth; render(); }
    else if (ds.face) { od.face = ds.face; render(); }
    else if (ds.dent) { od.dent = ds.dent; od.tooth = ''; render(); }
    else if (ds.addplan) addPlan(ds.addplan === 'general');
    else if (ds.genbudget) genBudget();
    else if (ds.approve) approveFlow(byId(ds.approve));
    else if (ds.genbill) genBill(ds.genbill);
    else if (ds.printbudget) printBudget(ds.printbudget);
    else if (ds.open) { activeDetail = ds.open; render(); }
    else if (t.id === 'reset-demo' && confirm('Restaurar dados de demonstração? Os registros gravados por você na Odontologia serão apagados; as outras clínicas não são afetadas.')) { ClinicasData.open('odonto').reset(); backendRecords = []; activeDetail = null; render(); toast('Dados de demonstração restaurados.'); }
  });
  document.addEventListener('change', e => { if (e.target.id === 'od-proc') od.proc = e.target.value; if (e.target.id === 'od-finding') od.finding = e.target.value; });

  const _settings = settings;
  settings = function () { return _settings() + '<section class="panel"><h2>Dados de demonstração</h2><p class="section-note">Restaurar apaga os registros gravados por você nesta clínica e volta aos exemplos fictícios. Outras clínicas não são afetadas.</p><button class="btn secondary" id="reset-demo">Restaurar dados de demonstração</button></section>'; };

  render();
})();
