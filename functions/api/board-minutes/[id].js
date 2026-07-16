import { getSession } from '../../_helpers/auth.js';
import { getFile, putFile, deleteFile, toYamlFrontmatter } from '../../_helpers/github.js';

const PATH = 'content/collections/board_minutes';

export async function onRequestPut({ request, env, params }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const path = `${PATH}/${params.id}.md`;

  const existing = await getFile(env, path);
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const oldFm = parseFrontmatter(existing.content);

  const frontmatter = {
    id: oldFm.id || crypto.randomUUID(),
    blueprint: 'board_minute',
    title: data.title,
    date_of_meeting: data.date_of_meeting,
    ...(data.google_doc_url ? { google_doc_url: data.google_doc_url } : {}),
    ...(data.present ? { present: data.present } : {}),
    updated_at: Math.floor(Date.now() / 1000),
  };

  const content = toYamlFrontmatter(frontmatter, data.body || '');

  try {
    await putFile(env, path, content, existing.sha, `Update board minutes: ${data.title}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env, params }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const path = `${PATH}/${params.id}.md`;
  const existing = await getFile(env, path);
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const fm = parseFrontmatter(existing.content);
  try {
    await deleteFile(env, path, existing.sha, `Delete board minutes: ${fm.title || params.id}`);
    return Response.json({ ok: true });
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
