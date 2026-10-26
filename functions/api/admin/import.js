import {jsonResponse,allowedOrigin,authenticated,getBody} from "../../_lib/security.js";
const kindMap={bots:"bot",notices:"notice",faqs:"faq",releases:"release",roadmap:"roadmap"};
export async function onRequestPost(context) {
  if (!allowedOrigin(context.request)) return jsonResponse({error:"Origem não autorizada."},403);
  if (!(await authenticated(context))) return jsonResponse({error:"Acesso restrito."},401);
  const configured=await context.env.CMS_DB.prepare("SELECT value FROM cms_meta WHERE key='initialized'").first();
  if(configured) return jsonResponse({error:"Conteúdo já importado. Para alterações, utilize o editor."},409);
  let data;try{data=await getBody(context.request,100000);}catch(e){return jsonResponse({error:e.message},400);}
  const rows=[];
  for (const [collection,kind] of Object.entries(kindMap)) {
    const arr=data[collection];
    if (!Array.isArray(arr) || arr.length > 120) return jsonResponse({error:"Coleções inválidas."},400);
    for (const item of arr) {
      const slug=kind==="faq"?item.id:kind==="roadmap"?
         String(item.title||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):
         kind==="release"?item.slug:item.slug;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||"") || JSON.stringify(item).length > 20000) {
        return jsonResponse({error:"Dados iniciais inválidos."},400);
      }
      rows.push(context.env.CMS_DB.prepare("INSERT OR IGNORE INTO cms_entries(kind,slug,content) VALUES (?,?,?)").bind(kind,slug,JSON.stringify(item)));
    }
  }
  // Tamanho de lote limitado; marca initialized apenas após importar as entradas.
  for(let i=0;i<rows.length;i+=50)await context.env.CMS_DB.batch(rows.slice(i,i+50));
  await context.env.CMS_DB.batch([
    context.env.CMS_DB.prepare("INSERT OR REPLACE INTO cms_meta(key,value) VALUES ('initialized','1')"),
    context.env.CMS_DB.prepare("INSERT INTO cms_audit_log(event,target) VALUES ('import','seed')")
  ]);
  return jsonResponse({ok:true,count:rows.length});
}
