// One-off (Nov 20 2026): rename 3 vehicles to their in-game brand and 8 weapons to their in-game model names.
// Moves data file + hub dir (git mv), rewrites the entry, swaps every inbound URL (and vehicle names / weapon card names)
// across build/data and hub/, adds 301s to hub/_redirects. Afterwards: node build/build.js, copy, prerender, sitemap.
// Usage (repo root): node build/stats/renames-2026-11-20.js [--dry]
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DRY = process.argv.includes('--dry'); const ROOT = process.cwd();
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const wr = (p, s) => { if (!DRY) fs.writeFileSync(path.join(ROOT, p), s); };
const split = t => { const c = t.indexOf('\n---'); return [JSON.parse(t.slice(0, c)), t.slice(c)]; };
const sb = (j, k) => { const s = j.statBlock.find(x => x.key === k); if (!s) throw new Error('no stat ' + k); return s; };
const must = (s, a, b, label) => { if (!s.includes(a)) throw new Error('missing in ' + label + ': ' + a.slice(0, 70)); return s.split(a).join(b); };
const deep = (v, a, b, skip) => Array.isArray(v) ? v.map(x => deep(x, a, b, skip)) : v && typeof v === 'object' ? (skip && skip(v) ? v : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x, a, b, skip)]))) : typeof v === 'string' ? v.split(a).join(b) : v;

