// FAQ round 3 (Nov 20 2026): platform and tech FAQs rewritten with post-launch facts.
const DF = 'Digital Foundry analysis, November 18, 2026, as reported by GTABoom, Altchar and Archyde';
const OUT = ['/news/gta-6-out-now', 'Leonida Is Open: GTA VI Is Out'];
const L = (href, txt) => `<a href="${href}" style="color:var(--blue)">${txt}</a>`;
module.exports = [
{
  slug: 'is-gta-6-coming-to-pc', q: 'Is GTA 6 coming to PC?', h1: 'Is GTA 6 Coming to PC?',
  desc: 'Not yet. GTA 6 is on PS5 and Xbox Series X|S only. Rockstar has not announced a PC version, and a GamesBeat report points to early 2027.',
  source: 'Rockstar; GamesBeat, October 13, 2026',
  answer: ['<strong>Not yet.</strong> GTA 6 is PS5 and Xbox Series X|S only, and Rockstar has not announced a PC version.',
    'The strongest signal is a GamesBeat report from October 13, 2026: four anonymous sources say Rockstar plans PC for the first three months of 2027. Rockstar did not comment. GTA V and Red Dead Redemption 2 both took more than a year to reach PC, so early 2027 would be the fastest port Rockstar has ever done.'],
  related: [
    { q: 'When is the GTA 6 PC release date?', html: 'There is none. The GamesBeat report says Q1 2027, and Rockstar has not confirmed it.', source: 'GamesBeat, October 13, 2026', badge: 'Reported' },
    { q: 'Should you wait for PC or play on console?', html: `If you own a PS5 or an Xbox Series X|S, there is nothing to wait for: it is the same game. Every console runs at 30 fps, so higher frame rates are what a PC version would add, whenever it lands. See ${L('/faq/gta-6-ps5-vs-xbox', 'PS5 vs Xbox')}.`, source: DF },
    { q: 'Is GTA 6 on PS4 or Xbox One?', html: 'No. PS5 and Xbox Series X|S only.', source: 'Rockstar' },
  ],
  more: ['gta-6-ps5-vs-xbox', 'does-gta-6-have-ray-tracing', 'is-gta-6-cross-platform'],
  card: { label: 'PC Version', big: 'Not Announced', sub: 'A report points to Q1 2027' },
  intel: [OUT],
  index: { section: 'release-and-platforms', q: 'Is GTA 6 coming to PC?', short: 'Not yet. Rockstar has not announced a PC version. A GamesBeat report from October 2026 points to the first three months of 2027.', source: 'Rockstar; GamesBeat' },
},
{
  slug: 'gta-6-ps5-vs-xbox', q: 'Is GTA 6 better on PS5 or Xbox?', h1: 'GTA 6: PS5 vs Xbox Series X',
  desc: 'GTA 6 runs at 30 fps on every console. PS5 and Series X both render at 1440p, PS5 Pro looks best, and Series S drops to 720p.',
  source: DF,
  answer: ['<strong>Same game, same 30 fps.</strong> Digital Foundry found a 30 fps target on every console, with no performance mode. The base PS5 and the Xbox Series X both render at 1440p and land close together.',
    'The differences sit at the edges. <strong>PS5 Pro</strong> is the best version: it upscales toward 4K with PSSR, adds ray-traced shadows and held close to 30 fps over about 75 hours of testing. <strong>Series X</strong> has a 120 Hz VRR mode that smooths out the dips. <strong>Series S</strong> renders at 720p, upscales to around 1080p and takes the worst drops of the lot.'],
  related: [
    { q: 'Does GTA 6 run at 60 fps?', html: 'No. Every console targets 30 fps, PS5 Pro included. There is no 40 or 60 fps mode.', source: DF },
    { q: 'Is there a PS5 Pro enhancement?', html: `Yes. Sharper image quality through PSSR upscaling, and ray-traced shadows that no other console gets. See ${L('/faq/does-gta-6-have-ray-tracing', 'ray tracing')}.`, source: DF },
    { q: 'Does the base PS5 hold 30 fps?', html: 'Mostly. It can drop into the low 20s in the heaviest action, when explosions and destruction stack up.', source: DF },
    { q: 'Which version should you buy?', html: 'The one for the console you own. On a TV with VRR, Series X smooths the dips. On a PS5 Pro, you get the best-looking version there is.', source: DF },
  ],
  more: ['does-gta-6-have-ray-tracing', 'is-gta-6-coming-to-pc', 'gta-6-download-size'],
  card: { label: 'Frame Rate', big: '30 fps', sub: 'On every console' },
  intel: [OUT],
  index: { section: 'technical', q: 'Is GTA 6 better on PS5 or Xbox?', short: 'Same 30 fps on every console. PS5 and Series X both render at 1440p, PS5 Pro looks best, and Series S drops to 720p.', source: 'Digital Foundry' },
},
{
  slug: 'does-gta-6-have-ray-tracing', q: 'Does GTA 6 have ray tracing?', h1: 'Does GTA 6 Have Ray Tracing?',
  desc: 'Yes. GTA 6 uses ray-traced lighting and reflections on every console, even Xbox Series S. PS5 Pro adds ray-traced shadows. All at 30 fps.',
  source: DF,
  answer: ['<strong>Yes, on every console.</strong> Ray-traced lighting and reflections are part of the base look, and even the Xbox Series S keeps the main ray-traced effects. It gives up resolution instead.',
    'The PS5 Pro goes one step further with ray-traced shadows, which no other console version has. There is no mode that trades ray tracing for frame rate: every version runs one 30 fps mode.'],
  related: [
    { q: 'Is there a performance mode without ray tracing?', html: 'No. Every console runs a single 30 fps mode.', source: DF },
    { q: 'What does PS5 Pro add?', html: 'Ray-traced shadows, plus PSSR upscaling toward 4K from a 1440p base.', source: DF },
    { q: 'Does Series S lose ray tracing?', html: 'No. It keeps the main ray-traced lighting and reflections and renders at 720p, upscaled to around 1080p.', source: DF },
  ],
  more: ['gta-6-ps5-vs-xbox', 'is-gta-6-coming-to-pc', 'gta-6-download-size'],
  card: { label: 'Ray Tracing', big: 'Every Console', sub: 'PS5 Pro adds RT shadows' },
  intel: [OUT],
  index: { section: 'technical', q: 'Does GTA 6 have ray tracing?', short: 'Yes, on every console, Series S included. PS5 Pro adds ray-traced shadows. All versions run at 30 fps.', source: 'Digital Foundry' },
},
];
