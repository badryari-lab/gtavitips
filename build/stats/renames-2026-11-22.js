// One-off (Nov 22 2026): rename 4 vehicles to their in-game names (2+ guides agree) and rewrite the Zorrusso,
// which was a superbike page while the in-game Zorrusso is a supercar (our own Randy mission page + guides).
// Same pattern as renames-2026-11-20.js: git mv data + hub dir, rewrite entry, swap inbound URLs/names across
// build/data and hub/, add 301s ABOVE the first splat rule in hub/_redirects.
// Afterwards: node build/build.js vehicles && node build/build.js brands, copy, prerender-hubs, sitemap.
// Usage (repo root): node build/stats/renames-2026-11-22.js [--dry]
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DRY = process.argv.includes('--dry'); const ROOT = process.cwd();
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const wr = (p, s) => { if (!DRY) fs.writeFileSync(path.join(ROOT, p), s); };
const split = t => { const c = t.indexOf('\n---'); return [JSON.parse(t.slice(0, c)), t.slice(c)]; };
const sb = (j, k) => { const s = j.statBlock.find(x => x.key === k); if (!s) throw new Error('no stat ' + k); return s; };
const DATE = '2026-11-22';

const R = [
  { from: 'grotti-furia', to: 'piccia-furia', names: [[/Grotti Furia/g, 'Piccia Furia']], apply(j, body) {
      j.titleParts = ['Piccia', 'Furia'];
      j.seo.title = 'Piccia Furia Location | GTA 6 Vehicle | GTAVITIPS';
      Object.assign(sb(j, 'Brand'), { value: 'Piccia', sub: 'The hypercar maker behind the Furia.' });
      j.connections = j.connections.filter(c => c.url !== '/gameplay/brands/grotti');
      return body.split('Grotti removes').join('Piccia removes'); } },
  { from: 'enus-jubilee', to: 'buckingham-jubilee', names: [[/Enus Jubilee/g, 'Buckingham Jubilee']], apply(j, body) {
      j.titleParts = ['Buckingham', 'Jubilee'];
      j.seo.title = 'Buckingham Jubilee Location | GTA 6 Vehicle | GTAVITIPS';
      Object.assign(sb(j, 'Brand'), { value: 'Buckingham', sub: 'Buckingham builds the Jubilee, its ultra-luxury SUV.' });
      Object.assign(sb(j, 'Real-World Counterpart'), { value: 'Rolls-Royce Cullinan', sub: 'The Rolls-Royce that went off-road, or at least looks like it could.', wikiUrl: 'https://en.wikipedia.org/wiki/Rolls-Royce_Cullinan', wikiLabel: 'Rolls-Royce Cullinan' });
      Object.assign(sb(j, 'Handling'), { value: 'Ultra-Luxury SUV', sub: 'Big, heavy and quiet. Built to arrive, not to race.' });
      j.connections = j.connections.filter(c => c.url !== '/gameplay/brands/enus');
      return body; } },
  { from: 'gallivanter-baller-st', to: 'gallivanter-baller-st-d', names: [[/Baller ST(?![\w-])/g, 'Baller ST-D']], apply(j, body) {
      j.titleParts = ['Gallivanter', 'Baller ST-D'];
      j.seo.title = 'Gallivanter Baller ST-D Location | GTA 6 Vehicle | GTAVITIPS';
      return body; } },
  { from: 'pegassi-zurrusso', to: 'pegassi-zorrusso', names: [[/Zurrusso/g, 'Zorrusso']], apply(j) {
      const desc = "Pegassi Zorrusso in GTA 6: the supercar behind Randy's first job, where it is parked in Ocean Beach and how to beat its tracker.";
      j.titleParts = ['Pegassi', 'Zorrusso'];
      Object.assign(j.seo, { title: 'Pegassi Zorrusso Location | GTA 6 Vehicle | GTAVITIPS', description: desc, ogDescription: desc, jsonLdHeadline: 'Pegassi Zorrusso - GTA 6 Vehicle', jsonLdDescription: desc, ogImagePlaceholder: 'pegassi-zorrusso-gta-6-vehicle.jpg' });
      j.heroSubtitle = "Italian supercar, low and wide. **The first car Randy Kozlov sends you to steal, and the one that teaches you how his business works.**";
      j.statBlock = [
        { key: 'Brand', value: 'Pegassi', sub: "GTA's Lamborghini. The Zorrusso is one of its supercars." },
        { key: 'Real-World Counterpart', value: 'Italdesign Zerouno', sub: 'A limited-run Italian supercar: sharp nose, wedge body, mid-mounted V10.', wikiUrl: 'https://en.wikipedia.org/wiki/Italdesign_Zerouno', wikiLabel: 'Italdesign Zerouno' },
        { key: 'Handling', value: 'Mid-Engine Supercar', sub: 'Engine behind the seats. Quick to turn in, quick to punish.' },
        { key: 'How to Get', value: "Randy's first job", sub: 'Chapter 3. Parked in the Hathaway Apartments garage in Ocean Beach, deliver to Randy at Leonida Auto World.' },
      ];
      j.connections = [
        { url: '/gameplay/vehicles/pegassi-zentorno', type: 'Hypercar', name: 'Pegassi Zentorno', desc: 'The other Pegassi with a wedge for a nose.' },
        { url: '/gameplay/vehicles/bravado-banshee', type: 'Sports Car', name: 'Bravado Banshee', desc: "A later name on Randy's board. American, louder." },
        { url: '/gameplay/locations/ocean-beach', type: 'Location', name: 'Ocean Beach', desc: 'Where the Zorrusso waits in an apartment garage.' },
        { url: '/gameplay/brands/pegassi', type: 'Brand', name: 'Pegassi', desc: 'The manufacturer.' },
      ];
      return '\n---\n' + [
        "The Zorrusso is a Pegassi supercar on the Italdesign Zerouno formula: a wedge nose, a long tail and the engine right behind your head. **It looks fast parked, which is the point.**",
        "It is also the car that opens Randy Kozlov's business. In Chapter 3 Randy has a buyer for a Zorrusso and a new toy to get it with: the Key Cloner, a phone app that copies a car's key.",
        "The car sits in the garage of the Hathaway Apartments in [Ocean Beach](/gameplay/locations/ocean-beach). Clone the key, then drive it to Leonida Auto World before its tracker fills up. Randy grades the paint when it rolls in, so keep it clean.",
        "After that delivery the rest of **Randy's Wish List** opens up: a board of rare cars he wants next, from the [Bravado Banshee](/gameplay/vehicles/bravado-banshee) to the [Bravado Gauntlet Hellfire](/gameplay/vehicles/bravado-gauntlet-hellfire).",
      ].join('\n\n') + '\n'; } },
];

