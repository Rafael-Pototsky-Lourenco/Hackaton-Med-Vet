/* Contas fictícias, administração dos vínculos e links diretos. */
function refreshAccountUI(){
 for(const c of ClinicAuth.clinics())clinicLabels[c.id]=c.name;
 document.querySelector('.top-title').textContent='Gestão · '+clinicLabels[patientClinic];
 profile=ClinicAuth.membership(patientClinic)?.role||'Sem vínculo';backendRecords=store.load();
 document.getElementById('profile-select').innerHTML=ClinicAuth.accounts().map(u=>'<option value="'+esc(u.id)+'">'+esc(u.name)+'</option>').join('');
 render();
}
settings=function(){
 const u=ClinicAuth.current(),g=ClinicAuth.membership(patientClinic);
 let html=heading('Contas e permissões','Demonstração: autorização por usuário, clínica, ação e atribuição ao caso.')+'<section class="panel"><h2>'+esc(u.name)+'</h2><p>Clínica: '+esc(clinicLabels[patientClinic])+' · Função: '+esc(g?.role||'Sem vínculo')+'</p><div class="notice">Permissões simuladas no navegador servem para testar o comportamento da interface. Não há autenticação ou autorização em servidor nesta demonstração.</div><h3>Ações autorizadas nesta clínica</h3>'+Object.entries(g?.actions||{}).map(([m,a])=>'<p><strong>'+esc(m)+':</strong> '+esc(a.join(', '))+'</p>').join('')+'<p><strong>Atribuições clínicas expressas:</strong> '+esc(g?.clinical?[...g.patientIds,...g.caseIds,...g.recordIds].join(', ')||'Nenhum caso atribuído':'Sem autorização clínica')+'</p></section>';
 if(can('usuarios','administrar')){
  const state=ClinicAuth.management();
  html+='<section class="panel"><h2>Administração dos vínculos</h2><div class="actions"><button class="btn" id="auth-new-user">Nova conta fictícia</button><button class="btn secondary" id="auth-grant">Editar vínculo e permissões</button><button class="btn secondary" id="auth-clinic">Editar clínica</button></div><div class="table-wrap"><table><thead><tr><th>Conta</th><th>Clínica</th><th>Função</th><th>Atribuição clínica</th></tr></thead><tbody>'+state.users.flatMap(user=>user.memberships.map(m=>'<tr><td>'+esc(user.name)+'</td><td>'+esc(clinicLabels[m.clinic]||m.clinic)+'</td><td>'+esc(m.role)+'</td><td>'+esc(m.clinical?[...m.patientIds,...m.caseIds,...m.recordIds].join(', ')||'Nenhuma':'Não')+'</td></tr>')).join('')+'</tbody></table></div><p class="section-note">A autorização clínica requer ações de leitura e uma atribuição por paciente, caso ou atendimento. O catálogo de materiais e serviços existentes permanece no menu de operação da clínica.</p></section>';
 }
 return html;
};
const clinicCreateFlow=createFlow;
createFlow=function(type,patientId=''){
 if(type!=='servico')return clinicCreateFlow(type,patientId);
 if(!can('catalogo','cadastrar'))return toast('Acesso restrito');
 serviceForm();
};
function serviceForm(existing=null){
 if(!can('catalogo',existing?'editar':'cadastrar'))return toast('Acesso restrito');
 const p=existing?data(existing):{};
 openModal(existing?'Editar serviço':'Novo serviço fictício','<div class="form-grid">'+field('service-name','Descrição administrativa *','text',existing?.title||'')+field('service-price','Valor (R$) *','number',String((p.priceCents||0)/100),'min="0" step="0.01"')+'</div>','Salvar serviço',async e=>{
  e.preventDefault();const v=values(),cents=Math.round(Number(v['service-price'])*100);if(!v['service-name'].trim())return err('service-name','Informe a descrição.');if(!Number.isFinite(cents)||cents<0)return err('service-price','Valor inválido.');
  const r={...(existing||{}),entity_id:existing?.entity_id||'SERV-'+crypto.randomUUID(),entity_type:'servico',title:v['service-name'].trim(),status:'Ativo',payload:JSON.stringify({priceCents:cents,administrativeDescription:v['service-name'].trim()}),demo:true,updated_at:new Date().toISOString()};if(await saveNew(r,e.submitter)){activeDetail=r.entity_id;render();}
 });
}
const clinicDetail=detail;detail=function(r){if(r?.entity_type!=='servico')return clinicDetail(r);if(!visible(r))return '<div class="notice">Acesso restrito</div>';return heading(r.title,'Catálogo de serviços fictícios')+'<section class="panel"><p>Valor: '+money(data(r).priceCents)+'</p>'+(can('catalogo','editar')?'<button class="btn secondary" data-edit-service="'+esc(r.entity_id)+'">Editar serviço</button>':'')+'</section>';};
function grantForm(){
 if(!can('permissoes','administrar'))return toast('Acesso restrito');
 const state=ClinicAuth.management();
 const users=state.users.map(u=>[u.id,u.name]), roles=Object.keys(ClinicAuth.templates).map(r=>[r,r]);
 const html='<div class="form-grid">'+selectField('auth-user','Conta fictícia',users)+selectField('auth-clinic-id','Clínica',state.clinics.map(c=>[c.id,c.name]),patientClinic)+selectField('auth-role','Função no vínculo',roles)+selectField('auth-clinical','Autorização clínica expressa',[['nao','Não'],['sim','Sim']])+selectField('auth-budget-scope','Orçamentos para função clínica',[['casos','Somente casos odontológicos atribuídos'],['administrativo','Acesso administrativo conforme ações']])+field('auth-patients','IDs globais dos pacientes atribuídos (separados por vírgula)')+field('auth-cases','IDs de casos atribuídos (separados por vírgula)')+field('auth-records','IDs de atendimentos atribuídos (separados por vírgula)')+'</div><p class="section-note">Atribuições clínicas concedem acesso somente aos casos indicados. Desconto e estorno são ações financeiras independentes.</p><div id="auth-actions"></div>';
 openModal('Editar vínculo por usuário e clínica',html,'Salvar vínculo',e=>{
  e.preventDefault();const v=values(),actions={};
  document.querySelectorAll('[data-grant-action]:checked').forEach(el=>{const [m,a]=el.dataset.grantAction.split(':');(actions[m]??=[]).push(a);});
  const ids=k=>v[k].split(',').map(s=>s.trim()).filter(Boolean);
  const result=ClinicAuth.saveMembership(v['auth-user'],{clinic:v['auth-clinic-id'],role:v['auth-role'],clinical:v['auth-clinical']==='sim',dentalBudgetScope:v['auth-budget-scope']==='casos',patientIds:ids('auth-patients'),caseIds:ids('auth-cases'),recordIds:ids('auth-records'),actions});
  if(!result.isOk)return toast(result.error);modalDirty=false;document.getElementById('modal-root').innerHTML='';refreshAccountUI();toast('Vínculo e atribuições salvos.');
 });
 const actionSet={};for(const tpl of Object.values(ClinicAuth.templates))for(const [m,as] of Object.entries(tpl))for(const a of as)(actionSet[m]??=new Set()).add(a);
 for(const a of ['desconto','estornar'])(actionSet.financeiro??=new Set()).add(a);
 function draw(actions){document.getElementById('auth-actions').innerHTML='<h3>Ações por módulo</h3>'+Object.entries(actionSet).map(([m,as])=>'<fieldset><legend>'+esc(m)+'</legend>'+[...as].map(a=>'<label style="display:inline-block;margin:6px"><input type="checkbox" data-grant-action="'+esc(m+':'+a)+'" '+((actions[m]||[]).includes(a)?'checked':'')+'> '+esc(a)+'</label>').join('')+'</fieldset>').join('');}
 function load(){const user=state.users.find(u=>u.id===document.getElementById('auth-user').value),m=user?.memberships.find(m=>m.clinic===document.getElementById('auth-clinic-id').value);document.getElementById('auth-role').value=m?.role||'Recepção';document.getElementById('auth-clinical').value=m?.clinical?'sim':'nao';document.getElementById('auth-budget-scope').value=m?.dentalBudgetScope?'casos':'administrativo';for(const [field,key] of [['auth-patients','patientIds'],['auth-cases','caseIds'],['auth-records','recordIds']])document.getElementById(field).value=(m?.[key]||[]).join(', ');draw(m?.actions||ClinicAuth.templateFor(document.getElementById('auth-clinic-id').value,'Recepção'));}
 document.getElementById('auth-user').addEventListener('change',load);document.getElementById('auth-clinic-id').addEventListener('change',load);document.getElementById('auth-role').addEventListener('change',()=>{const c=document.getElementById('auth-clinic-id').value,r=document.getElementById('auth-role').value;draw(ClinicAuth.templateFor(c,r));document.getElementById('auth-budget-scope').value=c==='odonto'&&['Aluno ou estagiário','Professor supervisor','Profissional responsável'].includes(r)?'casos':'administrativo';});load();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.editService){const r=byId(b.dataset.editService);if(r&&visible(r))serviceForm(r);}
 if(b.id==='auth-grant')grantForm();
 if(b.id==='auth-new-user'){
  if(!can('usuarios','administrar'))return toast('Acesso restrito');
  openModal('Nova conta fictícia',field('auth-name','Nome da conta *'),'Criar conta',event=>{event.preventDefault();const result=ClinicAuth.saveUser({id:'U-'+crypto.randomUUID(),name:values()['auth-name']});if(!result.isOk)return toast(result.error);modalDirty=false;document.getElementById('modal-root').innerHTML='';refreshAccountUI();toast('Conta criada. Adicione um vínculo por clínica.');});
 }
 if(b.id==='auth-clinic'){
  if(!can('clinicas','administrar'))return toast('Acesso restrito');const c=ClinicAuth.management().clinics.find(c=>c.id===patientClinic);
  openModal('Editar clínica',field('auth-clinic-name','Nome da clínica *','text',c.name),'Salvar',event=>{event.preventDefault();const result=ClinicAuth.saveClinic({...c,name:values()['auth-clinic-name']});if(!result.isOk)return toast(result.error);modalDirty=false;document.getElementById('modal-root').innerHTML='';refreshAccountUI();});
 }
});
function openDirectLink(){
 if(!location.hash)return;let parts;try{parts=location.hash.slice(1).split('/').map(decodeURIComponent);}catch{return restricted();}
 const module=parts[0],id=parts.slice(1).join('/');if(!can(module))return restricted();
 if(id){try{const r=ClinicData.get(patientClinic,id);if(entityModule[r.entity_type]!==module)return restricted();backendRecords=store.load();current=module;activeDetail=id;patientTab='Cadastro';render();}catch{restricted();}}else navigate(module);
}
function restricted(){document.getElementById('view').innerHTML='<div class="notice" role="alert">Acesso restrito</div>';document.getElementById('search-results').innerHTML='';}
window.addEventListener('hashchange',openDirectLink);
refreshAccountUI();openDirectLink();
