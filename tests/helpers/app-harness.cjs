const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
function make(c,storage=new Map()){
 const elements=new Map(),handlers={};const element=key=>{if(!elements.has(key))elements.set(key,{innerHTML:'',value:'',textContent:'',dataset:{},classList:{add(){},remove(){},toggle(){}},focus(){},click(){},setAttribute(){},addEventListener(){},remove(){},prepend(){},insertAdjacentHTML(){}});return elements.get(key);};
 const doc={currentScript:{dataset:{clinic:c}},querySelector:s=>element(s),getElementById:id=>element('#'+id),createElement:()=>element('new-'+elements.size),querySelectorAll:()=>[],addEventListener:(n,f)=>(handlers[n]??=[]).push(f)};
 const ctx={document:doc,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))},location:{hash:''},innerWidth:1200,setTimeout:()=>1,clearTimeout(){},addEventListener(){},navigator:{clipboard:{writeText:()=>Promise.resolve()}},crypto:require('node:crypto').webcrypto,URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob:class{constructor(parts){ctx.exported=parts.join('');}},console};ctx.window=ctx;vm.createContext(ctx);
 const html=fs.readFileSync(path.join(root,c+'.html'),'utf8');
 const scripts=[...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)].map(m=>m[1]).filter(src=>!/^https?:/.test(src));
 for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
 return {ctx,storage,e:element,dispatch:(name,event)=>Promise.all((handlers[name]||[]).map(f=>f(event))),run:s=>vm.runInContext(s,ctx),select:id=>{ctx.ClinicAuth.select(id);vm.runInContext('refreshAccountUI()',ctx);}};
}

module.exports={make};
