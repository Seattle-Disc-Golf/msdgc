import { getSession } from '../_helpers/auth.js';

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ authenticated: false }, { status: 401 });
  return Response.json({ authenticated: true, email: session.email });
}