const VEH = [
  { from: 'vapid-bobcat-xl', to: 'declasse-bobcat-xl', oldName: 'Vapid Bobcat XL', newName: 'Declasse Bobcat XL', apply(j, body) {
      j.titleParts = ['Declasse Bobcat', 'XL'];
      Object.assign(j.seo, { title: 'Declasse Bobcat XL | GTA 6 Vehicle | GTAVITIPS', description: "The '84 Declasse Bobcat XL in GTA 6. Square-body Chevrolet C/K profile. The working pickup of Vice County.", ogDescription: "The '84 Declasse Bobcat XL in GTA 6. Square-body Chevrolet C/K profile. The working pickup of Vice County.", jsonLdHeadline: 'Declasse Bobcat XL - GTA 6 Vehicle', jsonLdDescription: "The Declasse Bobcat XL is an '84 full-size pickup in GTA 6 Leonida, on the Chevrolet C/K square-body profile." });
      j.heroSubtitle = "The square-body pickup of Leonida. **An '84 Declasse that does everything adequately and nothing excitingly, which is exactly why Vice County keeps buying them.**";
      Object.assign(sb(j, 'Brand'), { value: 'Declasse', sub: "GTA's Chevrolet equivalent. The Bobcat XL is the '84 full-size pickup in the Declasse range." });
      Object.assign(sb(j, 'Real-World Counterpart'), { value: 'Chevrolet C/K (Square Body)', sub: 'The third-generation C/K profile, built 1973 to 1987. Full-size pickup in civilian trim.', wikiUrl: 'https://en.wikipedia.org/wiki/Chevrolet_C/K', wikiLabel: 'Chevrolet C/K' });
      const b = j.connections.find(c => c.url === '/gameplay/brands/vapid'); Object.assign(b, { url: '/gameplay/brands/declasse', name: 'Declasse' });
      const tow = j.connections.find(c => c.url === '/gameplay/vehicles/vapid-towtruck'); if (tow) tow.desc = 'The heavy-duty Vapid. Different maker, same working trade.';
      return must(body, 'The Bobcat XL is the F-Series of Leonida. The best-selling vehicle platform in the American market has its GTA equivalent here, and the reasons for its dominance in real life translate directly to Leonida: it does everything a working vehicle needs to do at a price and with a dealer network that makes alternatives harder to justify.',
        "The Bobcat XL is the square-body pickup of Leonida. An '84 Declasse built for work, and the reasons it still runs everywhere translate straight to Vice County: it does everything a working truck needs to do, it costs little, and every scrapyard has the parts.", this.from); } },
  { from: 'vapid-chino', to: 'dundreary-chino', oldName: 'Vapid Chino', newName: 'Dundreary Chino', apply(j, body) {
      j.titleParts = ['Dundreary', 'Chino'];
      Object.assign(j.seo, { title: 'Dundreary Chino | GTA 6 Vehicle | GTAVITIPS', description: "The '65 Dundreary Chino in GTA 6. A long, low sixties classic in lowrider trim, built for the Vice City scene.", ogDescription: "The '65 Dundreary Chino in GTA 6. A long, low sixties classic in lowrider trim, built for the Vice City scene.", jsonLdHeadline: 'Dundreary Chino - GTA 6 Vehicle', jsonLdDescription: "The Dundreary Chino is a '65 classic in GTA 6 Leonida, a lowrider staple of the Vice City street car scene." });
      j.heroSubtitle = must(j.heroSubtitle, 'The Vapid lowrider.', 'The Dundreary lowrider.', this.from);
      Object.assign(sb(j, 'Brand'), { value: 'Dundreary', sub: "GTA's American luxury marque. The Chino is the '65 classic it hands to the lowrider crowd." });
      Object.assign(sb(j, 'Real-World Counterpart'), { value: 'Mid-1960s Full-Size Classic', sub: 'Long-hood American luxury platform from the mid-sixties, in lowrider configuration. The shape lowrider culture adopted.' });
      j.connections = j.connections.filter(c => c.url !== '/gameplay/brands/vapid');
      return must(body, 'The Chino is the Vapid lowrider. Same classic American platform as the Declasse Tornado, different brand context.', "The Chino is the Dundreary lowrider. A '65 classic with a different badge from the Declasse Tornado, working the same street.", this.from); } },
  { from: 'vapid-benson', to: 'interstate-benson', oldName: 'Vapid Benson', newName: 'Interstate Benson', apply(j, body) {
      j.titleParts = ['Interstate', 'Benson'];
      Object.assign(j.seo, { title: 'Interstate Benson | GTA 6 Vehicle | GTAVITIPS', description: "The '97 Interstate Benson in GTA 6. Medium-duty box truck. The commercial workhorse of Leonida.", ogDescription: "The '97 Interstate Benson in GTA 6. Medium-duty box truck. The commercial workhorse of Leonida.", jsonLdHeadline: 'Interstate Benson - GTA 6 Vehicle', jsonLdDescription: "The Interstate Benson is a '97 medium-duty box truck in GTA 6 Leonida." });
      j.heroSubtitle = must(j.heroSubtitle, 'The Ford box truck of Leonida.', 'The box truck of Leonida.', this.from);
      Object.assign(sb(j, 'Brand'), { value: 'Interstate', sub: "Leonida's commercial truck maker. The Benson is its '97 medium-duty box truck." });
      Object.assign(sb(j, 'Real-World Counterpart'), { value: 'Medium-Duty Box Truck (1990s)', sub: 'Cab-and-box medium-duty truck. Roll-up door, cargo body, no pretensions.' });
      j.connections = j.connections.filter(c => c.url !== '/gameplay/brands/vapid');
      const bob = j.connections.find(c => c.url === '/gameplay/vehicles/vapid-bobcat-xl'); if (bob) bob.desc = 'The Declasse pickup. Smaller load, same trade.';
      return must(body, 'The Benson is the box truck in the Vapid commercial range. The Ford Econoline-based medium box truck: rear-wheel drive, boxy cargo body,', "The Benson is the box truck of Leonida. A '97 Interstate: rear-wheel drive, boxy cargo body,", this.from); } },
].map(v => Object.assign(v, { cat: 'vehicles' }));
const WEP = [
  ['pump-action-shotgun', 'fortune-and-son-moreland-850', 'Pump Action Shotgun', 'Fortune & Son Moreland 850', ['Fortune & Son', 'Moreland 850']],
  ['rocket-launcher', 'hauners-h-at', 'Rocket Launcher', 'Hauners H-AT', ['Hauners', 'H-AT']],
  ['micro-smg', 'wortham-w-10', 'Micro SMG', 'Wortham W-10', ['Wortham', 'W-10']],
  ['machine-pistol', 'zhang-wu-type-9', 'Machine Pistol', 'Zhang Wu Type 9', ['Zhang Wu', 'Type 9']],
  ['carbine-rifle', 'duke-556', 'Carbine Rifle', 'Duke 556', ['Duke', '556']],
  ['heavy-revolver', 'scorpio-akulus', 'Heavy Revolver', 'Scorpio Akulus', ['Scorpio', 'Akulus']],
  ['flashbang', 'flash-grenade', 'Flashbang', 'Flash Grenade', ['Flash', 'Grenade']],
  ['knife', 'combat-knife', 'Combat Knife', 'Combat Knife', null],
].map(([from, to, oldName, newName, tp]) => ({ cat: 'weapons', from, to, oldName, newName, apply(j, body) {
  if (oldName === newName) return body;
  const keepType = o => o.key === 'Type';                       // the class stays the class ("Rocket Launcher" type row)
  Object.assign(j, deep(j, oldName, newName, keepType));
  j.titleParts = tp;
  let t = `${newName} (${oldName}) | GTA 6 Weapon | GTAVITIPS`; if (t.length > 70) t = `${newName} (${oldName}) | GTA 6 Weapon`;
  j.seo.title = t;
  return body.split(oldName).join(newName); } }));
