import { ALLOWED_EMAILS, createToken, setCookie } from '../_helpers/auth.js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return jsonError('Invalid JSON', 400); }

  const email = (body.email || '').toLowerCase().trim();
  const password = body.password || '';

  if (!ALLOWED_EMAILS.includes(email) || password !== env.ADMIN_PASSWORD) {
    return jsonError('Invalid credentials', 401);
  }

  const token = await createToken(email, env.JWT_SECRET);
  return Response.json({ ok: true, email }, {
    headers: { 'Set-Cookie': setCookie(token) },
  });
}

function jsonError(msg, status) {
  return Response.json({ error: msg }, { status });
}
