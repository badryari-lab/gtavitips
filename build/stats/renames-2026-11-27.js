// One-off (Nov 27 2026): rename 3 vehicles to the names on their in-game vehicle name card
// (line 1 = brand, line 2 = model; Badr in-game): Granforma Zorrusso, Maibatsu '97 Penumbra FF, Seashark Hydroblast.
// Same pattern as renames-2026-11-22.js: git mv data + hub dir, rewrite entry, swap inbound URLs/names across
// build/data and hub/ (hub/map is the map repo's copy and is left alone), add 301s ABOVE the first splat rule in
// hub/_redirects and repoint the older pegassi-zurrusso rule (no chains). Also: Pegassi brand sidebar loses the
// Zorrusso, mission #52 card points at the car, Granforma goes into brands.json and search-index.json.
// The new brand page itself is build/data/brands/granforma.md (written by hand).
// Afterwards: build vehicles, brands, missions; prerender-hubs; copy; sitemap.
// Usage (repo root): node build/stats/renames-2026-11-27.js [--dry]
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DRY = process.argv.includes('--dry'); const ROOT = process.cwd();
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const wr = (p, s) => { if (!DRY) fs.writeFileSync(path.join(ROOT, p), s); };
const split = t => { const c = t.indexOf('\n---'); return [JSON.parse(t.slice(0, c)), t.slice(c)]; };
const sb = (j, k) => { const s = j.statBlock.find(x => x.key === k); if (!s) throw new Error('no stat ' + k); return s; };
const setDesc = (j, d, ld) => Object.assign(j.seo, { description: d, ogDescription: d, jsonLdDescription: ld || d });
const DATE = '2026-11-27';

const R = [
  { from: 'pegassi-zorrusso', to: 'granforma-zorrusso', names: [[/Pegassi Zorrusso/g, 'Granforma Zorrusso']], apply(j, body) {
      j.titleParts = ['Granforma', 'Zorrusso'];
      Object.assign(j.seo, { title: 'Granforma Zorrusso Location | GTA 6 Vehicle | GTAVITIPS', jsonLdHeadline: 'Granforma Zorrusso - GTA 6 Vehicle', ogImagePlaceholder: 'granforma-zorrusso-gta-6-vehicle.jpg' });
      setDesc(j, "Granforma Zorrusso in GTA 6: the supercar behind Randy's first job, where it is parked in Ocean Beach and how to beat its tracker.");
      j.heroSubtitle = j.heroSubtitle.replace('Italian supercar, low and wide.', () => 'Supercar, low and wide.');
      Object.assign(sb(j, 'Brand'), { value: 'Granforma', sub: 'The badge on the name card when you get in.' });
      const zt = j.connections.find(c => c.url === '/gameplay/vehicles/pegassi-zentorno'); if (zt) zt.desc = 'Another wedge-nosed supercar, under a Pegassi badge.';
      const br = j.connections.find(c => c.url === '/gameplay/brands/pegassi'); if (!br) throw new Error('no pegassi card');
      Object.assign(br, { url: '/gameplay/brands/granforma', name: 'Granforma', desc: 'The maker on the name card.' });
      const out = body.replace('The Zorrusso is a Pegassi supercar', () => 'The Zorrusso is a Granforma supercar');
      if (out === body) throw new Error('zorrusso body not fixed');
      return out; } },
  { from: 'maibatsu-penumbra', to: 'maibatsu-97-penumbra-ff', names: [[/Maibatsu Penumbra(?! FF)/g, "Maibatsu '97 Penumbra FF"]], apply(j, body) {
      j.titleParts = ['Maibatsu', "'97 Penumbra FF"];
      Object.assign(j.seo, { title: "Maibatsu '97 Penumbra FF | GTA 6 Vehicle | GTAVITIPS", jsonLdHeadline: "Maibatsu '97 Penumbra FF - GTA 6 Vehicle", ogImagePlaceholder: 'maibatsu-97-penumbra-ff-gta-6-vehicle.jpg' });
      setDesc(j, "Maibatsu '97 Penumbra FF in GTA 6, also listed as the Maibatsu Penumbra. Mitsubishi Eclipse profile. The Japanese sports coupe in Vice City.");
      sb(j, 'Brand').sub = "GTA's Mitsubishi equivalent. The '97 Penumbra FF is the sports coupe in the Maibatsu range.";
      return body.replace(/\n*$/, () => "\n\n[Lucia](/gameplay/characters/lucia-caminos) keeps one of her own. Get in and the name card reads Lucia's '97 Penumbra FF.\n"); } },
  { from: 'speedophile-seashark', to: 'seashark-hydroblast', names: [[/Speedophile Seashark/g, 'Seashark Hydroblast']], apply(j, body) {
      j.titleParts = ['Seashark', 'Hydroblast'];
      Object.assign(j.seo, { title: 'Seashark Hydroblast | GTA 6 Vehicle | GTAVITIPS', jsonLdHeadline: 'Seashark Hydroblast - GTA 6 Vehicle' });
      setDesc(j, 'Seashark Hydroblast in GTA 6, also listed as the Seashark. Personal watercraft / jet ski. The Vice City beach and Keys water toy.',
        'The Seashark Hydroblast is a personal watercraft in GTA 6 Leonida. Jet ski for Vice City beach and Keys.');
      Object.assign(sb(j, 'Brand'), { value: 'Seashark', sub: 'The name card shows Seashark as the maker, with a shark logo in the brand slot.' });
      return body; } },
];

