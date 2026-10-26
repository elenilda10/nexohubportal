import {jsonResponse,allowedOrigin,deleteCookie} from "../../_lib/security.js";
export async function onRequestPost(context) {
  if (!allowedOrigin(context.request)) return jsonResponse({error:"Origem não autorizada."},403);
  return jsonResponse({ok:true},200,{"Set-Cookie":deleteCookie()});
}
