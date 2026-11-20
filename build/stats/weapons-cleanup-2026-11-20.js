// One-off (Nov 20 2026, Badr: "het moeten gta 6 wapens zijn"): every weapon entry must be a real GTA 6 weapon.
// A) rename the 6 class-named entries to their in-game model; B) delete the 7 entries that are not GTA 6 weapons.
// Both get 301s. Inbound URLs are swapped (renames) or unlinked / their connection cards dropped (deletions).
// Usage (repo root): node build/stats/weapons-cleanup-2026-11-20.js [--dry]   then build, copy, prerender.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DRY = process.argv.includes('--dry'); const ROOT = process.cwd();
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8'), wr = (p, s) => { if (!DRY) fs.writeFileSync(path.join(ROOT, p), s); };
const deep = (v, a, b, skip) => Array.isArray(v) ? v.map(x => deep(x, a, b, skip)) : v && typeof v === 'object' ? (skip(v) ? v : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x, a, b, skip)]))) : typeof v === 'string' ? v.split(a).join(b) : v;
const REN = [
  ['pistol', 'klose-k17', 'Standard Pistol', 'Klose K17', ['Klose', 'K17'], 'Pistol'],
  ['compact-smg', 'vom-feuer-vf5c', 'Compact SMG', 'Vom Feuer VF5C', ['Vom Feuer', 'VF5C'], 'Compact SMG'],
  ['sniper-rifle', 'fortune-and-son-laird-350', 'Sniper Rifle', 'Fortune & Son Laird 350', ['Fortune & Son', 'Laird 350'], 'Sniper Rifle'],
  ['heavy-rifle', 'adb-fra', 'Heavy Rifle', 'AdB FRA', ['AdB', 'FRA'], 'Battle Rifle'],
  ['light-machine-gun', 'goodwin-lmg-6', 'Light Machine Gun', 'Goodwin LMG 6', ['Goodwin', 'LMG 6'], 'Light Machine Gun'],
  ['standard-assault-rifle', 'kozlov-kz-59', 'Standard Assault Rifle', 'Kozlov KZ-59', ['Kozlov', 'KZ-59'], 'Assault Rifle'],
];
const DEL = { 'crowbar': '/gameplay/weapons/baseball-bat', 'pool-cue': '/gameplay/weapons/baseball-bat', 'golf-club': '/gameplay/activities/golf', 'throwing-knife': '/gameplay/weapons/combat-knife', 'petrol-can': '/gameplay/weapons/molotov', 'smoke-grenade': '/gameplay/weapons/flash-grenade', 'spear-gun': '/gameplay/weapons' };
for (const t of Object.values(DEL)) if (!fs.existsSync(path.join(ROOT, 'hub' + t, 'index.html'))) throw new Error('redirect target missing ' + t);
const delRe = Object.keys(DEL).join('|'), isDel = u => new RegExp(`^/gameplay/weapons/(${delRe})$`).test(u);
for (const [from, to, oldName, newName, tp, cls] of REN) {
  const src = `build/data/weapons/${from}.md`, dst = `build/data/weapons/${to}.md`;
  if (!fs.existsSync(path.join(ROOT, src))) { console.log('skip (moved?)', from); continue; }
  const raw = rd(src).replace(/\r\n/g, '\n'); const c = raw.indexOf('\n---'); let j = JSON.parse(raw.slice(0, c)); let body = raw.slice(c);
  if (j.slug !== from) throw new Error('slug ' + from);
  j = deep(j, oldName, newName, o => o.key === 'Type'); j.slug = to; j.titleParts = tp;
  let title = `${newName} (${cls}) | GTA 6 Weapon | GTAVITIPS`; if (title.length > 70) title = `${newName} (${cls}) | GTA 6 Weapon`; j.seo.title = title;
  j.seo.dateModified = '2026-11-20'; body = body.split(oldName).join(newName);
  if (!DRY) { cp.execSync(`git mv "${src}" "${dst}"`, { cwd: ROOT }); cp.execSync(`git mv "hub/gameplay/weapons/${from}" "hub/gameplay/weapons/${to}"`, { cwd: ROOT }); }
  wr(dst, JSON.stringify(j, null, 2) + body); console.log('rename', from, '->', to, '|', title);
}
for (const s of Object.keys(DEL)) {
  if (!fs.existsSync(path.join(ROOT, `build/data/weapons/${s}.md`))) { console.log('skip (deleted?)', s); continue; }
  if (!DRY) cp.execSync(`git rm -rqf "build/data/weapons/${s}.md" "hub/gameplay/weapons/${s}"`, { cwd: ROOT });
  console.log('delete', s, '->', DEL[s]);
}
const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['output', '.git'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = [...walk('build/data'), ...walk('hub')].filter(f => /\.(md|html|json|xml|txt)$/.test(f));
const stats = { renamedUrls: 0, cardsDropped: 0, unlinked: 0, sitemap: 0, search: 0, hubJson: 0, hubCards: 0 };
for (const f of files) {
  const raw = rd(f); let t = raw;
  for (const [from, to, oldName, newName] of REN) {
    t = t.replace(new RegExp(`/gameplay/weapons/${from}(?![a-z0-9-])`, 'g'), () => { stats.renamedUrls++; return `/gameplay/weapons/${to}`; });
    t = t.split(`"name": "${oldName}"`).join(`"name": "${newName}"`).split(`"name":"${oldName}"`).join(`"name":"${newName}"`).split(`<div class="entry-card__name">${oldName}</div>`).join(`<div class="entry-card__name">${newName}</div>`).split(`"n":"${oldName}"`).join(`"n":"${newName}"`);
  }
  const isWeaponDataOfDeleted = new RegExp(`weapons[\\\\/](${delRe})\\.md$`).test(f) || new RegExp(`weapons[\\\\/](${delRe})[\\\\/]`).test(f);
  if (isWeaponDataOfDeleted) continue;
  if (f.endsWith('.md')) {
    const n = t.replace(/\r\n/g, '\n'); const c = n.indexOf('\n---');
    if (c > 0 && new RegExp(`/gameplay/weapons/(${delRe})"`).test(n.slice(0, c))) {
      const j = JSON.parse(n.slice(0, c));
      for (const k of Object.keys(j)) if (Array.isArray(j[k])) { const b = j[k].length; j[k] = j[k].filter(x => !(x && typeof x === 'object' && typeof x.url === 'string' && isDel(x.url))); stats.cardsDropped += b - j[k].length; }
      t = JSON.stringify(j, null, 2) + n.slice(c);
    }
    t = t.replace(new RegExp(`\\[([^\\]]+)\\]\\(/gameplay/weapons/(${delRe})\\)`, 'g'), (m, txt) => { stats.unlinked++; return txt; });
  }
  if (f.endsWith('sitemap.xml')) t = t.replace(new RegExp(`\\s*<url>\\s*<loc>https://gtavitips\\.com/gameplay/weapons/(${delRe})</loc>[\\s\\S]*?</url>`, 'g'), () => { stats.sitemap++; return ''; });
  if (f.endsWith('search-index.json')) { const a = JSON.parse(t); const b = a.filter(x => !isDel(x.u)); stats.search += a.length - b.length; if (b.length !== a.length) t = JSON.stringify(b); }
  if (f.endsWith('weapons.json')) { const j = JSON.parse(t); let d = 0; for (const s of j.sections || []) { const n = s.items.length; s.items = s.items.filter(i => !isDel(i.url)); d += n - s.items.length; } stats.hubJson += d; if (d) { j.sections = j.sections.filter(s => s.items.length); t = JSON.stringify(j, null, 2); } }
  if (f.endsWith('.html')) {
    t = t.replace(new RegExp(`[ \\t]*<a href="/gameplay/weapons/(${delRe})" class="entry-card[^"]*"[^>]*>[\\s\\S]*?</a>[ \\t]*(\\r?\\n)?`, 'g'), () => { stats.hubCards++; return ''; });
    t = t.replace(new RegExp(`<a [^>]*href="/gameplay/weapons/(${delRe})"[^>]*>([\\s\\S]*?)</a>`, 'g'), (m, s, txt) => { stats.unlinked++; return txt.replace(/<[^>]+>/g, ''); });
  }
  if (t !== raw) wr(f, t);
}
let red = rd('hub/_redirects'); const nl = red.includes('\r\n') ? '\r\n' : '\n';
if (!red.includes('# --- Weapons cleanup (Nov 20 2026)')) {
  red = red.replace(/\s*$/, '') + nl + nl + '# --- Weapons cleanup (Nov 20 2026): only real GTA 6 weapons ---' + nl
    + REN.map(r => `/gameplay/weapons/${r[0]}`.padEnd(50) + `/gameplay/weapons/${r[1]}`.padEnd(52) + '301').join(nl) + nl
    + Object.entries(DEL).map(([s, t]) => `/gameplay/weapons/${s}`.padEnd(50) + t.padEnd(52) + '301').join(nl) + nl;
  wr('hub/_redirects', red);
}
console.log(stats, DRY ? 'dry' : 'done');
