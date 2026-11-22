// One-off (Nov 22 2026): two faction pages carried pre-launch placeholder names. In the released game the
// Ambrosia biker club is Final Chapter and the cartel is La Polilla Negra (2+ guides agree).
// Same pattern as renames-2026-11-22.js: git mv data + hub dir, swap inbound URLs across build/data and hub/,
// swap the display name everywhere except dated news articles (URL only there), add 301s ABOVE the first
// splat rule in hub/_redirects. Page content is rewritten afterwards by the enrichment step.
// Afterwards: node build/build.js gangs-and-factions, copy, prerender-hubs, sitemap.
// Usage (repo root): node build/stats/renames-2026-11-22-gangs.js [--dry]
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DRY = process.argv.includes('--dry'); const ROOT = process.cwd();
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const wr = (p, s) => { if (!DRY) fs.writeFileSync(path.join(ROOT, p), s); };
const split = t => { const c = t.indexOf('\n---'); return [JSON.parse(t.slice(0, c)), t.slice(c)]; };
const CAT = 'gangs-and-factions';

const R = [
  { from: 'outlaw-motorcycle-gang', to: 'final-chapter', titleParts: ['Final', 'Chapter'], names: [[/Outlaw Motorcycle Gang/g, 'Final Chapter']] },
  { from: 'leonida-cartel', to: 'la-polilla-negra', titleParts: ['La Polilla', 'Negra'], names: [[/Leonida Cartel/g, 'La Polilla Negra']] },
];

for (const r of R) {
  const src = `build/data/${CAT}/${r.from}.md`, dst = `build/data/${CAT}/${r.to}.md`;
  if (!fs.existsSync(path.join(ROOT, src))) { if (fs.existsSync(path.join(ROOT, dst))) { console.log('already moved', r.to); continue; } throw new Error('missing ' + src); }
  const raw = rd(src); const crlf = raw.includes('\r\n'); const [j, rest] = split(raw.replace(/\r\n/g, '\n'));
  if (j.slug !== r.from) throw new Error('slug mismatch ' + r.from);
  j.slug = r.to; j.titleParts = r.titleParts;
  let out = JSON.stringify(j, null, 2) + rest;
  for (const [re, to] of r.names) out = out.replace(re, () => to);
  if (!DRY) { cp.execSync(`git mv "${src}" "${dst}"`, { cwd: ROOT }); cp.execSync(`git mv "hub/gameplay/${CAT}/${r.from}" "hub/gameplay/${CAT}/${r.to}"`, { cwd: ROOT }); }
  wr(dst, crlf ? out.replace(/\n/g, '\r\n') : out);
  console.log(`entry ${r.from} -> ${r.to}`);
}

const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['output', '.git'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = [...walk('build/data'), ...walk('hub')].filter(f => /\.(md|html|json|xml|txt)$/.test(f));
let touched = 0;
for (const f of files) {
  const raw = rd(f); let t = raw; const isNews = f.replace(/\\/g, '/').startsWith('hub/news/');
  for (const r of R) {
    t = t.replace(new RegExp(`/gameplay/${CAT}/${r.from}(?![a-z0-9-])`, 'g'), () => `/gameplay/${CAT}/${r.to}`);
    if (!isNews) for (const [re, to] of r.names) t = t.replace(re, () => to);
  }
  if (t !== raw) { touched++; wr(f, t); }
}
console.log('files with swapped links/names:', touched);

let red = rd('hub/_redirects'); const nl = red.includes('\r\n') ? '\r\n' : '\n';
if (!red.includes('# --- Post-launch renames (Nov 22 2026): in-game gang names')) {
  const lines = red.split(/\r?\n/);
  const firstSplat = lines.findIndex(l => /^\S*\*\s/.test(l));
  if (firstSplat < 0) throw new Error('no splat rule found');
  let at = firstSplat; while (at > 0 && lines[at - 1].startsWith('#')) at--;
  const block = ['# --- Post-launch renames (Nov 22 2026): in-game gang names ---', ...R.map(r => (`/gameplay/${CAT}/${r.from}`.padEnd(49) + ' ') + `/gameplay/${CAT}/${r.to}`.padEnd(52) + '301'), ''];
  lines.splice(at, 0, ...block);
  wr('hub/_redirects', lines.join(nl));
  console.log('redirects inserted at line', at + 1);
}
console.log(DRY ? 'dry run, nothing written' : 'done');
