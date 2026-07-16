import { getSession } from '../../_helpers/auth.js';
import { listFiles, getFile, putFile, toYamlFrontmatter, slugify } from '../../_helpers/github.js';

const PATH = 'content/collections/board_minutes';

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await listFiles(env, PATH);
  const minutes = [];

  for (const f of files.filter(f => f.name.endsWith('.md'))) {
    const file = await getFile(env, `${PATH}/${f.name}`);
    if (!file) continue;
    const parsed = parseFrontmatter(file.content);
    minutes.push({ ...parsed, _filename: f.name.replace('.md', ''), _sha: file.sha });
  }

  minutes.sort((a, b) => (b.date_of_meeting || '').localeCompare(a.date_of_meeting || ''));
  return Response.json({ minutes });
}

export async function onRequestPost({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const filename = `${data.date_of_meeting}.${slugify(data.title)}.md`;
  const path = `${PATH}/${filename}`;

  const frontmatter = {
    id: crypto.randomUUID(),
    blueprint: 'board_minute',
    title: data.title,
    date_of_meeting: data.date_of_meeting,
    ...(data.google_doc_url ? { google_doc_url: data.google_doc_url } : {}),
    ...(data.present ? { present: data.present } : {}),
    updated_at: Math.floor(Date.now() / 1000),
  };

  const content = toYamlFrontmatter(frontmatter, data.body || '');

  try {
    await putFile(env, path, content, undefined, `Add board minutes: ${data.title}`);
    return Response.json({ ok: true, filename: filename.replace('.md', '') });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  const lines = match[1].split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const colon = line.indexOf(':');
    if (colon < 0) { i++; continue; }
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if (val === '|-') {
      const blockLines = [];
      i++;
      while (i < lines.length && lines[i].startsWith('  ')) {
        blockLines.push(lines[i].slice(2));
        i++;
      }
      result[key] = blockLines.join('\n');
      continue;
    }
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1).replace(/''/g, "'");
    }
    result[key] = val;
    i++;
  }
  return result;
}
