// Adds a "WAiNK Stats" row (IGN Official Guide, Reported) to vehicle entries that map cleanly to one IGN row with the same brand.
// Entries whose brand disagrees with the game (Bobcat XL, Chino, Benson) are left out on purpose: Badr decides the rename first.
// Usage: node build/stats/vehicles-entry-stats.js [--dry]   then node build/build.js vehicles
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry');
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'vehicles-ign.json'), 'utf8'));
const MAP = { 'albany-buccaneer': '65 Buccaneer', 'annis-hellion': '95 Hellion', 'pfister-astron': 'Astron', 'imponte-ruiner': '82 Ruiner', 'declasse-tulip': '72 Tulip', 'karin-futo': '85 Futo', 'karin-rebel': '84 Rebel', 'maibatsu-penumbra': '97 Penumbra FF', 'grotti-cheetah': '95 Cheetah', 'dinka-blista-compact': '85 Blista', 'jobuilt-phantom': '81 Phantom Custom' };
const f1 = v => parseFloat(v).toFixed(1);
const money = v => '$' + Number(String(v).replace(/,/g, '')).toLocaleString('en-US');
const log = [];
for (const [slug, name] of Object.entries(MAP)) {
  const r = rows.find(x => x[0] === name); if (!r) throw new Error('not in IGN data: ' + name);
  const file = path.join(__dirname, '..', 'data', 'vehicles', slug + '.md');
  const raw = fs.readFileSync(file, 'utf8'); const crlf = raw.includes('\r\n'); const t = raw.replace(/\r\n/g, '\n');
  const cut = t.indexOf('\n---'); const j = JSON.parse(t.slice(0, cut));
  const brand = (j.statBlock.find(s => s.key === 'Brand') || {}).value || '';
  if (!brand.includes(r[1])) throw new Error(`${slug}: brand "${brand}" vs IGN "${r[1]}"`);
  const label = /^\d\d /.test(r[0]) ? '’' + r[0] : r[0];
  const parts = [`Speed ${f1(r[5])}, Acceleration ${f1(r[6])}, Asphalt ${f1(r[7])}, Off-Road ${f1(r[8])}, Strength ${f1(r[9])} out of 10.`];
  if (r[3]) parts.push(`Fence value ${money(r[3])}${r[4] ? `, registration ${money(r[4])}` : ''}.`);
  if (r[2]) parts.push(`Tracker: ${r[2]}.`);
  parts.push("Figures from an in-game WAiNK scan.");
  const row = { key: 'WAiNK Stats', value: `${r[1]} ${label} · ${r[12]}`, sub: parts.join(' ') };
  const i = j.statBlock.findIndex(s => s.key === 'WAiNK Stats');
  if (i >= 0) j.statBlock[i] = row; else j.statBlock.push(row);
  j.seo.dateModified = '2026-11-20';
  const out = JSON.stringify(j, null, 2) + t.slice(cut);
  if (!DRY) fs.writeFileSync(file, crlf ? out.replace(/\n/g, '\r\n') : out);
  log.push(`${slug} -> ${row.value}`);
}
console.log((DRY ? 'dry\n' : '') + log.join('\n'));
