#!/usr/bin/env node
/**
 * build-og.js — generates a social preview card per post and per Lab exhibit.
 *
 * Every page used to share one generic image, so a link to the CTF looked
 * identical to a link to the homepage. These are per-page.
 *
 * Method: compose an SVG (exact control, no image library needed) and rasterise
 * it with qlmanage, which is WebKit and ships with macOS. That makes this the
 * one script here that is platform-specific — deliberately, since the output is
 * committed and nothing in CI or the deploy path re-runs it.
 *
 *     node tools/build-og.js          write any missing or changed cards
 *     node tools/build-og.js --force  rewrite all of them
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets/images/og');
const TMP = path.join(require('os').tmpdir(), 'cu-og');

const CARDS = [
  { slug: 'the-defence-that-cant-see-the-attack', kicker: 'Writing', title: "The Defence That Can't See the Attack" },
  { slug: 'taxonomies-that-outlive-the-exploit',  kicker: 'Writing', title: 'Taxonomies That Outlive the Exploit' },
  { slug: 'detecting-prompt-injection',           kicker: 'Writing', title: "Detecting Prompt Injection: The Playbook Your SIEM Doesn't Have Yet" },
  { slug: 'the-bridge',                           kicker: 'Writing', title: 'Why AI Security Needs SOC People, and SOC Needs AI Red Teamers' },
  { slug: 'lab-injection-sim',                    kicker: 'Lab · Interactive', title: 'Prompt Injection Simulator' },
  { slug: 'lab-ctf',                              kicker: 'Lab · Challenge',   title: 'Prompt Injection CTF' },
  { slug: 'lab-pattern-detector',                 kicker: 'Lab · Interactive', title: 'AI Red Team Pattern Detector' },
  { slug: 'lab-red-team-atlas',                   kicker: 'Lab · Reference',   title: 'Red Team Atlas' },
  { slug: 'lab',                                  kicker: 'Lab', title: 'Things you can use, not screenshots of things I made' },
  { slug: 'colophon',                             kicker: 'Colophon', title: 'How this site is built' }
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy wrap using an average-advance estimate — good enough at this size,
    and the font is embedded so metrics are stable across machines. */
function wrap(title, perLine) {
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (test.length > perLine && line) { lines.push(line); line = w; } else { line = test; }
  }
  if (line) lines.push(line);
  return lines;
}

function svg(card) {
  const fontPath = path.join(ROOT, 'assets/fonts/inter-latin.woff2');
  const monoPath = path.join(ROOT, 'assets/fonts/jetbrains-mono-latin.woff2');
  const inter = fs.readFileSync(fontPath).toString('base64');
  const mono = fs.readFileSync(monoPath).toString('base64');

  // Character budget per line is deliberately conservative: Inter at 800 is
  // wide, and a clipped headline is worse than an extra line break.
  const long = card.title.length > 44;
  const size = long ? 46 : 56;
  const perLine = long ? 26 : 22;
  const lines = wrap(card.title, perLine).slice(0, 4);
  const startY = 258 - (lines.length - 1) * (size * 0.58);

  const grid = [];
  for (let i = 40; i < 1200; i += 40) grid.push(`<line x1="${i}" y1="0" x2="${i}" y2="630"/>`);
  for (let j = 40; j < 630; j += 40) grid.push(`<line x1="0" y1="${j}" x2="1200" y2="${j}"/>`);

  // Authored square with the 1200x630 card centred. qlmanage renders into a
  // square canvas regardless, and sips ignores --cropOffset and always crops
  // from the centre — so the geometry is arranged to make that correct rather
  // than fought.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
<defs>
  <style>
    @font-face { font-family:'Inter'; src:url(data:font/woff2;base64,${inter}) format('woff2'); font-weight:400 900; }
    @font-face { font-family:'JBM'; src:url(data:font/woff2;base64,${mono}) format('woff2'); font-weight:400 700; }
    .t { font-family:'Inter',-apple-system,'Helvetica Neue',sans-serif; font-weight:800; fill:#e6edf3; letter-spacing:-1.4px; }
    .k { font-family:'JBM',ui-monospace,Menlo,monospace; font-weight:600; fill:#00d4aa; letter-spacing:2.4px; font-size:22px; }
    .b { font-family:'Inter',-apple-system,'Helvetica Neue',sans-serif; font-weight:400; fill:#8a94a0; font-size:25px; }
    .u { font-family:'JBM',ui-monospace,Menlo,monospace; font-weight:400; fill:#8a94a0; font-size:21px; }
    .m { font-family:'JBM',ui-monospace,Menlo,monospace; font-weight:700; fill:#e6edf3; font-size:42px; }
  </style>
  <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#00d4aa"/><stop offset="100%" stop-color="#00a3ff"/>
  </linearGradient>
</defs>
<rect width="1200" height="1200" fill="#0a0e14"/>
<g transform="translate(0,285)">
<rect width="1200" height="630" fill="#0a0e14"/>
<g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">${grid.join('')}</g>
<rect width="1200" height="6" fill="url(#rule)"/>
<text x="80" y="130" class="k">${esc(card.kicker.toUpperCase())}</text>
<text x="1045" y="128" class="m">CU</text><text x="1097" y="128" class="m" fill="#00d4aa">.</text>
${lines.map((l, i) => `<text x="80" y="${startY + i * (size * 1.18)}" class="t" font-size="${size}">${esc(l)}</text>`).join('\n')}
<text x="80" y="548" class="b">Chima Ukachukwu · AI Security Analyst &amp; Red Teamer</text>
<text x="80" y="588" class="u">chimaukachukwu.com</text>
</g>
</svg>`;
}

function main() {
  if (process.platform !== 'darwin') {
    console.error('build-og.js needs qlmanage (macOS). Committed cards are unaffected.');
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(TMP, { recursive: true });

  let written = 0;
  for (const card of CARDS) {
    const svgPath = path.join(TMP, card.slug + '.svg');
    const pngOut = path.join(OUT, card.slug + '.png');
    fs.writeFileSync(svgPath, svg(card));

    execFileSync('qlmanage', ['-t', '-s', '1200', '-o', TMP, svgPath], { stdio: 'ignore' });
    const produced = path.join(TMP, card.slug + '.svg.png');
    if (!fs.existsSync(produced)) {
      console.error(`  failed  ${card.slug}`);
      continue;
    }
    // Square in, centre-crop out — see the note on the SVG canvas above.
    execFileSync('sips', ['-c', '630', '1200', produced, '--out', pngOut], { stdio: 'ignore' });
    fs.unlinkSync(produced);
    written++;
    console.log(`  wrote   assets/images/og/${card.slug}.png  ${(fs.statSync(pngOut).size / 1024).toFixed(0)} KB`);
  }
  console.log(`Done — ${written} of ${CARDS.length} cards.`);
}

main();
