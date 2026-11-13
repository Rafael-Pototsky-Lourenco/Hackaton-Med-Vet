const assert=require('node:assert/strict');
const {make}=require('./helpers/app-harness.cjs');
const clinics=['odonto','fisioterapia','psicologia','nutricao'];let checks=0;const log=[];
function check(value,message){assert.ok(value,message);checks++;log.push('OK: '+message);}
async function openDraft(t,c){
 t.select('profissional');
 const created=await t.ctx.ClinicData.clinical.create(c,{patientId:c+':P-001',type:'Consulta',date:'2026-11-13',complaint:'Queixa fictícia',notes:'Conteúdo clínico protegido'});
 assert.ok(created.isOk,created.error);
 t.ctx.draftId=created.record.entity_id;
 t.run("backendRecords=store.load();current='atendimentos';activeDetail=draftId;render();clinicalDraftForm(draftId);modalDirty=true");
 t.e('#clinical-notes').value='Edição ainda não salva';
 return created.record.entity_id;
}
module.exports=(async()=>{
 for(const [index,c] of clinics.entries()){
  const storage=new Map(),first=make(c,storage),id=await openDraft(first,c);
  const html=first.e('#modal-root').innerHTML;
  const other=clinics[(index+1)%clinics.length],second=make(other,storage);
  const created=await second.ctx.ClinicData.clinical.create(other,{patientId:other+':P-001',type:'Consulta',date:'2026-11-13',complaint:'Gravação em outra clínica'});
  check(created.isOk,c+': outra aba consegue gravar dados compartilhados');
  await first.dispatchWindow('storage',{key:first.ctx.ClinicData.key});
  check(first.e('#modal-root').innerHTML===html,c+': atualização de dados preserva o formulário aberto');
  check(first.run('modalDirty')===true,c+': atualização de dados preserva o aviso de edição não salva');
  check(first.e('#clinical-notes').value==='Edição ainda não salva',c+': atualização de dados preserva o texto digitado');
  check(first.run('backendRecords').some(r=>r.entity_id===id),c+': atualização mantém os registros visíveis sincronizados');

  second.ctx.ClinicAuth.select('recepcao');
  await first.dispatchWindow('storage',{key:first.ctx.ClinicAuth.sessionKey});
  check(first.e('#modal-root').innerHTML==='',c+': troca de conta em outra aba invalida o formulário protegido');
  check(first.run('modalDirty')===false,c+': troca de conta limpa o estado do formulário invalidado');
  check(first.e('#view').innerHTML.includes('Acesso restrito')&&!first.e('#view').innerHTML.includes('Conteúdo clínico protegido'),c+': troca de conta oculta o prontuário');

  await openDraft(first,c);
  const permissions=JSON.parse(storage.get(first.ctx.ClinicAuth.key));
  permissions.users.find(u=>u.id==='profissional').memberships.find(g=>g.clinic===c).clinical=false;
  storage.set(first.ctx.ClinicAuth.key,JSON.stringify(permissions));
  await first.dispatchWindow('storage',{key:first.ctx.ClinicAuth.key});
  check(first.e('#modal-root').innerHTML==='',c+': revogação de acesso invalida o formulário protegido');
  check(first.run('modalDirty')===false,c+': revogação limpa o estado do formulário invalidado');
  check(first.e('#view').innerHTML.includes('Acesso restrito'),c+': revogação oculta o conteúdo clínico');
 }

 const t=make('odonto');let fired=0;
 t.ctx.setTimeout(()=>{fired++;},20);
 const cancelled=t.ctx.setTimeout(()=>{fired+=100;},10);t.ctx.clearTimeout(cancelled);
 check(fired===0,'Harness: timers não executam automaticamente');
 await t.advanceTimers(19);check(fired===0,'Harness: avanço respeita o prazo do timer');
 await t.advanceTimers(1);check(fired===1&&t.pendingTimers()===0,'Harness: timer devido executa uma vez e cancelado não executa');

 const peer=make('nutricao',t.storage),order=[];let release;
 const gate=new Promise(resolve=>{release=resolve;});
 const first=t.ctx.navigator.locks.request('qa-shared',async()=>{order.push('primeiro');await gate;order.push('liberado');});
 const second=peer.ctx.navigator.locks.request('qa-shared',{mode:'exclusive'},()=>{order.push('segundo');});
 check(order.length===0,'Harness: callback do lock é sempre assíncrono');
 await Promise.resolve();await Promise.resolve();
 check(order.join(',')==='primeiro','Harness: abas com o mesmo armazenamento compartilham a fila de locks');
 release();await Promise.all([first,second]);
 check(order.join(',')==='primeiro,liberado,segundo','Harness: lock serializa abas e libera após a conclusão');
 await assert.rejects(t.ctx.navigator.locks.request('qa-shared',()=>{throw Error('Falha simulada');}),/Falha simulada/);checks++;
 await peer.ctx.navigator.locks.request('qa-shared',()=>{order.push('após falha');});
 check(order.at(-1)==='após falha','Harness: lock também libera a fila após falha');
 console.log(checks+' verificações de sincronização concluídas.');return {checks,log};
})();
