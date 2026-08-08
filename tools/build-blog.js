#!/usr/bin/env node
/**
 * build-blog.js — generates everything about the writing section that was
 * previously hand-maintained in four places at once: the index listing, the
 * related-post rail and next/prev links on each post, and the RSS feed.
 *
 * data/posts.json is the single source of truth. Adding a post means adding
 * one entry there and writing the post body; nothing else needs touching.
 *
 * Same contract as tools/build-pages.js — output is committed, the site stays
 * static, deploying is still `git push`.
 *
 *     node tools/build-blog.js          rewrite
 *     node tools/build-blog.js --check  verify (CI)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://chimaukachukwu.com';
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/posts.json'), 'utf8'));
const posts = data.posts;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
});

/** Related posts share the most tags; ties break toward the more recent post. */
function related(post, limit) {
  const mine = new Set(post.tags);
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, overlap: p.tags.filter((t) => mine.has(t)).length }))
    .sort((a, b) => b.overlap - a.overlap || (a.p.date < b.p.date ? 1 : -1))
    .filter((x) => x.overlap > 0)
    .slice(0, limit)
    .map((x) => x.p);
}

/* ---------- region stamping (same marker convention as build-pages.js) ---------- */
function stampRegion(source, name, body, file) {
  const re = new RegExp(`([ \\t]*)<!-- blog:${name} -->[\\s\\S]*?<!-- /blog:${name} -->`, 'g');
  let seen = 0;
  const out = source.replace(re, (_m, pad) => {
    seen++;
    const indented = body.split('\n').map((l) => (l.trim() ? pad + l : l)).join('\n');
    return `${pad}<!-- blog:${name} -->\n${indented}\n${pad}<!-- /blog:${name} -->`;
  });
  if (seen === 0 && source.includes(`<!-- blog:${name} -->`)) {
    throw new Error(`${file}: unterminated <!-- blog:${name} --> marker`);
  }
  return out;
}

/* ---------- index listing ---------- */
function indexListing() {
  return posts.map((p) => `<li class="post-list-item">
    <p class="post-list-meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${esc(p.read)}</p>
    <h2 class="post-list-title"><a href="posts/${p.slug}.html">${esc(p.title)}</a></h2>
    <p class="post-list-dek">${esc(p.dek)}</p>
    <p class="post-list-tags">${p.tags.map(esc).join(' · ')}</p>
</li>`).join('\n');
}

function draftingNote() {
  if (!data.drafting) return '';
  return `<p class="post-drafting"><span>Currently drafting</span> ${esc(data.drafting)}</p>`;
}

/* ---------- per-post rail ---------- */
function postRail(post) {
  const rel = related(post, 2);
  const i = posts.findIndex((p) => p.slug === post.slug);
  const newer = i > 0 ? posts[i - 1] : null;
  const older = i < posts.length - 1 ? posts[i + 1] : null;

  let html = '';
  if (rel.length) {
    html += `<nav class="post-related" aria-label="Related writing">
    <h2>Related</h2>
    <ul>
${rel.map((p) => `        <li>
            <a href="${p.slug}.html">${esc(p.title)}</a>
            <span>${esc(p.dek.length > 120 ? p.dek.slice(0, 117) + '…' : p.dek)}</span>
        </li>`).join('\n')}
    </ul>
</nav>`;
  }
  if (newer || older) {
    html += `${rel.length ? '\n' : ''}<nav class="post-pager" aria-label="More writing">
${older ? `    <a class="post-pager-prev" href="${older.slug}.html"><span>Older</span>${esc(older.title)}</a>` : '    <span></span>'}
${newer ? `    <a class="post-pager-next" href="${newer.slug}.html"><span>Newer</span>${esc(newer.title)}</a>` : '    <span></span>'}
</nav>`;
  }
  return html;
}

/* ---------- RSS ---------- */
function feed() {
  const items = posts.map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${SITE}/blog/posts/${p.slug}.html</link>
    <guid isPermaLink="true">${SITE}/blog/posts/${p.slug}.html</guid>
    <pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate>
    <description>${esc(p.dek)}</description>
${p.tags.map((t) => `    <category>${esc(t)}</category>`).join('\n')}
  </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Chima Ukachukwu: Writing</title>
  <link>${SITE}/blog/</link>
  <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Notes on AI security, SOC operations, and the bridge between them.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date(posts[0].date + 'T12:00:00Z').toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>
`;
}

/* ---------- run ---------- */
function main() {
  const check = process.argv.includes('--check');
  const writes = [];

  // blog index
  const idxPath = path.join(ROOT, 'blog/index.html');
  let idx = fs.readFileSync(idxPath, 'utf8');
  idx = stampRegion(idx, 'listing', indexListing(), 'blog/index.html');
  idx = stampRegion(idx, 'drafting', draftingNote(), 'blog/index.html');
  writes.push([idxPath, idx, 'blog/index.html']);

  // per-post rails
  for (const p of posts) {
    const f = path.join(ROOT, `blog/posts/${p.slug}.html`);
    if (!fs.existsSync(f)) {
      console.error(`  missing  blog/posts/${p.slug}.html`);
      process.exitCode = 1;
      continue;
    }
    const before = fs.readFileSync(f, 'utf8');
    writes.push([f, stampRegion(before, 'rail', postRail(p), p.slug), `blog/posts/${p.slug}.html`]);
  }

  // feed
  writes.push([path.join(ROOT, 'blog/feed.xml'), feed(), 'blog/feed.xml']);

  let changed = 0;
  for (const [file, next, label] of writes) {
    const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (before === next) continue;
    changed++;
    if (check) console.error(`  stale    ${label}`);
    else { fs.writeFileSync(file, next); console.log(`  wrote    ${label}`); }
  }

  if (check && changed) {
    console.error(`\n${changed} file(s) out of date. Run: node tools/build-blog.js`);
    process.exitCode = 1;
    return;
  }
  console.log(check ? `Blog up to date (${posts.length} posts).` : `Done. ${changed} file(s) written.`);
}

main();
