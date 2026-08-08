#!/usr/bin/env node
/**
 * build-pages.js — stamps shared markup into every HTML page.
 *
 * Why this exists: the nav, footer links, social icons and head boilerplate
 * were hand-copied into 11 files. Changing one meant 11 edits with nothing to
 * catch a miss — and in Sprint 4 that is exactly what happened: ten pages kept
 * a stale nav pointing at an anchor that no longer existed.
 *
 * How it works: each page marks a region with a pair of comments.
 *
 *     <!-- build:nav -->   ...generated...   <!-- /build:nav -->
 *
 * The generated output is written back into the file and committed, so the
 * repo stays a plain static site. There is no runtime dependency, no bundler
 * and no install step — deploying is still `git push`.
 *
 *     node tools/build-pages.js          rewrite pages
 *     node tools/build-pages.js --check  verify pages are up to date (CI)
 *
 * Adding a page: add an entry to PAGES and drop the markers into the markup.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PARTIALS = path.join(ROOT, 'partials');

/**
 * root   relative prefix from this page to the site root
 * home   how this page links to the homepage (its own anchors are bare)
 * active which nav item is the current page, if any
 */
const PAGES = {
  'index.html':                                        { root: '',       home: '',                 active: '' },
  '404.html':                                          { root: '/',      home: '/',                active: '' },
  'demo/index.html':                                   { root: '../',    home: '../index.html',    active: '' }, // redirect stub
  'lab/index.html':                                    { root: '../',    home: '../index.html',    active: 'lab' },
  'lab/ctf/index.html':                                { root: '../../', home: '../../index.html', active: 'lab' },
  'lab/injection-sim/index.html':                      { root: '../../', home: '../../index.html', active: 'lab' },
  'lab/pattern-detector/index.html':                   { root: '../../', home: '../../index.html', active: 'lab' },
  'lab/red-team-atlas/index.html':                     { root: '../../', home: '../../index.html', active: 'lab' },
  'blog/index.html':                                   { root: '../',    home: '../index.html',    active: 'writing' },
  'colophon/index.html':                                { root: '../',    home: '../index.html',    active: '' },
  'now/index.html':                                    { root: '../',    home: '../index.html',    active: '' },
  'resume/index.html':                                 { root: '../',    home: '../index.html',    active: '' },
  'blog/posts/the-defence-that-cant-see-the-attack.html': { root: '../../', home: '../../index.html', active: 'writing' },
  'blog/posts/taxonomies-that-outlive-the-exploit.html': { root: '../../', home: '../../index.html', active: 'writing' },
  'blog/posts/the-bridge.html':                        { root: '../../', home: '../../index.html', active: 'writing' },
  'blog/posts/detecting-prompt-injection.html':        { root: '../../', home: '../../index.html', active: 'writing' },
  'portfolio/case-studies/adverse-insight.html':       { root: '../../', home: '../../index.html', active: 'work' },
  'portfolio/case-studies/hobby-lobby-misp.html':      { root: '../../', home: '../../index.html', active: 'work' },
  'portfolio/case-studies/ai-red-teaming-frameworks.html': { root: '../../', home: '../../index.html', active: 'work' },
};


/* ---------- measured facts ----------
   The colophon states numbers about this repository. Numbers in prose rot:
   the page shipped claiming 82KB of JavaScript and was wrong within one
   commit, because the commit that added the claim also added two modules.
   So they are measured here at build time instead of typed. */
function kb(paths) {
  const total = paths.reduce((sum, rel) => {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return sum;
    return sum + fs.statSync(abs).size;
  }, 0);
  return Math.round(total / 1024) + ' KB';
}

function listFiles(dir, ext) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter((f) => f.endsWith(ext)).map((f) => path.join(dir, f));
}

