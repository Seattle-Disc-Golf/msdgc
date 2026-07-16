// Build script: reads content/collections/**/*.md and outputs static JSON to public/api/collections/
// Run before vite build: node scripts/build-collections.js

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { load as yamlLoad } from 'js-yaml';

const BASE = process.cwd();

async function getTreeOrder(collection) {
  const treePath = join(BASE, 'content/trees/collections', `${collection}.yaml`);
  if (!existsSync(treePath)) return null;
  try {
    const content = await readFile(treePath, 'utf8');
    const data = yamlLoad(content);
    if (data?.tree) return data.tree.map(i => i.entry).filter(Boolean);
  } catch {}
  return null;
}

function processItem(frontmatter, body, filename) {
  const item = { ...frontmatter, filename };

  if (body.trim()) {
    item.content = marked.parse(body);
    item.content_html = item.content;
  }

  for (const field of ['financial_report', 'old_business', 'new_business', 'announcements']) {
    if (typeof item[field] === 'string' && item[field].trim()) {
      item[field] = marked.parse(item[field]);
    }
  }

  if (typeof item.present === 'string' && item.present.trim()) {
    item.present = item.present
      .split('\n\n')
      .map(para => para.trim())
      .filter(Boolean)
      .map(para => `<p>${para.split('\n').join('<br>')}</p>`)
      .join('\n');
  }

  for (const field of ['logo', 'picture', 'image', 'images', 'photo', 'photos']) {
    if (Array.isArray(item[field])) {
      item[field] = item[field].map(f => (f.startsWith('/') || f.startsWith('http')) ? f : `/assets/${f}`);
    }
  }

  return item;
}

async function processCollection(collection) {
  const dir = join(BASE, 'content/collections', collection);
  if (!existsSync(dir)) return [];

  const files = (await readdir(dir)).filter(f => f.endsWith('.md')).sort();
  const items = [];

  for (const file of files) {
    try {
      const raw = await readFile(join(dir, file), 'utf8');
      const { data: frontmatter, content: body } = matter(raw);
      const item = processItem(frontmatter, body, basename(file, '.md'));
      items.push(item);
    } catch (e) {
      console.warn(`  Skipping ${file}: ${e.message}`);
    }
  }

  return items;
}

async function buildCollection(collection) {
  let items = await processCollection(collection);

  const order = await getTreeOrder(collection);
  if (order) {
    items.sort((a, b) => {
      const ai = order.indexOf(a.id ?? '');
      const bi = order.indexOf(b.id ?? '');
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  items = items.filter(i => i.published !== false);
  return items;
}

async function main() {
  console.log('Building static collections...');
  const outBase = join(BASE, 'public/api/collections');
  await mkdir(outBase, { recursive: true });

  const collections = ['sponsors', 'upcoming', 'board_member', 'board_minutes', 'getinvolved'];
  for (const collection of collections) {
    const items = await buildCollection(collection);
    const out = { success: true, collection, count: items.length, items };
    await writeFile(join(outBase, `${collection}.json`), JSON.stringify(out, null, 2));
    console.log(`  ${collection}.json — ${items.length} items`);
  }

  const contentItems = await processCollection('content');
  const mondayDubs = contentItems.find(i => i.filename === 'monday-dubs');
  if (mondayDubs) {
    await mkdir(join(outBase, 'content'), { recursive: true });
    await writeFile(
      join(outBase, 'content/monday-dubs.json'),
      JSON.stringify({ success: true, collection: 'content', item: mondayDubs }, null, 2)
    );
    console.log('  content/monday-dubs.json — 1 item');
  }

  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
