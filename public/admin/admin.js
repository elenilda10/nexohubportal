import {bots, notices, faqs, releases, roadmap} from "../data.js";

const root=document.getElementById("admin-root");
const logoutButton=document.getElementById("logout");
const kinds={bot:{label:"Bots",singular:"Bot",icon:"◈"},notice:{label:"Avisos",singular:"Aviso",icon:"◉"},faq:{label:"Perguntas",singular:"Pergunta",icon:"?"},release:{label:"Atualizações",singular:"Atualização",icon:"↗"},roadmap:{label:"Planejamento",singular:"Projeto",icon:"◎"}};
const samples={bot:{slug:"",name:"",category:"Downloads",icon:"download",accent:"violet",short:"",description:"",features:[],platforms:[],telegram:null},
 notice:{slug:"",title:"",category:"NexoHub",date:new Date().toISOString().slice(0,10),summary:"",paragraphs:[],pinned:false},
 faq:{id:"",category:"Sobre o portal",question:"",answer:""},
 release:{slug:"",date:new Date().toISOString().slice(0,10),version:"",title:"",type:"Portal",summary:"",changes:[]},
 roadmap:{title:"",category:"NexoHub",stage:"Em avaliação",description:""}};
const fields={
 bot:[["name","Nome do bot","text"],["category","Categoria","text"],["short","Descrição curta","text"],["description","Sobre o projeto","long"],["telegram","Link oficial (https://...)","url"],["features","Funcionalidades — uma por linha","lines"],["platforms","Plataformas confirmadas — uma por linha","lines"],["platformDetails","Detalhes por plataforma (Nome | Categoria | Status | Formatos | Observações) — uma linha por plataforma","platformDetails"],["icon","Ícone","icon"],["accent","Cor do card","accent"]],
 notice:[["title","Título","text"],["category","Categoria / Projeto","text"],["date","Data do aviso","date"],["summary","Resumo","long"],["paragraphs","Texto do comunicado — um parágrafo por linha","lines"],["pinned","Destaque no portal","boolean"]],
 faq:[["question","Pergunta","text"],["category","Categoria","text"],["answer","Resposta","long"]],
 release:[["title","Título da atualização","text"],["version","Versão","text"],["type","Tipo","text"],["date","Data","date"],["summary","Resumo","long"],["changes","Alterações — uma por linha","lines"]],
 roadmap:[["title","Título","text"],["category","Categoria","text"],["stage","Etapa atual","text"],["description","Descrição","long"]]
};
const escapeHTML = s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slugify = s=>String(s||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80);
let entries=[],activeKind="bot",selectedKey=null,editing=null,unconfigured=false;

