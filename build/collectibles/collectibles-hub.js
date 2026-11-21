'use strict';

// Collectibles hub generator (Nov 2026): node build/collectibles/collectibles-hub.js -> build/output/collectibles-hub/index.html
// Copy to hub/gameplay/collectibles/index.html. Lists every type from build/data/collectibles/*.md (spoiler-free).

const fs = require('fs');
const path = require('path');
const { renderHead, renderNavAndSearch, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK } = require('../templates/_shared');
const { renderInline } = require('../templates/_markdown');
const { MISSION_CSS } = require('../templates/missions');
const { STAT_SOURCE_CSS } = require('../templates/_spoiler');
const { allCollectibles, typeUrl } = require('../templates/collectibles');

const OUT = path.join(__dirname, '..', 'output', 'collectibles-hub', 'index.html');
const CANONICAL = 'https://gtavitips.com/gameplay/collectibles';

const HUB_CSS = `
    .story-wrap { padding: 36px 0 72px; }
    .story-intro { font-size: 15px; color: var(--t2); line-height: 1.8; max-width: 760px; margin-bottom: 28px; }
    .story-intro strong { color: var(--t1); font-weight: 600; }
    .story-intro a { color: var(--blue); }
    .m-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
    .m-card { display: flex; flex-direction: column; gap: 6px; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r) 4px var(--r) 4px; padding: 18px 20px; text-decoration: none; transition: border-color .2s, transform .2s, background .2s; }
    .m-card:hover { border-color: var(--border-b); transform: translateY(-2px); background: var(--bg-3); }
    .m-card__num { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--pink); }
    .m-card__name { font-family: 'Anton', sans-serif; font-weight: 400; font-size: 21px; text-transform: uppercase; color: var(--t1); line-height: 1.1; }
    .m-card__desc { font-size: 12.5px; color: var(--t3); line-height: 1.55; }
`;

function main() {
  const types = allCollectibles();
  const total = types.reduce((a, t) => a + (t.count || 0), 0);
  const seo = {
    title: 'GTA 6 Collectibles: Every Type and All Locations | GTAVITIPS',
    description: `Every GTA 6 collectible in one place: ${types.length} types, ${total} items, with locations, rewards and what counts toward 100% completion.`,
  };
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'GTA 6 Collectibles',
      description: seo.description,
      url: CANONICAL,
      about: { '@type': 'VideoGame', name: 'Grand Theft Auto VI' },
      publisher: { '@type': 'Organization', name: 'GTAVITIPS', url: 'https://gtavitips.com' },
      mainEntity: { '@type': 'ItemList', numberOfItems: types.length, itemListElement: types.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: `https://gtavitips.com${typeUrl(t.slug)}` })) },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Database', item: 'https://gtavitips.com/gameplay' },
        { '@type': 'ListItem', position: 2, name: 'Collectibles', item: CANONICAL },
      ],
    },
  ];
  const head = renderHead({ title: seo.title, description: seo.description, canonical: CANONICAL, jsonLd, extraCss: MISSION_CSS + STAT_SOURCE_CSS + HUB_CSS });
  const hero = `  <header class="mission-hero">
    <div class="mission-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><path d="M12 2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 16.8 6.1 20l1.3-6.5L2.5 8.9l6.6-.8z"/></svg>
    </div>
    <div class="mission-hero__overlay" aria-hidden="true"></div>
    <div class="mission-hero__inner">
      <a href="/gameplay" class="mission-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Database
      </a>
      <h1 class="mission-hero__h1">Collect<span>ibles</span></h1>
      <p class="mission-hero__sub">${types.length} kinds of things to find across Leonida, ${total} in all. Every location, every reward.</p>
    </div>
  </header>
`;
  const cards = types.map((t) => `<a href="${typeUrl(t.slug)}" class="m-card reveal">
            <div class="m-card__num">${t.count} to find</div>
            <div class="m-card__name">${t.name}</div>${t.cardDesc ? `
            <div class="m-card__desc">${renderInline(t.cardDesc)}</div>` : ''}
          </a>`).join('\n          ');
  const body = `  <main id="main">
    <div class="wrap story-wrap">
      <div class="story-intro">
        <p>Magazines on newsstands, gold on the seabed, books left in swap boxes. Each page covers where to look, what you get for it and whether it counts toward <a href="/faq/gta-6-100-percent-completion">100% completion</a>.</p>
      </div>
      <div class="m-grid" role="list">
          ${cards}
      </div>
      <p class="stat-source" style="margin-top:40px">Source: GTA VI, in-game</p>
    </div>
  </main>
`;
  const html = [head, renderNavAndSearch({ label: 'Collectibles', url: '/gameplay/collectibles' }), hero, body, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK].join('\n');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html, 'utf8');
  console.log(`collectibles hub: ${types.length} type card(s), ${total} items -> build/output/collectibles-hub/index.html`);
}

main();
