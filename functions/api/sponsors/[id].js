import { getSession } from '../../_helpers/auth.js';
import { getFile, putFile, deleteFile, toYamlFrontmatter } from '../../_helpers/github.js';

const SPONSORS_PATH = 'content/collections/sponsors';

export async function onRequestPut({ request, env, params }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const path = `${SPONSORS_PATH}/${params.id}.md`;

  const existing = await getFile(env, path);
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const oldFm = parseFrontmatter(existing.content);
  const frontmatter = buildFrontmatter(data, oldFm.id || crypto.randomUUID());
  const content = toYamlFrontmatter(frontmatter);

  try {
    await putFile(env, path, content, existing.sha, `Update sponsor: ${data.title}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env, params }) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const path = `${SPONSORS_PATH}/${params.id}.md`;
  const existing = await getFile(env, path);
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const fm = parseFrontmatter(existing.content);
  try {
    await deleteFile(env, path, existing.sha, `Delete sponsor: ${fm.title || params.id}`);
    return Response.json({ ok: true });
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
