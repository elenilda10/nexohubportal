import {jsonResponse,authenticated,isConfigured} from "../../_lib/security.js";
export async function onRequestGet(context) {
  return jsonResponse({configured:isConfigured(context.env),authenticated:await authenticated(context)});
}
