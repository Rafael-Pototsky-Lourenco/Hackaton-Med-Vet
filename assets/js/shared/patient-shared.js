/* Cadastro administrativo comum às quatro clínicas humanas. */
const patientClinic=document.currentScript.dataset.clinic;
const clinicLabels={odonto:'Odontologia',fisioterapia:'Fisioterapia',psicologia:'Psicologia',nutricao:'Nutrição'};
function patientSearchText(r){const d=data(r);return [r.title,r.status,r.entity_id,...(r.entity_type==='paciente'?[d.nomeSocial,d.telefone,d.email,d.responsavel,String(d.telefone||'').replace(/\D/g,'')]:[])].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function patientAge(d){
 if(!d.nascimento)return d.idadeOriginal||d.idade? (d.idadeOriginal||d.idade)+' (dado original; nascimento não informado)':'Não informado';
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const [y,m,day]=d.nascimento.split('-').map(Number), [ty,tm,td]=today.split('-').map(Number);
 return (ty-y-(tm<m||(tm===m&&td<day)?1:0))+' anos';
}
function patientLabel(r){const d=data(r);return r.title+' · '+r.entity_id+' · '+(d.nascimento?fmtDate(d.nascimento):'Nascimento não informado')+' · '+([d.telefone,d.email].filter(Boolean).join(' · ')||'Contato não informado')+' · '+r.status;}
patientOptions=function(){return list('paciente').filter(r=>r.status==='Ativo').map(r=>[r.entity_id,patientLabel(r)]);};
patientDetail=function(r){
 if(!r||!visible(r))return '<div class="notice" role="alert">Acesso restrito</div>';
 const d=data(r),access=ClinicData.patientAccess(patientClinic,r.entity_id),tabs=['Cadastro','Agenda','Encaminhamentos','Prontuários','Financeiro'].filter(tab=>access[tab]?.length);
 const tabMessages=[];for(const tab of ['Agenda','Encaminhamentos','Prontuários','Financeiro'])if(!tabs.includes(tab))tabMessages.push(tab);
 if(!tabs.includes(patientTab))patientTab='Cadastro';
 let body='';
 if(patientTab==='Cadastro')body='<section class="panel"><h2>Dados gerais</h2>'+[
 ['Identificador global',r.entity_id],['Nome completo',r.title],['Nome social',d.nomeSocial],['Nascimento',d.nascimento?fmtDate(d.nascimento):'Não informado'],['Idade',patientAge(d)],['Telefone',d.telefone],['E-mail',d.email],['Responsável',d.responsavel],['Situação',r.status],['Clínicas vinculadas',(d.clinics||[]).map(c=>clinicLabels[c]||c).join(', ')]
 ].map(([label,value])=>'<p><strong>'+label+':</strong> '+esc(value||'Não informado')+'</p>').join('')+
 (can('pacientes','editar')?'<button class="btn secondary" data-patient-edit="'+esc(r.entity_id)+'">Editar cadastro</button> <button class="btn secondary" data-patient-status="'+esc(r.entity_id)+'">'+(r.status==='Ativo'?'Inativar':'Reativar')+'</button>':'')+
 (can('pacientes','cadastrar')&&!(d.clinics||[]).includes(patientClinic)?' <button class="btn" data-patient-link="'+esc(r.entity_id)+'">Vincular a '+clinicLabels[patientClinic]+'</button>':'')+'</section>';
 else if(patientTab==='Prontuários'){
  const clinical=ClinicData.patientClinical(patientClinic,r.entity_id);
  body=access['Prontuários'].map(c=>{
   const groups=new Map();for(const x of clinical.filter(x=>x.clinic===c)){const caseId=data(x).caseId||'Caso legado';if(!groups.has(caseId))groups.set(caseId,[]);groups.get(caseId).push(x);}
   let legacy={};try{legacy=ClinicData.clinicalSummary(c,r.entity_id);}catch{}
   const notes=Object.entries(legacy).filter(([k])=>!['patientId','clinic','caseId'].includes(k)).map(([k,v])=>'<p><strong>'+esc(({alertas:'Alerta clínico legado',peso:'Peso legado',altura:'Altura legada'})[k]||k)+':</strong> '+esc(v)+'</p>').join('');
   return '<section class="panel"><h2>'+esc(clinicLabels[c])+' · Prontuários por caso</h2>'+notes+([...groups].map(([id,rows])=>'<h3>'+esc(id)+'</h3>'+patientClinicalTable(rows)).join('')||'<div class="empty">Nenhum registro nesta especialidade.</div>')+'</section>';
  }).join('');
 }else{
  const types=patientTab==='Agenda'?['agendamento']:patientTab==='Financeiro'?['cobranca','orcamento','pagamento','recibo']:['encaminhamento'];
  const rows=ClinicData.administrative(r.entity_id,types).filter(x=>(access[patientTab].includes(x.clinic)||x.entity_type==='encaminhamento'&&access[patientTab].includes(data(x).destinationClinic))&&(ClinicAuth.canRead(x,patientClinic)||ClinicAuth.canRead(x,x.clinic)));
  body='<section class="panel"><h2>'+patientTab+'</h2><p class="section-note">Registros administrativos por clínica responsável.</p>'+(rows.length?'<div class="table-wrap"><table><thead><tr><th>Clínica</th><th>Identificador</th><th>Situação</th><th>Detalhes administrativos</th></tr></thead><tbody>'+rows.map(x=>{const p=data(x);return '<tr><td>'+esc(clinicLabels[x.clinic]||x.clinic)+'</td><td>'+patientRecordLink(x)+'</td><td>'+esc(x.status)+'</td><td>'+esc(patientTab==='Agenda'?fmtDate(p.date)+' '+(p.time||'')+'–'+(p.end||''):patientTab==='Financeiro'?(x.clinic==='psicologia'?'Sessão de Psicologia · ':'')+money(p.amountCents)+' · Recebido: '+money(p.paidCents):'Destino: '+(clinicLabels[p.destinationClinic]||p.destinationClinic||'Não informado'))+'</td></tr>';}).join('')+'</tbody></table></div>':'<div class="empty">Nenhum registro nesta aba.</div>')+'</section>';
 }
 return heading(r.title,'Paciente fictício · Identificador global: '+r.entity_id,'<button class="btn secondary" data-nav="pacientes">Voltar à lista</button>')+'<div class="tabs" role="tablist" aria-label="Seções da ficha geral">'+tabs.map(t=>'<button role="tab" aria-selected="'+(patientTab===t)+'" class="'+(patientTab===t?'active':'')+'" data-tab="'+t+'">'+t+'</button>').join('')+'</div>'+(tabMessages.length?'<p class="section-note">Seções restritas para esta conta e paciente: '+esc(tabMessages.join(', '))+'.</p>':'')+body;
};

function patientRecordLink(r){
 if(r.clinic===patientClinic||r.entity_type==='encaminhamento'&&visible(r))return '<button class="link-btn" data-detail="'+esc(r.entity_id)+'">'+esc(r.entity_id)+'</button>';
 const m=ClinicAuth.entityModule[r.entity_type];if(m==='encaminhamentos')return esc(r.entity_id);
 return '<a class="link-btn" href="'+encodeURIComponent(r.clinic)+'.html#'+encodeURIComponent(m)+'/'+encodeURIComponent(r.entity_id)+'">'+esc(r.entity_id)+' · Abrir na clínica</a>';
}
function patientClinicalTable(rows){
 if(rows.every(r=>r.clinic===patientClinic))return table(rows);
 return '<div class="table-wrap"><table><thead><tr><th>Registro</th><th>Identificador</th><th>Situação</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.title)+'</td><td>'+patientRecordLink(r)+'</td><td>'+esc(r.status)+'</td></tr>').join('')+'</tbody></table></div>';
}

function patientForm(existing=null){
 if(!can('pacientes',existing?'editar':'cadastrar',existing))return toast('Acesso restrito');
 const d=existing?data(existing):{};
 const html='<div class="form-grid">'+field('name','Nome completo *','text',existing?.title||'')+field('social','Nome social','text',d.nomeSocial||'')+field('birth','Data de nascimento','date',d.nascimento||'')+field('phone','Telefone','tel',d.telefone||'')+field('email','E-mail','email',d.email||'')+field('guardian','Responsável (quando aplicável)','text',d.responsavel||'')+'</div>'+(d.idadeOriginal?'<p>Idade original preservada: '+esc(d.idadeOriginal)+'</p>':'')+'<div id="patient-duplicates" class="notice" aria-live="polite"></div>';
 let confirmed='';
 openModal(existing?'Editar cadastro geral':'Novo paciente — cadastro único',html,'Salvar cadastro',async e=>{
  e.preventDefault();const v=values();if(!v.name.trim()){err('name','Informe o nome completo.');return;}
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  if(v.birth&&(isNaN(Date.parse(v.birth))||new Date(v.birth+'T12:00:00Z').toISOString().slice(0,10)!==v.birth||v.birth>today)){err('birth','Informe uma data de nascimento válida até hoje.');return;}
  if(v.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)){err('email','Informe um e-mail válido.');return;}
  const matches=findDuplicates(v), signature=JSON.stringify(v);
  if(!existing&&matches.length&&confirmed!==signature){confirmed=signature;showDuplicates();document.getElementById('patient-duplicates').insertAdjacentHTML('beforeend','<p>Se for outra pessoa, confira os dados e clique novamente em Salvar cadastro para criar um homônimo separado.</p>');return;}
  const id=existing?.entity_id||'PAC-'+crypto.randomUUID();
  const r={...(existing||{}),entity_id:id,entity_type:'paciente',title:v.name.trim(),status:existing?.status||'Ativo',payload:JSON.stringify({...d,nomeCompleto:v.name.trim(),nomeSocial:v.social.trim(),nascimento:v.birth,telefone:v.phone.trim(),email:v.email.trim(),responsavel:v.guardian.trim(),globalId:id,clinics:existing?(d.clinics||[]):[patientClinic]}),updated_at:new Date().toISOString(),demo:true};
  if(await saveNew(r,e.submitter)){activeDetail=id;patientTab='Cadastro';render();}
 });
 function findDuplicates(v){return list('paciente').filter(r=>r.entity_id!==existing?.entity_id).filter(r=>{
  const p=data(r),name=v.name.trim().toLocaleLowerCase('pt-BR'),phone=v.phone.replace(/\D/g,'');return (name.length>1&&patientSearchText(r).includes(name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')))||(phone.length>5&&String(p.telefone||'').replace(/\D/g,'')===phone)||(v.email.trim()&&p.email?.toLowerCase()===v.email.trim().toLowerCase());
 });}
 function showDuplicates(){const box=document.getElementById('patient-duplicates');const matches=findDuplicates(values());box.innerHTML=matches.length?'<strong>Possíveis duplicidades — confira nascimento, identificador e contato</strong>'+matches.map(r=>'<p>'+esc(patientLabel(r))+' <button type="button" class="btn small secondary" data-use-patient="'+esc(r.entity_id)+'">Usar este paciente</button></p>').join(''):'Nenhuma coincidência encontrada com os dados informados.';}
 for(const name of ['name','phone','email'])document.getElementById(name).addEventListener('input',showDuplicates);showDuplicates();
}
document.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.patientEdit){const r=byId(b.dataset.patientEdit);if(r&&visible(r))patientForm(r);}
 const id=b.dataset.usePatient||b.dataset.patientLink;
 if(id&&can('pacientes','cadastrar')){const r=byId(id);if(!r||!visible(r))return;const result=ClinicData.link(patientClinic,id);if(!result.isOk)return toast(result.error||'Acesso restrito');backendRecords=store.load();modalDirty=false;document.getElementById('modal-root').innerHTML='';activeDetail=id;current='pacientes';patientTab='Cadastro';render();toast('Paciente existente vinculado à clínica.');}
 if(b.dataset.patientStatus&&can('pacientes','editar')){
  const r=byId(b.dataset.patientStatus);if(!r||!visible(r))return;
  openModal(r.status==='Ativo'?'Inativar cadastro':'Reativar cadastro','<p>O histórico será preservado. Cadastros inativos não podem receber novos agendamentos.</p>','Confirmar',async event=>{event.preventDefault();if(await saveNew({...r,status:r.status==='Ativo'?'Inativo':'Ativo',updated_at:new Date().toISOString()},event.submitter))render();});
 }
});
render();