function measured() {
  const js = ['js/main.js']
    .concat(listFiles('js/lib', '.js'))
    .concat(['lab/injection-sim/sim-ui.js', 'lab/ctf/ctf-ui.js']);

  const workflow = fs.existsSync(path.join(ROOT, '.github/workflows/verify.yml'))
    ? fs.readFileSync(path.join(ROOT, '.github/workflows/verify.yml'), 'utf8')
    : '';
  const ciJobs = (workflow.match(/^  [a-z-]+:$/gm) || []).length;

  const hasPkg = fs.existsSync(path.join(ROOT, 'package.json'));

  return {
    deps: hasPkg ? 'see package.json' : '0',
    build: 'None',
    css: kb(['css/style.css']),
    js: kb(js),
    fonts: kb(listFiles('assets/fonts', '.woff2')) + ', self-hosted',
    ci: String(ciJobs),
    pages: String(Object.keys(PAGES).length)
  };
}

function colophonStats() {
  const m = measured();
  const rows = [
    ['Runtime dependencies', m.deps],
    ['Build step to deploy', m.build],
    ['Pages', m.pages],
    ['CSS', m.css],
    ['JavaScript', m.js],
    ['Fonts', m.fonts],
    ['CI checks', m.ci]
  ];
  return '<div class="colophon-stats">\n' +
    rows.map(([k, v]) => `    <div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n') +
    '\n</div>';
}

const PARTIAL_NAMES = ['head-assets', 'head-analytics', 'nav', 'footer-links', 'footer-social'];

const partials = Object.fromEntries(
  PARTIAL_NAMES.map((name) => [name, fs.readFileSync(path.join(PARTIALS, `${name}.html`), 'utf8').trimEnd()])
);

/** Substitute {{root}}, {{home}} and the {{active:key}} class flags. */
function render(template, page) {
  return template
    .replace(/\{\{active:(\w+)\}\}/g, (_, key) => (page.active === key ? ' active' : ''))
    .replace(/\{\{root\}\}/g, page.root)
    .replace(/\{\{home\}\}/g, page.home);
}

/** Re-indent a partial to sit at the same depth as its opening marker. */
function indent(block, pad) {
  return block
    .split('\n')
    .map((line) => (line.trim() ? pad + line : line))
    .join('\n');
}

function stamp(source, page, file) {
  let out = source;

  // Generated, measured content — currently only the colophon's stat grid.
  if (out.includes('<!-- build:colophon-stats -->')) {
    out = out.replace(
      /([ \t]*)<!-- build:colophon-stats -->[\s\S]*?<!-- \/build:colophon-stats -->/,
      (_m, pad) => `${pad}<!-- build:colophon-stats -->\n` +
                   indent(colophonStats(), pad) +
                   `\n${pad}<!-- /build:colophon-stats -->`
    );
  }

  for (const name of PARTIAL_NAMES) {
    const re = new RegExp(
      `([ \\t]*)<!-- build:${name} -->[\\s\\S]*?<!-- /build:${name} -->`,
      'g'
    );

    let seen = 0;
    out = out.replace(re, (_match, pad) => {
      seen++;
      const body = indent(render(partials[name], page), pad);
      return `${pad}<!-- build:${name} -->\n${body}\n${pad}<!-- /build:${name} -->`;
    });

    // A page that never opted into a partial is fine; a half-open marker is not.
    if (seen === 0 && source.includes(`<!-- build:${name} -->`)) {
      throw new Error(`${file}: unterminated <!-- build:${name} --> marker`);
    }
  }

  return out;
}

function main() {
  const check = process.argv.includes('--check');
  let changed = 0;

  for (const [file, page] of Object.entries(PAGES)) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) {
      console.error(`  missing  ${file}`);
      process.exitCode = 1;
      continue;
    }

    const before = fs.readFileSync(abs, 'utf8');
    const after = stamp(before, page, file);

    if (before === after) continue;

    changed++;
    if (check) {
      console.error(`  stale    ${file}`);
    } else {
      fs.writeFileSync(abs, after);
      console.log(`  stamped  ${file}`);
    }
  }

  if (check && changed > 0) {
    console.error(`\n${changed} page(s) out of date. Run: node tools/build-pages.js`);
    process.exitCode = 1;
    return;
  }

  console.log(
    check
      ? `All ${Object.keys(PAGES).length} pages up to date.`
      : `Done. ${changed} of ${Object.keys(PAGES).length} pages rewritten.`
  );
}

main();
