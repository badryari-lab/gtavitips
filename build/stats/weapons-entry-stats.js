// Adds an "In-Game Model" row (IGN Official Guide menu stats, Reported) to the weapon entries that map to one standard-issue gun.
// Usage: node build/stats/weapons-entry-stats.js [--dry]   (then: node build/build.js weapons, copy the touched pages into hub/)
// Re-runnable: replaces an existing "In-Game Model" row instead of adding a second one.
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry');
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'weapons-ign.json'), 'utf8'));
const MAP = { 'fortune-and-son-moreland-850': 'Fortune & Son Moreland 850', 'hauners-h-at': 'Hauners H-AT', 'wortham-w-10': 'Wortham W-10', 'zhang-wu-type-9': 'Zhang Wu Type 9', 'duke-556': 'Duke 556', 'scorpio-akulus': 'Scorpio Akulus', 'hawk-little-morgan-revolvers': 'Hawk & Little Morgan' , 'klose-k17': 'Klose K17', 'vom-feuer-vf5c': 'Vom Feuer VF5C', 'fortune-and-son-laird-350': 'Fortune & Son Laird 350', 'adb-fra': 'AdB FRA', 'goodwin-lmg-6': 'Goodwin LMG 6', 'kozlov-kz-59': 'Kozlov KZ-59'};
const STORE = { 'Standard': 'Standard stock', 'Standard or Hunting': 'Standard and Hunting stock', 'Expanded Only': 'Expanded stock only', 'Expanded or Hunting': 'Expanded and Hunting stock', 'Hunting Only': 'Hunting stock only' };
const f1 = v => parseFloat(String(v).replace(',', '.')).toFixed(1);
const touched = [];
for (const [slug, gun] of Object.entries(MAP)) {
  const r = rows.find(x => x[0] === gun); if (!r) throw new Error('not in IGN data: ' + gun);
  const file = path.join(__dirname, '..', 'data', 'weapons', slug + '.md');
  const raw = fs.readFileSync(file, 'utf8'); const crlf = raw.includes('\r\n'); const t = raw.replace(/\r\n/g, '\n');
  const cut = t.indexOf('\n---'); const j = JSON.parse(t.slice(0, cut));
  const sub = `Damage ${f1(r[4])}, Accuracy ${f1(r[5])}, Handling ${f1(r[6])}, Range ${f1(r[7])} out of 10. ${r[8]}-round mag, ${r[9].toLowerCase()}, ${r[11]}. Ammu-Nation: ${STORE[r[12]] || 'not sold'}. Menu stats from the in-game weapon menu.`;
  const row = { key: 'In-Game Model', value: `${r[0]}`, sub };
  const i = j.statBlock.findIndex(s => s.key === 'In-Game Model');
  if (i >= 0) j.statBlock[i] = row; else j.statBlock.splice(1, 0, row);
  j.seo.dateModified = '2026-11-20';
  const out = JSON.stringify(j, null, 2) + t.slice(cut);
  if (!DRY) fs.writeFileSync(file, crlf ? out.replace(/\n/g, '\r\n') : out);
  touched.push(slug + ' -> ' + r[0]);
}
console.log((DRY ? 'dry ' : '') + touched.join('\n'));
