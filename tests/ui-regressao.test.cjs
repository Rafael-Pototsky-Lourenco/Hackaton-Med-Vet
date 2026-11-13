const assert=require('node:assert/strict');
const {make}=require('./helpers/app-harness.cjs');
const clinics=['odonto','fisioterapia','psicologia','nutricao'];let checks=0;const log=[];
function check(value,message){assert.ok(value,message);checks++;log.push('OK: '+message);}
async function typeFilter(app,value,start=2,end=5){
 const input=app.e('#list-filter');let focused=false,selection;
 input.focus=()=>{focused=true;};input.setSelectionRange=(...range)=>{selection=range;};
 // Represent the existing panel without requiring a DOM parser in the harness.
 const panel={get innerHTML(){return app.e('#view').innerHTML;},set innerHTML(html){app.e('#view').innerHTML=html;}};
 await app.dispatch('input',{target:{id:'list-filter',value,selectionStart:start,selectionEnd:end,selectionDirection:'backward',closest:()=>panel}});
 check(focused,'Busca mantém foco após atualizar '+app.ctx.ClinicAuth.clinic);
 check(selection?.[0]===start&&selection[1]===end&&selection[2]==='backward','Busca preserva seleção e direção do cursor em '+app.ctx.ClinicAuth.clinic);
 return app.e('#view').innerHTML;
}
module.exports=(async()=>{
 for(const clinic of clinics){
  const app=make(clinic);await app.ctx.ClinicData.ready;app.select('recepcao');
  const appointments=app.run('list("agendamento")'),confirmed=appointments.find(r=>r.status==='Confirmado'),other=appointments.find(r=>r.status==='Agendado'),p=JSON.parse(confirmed.payload);
  Object.assign(app.ctx,{testDate:p.date,testProfessional:p.professional});
  app.run("current='agenda';activeDetail=null;workflowFilters.status='Confirmado';workflowFilters.date=testDate;workflowFilters.professional=testProfessional;render()");
  check(!app.e('#view').innerHTML.includes('data-detail="'+other.entity_id+'"'),clinic+': filtros iniciais excluem a sessão agendada');
  const html=await typeFilter(app,confirmed.title.split(' · ')[0]);
  check(['wf-filter-date','wf-filter-status','wf-filter-professional'].every(id=>html.includes('id="'+id+'"')),clinic+': busca preserva controles de filtros da agenda');
  check(html.includes('data-detail="'+confirmed.entity_id+'"')&&!html.includes('data-detail="'+other.entity_id+'"'),clinic+': busca respeita data, situação e profissional ativos');
  const empty=await typeFilter(app,'PACIENTE_INEXISTENTE',4,4);
  check(empty.includes('Nenhum resultado encontrado.')&&empty.includes('id="wf-filter-status"'),clinic+': busca sem resultados mantém os filtros disponíveis');
  app.select('profissional');
  const referral=await app.ctx.ClinicData.workflow.createReferral(clinic,{patientId:clinic+':P-001',destinationClinic:clinics.find(c=>c!==clinic),summary:'Encaminhamento fictício para regressão de interface'});
  check(referral.isOk,clinic+': cenário de encaminhamento criado');app.select('recepcao');
  app.run("current='encaminhamentos';activeDetail=null;filter='';workflowFilters.direction='recebidos';workflowFilters.refStatus='Pendente';render()");
  const referrals=await typeFilter(app,'Encaminhamento');
  check(referrals.includes('id="wf-ref-direction"')&&referrals.includes('id="wf-ref-status"'),clinic+': busca mantém os filtros de encaminhamento');
  check(!referrals.includes('data-detail="'+referral.record.entity_id+'"'),clinic+': busca de recebidos não reintroduz encaminhamento enviado');
 }
 const dental=make('odonto');await dental.ctx.ClinicData.ready;dental.select('profissional');
 const C=dental.ctx.ClinicData.clinical,O=dental.ctx.ClinicData.dental;
 const first=await C.create('odonto',{patientId:'odonto:P-001',type:'Consulta',date:'2026-11-13',complaint:'Avaliação fictícia'});
 const second=await C.create('odonto',{patientId:'odonto:P-001',type:'Retorno',date:'2026-11-14',complaint:'Retorno fictício'});
 const a=first.record.entity_id,b=second.record.entity_id,p1=(await O.createPlan(a,'Primeiro plano')).record.entity_id,p2=(await O.createPlan(a,'Segundo plano')).record.entity_id;
 dental.run('backendRecords=store.load()');dental.ctx.history={replaceState:(_state,_title,url)=>{dental.ctx.location.hash=url;}};
 Object.assign(dental.ctx,{testAttendance:a,testPlan:p1});dental.run('dentalOpen(testAttendance,testPlan)');
 await dental.dispatch('change',{target:{id:'dental-attendance-select',value:b}});
 check(dental.run('dentalState.attendanceId')===b&&dental.ctx.location.hash==='#odontologia/atendimento/'+encodeURIComponent(b)+'/'+encodeURIComponent(p1),'Trocar atendimento atualiza conteúdo e endereço mantendo o plano do caso');
 await dental.dispatch('change',{target:{id:'dental-plan-select',value:p2}});
 check(dental.ctx.location.hash==='#odontologia/atendimento/'+encodeURIComponent(b)+'/'+encodeURIComponent(p2),'Trocar plano atualiza o endereço com o atendimento atual');
 const reload=make('odonto',dental.storage);await reload.ctx.ClinicData.ready;reload.ctx.location.hash=dental.ctx.location.hash;reload.run('openDirectLink()');
 check(reload.run('dentalState.attendanceId')===b&&reload.run('dentalState.planId')===p2,'Recarga reabre exatamente o atendimento e plano selecionados');
 dental.run('dentalPlanForm();values=()=>({"dental-plan-title":"Plano criado na interface"})');
 await dental.e('#modal-form').onsubmit({preventDefault(){},submitter:{disabled:false,textContent:'Criar plano'}});
 const newPlan=dental.run('dentalState.planId');
 check(newPlan!==p2&&dental.ctx.location.hash.endsWith('/'+encodeURIComponent(newPlan)),'Criar plano também mantém endereço coerente com a seleção');
 await dental.dispatch('change',{target:{id:'dental-plan-select',value:''}});
 check(dental.run('dentalState.planId')===p1&&dental.ctx.location.hash.endsWith('/'+encodeURIComponent(p1)),'Plano padrão escolhido pela tela também consta do endereço');
 console.log(checks+' verificações de regressão da interface concluídas.');return {checks,log};
})();