for (const r of R) {
  const src = `build/data/vehicles/${r.from}.md`, dst = `build/data/vehicles/${r.to}.md`;
  if (!fs.existsSync(path.join(ROOT, src))) { if (fs.existsSync(path.join(ROOT, dst))) { console.log('already moved', r.to); continue; } throw new Error('missing ' + src); }
  const raw = rd(src); const crlf = raw.includes('\r\n'); let t = raw.replace(/\r\n/g, '\n');
  for (const [re, to] of r.names) t = t.replace(re, () => to);   // names first, so the "also listed as" meta keeps the old name
  let [j, rest] = split(t);
  if (j.slug !== r.from) throw new Error('slug mismatch ' + r.from);
  j.slug = r.to; rest = r.apply.call(r, j, rest); j.seo.dateModified = DATE;
  if (j.seo.title.length > 70) throw new Error('title too long ' + j.seo.title);
  if (j.seo.description.length > 160) throw new Error('description too long ' + j.seo.description);
  const out = JSON.stringify(j, null, 2) + rest;
  if (r.to === 'seashark-hydroblast' && /Speedophile/.test(out)) throw new Error('Speedophile left on seashark');
  if (!DRY) { cp.execSync(`git mv "${src}" "${dst}"`, { cwd: ROOT }); cp.execSync(`git mv "hub/gameplay/vehicles/${r.from}" "hub/gameplay/vehicles/${r.to}"`, { cwd: ROOT }); }
  wr(dst, crlf ? out.replace(/\n/g, '\r\n') : out);
  console.log(`entry ${r.from} -> ${r.to} | ${j.seo.title} | ${j.seo.description.length}`);
}

// Inbound cards that called the Zorrusso a Pegassi.
const CARD_FIX = {
  'dinka-double-t': 'A Granforma supercar. Two more wheels, same hurry.',
  'nagasaki-carbon-rs': "A Granforma supercar, not a bike. Randy's first job.",
  'pegassi-zentorno': 'The supercar Randy wants first, under a Granforma badge.',
};
const NEW_SLUGS = R.map(r => `build/data/vehicles/${r.to}.md`);
const SKIP = ['output', '.git', 'hub/map'];
const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => { const p = path.join(d, e.name); return e.isDirectory() ? (SKIP.includes(e.name) || SKIP.includes(p.replace(/\\/g, '/')) ? [] : walk(p)) : [p]; });
const files = [...walk('build/data'), ...walk('hub'), 'build/faq/specs-2026-11-22.js', 'build/stats/vehicles-entry-stats.js', 'build/stats/vehicles-fleet.js']
  .filter(f => /\.(md|html|json|xml|txt|js)$/.test(f)).filter(f => !NEW_SLUGS.includes(f.replace(/\\/g, '/')));
