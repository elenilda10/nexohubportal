import {jsonResponse,isConfigured,allowedOrigin,getBody,makeCookie,clientHash,tooManyAttempts,addFailure,audit} from "../../_lib/security.js";
const proofHex = text => typeof text === "string" && /^[a-f0-9]{64}$/i.test(text);
const validId = id => typeof id === "string" && /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id);
const fromHex = hex => Uint8Array.from(hex.match(/../g), pair => parseInt(pair,16));
export async function onRequestPost(context) {
  if (!allowedOrigin(context.request)) return jsonResponse({error:"Origem não autorizada."},403);
  if (!isConfigured(context.env)) return jsonResponse({error:"Painel ainda não configurado."},503);
  let data; try {data=await getBody(context.request,2048);} catch(error) {return jsonResponse({error:error.message},400);}
  if (!validId(data.id) || !proofHex(data.proof)) return jsonResponse({error:"Solicitação de login inválida. Atualize a página."},400);
  try {
    const key = await clientHash(context);
    if (await tooManyAttempts(context,key)) return jsonResponse({error:"Muitas tentativas. Aguarde 15 minutos."},429);
    const db=context.env.CMS_DB;
    const row=await db.prepare("SELECT created_at FROM cms_login_challenges WHERE id=? AND client_hash=?").bind(data.id,key).first();
    if (!row) return jsonResponse({error:"Sessão de login expirada. Tente novamente."},400);
    const deleted=await db.prepare("DELETE FROM cms_login_challenges WHERE id=? AND client_hash=?").bind(data.id,key).run();
    if (Number(deleted.meta?.changes)!==1) return jsonResponse({error:"Solicitação já utilizada. Tente novamente."},400);
    const age=Math.floor(Date.now()/1000)-Number(row.created_at);
    if (age<0 || age>120) return jsonResponse({error:"Sessão de login expirada. Tente novamente."},400);
    const derivedHex=context.env.ADMIN_PASSWORD_HASH.split("$")[3];
    const verifier=await crypto.subtle.importKey("raw",fromHex(derivedHex),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
    const signedText="nexohub-login-v1:"+data.id+":"+new URL(context.request.url).origin;
    const valid=await crypto.subtle.verify("HMAC",verifier,fromHex(data.proof),new TextEncoder().encode(signedText));
    if (!valid) {await addFailure(context,key);return jsonResponse({error:"Credenciais incorretas."},401);}
    await db.prepare("DELETE FROM cms_login_attempts WHERE client_hash=?").bind(key).run();
    await audit(context,"login");
    return jsonResponse({ok:true},200,{"Set-Cookie":await makeCookie(context.env.ADMIN_SESSION_SECRET)});
  } catch(error) {
    console.error("admin_login_error",error?.name||"Error");
    return jsonResponse({error:"Erro ao verificar acesso. Tente novamente."},503);
  }
}
