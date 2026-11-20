// Updates short FAQ index answers that have no page of their own (Nov 20 2026, post-launch). Matches by question text,
// replaces the answer paragraph and source, drops any old verdict badge, then rebuilds the index FAQPage JSON-LD.
// Usage (repo root): node build/faq/faq-index-inline.js [items.js] [--dry]   (items.js exports [{q, nq?, a, s}]; omit to use the list below)
// Index answers stay spoiler-free (no story beats past the opening). Avoid linking them to a slug that a faq-gen spec builds:
// faq-gen merges every index item that links to its slug into that slug's own item.
const fs = require('fs');
const { clean } = require("./sources.js"); // never credit competitor guide sites
const DRY = process.argv.includes('--dry'); const F = 'hub/faq/index.html';
const L = (h, t) => `<a href="${h}">${t}</a>`;
const ARG = process.argv.slice(2).find(a => !a.startsWith('--'));
const U = ARG ? require(require('path').resolve(ARG)) : [
  { q: 'When is GTA 6 Trailer 3?', nq: 'Was there a GTA 6 Trailer 3?', a: `Not under that name. Rockstar's last trailer before release was the ${L('/news/gta-6-launch-trailer', 'Launch Trailer')} on October 15, 2026, and the game itself came out on November 19.`, s: 'Rockstar Newswire' },
  { q: 'Is there a PS5 Pro enhanced version?', a: `Yes. PS5 Pro upscales toward 4K with PSSR and is the only console with ray-traced shadows. It still runs at 30 fps. See ${L('/faq/gta-6-ps5-vs-xbox', 'PS5 vs Xbox')}.`, s: 'Digital Foundry, via press coverage' },
  { q: 'Does GTA 6 run at 60fps on PS5 and Xbox?', a: `No. Every console targets 30 fps, PS5 Pro included, with no performance mode. See ${L('/faq/gta-6-ps5-vs-xbox', 'PS5 vs Xbox')}.`, s: 'Digital Foundry, via press coverage' },
  { q: 'What are the PC system requirements?', a: `There are none yet, because Rockstar has not announced a PC version. See ${L('/faq/is-gta-6-coming-to-pc', 'GTA 6 on PC')}.`, s: 'Rockstar' },
  { q: 'Is GTA 6 coming to PS4 or Xbox One?', nq: 'Is GTA 6 on PS4 or Xbox One?', a: 'No. GTA 6 is on PS5 and Xbox Series X|S only.', s: 'Rockstar Newswire' },
  { q: 'Which consoles is GTA 6 coming to?', nq: 'Which consoles is GTA 6 on?', a: 'PlayStation 5 and Xbox Series X|S, since November 19, 2026. No PC version has been announced.', s: 'Rockstar Newswire' },
  { q: 'Is GTA Online free or paid?', nq: 'Is GTA 6 Online free or paid?', a: `There is no GTA 6 Online yet. The game launched single-player only, and Rockstar has not announced an online mode or its price. See ${L('/faq/is-gta-online-in-gta-6', 'GTA Online in GTA 6')}.`, s: 'Rockstar' },
  { q: 'How does monetization work in GTA 6 Online?', a: `Nothing to monetize yet: GTA 6 has no online mode. GTA+ continues and now carries GTA VI bonuses for members. See ${L('/faq/is-gta-online-in-gta-6', 'GTA Online in GTA 6')}.`, s: 'Rockstar Newswire' },
  { q: 'Is there an inventory system?', a: 'Yes, and it is tight. The weapon wheel holds two sidearms and one longarm, and a longarm cannot be hidden on you, so the rest stays in your trunk or a Weapons Locker at the larger Ammu-Nation stores. Product rides in duffel bags, two at a time.', s: "IGN's Official GTA 6 Guide" },
  { q: 'Are there safehouses?', a: 'Yes. Your safehouse has parking for cars you have not registered yet, and from Chapter 2 you can buy garages through the Vice City Real Estate app, starting at $5,000. Each garage adds one storage spot.', s: "IGN's Official GTA 6 Guide" },
  { q: 'How does robbery work?', a: `Robbery comes in many sizes: illegal operations, stick-ups, smash and grabs, payday loan jobs, bank jobs and vaults. Whatever you take, narcotics, jewelry or marked bills, only turns into money at a fence. See ${L('/gameplay/activities/robbery', 'robbery')} and ${L('/faq/how-to-make-money-in-gta-6', 'making money')}.`, s: "IGN's Official GTA 6 Guide" },
  { q: 'Is there a character progression system?', a: `Two. Fitness tracks Strength, Cardio and Focus per character and drops if you stop training. The Criminal Profile tracks how each character behaves, from Professional to Irredeemable. See ${L('/faq/does-gta-6-have-a-gym-and-fitness-system', 'fitness')} and ${L('/faq/what-is-the-criminal-profile-in-gta-6', 'the Criminal Profile')}.`, s: "IGN's Official GTA 6 Guide" },
  { q: 'Can I buy GTA 6 digitally and physically?', a: 'Yes. The physical edition is a download code in a box, not a disc, so both versions install the same files.', s: 'Rockstar Newswire' },
  { q: 'What does Confirmed vs Reported vs Speculation mean?', nq: 'How does GTAVITIPS label its sources?', a: 'Game facts carry a plain source line, so you can see where every number comes from. A Reported or Speculation label only appears where something is still genuinely uncertain, like a PC date or an online mode.', s: 'GTAVITIPS' },
];
let t = fs.readFileSync(F, 'utf8'); const nl = t.includes('\r\n'); t = t.replace(/\r\n/g, '\n');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const miss = [];
for (const u of U) {
  const re = new RegExp(`(      <div class="faq-item")[^>]*>([\\s\\S]*?<span class="faq-btn__q">)${esc(u.q)}(</span>[\\s\\S]*?<div class="faq-answer__inner">)[\\s\\S]*?(\\n          </div>\\n        </div>\\n      </div>)`);
  if (!re.test(t)) { miss.push(u.q); continue; }
  t = t.replace(re, (m, open, mid, mid2, close) => `${open} data-badge="green">${mid.replace(/\s*<span class="faq-badge[^"]*">[^<]*<\/span>/, '')}${u.nq || u.q}${mid2}\n            <p>${u.a}</p>\n            <p class="faq-answer__source">Source: ${clean(u.s)}</p>${close}`);
}
if (miss.length) { console.error('not found:', miss); process.exit(1); }
if (/\u2014/.test(JSON.stringify(U))) { console.error('em dash'); process.exit(1); }
for (const m of JSON.stringify(U).matchAll(/href=\\"(\/[^"\\]+)/g)) if (!fs.existsSync('hub' + m[1] + '/index.html')) { console.error('dead link', m[1]); process.exit(1); }
const strip = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const vis = [...t.matchAll(/<span class="faq-btn__q">([\s\S]*?)<\/span>[\s\S]*?<div class="faq-answer__inner">\s*<p>([\s\S]*?)<\/p>/g)].map(m => ({ '@type': 'Question', name: strip(m[1]), acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) } }));
t = t.replace(/(<script type="application\/ld\+json">\s*)(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?)(\s*<\/script>)/, (m, a, b, c) => a + JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: vis }) + c);
if (!DRY) fs.writeFileSync(F, nl ? t.replace(/\n/g, '\r\n') : t);
console.log(DRY ? 'dry ok' : 'written', U.length, 'items; index questions', vis.length);
