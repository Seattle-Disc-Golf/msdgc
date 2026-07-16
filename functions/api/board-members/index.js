import { getSession } from '../../_helpers/auth.js';
import { listFiles, getFile, putFile, toYamlFrontmatter, slugify } from '../../_helpers/github.js';

const PATH = 'content/collections/board_member';

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await listFiles(env, PATH);
  const members = [];

  for (const f of files.filter(f => f.name.endsWith('.md'))) {
    const file = await getFile(env, `${PATH}/${f.name}`);
    if (!file) continue;
    const parsed = parseFrontmatter(file.content);
    members.push({ ...parsed, _filename: f.name.replace('.md', ''), _sha: file.sha });
  }

  members.sort((a, b) => {
    if (a.order && b.order) return Number(a.order) - Number(b.order);
    return (a.title || '').localeCompare(b.title || '');
  });
  return Response.json({ members });
}

export async function onRequestPost({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const filename = `${slugify(data.title)}.md`;
  const path = `${PATH}/${filename}`;

  const frontmatter = {
    id: crypto.randomUUID(),
    blueprint: 'board_member',
    title: data.title,
    ...(data.club_title ? { club_title: data.club_title } : {}),
    ...(data.roles?.length ? { roles: data.roles } : {}),
    ...(data.order ? { order: Number(data.order) } : {}),
    updated_at: Math.floor(Date.now() / 1000),
  };

  const content = toYamlFrontmatter(frontmatter);

  try {
    await putFile(env, path, content, undefined, `Add board member: ${data.title}`);
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
    if (val === '' && i + 1 < lines.length && lines[i + 1].startsWith('  - ')) {
      const arr = [];
      i++;
      while (i < lines.length && lines[i].startsWith('  - ')) {
        let item = lines[i].slice(4).trim();
        if ((item.startsWith("'") && item.endsWith("'")) || (item.startsWith('"') && item.endsWith('"'))) {
          item = item.slice(1, -1).replace(/''/g, "'");
        }
        arr.push(item);
        i++;
      }
      result[key] = arr;
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
