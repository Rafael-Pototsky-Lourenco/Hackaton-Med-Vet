/* Autorização simulada. Uma API futura deve validar estas regras no servidor. */
window.ClinicAuth = (() => {
 const KEY='clinicas-positivo:access:v1', SESSION='clinicas-positivo:demo-account';
 const clinic=document.currentScript.dataset.clinic;
 const clinics=['odonto','fisioterapia','psicologia','nutricao'];
 const clinicalTypes=['atendimento','adendo','exame','cirurgia','supervisao','evolucao','escala','anotacao','documento','achadoOdonto','planoOdonto','procedimentoOdonto'];
 const entityModule={achadoOdonto:'atendimentos',planoOdonto:'atendimentos',procedimentoOdonto:'atendimentos',paciente:'pacientes',agendamento:'agenda',bloqueio:'agenda',encaminhamento:'encaminhamentos',atendimento:'atendimentos',adendo:'atendimentos',exame:'exames',cirurgia:'cirurgias',supervisao:'supervisao',evolucao:'atendimentos',escala:'atendimentos',anotacao:'atendimentos',documento:'atendimentos',produto:'estoque',movimento:'estoque',orcamento:'orcamentos',cobranca:'financeiro',pagamento:'financeiro',recibo:'financeiro',servico:'catalogo',auditoria:'relatorios'};
 const base={painel:['visualizar'],configuracoes:['visualizar'],documentacao:['visualizar'],escopo:['visualizar']};
 const read=['visualizar'], edit=['visualizar','cadastrar','editar'];
 const templates={
  'Administração':{...base,usuarios:['visualizar','administrar'],clinicas:['visualizar','administrar'],permissoes:['visualizar','administrar'],catalogo:edit,pacientes:edit,agenda:edit,recepcao:edit,encaminhamentos:edit,estoque:edit,orcamentos:read,financeiro:read,relatorios:['visualizar','exportar']},
  'Gestão da clínica':{...base,pacientes:read,agenda:read,recepcao:read,encaminhamentos:read,estoque:read,orcamentos:read,financeiro:read,relatorios:['visualizar','exportar']},
  'Recepção':{...base,pacientes:edit,agenda:[...edit,'cancelar','chegada','reagendar'],recepcao:[...edit,'chegada'],encaminhamentos:read},
  'Aluno ou estagiário':{...base,pacientes:read,agenda:read,encaminhamentos:read,atendimentos:[...edit,'enviar'],exames:read,supervisao:read},
  'Professor supervisor':{...base,pacientes:read,agenda:read,encaminhamentos:read,atendimentos:['visualizar','validar','devolver','autorizarCorrecao','adendo'],exames:['visualizar','avaliar'],cirurgias:read,supervisao:['visualizar','validar','devolver','autorizarCorrecao'],relatorios:['visualizar','exportar']},
  'Profissional responsável':{...base,pacientes:read,agenda:read,encaminhamentos:edit,atendimentos:[...edit,'finalizar','adendo'],exames:[...edit,'resultado','avaliar'],cirurgias:[...edit,'iniciar','concluir'],supervisao:read},
  'Financeiro':{...base,pacientes:read,catalogo:read,orcamentos:[...edit,'aprovar'],financeiro:[...edit,'receber'],relatorios:['visualizar','exportar']},
  'Estoque ou farmácia':{...base,estoque:[...edit,'entrada','consumo']}
 };
 const previousTemplates=JSON.parse(JSON.stringify(templates));
 for(const role of ['Administração','Recepção']){templates[role].agenda=[...new Set([...(templates[role].agenda||[]),'confirmar','chegada','reagendar','cancelar','falta'])];}
 for(const role of ['Aluno ou estagiário','Profissional responsável'])templates[role].agenda=[...new Set([...(templates[role].agenda||[]),'iniciar'])];
 for(const role of ['Administração','Recepção','Profissional responsável'])templates[role].encaminhamentos=[...new Set([...(templates[role].encaminhamentos||[]),'aceitar','recusar','agendar','cancelar'])];
 const previousClinicalTemplates=JSON.parse(JSON.stringify(templates));
 for(const role of ['Aluno ou estagiário','Professor supervisor','Profissional responsável'])templates[role].atendimentos=[...new Set([...templates[role].atendimentos,'solicitarCorrecao','corrigir'])];
 templates['Profissional responsável'].atendimentos.push('vincularSupervisor','enviar');templates['Professor supervisor'].atendimentos.push('enviar');
 const previousDentalTemplates=JSON.parse(JSON.stringify(templates));
 for(const role of ['Aluno ou estagiário','Profissional responsável'])templates[role].atendimentos=[...new Set([...templates[role].atendimentos,'registrarOdonto','executarOdonto','gerarOrcamentoOdonto','imprimirOdonto'])];
 templates['Professor supervisor'].atendimentos.push('imprimirOdonto');
 for(const role of ['Aluno ou estagiário','Professor supervisor','Profissional responsável'])templates[role].orcamentos=['visualizar','imprimir'];
 for(const role of ['Administração','Gestão da clínica','Financeiro'])templates[role].orcamentos=[...new Set([...templates[role].orcamentos,'imprimir'])];
 const clone=x=>JSON.parse(JSON.stringify(x));
 function templateFor(c,role){return clone(c==='odonto'?templates[role]:(previousDentalTemplates[role]||templates[role]));}
 function grant(c,role,extra={}){return {clinic:c,role,actions:templateFor(c,role),dentalBudgetScope:c==='odonto'&&['Aluno ou estagiário','Professor supervisor','Profissional responsável'].includes(role),patientIds:[],caseIds:[],recordIds:[],clinical:false,...extra};}
 function initial(){const clinical=c=>({clinical:true,patientIds:[c+':P-001',c+':P-003']});return {version:1,clinics:clinics.map(id=>({id,name:({odonto:'Odontologia',fisioterapia:'Fisioterapia',psicologia:'Psicologia',nutricao:'Nutrição'})[id],active:true})),users:[
 {id:'admin',name:'Alice · Administração',memberships:clinics.map(c=>grant(c,'Administração'))},
 {id:'admin-clinico',name:'Alice · Administração com atribuição clínica',memberships:clinics.map(c=>{const g=grant(c,'Administração',clinical(c));for(const m of ['atendimentos','exames','cirurgias','supervisao'])g.actions[m]=['visualizar'];return g;})},
 {id:'gestao',name:'Rafael · Gestão da clínica',memberships:clinics.map(c=>grant(c,'Gestão da clínica'))},
 {id:'recepcao',name:'Bia · Recepção',memberships:clinics.map(c=>grant(c,'Recepção'))},
 {id:'aluno',name:'Camila · Aluna',memberships:clinics.map(c=>grant(c,'Aluno ou estagiário',{clinical:true,patientIds:[c+':P-001']}))},
 {id:'supervisor',name:'Elisa · Supervisora',memberships:clinics.map(c=>grant(c,'Professor supervisor',clinical(c)))},
 {id:'profissional',name:'Ana · Profissional responsável',memberships:clinics.map(c=>grant(c,'Profissional responsável',clinical(c)))},
 {id:'financeiro',name:'Caio · Financeiro',memberships:clinics.map(c=>grant(c,'Financeiro'))},
 {id:'financeiro-estorno',name:'Davi · Financeiro com estorno e desconto',memberships:clinics.map(c=>{const g=grant(c,'Financeiro');g.actions.financeiro.push('estornar','desconto');return g;})},
 {id:'multi',name:'Marina · Funções diferentes por clínica',memberships:[grant('odonto','Recepção'),grant('nutricao','Financeiro')]},
 {id:'estoque',name:'Pedro · Estoque',memberships:clinics.map(c=>grant(c,'Estoque ou farmácia'))}
 ]};}
 function state(){let s=localStorage.getItem(KEY);if(!s){const d=initial();localStorage.setItem(KEY,JSON.stringify(d));return d;}const data=JSON.parse(s);if(!data.workflowVersion){localStorage.setItem(KEY+':before-workflow',s);for(const u of data.users)for(const g of u.memberships)for(const m of ['agenda','encaminhamentos'])if(JSON.stringify(g.actions[m]||[])===JSON.stringify(previousTemplates[g.role]?.[m]||[])&&templates[g.role]?.[m])g.actions[m]=clone(templates[g.role][m]);data.workflowVersion=1;localStorage.setItem(KEY,JSON.stringify(data));}if(!data.clinicalVersion){localStorage.setItem(KEY+':before-clinical-v1',JSON.stringify(data));for(const u of data.users)for(const g of u.memberships)if(JSON.stringify(g.actions.atendimentos||[])===JSON.stringify(previousClinicalTemplates[g.role]?.atendimentos||[])&&templates[g.role]?.atendimentos)g.actions.atendimentos=clone(templates[g.role].atendimentos);data.clinicalVersion=1;localStorage.setItem(KEY,JSON.stringify(data));}if(!data.dentalVersion){localStorage.setItem(KEY+':before-dental-v1',JSON.stringify(data));for(const u of data.users)for(const g of u.memberships)if(g.clinic==='odonto')for(const m of ['atendimentos','orcamentos'])if(JSON.stringify(g.actions[m]||[])===JSON.stringify(previousDentalTemplates[g.role]?.[m]||[])&&templates[g.role]?.[m])g.actions[m]=clone(templates[g.role][m]);data.dentalVersion=1;localStorage.setItem(KEY,JSON.stringify(data));}if(!data.dentalScopeVersion){if(!localStorage.getItem(KEY+':before-dental-scope-v1'))localStorage.setItem(KEY+':before-dental-scope-v1',JSON.stringify(data));for(const u of data.users)for(const g of u.memberships)if(g.clinic==='odonto'&&['Aluno ou estagiário','Professor supervisor','Profissional responsável'].includes(g.role)&&JSON.stringify(g.actions.orcamentos||[])===JSON.stringify(['visualizar','imprimir'])&&g.dentalBudgetScope===undefined)g.dentalBudgetScope=true;data.dentalScopeVersion=1;localStorage.setItem(KEY,JSON.stringify(data));}return data;}
 function current(){const s=state();return s.users.find(x=>x.id===localStorage.getItem(SESSION))||s.users[0];}
 function membership(c){const s=state();return s.clinics.find(x=>x.id===c)?.active===false?null:current().memberships.find(x=>x.clinic===c);}
 let assignmentResolver=()=>false,scheduleResolver=()=>false,clinicalResolver=()=>false;
 function assigned(c,r){const g=membership(c);if(!g)return false;const p=typeof r?.payload==='string'?JSON.parse(r.payload):r?.payload||{};return !!((p.parentId&&clinicalResolver(c,p.parentId,current().id))||(r?.entity_type==='atendimento'&&clinicalResolver(c,r.entity_id,current().id))||(r?.entity_type==='encaminhamento'&&c===p.destinationClinic&&((p.destinationAppointmentId&&scheduleResolver(c,p.destinationAppointmentId,p.patientId))||(p.destinationAttendanceId&&g.recordIds.includes(p.destinationAttendanceId))))||((p.appointmentId||r?.entity_type==='agendamento')&&scheduleResolver(c,p.appointmentId||r.entity_id,p.patientId))||(r?.entity_type==='paciente'&&assignmentResolver(c,r.entity_id,g))||(p.caseId&&g.caseIds.includes(p.caseId))||g.recordIds.includes(r?.entity_id)||(p.parentId&&g.recordIds.includes(p.parentId))||g.patientIds.includes(r?.entity_type==='paciente'?r.entity_id:p.patientId));}
 function allowed(c,module,action='visualizar',r=null){
  if(module==='odontologia')return c==='odonto'&&allowed(c,'atendimentos',action==='visualizar'?'visualizar':action,r);
  if(c!=='odonto'&&['registrarOdonto','executarOdonto','gerarOrcamentoOdonto','imprimirOdonto'].includes(action))return false;
  const g=membership(c);if(!g||!(g.actions[module]||[]).includes(action))return false;
  if(module==='orcamentos'&&g.dentalBudgetScope){if(c!=='odonto'||!g.clinical)return false;if(r&&((r.entity_type!=='paciente'&&!JSON.parse(r.payload||'{}').dentalPlanId)||!assigned(c,r)))return false;}
  const isClinical=['atendimentos','exames','cirurgias','supervisao'].includes(module);
  if(isClinical&&(!g.clinical||(r&&!assigned(c,r))))return false;
  if(r&&['Aluno ou estagiário','Professor supervisor','Profissional responsável'].includes(g.role)&&['pacientes','agenda','encaminhamentos'].includes(module)&&!assigned(c,r))return false;
  if(r&&g.role==='Aluno ou estagiário'&&action==='editar'){
   const p=JSON.parse(r.payload||'{}');if(!['Rascunho','Devolvido'].includes(r.status)||(p.currentVersionAuthorId||p.createdBy)!==current().id)return false;
  }
  return true;
 }
 function canRead(r,c=r?.clinic||clinic){if(r?.entity_type==='encaminhamento'){const p=JSON.parse(r.payload||'{}');return [r.clinic,p.destinationClinic].includes(c)&&allowed(c,'encaminhamentos','visualizar',r);}return !!r&&(r.entity_type==='paciente'||r.clinic===c)&&allowed(c,entityModule[r.entity_type],'visualizar',r);}
 const actionMap={confirm:'confirmar',absent:'falta',start:'iniciar',arrive:'chegada',reschedule:'reagendar',cancel:'cancelar',reverse:'estornar',edit:'editar',submit:'enviar',finalize:'finalizar',addendum:'adendo',validate:'validar',return:'devolver',authorizeCorrection:'autorizarCorrecao',result:'resultado',evaluate:'avaliar',surgeryStart:'iniciar',surgeryFinish:'concluir',consume:'consumo',stockIn:'entrada',approve:'aprovar',partial:'aprovar',pay:'receber',discount:'desconto',copy:'visualizar'};
 function action(c,r,act){return !!actionMap[act]&&allowed(c,entityModule[r?.entity_type],actionMap[act],r);}
 function select(id){if(!state().users.some(x=>x.id===id))throw Error('Acesso restrito');localStorage.setItem(SESSION,id);}
 function saveUser(user){if(!allowed(clinic,'usuarios','administrar'))return {isOk:false,error:'Acesso restrito'};const s=state();const old=s.users.find(x=>x.id===user.id);if(!user.name?.trim())return {isOk:false,error:'Informe o nome'};if(old)old.name=user.name.trim();else s.users.push({id:user.id,name:user.name.trim(),memberships:[]});localStorage.setItem(KEY,JSON.stringify(s));return {isOk:true};}
 function saveMembership(id,g){if(!allowed(g.clinic,'permissoes','administrar'))return {isOk:false,error:'Acesso restrito'};
  const s=state(),u=s.users.find(x=>x.id===id);if(!u||!templates[g.role]||!s.clinics.some(c=>c.id===g.clinic))return {isOk:false,error:'Vínculo inválido'};
  if(!g.actions||Object.values(g.actions).some(a=>!Array.isArray(a)||a.some(x=>typeof x!=='string')))return {isOk:false,error:'Ações inválidas'};
  for(const k of ['patientIds','caseIds','recordIds'])if(!Array.isArray(g[k]))return {isOk:false,error:'Atribuições inválidas'};
  const old=u.memberships.find(x=>x.clinic===g.clinic);g.dentalBudgetScope=g.clinic==='odonto'&&['Aluno ou estagiário','Professor supervisor','Profissional responsável'].includes(g.role)&&(g.dentalBudgetScope??old?.dentalBudgetScope??(JSON.stringify(g.actions.orcamentos||[])===JSON.stringify(['visualizar','imprimir'])));
  u.memberships=u.memberships.filter(x=>x.clinic!==g.clinic);u.memberships.push(clone(g));localStorage.setItem(KEY,JSON.stringify(s));return {isOk:true};
 }
 function saveClinic(c){if(!allowed(c.id,'clinicas','administrar'))return {isOk:false,error:'Acesso restrito'};const s=state(),found=s.clinics.find(x=>x.id===c.id);if(!found||!c.name?.trim())return {isOk:false,error:'Clínica inválida'};found.name=c.name.trim();localStorage.setItem(KEY,JSON.stringify(s));return {isOk:true};}
 return {setClinicalResolver:fn=>{clinicalResolver=fn;},reauthenticate:(login,password)=>login===current().id&&password==='Demo@2026',setScheduleResolver:fn=>{scheduleResolver=fn;},staff:(c,role)=>state().users.filter(u=>u.memberships.some(g=>g.clinic===c&&g.role===role&&(!['Professor supervisor','Aluno ou estagiário'].includes(role)||g.clinical)&&(role!=='Professor supervisor'||(g.actions.atendimentos||[]).includes('validar')&&(g.actions.atendimentos||[]).includes('visualizar')&&(g.actions.supervisao||[]).includes('visualizar')))).map(({id,name})=>({id,name})),setAssignmentResolver:fn=>{assignmentResolver=fn;},key:KEY,clinics:()=>clone(state().clinics),sessionKey:SESSION,clinic,current,membership,assigned,allowed,canRead,action,entityModule,clinicalTypes,select,accounts:()=>state().users.map(({id,name})=>({id,name})),management:()=>{if(!allowed(clinic,'usuarios','administrar'))throw Error('Acesso restrito');return clone(state());},saveUser,saveMembership,saveClinic,templateFor,templates:clone(templates)};
})();
