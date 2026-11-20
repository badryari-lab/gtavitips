// Source-line policy (agreed with Badr Nov 20 2026): competitor guide sites are never credited as a source.
// Game facts are credited to the game itself; relay outlets ("as reported by X", "via X") are dropped so the
// original source stays (Rockstar, Game Informer, Famitsu, Digital Foundry, GamesBeat, Metacritic...).
// Used by faq-gen.js and faq-index-inline.js, and by the one-off cleanup. clean() is idempotent.
const BANNED = /\b(IGN|PowerPyx|KeenGamer|GamesRadar|Sportskeeda|TalkEsport|GameSpot|Red Bull|Gfinity|Game Over Drive|GTA ?BOOM|GTABoom|ScreenRant|Polygon|Kotaku|VGC|Altchar|Archyde|Yahoo( News)?|TechRadar|Associated Press|Dexerto|Notebookcheck|TweakTown|Variety)\b/i;
const IN_GAME = 'GTA VI, in-game';
const WHOLE = {
  "IGN's Official GTA 6 Guide, weapon menu stats": 'the in-game weapon menu',
  "IGN's Official GTA 6 Guide, WAiNK vehicle stats": 'in-game WAiNK scans',
};
function clean(src) {
  const s0 = String(src).trim();
  if (WHOLE[s0]) return WHOLE[s0];
  if (!BANNED.test(s0)) return s0;
  let dropped = false;
  const segs = s0.split(/\s*;\s*/).map(seg => {
    seg = seg.replace(/,?\s*as reported by [^;]*$/i, '');
    seg = seg.replace(/,?\s*via ([^;,]*)/gi, (m, who) => BANNED.test(who) || /press/i.test(who) ? '' : m);
    const parts = seg.split(/\s*,\s*/).filter(p => { if (BANNED.test(p)) { dropped = true; return false; } return p.trim(); });
    return parts.join(', ').replace(/^(story|plates):\s*/i, '').trim();
  }).filter(Boolean);
  if (dropped && !segs.includes(IN_GAME)) segs.push(IN_GAME);
  return segs.length ? segs.join('; ') : IN_GAME;
}
module.exports = { clean, BANNED, IN_GAME };
