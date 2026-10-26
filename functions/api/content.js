import {jsonResponse} from "../_lib/security.js";
export async function onRequestGet(context) {
  if (!context.env.CMS_DB) return jsonResponse({active:false});
  try {
    const flag = await context.env.CMS_DB.prepare("SELECT value FROM cms_meta WHERE key = 'initialized'").first();
    if (!flag) return jsonResponse({active:false});
    const entries = await context.env.CMS_DB.prepare("SELECT kind,content FROM cms_entries ORDER BY created_at,slug").all();
    const out = {active:true,bots:[],notices:[],faqs:[],releases:[],roadmap:[]};
    const keys = {bot:"bots",notice:"notices",faq:"faqs",release:"releases",roadmap:"roadmap"};
    for(const row of entries.results || []) {
      if (keys[row.kind]) {
        try {out[keys[row.kind]].push(JSON.parse(row.content));} catch {}
      }
    }
    return jsonResponse(out,200,{"Access-Control-Allow-Origin":new URL(context.request.url).origin});
  } catch {return jsonResponse({active:false,error:"Conteúdo temporariamente indisponível."},503);}
}
