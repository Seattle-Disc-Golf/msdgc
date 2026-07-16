import { getSession } from '../_helpers/auth.js';
import { getFile, putFile } from '../_helpers/github.js';

const FILE_PATH = 'content/collections/content/monday-dubs.md';

function parseMd(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: content };
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1).replace(/''/g, "'");
    }
    fm[key] = val;
  }
  return { fm, body: match[2].trim() };
}

function buildMd(fm, body) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined || v === null || v === '') continue;
    lines.push(`${k}: '${String(v).replace(/'/g, "''")}'`);
  }
  lines.push('---', '');
  if (body) lines.push(body);
  return lines.join('\n');
}

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const file = await getFile(env, FILE_PATH);
  if (!file) return Response.json({ error: 'File not found' }, { status: 404 });

  const { fm, body } = parseMd(file.content);
  return Response.json({ header1: fm.header1 || '', body, sha: file.sha });
}

export async function onRequestPut({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();

  const file = await getFile(env, FILE_PATH);
  if (!file) return Response.json({ error: 'File not found' }, { status: 404 });

  const { fm } = parseMd(file.content);
  fm.header1 = data.header1 || fm.header1 || 'Monday Putting League';

  const content = buildMd(fm, data.body || '');

  try {
    await putFile(env, FILE_PATH, content, file.sha, 'Update Monday Putting League content');
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