const ALL = [...VEH, ...WEP];

for (const r of ALL) {
  const src = `build/data/${r.cat}/${r.from}.md`, dst = `build/data/${r.cat}/${r.to}.md`;
  if (!fs.existsSync(path.join(ROOT, src))) { if (fs.existsSync(path.join(ROOT, dst))) { console.log('already moved', r.to); continue; } throw new Error('missing ' + src); }
  if (!fs.existsSync(path.join(ROOT, `hub/gameplay/${r.cat}/${r.from}/index.html`))) throw new Error('missing hub dir ' + r.from);
  const raw = rd(src); const crlf = raw.includes('\r\n'); let [j, rest] = split(raw.replace(/\r\n/g, '\n'));
  if (j.slug !== r.from) throw new Error('slug mismatch ' + r.from);
  j.slug = r.to; rest = r.apply.call(r, j, rest); j.seo.dateModified = '2026-11-20';
  if (j.seo.title.length > 70) throw new Error('title too long ' + j.seo.title);
  const out = JSON.stringify(j, null, 2) + rest;
  if (!DRY) { cp.execSync(`git mv "${src}" "${dst}"`, { cwd: ROOT }); cp.execSync(`git mv "hub/gameplay/${r.cat}/${r.from}" "hub/gameplay/${r.cat}/${r.to}"`, { cwd: ROOT }); }
  wr(dst, crlf ? out.replace(/\n/g, '\r\n') : out);
  console.log(`entry ${r.cat}/${r.from} -> ${r.to} | ${j.seo.title}`);
}
const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['output', '.git'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = [...walk('build/data'), ...walk('hub')].filter(f => /\.(md|html|json|xml|txt)$/.test(f));
let touched = 0;
for (const f of files) {
  const raw = rd(f); let t = raw;
  for (const r of ALL) {
    t = t.replace(new RegExp(`/gameplay/${r.cat}/${r.from}(?![a-z0-9-])`, 'g'), `/gameplay/${r.cat}/${r.to}`);
    if (r.cat === 'vehicles') t = t.split(r.oldName).join(r.newName);
    else if (r.oldName !== r.newName) t = t.split(`"name": "${r.oldName}"`).join(`"name": "${r.newName}"`).split(`"name":"${r.oldName}"`).join(`"name":"${r.newName}"`)
      .split(`<div class="entry-card__name">${r.oldName}</div>`).join(`<div class="entry-card__name">${r.newName}</div>`).split(`"n":"${r.oldName}"`).join(`"n":"${r.newName}"`);
  }
  if (t !== raw) { touched++; wr(f, t); }
}
console.log('files with swapped links/names:', touched);
let red = rd('hub/_redirects'); const nl = red.includes('\r\n') ? '\r\n' : '\n';
if (!red.includes('# --- Post-launch renames (Nov 20 2026)')) {
  red = red.replace(/\s*$/, '') + nl + nl + '# --- Post-launch renames (Nov 20 2026): in-game brand and model names ---' + nl + ALL.map(r => `/gameplay/${r.cat}/${r.from}`.padEnd(50) + `/gameplay/${r.cat}/${r.to}`.padEnd(52) + '301').join(nl) + nl;
  wr('hub/_redirects', red);
}
console.log(DRY ? 'dry run, nothing written' : 'done');
