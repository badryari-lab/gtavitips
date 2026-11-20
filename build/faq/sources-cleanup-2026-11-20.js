// One-off (Nov 20 2026): apply the source-line policy (build/faq/sources.js) to everything written after launch.
// 1) FAQ/news source elements in hub HTML  2) stat-row and stock lines in build/data + hub entry pages
// 3) generator scripts in build/stats so reruns stay clean. Reports remaining body-text mentions as file + outlet
// name only (no surrounding text: story FAQs may hold spoilers, and the owner must not see plot in the terminal).
// Usage (repo root): node build/faq/sources-cleanup-2026-11-20.js [--dry]
const fs = require('fs'), path = require('path');
const { clean, BANNED } = require('./sources.js');
const DRY = process.argv.includes('--dry'), ROOT = process.cwd();
const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['output', '.git'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const PHRASES = [
  ["Menu stats: IGN's Official GTA 6 Guide.", 'Menu stats from the in-game weapon menu.'],
  ["WAiNK figures: IGN's Official GTA 6 Guide.", 'Figures from an in-game WAiNK scan.'],
  [" Source: IGN's Official GTA 6 Guide.", ''],
];
const st = { sourceLines: 0, phrases: 0, files: 0 };
const files = [...walk('hub'), ...walk('build/data'), ...walk('build/stats')].filter(f => /\.(html|md|js)$/.test(f));
for (const f of files) {
  const raw = fs.readFileSync(path.join(ROOT, f), 'utf8'); let t = raw;
  const norm = f.replace(/\\/g, '/');
  if (f.endsWith('.html')) t = t.replace(/(class="(?:answer-card__source|detail-block__source|faq-answer__source)">Source: )([^<]*)/g, (m, a, s) => { const c = clean(s); if (c !== s) st.sourceLines++; return a + c; });
  for (const [a, b] of PHRASES) { const n = t.split(a).length - 1; if (n) { st.phrases += n; t = t.split(a).join(b); } }
  const stat = (a, b) => { const n = t.split(a).length - 1; if (n) { st.phrases += n; t = t.split(a).join(b); } };
  if (norm.includes('gameplay/vehicles/index.html') || norm.endsWith('build/stats/vehicles-fleet.js')) stat("Stats: IGN's Official GTA 6 Guide.", 'Stats: in-game WAiNK scans.');
  else stat("Stats: IGN's Official GTA 6 Guide.", 'Stats: the in-game weapon menu.');
  if (t !== raw) { st.files++; if (!DRY) fs.writeFileSync(path.join(ROOT, f), t); }
}
console.log(st, DRY ? 'dry' : 'written');
const recent = ['hub/faq', 'hub/news/gta-6-out-now', 'hub/gameplay/weapons', 'hub/gameplay/vehicles'];
const left = {};
for (const d of recent) for (const f of walk(d).filter(f => f.endsWith('.html'))) {
  let t = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (DRY) t = t.replace(/(class="(?:answer-card__source|detail-block__source|faq-answer__source)">Source: )([^<]*)/g, (m, a, s) => a + clean(s));
  t = t.replace(/<style>[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const m of t.matchAll(new RegExp(BANNED.source, 'gi'))) { const k = path.relative(ROOT, f); (left[k] = left[k] || new Set()).add(m[0]); }
}
const keys = Object.keys(left);
console.log('files with remaining body-text mentions:', keys.length);
keys.forEach(k => console.log('  ' + k + ': ' + [...left[k]].join(', ')));
