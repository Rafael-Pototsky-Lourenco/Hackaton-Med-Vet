const assert=require('node:assert/strict');
const {make}=require('./helpers/app-harness.cjs');
let checks=0;
function check(value,message){assert.ok(value,message);checks++;}

module.exports=(async()=>{
 for(const c of ['odonto','fisioterapia','psicologia','nutricao']){
  const a=make(c),C=a.ctx.ClinicData.clinical,D=a.ctx.ClinicData;
  a.select('profissional');
  const created=await C.create(c,{patientId:c+':P-001',type:'Consulta',date:'2026-11-13',complaint:'Demanda fictícia',notes:'Texto inicial'});
  check(created.isOk,c+': caso de regressão criado');
  const id=created.record.entity_id,first=C.read(c,id);
  const b=make(c,a.storage),B=b.ctx.ClinicData.clinical;
  const oldSnapshot=D.get(c,id),snapshotB=B.read(c,id);
  check(first.draftToken===snapshotB.draftToken,c+': abas capturam a mesma revisão');
  const saved=await B.saveDraft(c,id,{notes:'Texto recente da aba B'},snapshotB.draftToken);
  check(saved.isOk&&saved.draftToken!==first.draftToken,c+': salvar avança o token do rascunho');
  check(!(await C.saveDraft(c,id,{notes:'Texto obsoleto da aba A'},first.draftToken)).isOk,c+': formulário antigo é rejeitado');
  check(!(await C.saveDraft(c,id,{notes:'Repetição'},first.workingVersionId)).isOk,c+': ID sem revisão não contorna conflito após salvar');
  check(!(await D.save(c,{...oldSnapshot,payload:JSON.stringify({...JSON.parse(oldSnapshot.payload),notes:'Sobrescrita pela API compatível'})})).isOk,c+': API compatível rejeita snapshot antigo');
  check(C.read(c,id).versions[0].fields.notes==='Texto recente da aba B',c+': alteração recente é preservada');
  const latest=C.read(c,id);
  check((await C.saveDraft(c,id,{notes:'Texto reconciliado'},latest.draftToken)).isOk,c+': reabrir permite salvar com revisão atual');
  const refreshed=D.get(c,id);
  check((await D.save(c,{...refreshed,payload:JSON.stringify({...JSON.parse(refreshed.payload),notes:'Texto da API compatível'})})).isOk,c+': API compatível usa o token do próprio snapshot');
  const reload=make(c,a.storage).ctx.ClinicData.clinical.read(c,id);
  check(reload.draftToken===C.read(c,id).draftToken&&reload.versions[0].fields.notes==='Texto da API compatível',c+': token e conteúdo persistem após recarga');

  // A bare version ID remains safe for the first save of a pre-token client.
  const legacy=await C.create(c,{patientId:c+':P-001',type:'Consulta',date:'2026-11-13',complaint:'Legado'});
  const legacyState=C.read(c,legacy.record.entity_id);
  check((await C.saveDraft(c,legacy.record.entity_id,{notes:'Primeiro salvamento'},legacyState.workingVersionId)).isOk,c+': chamada legada inicial continua disponível');
  check(!(await C.saveDraft(c,legacy.record.entity_id,{notes:'Snapshot legado antigo'},legacyState.workingVersionId)).isOk,c+': chamada legada repetida exige releitura com token');

  // The form captures its token when opened, not when the submit callback runs.
  const formState=C.read(c,id);
  a.ctx.cid=id;a.run('clinicalDraftForm(cid)');
  check((await C.saveDraft(c,id,{notes:'Texto salvo com formulário aberto'},formState.draftToken)).isOk,c+': edição externa enquanto o formulário está aberto');
  a.ctx.formValues=Object.fromEntries(Object.entries(formState.versions[0].fields).map(([k,v])=>['clinical-'+k.replace('.','-'),v]));
  a.ctx.formValues['clinical-notes']='Texto antigo do formulário';
  a.run('values=()=>formValues');
  await a.e('#modal-form').onsubmit({preventDefault(){},submitter:{disabled:false,textContent:'Salvar'}});
  check(C.read(c,id).versions[0].fields.notes==='Texto salvo com formulário aberto',c+': interface mantém token capturado e não sobrescreve edição externa');

  for(const [field,value] of [['type',''],['type','   '],['date',''],['complaint','   ']]){
   const candidate=await C.create(c,{patientId:c+':P-001',type:'Consulta',date:'2026-11-13',complaint:'Demanda informada'}),candidateId=candidate.record.entity_id;
   const state=C.read(c,candidateId);
   check((await C.saveDraft(c,candidateId,{[field]:value},state.draftToken)).isOk,c+': rascunho permite completar '+field+' depois');
   const result=await C.finalize(c,candidateId,state.workingVersionId);
   check(!result.isOk&&D.get(c,candidateId).status==='Rascunho',c+': finalização exige '+field+' válido');
  }
  const complete=C.read(c,id);
  check((await C.finalize(c,id,complete.workingVersionId)).isOk&&D.get(c,id).status==='Validado',c+': registro completo continua finalizando');
 }
 console.log(checks+' verificações de regressão clínica concluídas.');
 return {checks};
})();
