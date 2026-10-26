import {jsonResponse,isConfigured,allowedOrigin,getBody,checkPassword,makeCookie,clientHash,tooManyAttempts,addFailure,audit} from "../../_lib/security.js";
export async function onRequestPost(context) {
  if (!allowedOrigin(context.request)) return jsonResponse({error:"Origem não autorizada."},403);
  if (!isConfigured(context.env)) return jsonResponse({error:"Painel ainda não configurado."},503);
  let data;try {data = await getBody(context.request, 2048);}catch(e){return jsonResponse({error:e.message},400);}
  const key = await clientHash(context);
  if (await tooManyAttempts(context,key)) return jsonResponse({error:"Muitas tentativas. Aguarde 15 minutos."},429);
  if (!(await checkPassword(data.password, context.env.ADMIN_PASSWORD_HASH))) {
    await addFailure(context,key);
    return jsonResponse({error:"Credenciais incorretas."},401);
  }
  await context.env.CMS_DB.prepare("DELETE FROM cms_login_attempts WHERE client_hash = ?").bind(key).run();
  await audit(context,"login");
  return jsonResponse({ok:true},200,{"Set-Cookie":await makeCookie(context.env.ADMIN_SESSION_SECRET)});
}
