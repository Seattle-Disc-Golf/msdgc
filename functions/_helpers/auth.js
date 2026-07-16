export const ALLOWED_EMAILS = [
  'rowan.christmas@docker.com',
  'rowanxmas@gmail.com',
];

const COOKIE = 'msdgc_admin';

async function hmacSign(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function hmacVerify(payload, sig, secret) {
  const expected = await hmacSign(payload, secret);
  return expected === sig;
}

export async function createToken(email, secret) {
  const payload = btoa(JSON.stringify({ email, exp: Date.now() + 7 * 24 * 3600_000 }));
  const sig = await hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifyToken(token, secret) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!(await hmacVerify(payload, sig, secret))) return null;
  const data = JSON.parse(atob(payload));
  if (Date.now() > data.exp) return null;
  return data;
}

export async function getSession(request, secret) {
  const cookie = request.headers.get('Cookie') || '';
  const token = cookie.split(';').map(c => c.trim())
    .find(c => c.startsWith(COOKIE + '='))
    ?.slice(COOKIE.length + 1);
  return verifyToken(token, secret);
}

export function setCookie(token) {
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 3600}`;
}

export function clearCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}
