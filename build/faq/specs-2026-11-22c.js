// FAQ round Nov 22 2026 (c): competitor gap plan step 4, easter eggs + patch notes and known issues.
// Work notes: research_notes/gap-plan-4-easter-eggs.json and gap-plan-4-patches.json.
// Easter eggs: only the ones 2+ independent guides agree on (location and trigger); single-source details left out
// (UFO hour, whether the Eclipse can be kept, the dog's treasure). Guides are never named.
// Patches: Rockstar Support is the primary source and is credited and linked (all five articles opened and read
// Nov 22 2026). No title update since launch and no patch notes from Rockstar for the two pre-launch updates.
// Problems only the press reports carry a Reported badge; Digital Foundry may be credited for its technical tests.
const OUT = ['/news/gta-6-out-now', 'Leonida Is Open: GTA VI Is Out'];
const L = (href, txt) => `<a href="${href}" style="color:var(--blue)">${txt}</a>`;
const X = (href, txt) => `<a href="${href}" style="color:var(--blue)" target="_blank" rel="noopener">${txt}</a>`;
const G = 'GTA VI, in-game';
const RS = 'Rockstar Support';
const SUP = id => `https://support.rockstargames.com/articles/${id}`;
module.exports = [
{
  slug: 'gta-6-easter-eggs', q: 'What Are the Best GTA 6 Easter Eggs?', h1: 'GTA 6 Easter Eggs',
  desc: 'The GTA 6 easter eggs players have pinned down: the UFO in Kelly County, Bigfoot in the swamps, the egg on the radio mast, the Apple Martini and more.',
  source: G,
  answer: [`<strong>Leonida hides more than cash.</strong> A UFO over Kelly County, Bigfoot on a swamp road, a nest of eggs on top of the tallest mast in Vice City. Some of it nods to old GTA games, some to film and TV, some is just Rockstar messing with you.`,
    `Every one of these is pinned down: where it is and what sets it off. Two pay out a hidden trophy. More turn up every day, and plenty of rumors have not survived a second look yet. They stay out until they do.`,
    { table: { title: 'Myths and Monsters', head: ['Easter Egg', 'Where', 'What Happens'], rows: [
      ['The UFO', `Country roads by the Starlet Motel, near ${L('/gameplay/locations/port-gellhorn', 'Port Gellhorn')}, ${L('/gameplay/locations/kelly-county', 'Kelly County')}`, `Late at night, alone. A parked car with flickering lights, a trail into the woods, a blue glow. Help the woman you find, walk her back, and the sky takes you. Hidden trophy: The Truth Is Out There. It does not show every night.`],
      ['Bigfoot', `The road along Cottonmouth Lake, south of ${L('/gameplay/locations/hamlet', 'Hamlet')}`, `A random encounter. He stands over a dead deer, then bolts into the marsh. Follow him to a strange effigy on a tree, and do not stare at it too long.`],
    ] } },
    { table: { title: 'Old GTA, Still Here', head: ['Easter Egg', 'Where', 'What Happens'], rows: [
      ['The Apple Martini', `Ocean View Hotel rooftop bar, ${L('/gameplay/locations/ocean-beach', 'Ocean Beach')}. Take the lift behind the pool bar`, `Order an Apple Martini and drink it at the counter. The Ocean View was the first safehouse in the original Vice City, and the hidden trophy, In The Beginning…, is named after that game's first mission.`],
      ['A Liberty City memoir', `Jason's house, ${L('/gameplay/locations/key-lento', 'Key Lento')}`, `Lethal by Design sits on the table by the back door, written by a former Liberty City mobster who still talks about 2008.`],
      ['A Western novel', `Jacob's Tavern in ${L('/gameplay/locations/millport', 'Millport')}, and Brian's marina in Key Lento`, `Pick it up and you are reading about a cowboy out in New Austin. Same universe, different century.`],
    ] } },
    { table: { title: 'Film, TV and Pure Nonsense', head: ['Easter Egg', 'Where', 'What Happens'], rows: [
      ['The egg on the mast', `Top of the tallest radio mast in ${L('/gameplay/locations/vice-city', 'Vice City')}`, `Six or seven minutes of climbing, or a parachute drop onto the top. Up there sits a giant nest of painted eggs. Throw one off the edge and the camera follows it down. Easter egg, literally.`],
      ['Dexter\'s apartment', `Washington Island, Vice City, near Top Fun Drones and the Pay 'n' Spray`, `A light-blue apartment block lifted straight from the Miami TV killer's home. You cannot go in. Check the boat moored nearby.`],
      ['The green Eclipse', `A villa garage on Vespucci Island, Rialto Islands, west of ${L('/gameplay/locations/vice-beach', 'Vice Beach')}`, `Break into the garage and there it is: a green tuner styled after Brian O'Conner's ride from The Fast and the Furious.`],
      ['The jet ski dog', `Open sea, far from shore`, `Get stranded out on the water and a dog in goggles rides up on a jet ski to save you. Stay on board and he takes you to an island full of dogs.`],
    ] } },
    `Hunting the rest? The ${L('/faq/gta-6-trophy-guide', 'trophy guide')} covers every hidden trophy, and ${L('/gameplay/collectibles/waink-locations', 'WAiNK')} flags a lot of curiosities as you scan.`],
  related: [
    { q: 'Is there a UFO in GTA 6?', html: `Yes. Near the Starlet Motel in ${L('/gameplay/locations/kelly-county', 'Kelly County')}, late at night, if you go alone. It does not spawn every night, so come back if the parked car with the flickering lights is not there.`, source: G },
    { q: 'Is Bigfoot in GTA 6?', html: 'Yes. He shows up as a random encounter on the road along Cottonmouth Lake, south of Hamlet, standing over a dead deer before he runs into the swamp.', source: G },
    { q: 'Which easter eggs unlock trophies?', html: `Two of these: the UFO (The Truth Is Out There) and the Apple Martini (In The Beginning…). The rest of the hidden ones are in the ${L('/faq/gta-6-trophy-guide', 'trophy guide')}.`, source: G },
  ],
  more: ['gta-6-trophy-guide', 'gta-6-cheats', 'gta-6-safe-codes'],
  card: { label: 'Easter Eggs', big: '9', sub: 'Pinned down so far' },
  intel: [OUT, ['/gameplay/locations/kelly-county', 'Kelly County']],
  index: { section: 'gameplay', q: 'What are the best GTA 6 easter eggs?', short: 'A UFO near the Starlet Motel in Kelly County, Bigfoot on the Cottonmouth Lake road, a nest of eggs on the tallest mast in Vice City, the Apple Martini on Ocean Beach and more.' },
},
{
  slug: 'gta-6-patch-notes', q: 'Is There a GTA 6 Patch, and What Are the Known Issues?', h1: 'GTA 6 Patch Notes and Known Issues',
  desc: 'GTA 6 has had no update since launch. The current version, the fixes Rockstar Support gives for audio desync and BuckMe limits, and the crashes players report.',
  source: RS,
  answer: [`<strong>No patch since launch.</strong> The current version is 01.002.001, which landed on November 16, three days before release. Rockstar has not published patch notes for it or for the update before it, and has not announced the next one.`,
    `What Rockstar has done is answer the common problems on its support site. Those fixes come first. After them, the problems players and the press report that Rockstar has not confirmed.`,
    { table: { title: 'Updates So Far', head: ['Version', 'Date', 'Download Size', 'Patch Notes'], rows: [
      ['01.002.001', 'November 16, 2026', 'About 600 MB on PS5, about 1.6 GB on Xbox Series X|S', 'None published'],
      ['01.002.000', 'November 13, 2026', 'About 1.1 GB on PS5, about 2.2 GB on Xbox Series X|S', 'None published'],
    ] } },
    `Download sizes come from players and the press, not from Rockstar.`,
    { table: { title: 'Fixes From Rockstar Support', head: ['Problem', 'What Rockstar Says'], rows: [
      ['Audio out of sync on PS5', `Test with headphones in the DualSense, or a captured clip on another device. If those are in sync, the TV is the problem: switch on Game Mode and set Auto Low Latency Mode (ALLM) to Off under Settings, Screen and Video, Video Output. ${X(SUP('3ssEH8P4XHr2SSk2dlQR9a/troubleshooting-for-audio-desync-issues-on-playstation-5'), 'Rockstar Support')}`],
      ['Audio out of sync on Xbox Series X|S', `Same test. Then switch on the TV's Game Mode and tick Allow Auto Low-Latency Mode under Profile &amp; System, Settings, General, TV &amp; Display Options, Video Modes. Yes, the opposite of the PS5 advice. ${X(SUP('6yXGnSzFIH0vrhicfSCuyP/troubleshooting-audio-desync-issues-on-xbox-series-x-or-s'), 'Rockstar Support')}`],
      ['BuckMe account is full', `Not a bug. Checking and Family Savings limits go up as the main story moves. Payments stuck on a full Checking account go through after the upgrade. ${X(SUP('5hSbxodEFeNbU1wARy1p4X/cannot-put-any-more-money-in-my-buckme-account-in-grand-theft-auto-vi'), 'Rockstar Support')}`],
      ['Console error codes', `Rockstar lists no GTA VI codes of its own and points to the ${X('https://www.playstation.com/support/error-codes/ps5/', 'PlayStation')} and ${X('https://support.xbox.com/help/errors/error-code-search-guide', 'Xbox')} error lookups. ${X(SUP('28kSeQ3zMV0PtXdGOoD8Jo/grand-theft-auto-vi-error-troubleshooting'), 'Rockstar Support')}`],
      ['Install or download stuck', `Rockstar sends you to the console makers' own install troubleshooting. ${X(SUP('3t8W3cKfObijZuwZuqT2eM/issues-installing-grand-theft-auto-vi'), 'Rockstar Support')}`],
    ] } },
    `Lost money or progress after a crash? The game autosaves mostly after bigger missions. Save by hand before you try anything risky. How saving works: ${L('/faq/gta-6-save-system', 'the save system')}.`],
  related: [
    { q: 'How do you fix error CE-108255-1 on PS5?', html: 'Rockstar has not addressed it. Players report the crash, sometimes at the same point in the story. Some got past it by switching the PS5 resolution from Manual to 1080p; clearing the cache or reinstalling did not help others. If it keeps happening, PlayStation support is the next stop.', source: 'Reported by players and the press', badge: 'Reported' },
    { q: 'Does GTA 6 crash on Xbox?', html: 'Some Xbox Series X players report repeated crashes, in the prologue or after 15 to 20 minutes. No common cause has turned up and Rockstar has not commented.', source: 'Reported by players and the press', badge: 'Reported' },
    { q: 'Why does GTA 6 drop frames?', html: 'On a base PS5 and on Xbox Series S the frame rate dips under 30 in busy scenes. That is how the game runs on that hardware, not a bug, and no fix has been promised.', source: 'Digital Foundry', badge: 'Reported' },
    { q: 'Is a big patch coming on November 25?', html: 'Not that Rockstar has said. The post going around about a November 25 patch has no Rockstar source behind it.', source: RS },
  ],
  more: ['gta-6-save-system', 'how-long-will-gta-6-take-to-download', 'what-time-does-gta-6-unlock'],
  card: { label: 'Current Version', big: '01.002.001', sub: 'No update since launch' },
  intel: [OUT],
  index: { section: 'gameplay', q: 'Is there a GTA 6 patch?', short: 'Not since launch. The current version is 01.002.001 from November 16, with no patch notes. Rockstar Support covers audio desync, BuckMe limits, error codes and install problems.' },
},
];
