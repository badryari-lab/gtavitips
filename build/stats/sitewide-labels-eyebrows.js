// Nov 20 2026, agreed with Badr: post-launch cleanup.
// 1) Remove every section eyebrow (the small label above an H2) and every hero eyebrow ("Character File"), in hub HTML,
//    in the hub JS that renders section headers, and in build/templates so regenerated pages match.
// 2) Drop "Confirmed" as a verdict: green Confirmed badges on FAQ pages go; news badges "Confirmed" become "Rockstar"
//    (a source, not a verdict); "Source, Confirmed" callout labels become "Source". Reported/Speculation/Unverified stay.
// Usage (repo root): node build/stats/sitewide-labels-eyebrows.js [--dry]
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry'); const ROOT = process.cwd();
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const RULES = [
  ['section eyebrow', /[ \t]*<div class="([a-z-]+)__eyebrow"[^>]*>\s*(?:<div class="\1__eyebrow-line"[^>]*><\/div>|<span class="eyebrow-dot"[^>]*><\/span>)?\s*<span class="\1__eyebrow-text">[^<]*<\/span>\s*<\/div>[ \t]*(\r?\n)?/g, ''],
  ['section-eyebrow', /[ \t]*<div class="section-eyebrow"[^>]*>\s*(?:<[a-z]+ class="section-eyebrow__line"[^>]*><\/[a-z]+>)?\s*<span class="section-eyebrow__text">[^<]*<\/span>\s*<\/div>[ \t]*(\r?\n)?/g, ''],
  ['plain eyebrow', /[ \t]*<div class="(?:faq-section|page-header)__eyebrow">[^<]*<\/div>[ \t]*(\r?\n)?/g, ''],
  ['p-hero eyebrow', /[ \t]*<div class="p-hero__eyebrow"[^>]*>\s*<span class="eyebrow-dot"[^>]*><\/span>\s*<span class="sec__eyebrow-text">[^<]*<\/span>\s*<\/div>[ \t]*(\r?\n)?/g, ''],
  ['hero eyebrow', /[ \t]*<div class="[a-z]+-hero__eyebrow">[^<]*<\/div>[ \t]*(\r?\n)?/g, ''],
  ['js eyebrow', /\+'<div class="index-section__eyebrow" aria-hidden="true"><div class="index-section__eyebrow-line"><\/div><span class="index-section__eyebrow-text">'\+sec\.eyebrow\+'<\/span><\/div>'/g, ''],
  ['faq green badge', /[ \t]*<span class="(?:detail-block__badge detail-block__badge--green|answer-card__badge answer-card__badge--green|faq-badge faq-badge--green)">Confirmed<\/span>[ \t]*(\r?\n)?/g, ''],
  ['news badge', /(<span class="(?:article-hero__badge|news-card__badge|timeline__badge) badge--official">)Confirmed(<\/span>)/g, (m, a, b) => a + 'Rockstar' + b],
  ['source label', /Source, Confirmed/g, 'Source'],
];
const files = [...walk(path.join(ROOT, 'hub')).filter(f => f.endsWith('.html')), ...walk(path.join(ROOT, 'build/templates')).filter(f => f.endsWith('.js'))];
const tally = Object.fromEntries(RULES.map(r => [r[0], 0])); let changed = 0; const out = new Map();
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8'); let t = raw;
  for (const [name, re, to] of RULES) t = t.replace(re, (...m) => { tally[name]++; return typeof to === 'function' ? to(...m) : to; });
  out.set(f, t);
  if (t !== raw) { changed++; if (!DRY) fs.writeFileSync(f, t); }
}
const nj = path.join(ROOT, 'hub/assets/data/news.json'); let ns = fs.readFileSync(nj, 'utf8');
const nb = (ns.match(/"badge":\s*"Confirmed"/g) || []).length; ns = ns.replace(/("badge":\s*)"Confirmed"/g, '$1"Rockstar"');
if (!DRY) fs.writeFileSync(nj, ns);
const left = [];
for (const [f, t] of out) { const body = t.replace(/<style>[\s\S]*?<\/style>/g, ''); const m = body.match(/class="[a-z-]*(?:__eyebrow|-eyebrow)[^"]*"/g); if (m) left.push(path.relative(ROOT, f) + ': ' + [...new Set(m)].join(' ')); }
console.log(tally, { filesChanged: changed, newsJsonBadges: nb }, DRY ? 'dry' : 'written');
if (left.length) console.log('LEFTOVER eyebrow markup (' + left.length + '):\n' + left.slice(0, 25).join('\n'));
