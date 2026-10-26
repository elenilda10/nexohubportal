import {jsonResponse,authenticated} from "../../_lib/security.js";
export async function onRequestGet(context) {
  if (!(await authenticated(context))) return jsonResponse({error:"Acesso restrito."},401);
  const result=await context.env.CMS_DB.prepare("SELECT event,target,created_at FROM cms_audit_log ORDER BY id DESC LIMIT 60").all();
  return jsonResponse({events:result.results||[]});
}
