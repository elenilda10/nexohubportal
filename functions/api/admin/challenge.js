import {jsonResponse,isConfigured,clientHash,tooManyAttempts} from "../../_lib/security.js";

export async function onRequestGet(context) {
  if (!isConfigured(context.env)) return jsonResponse({error:"Painel ainda não configurado."},503);
  try {
    const client = await clientHash(context);
    if (await tooManyAttempts(context,client)) return jsonResponse({error:"Muitas tentativas. Aguarde 15 minutos."},429);
    const db=context.env.CMS_DB;
    const now=Math.floor(Date.now()/1000);
    await db.prepare("DELETE FROM cms_login_challenges WHERE created_at < ?").bind(now-120).run();
    const existing=await db.prepare("SELECT COUNT(*) AS total FROM cms_login_challenges WHERE client_hash=?").bind(client).first();
    if(Number(existing?.total||0)>=5) return jsonResponse({error:"Muitas solicitações de acesso. Aguarde dois minutos."},429);
    const id=crypto.randomUUID();
    await db.prepare("INSERT INTO cms_login_challenges(id,client_hash,created_at) VALUES (?,?,?)").bind(id,client,now).run();
    const [,iterations,salt]=context.env.ADMIN_PASSWORD_HASH.split("$");
    return jsonResponse({id,iterations:Number(iterations),salt,algorithm:"PBKDF2-SHA256",expiresIn:120});
  } catch(error) {
    console.error("admin_challenge_error",error?.name||"Error");
    return jsonResponse({error:"Falha temporária ao iniciar acesso."},503);
  }
}
