import { getSession } from '../../_helpers/auth.js';
import { listFiles, getFile, putFile, toYamlFrontmatter, slugify } from '../../_helpers/github.js';

const SPONSORS_PATH = 'content/collections/sponsors';

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await listFiles(env, SPONSORS_PATH);
  const sponsors = [];

  for (const f of files.filter(f => f.name.endsWith('.md'))) {
    const file = await getFile(env, `${SPONSORS_PATH}/${f.name}`);
    if (!file) continue;
    const parsed = parseFrontmatter(file.content);
    if (parsed.blueprint === 'type') continue;
    sponsors.push({ ...parsed, _filename: f.name.replace('.md', ''), _sha: file.sha });
  }

  sponsors.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  return Response.json({ sponsors });
}

export async function onRequestPost({ request, env }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const filename = `${slugify(data.title)}.md`;
  const path = `${SPONSORS_PATH}/${filename}`;

  const frontmatter = buildFrontmatter(data, crypto.randomUUID());
  const content = toYamlFrontmatter(frontmatter);

  try {
    await putFile(env, path, content, undefined, `Add sponsor: ${data.title}`);
    return Response.json({ ok: true, filename: filename.replace('.md', '') });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

function buildFrontmatter(data, id) {
  const fm = {
    id,
    blueprint: 'sponsor',
    title: data.title,
  };
  if (data.web_site) fm.web_site = data.web_site;
  if (data.logo_url) fm.logo = [data.logo_url];
  if (data.city_state) fm.city_state = data.city_state;
  fm.is_pro_shop = !!data.is_pro_shop;
  fm.north_of_msdgc = !!data.north_of_msdgc;
  if (data.udisc_link) fm.udisc_link = data.udisc_link;
  if (data.driving_directions) fm.driving_directions = data.driving_directions;
  if (data.nearby) fm.nearby = data.nearby;
  if (data.logo_background) fm.logo_background = data.logo_background;
  fm.updated_at = Math.floor(Date.now() / 1000);
  return fm;
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
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1).replace(/''/g, "'");
    }
    result[key] = val;
    i++;
  }
  return result;
}