const fixJson = (t, raw, fn) => { const [j, rest] = split(t.replace(/\r\n/g, '\n')); fn(j); let o = JSON.stringify(j, null, 2) + rest; if (raw.includes('\r\n')) o = o.replace(/\n/g, '\r\n'); return o; };
let touched = 0;
for (const f of files) {
  const fp = f.replace(/\\/g, '/');
  if (fp.startsWith('hub/') && fp.endsWith('.js')) continue;
  const raw = rd(f); let t = raw;
  for (const r of R) {
    t = t.replace(new RegExp(`/gameplay/vehicles/${r.from}(?![a-z0-9-])`, 'g'), () => `/gameplay/vehicles/${r.to}`);
    if (fp.startsWith('build/stats/')) t = t.split(`'${r.from}'`).join(`'${r.to}'`);
    else for (const [re, to] of r.names) t = t.replace(re, () => to);
  }
  const slug = path.basename(f, '.md');
  if (fp.startsWith('build/data/vehicles/') && CARD_FIX[slug]) t = fixJson(t, raw, j => {
    const c = j.connections.find(x => x.url === '/gameplay/vehicles/granforma-zorrusso'); if (!c) throw new Error('no card in ' + slug); c.desc = CARD_FIX[slug]; });
  if (fp === 'build/data/brands/pegassi.md') t = fixJson(t, raw, j => {
    const blk = j.sidebar.find(b => b.title === 'Pegassi Vehicles'); const n = blk.items.length;
    blk.items = blk.items.filter(i => i.url !== '/gameplay/vehicles/granforma-zorrusso'); if (blk.items.length !== n - 1) throw new Error('pegassi sidebar'); j.seo.dateModified = DATE; });
  if (fp === 'build/data/missions/clonin-keys-makin-gs.md') t = fixJson(t, raw, j => {
    const c = j.connections.find(x => x.url === '/gameplay/brands/pegassi'); if (!c) throw new Error('no pegassi card on mission');
    Object.assign(c, { url: '/gameplay/vehicles/granforma-zorrusso', name: 'Granforma Zorrusso', desc: 'The car Randy has a buyer for.', avatarInitials: 'GZ' }); });
  if (fp === 'build/data/missions/boobie-time.md') t = fixJson(t, raw, j => {
    const c = j.connections.find(x => x.url === '/gameplay/vehicles/seashark-hydroblast'); if (c) c.avatarInitials = 'SH'; });
  if (fp === 'hub/assets/data/vehicles.json') t = t.replace(/("url": "\/gameplay\/vehicles\/seashark-hydroblast",[^}]*?"name": )"Seashark"/, (m, a) => a + '"Seashark Hydroblast"');
  if (fp === 'hub/assets/data/brands.json' && !t.includes('/gameplay/brands/granforma')) {
    const anchor = /(\r?\n)(\s*)\{(\s*)"url": "\/gameplay\/brands\/grotti"/;
    if (!anchor.test(t)) throw new Error('brands.json anchor');
    t = t.replace(anchor, (m, nl, ind, sp) => `${nl}${ind}{${sp}"url": "/gameplay/brands/granforma",${sp}"label": "Manufacturer",${sp}"color": "#ff8042",${sp}"name": "Granforma",${sp}"desc": "The badge on the Zorrusso supercar."${nl}${ind}},` + m);
  }
  if (fp === 'hub/search-index.json') { const idx = JSON.parse(t); for (const r of R) if (!idx.some(x => x.u === `/gameplay/vehicles/${r.to}`)) throw new Error('no search entry ' + r.to); }
  if (t !== raw) { touched++; wr(f, t); if (DRY) console.log('  would touch', fp); }
}
console.log('files with swapped links/names:', touched);

// Search index: new names/descriptions for the 3 cars and the new Granforma brand.
if (!DRY) {
  const idx = JSON.parse(rd('hub/search-index.json'));
  for (const r of R) {
    const [j] = split(rd(`build/data/vehicles/${r.to}.md`).replace(/\r\n/g, '\n'));
    const e = idx.find(x => x.u === `/gameplay/vehicles/${r.to}`);
    e.n = j.seo.title.split(' | ')[0]; e.d = j.seo.description;
  }
  if (!idx.some(x => x.u === '/gameplay/brands/granforma')) {
    const [g] = split(rd('build/data/brands/granforma.md').replace(/\r\n/g, '\n'));
    const at = idx.findIndex(x => x.u === '/gameplay/brands/grotti');
    idx.splice(at < 0 ? idx.length : at, 0, { n: 'Granforma', u: '/gameplay/brands/granforma', d: g.seo.description, c: 'brand' });
  }
  wr('hub/search-index.json', JSON.stringify(idx));
}

let red = rd('hub/_redirects'); const nl = red.includes('\r\n') ? '\r\n' : '\n';
// Repoint the Nov 22 rule so it does not chain through the new 301.
red = red.replace(/^\/gameplay\/vehicles\/pegassi-zurrusso[ \t]+\/gameplay\/vehicles\/pegassi-zorrusso[ \t]+301(?=[ \t]*\r?$)/m,
  () => '/gameplay/vehicles/pegassi-zurrusso'.padEnd(50) + '/gameplay/vehicles/granforma-zorrusso'.padEnd(52) + '301');
if (/ \/gameplay\/vehicles\/pegassi-zorrusso\s/.test(red)) throw new Error('a rule still points at pegassi-zorrusso');
if (!red.includes('# --- Post-launch renames (Nov 27 2026)')) {
  const lines = red.split(/\r?\n/);
  const firstSplat = lines.findIndex(l => /^\S*\*\s/.test(l));
  if (firstSplat < 0) throw new Error('no splat rule found');
  let at = firstSplat; while (at > 0 && lines[at - 1].startsWith('#')) at--;
  const block = ['# --- Post-launch renames (Nov 27 2026): in-game vehicle names ---', ...R.map(r => `/gameplay/vehicles/${r.from}`.padEnd(50) + `/gameplay/vehicles/${r.to}`.padEnd(52) + '301'), ''];
  lines.splice(at, 0, ...block);
  red = lines.join(nl);
  console.log('redirects inserted at line', at + 1);
}
wr('hub/_redirects', red);
console.log(DRY ? 'dry run, nothing written' : 'done');
