import { getSession } from '../../_helpers/auth.js';
import { listFiles, getFile, putFile, toYamlFrontmatter, eventFilename } from '../../_helpers/github.js';

const EVENTS_PATH = 'content/collections/upcoming';

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await listFiles(env, EVENTS_PATH);
  const events = [];

  for (const f of files.filter(f => f.name.endsWith('.md'))) {
    const file = await getFile(env, `${EVENTS_PATH}/${f.name}`);
    if (!file) continue;
    const parsed = parseFrontmatter(file.content);
    events.push({ ...parsed, _filename: f.name.replace('.md', ''), _sha: file.sha });
  }

  events.sort((a, b) => (a.date_field || '').localeCompare(b.date_field || ''));
  return Response.json({ events });
}

export async function onRequestPost({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const filename = eventFilename(data.title, data.date_field);
  const path = `${EVENTS_PATH}/${filename}`;

  const frontmatter = {
    id: crypto.randomUUID(),
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
    await putFile(env, path, content, undefined, `Add event: ${data.title}`);
    return Response.json({ ok: true, filename: filename.replace('.md', '') });
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
