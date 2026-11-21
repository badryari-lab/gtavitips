'use strict';

const fs = require('fs');
const path = require('path');
const {
  renderHead,
  renderNavAndSearch,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderConnectionsGridAvatar,
  renderSidebarBlocks,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');
const { SPOILER_NOTE, SPOILER_CSS, renderSpoiler } = require('./_spoiler');

// Story missions template (Nov 2026). Data: build/data/missions/<slug>.md, output build/output/missions/<slug>/,
// copied to hub/story/missions/<slug>/ (missions are not a /gameplay database category). Canonical Tropical
// Deco CSS from _shared (same generation as vehicles/activities). Spoiler layers per CLAUDE.md "Spoilers":
// the mission name and chapter are light (top notice); the summary lives only in closed reveals (`story`).
//
// Frontmatter fields:
//   name, titleParts [a, b?], chapter ("Prologue" | 1..5), order (global story order), playableAs, optional?
//   location (display text for hub cards), cardDesc (<=90 chars, spoiler-free hub card / search line)
//   seo { title, description, ogDescription?, ogImage?, dateModified }   <- spoiler-free, the only JSON-LD/meta input
//   heroSubtitle (spoiler-free), heroImage? { src, alt, width, height }
//   statBlock [{ key, value, sub? }]   statSource ("GTA VI, in-game")
//   rewards [md], missables [md], tips [md]   (each optional; an empty list drops the section)
//   story [{ chapter, md }]  -> closed reveals         spoilerNote? -> stronger top notice (heavy names)
//   walkthrough? { youtubeId, title, creator, channelUrl, start? }  (start = seconds, for a longer video that covers the mission)
//   connections [{ url, name, desc, avatarImage? | avatarInitials }]
//   faq? [{ q, a, spoiler? }]   faqSchema? [{ q, aPlain }] (spoiler-free; FAQPage JSON-LD only when given)
// Markdown body = the Objective section (spoiler-free gameplay description).
// Prev/next and the chapter sidebar are derived from all mission files, never written by hand.

const DATA_DIR = path.join(__dirname, '..', 'data', 'missions');
let _all = null;
function allMissions() {
  if (_all) return _all;
  _all = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
      const d = JSON.parse(raw.slice(0, raw.indexOf('\n---\n')).trim());
      // links: every /gameplay page this mission points at from its stat block or cards (feeds the reverse links).
      const links = new Set((d.connections || []).map((c) => c.url));
      for (const it of d.statBlock || []) for (const mm of String(it.value).matchAll(/\]\((\/gameplay\/[^)#\s]+)\)/g)) links.add(mm[1]);
      return { slug: d.slug || f.replace(/\.md$/, ''), name: d.name, chapter: d.chapter, order: d.order, playableAs: d.playableAs, optional: !!d.optional, location: d.location, cardDesc: d.cardDesc, links: [...links] };
    })
    .sort((a, b) => a.order - b.order);
  return _all;
}

// Reverse links for character/location pages: one closed reveal listing the missions that point at `url`,
// grouped by chapter. Mission names are light spoilers, so on spoiler-free pages they only live in the reveal.
// Returns '' when no mission links to the page (pages then render exactly as before).
function renderMissionsReveal(url, ind) {
  if (!fs.existsSync(DATA_DIR)) return '';
  const list = allMissions().filter((m) => m.links.includes(url));
  if (!list.length) return '';
  const chapters = [...new Set(list.map((m) => m.chapter))];
  const html = chapters
    .map((c) => `<p><strong>${chapterLabel(c)}:</strong> ${list.filter((m) => m.chapter === c).map((m) => `<a href="${missionUrl(m.slug)}" style="color:var(--blue)">${m.name}</a>`).join(', ')}</p>`)
    .join('') + `<p><a href="/story" style="color:var(--blue)">All story missions</a></p>`;
  return renderSpoiler({ chapter: list.length === 1 ? 'Mission' : `${list.length} Missions`, html }, ind);
}

const chapterLabel = (c) => (typeof c === 'number' ? `Chapter ${c}` : String(c));
const chapterAnchor = (c) => (typeof c === 'number' ? `chapter-${c}` : String(c).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
const missionUrl = (slug) => `/story/missions/${slug}`;

const MISSION_CSS = `
    .dossier { margin: 32px 0 56px; display: block; }
    .dossier .stat-block { max-width: 640px; }
    .connections { display: flex; flex-direction: column; gap: 8px; }
    .conn-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r) 4px var(--r) 4px; padding: 16px 18px; display: flex; flex-direction: row; align-items: center; gap: 16px; text-decoration: none; transition: border-color .2s, transform .2s, background .2s; }
    .conn-card:hover { border-color: var(--border-b); transform: translateX(4px); background: var(--bg-3); }
    .conn-card__avatar { width: 56px; height: 56px; border-radius: 8px; background: var(--bg-3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-size: 15px; font-weight: 400; color: var(--blue); text-transform: uppercase; flex-shrink: 0; }
    .conn-card__body { flex: 1; min-width: 0; }
    .conn-card__name { font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.2; }
    .conn-card__desc { font-size: 12px; color: var(--t3); margin-top: 2px; line-height: 1.4; }
    .conn-card__arrow { font-size: 16px; color: var(--t3); transition: color .2s, transform .2s; flex-shrink: 0; }
    .conn-card:hover .conn-card__arrow { color: var(--blue); transform: translateX(3px); }
    .faq-list { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-item:last-child { border-bottom: none; }
    .faq-q { list-style: none; cursor: pointer; padding: 18px 22px; font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.4; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
    .faq-q::-webkit-details-marker { display: none; }
    .faq-q svg { width: 15px; height: 15px; flex-shrink: 0; color: var(--t3); transition: transform .2s; }
    .faq-item[open] .faq-q svg { transform: rotate(180deg); }
    .faq-a { padding: 0 22px 18px; font-size: 13px; color: var(--t2); line-height: 1.75; }
    .mission-list { list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 14px; color: var(--t2); line-height: 1.7; }
    .mission-list li { position: relative; padding-left: 20px; }
    .mission-list li::before { content: ''; position: absolute; left: 2px; top: .7em; width: 7px; height: 7px; background: var(--blue); border-radius: 2px; transform: rotate(45deg); }
    .mission-list strong { color: var(--t1); font-weight: 600; }
    .video-wrap { position: relative; width: 100%; aspect-ratio: 16/9; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r) 4px var(--r) 4px; overflow: hidden; }
    .video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    .video-credit { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-top: 12px; }
    .video-credit a { color: var(--blue); }
    .mission-pager { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
    .mission-pager a { display: block; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r) 4px var(--r) 4px; padding: 14px 16px; text-decoration: none; transition: border-color .2s, background .2s; }
    .mission-pager a:hover { border-color: var(--border-b); background: var(--bg-3); }
    .mission-pager__dir { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); }
    .mission-pager__name { font-size: 14px; font-weight: 700; color: var(--t1); margin-top: 4px; line-height: 1.3; }
    .mission-pager__next { text-align: right; grid-column: 2; }
    .reveal.d3 { transition-delay: .21s; }
    .mission-hero { position: relative; min-height: 420px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .mission-hero__bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 35%; z-index: 0; }
    .mission-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }
    .mission-hero__bg-graphic svg { position: absolute; right: -6%; top: 50%; transform: translateY(-50%); width: 50%; max-width: 520px; opacity: .07; color: var(--pink); }
    .mission-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .mission-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }
    .mission-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }
    .mission-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }
    .mission-hero__back:hover { color: var(--blue); }
    .mission-hero__back svg { width: 14px; height: 14px; }
    .mission-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 68px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 14px; }
    .mission-hero__h1 span { color: var(--blue); }
    .mission-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }
    .mission-hero__sub strong { color: var(--t1); font-weight: 600; }
    @media (max-width: 480px) { .mission-pager { grid-template-columns: 1fr; } .mission-pager__next { grid-column: 1; } }
`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function listSection(id, title, items) {
  if (!items || !items.length) return '';
  return `
          <section class="section reveal" aria-labelledby="${id}">
            <h2 class="section__h2" id="${id}">${title}</h2>
            <ul class="mission-list">
              ${items.map((i) => `<li>${renderInline(i)}</li>`).join('\n              ')}
            </ul>
          </section>
`;
}

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, heroImage, statBlock, statSource, rewards, missables, tips, story, walkthrough, connections, faq, faqSchema, spoilerNote, chapter } = entry;
  if (!story || !story.length) throw new Error('mission needs at least one story reveal');
  const canonical = `https://gtavitips.com${missionUrl(slug)}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]}<span style="color:var(--blue)">${titleParts[1]}</span>` : titleParts[0];
  const all = allMissions();
  const idx = all.findIndex((m) => m.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const anchor = chapterAnchor(chapter);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title.replace(/\s*\|.*$/, ''),
      description: seo.description,
      url: canonical,
      dateModified: seo.dateModified,
      about: { '@type': 'VideoGame', name: 'Grand Theft Auto VI' },
      isPartOf: { '@type': 'CollectionPage', name: 'GTA 6 Story and Missions', url: 'https://gtavitips.com/story' },
      publisher: { '@type': 'Organization', name: 'GTAVITIPS', url: 'https://gtavitips.com' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gtavitips.com/' },
        { '@type': 'ListItem', position: 2, name: 'Story', item: 'https://gtavitips.com/story' },
        { '@type': 'ListItem', position: 3, name: entry.name, item: canonical },
      ],
    },
  ];
  if (faqSchema && faqSchema.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqSchema.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.aPlain } })),
    });
  }

  const head = renderHead({
    title: seo.title,
    description: seo.description,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
    canonical,
    jsonLd,
    extraCss: MISSION_CSS + SPOILER_CSS,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${esc(heroImage.alt)}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="mission-hero__bg-img">`
    : `<div class="mission-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><path d="M4 21V4"/><path d="M4 4h12l-2 4 2 4H4"/><circle cx="18" cy="19" r="2"/><path d="M6 19h4c2 0 2-3 4-3h2"/></svg>
    </div>`;

  const hero = `  <header class="mission-hero">
    ${heroBackground}
    <div class="mission-hero__overlay" aria-hidden="true"></div>
    <div class="mission-hero__inner">
      <a href="/story#${anchor}" class="mission-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Story
      </a>
      <h1 class="mission-hero__h1">${h1}</h1>
      <p class="mission-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const statItemsHtml = statBlock
    .map(
      (it) => `          <div class="stat-block__item" role="listitem">
            <div class="stat-block__key">${it.key}</div>
            <div class="stat-block__val">${renderInline(it.value)}</div>${it.sub ? `\n            <div class="stat-block__sub">${renderInline(it.sub)}</div>` : ''}
          </div>`
    )
    .join('\n');

  const dossier = `  <div class="page">
    <div class="wrap">
      <div class="dossier">
        <p class="spoiler-note">${spoilerNote || SPOILER_NOTE}</p>
        <div class="stat-block" role="list" aria-label="Mission stats">
${statItemsHtml}
        </div>${statSource ? `\n        <p class="stat-source">Source: ${statSource}</p>` : ''}
      </div>
    </div>
  </div>
`;

  const storyHtml = `
          <section class="section reveal story-arc" aria-labelledby="story-hd">
            <h2 class="section__h2" id="story-hd">Story</h2>
            <div class="section__body"><p>What happens in this mission, start to finish. It stays shut until you open it.</p></div>
            ${story.map((b) => renderSpoiler(b, '            ')).join('\n            ')}
            <p class="story-arc__source">Source: GTA VI, in-game</p>
          </section>
`;

  const videoHtml = walkthrough
    ? `
          <section class="section reveal" aria-labelledby="walkthrough-hd">
            <h2 class="section__h2" id="walkthrough-hd">Walkthrough</h2>
            <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${walkthrough.youtubeId}${walkthrough.start ? `?start=${walkthrough.start}` : ''}" title="${esc(walkthrough.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
            <p class="video-credit">Walkthrough video by <a href="${walkthrough.channelUrl}" target="_blank" rel="noopener">${walkthrough.creator}</a> on YouTube</p>
          </section>
`
    : '';

  const connHtml = connections && connections.length
    ? `
          <section class="section reveal" aria-labelledby="connections-hd">
            <h2 class="section__h2" id="connections-hd">In This Mission</h2>
            <div class="connections" role="list">
${renderConnectionsGridAvatar(connections)}
            </div>
          </section>
`
    : '';

  const pagerHtml = prev || next
    ? `
          <nav class="section reveal" aria-label="Mission order">
            <div class="mission-pager">${prev ? `
              <a href="${missionUrl(prev.slug)}"><div class="mission-pager__dir">&larr; Previous mission</div><div class="mission-pager__name">${prev.name}</div></a>` : ''}${next ? `
              <a href="${missionUrl(next.slug)}" class="mission-pager__next"><div class="mission-pager__dir">Next mission &rarr;</div><div class="mission-pager__name">${next.name}</div></a>` : ''}
            </div>
          </nav>
`
    : '';

  const faqHtml = faq && faq.length
    ? `
          <section class="section reveal" aria-labelledby="faq-hd">
            <h2 class="section__h2" id="faq-hd">Frequently Asked</h2>
            <div class="faq-list">
              ${faq
                .map(
                  (f) => `<details class="faq-item">
                <summary class="faq-q">${f.q}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
                <div class="faq-a">${renderInline(f.a)}${f.spoiler ? '\n                  ' + renderSpoiler(f.spoiler, '                  ') : ''}</div>
              </details>`
                )
                .join('\n              ')}
            </div>
          </section>
`
    : '';

  const sameChapter = all.filter((m) => m.chapter === chapter);
  const sidebar = renderSidebarBlocks(
    [
      { title: chapterLabel(chapter), items: sameChapter.map((m) => ({ label: m.slug === slug ? `<strong>${m.name}</strong>` : m.name, url: missionUrl(m.slug) })) },
      {
        title: 'Story',
        items: [
          { label: 'All Missions', url: '/story' },
          { label: 'Jason Duval', url: '/gameplay/characters/jason-duval' },
          { label: 'Lucia Caminos', url: '/gameplay/characters/lucia-caminos' },
          { label: 'Leonida Map', url: '/map' },
        ],
      },
    ],
    'Mission navigation'
  );

  const main = `  <main id="main">
    <div class="wrap">
      <div class="content-grid">
        <div class="content-main">

          <section class="section reveal" aria-labelledby="objective-hd">
            <h2 class="section__h2" id="objective-hd">Objective</h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>
${listSection('rewards-hd', 'Rewards', rewards)}${listSection('missables-hd', 'Missables', missables)}${listSection('tips-hd', 'Tips', tips)}${storyHtml}${videoHtml}${connHtml}${pagerHtml}${faqHtml}
        </div>
${sidebar}
      </div>
    </div>
  </main>
`;

  return [head, renderNavAndSearch({ label: 'Story', url: '/story' }), hero, dossier, main, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK].join('\n');
}

module.exports = { render, renderProse: renderBlock, allMissions, chapterLabel, chapterAnchor, missionUrl, MISSION_CSS, renderMissionsReveal };
