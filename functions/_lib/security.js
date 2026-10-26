const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_SESSION_AGE = 12 * 60 * 60;

function bytesToHex(bytes) {
  return [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(hex) {
  if (typeof hex !== "string" || !/^(?:[a-f0-9]{2})+$/i.test(hex)) return null;
  return Uint8Array.from(hex.match(/../g).map(x => parseInt(x, 16)));
}
function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromBase64Url(text) {
  if (!/^[\w-]+$/.test(text) || text.length > 2000) return null;
  try {
    const raw = atob(text.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(text.length / 4) * 4, "="));
    return Uint8Array.from(raw, char => char.charCodeAt(0));
  } catch { return null; }
}
async function hmac(secret, bytes) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {name:"HMAC", hash:"SHA-256"}, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, bytes));
}
async function hmacValid(secret, bytes, tag) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {name:"HMAC", hash:"SHA-256"}, false, ["verify"]);
  return crypto.subtle.verify("HMAC", key, tag, bytes);
}
export const jsonResponse = (data, status = 200, moreHeaders = {}) => new Response(JSON.stringify(data), {
  status, headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...moreHeaders
  }
});
export const isConfigured = env => !!(
  env?.CMS_DB && typeof env.ADMIN_PASSWORD_HASH === "string" &&
  /^pbkdf2\$\d+\$[a-f0-9]{32}\$[a-f0-9]{64}$/i.test(env.ADMIN_PASSWORD_HASH) &&
  typeof env.ADMIN_SESSION_SECRET === "string" && env.ADMIN_SESSION_SECRET.length >= 40
);
export const allowedOrigin = request => {
  const origin = request.headers.get("Origin");
  return origin !== null && origin === new URL(request.url).origin;
};
export async function getBody(request, maxBytes = 32_000) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxBytes) throw new Error("Conteúdo acima do tamanho permitido.");
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) throw new Error("Content-Type precisa ser application/json.");
  const text = await request.text();
  if (encoder.encode(text).length > maxBytes) throw new Error("Conteúdo acima do tamanho permitido.");
  let data;
  try { data = JSON.parse(text); } catch { throw new Error("JSON inválido."); }
  if (!data || Array.isArray(data) || typeof data !== "object") throw new Error("Objeto JSON esperado.");
  return data;
}
export async function checkPassword(input, stored) {
  if (typeof input !== "string" || input.length > 256 || !stored) return false;
  const [, iterationText, saltHex, targetHex] = stored.split("$");
  const rounds = Number(iterationText);
  if (!Number.isSafeInteger(rounds) || rounds < 100_000 || rounds > 400_000) return false;
  const salt = hexToBytes(saltHex);
  const target = hexToBytes(targetHex);
  if (!salt || !target || target.length !== 32) return false;
  const source = await crypto.subtle.importKey("raw", encoder.encode(input), "PBKDF2", false, ["deriveBits"]);
  const derived = new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2", salt, iterations:rounds, hash:"SHA-256"}, source, 256));
  let diff = 0;
  for(let i=0;i<32;i++) diff |= target[i] ^ derived[i];
  return diff === 0;
}
export async function makeCookie(secret) {
  const now = Math.floor(Date.now() / 1000);
  const payload = base64Url(encoder.encode(JSON.stringify({v:1,iat:now,exp:now+MAX_SESSION_AGE,nonce:crypto.randomUUID()})));
  const sig = base64Url(await hmac(secret, encoder.encode(payload)));
  return `nh_admin=${payload}.${sig}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_SESSION_AGE}`;
}
export const deleteCookie = () => "nh_admin=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
export async function authenticated(context) {
  if (!isConfigured(context.env)) return false;
  const cookie = context.request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)nh_admin=([^;]+)/);
  if (!match) return false;
  const [payload, signature, extra] = match[1].split(".");
  if (!payload || !signature || extra) return false;
  const tag = fromBase64Url(signature), raw = fromBase64Url(payload);
  if (!tag || !raw || raw.length > 350 || tag.length !== 32) return false;
  if (!(await hmacValid(context.env.ADMIN_SESSION_SECRET, encoder.encode(payload), tag))) return false;
  try {
    const session = JSON.parse(decoder.decode(raw));
    const now = Math.floor(Date.now() / 1000);
    return session.v === 1 && Number.isInteger(session.iat) && Number.isInteger(session.exp) &&
      session.exp >= now && session.iat <= now && session.exp - session.iat <= MAX_SESSION_AGE;
  } catch { return false; }
}
export async function clientHash(context) {
  const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
  return bytesToHex(await hmac(context.env.ADMIN_SESSION_SECRET, encoder.encode("login:" + ip)));
}
export async function tooManyAttempts(context, key) {
  const row = await context.env.CMS_DB.prepare("SELECT attempts, window_start FROM cms_login_attempts WHERE client_hash = ?").bind(key).first();
  return !!(row && row.attempts >= 5 && Number(row.window_start) + 900 > Math.floor(Date.now()/1000));
}
export async function addFailure(context,key) {
  const now = Math.floor(Date.now()/1000);
  await context.env.CMS_DB.prepare(`INSERT INTO cms_login_attempts(client_hash,attempts,window_start)
    VALUES (?1,1,?2) ON CONFLICT(client_hash) DO UPDATE SET
    attempts = CASE WHEN window_start <= ?2 - 900 THEN 1 ELSE attempts+1 END,
    window_start = CASE WHEN window_start <= ?2 - 900 THEN ?2 ELSE window_start END`).bind(key,now).run();
}
export async function audit(context,event,target = null) {
  await context.env.CMS_DB.prepare("INSERT INTO cms_audit_log (event,target) VALUES (?,?)").bind(event,target).run();
}
