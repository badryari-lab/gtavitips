// One-off (Nov 20 2026): Pfister Astron is a 2020s SUV and Declasse Tulip a '72 muscle car in GTA 6 (IGN Official Guide).
// Rewrites both entries (counterpart, copy, connections) and fixes the cards and one news line that described them wrongly.
// Usage (repo root): node build/stats/astron-tulip-2026-11-20.js [--dry]   then node build/build.js vehicles + copy.
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry'); const ROOT = process.cwd();
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/\r\n/g, '\n'), wr = (p, s) => { if (!DRY) fs.writeFileSync(path.join(ROOT, p), s); };
const sb = (j, k) => { const s = j.statBlock.find(x => x.key === k); if (!s) throw new Error('no ' + k); return s; };
const entry = (slug, fn) => { const f = `build/data/vehicles/${slug}.md`, t = rd(f), c = t.indexOf('\n---'); const j = JSON.parse(t.slice(0, c)); const body = fn(j); j.seo.dateModified = '2026-11-20'; wr(f, JSON.stringify(j, null, 2) + '\n---\n' + body.trim() + '\n'); console.log('rewrote', slug); };

entry('pfister-astron', j => {
  const d = "The Pfister Astron in GTA 6. A 2020s luxury SUV on the Porsche Cayenne Coupé profile, quick off the line.";
  Object.assign(j.seo, { description: d, ogDescription: d, jsonLdDescription: 'The Pfister Astron is a 2020s luxury SUV in GTA 6 Leonida, on the Porsche Cayenne Coupé profile.' });
  j.heroSubtitle = "Pfister's SUV. **Sports-car manners on a tall body, quick off the line, and parked outside every [Vice City](/gameplay/locations/vice-city) restaurant worth the valet.**";
  Object.assign(sb(j, 'Brand'), { sub: "GTA's Porsche equivalent. The Astron is its 2020s SUV: sports-car manners on a tall body." });
  Object.assign(sb(j, 'Real-World Counterpart'), { value: 'Porsche Cayenne Coupé', sub: 'The coupé-roof Cayenne profile: sloped rear, wide haunches, SUV ride height.', wikiUrl: 'https://en.wikipedia.org/wiki/Porsche_Cayenne', wikiLabel: 'Porsche Cayenne' });
  Object.assign(sb(j, 'Handling'), { value: 'Tarmac First', sub: 'Quick for its size and sure on asphalt. Off-road it is a tall car and nothing more.' });
  j.connections = [
    { url: '/gameplay/vehicles/pfister-comet-s2', type: 'Sports Car', name: 'Pfister Comet S2', desc: 'The Pfister that lives low. Same badge, opposite job.' },
    { url: '/gameplay/vehicles/gallivanter-baller', type: 'SUV', name: 'Gallivanter Baller', desc: 'The other luxury SUV in the same driveway.' },
    { url: '/gameplay/locations/vice-city', type: 'Location', name: 'Vice City', desc: 'Valet lanes and hotel forecourts. Where the Astron gets parked.' },
    { url: '/gameplay/brands/pfister', type: 'Brand', name: 'Pfister', desc: 'The manufacturer.' },
  ];
  return `The Astron is what Pfister builds when the buyer wants a sports car and a back seat. A 2020s SUV on the Porsche Cayenne Coupé profile: sloped roofline, wide stance, the badge doing half the work.

It moves like the badge promises. **Acceleration reads 6.5 on WAiNK, high for something this tall, and it holds a line on asphalt better than most SUVs in [Vice City](/gameplay/locations/vice-city).** Off-road it runs out of answers fast.

A fence pays $4,620 for one. Putting it in your own name costs $15,500, and the tracker is the standard kind, so it comes off without much argument.`;
});
entry('declasse-tulip', j => {
  const d = "The '72 Declasse Tulip in GTA 6. Chevrolet Chevelle profile. A restored seventies muscle car with a long hood.";
  Object.assign(j.seo, { description: d, ogDescription: d, jsonLdDescription: "The Declasse Tulip is a '72 muscle car in GTA 6 Leonida, on the Chevrolet Chevelle profile." });
  j.heroSubtitle = "The '72 Declasse muscle car. **Long hood, short deck, and the restored seventies metal that [Vice City](/gameplay/locations/vice-city) still takes out on a Sunday.**";
  Object.assign(sb(j, 'Brand'), { sub: "GTA's Chevrolet equivalent. The Tulip is the '72 muscle car in the Declasse range." });
  Object.assign(sb(j, 'Real-World Counterpart'), { value: 'Chevrolet Chevelle (1970 to 1972)', sub: 'The third-generation Chevelle profile: long hood, short deck, muscle-era stance.', wikiUrl: 'https://en.wikipedia.org/wiki/Chevrolet_Chevelle', wikiLabel: 'Chevrolet Chevelle' });
  Object.assign(sb(j, 'Handling'), { value: 'RWD Muscle', sub: 'Rear-wheel drive and a heavy front end. It gets going; corners get respect.' });
  const find = u => j.connections.find(c => c.url === u);
  const torn = find('/gameplay/vehicles/declasse-tornado'), brand = find('/gameplay/brands/declasse'), vc = find('/gameplay/locations/vice-city');
  if (!torn || !brand || !vc) throw new Error('tulip cards changed');
  torn.desc = 'The Declasse lowrider. Same family, slower on purpose.';
  vc.desc = 'Sunday cruises and the car meets that keep seventies metal moving.';
  j.connections = [torn, { url: '/gameplay/vehicles/imponte-ruiner', type: 'Muscle', name: 'Imponte Ruiner', desc: "The '82 muscle car. A decade newer, same appetite." }, brand, vc];
  return `The Tulip is the '72 Declasse muscle car, on the Chevrolet Chevelle profile. Long hood, short deck, and restored to the condition [Vice City](/gameplay/locations/vice-city)'s car crowd likes to be seen in.

It is a straight-line car. **WAiNK puts acceleration at 4.8 and asphalt handling at 3.4: it gets going, and corners get respect.** Rear-wheel drive and a heavy front end decide the rest.

Cheap to own and cheap to lose. A fence pays $2,805, registration runs $9,400, and the tracker is standard. The [Declasse Tornado](/gameplay/vehicles/declasse-tornado) covers the lowrider side of the family. The Tulip is the one that gets driven hard.`;
});
const CARDS = {
  'grotti-furia': ['pfister-astron', 'SUV', "Pfister's SUV. A different kind of fast."],
  'obey-omnis-e-gt': ['pfister-astron', 'SUV', 'The Pfister SUV. Tall where this one is low.'],
  'pegassi-zentorno': ['pfister-astron', 'SUV', "Pfister's luxury SUV. Same money, more roof."],
  'bravado-buffalo-s': ['declasse-tulip', 'Muscle', "The '72 Declasse muscle car. Where the family tree starts."],
  'bravado-buffalo': ['declasse-tulip', 'Muscle', 'The seventies Declasse muscle car. Old metal, same idea.'],
  'declasse-tornado': ['declasse-tulip', 'Muscle', 'The Declasse muscle car. Same badge, driven harder.'],
  'dinka-blista-compact': ['declasse-tulip', 'Muscle', "The '72 American muscle car. The opposite of a Blista."],
};
for (const [slug, [target, type, desc]] of Object.entries(CARDS)) {
  const f = `build/data/vehicles/${slug}.md`, t = rd(f), c = t.indexOf('\n---'); const j = JSON.parse(t.slice(0, c));
  const card = j.connections.find(x => x.url === `/gameplay/vehicles/${target}`); if (!card) throw new Error(slug + ' has no card to ' + target);
  Object.assign(card, { type, desc }); j.seo.dateModified = '2026-11-20'; wr(f, JSON.stringify(j, null, 2) + t.slice(c)); console.log('card', slug, '->', target);
}
const nf = 'hub/news/vice-city-1986-vs-2026/index.html'; const raw = fs.readFileSync(path.join(ROOT, nf), 'utf8');
const a = ' is a Porsche Taycan analog.'; if (!raw.includes(a)) throw new Error('news line missing');
wr(nf, raw.split(a).join(' is a 2020s luxury SUV.')); console.log('news line fixed', DRY ? '(dry)' : '');
