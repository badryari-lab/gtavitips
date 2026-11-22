// Replaces the pre-launch "stock, pricing, and unlock conditions aren't confirmed yet" FAQ line on weapon entries.
// Mapped entries get their real Ammu-Nation stock tier; the rest get a general, true line that claims nothing about the weapon itself.
// Usage: node build/stats/weapons-faq-stock.js [--dry]   then node build/build.js weapons
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry');
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'weapons-ign.json'), 'utf8'));
const MAP = { 'fortune-and-son-moreland-850': 'Fortune & Son Moreland 850', 'hauners-h-at': 'Hauners H-AT', 'wortham-w-10': 'Wortham W-10', 'zhang-wu-type-9': 'Zhang Wu Type 9', 'duke-556': 'Duke 556', 'scorpio-akulus': 'Scorpio Akulus', 'hawk-little-morgan-revolvers': 'Hawk & Little Morgan' , 'klose-k17': 'Klose K17', 'vom-feuer-vf5c': 'Vom Feuer VF5C', 'fortune-and-son-laird-350': 'Fortune & Son Laird 350', 'adb-fra': 'AdB FRA', 'goodwin-lmg-6': 'Goodwin LMG 6', 'kozlov-kz-59': 'Kozlov KZ-59'};
const TIER = { 'Standard': 'Standard stock, so most branches have it', 'Standard or Hunting': 'Standard and Hunting stock, so most branches have it', 'Expanded Only': 'Expanded stock only, so the smaller branches do not carry it', 'Expanded or Hunting': 'Expanded and Hunting stock, so the smaller branches do not carry it', 'Hunting Only': 'Hunting stock only' };
const OLD = ["Ammu-Nation is the confirmed weapon retailer in Leonida, Phil Cassidy's name is on the billboard. Specific stock, pricing, and unlock conditions aren't confirmed yet.",
             "Ammu-Nation is the weapon retailer in Leonida, Phil Cassidy's name is on the billboard. Specific stock, pricing, and unlock conditions aren't confirmed yet."];
const GENERAL = "Ammu-Nation is the weapon retailer in Leonida, Phil Cassidy's name is on the billboard. Every store carries Limited, Standard, Expanded or Hunting stock, and not every store carries every gun.";
const ROCKET_OLD = "Ammu-Nation is the confirmed retailer for most weapons in Leonida. Whether the rocket launcher is on the standard shelf or requires other channels hasn't been confirmed.";
const ROCKET_NEW = "Not at every store. The Hauners H-AT sits in Ammu-Nation's Expanded stock only, so the smaller branches do not carry it.";
const dir = path.join(__dirname, '..', 'data', 'weapons'); const log = [];
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md'))) {
  const slug = f.slice(0, -3), file = path.join(dir, f);
  const raw = fs.readFileSync(file, 'utf8'); let t = raw; let n = 0;
  let line = GENERAL;
  if (MAP[slug]) { const r = rows.find(x => x[0] === MAP[slug]); line = `Ammu-Nation, the chain with Phil Cassidy's name on the billboard, sells the ${r[0]} from its ${TIER[r[12]]}.`; }
  for (const o of OLD) { const c = t.split(o).length - 1; n += c; t = t.split(o).join(line); }
  if (slug === 'hauners-h-at') { const c = t.split(ROCKET_OLD).length - 1; if (c !== 0 && c !== 2) throw new Error('rocket second FAQ count ' + c); n += c; t = t.split(ROCKET_OLD).join(ROCKET_NEW); }
  if (n) { if (n % 2) throw new Error(slug + ': odd replacement count ' + n + ' (faq and faqSchema should both change)'); if (!DRY) fs.writeFileSync(file, t); log.push(`${slug}: ${n}${MAP[slug] ? ' (mapped)' : ''}`); }
}
console.log((DRY ? 'dry\n' : '') + log.join('\n') + '\n' + log.length + ' files');
