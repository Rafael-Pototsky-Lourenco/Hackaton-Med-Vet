const assert=require('node:assert/strict');
const {make}=require('./helpers/app-harness.cjs');
let checks=0;
function check(value,message){assert.ok(value,message);checks++;}
const payload=r=>JSON.parse(r.payload);
async function app(c,storage){const t=make(c,storage);check((await t.ctx.ClinicData.ready).isOk,'Inicialização coordenada');return t;}

module.exports=(async()=>{
 for(const c of ['odonto','fisioterapia','psicologia','nutricao']){
  const a=await app(c),D=a.ctx.ClinicData;a.select('financeiro');
  const b=await app(c,a.storage),B=b.ctx.ClinicData,id=c+':CO-001';
  const results=await Promise.all([
   D.finance.receive(c,id,{amountCents:5000,method:'Dinheiro',operationId:c+'-a'}),
   B.finance.receive(c,id,{amountCents:2000,method:' Dinheiro ',operationId:c+'-b'})
  ]);
  check(results.every(r=>r.isOk),c+': recebimentos simultâneos retornam sucesso');
  check(payload(D.get(c,id)).paidCents===12000&&D.get(c,id).status==='Paga',c+': ambos recebimentos entram no saldo');
  check(D.list(c).filter(r=>r.entity_type==='pagamento'&&payload(r).chargeId===id).length===2,c+': nenhum recebimento desaparece');
  const retry=await B.finance.receive(c,id,{amountCents:2000,method:' Dinheiro ',operationId:c+'-b'});
  check(retry.isOk&&retry.repeated,c+': retentativa mantém idempotência');
  check(!(await D.finance.receive(c,id,{amountCents:2001,method:'Dinheiro',operationId:c+'-b'})).isOk,c+': mesmo identificador não pode representar outro valor');

  const fresh=await app(c);fresh.select('financeiro');const F=fresh.ctx.ClinicData;
  const over=await Promise.all([5000,4000].map((amountCents,i)=>F.finance.receive(c,id,{amountCents,method:'Dinheiro',operationId:'over-'+i})));
  check(over.filter(r=>r.isOk).length===1,c+': duas operações não ultrapassam o saldo');
  check(payload(F.get(c,id)).paidCents===10000,c+': segunda operação verifica saldo persistido');

  const failure=await app(c);failure.select('financeiro');const G=failure.ctx.ClinicData;
  const before=failure.storage.get(G.key),set=failure.ctx.localStorage.setItem;
  failure.ctx.localStorage.setItem=(key,value)=>{if(key===G.key)throw Error('QuotaExceededError de teste');return set(key,value);};
  const failed=await G.finance.receive(c,id,{amountCents:1000,method:'Dinheiro',operationId:'falha'});
  check(!failed.isOk&&failure.storage.get(G.key)===before,c+': falha não grava pagamento nem saldo parcial');
  failure.ctx.localStorage.setItem=set;
  check((await G.finance.receive(c,id,{amountCents:1000,method:'Dinheiro',operationId:'falha'})).isOk,c+': operação pode ser repetida após falha');
  check(payload(G.get(c,id)).paidCents===6000,c+': retentativa atualiza saldo uma vez');
  check(!(await G.save(c,{entity_id:'pagamento-solto',entity_type:'pagamento',title:'Inconsistente',status:'Confirmado manualmente',payload:JSON.stringify({chargeId:id,amountCents:1000})})).isOk,c+': gravação genérica não cria pagamento separado do saldo');
  check(!(await G.save(c,{entity_id:'cobranca-recebida-sem-pagamento',entity_type:'cobranca',title:'Inconsistente',status:'Paga',payload:JSON.stringify({patientId:c+':P-001',amountCents:1000,paidCents:1000})})).isOk,c+': nova cobrança não pode simular recebimento sem pagamento');
  const charge=G.get(c,id);
  check(!(await G.save(c,{...charge,payload:JSON.stringify({...payload(charge),paidCents:7000})})).isOk,c+': gravação genérica não altera recebido sem pagamento');

  failure.select('financeiro-estorno');
  check((await G.save(c,{...G.get(c,id),payload:JSON.stringify({...payload(G.get(c,id)),amountCents:6000,discountReason:'Desconto integral do saldo fictício'})})).isOk,c+': desconto do restante autorizado');
  check(G.get(c,id).status==='Paga',c+': desconto integral recalcula a situação');

  const ui=await app(c);ui.select('financeiro');ui.ctx.testValues={amount:'10',operator:'Conta fictícia',method:'Dinheiro'};
  ui.run("values=()=>testValues;simpleAction(byId('"+id+"'),'pay')");
  const submit=ui.e('#modal-form').onsubmit,button={disabled:false,textContent:'Receber'},event={preventDefault(){},submitter:button};
  await Promise.all([submit(event),submit(event)]);
  check(payload(ui.ctx.ClinicData.get(c,id)).paidCents===6000,c+': clique duplo atualiza saldo uma vez');
  check(ui.ctx.ClinicData.list(c).filter(r=>r.entity_type==='pagamento'&&payload(r).chargeId===id).length===1,c+': clique duplo cria um pagamento');
  check(!button.disabled,c+': formulário libera o botão ao terminar');
 }

 // Different clinics share the same queue and preserve independent changes.
 const shared=new Map(),a=make('odonto',shared),b=make('nutricao',shared);
 const boot=await Promise.all([a.ctx.ClinicData.ready,b.ctx.ClinicData.ready]);
 check(boot.every(r=>r.isOk),'Duas inicializações simultâneas terminam sem perda');
 a.select('financeiro');
 const multi=await Promise.all([
  a.ctx.ClinicData.finance.receive('odonto','odonto:CO-001',{amountCents:1000,method:'Dinheiro',operationId:'cross-od'}),
  b.ctx.ClinicData.finance.receive('nutricao','nutricao:CO-001',{amountCents:2000,method:'Dinheiro',operationId:'cross-nu'})
 ]);
 check(multi.every(r=>r.isOk),'Duas clínicas podem receber simultaneamente');
 check(payload(a.ctx.ClinicData.get('odonto','odonto:CO-001')).paidCents===6000&&payload(b.ctx.ClinicData.get('nutricao','nutricao:CO-001')).paidCents===7000,'Operações em clínicas distintas são preservadas');
 check(shared.has(a.ctx.ClinicData.key+':legacy-backup'),'Migração preserva backup antes de gravar');

 // The account that queued a write must still be selected when it acquires the lock.
 const pending=await app('nutricao');pending.select('financeiro');const P=pending.ctx.ClinicData;
 let release,entered;const acquired=new Promise(resolve=>entered=resolve),hold=new Promise(resolve=>release=resolve);
 const lock=pending.ctx.navigator.locks.request(P.key+':write',{mode:'exclusive'},async()=>{entered();await hold;});
 await acquired;
 const waiting=P.finance.receive('nutricao','nutricao:CO-001',{amountCents:1000,method:'Dinheiro',operationId:'troca-conta'});
 pending.select('recepcao');release();await lock;
 check(!(await waiting).isOk,'Troca de conta rejeita operação que aguardava o bloqueio');
 pending.select('financeiro');check(payload(P.get('nutricao','nutricao:CO-001')).paidCents===5000,'Operação rejeitada não altera dados');
 pending.ctx.navigator.locks=undefined;
 const unchanged=pending.storage.get(P.key);
 check(!(await P.finance.receive('nutricao','nutricao:CO-001',{amountCents:1000,method:'Dinheiro'})).isOk&&pending.storage.get(P.key)===unchanged,'Navegador sem coordenação não usa fallback sujeito a perda de dados');

 const stock=await app('odonto');stock.select('estoque');const S=stock.ctx.ClinicData;
 const product=S.list('odonto').find(r=>r.entity_type==='produto');assert.ok(product);
 const initial=payload(product).stock,stockBefore=stock.storage.get(S.key),stockSet=stock.ctx.localStorage.setItem;
 stock.ctx.localStorage.setItem=(key,value)=>{if(key===S.key)throw Error('Falha de estoque simulada');return stockSet(key,value);};
 check(!(await S.inventory.move('odonto',product.entity_id,{direction:'entrada',quantity:2,reason:'Reposição fictícia'})).isOk&&stock.storage.get(S.key)===stockBefore,'Falha não grava movimento nem saldo de estoque parcial');
 stock.ctx.localStorage.setItem=stockSet;
 check((await S.inventory.move('odonto',product.entity_id,{direction:'entrada',quantity:2,reason:'Reposição fictícia'})).isOk,'Movimento e saldo são gravados juntos');
 check(payload(S.get('odonto',product.entity_id)).stock===Number(initial)+2,'Saldo de estoque corresponde ao movimento');
 return {checks};
})();