// Inbound cards that described the old superbike.
const CARD_FIX = { type: 'Supercar', desc: { 'dinka-double-t': 'The Pegassi supercar. Two more wheels, same hurry.', 'nagasaki-carbon-rs': "A Pegassi supercar, not a bike. Randy's first job.", 'pegassi-zentorno': 'The other Pegassi supercar, the one Randy wants first.' } };

for (const r of R) {
  const src = `build/data/vehicles/${r.from}.md`, dst = `build/data/vehicles/${r.to}.md`;
  if (!fs.existsSync(path.join(ROOT, src))) { if (fs.existsSync(path.join(ROOT, dst))) { console.log('already moved', r.to); continue; } throw new Error('missing ' + src); }
  const raw = rd(src); const crlf = raw.includes('\r\n'); let [j, rest] = split(raw.replace(/\r\n/g, '\n'));
  if (j.slug !== r.from) throw new Error('slug mismatch ' + r.from);
  j.slug = r.to; rest = r.apply.call(r, j, rest); j.seo.dateModified = DATE;
  if (j.seo.title.length > 70) throw new Error('title too long ' + j.seo.title);
  let out = JSON.stringify(j, null, 2) + rest;
  for (const [re, to] of r.names) out = out.replace(re, () => to);
  if (!DRY) { cp.execSync(`git mv "${src}" "${dst}"`, { cwd: ROOT }); cp.execSync(`git mv "hub/gameplay/vehicles/${r.from}" "hub/gameplay/vehicles/${r.to}"`, { cwd: ROOT }); }
  wr(dst, crlf ? out.replace(/\n/g, '\r\n') : out);
  console.log(`entry ${r.from} -> ${r.to} | ${j.seo.title}`);
}

const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['output', '.git'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = [...walk('build/data'), ...walk('hub')].filter(f => /\.(md|html|json|xml|txt)$/.test(f));
let touched = 0;
for (const f of files) {
  const raw = rd(f); let t = raw;
  for (const r of R) {
    t = t.replace(new RegExp(`/gameplay/vehicles/${r.from}(?![a-z0-9-])`, 'g'), () => `/gameplay/vehicles/${r.to}`);
    for (const [re, to] of r.names) t = t.replace(re, () => to);
  }
  if (f.replace(/\\/g, '/').startsWith('build/data/vehicles/')) {
    const slug = path.basename(f, '.md');
    if (CARD_FIX.desc[slug]) {
      const [j, rest] = split(t.replace(/\r\n/g, '\n'));
      const c = j.connections.find(x => x.url === '/gameplay/vehicles/pegassi-zorrusso');
      if (c) { c.type = CARD_FIX.type; c.desc = CARD_FIX.desc[slug]; t = JSON.stringify(j, null, 2) + rest; if (raw.includes('\r\n')) t = t.replace(/\n/g, '\r\n'); }
    }
  }
  if (f.replace(/\\/g, '/') === 'hub/assets/data/vehicles.json') t = t.replace(/"Pegassi's second super entry in Leonida\."/, () => '"The supercar behind Randy\'s first job."');
  if (t !== raw) { touched++; wr(f, t); }
}
console.log('files with swapped links/names:', touched);

let red = rd('hub/_redirects'); const nl = red.includes('\r\n') ? '\r\n' : '\n';
if (!red.includes('# --- Post-launch renames (Nov 22 2026)')) {
  const lines = red.split(/\r?\n/);
  const firstSplat = lines.findIndex(l => /^\S*\*\s/.test(l));
  if (firstSplat < 0) throw new Error('no splat rule found');
  let at = firstSplat; while (at > 0 && lines[at - 1].startsWith('#')) at--;   // keep a splat block's own comment header with it
  const block = ['# --- Post-launch renames (Nov 22 2026): in-game vehicle names ---', ...R.map(r => `/gameplay/vehicles/${r.from}`.padEnd(50) + `/gameplay/vehicles/${r.to}`.padEnd(52) + '301'), ''];
  lines.splice(at, 0, ...block);
  wr('hub/_redirects', lines.join(nl));
  console.log('redirects inserted at line', at + 1);
}
console.log(DRY ? 'dry run, nothing written' : 'done');
