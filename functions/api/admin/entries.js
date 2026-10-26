import {jsonResponse,authenticated,isConfigured,allowedOrigin,getBody,audit} from "../../_lib/security.js";
const kinds = new Set(["bot","notice","faq","release","roadmap"]);
const slugOK = s => typeof s === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 80;
const plain = x => typeof x === "string" && x.length >= 1 && x.length <= 8000;
const strArray = (xs,max = 40) => Array.isArray(xs) && xs.length <= max && xs.every(x => typeof x === "string" && x.length <= 250);
const HTTPS = x => {try{return new URL(x).protocol === "https:";}catch{return false;}};
function validate(kind,slug,obj) {
  if (!kinds.has(kind) || !slugOK(slug) || !obj || typeof obj !== "object" || Array.isArray(obj)) return "Tipo ou identificador inválido.";
  if (kind === "bot") {
    if (!plain(obj.name) || !plain(obj.category) || !plain(obj.short) || !plain(obj.description) ||
      !strArray(obj.features) || !strArray(obj.platforms) || !["violet","cyan","amber"].includes(obj.accent) ||
      !["download","music","trophy"].includes(obj.icon) ||
      !(obj.telegram == null || (typeof obj.telegram === "string" && HTTPS(obj.telegram)))) return "Dados do bot inválidos.";
  }
  if (kind === "notice") {
    if (!plain(obj.title) || !plain(obj.category) || !plain(obj.summary) || !strArray(obj.paragraphs) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(obj.date) || typeof obj.pinned !== "boolean") return "Aviso inválido.";
  }
  if (kind === "faq" && (!plain(obj.question) || !plain(obj.answer) || !plain(obj.category))) return "Pergunta inválida.";
  if (kind === "release" && (!plain(obj.title) || !plain(obj.summary) || !plain(obj.version) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(obj.date) || !strArray(obj.changes) || !plain(obj.type))) return "Versão inválida.";
  if (kind === "roadmap" && (!plain(obj.title) || !plain(obj.category) || !plain(obj.stage) || !plain(obj.description))) return "Item inválido.";
  if (obj.slug && obj.slug !== slug) return "Identificador do conteúdo não corresponde à URL.";
  return null;
}
export async function onRequestGet(context) {
  if (!(await authenticated(context))) return jsonResponse({error:"Acesso restrito."},401);
  const rows = await context.env.CMS_DB.prepare("SELECT kind,slug,content,updated_at FROM cms_entries ORDER BY kind,updated_at DESC").all();
  const entries = (rows.results||[]).map(row=>{
    try{return {kind:row.kind,slug:row.slug,data:JSON.parse(row.content),updated_at:row.updated_at};}catch{return null;}
  }).filter(Boolean);
  const initialized = !!(await context.env.CMS_DB.prepare("SELECT value FROM cms_meta WHERE key = 'initialized'").first());
  return jsonResponse({entries,initialized});
}
export async function onRequestPut(context) {
  if (!allowedOrigin(context.request)) return jsonResponse({error:"Origem não autorizada."},403);
  if (!(await authenticated(context))) return jsonResponse({error:"Acesso restrito."},401);
  let body;try{body=await getBody(context.request);}catch(e){return jsonResponse({error:e.message},400);}
  const {kind,slug,data}=body;
  const error=validate(kind,slug,data);if(error)return jsonResponse({error},400);
  data.slug = slug;
  const content=JSON.stringify(data);
  if (content.length > 20000) return jsonResponse({error:"Documento grande demais."},413);
  await context.env.CMS_DB.batch([
    context.env.CMS_DB.prepare(`INSERT INTO cms_entries(kind,slug,content) VALUES (?1,?2,?3)
      ON CONFLICT(kind,slug) DO UPDATE SET content=excluded.content, updated_at=datetime('now')`).bind(kind,slug,content),
    context.env.CMS_DB.prepare("INSERT OR REPLACE INTO cms_meta(key,value) VALUES ('initialized','1')"),
    context.env.CMS_DB.prepare("INSERT INTO cms_audit_log(event,target) VALUES (?,?)").bind("save",kind+":"+slug)
  ]);
  return jsonResponse({ok:true,slug,kind});
}
export async function onRequestDelete(context) {
  if (!allowedOrigin(context.request)) return jsonResponse({error:"Origem não autorizada."},403);
  if (!(await authenticated(context))) return jsonResponse({error:"Acesso restrito."},401);
  const params = new URL(context.request.url).searchParams;
  const kind=params.get("kind"),slug=params.get("slug");
  if(!kinds.has(kind)||!slugOK(slug)) return jsonResponse({error:"Parâmetros inválidos."},400);
  await context.env.CMS_DB.batch([
    context.env.CMS_DB.prepare("DELETE FROM cms_entries WHERE kind=? AND slug=?").bind(kind,slug),
    context.env.CMS_DB.prepare("INSERT INTO cms_audit_log(event,target) VALUES (?,?)").bind("delete",kind+":"+slug)
  ]);
  return jsonResponse({ok:true});
}
