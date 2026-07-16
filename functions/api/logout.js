import { clearCookie } from '../_helpers/auth.js';

export async function onRequestPost() {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearCookie() } });
}
