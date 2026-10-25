// Launch-day flip (19 Nov 2026) for the static text of /faq/is-gta-6-out-yet and its index entries.
// The browser JS already flips the live view at local midnight; this is for crawlers and no-JS readers.
// Run from the repo root:  node launch/day0-is-out-yet.js --dry   (prints counts, writes nothing)
//                          node launch/day0-is-out-yet.js         (writes)
// Every replacement must match exactly the expected number of times, or nothing is written.
const fs = require('fs');
const DRY = process.argv.includes('--dry');

const PAGE = 'hub/faq/is-gta-6-out-yet/index.html';
const FAQ_INDEX = 'hub/faq/index.html';
const SEARCH = 'hub/search-index.json';

const pagePairs = [
  // [from, to, expected count]
  ['<strong id="lc-verdict">Not yet.</strong> <span id="lc-line">GTA 6 launches November 19, 2026 on PS5 and Xbox Series X|S.</span>',
   '<strong id="lc-verdict">Yes.</strong> <span id="lc-line">GTA 6 is out. The servers are open.</span>', 1],
  ['<p>The clock counts to midnight where you are, because the game unlocks at local midnight on November 19. Rockstar has not announced a launch hour, so the exact moment is <a href="/faq/what-time-does-gta-6-unlock" style="color:var(--blue)">Reported, not confirmed</a>.</p>',
   '<p>The game unlocked at local midnight on November 19, region by region. See <a href="/faq/what-time-does-gta-6-unlock" style="color:var(--blue)">the unlock times by country</a>.</p>', 1],
  ['<span id="lc-days-text">GTA 6 releases on November 19, 2026.</span> That is a Thursday. The countdown above updates as you read.',
   '<span id="lc-days-text">Zero. GTA 6 released on November 19, 2026.</span> That was a Thursday.', 1],
  ['Is GTA 6 out yet? Not yet. It releases November 19, 2026 on PS5 and Xbox Series X|S. Live countdown, unlock time and platforms.',
   'Is GTA 6 out yet? Yes. GTA 6 released on November 19, 2026 on PS5 and Xbox Series X|S. Unlock times and platforms.', 2],
  ['Not yet. GTA 6 releases November 19, 2026 on PS5 and Xbox Series X|S. The countdown on this page updates live and counts to local midnight, when the game is reported to unlock.',
   'Yes. GTA 6 released on November 19, 2026 on PS5 and Xbox Series X|S. It unlocked at local midnight, region by region.', 1],
  ['GTA 6 releases on November 19, 2026, a Thursday. The countdown on this page updates live.',
   'Zero. GTA 6 released on November 19, 2026, a Thursday.', 1],
];
const indexPairs = [
  ['Not yet. GTA 6 releases November 19, 2026 on PS5 and Xbox Series X|S. The page carries a live countdown to local midnight.',
   'Yes. GTA 6 released on November 19, 2026 on PS5 and Xbox Series X|S. It unlocked at local midnight, region by region.', 2],
];
const searchPairs = [
  ['Is GTA 6 out yet? Not yet. It releases November 19, 2026 on PS5 and Xbox Series X|S. Live countdown, unlock time and platforms.',
   'Is GTA 6 out yet? Yes. GTA 6 released on November 19, 2026 on PS5 and Xbox Series X|S. Unlock times and platforms.', 1],
];

function apply(file, pairs) {
  let t = fs.readFileSync(file, 'utf8');
  for (const [from, to, n] of pairs) {
    const got = t.split(from).length - 1;
    if (got !== n) throw new Error(`${file}: expected ${n} match(es), found ${got} for: ${from.slice(0, 60)}`);
    t = t.split(from).join(to);
  }
  return t;
}

const out = [[PAGE, apply(PAGE, pagePairs)], [FAQ_INDEX, apply(FAQ_INDEX, indexPairs)], [SEARCH, apply(SEARCH, searchPairs)]];
JSON.parse(out[2][1]); // search index must stay valid JSON
for (const [f, t] of out) {
  if (DRY) console.log('dry ok', f, t.length, 'chars');
  else { fs.writeFileSync(f, t); console.log('written', f); }
}
console.log('Remember: sitemap lastmod, em dash check, Badr go before push.');
