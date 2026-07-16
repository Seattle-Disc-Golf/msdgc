import { getSession } from '../../_helpers/auth.js';
import { getFile, putFile, deleteFile, toYamlFrontmatter } from '../../_helpers/github.js';

const EVENTS_PATH = 'content/collections/upcoming';

export async function onRequestPut({ request, env, params }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const path = `${EVENTS_PATH}/${params.id}.md`;

  const existing = await getFile(env, path);
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const oldFm = parseFrontmatter(existing.content);

  const frontmatter = {
    id: oldFm.id || crypto.randomUUID(),
    blueprint: 'upcomingevent',
    title: data.title,
    symbol: data.symbol || '📅',
    date_field: data.date_field,
    start_time: data.start_time || '',
    end_time: data.end_time || '',
    description: data.description || '',
    link_field: data.link_field || '',
    updated_at: Math.floor(Date.now() / 1000),
  };

  const content = toYamlFrontmatter(frontmatter);

  try {
    await putFile(env, path, content, existing.sha, `Update event: ${data.title}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env, params }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const path = `${EVENTS_PATH}/${params.id}.md`;

  const existing = await getFile(env, path);
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const fm = parseFrontmatter(existing.content);

  try {
    await deleteFile(env, path, existing.sha, `Delete event: ${fm.title || params.id}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if ((val.startsWith("'") && val.endsWith("'")) ||
        (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1).replace(/''/g, "'");
    }
    result[key] = val;
  }
  return result;
}
