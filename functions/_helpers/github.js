function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'msdgc-admin',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

const BASE = 'https://api.github.com';

export async function getFile(env, path) {
  const res = await fetch(`${BASE}/repos/${env.GITHUB_REPO}/contents/${path}`, {
    headers: headers(env.GITHUB_TOKEN),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path}: ${res.status}`);
  const data = await res.json();
  return { content: atob(data.content.replace(/\s/g, '')), sha: data.sha };
}

export async function putFile(env, path, content, sha, message) {
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const body = { message, content: encoded };
  if (sha) body.sha = sha;
  const res = await fetch(`${BASE}/repos/${env.GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: headers(env.GITHUB_TOKEN),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT ${path}: ${res.status} ${err}`);
  }
  return res.json();
}

export async function deleteFile(env, path, sha, message) {
  const res = await fetch(`${BASE}/repos/${env.GITHUB_REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: headers(env.GITHUB_TOKEN),
    body: JSON.stringify({ message, sha }),
  });
  if (!res.ok) throw new Error(`GitHub DELETE ${path}: ${res.status}`);
  return res.json();
}

export async function listFiles(env, path) {
  const res = await fetch(`${BASE}/repos/${env.GITHUB_REPO}/contents/${path}`, {
    headers: headers(env.GITHUB_TOKEN),
  });
  if (!res.ok) return [];
  return res.json();
}

export function toYamlFrontmatter(data, body = '') {
  const lines = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}:`);
      for (const item of v) {
        lines.push(`  - '${String(item).replace(/'/g, "''")}'`);
      }
    } else if (typeof v === 'boolean') {
      lines.push(`${k}: ${v}`);
    } else if (typeof v === 'number') {
      lines.push(`${k}: ${v}`);
    } else if (typeof v === 'string' && v.includes('\n')) {
      lines.push(`${k}: |-`);
      for (const line of v.split('\n')) {
        lines.push(`  ${line}`);
      }
    } else if (typeof v === 'string') {
      lines.push(`${k}: '${v.replace(/'/g, "''")}'`);
    }
  }
  lines.push('---');
  if (body) lines.push('', body);
  else lines.push('');
  return lines.join('\n');
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function eventFilename(title, date) {
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${date}.${slug}.md`;
}
