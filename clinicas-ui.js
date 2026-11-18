/* clinicas-ui.js — telas no padrão da Clínica Odontológica para TODAS as clínicas:
   Agenda (Dia/Semana), Recepção e fila, Perfil do paciente, Supervisão acadêmica,
   aviso de vencimento de pagamento, histórico do navegador e atualizações da Documentação.
   Carregue por último, depois do script da clínica. O CSS é injetado por este arquivo. */
(function () {
  'use strict';
  const ODONTO = !!window.OdontoX;            // a Odontologia mantém suas telas próprias (odonto_ui.js)
  const CLINIC = window.CLINIC_ID || (String(location.pathname || '').match(/([A-Za-z0-9_]+)\.html?$/) || [])[1] || 'clinica';
  const TODAY = new Date().toISOString().slice(0, 10);
  const I = (n) => `<i data-lucide="${n}"></i>`;
  const st = document.createElement('style'); st.id = 'clinicas-ui-style'; st.textContent = `
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
@media(max-width:1000px){.ag-layout,.rc-layout,.sv-layout{grid-template-columns:1fr}}.pal0{--c:#4b8aae;--bg2:#d8eaf9}.pal1{--c:#3a9a4a;--bg2:#dff3e2}.pal2{--c:#7a55c4;--bg2:#e9e0fa}.pal3{--c:#d79b39;--bg2:#fdeecb}.pal4{--c:#d0507f;--bg2:#fbdce8}.pal5{--c:#1b9a92;--bg2:#d6f2ef}
.ag-card{min-width:0}.ag-card.c1{padding:4px 9px;gap:1px;justify-content:center}.ag-card.c1 b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ag-card.c1 em{font-weight:400;font-style:normal;color:#3c4d5f}.ag-card small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.due-ico{width:56px;height:56px;border-radius:50%;background:#fff1d9;color:#916012;display:grid;place-items:center;margin:0 auto 12px}.due-ico svg{width:28px;height:28px}
`; (document.head || document.documentElement).appendChild(st);
  const pr = p => data(p).prontuario || '';
  const head = (icon, title, sub, action = '') => `<div class="pg-head"><div class="pg-title">${I(icon)}<div><h1>${esc(title)}</h1><p>${sub}</p></div></div>${action}</div>`;
  const opt = (id, label, arr, v, all) => `<div class="field"><label for="${id}">${label}</label><select id="${id}"><option value="">${all}</option>${arr.map(x => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></div>`;
  const uniq = (rs, k) => [...new Set(rs.map(r => data(r)[k]).filter(Boolean))].sort();
  const mins = t => { const [h, m] = String(t || '0:0').split(':'); return h * 60 + +m; };
  const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const hash = s => [...String(s || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const newBtn = (t, label, icon = 'plus') => typeof createButton === 'function' ? createButton(t) : (can(entityModule[t] || 'agenda', 'cadastrar') ? `<button class="btn" data-new="${t}">${I(icon)} ${label}</button>` : '');

  /* ---------- Dados de demonstração (somente se ainda não existirem) ---------- */
  const fx = (id, t, title, s, p) => { if (!fixtures.some(f => f.entity_id === id)) fixtures.push({ entity_id: id, entity_type: t, title, status: s, payload: JSON.stringify(p), updated_at: '2026-05-22T12:00:00.000Z', demo: true }); };
  const fxd = r => { try { return JSON.parse(r.payload || '{}'); } catch { return {}; } };
  (function seed() {
    const vet = typeof MedVetData !== 'undefined';
    if (!ODONTO && !vet) ['Rafael Campos', 'Mariana Lopes', 'Felipe Nogueira', 'Laura Pimentel', 'Gustavo Torres'].forEach((n, i) => fx('P-10' + (i + 1), 'paciente', n, 'Ativo', { idade: (30 + i * 4) + ' anos', sexo: i % 2 ? 'Masculino' : 'Feminino', telefone: '(00) 00000-01' + (10 + i), email: n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com', prontuario: 'PR-10' + (i + 1) }));
    const pts = fixtures.filter(f => f.entity_type === 'paciente'), ag = fixtures.filter(f => f.entity_type === 'agendamento').map(fxd);
    if (!pts.length) return;
    const cnt = {}; ag.forEach(d => { if (d.date) cnt[d.date] = (cnt[d.date] || 0) + 1; });
    const day = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] || '2026-05-22';
    const rooms = [...new Set(ag.map(d => d.room).filter(Boolean))], profs = [...new Set(ag.map(d => d.professional).filter(Boolean))], svcs = [...new Set(ag.map(d => d.service).filter(Boolean))];
    if (!ODONTO && rooms.length) {
      const slots = [['08:00', '08:30'], ['09:30', '10:00'], ['10:00', '10:50'], ['11:00', '11:30'], ['14:00', '14:50'], ['15:00', '15:30']], sts = ['Agendado', 'Confirmado', 'Chegou', 'Agendado', 'Aguardando', 'Em atendimento'];
      slots.forEach(([a, b], k) => { const p = pts[(k + 3) % pts.length]; fx('A-9' + (k + 1), 'agendamento', 'Consulta · ' + p.title, sts[k], { patientId: p.entity_id, professional: profs[k % profs.length] || 'Profissional (fictício)', room: rooms[k % rooms.length], date: day, time: a, end: b, service: svcs[k % (svcs.length || 1)] || 'Consulta' }); });
      [['AT-9', 0, 'Camila (fictício)'], ['AT-8', 1, 'Lucas (fictício)'], ['AT-7', 2, 'Camila (fictício)']].forEach(([id, i, stu]) => { const p = pts[i % pts.length]; fx(id + '1', 'atendimento', 'Atendimento · ' + p.title, 'Aguardando supervisão', { patientId: p.entity_id, professional: stu, student: stu, supervisor: 'Prof.ª Elisa (fictícia)', type: 'Consulta', complaint: 'Queixa registrada pelo aluno para revisão.', notes: 'Registro de demonstração enviado para supervisão. Revise, valide ou devolva com orientação.', date: day + 'T12:00:00.000Z' }); });
    }
    fx('CO-DUE', 'cobranca', 'Mensalidade · ' + pts[0].title, 'Em aberto', { patientId: pts[0].entity_id, amountCents: 15000, paidCents: 0, dueDate: TODAY, recurrence: 'Mensal', origin: 'Mensalidade demonstrativa' });
  })();

  /* ---------- Campos de vencimento/recorrência ao criar cobrança ---------- */
  const _om = openModal;
  openModal = function (title, content, submit, handler) {
    if (/cobran/i.test(title) && /id="amount"/.test(content) && !/dueDate/.test(content)) content += `<div class="form-grid" style="margin-top:12px">${field('dueDate', 'Vencimento (opcional)', 'date')}${selectField('recurrence', 'Recorrência', [['', 'Pontual'], ['Mensal', 'Mensal']])}</div>`;
    return _om(title, content, submit, handler);
  };
  const _sn = saveNew;
  saveNew = function (r, b) {
    if (r && r.entity_type === 'cobranca' && $('#dueDate')?.value) { const p = JSON.parse(r.payload || '{}'); p.dueDate = $('#dueDate').value; p.recurrence = $('#recurrence')?.value || ''; r = { ...r, payload: JSON.stringify(p) }; }
    return _sn(r, b);
  };

  /* ---------- Agenda ---------- */
  const AG = { date: '', mode: 'dia', svc: '', prof: '', room: '', status: '', sel: '' };
  function agenda() {
    const base = list('agendamento');
    if (!AG.date) { const c = {}; base.forEach(r => { const d = data(r).date; if (d) c[d] = (c[d] || 0) + 1; }); AG.date = Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || TODAY; }
    const rooms = uniq(base, 'room'), f = r => { const d = data(r); return (!AG.svc || d.service === AG.svc) && (!AG.prof || d.professional === AG.prof) && (!AG.room || d.room === AG.room) && (!AG.status || r.status === AG.status); };
    const apps = base.filter(f), sel = AG.sel && byId(AG.sel);
    const card = (r, style = '', c1 = false) => { const d = data(r), nm = esc(byId(d.patientId)?.title || r.title); return `<button type="button" class="ag-card pal${hash(d.service) % 6} ${c1 ? 'c1' : ''} ${AG.sel === r.entity_id ? 'sel' : ''}" data-gagsel="${r.entity_id}" style="${style}" title="${nm} · ${esc(d.service || '')}"><small>${esc(d.time)} – ${esc(d.end || '')} · ${esc(r.status)}</small>${c1 ? `<b>${nm}${d.service ? ' <em>· ' + esc(d.service) + '</em>' : ''}</b>` : `<b>${nm}</b><span>${esc(d.service || '')}</span>`}</button>`; };
    let grid;
    if (AG.mode === 'dia') {
      const cols = (AG.room ? [AG.room] : rooms).length ? (AG.room ? [AG.room] : rooms) : ['Sala'], day = apps.filter(r => data(r).date === AG.date);
      const lo = Math.min(480, ...day.map(r => Math.floor(mins(data(r).time) / 60) * 60)), hi = Math.max(780, ...day.map(r => Math.ceil(mins(data(r).end || data(r).time) / 60) * 60)), rows = Math.max(2, (hi - lo) / 30);
      grid = `<div class="ag-grid" style="grid-template-columns:70px repeat(${cols.length},minmax(170px,1fr));grid-template-rows:auto repeat(${rows},60px)"><div style="grid-row:1;grid-column:1"></div>
        ${cols.map((c, i) => `<div class="ag-boxh" style="grid-row:1;grid-column:${i + 2}">${I('door-open')}<div><b>${esc(c)}</b><small>${day.filter(r => data(r).room === c).length} agendamentos</small></div></div>`).join('')}
        ${Array.from({ length: rows }, (_, r) => { const m = lo + r * 30; return `<div class="ag-t" style="grid-row:${r + 2};grid-column:1">${String(Math.floor(m / 60)).padStart(2, '0')}:${m % 60 ? '30' : '00'}</div>` + cols.map((c, k) => `<div class="ag-slot" style="grid-row:${r + 2};grid-column:${k + 2}"></div>`).join(''); }).join('')}
        ${day.map(r => { const d = data(r), c = cols.indexOf(d.room); if (c < 0) return ''; const s0 = Math.min(rows - 1, Math.max(0, Math.floor((mins(d.time) - lo) / 30))), n = Math.max(1, Math.ceil((mins(d.end || d.time) - mins(d.time)) / 30)); return card(r, `grid-column:${c + 2};grid-row:${s0 + 2}/span ${n}`, n === 1); }).join('')}</div>`;
    } else {
      const wd = (new Date(AG.date + 'T12:00:00Z').getUTCDay() + 6) % 7, mon = addDays(AG.date, -wd), days = [0, 1, 2, 3, 4].map(i => addDays(mon, i));
      grid = `<div class="ag-week">${days.map((dd, i) => `<div><div class="ag-t" style="margin-bottom:4px">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex'][i]} ${fmtDate(dd)}</div>${apps.filter(r => data(r).date === dd).sort((a, b) => (data(a).time || '').localeCompare(data(b).time || '')).map(r => card(r)).join('') || '<small style="padding:8px;display:block;color:var(--muted)">Sem agendamentos</small>'}</div>`).join('')}</div>`;
    }
    let panel = '<aside class="ag-panel"><p class="section-note">Selecione um horário para ver paciente, período, sala e profissional.</p></aside>';
    if (sel && visible(sel)) {
      const d = data(sel), p = byId(d.patientId), live = !['Cancelado', 'Concluído'].includes(sel.status), row = (ic, t) => `<div class="ap-row">${I(ic)}<span>${t}</span></div>`;
      panel = `<aside class="ag-panel"><div class="ap-head"><div class="who">${I('user-round')}<div><h2>${esc(p?.title || sel.title)}</h2><small>${esc(p ? pr(p) : '')}</small></div></div><button class="icon-btn" type="button" data-gagclose="1" aria-label="Fechar">${I('x')}</button></div>
        <div style="margin:10px 0">${badge(sel.status)}</div>${row('calendar', fmtDate(d.date))}${row('clock', esc(d.time) + ' – ' + esc(d.end || ''))}${row('door-open', esc(d.room || '—'))}${row('stethoscope', esc(d.service || '—'))}${row('user', 'Profissional: ' + esc(d.professional || '—'))}${d.arrivedAt ? row('check', 'Chegada: ' + esc(d.arrivedAt)) : ''}
        <div class="ap-actions">${live && !d.arrivedAt && can('recepcao', 'editar') ? `<button class="btn" data-act="arrive" data-id="${sel.entity_id}">${I('check')} Registrar chegada</button>` : ''}
        ${p && can('pacientes') ? `<button class="btn secondary" data-gficha="${d.patientId}">${I('external-link')} Abrir ficha</button>` : ''}
        ${live && can('atendimentos', 'cadastrar') ? `<button class="btn secondary" data-start="${sel.entity_id}">Abrir atendimento</button>` : ''}
        ${live && can('agenda', 'editar') ? `<button class="btn secondary" data-act="reschedule" data-id="${sel.entity_id}">Reagendar</button>` : ''}
        ${live && can('agenda', 'cancelar') ? `<button class="btn secondary" data-act="cancel" data-id="${sel.entity_id}">Cancelar</button>` : ''}
        <button class="btn secondary" data-act="copy" data-id="${sel.entity_id}">Copiar confirmação</button></div>
        ${(d.rescheduleHistory || []).length ? `<p class="section-note">Histórico: ${d.rescheduleHistory.map(h => esc(h.from + ' → ' + h.reason)).join('; ')}</p>` : ''}</aside>`;
    }
    const acts = `<div class="actions">${can('agenda', 'cadastrar') ? `<button class="btn secondary" data-new="bloqueio">${I('calendar-off')} Bloquear recurso</button>` : ''}${newBtn('agendamento', 'Novo agendamento', 'calendar-plus')}</div>`;
    return head('calendar', 'Agenda', 'Agendamentos por sala, com filtros e painel de ações.', acts) +
      `<div class="filters">${opt('gag-svc', 'Serviço', uniq(base, 'service'), AG.svc, 'Todos os serviços')}${opt('gag-prof', 'Profissional', uniq(base, 'professional'), AG.prof, 'Todos os profissionais')}${opt('gag-room', 'Sala', rooms, AG.room, 'Todas as salas')}${opt('gag-status', 'Status', [...new Set(base.map(r => r.status))].sort(), AG.status, 'Todos os status')}</div>
      <div class="datebar"><div class="seg"><button class="${AG.mode === 'dia' ? 'on' : ''}" data-gagmode="dia">Dia</button><button class="${AG.mode === 'semana' ? 'on' : ''}" data-gagmode="semana">Semana</button></div>
      <button class="icon-btn" data-gagnav="-1" aria-label="Anterior">${I('chevron-left')}</button><span class="pill">${I('calendar')} ${fmtDate(AG.date)}</span><button class="icon-btn" data-gagnav="1" aria-label="Próximo">${I('chevron-right')}</button></div>
      <div class="ag-layout"><div>${grid}</div>${panel}</div>
      <section class="panel" style="margin-top:16px"><h2>Bloqueios e indisponibilidades</h2>${table(list('bloqueio'), 'Nenhum bloqueio registrado.')}</section>`;
  }

  /* ---------- Recepção e fila ---------- */
  const RC = { stage: 'Aguardando chegada', sel: '' };
  const STAGES = [['Aguardando chegada', ['Agendado', 'Confirmado']], ['Aguardando atendimento', ['Chegou', 'Aguardando']], ['Em atendimento', ['Em atendimento']]];
  function receptionView() {
    const q = list('agendamento'), inStage = s => q.filter(r => STAGES.find(x => x[0] === s)[1].includes(r.status));
    const rows = inStage(RC.stage).sort((a, b) => (data(a).date + data(a).time).localeCompare(data(b).date + data(b).time));
    const sel = byId(RC.sel) && rows.includes(byId(RC.sel)) ? byId(RC.sel) : rows[0], clin = can('atendimentos');
    let panel = '<aside class="ag-panel"><div class="empty">Nenhum paciente selecionado.</div></aside>';
    if (sel) {
      const d = data(sel), p = byId(d.patientId), row = (ic, label, val) => `<div class="dl-row">${I(ic)}<div><b>${label}</b>${val}</div></div>`;
      panel = `<aside class="ag-panel"><div class="ap-head"><div class="who"><span class="avatar big">${I('user-round')}</span><div><h2>${esc(p?.title || sel.title)}</h2><span class="tag">${esc(p ? pr(p) : '')}</span></div></div>${p && can('pacientes') ? `<button class="link-btn" data-gficha="${d.patientId}">Ver prontuário ${I('external-link')}</button>` : ''}</div><div style="margin-top:14px">
        ${row('stethoscope', 'Motivo / serviço', esc(d.service || '—'))}${row('clock', 'Horário', fmtDate(d.date) + ' ' + esc(d.time) + (d.arrivedAt ? ' · chegada ' + esc(d.arrivedAt) : ''))}
        ${clin ? row('triangle-alert', 'Alertas de saúde', p && data(p).alertas ? `<span class="alertpill">${esc(data(p).alertas)}</span>` : '—') : row('lock', 'Dados clínicos', '<small>Restritos à equipe autorizada.</small>')}
        ${row('user-round', 'Profissional', esc(d.professional || '—'))}${row('door-open', 'Sala', esc(d.room || '—'))}</div>
        <div class="ap-actions">${!d.arrivedAt && can('recepcao', 'editar') ? `<button class="btn" data-act="arrive" data-id="${sel.entity_id}">${I('check')} Registrar chegada</button>` : ''}
        ${can('atendimentos', 'cadastrar') ? `<button class="btn ${d.arrivedAt ? '' : 'secondary'}" data-start="${sel.entity_id}">${I('arrow-right')} Encaminhar para atendimento</button>` : ''}</div></aside>`;
    }
    const acts = `<div class="actions">${can('recepcao', 'editar') ? `<button class="btn" data-garrive="1">${I('user-plus')} Registrar chegada</button>` : ''}${newBtn('agendamento', 'Novo agendamento', 'calendar-plus')}</div>`;
    return head('users', 'Recepção e fila', 'Chegada registrada manualmente; prioridade clínica não é atribuída automaticamente.', acts) +
      `<div class="rc-tabs">${STAGES.map(([s]) => `<button class="${RC.stage === s ? 'on' : ''}" data-grcstage="${s}">${s} (${inStage(s).length})</button>`).join('')}</div>
      <div class="rc-layout"><section class="panel" style="padding:8px 0">${rows.length ? `<div class="table-wrap"><table class="qt"><thead><tr><th>Paciente</th><th>Horário ↑</th><th>Motivo</th><th>Status</th></tr></thead><tbody>${rows.map(r => { const d = data(r), p = byId(d.patientId); return `<tr data-grcsel="${r.entity_id}" class="${sel && sel.entity_id === r.entity_id ? 'on' : ''}"><td><div class="who"><span class="avatar">${I('user-round')}</span><div><b>${esc(p?.title || r.title)}</b><small>${esc(p ? pr(p) : '')}</small></div></div></td><td>${esc(d.time)}<br><small>${fmtDate(d.date)}</small></td><td>${esc(d.service || '')}</td><td><span class="stpill">${I('clock')} ${esc(r.status)}</span></td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty" style="margin:16px">Nenhum paciente nesta etapa.</div>'}</section>${panel}</div>`;
  }
  function arriveFlow() {
    const open = list('agendamento').filter(r => ['Agendado', 'Confirmado'].includes(r.status) && !data(r).arrivedAt);
    if (!open.length) return toast('Não há agendamentos aguardando chegada.');
    openModal('Registrar chegada', selectField('appt', 'Agendamento *', open.map(r => [r.entity_id, r.title + ' · ' + fmtDate(data(r).date) + ' ' + data(r).time])), 'Continuar', e => { e.preventDefault(); const id = values().appt; closeModal(); const r = byId(id); if (r) simpleAction(r, 'arrive'); });
  }

  /* ---------- Perfil do paciente ---------- */
  const TI = { 'Resumo': 'file-text', 'Histórico clínico': 'history', 'Consultas': 'calendar', 'Exames': 'flask-conical', 'Orçamentos': 'tag', 'Conta/cobranças': 'wallet', 'Cirurgias': 'heart-pulse', 'Internamentos': 'bed', 'Prescrições': 'clipboard-list', 'Documentos': 'folder' };
  const _pd = patientDetail;
  patientDetail = function (r) {
    const html = _pd(r), d = data(r);
    const mh = html.match(/<div class="(?:page-heading|pg-head)">[\s\S]*?<\/p><\/div>(?:<\/div>)?([\s\S]*?)<\/div>\s*<div class="tabs"[^>]*>([\s\S]*?)<\/div>/);
    if (!mh) return html;
    const actions = mh[1], names = [...mh[2].matchAll(/data-tab="([^"]+)"/g)].map(m => m[1]);
    let content = html.slice(html.indexOf(mh[0]) + mh[0].length);
    if (can('orcamentos') && !names.includes('Orçamentos')) { const at = names.findIndex(n => /cobran/i.test(n)); names.splice(at < 0 ? names.length : at, 0, 'Orçamentos'); }
    if (patientTab === 'Orçamentos') content = `<section class="panel">${table(all().filter(x => x.entity_type === 'orcamento' && data(x).patientId === r.entity_id && visible(x)), 'Nenhum orçamento para este paciente.')}</section>`;
    if (!names.includes(patientTab)) patientTab = 'Resumo';
    const clin = can('atendimentos'), al = clin && d.alertas ? d.alertas : '';
    return `<div class="crumb"><button class="link-btn" data-nav="pacientes">Pacientes</button> / ${esc(r.title)}</div>
      <section class="pcard"><span class="avatar big">${I('user-round')}</span><div><h1>${esc(r.title)}</h1><div class="pmeta"><span class="tag">${esc(d.prontuario || r.entity_id)}</span>${d.idade ? `<span>${esc(d.idade)}</span>` : ''}${d.telefone ? `<span>${esc(d.telefone)}</span>` : ''}${d.sexo ? `<span>${esc(d.sexo)}</span>` : ''}${d.especie ? `<span>${esc(d.especie)}</span>` : ''}</div></div>${al ? `<span class="palert">${I('triangle-alert')} ${esc(al)}</span>` : ''}<div style="margin-left:auto">${actions}</div></section>
      <div class="ptabs" role="tablist" aria-label="Seções do paciente">${names.map(t => `<button role="tab" class="${patientTab === t ? 'on' : ''}" aria-selected="${patientTab === t}" data-tab="${t}">${I(TI[t] || 'file')}${t}</button>`).join('')}</div>${content}`;
  };

  /* ---------- Supervisão acadêmica ---------- */
  const SV = { student: '', status: 'Aguardando revisão', sel: '' };
  const svState = r => r.status === 'Aguardando supervisão' ? 'Aguardando revisão' : r.status === 'Rascunho' && data(r).reviewComment ? 'Devolvido' : r.status === 'Finalizado' && data(r).validatedBy ? 'Validado' : r.status;
  const svItems = () => list('atendimento').filter(r => data(r).student || r.status === 'Aguardando supervisão').map(r => ({ r, d: data(r), st: svState(r) })).filter(i => (!SV.student || i.d.student === SV.student) && (SV.status === 'Todos' || i.st === SV.status));
  function supervision() {
    const items = svItems(), cur = items.find(i => i.r.entity_id === SV.sel) || items[0], canRev = can('supervisao', 'validar') && profile !== 'Aluno ou estagiário';
    let right = '<section class="panel"><div class="empty">Nenhum registro para revisar com os filtros atuais.</div></section>';
    if (cur) {
      const d = cur.d, p = byId(d.patientId), pending = cur.r.status === 'Aguardando supervisão';
      const tabs = ['Resumo', 'Histórico clínico', 'Consultas', ...(modules.some(m => m[0] === 'exames') ? ['Exames'] : [])];
      right = `<section class="panel"><div class="crumb"><span>Pacientes</span> / ${esc(p?.title || '')}</div><div class="who"><span class="avatar big">${I('user-round')}</span><div><h2 style="margin:0">${esc(p?.title || cur.r.title)}</h2><small>${esc(p ? pr(p) : '')}</small></div></div>
        <div class="ftabs">${tabs.map(t => `<button class="${t === 'Histórico clínico' ? 'on' : ''}" data-gsvtab="${t}" data-pt="${d.patientId}">${t}</button>`).join('')}</div>
        <h2>Revisar atendimento</h2>
        <div class="meta3"><div>${I('graduation-cap')}<div><small>Aluno</small><b>${esc(d.student || d.professional || '—')}</b></div></div><div>${I('user-round')}<div><small>Supervisor</small><b>${esc(d.supervisor || '—')}</b></div></div><div>${I('calendar')}<div><small>Data do registro</small><b>${fmtDate(d.date)}</b></div></div></div>
        <div class="ro"><small>Atendimento (somente leitura) · ${esc(d.type || '')}</small>${esc(d.complaint || '')}\n${esc(d.notes || '')}</div>
        ${canRev && pending ? `<div class="field" style="margin-top:14px"><label for="gsv-comment">Comentário para o aluno</label><textarea id="gsv-comment" placeholder="Digite sua orientação, apontamentos ou ajustes necessários…"></textarea></div>` : ''}
        <div class="actions" style="justify-content:flex-end;margin-top:14px">${p && can('pacientes') ? `<button class="btn secondary" data-gficha="${d.patientId}">${I('external-link')} Abrir ficha</button>` : ''}${canRev && pending ? `<button class="btn secondary" data-gsvreturn="${cur.r.entity_id}">${I('pencil')} Solicitar correção</button><button class="btn" data-gsvvalidate="${cur.r.entity_id}">${I('check')} Validar registro</button>` : cur.st === 'Validado' ? `<span class="section-note">Validado por ${esc(d.validatedBy)} em ${esc(d.validatedAt || '')}.</span>` : ''}</div>
        <h3 style="margin-top:22px">${I('history')} Histórico de revisões</h3>${(d.reviewHistory || []).length ? d.reviewHistory.map(h => `<div class="hist-row">${I('clock')}<div><b>${esc(h.at)} • ${esc(h.by)}</b><br><span class="section-note">${esc(h.action)}</span></div></div>`).join('') : '<p class="section-note">Sem histórico.</p>'}</section>`;
    }
    return head('graduation-cap', 'Supervisão acadêmica', 'Acompanhe e revise os registros clínicos realizados pelos alunos.') +
      `<div class="filters">${opt('gsv-student', 'Aluno', uniq(list('atendimento'), 'student'), SV.student, 'Todos os alunos')}<div class="field"><label for="gsv-status">Status</label><select id="gsv-status">${['Aguardando revisão', 'Devolvido', 'Validado', 'Todos'].map(s => `<option ${s === SV.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div></div>
      <div class="sv-layout"><section class="panel" style="padding:0;overflow:hidden"><h3 style="padding:16px 16px 8px;margin:0">Fila de revisões (${items.length})</h3>${items.map(i => { const p = byId(i.d.patientId); return `<button class="sv-item ${cur && cur.r.entity_id === i.r.entity_id ? 'on' : ''}" data-gsvsel="${i.r.entity_id}"><span class="avatar">${I('user-round')}</span><span class="grow"><b>${esc(p?.title || i.r.title)}</b><small>${esc(p ? pr(p) : '')} · ${esc(i.d.student || '')}</small></span>${badge(i.st === 'Aguardando revisão' ? 'Aguardando revisão' : i.st)}</button>`; }).join('') || '<div class="empty" style="margin:12px">Fila vazia.</div>'}</section>${right}</div>`;
  }
  async function svAct(id, kind, btn) {
    const r = byId(id), c = ($('#gsv-comment')?.value || '').trim();
    if (!r || r.status !== 'Aguardando supervisão') { toast('Registro atualizado por outra ação. Recarregue antes de revisar.'); return render(); }
    if (kind === 'return' && !c) return toast('Informe a justificativa para devolver o registro.');
    const d = data(r), h = [...(d.reviewHistory || []), { at: stamp(), by: profile, action: (kind === 'return' ? 'Devolvido para ajustes' : 'Validado') + (c ? ': ' + c : '') }];
    const patch = kind === 'return' ? { reviewComment: c, reviewHistory: h } : { validatedBy: profile, validatedAt: stamp(), reviewComment: c, reviewHistory: h };
    if (await updateRecord(r, patch, kind === 'return' ? 'Rascunho' : 'Finalizado', btn)) render();
  }

  const _ml = moduleList;
  if (!ODONTO) { moduleList = m => m === 'agenda' ? agenda() : m === 'supervisao' ? supervision() : _ml(m); reception = receptionView; }

  /* ---------- Aviso de vencimento (modal) ---------- */
  const seenKey = id => 'due:' + CLINIC + ':' + id;
  const seen = id => { try { return sessionStorage.getItem(seenKey(id)); } catch { return null; } };
  const mark = ids => ids.forEach(id => { try { sessionStorage.setItem(seenKey(id), '1'); } catch { /* sem sessionStorage */ } });
  const dueList = () => !can('financeiro') ? [] : list('cobranca').filter(r => { const d = data(r); return d.dueDate && d.dueDate <= TODAY && (d.amountCents || 0) - (d.paidCents || 0) > 0 && !['Paga', 'Estornado', 'Cancelado'].includes(r.status); });
  function showDue() {
    const due = dueList().filter(r => !seen(r.entity_id)), root = $('#modal-root');
    if (!due.length || !root || root.innerHTML.trim()) return;
    root.innerHTML = `<div class="modal-backdrop" id="due-modal"><div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="due-title" style="width:min(520px,100%);text-align:center"><div class="due-ico">${I('bell-ring')}</div><h2 id="due-title">Pagamento a receber</h2><p class="section-note">Há ${due.length > 1 ? due.length + ' cobranças' : 'uma cobrança'} com vencimento hoje ou em atraso.</p>
      <div class="checklist" style="text-align:left;margin:14px 0">${due.map(r => { const d = data(r), over = d.dueDate < TODAY; return `<div class="check-row"><span><b>${esc(byId(d.patientId)?.title || r.title)}</b><br><small>${esc(d.recurrence === 'Mensal' ? 'Mensalidade' : 'Cobrança')} · vence em ${fmtDate(d.dueDate)}${over ? ' · <b style="color:#a33a3b">em atraso</b>' : ''}</small></span><strong>${money((d.amountCents || 0) - (d.paidCents || 0))}</strong></div>`; }).join('')}</div>
      <div class="actions" style="justify-content:center"><button class="btn secondary" data-gduelater="1">Lembrar depois</button><button class="btn" data-gduepay="${due[0].entity_id}">${I('wallet')} Receber agora</button></div></div></div>`;
    icons();
  }

  /* ---------- Histórico do navegador (Voltar/Avançar, recarregar e links diretos) ---------- */
  const hashOf = () => '#/' + [current, activeDetail || '', activeDetail ? patientTab : ''].map(encodeURIComponent).join('/').replace(/\/+$/, '');
  const apply = h => { const [c, d, t] = h.slice(2).split('/').map(x => { try { return decodeURIComponent(x); } catch { return ''; } }); current = c && can(c) ? c : 'painel'; activeDetail = null; if (d) { const r = byId(d); if (r && visible(r)) { activeDetail = d; if (t) patientTab = t; } } };
  let last = null; const _render = render;
  render = function () {
    _render(); const h = hashOf();
    if (h !== last) { try { last === null ? history.replaceState({ h }, '', h) : history.pushState({ h }, '', h); } catch { /* sem History API */ } last = h; }
    setTimeout(showDue, 30);
  };
  window.addEventListener('popstate', () => { if (!location.hash.startsWith('#/')) return; apply(location.hash); last = hashOf(); if (last !== location.hash) { try { history.replaceState({ h: last }, '', last); } catch { /* ignore */ } } _render(); });
  if (location.hash.startsWith('#/')) apply(location.hash);

  /* ---------- Documentação: atualizações e como acessar ---------- */
  const UPDATES = [
    ['Agenda Dia/Semana', 'Grade por sala, filtros e painel de ações (chegada, ficha, atendimento, reagendar, cancelar, copiar confirmação).', 'Menu Agenda → alternar Dia/Semana → clicar num horário.', 'agenda'],
    ['Recepção e fila', 'Fila por etapa (aguardando chegada, aguardando atendimento, em atendimento) com painel do paciente.', 'Menu Recepção e fila → escolher a etapa → clicar na linha do paciente.', 'recepcao'],
    ['Perfil do paciente', 'Cabeçalho com prontuário e alerta clínico, abas com ícones e conteúdo por aba.', 'Menu Pacientes → clicar no nome do paciente → trocar de aba.', 'pacientes'],
    ['Supervisão acadêmica', 'Fila de revisões, leitura do registro, comentário ao aluno, validar ou solicitar correção (justificativa obrigatória).', 'Menu Supervisão acadêmica → escolher o registro → Validar registro ou Solicitar correção.', 'supervisao'],
    ['Aviso de vencimento', 'Janela de pagamento a receber quando há cobrança vencendo hoje ou em atraso; cobranças aceitam Vencimento e Recorrência Mensal.', 'Aparece ao abrir o sistema com perfil Financeiro, Gestão ou Administração. Para criar: Caixa e financeiro → Nova cobrança.', 'financeiro'],
    ['Botões "Novo …"', 'Cada tela mostra o botão com o nome certo (Novo paciente, Novo exame, Nova cobrança…).', 'Cabeçalho de cada módulo.', 'pacientes'],
    ['Correção do salvamento', 'Chegada, reagendamento, cancelamento, adendo, aprovação de orçamento, pagamento e demais ações agora gravam sem erro.', 'Abrir o registro → usar o botão da ação → confirmar.', 'agenda'],
    ['Checklist do Ambiente', 'A antiga aba "Escopo e validação" foi renomeada.', 'Menu Gestão → Checklist do Ambiente.', 'escopo'],
    ['Botão Voltar do navegador', 'Cada tela e aba tem endereço próprio (#/módulo/registro/aba); Voltar, Avançar e recarregar mantêm o lugar.', 'Use a seta de voltar do navegador ou copie o endereço da barra.', 'painel'],
    ['Serviço de dados compartilhado', 'Todas as clínicas gravam em clinicas-data.js (chave clinicas-positivo:v2) com migração e backup das chaves antigas.', 'Transparente; ver Configurações para restaurar dados de demonstração.', 'configuracoes']
  ];
  if (ODONTO) UPDATES.push(['Odontograma, plano e anamnese', 'Dentes FDI por face, plano de tratamento, anamnese e evoluções.', 'Pacientes → paciente → abas Odontograma, Plano, Anamnese, Evoluções.', 'pacientes'], ['Orçamento, cobrança, recebimento e estorno', 'Aprovação por item, cobrança dos itens aprovados, recibo e estorno.', 'Paciente → Orçamentos / Cobranças; ou Caixa e financeiro.', 'financeiro'], ['Encaminhamentos entre clínicas', 'Pendente → Aceito → Agendado → Concluído, com recusa/cancelamento por motivo.', 'Paciente → aba Encaminhamentos.', 'pacientes'], ['Correção autorizada', 'Registro validado só muda com autorização do professor (uso único) e gera nova versão.', 'Evoluções/Anamnese → Solicitar correção; Supervisão → Autorizar correção.', 'supervisao']);
  const _doc = documentation;
  documentation = () => _doc() + `<section class="panel" id="doc-atualizacoes"><h2>Atualizações desta versão e como acessar</h2><p class="section-note">Lista das melhorias aplicadas e o caminho na interface para chegar a cada uma.</p><div class="table-wrap"><table><thead><tr><th>Atualização</th><th>O que faz</th><th>Como acessar</th><th></th></tr></thead><tbody>${UPDATES.map(u => `<tr><td><b>${esc(u[0])}</b></td><td>${esc(u[1])}</td><td>${esc(u[2])}</td><td>${can(u[3]) ? `<button class="btn small secondary" data-nav="${u[3]}">Abrir</button>` : ''}</td></tr>`).join('')}</tbody></table></div></section>`;

  /* ---------- Eventos ---------- */
  document.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-grcsel]'); if (tr && !e.target.closest('button')) { RC.sel = tr.dataset.grcsel; render(); return; }
    const b = e.target.closest('button'); if (!b) return; const s = b.dataset;
    if (s.gagsel) { AG.sel = s.gagsel; render(); } else if (s.gagclose) { AG.sel = ''; render(); }
    else if (s.gagmode) { AG.mode = s.gagmode; render(); } else if (s.gagnav) { AG.date = addDays(AG.date, +s.gagnav * (AG.mode === 'dia' ? 1 : 7)); render(); }
    else if (s.gficha) { if (!can('pacientes')) return toast('Acesso restrito.'); patientTab = 'Resumo'; navigate('pacientes', s.gficha); }
    else if (s.grcstage) { RC.stage = s.grcstage; RC.sel = ''; render(); } else if (s.garrive) arriveFlow();
    else if (s.gsvsel) { SV.sel = s.gsvsel; render(); } else if (s.gsvvalidate) svAct(s.gsvvalidate, 'validate', b); else if (s.gsvreturn) svAct(s.gsvreturn, 'return', b);
    else if (s.gsvtab) { if (!can('pacientes')) return toast('Acesso restrito.'); navigate('pacientes', s.pt); patientTab = s.gsvtab; render(); }
    else if (s.gduelater) { mark(dueList().map(r => r.entity_id)); $('#modal-root').innerHTML = ''; }
    else if (s.gduepay) { mark(dueList().map(r => r.entity_id)); $('#modal-root').innerHTML = ''; navigate('financeiro', s.gduepay); const r = byId(s.gduepay); if (r) simpleAction(r, 'pay'); }
  });
  document.addEventListener('change', e => {
    const m = { 'gag-svc': 'svc', 'gag-prof': 'prof', 'gag-room': 'room', 'gag-status': 'status' }[e.target.id]; if (m) { AG[m] = e.target.value; render(); }
    const n = { 'gsv-student': 'student', 'gsv-status': 'status' }[e.target.id]; if (n) { SV[n] = e.target.value; SV.sel = ''; render(); }
  });
  render();
})();
