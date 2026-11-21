'use strict';

// Story hub generator (Nov 2026): node build/story/story-hub.js -> build/output/story/index.html
// Reads every mission data file (via templates/missions.js allMissions) plus build/data/missions/_chapters.json:
//   [{ chapter: "Prologue" | 1..5, title: "<in-game chapter title or null>", setting: "<spoiler-free line, Markdown>",
//      summary: "<Markdown, chapter recap; rendered ONLY inside a closed spoiler reveal>" }]
// Only missions that have a data file are listed, so the hub grows with each batch and never links a missing page.
// Spoiler-free zones: meta, JSON-LD (names + URLs only), hero, chapter setting lines, mission cards (cardDesc).
// Copy the output to hub/story/index.html.

const fs = require('fs');
const path = require('path');
const { renderHead, renderNavAndSearch, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK } = require('../templates/_shared');
const { renderInline } = require('../templates/_markdown');
const { SPOILER_CSS, renderSpoiler } = require('../templates/_spoiler');
const { allMissions, chapterLabel, chapterAnchor, missionUrl, MISSION_CSS } = require('../templates/missions');

const CHAPTERS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'missions', '_chapters.json'), 'utf8'));
const OUT = path.join(__dirname, '..', 'output', 'story', 'index.html');
const CANONICAL = 'https://gtavitips.com/story';
const TOTAL_MISSIONS = 94; // full story count (91 required + 3 optional), shown in the intro

const HUB_CSS = `
    .story-jump { display: flex; flex-wrap: wrap; gap: 8px; margin: 28px 0 8px; }
    .story-jump a { font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); background: var(--bg-2); border: 1px solid var(--border); border-radius: 99px; padding: 8px 14px; text-decoration: none; transition: color .18s, border-color .18s; }
    .story-jump a:hover { color: var(--blue); border-color: var(--border-b); }
    .chapter { padding: 48px 0 8px; border-top: 1px solid var(--border); margin-top: 40px; scroll-margin-top: calc(var(--nav-h) + 16px); }
    .chapter__h2 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(28px, 4vw, 42px); text-transform: uppercase; color: var(--t1); line-height: 1; margin-bottom: 12px; }
    .chapter__h2 span { color: var(--blue); }
    .chapter__setting { font-size: 15px; color: var(--t2); line-height: 1.7; max-width: 720px; margin-bottom: 22px; }
    .chapter__setting strong { color: var(--t1); font-weight: 600; }
    .chapter__meta { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-bottom: 14px; }
    .m-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
    .m-card { display: flex; flex-direction: column; gap: 6px; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r) 4px var(--r) 4px; padding: 16px 18px; text-decoration: none; transition: border-color .2s, transform .2s, background .2s; }
    .m-card:hover { border-color: var(--border-b); transform: translateY(-2px); background: var(--bg-3); }
    .m-card__num { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--pink); }
    .m-card__name { font-size: 15px; font-weight: 700; color: var(--t1); line-height: 1.25; }
    .m-card__desc { font-size: 12px; color: var(--t3); line-height: 1.5; }
    .m-card__foot { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--t3); margin-top: auto; padding-top: 4px; }
    .chapter .spoiler { margin-top: 18px; max-width: 760px; }
    .story-intro { font-size: 15px; color: var(--t2); line-height: 1.8; max-width: 760px; }
    .story-intro strong { color: var(--t1); font-weight: 600; }
    .story-wrap { padding: 36px 0 72px; }
`;

function card(m) {
  return `<a href="${missionUrl(m.slug)}" class="m-card reveal">
                <div class="m-card__num">Mission ${m.order}${m.optional ? ' &middot; Optional' : ''}</div>
                <div class="m-card__name">${m.name}</div>${m.cardDesc ? `
                <div class="m-card__desc">${renderInline(m.cardDesc)}</div>` : ''}
                <div class="m-card__foot">${m.playableAs}${m.location ? ` &middot; ${m.location}` : ''}</div>
              </a>`;
}

