/* Telas Agenda, Recepção e fila e Supervisão acadêmica no padrão dos mockups.
   O CSS é injetado por este arquivo, então não depende da versão do odonto.css. */
(function () {
  'use strict';
  const X = window.OdontoX, { ag, rc, sv } = X;
  const css = `
.pg-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px;flex-wrap:wrap}
.pg-title{display:flex;gap:12px;align-items:center}.pg-title>svg{width:34px;height:34px;color:var(--navy);flex:none}
.pg-title h1{margin:0}.pg-title p{margin:2px 0 0;color:var(--muted)}
.filters{display:flex;gap:16px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:16px}
.filters .field{flex:1;min-width:170px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff}
.seg button{border:0;background:#fff;padding:9px 20px;font-weight:700;color:var(--ink)}
.seg button.on{background:var(--blue);color:#fff}
.datebar{display:flex;gap:10px;align-items:center;margin:14px 0;flex-wrap:wrap}
.datebar .pill{display:flex;gap:8px;align-items:center;border:1px solid var(--line);background:#fff;border-radius:10px;padding:9px 16px;font-weight:600}
.datebar .pill svg,.datebar .icon-btn svg{width:17px;height:17px}
.ag-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px;align-items:start}
.ag-grid{display:grid;border:1px solid var(--line);border-radius:12px;background:#fff;overflow:auto}
.ag-boxh{display:flex;gap:10px;align-items:center;padding:12px;border-bottom:1px solid var(--line);border-left:1px solid var(--line);background:#fff}
.ag-boxh svg{width:26px;height:26px;color:#456;flex:none}.ag-boxh b{display:block}.ag-boxh small{color:var(--muted)}
.ag-t{font-weight:700;font-size:12px;color:#34465a;padding:8px;border-bottom:1px solid #eef2f6;text-align:center;background:#fff}
.ag-slot{border-bottom:1px solid #eef2f6;border-left:1px solid var(--line)}
.ag-card{display:flex;flex-direction:column;gap:2px;text-align:left;border:0;border-left:4px solid var(--c,#4b8aae);background:var(--bg2,#d8eaf9);border-radius:8px;margin:3px 6px;padding:6px 9px;font-size:12px;line-height:1.25;overflow:hidden;z-index:1;color:var(--ink)}
.ag-card b{font-size:14px}.ag-card small{color:#3c4d5f}
.ag-card.sel{outline:2px solid var(--blue);box-shadow:0 4px 12px #0003}
[data-d="Periodontia"]{--c:#3a9a4a;--bg2:#dff3e2}[data-d="Cirurgia Oral"]{--c:#7a55c4;--bg2:#e9e0fa}[data-d="Prótese"]{--c:#d79b39;--bg2:#fdeecb}
[data-d="Dentística"]{--c:#4b8aae;--bg2:#d8eaf9}[data-d="Endodontia"]{--c:#d0507f;--bg2:#fbdce8}[data-d="Odontopediatria"]{--c:#1b9a92;--bg2:#d6f2ef}
.ag-week{display:grid;grid-template-columns:repeat(5,minmax(150px,1fr));border:1px solid var(--line);border-radius:12px;background:#fff;overflow:auto}
.ag-week>div{border-left:1px solid var(--line);padding:4px;min-height:120px}.ag-week>div:first-child{border-left:0}
.ag-panel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px}
.ap-head{display:flex;gap:10px;align-items:flex-start;justify-content:space-between}.ap-head h2{margin:0}
.ap-row{display:flex;gap:12px;align-items:center;padding:6px 0}.ap-row svg{width:18px;height:18px;color:#456;flex:none}
.ap-actions{display:flex;flex-direction:column;gap:8px;margin-top:14px;border-top:1px solid var(--line);padding-top:14px}.ap-actions .btn{width:100%}
.rc-tabs{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.rc-tabs button{border:1px solid var(--line);background:#fff;border-radius:10px;padding:11px 18px;font-weight:600;color:var(--ink)}
.rc-tabs button.on{border-color:var(--blue);color:var(--blue);background:#eaf6fa}
.rc-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:start}
.qt{width:100%;border-collapse:collapse;min-width:0}.qt th{font-size:13px;text-transform:none;letter-spacing:0;color:#34465a;background:#fff}
.qt tr[data-rcsel]{cursor:pointer}.qt tr.on{background:#e3f1f7;box-shadow:inset 4px 0 0 var(--blue)}
.who{display:flex;gap:10px;align-items:center}.who small{display:block}
.avatar{width:36px;height:36px;border-radius:50%;background:#e3f1f7;color:var(--blue);display:grid;place-items:center;flex:none}.avatar svg{width:18px;height:18px}
.avatar.big{width:48px;height:48px}.avatar.big svg{width:24px;height:24px}
.stpill{display:inline-flex;gap:6px;align-items:center;background:#dcecfb;color:#164066;border-radius:99px;padding:5px 10px;font-size:12px;font-weight:700;white-space:nowrap}.stpill svg{width:14px;height:14px}
.dl-row{display:flex;gap:12px;padding:12px 0;border-top:1px solid var(--line)}.dl-row svg{width:20px;height:20px;flex:none;color:#456}.dl-row b{display:block}
.alertpill{background:#fde9e9;color:#a33a3b;padding:3px 10px;border-radius:99px;font-weight:600;display:inline-block}
.sv-layout{display:grid;grid-template-columns:330px minmax(0,1fr);gap:16px;align-items:start}
.sv-item{display:flex;gap:10px;align-items:center;width:100%;border:0;border-bottom:1px solid var(--line);background:#fff;padding:12px;text-align:left;color:var(--ink)}
.sv-item.on{background:#e3f1f7;box-shadow:inset 4px 0 0 var(--blue)}.sv-item .grow{flex:1;min-width:0}.sv-item small{display:block;color:var(--muted)}
.ftabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin:12px 0 16px;overflow:auto}
.ftabs button{border:0;background:none;padding:10px 12px;color:var(--muted);font-weight:600;border-bottom:2px solid transparent;white-space:nowrap}
.ftabs button.on{color:var(--blue);border-bottom-color:var(--blue)}
.meta3{display:flex;flex-wrap:wrap;margin:12px 0 16px}.meta3>div{display:flex;gap:10px;align-items:center;padding:0 24px;border-left:1px solid var(--line)}
.meta3>div:first-child{border:0;padding-left:0}.meta3 svg{width:20px;height:20px;color:#456}.meta3 small{display:block;color:var(--muted)}
.ro{background:#f3f6f9;border:1px solid var(--line);border-radius:8px;padding:12px;line-height:1.6;white-space:pre-wrap}.ro small{display:block;color:var(--muted)}
.hist-row{display:flex;gap:10px;padding:8px 0;align-items:flex-start}.hist-row svg{width:18px;height:18px;color:#456;flex:none;margin-top:2px}
.pcard{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin-bottom:14px;flex-wrap:wrap}
.pcard h1{margin:0 0 6px;font-size:28px}.pmeta{display:flex;gap:14px;align-items:center;color:#34465a;flex-wrap:wrap}.pmeta>*+*{border-left:1px solid var(--line);padding-left:14px}
.palert{background:#fff1d9;color:#a33a3b;border-radius:10px;padding:8px 14px;display:inline-flex;gap:8px;align-items:center}.palert b{font-weight:800}.palert svg{width:18px;height:18px}
.ptabs{display:flex;gap:4px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:0 8px;overflow:auto;margin-bottom:16px}
.ptabs button{display:flex;gap:8px;align-items:center;border:0;background:none;padding:14px;color:#34465a;font-weight:600;border-bottom:3px solid transparent;white-space:nowrap}
.ptabs button.on{color:var(--blue);border-bottom-color:var(--blue)}.ptabs svg{width:17px;height:17px}
.plan-title{font-size:30px;margin:0 0 18px;display:flex;gap:10px;align-items:center}.plan-title svg{width:28px;height:28px}.plan-title small{font-size:13px;color:var(--muted)}
.plan-top{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px}
.teamstrip{display:flex;border:1px solid var(--line);border-radius:10px;background:#fff}
.teamstrip>span{display:flex;gap:10px;align-items:center;padding:10px 18px;border-left:1px solid var(--line)}.teamstrip>span:first-child{border-left:0}
.teamstrip small{display:block;font-size:10px;color:var(--muted)}.teamstrip svg{width:20px;height:20px;color:#345}
.ptable{width:100%;min-width:0;border:1px solid var(--line);border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden}
.ptable th{background:#eef2f6;text-transform:none;font-size:13px;color:#34465a;letter-spacing:0}.ptable td:first-child{font-weight:700}
.spill{display:inline-flex;gap:6px;align-items:center;border-radius:99px;padding:4px 10px;font-weight:600;font-size:13px;white-space:nowrap}
.spill.ok{background:#e4f5ee;color:#136c4c}.spill.pend{background:#dcecfb;color:#164066}.spill.prev{background:#eef2f6;color:#445}.spill.warn{background:#fff1d9;color:#916012}.spill svg{width:14px;height:14px}
.plan-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.pcard2{display:flex;gap:14px;border:1px solid var(--line);border-radius:12px;padding:18px;background:#fff}.pcard2>svg{width:26px;height:26px;color:#345;flex:none}
.pcard2 h3{margin:0 0 4px;font-size:20px}.pcard2 p{color:var(--muted);margin:0 0 12px}
.an-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.an-card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:16px}
.an-card h3{display:flex;gap:8px;align-items:center;margin:0 0 10px;font-size:18px}.an-card h3 svg{width:20px;height:20px}
.an-card textarea{width:100%;min-height:92px;border:1px solid #cbd8e4;border-radius:8px;padding:10px;font:inherit;resize:vertical}
.an-foot{position:sticky;bottom:0;display:flex;justify-content:space-between;align-items:center;gap:12px;background:#fff;border-top:1px solid var(--line);padding:12px 0;margin-top:8px}
@media(max-width:1000px){.plan-cards,.an-grid{grid-template-columns:1fr}}
@media(max-width:1000px){.ag-layout,.rc-layout,.sv-layout{grid-template-columns:1fr}}`;
  const st = document.createElement('style'); st.id = 'odonto-ui-style'; st.textContent = css; (document.head || document.documentElement).appendChild(st);

  const I = (n, c = '') => `<i data-lucide="${n}" ${c ? 'class="' + c + '"' : ''}></i>`;
  const mins = t => { const [h, m] = t.split(':'); return h * 60 + +m; };
  const pr = p => data(p).prontuario || '';
  const head = (icon, title, sub, action = '') => `<div class="pg-head"><div class="pg-title">${I(icon)}<div><h1>${esc(title)}</h1><p>${sub}</p></div></div>${action}</div>`;
  const opt = (id, label, arr, v, all) => `<div class="field"><label for="${id}">${label}</label><select id="${id}"><option value="">${all}</option>${arr.map(x => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('')}</select></div>`;

  /* ---------- Agenda ---------- */
  function agenda() {
    const f = r => { const d = data(r); return (!ag.disc || d.discipline === ag.disc) && (!ag.prof || d.professor === ag.prof) && (!ag.student || d.student === ag.student) && (!ag.box || d.box === ag.box); };
    const apps = list('agendamento').filter(f), sel = ag.sel && byId(ag.sel);
    const card = (r, style = '') => { const d = data(r); return `<button type="button" class="ag-card ${ag.sel === r.entity_id ? 'sel' : ''}" data-d="${esc(d.discipline || '')}" data-agsel="${r.entity_id}" style="${style}"><small>${esc(d.time)} – ${esc(d.end)} · ${esc(r.status)}</small><b>${esc(byId(d.patientId)?.title || '—')}</b><span>${esc(d.discipline || d.service || '')}</span></button>`; };
    let grid;
    if (ag.mode === 'dia') {
      const boxes = Object.keys(X.BOXES).filter(b => !ag.box || b === ag.box), day = apps.filter(r => data(r).date === ag.date);
      grid = `<div class="ag-grid" style="grid-template-columns:70px repeat(${boxes.length},minmax(170px,1fr));grid-template-rows:auto repeat(20,44px)"><div style="grid-row:1;grid-column:1"></div>
        ${boxes.map((b, i) => `<div class="ag-boxh" style="grid-row:1;grid-column:${i + 2}">${I('armchair')}<div><b>${b}</b><small>${day.filter(r => data(r).box === b).length} agendamentos</small></div></div>`).join('')}
        ${Array.from({ length: 20 }, (_, r) => `<div class="ag-t" style="grid-row:${r + 2};grid-column:1">${String(8 + (r >> 1)).padStart(2, '0')}:${r % 2 ? '30' : '00'}</div>${boxes.map((b, c) => `<div class="ag-slot" style="grid-row:${r + 2};grid-column:${c + 2}"></div>`).join('')}`).join('')}
        ${day.map(r => { const d = data(r), c = boxes.indexOf(d.box); if (c < 0) return ''; const s = Math.max(0, Math.floor((mins(d.time) - 480) / 30)), n = Math.max(1, Math.ceil((mins(d.end) - mins(d.time)) / 30)); return card(r, `grid-column:${c + 2};grid-row:${s + 2}/span ${n}`); }).join('')}</div>`;
    } else {
      const add = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
      const wd = (new Date(ag.date + 'T12:00:00Z').getUTCDay() + 6) % 7, mon = add(ag.date, -wd), days = [0, 1, 2, 3, 4].map(i => add(mon, i));
      grid = `<div class="ag-week">${days.map((dd, i) => `<div><div class="ag-t" style="margin-bottom:4px">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex'][i]} ${fmtDate(dd)}</div>${apps.filter(r => data(r).date === dd).sort((a, b) => data(a).time.localeCompare(data(b).time)).map(r => card(r)).join('') || '<small style="padding:8px;display:block;color:var(--muted)">Sem agendamentos</small>'}</div>`).join('')}</div>`;
    }
    let panel = `<aside class="ag-panel"><p class="section-note">Selecione um horário para ver paciente, período, box e equipe.</p></aside>`;
    if (sel && visible(sel)) {
      const d = data(sel), p = byId(d.patientId), live = !['Cancelado', 'Falta', 'Concluído'].includes(sel.status);
      const row = (ic, t) => `<div class="ap-row">${I(ic)}<span>${t}</span></div>`;
      panel = `<aside class="ag-panel"><div class="ap-head"><div class="who">${I('user-round')}<div><h2>${esc(p?.title)}</h2><small>${esc(pr(p))}</small></div></div><button class="icon-btn" type="button" data-agclose="1" aria-label="Fechar">${I('x')}</button></div>
        <div style="margin:10px 0">${badge(sel.status)}</div>${row('calendar', fmtDate(d.date))}${row('clock', esc(d.time) + ' – ' + esc(d.end))}${row('armchair', esc(d.box || '—'))}${row('graduation-cap', esc(d.discipline || '—'))}${row('user', 'Aluno: ' + esc(d.student || '—'))}${row('users', 'Professor: ' + esc(d.professor || '—'))}${d.series ? row('repeat', 'Série: sessão ' + d.seq + '/' + d.of) : ''}
        <div class="ap-actions">${live && (can('recepcao', 'editar') || can('agenda', 'editar')) && !['Chegou', 'Em atendimento'].includes(sel.status) ? `<button class="btn" data-agarrive="${sel.entity_id}">${I('check')} Registrar chegada</button>` : ''}
        ${can('pacientes') ? `<button class="btn secondary" data-agficha="${d.patientId}">${I('external-link')} Abrir ficha</button>` : ''}
        ${live && can('atendimentos', 'cadastrar') ? `<button class="btn secondary" data-agstart="${sel.entity_id}">Iniciar atendimento</button>` : ''}
        ${sel.status === 'Em atendimento' && can('atendimentos', 'editar') ? `<button class="btn secondary" data-agfinish="${sel.entity_id}">Concluir atendimento</button>` : ''}
        ${live && can('agenda', 'editar') ? `<button class="btn secondary" data-act="reschedule" data-id="${sel.entity_id}">Reagendar</button><button class="btn secondary" data-agabsent="${sel.entity_id}">Registrar falta</button><button class="btn secondary" data-act="cancel" data-id="${sel.entity_id}">Cancelar</button>` : ''}</div>
        ${(d.rescheduleHistory || []).length ? `<p class="section-note">Histórico: ${d.rescheduleHistory.map(h => esc(h.from + ' → ' + h.reason)).join('; ')}</p>` : ''}</aside>`;
    }
    return head('calendar', 'Agenda', 'Agenda clínica escola da Clínica Odontológica – Universidade Positivo.', can('agenda', 'cadastrar') ? `<button class="btn" data-agnew="1">${I('plus')} Novo agendamento</button>` : '') +
      `<div class="filters">${opt('ag-disc', 'Disciplina', X.DISC, ag.disc, 'Todas as disciplinas')}${opt('ag-prof', 'Professor', X.PROFS, ag.prof, 'Todos os professores')}${opt('ag-student', 'Aluno', X.STUDENTS, ag.student, 'Todos os alunos')}${opt('ag-box', 'Box', Object.keys(X.BOXES), ag.box, 'Todos os boxes')}</div>
      <div class="datebar"><div class="seg"><button class="${ag.mode === 'dia' ? 'on' : ''}" data-agmode="dia">Dia</button><button class="${ag.mode === 'semana' ? 'on' : ''}" data-agmode="semana">Semana</button></div>
      <button class="icon-btn" data-agnav="-1" aria-label="Anterior">${I('chevron-left')}</button><span class="pill">${I('calendar')} ${fmtDate(ag.date)}</span><button class="icon-btn" data-agnav="1" aria-label="Próximo">${I('chevron-right')}</button></div>
      <div class="ag-layout"><div>${grid}</div>${panel}</div>
      <section class="panel" style="margin-top:16px"><h2>Bloqueios e indisponibilidades</h2>${table(list('bloqueio'), 'Nenhum bloqueio registrado.')}</section>`;
  }

  /* ---------- Recepção e fila ---------- */
  const STAGES = ['Aguardando triagem', 'Em triagem', 'Aguardando atendimento'];
  function receptionView() {
    const q = list('fila'), cnt = s => q.filter(f => f.status === s).length, clin = can('atendimentos');
    const rows = q.filter(f => f.status === rc.stage).sort((a, b) => (data(a).arrivedAt || '').localeCompare(data(b).arrivedAt || ''));
    const sel = byId(rc.sel) && rows.includes(byId(rc.sel)) ? byId(rc.sel) : rows[0];
    let panel = '<aside class="ag-panel"><div class="empty">Nenhum paciente selecionado.</div></aside>';
    if (sel) {
      const d = data(sel), p = byId(d.patientId), t = d.triage || {};
      const row = (ic, label, val) => `<div class="dl-row">${I(ic)}<div><b>${label}</b>${val}</div></div>`;
      panel = `<aside class="ag-panel"><div class="ap-head"><div class="who"><span class="avatar big">${I('user-round')}</span><div><h2>${esc(p?.title)}</h2><span class="tag">${esc(pr(p))}</span></div></div>${can('pacientes') ? `<button class="link-btn" data-agficha="${d.patientId}">Ver prontuário ${I('external-link')}</button>` : ''}</div><div style="margin-top:14px">
        ${row('clock', 'Motivo da chegada', esc(d.reason || '—'))}
        ${clin ? row('clipboard-list', 'Queixa principal', esc(t.queixa || 'Triagem não registrada')) + row('triangle-alert', 'Alertas de saúde', t.alertas ? `<span class="alertpill">${esc(t.alertas)}</span>` : '—') + row('flag', 'Prioridade', esc(t.prioridade || '—')) : row('lock', 'Dados clínicos', '<small>Restritos à equipe autorizada.</small>')}
        ${row('layers', 'Disciplina de destino', esc(t.discipline || '—'))}${row('graduation-cap', 'Aluno responsável', esc(t.student || '—'))}${row('user-round', 'Professor supervisor', esc(t.professor || '—'))}</div>
        ${(d.history || []).length ? `<p class="section-note">${d.history.map(h => esc(h.at + ' · ' + h.by + ' · ' + h.action)).join('<br>')}</p>` : ''}
        <div class="ap-actions">${sel.status !== 'Aguardando atendimento' && can('atendimentos', 'editar') ? `<button class="btn secondary" data-triage="${sel.entity_id}">${I('file-plus')} Nova triagem</button><button class="btn" data-forward="${sel.entity_id}">${I('arrow-right')} Encaminhar para atendimento</button>` : ''}
        ${sel.status === 'Aguardando atendimento' && can('atendimentos', 'cadastrar') ? `<button class="btn" data-qstart="${sel.entity_id}">${I('arrow-right')} Iniciar atendimento</button>` : ''}</div></aside>`;
    }
    const acts = `<div class="actions">${can('recepcao', 'editar') ? `<button class="btn" data-qarrive="1">${I('user-plus')} Registrar chegada</button>` : ''}${can('atendimentos', 'editar') ? `<button class="btn" data-triage="">${I('file-plus')} Nova triagem</button>` : ''}</div>`;
    return head('users', 'Recepção e fila', 'Triagem e encaminhamento de pacientes da Clínica Odontológica Escola.', acts) +
      `<div class="rc-tabs">${STAGES.map(s => `<button class="${rc.stage === s ? 'on' : ''}" data-rcstage="${s}">${s} (${cnt(s)})</button>`).join('')}</div>
      <div class="rc-layout"><section class="panel" style="padding:8px 0">${rows.length ? `<div class="table-wrap"><table class="qt"><thead><tr><th>Paciente</th><th>Chegada ↑</th><th>Motivo</th><th>Status</th></tr></thead><tbody>${rows.map(f => { const d = data(f), p = byId(d.patientId); return `<tr data-rcsel="${f.entity_id}" class="${sel && sel.entity_id === f.entity_id ? 'on' : ''}"><td><div class="who"><span class="avatar">${I('user-round')}</span><div><b>${esc(p?.title)}</b><small>${esc(pr(p))}</small></div></div></td><td>${esc(d.arrivedAt)}</td><td>${esc(d.reason)}</td><td><span class="stpill">${I('clock')} ${esc(f.status)}</span></td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty" style="margin:16px">Nenhum paciente nesta etapa.</div>'}</section>${panel}</div>`;
  }

  /* ---------- Supervisão acadêmica ---------- */
  const FT = ['Resumo', 'Anamnese', 'Odontograma', 'Plano', 'Evoluções', 'Exames', 'Documentos', 'Orçamentos'];
  function supervision() {
    const items = X.svItems(), cur = items.find(i => i.id === sv.sel) || items[0];
    const who = i => { const p = byId(i.d.patientId); return [p?.title, pr(p)]; };
    let right = '<section class="panel"><div class="empty">Nenhum registro para revisar com os filtros atuais.</div></section>';
    if (cur) {
      const [pn, prn] = who(cur), d = cur.d, canRev = can('supervisao', 'validar') && profile !== 'Aluno ou estagiário', ver = d.version || 1, isFix = cur.label === 'Correção solicitada', isAn = cur.label === 'Anamnese', isPl = cur.label === 'Plano';
      const tab = isAn ? 'Anamnese' : isPl ? 'Plano' : 'Evoluções';
      let body, acts = '';
      if (isFix) {
        body = `<div class="ro"><small>Pedido de correção</small>${esc(d.requestedBy)} em ${esc(d.requestedAt)}\nVersão de origem: v${d.versionFrom}\nMotivo: ${esc(d.reason)}\nCampos: ${esc((d.fields || []).join(', '))}</div>`;
        acts = canRev ? `<button class="btn secondary" data-refuse="${cur.id}">Recusar</button><button class="btn" data-authorize="${cur.id}">${I('check')} Autorizar correção</button>` : '';
      } else {
        body = isPl ? `<div class="ro"><small>Plano de tratamento (somente leitura)</small>${(d.itemIds || []).map(id => byId(id)).filter(Boolean).map(i => '• ' + esc(data(i).label) + (data(i).tooth ? ' · dente ' + esc(data(i).tooth) : '') + ' — ' + esc(i.status)).join('\n')}</div>` : isAn ? `<div class="ro"><small>Anamnese (somente leitura)</small>Queixa: ${esc(d.queixa)}\nSaúde: ${esc(d.saude)}\nMedicamentos: ${esc(d.meds)}\nAlergias (${esc(d.alergiaKind)}): ${esc(d.alergia)}\nHistórico odontológico: ${esc(d.odonto)}</div>` : `<div class="ro"><small>Evolução (somente leitura)</small>${esc(d.procLabel)}: ${esc(d.registro)}\nOrientações: ${esc(d.orientacoes)}</div>`;
        acts = canRev && cur.r.status === 'Em revisão' ? `<button class="btn secondary" data-svreturn="${cur.id}" data-ver="${ver}">${I('pencil')} Solicitar correção</button><button class="btn" data-svvalidate="${cur.id}" data-ver="${ver}">${I('check')} Validar registro</button>` : cur.r.status === 'Validado' ? `<span class="section-note">Validado por ${esc(d.validatedBy)} em ${esc(d.validatedAt)}.</span>` : '';
      }
      const showComment = isFix || (canRev && cur.r.status === 'Em revisão');
      right = `<section class="panel"><div class="crumb"><span>Pacientes</span> / ${esc(pn)}</div><div class="who"><span class="avatar big">${I('user-round')}</span><div><h2 style="margin:0">${esc(pn)}</h2><small>${esc(prn)}</small></div></div>
        <div class="ftabs">${FT.map(t => `<button class="${t === tab ? 'on' : ''}" data-svtab="${t}" data-pt="${d.patientId}">${t}</button>`).join('')}</div>
        <h2>${isFix ? 'Revisar pedido de correção' : isAn ? 'Revisar anamnese' : isPl ? 'Revisar plano' : 'Revisar evolução'}</h2>
        <div class="meta3"><div>${I('graduation-cap')}<div><small>Aluno</small><b>${esc(d.student)}</b></div></div><div>${I('book-open')}<div><small>Disciplina</small><b>${esc(d.discipline)}</b></div></div><div>${I('calendar')}<div><small>Data do registro · versão</small><b>${d.date ? fmtDate(d.date) : esc(d.requestedAt || '')}${d.time ? ' às ' + esc(d.time) : ''} · v${ver}</b></div></div></div>
        ${body}${showComment ? `<div class="field" style="margin-top:14px"><label for="sv-comment">${isFix ? 'Comentário (obrigatório para recusar)' : 'Comentário para o aluno'}</label><textarea id="sv-comment" placeholder="Digite sua orientação, apontamentos ou ajustes necessários…"></textarea></div>` : ''}
        <div class="actions" style="justify-content:flex-end;margin-top:14px">${can('pacientes') ? `<button class="btn secondary" data-agficha="${d.patientId}">${I('external-link')} Abrir ficha</button>` : ''}${acts}</div>
        <h3 style="margin-top:22px">${I('history')} Histórico de revisões</h3>${(d.history || []).length ? d.history.map(h => `<div class="hist-row">${I('clock')}<div><b>${esc(h.at)} • ${esc(h.by)}</b><br><span class="section-note">${esc(h.action)}</span></div></div>`).join('') : '<p class="section-note">Sem histórico.</p>'}</section>`;
    }
    const left = items.length ? items.map(i => { const [pn, prn] = who(i); return `<button class="sv-item ${cur && cur.id === i.id ? 'on' : ''}" data-svsel="${i.id}"><span class="avatar">${I('user-round')}</span><span class="grow"><b>${esc(pn)}</b><small>${esc(prn)} · ${esc(i.d.discipline || '')}${i.label !== 'Evolução' ? ' · ' + i.label : ''}</small></span>${badge(i.st)}</button>`; }).join('') : '<div class="empty" style="margin:12px">Fila vazia.</div>';
    return head('graduation-cap', 'Supervisão acadêmica', 'Acompanhe e revise os registros clínicos realizados pelos alunos.') +
      `<div class="filters">${opt('sv-disc', 'Disciplina', X.DISC, sv.disc, 'Todas as disciplinas')}${opt('sv-turma', 'Turma', X.TURMAS, sv.turma, 'Todas as turmas')}<div class="field"><label for="sv-status">Status</label><select id="sv-status">${['Aguardando revisão', 'Devolvido', 'Validado', 'Rascunho', 'Todos'].map(s => `<option ${s === sv.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div></div>
      <div class="sv-layout"><section class="panel" style="padding:0;overflow:hidden"><h3 style="padding:16px 16px 8px;margin:0">Fila de revisões (${items.length})</h3>${left}</section>${right}</div>`;
  }

  const _si = X.svItems;
  X.svItems = () => {
    const base = _si(), extra = list('plano').map(r => ({ r, d: data(r), id: r.entity_id, st: r.status === 'Em revisão' ? 'Aguardando revisão' : r.status, label: 'Plano' }))
      .filter(i => (!sv.disc || i.d.discipline === sv.disc) && (!sv.turma || i.d.turma === sv.turma) && (sv.status === 'Todos' || i.st === sv.status));
    return [...base, ...extra];
  };
  const _m = moduleList; moduleList = m => m === 'agenda' ? agenda() : m === 'supervisao' ? supervision() : _m(m);
  reception = receptionView;
  if (!ag.sel && byId('A-001')) ag.sel = 'A-001';

  document.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-rcsel]'); if (tr && !e.target.closest('button')) { rc.sel = tr.dataset.rcsel; render(); return; }
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.agclose) { ag.sel = ''; render(); }
    else if (b.dataset.svtab) { if (!can('pacientes')) return toast('Acesso restrito.'); navigate('pacientes', b.dataset.pt); patientTab = b.dataset.svtab; render(); }
  });
  /* ---------- Histórico do navegador: cada tela/aba vira uma entrada (Voltar/Avançar e links diretos) ---------- */
  const hashOf = () => '#/' + [current, activeDetail || '', activeDetail ? patientTab : ''].map(encodeURIComponent).join('/').replace(/\/+$/, '');
  const apply = h => {
    const [c, d, t] = h.slice(2).split('/').map(x => { try { return decodeURIComponent(x); } catch { return ''; } });
    current = c && can(c) ? c : 'painel'; activeDetail = null;
    if (d) { const r = byId(d); if (r && visible(r)) { activeDetail = d; if (t) patientTab = t; } }
  };
  let last = null; const _render = render;
  render = function () {
    _render(); const h = hashOf();
    if (h !== last) { try { last === null ? history.replaceState({ h }, '', h) : history.pushState({ h }, '', h); } catch { /* ambiente sem History API */ } last = h; }
  };
  window.addEventListener('popstate', () => {
    if (!location.hash.startsWith('#/')) return;
    apply(location.hash); last = hashOf();
    if (last !== location.hash) { try { history.replaceState({ h: last }, '', last); } catch {} }
    _render();
  });
  if (location.hash.startsWith('#/')) apply(location.hash);
  render();
})();