async function api(path,options={}){
 const response=await fetch(path,{credentials:"same-origin",cache:"no-store",...options,
   headers:{"Accept":"application/json",...(options.body?{"Content-Type":"application/json"}:{}),...(options.headers||{})}});
 let payload={};
 try{payload=await response.json();}catch{}
 if(!response.ok)throw new Error(payload.error||"Erro HTTP "+response.status);
 return payload;
}
function notice(text,isError=false){
 const el=document.getElementById("toast");if(!el)return;
 el.textContent=text;el.className="toast show"+(isError?" error":"");
 clearTimeout(notice._timer);
 notice._timer=setTimeout(()=>el.className="toast",5000);
}
function loginPage(configured=true) {
 logoutButton.hidden=true;
 root.innerHTML='<section class="auth-wrap"><div class="auth-art"><div class="glow"></div><span class="kicker">NEXOHUB STUDIO</span><h1>Seu espaço para <em>gerenciar.</em></h1><p>Atualize seus bots, publique novidades e organize o portal sem editar arquivos do GitHub.</p><div class="auth-info">🔒 Acesso privado · Sessão segura</div></div><form id="login-form" class="login-card"><div class="login-emblem">N</div><span class="kicker">ACESSO ADMINISTRATIVO</span><h2>Bem-vindo de volta.</h2><p>Entre com a senha administrativa para continuar.</p>'+
   (configured?'<label for="password">Senha de administrador</label><input type="password" id="password" required autocomplete="current-password" minlength="8" placeholder="Digite sua senha" /><button class="button primary full" type="submit">Entrar no painel →</button>':
   '<div class="auth-pending">O painel está protegido, mas ainda precisa ser ativado. <a href="/admin/configurar.html">Gerar credenciais e seguir o passo a passo seguro →</a></div>')+
   '<p id="login-error" class="form-error" role="alert"></p></form></section>';
 document.getElementById("login-form").addEventListener("submit",async ev=>{
  ev.preventDefault();const button=ev.currentTarget.querySelector("button");
  if(!button)return;button.disabled=true;button.textContent="Verificando...";
  try{
   await api("/api/admin/login",{method:"POST",body:JSON.stringify({password:document.getElementById("password").value})});
   await loadDashboard();
  }catch(e){document.getElementById("login-error").textContent=e.message;}
  finally{button.disabled=false;button.textContent="Entrar no painel →";}
 });
}
async function loadDashboard(){
 const r=await api("/api/admin/entries");
 entries=r.entries;
 logoutButton.hidden=false;
 dashboard(!r.initialized);
}
function summaryStats(){
 return Object.keys(kinds).map(kind=>'<div class="metric"><span>'+kinds[kind].label+'</span><strong>'+entries.filter(x=>x.kind===kind).length+'</strong><small>Itens no catálogo</small></div>').join("");
}
function dashboard(needsImport){
 root.innerHTML='<div class="admin-layout"><aside class="sidebar"><span class="side-title">GERENCIAMENTO</span>'+
 Object.entries(kinds).map(([kind,item])=>'<button class="side-tab'+(kind===activeKind?' active':'')+'" data-kind="'+kind+'"><span>'+item.icon+'</span>'+item.label+'<b>'+entries.filter(e=>e.kind===kind).length+'</b></button>').join("")+
 '<button class="side-tab" data-kind="audit"><span>◷</span>Auditoria</button><div class="side-footer">NexoHub CMS<br><small>Cloudflare Pages + D1</small></div></aside>'+
 '<div class="workspace"><div class="workspace-header"><div><span class="kicker">PAINEL DE CONTROLE</span><h1>Gerencie o NexoHub.</h1><p>O conteúdo publicado aparece no portal após salvar.</p></div><span class="private-pill">● Área privada</span></div>'+
 '<div class="metrics">'+summaryStats()+'</div>'+
 (needsImport?'<div class="import-banner"><div><strong>Importar o conteúdo atual?</strong><p>Isso copia os bots e avisos da versão pública para o banco de dados. Execute uma única vez, antes de editar.</p></div><button id="initial-import" class="button primary">Importar conteúdo inicial</button></div>':'')+
 '<div id="workspace-area"></div></div></div><div id="toast" class="toast" role="status"></div>';
 if(needsImport)document.getElementById("initial-import").addEventListener("click",doImport);
 root.querySelectorAll(".side-tab").forEach(b=>b.addEventListener("click",()=>{activeKind=b.dataset.kind;selectedKey=null;editing=null;dashboard(false);}));
 renderWorkspace();
}
function doImport(){
 const button=document.getElementById("initial-import");
 button.disabled=true;button.textContent="Importando...";
 api("/api/admin/import",{method:"POST",body:JSON.stringify({bots,notices,faqs,releases,roadmap})})
 .then(loadDashboard).catch(err=>{button.disabled=false;button.textContent="Importar conteúdo inicial";notice(err.message,true);});
}
function renderWorkspace(){
 const target=document.getElementById("workspace-area");
 if(activeKind==="audit")return showAudit(target);
 const kind=activeKind,group=entries.filter(x=>x.kind===kind),label=kinds[kind];
 target.innerHTML='<div class="panel-title"><div><span class="kicker">GERENCIAR CONTEÚDO</span><h2>'+label.label+'</h2><p>Selecione um item para editar ou crie um novo.</p></div><button id="new-entry" class="button primary">+ Novo '+label.singular.toLowerCase()+'</button></div>'+
 '<div class="editor-layout"><div class="entry-list">'+
 (group.length?group.map(x=>'<button class="entry-row '+(selectedKey===x.slug?'selected':'')+'" data-entry="'+escapeHTML(x.slug)+'"><strong>'+
 escapeHTML(x.data.name||x.data.title||x.data.question||x.slug)+'</strong><small>'+escapeHTML(x.slug)+'</small></button>').join(""):'<div class="no-entries">Nenhum item nesta categoria.</div>')+
 '</div><section class="edit-card" id="edit-card"><div class="edit-empty"><div>✦</div><h3>Pronto para editar</h3><p>Escolha um item à esquerda ou crie um novo conteúdo.</p></div></section></div>';
 target.querySelector("#new-entry").addEventListener("click",()=>editItem(kind,null));
 target.querySelectorAll("[data-entry]").forEach(b=>b.addEventListener("click",()=>editItem(kind,b.dataset.entry)));
 if(editing&&editing.kind===kind)renderEditor();
}
function editItem(kind,slug){
 activeKind=kind;
 const item=entries.find(x=>x.kind===kind&&x.slug===slug);
 selectedKey=slug;
 editing={kind,slug:slug||"",data:item?structuredClone(item.data):structuredClone(samples[kind]),isNew:!item};
 renderWorkspace();
}
function fieldHTML(key,label,type,data){
 const val=data[key],id="field-"+key;
 if(type==="boolean")return '<label class="check-field"><input type="checkbox" id="'+id+'" name="'+key+'" '+(val?'checked':'')+' />'+escapeHTML(label)+'</label>';
 if(type==="icon"||type==="accent"){
  const options=(type==="icon"?["download","music","trophy"]:["violet","cyan","amber"]);
  return '<label class="form-field" for="'+id+'"><span>'+escapeHTML(label)+'</span><select id="'+id+'" name="'+key+'">'+options.map(o=>'<option value="'+o+'"'+(val===o?' selected':'')+'>'+o+'</option>').join("")+'</select></label>';
 }
 const value=type==="lines"?(val||[]).join("\n") :
  type==="platformDetails"?(Array.isArray(val)?val.map(x=>[x.name,x.category,x.status,x.formats,x.note].join(" | ")).join("\n"):"") :
  (val??"");
 if(type==="long"||type==="lines"||type==="platformDetails")return '<label class="form-field" for="'+id+'"><span>'+escapeHTML(label)+'</span><textarea id="'+id+'" name="'+key+'" rows="'+(type==="long"?4:type==="platformDetails"?12:5)+'">'+escapeHTML(value)+'</textarea></label>';
 return '<label class="form-field" for="'+id+'"><span>'+escapeHTML(label)+'</span><input id="'+id+'" name="'+key+'" type="'+(type==="date"?"date":type==="url"?"url":"text")+'" value="'+escapeHTML(value)+'"></label>';
}
function renderEditor(){
 const target=document.getElementById("edit-card");if(!target||!editing)return;
 const {kind,slug,data,isNew}=editing;
 target.innerHTML='<form id="content-form"><div class="editor-top"><div><span class="kicker">EDIÇÃO DE '+kinds[kind].singular.toUpperCase()+'</span><h3>'+escapeHTML(isNew?"Novo conteúdo":data.name||data.title||data.question||slug)+'</h3></div>'+(isNew?'':'<button type="button" class="delete-link" id="delete-entry">Excluir</button>')+'</div>'+
 '<label class="form-field" for="entry-slug"><span>Identificador único (slug)</span><input id="entry-slug" type="text" pattern="[a-z0-9]+(-[a-z0-9]+)*" required '+(!isNew?'readonly':'')+' value="'+escapeHTML(slug)+'" placeholder="exemplo-de-identificador"><small>Use letras minúsculas, números e hífens. Não altere depois de publicar.</small></label>'+
 fields[kind].filter(x => x[0] !== "platformDetails" || slug === "savevid").map(x=>fieldHTML(...x,data)).join("")+
 '<div class="edit-bottom"><span id="edit-error" class="form-error" role="alert"></span><button type="submit" class="button primary">Salvar alterações →</button></div></form>';
 if(isNew){
   let changed=false;
   const slugEl=document.getElementById("entry-slug");
   slugEl.addEventListener("input",()=>{changed=true;});
   const nameField=document.querySelector("#field-name,#field-title,#field-question");
   if(nameField)nameField.addEventListener("input",()=>{
     if(!changed){slugEl.value=slugify(nameField.value);}
   });
 }
 document.getElementById("content-form").addEventListener("submit",saveItem);
 if(!isNew)document.getElementById("delete-entry").addEventListener("click",deleteItem);
}
async function saveItem(ev){
 ev.preventDefault();if(!editing)return;
 const form=ev.currentTarget,submit=form.querySelector('button[type="submit"]');
 const data=structuredClone(editing.data),kind=editing.kind,slug=document.getElementById("entry-slug").value.trim();
 for(const [key,,type] of fields[kind]){
   const field=form.elements.namedItem(key);
   if(type==="boolean")data[key]=field.checked;
   else if(type==="lines")data[key]=field.value.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
   else if(type==="platformDetails"){
     if(!field)continue;
     const allowedCategories=new Set(["Redes sociais","Música","Arquivos","Outros"]);
     const allowedStatuses=new Set(["principal","integrado","experimental","restrito"]);
     const rows=field.value.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
     const parsed=[];
     for(const row of rows) {
       const parts=row.split("|").map(v=>v.trim());
       if(parts.length!==5 || !parts[0] || !allowedCategories.has(parts[1]) ||
         !allowedStatuses.has(parts[2]) || !parts[3] || !parts[4]) {
         document.getElementById("edit-error").textContent="Formato inválido nas plataformas. Use: Nome | Categoria | Status | Formatos | Observações. Categorias: Redes sociais, Música, Arquivos ou Outros. Status: principal, integrado, experimental ou restrito.";
         return;
       }
       parsed.push({name:parts[0],category:parts[1],status:parts[2],formats:parts[3],note:parts[4]});
     }
     data.platformDetails=parsed;
     data.platforms=parsed.filter(p=>p.status==="principal").map(p=>p.name);
   }
   else data[key]=field.value.trim();
 }
 if(kind==="bot"&&!data.telegram)data.telegram=null;
 if(kind==="faq")data.id=slug;else if(kind==="roadmap"){}else data.slug=slug;
 submit.disabled=true;submit.textContent="Salvando...";
 try{
   await api("/api/admin/entries",{method:"PUT",body:JSON.stringify({kind,slug,data})});
   notice("Conteúdo salvo no NexoHub.");
   await loadDashboard();editItem(kind,slug);
 }catch(e){document.getElementById("edit-error").textContent=e.message;}
 finally{submit.disabled=false;submit.textContent="Salvar alterações →";}
}
async function deleteItem(){
 if(!editing||!confirm("Excluir este conteúdo? Esta ação será refletida no site público."))return;
 try{
   await api("/api/admin/entries?kind="+encodeURIComponent(editing.kind)+"&slug="+encodeURIComponent(editing.slug),{method:"DELETE"});
   notice("Conteúdo excluído.");selectedKey=null;editing=null;await loadDashboard();
 }catch(e){notice(e.message,true);}
}
async function showAudit(target){
 target.innerHTML='<div class="panel-title"><div><span class="kicker">HISTÓRICO ADMINISTRATIVO</span><h2>Atividades recentes</h2><p>Últimas ações registradas no banco de dados.</p></div></div><div id="audit-list" class="audit-list">Carregando...</div>';
 try{
 const x=await api("/api/admin/audit");
 document.getElementById("audit-list").innerHTML=x.events.length?x.events.map(ev=>
   '<div><span>'+escapeHTML(ev.event)+'</span><strong>'+escapeHTML(ev.target||"Painel")+'</strong><time>'+escapeHTML(ev.created_at)+'</time></div>').join(""):'Nenhuma ação registrada.';
 }catch(e){notice(e.message,true);}
}
logoutButton.addEventListener("click",async()=>{
 try{await api("/api/admin/logout",{method:"POST"});}finally{entries=[];editing=null;loginPage(true);}
});
async function boot(){
 try{const session=await api("/api/admin/session");if(session.authenticated)await loadDashboard();else loginPage(session.configured);}
 catch{loginPage(false);}
}
boot();