function main() {
  const missions = allMissions().filter((m) => m.slug !== 'example-mission');
  const sections = CHAPTERS.map((c) => {
    const list = missions.filter((m) => m.chapter === c.chapter);
    const a = chapterAnchor(c.chapter);
    const label = chapterLabel(c.chapter);
    const h2 = c.title ? `${label}: <span>${c.title}</span>` : `<span>${label}</span>`;
    return `
        <section class="chapter" id="${a}" aria-labelledby="${a}-hd">
          <h2 class="chapter__h2" id="${a}-hd">${h2}</h2>
          <p class="chapter__setting">${renderInline(c.setting)}</p>
          <div class="chapter__meta">${list.length ? `${list.length} mission page${list.length === 1 ? '' : 's'}` : 'Mission pages in progress'}</div>${list.length ? `
          <div class="m-grid">
              ${list.map(card).join('\n              ')}
          </div>` : ''}${c.summary ? `
          ${renderSpoiler({ chapter: c.chapter, md: c.summary }, '          ')}` : ''}
        </section>`;
  }).join('\n');

  const seo = {
    title: 'GTA 6 Story and Missions: Every Chapter and Mission | GTAVITIPS',
    description: 'Every GTA 6 story mission in order, chapter by chapter: objectives, rewards, missables and walkthrough videos. Story details stay behind a spoiler click.',
  };
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'GTA 6 Story and Missions',
      description: seo.description,
      url: CANONICAL,
      about: { '@type': 'VideoGame', name: 'Grand Theft Auto VI' },
      publisher: { '@type': 'Organization', name: 'GTAVITIPS', url: 'https://gtavitips.com' },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: missions.length,
        itemListElement: missions.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, url: `https://gtavitips.com${missionUrl(m.slug)}` })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gtavitips.com/' },
        { '@type': 'ListItem', position: 2, name: 'Story', item: CANONICAL },
      ],
    },
  ];
  const head = renderHead({
    title: seo.title,
    description: seo.description,
    ogImage: 'https://gtavitips.com/assets/images/lucia-caminos-gta-6-character-04.jpg',
    canonical: CANONICAL,
    jsonLd,
    extraCss: MISSION_CSS + SPOILER_CSS + HUB_CSS,
  });

  const hero = `  <header class="mission-hero">
    <img src="/assets/images/lucia-caminos-gta-6-character-04.jpg" alt="Lucia and Jason, the two leads of the GTA 6 story" width="1920" height="1080" loading="eager" class="mission-hero__bg-img" style="object-position:center 30%;">
    <div class="mission-hero__overlay" aria-hidden="true"></div>
    <div class="mission-hero__inner">
      <h1 class="mission-hero__h1">Story &amp; <span>Missions</span></h1>
      <p class="mission-hero__sub">The GTA 6 story, chapter by chapter, with a page for every mission. Names are on show; what happens stays behind a click.</p>
    </div>
  </header>
`;

  const body = `  <main id="main">
    <div class="wrap story-wrap">
      <p class="spoiler-note">Light story spoilers on this page: chapter and mission names. Everything that happens sits behind a click, and nothing opens until you do.</p>
      <div class="story-intro">
        <p>The story runs through a prologue and five chapters, <strong>${TOTAL_MISSIONS} missions</strong> in all, with control passing between <a href="/gameplay/characters/jason-duval" style="color:var(--blue)">Jason</a> and <a href="/gameplay/characters/lucia-caminos" style="color:var(--blue)">Lucia</a>. Each mission page covers the objective, rewards, anything you can miss and a full walkthrough video.</p>
      </div>
      <nav class="story-jump" aria-label="Chapters">
        ${CHAPTERS.map((c) => `<a href="#${chapterAnchor(c.chapter)}">${chapterLabel(c.chapter)}</a>`).join('\n        ')}
      </nav>
${sections}
      <p class="story-arc__source" style="margin-top:40px">Source: GTA VI, in-game</p>
    </div>
  </main>
`;

  const html = [head, renderNavAndSearch({ label: 'Story', url: '/story' }), hero, body, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK].join('\n');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html, 'utf8');
  console.log(`story hub: ${missions.length} mission card(s), ${CHAPTERS.length} chapter section(s) -> build/output/story/index.html`);
}

main();
