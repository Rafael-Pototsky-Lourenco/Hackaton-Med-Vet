const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const lockQueues=new WeakMap();
function make(c,storage=new Map()){
 const windowHandlers={},timers=new Map();let timerId=0,timerClock=0;
 if(!lockQueues.has(storage))lockQueues.set(storage,new Map());
 const requestLock=(name,options,callback)=>{
  if(typeof options==='function'){callback=options;options={};}
  const queues=lockQueues.get(storage),previous=queues.get(name)||Promise.resolve();
  const task=previous.catch(()=>{}).then(()=>callback({name,mode:options?.mode||'exclusive'}));
  const tail=task.then(()=>{},()=>{});queues.set(name,tail);
  tail.finally(()=>{if(queues.get(name)===tail)queues.delete(name);});
  return task;
 };
 const advanceTimers=async milliseconds=>{
  if(!Number.isFinite(milliseconds)||milliseconds<0)throw Error('Avanço de tempo inválido');
  const target=timerClock+milliseconds;let executions=0;
  while(true){
   const next=[...timers.entries()].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];
   if(!next)break;if(++executions>10000)throw Error('Limite de timers excedido');
   const [id,timer]=next;timers.delete(id);timerClock=timer.at;await timer.callback(...timer.args);
  }
  timerClock=target;
 };
 const elements=new Map(),handlers={};const element=key=>{if(!elements.has(key))elements.set(key,{innerHTML:'',value:'',textContent:'',dataset:{},classList:{add(){},remove(){},toggle(){}},focus(){},click(){},setAttribute(){},addEventListener(){},remove(){},prepend(){},insertAdjacentHTML(){}});return elements.get(key);};
 const doc={currentScript:{dataset:{clinic:c}},querySelector:s=>element(s),getElementById:id=>element('#'+id),createElement:()=>element('new-'+elements.size),querySelectorAll:()=>[],addEventListener:(n,f)=>(handlers[n]??=[]).push(f)};
 const ctx={document:doc,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))},location:{hash:''},innerWidth:1200,setTimeout:(callback,delay=0,...args)=>{const id=++timerId;timers.set(id,{callback,args,at:timerClock+Math.max(0,Number(delay)||0)});return id;},clearTimeout:id=>timers.delete(id),addEventListener:(name,callback)=>{(windowHandlers[name]??=[]).push(callback);},navigator:{locks:{request:requestLock},clipboard:{writeText:()=>Promise.resolve()}},crypto:require('node:crypto').webcrypto,URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob:class{constructor(parts){ctx.exported=parts.join('');}},console};ctx.window=ctx;vm.createContext(ctx);
 const html=fs.readFileSync(path.join(root,c+'.html'),'utf8');
 const scripts=[...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)].map(m=>m[1]).filter(src=>!/^https?:/.test(src));
 for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
 return {ctx,storage,e:element,dispatch:(name,event)=>Promise.all((handlers[name]||[]).map(f=>f(event))),dispatchWindow:(name,event)=>Promise.all((windowHandlers[name]||[]).map(f=>f(event))),advanceTimers,pendingTimers:()=>timers.size,run:s=>vm.runInContext(s,ctx),select:id=>{ctx.ClinicAuth.select(id);vm.runInContext('refreshAccountUI()',ctx);}};
}

module.exports={make};
