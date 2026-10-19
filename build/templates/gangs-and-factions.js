'use strict';

const {
  renderHead,
  renderNavAndSearch,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderStatBlock,
  renderConnectionsGrid,
  renderSidebar,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');

// Gangs & Factions template. Confirmed 21/21 CSS-uniform (Anton/400 headings,
// consistent nav color) — unlike characters, this category is safe to build
// on the shared vehicles-style baseline (SHARED_CSS), same as vehicles.js.

const FACTION_HERO_CSS_SHARED = `
    .faction-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }
    .faction-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }
    .faction-hero__back:hover { color: var(--blue); }
    .faction-hero__back svg { width: 14px; height: 14px; }
    .faction-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }
    .faction-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(34px, 6vw, 62px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .95; margin-bottom: 14px; }
    .faction-hero__h1 span { color: var(--blue); }
    .faction-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }
    .faction-hero__sub strong { color: var(--t1); font-weight: 600; }
`;

const FACTION_HERO_CSS_NO_PHOTO = `
    .faction-hero { position: relative; min-height: 400px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .faction-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }
    .faction-hero__bg-graphic svg { position: absolute; right: -4%; top: 50%; transform: translateY(-50%); width: 42%; max-width: 460px; opacity: .07; color: var(--pink); }
    .faction-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.4) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .faction-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.45) 55%, rgba(236,228,211,0) 100%); }
${FACTION_HERO_CSS_SHARED}`;

const FACTION_HERO_CSS_PHOTO = `
    .faction-hero { position: relative; min-height: 440px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .faction-hero__bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 32%; z-index: 0; }
    .faction-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .faction-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }
${FACTION_HERO_CSS_SHARED}`;

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, heroImage, statBlock, gallery, connections, sidebarDatabase, sidebarExplore } = entry;
  const canonical = `https://gtavitips.com/gameplay/gangs-and-factions/${slug}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]} <span>${titleParts[1]}</span>` : titleParts[0];

  const head = renderHead({
    title: seo.title,
    description: seo.description,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
    ogImagePlaceholder: seo.ogImagePlaceholder,
    canonical,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.jsonLdHeadline,
      description: seo.jsonLdDescription,
      url: canonical,
      dateModified: seo.dateModified,
      publisher: { '@type': 'Organization', name: 'GTAVITIPS', url: 'https://gtavitips.com' },
    },
    extraCss: heroImage ? FACTION_HERO_CSS_PHOTO : FACTION_HERO_CSS_NO_PHOTO,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="faction-hero__bg-img">`
    : `<div class="faction-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><circle cx="7" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><circle cx="12" cy="18" r="3"/><path d="M9.5 9.8L14.5 9.8M8.3 10.6L10.8 15.8M15.7 10.6L13.2 15.8"/></svg>
    </div>`;

  const hero = `  <header class="faction-hero">
    ${heroBackground}
    <div class="faction-hero__overlay" aria-hidden="true"></div>
    <div class="faction-hero__inner">
      <a href="/gameplay/gangs-and-factions" class="faction-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Gangs &amp; Factions
      </a>
      <div class="faction-hero__eyebrow">Faction File</div>
      <h1 class="faction-hero__h1">${h1}</h1>
      <p class="faction-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const dossier = `  <div class="page">
    <div class="wrap">
${renderStatBlock(statBlock, gallery, 'Faction stats')}
    </div>
  </div>
`;

  const main = `  <main id="main">
    <div class="wrap">
      <div class="content-grid">
        <div class="content-main">

          <section class="section reveal" aria-labelledby="intel-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Organizational Intelligence</span></div>
            <h2 class="section__h2" id="intel-hd">Faction <span style="color:var(--blue)">Profile</span></h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>

          <section class="section reveal" aria-labelledby="connected-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Related Intelligence</span></div>
            <h2 class="section__h2" id="connected-hd">Connected <span style="color:var(--blue)">Intelligence</span></h2>
            <div class="connected-grid" role="list">
              ${renderConnectionsGrid(connections)}
            </div>
          </section>

        </div>
${renderSidebar('Factions Index', sidebarDatabase, sidebarExplore, 'Faction navigation')}
      </div>
    </div>
  </main>
`;

  return [
    head,
    renderNavAndSearch({ label: 'Gangs &amp; Factions', url: '/gameplay/gangs-and-factions' }),
    hero,
    dossier,
    main,
    FOOTER_HTML,
    SHARED_SCRIPT,
    COOKIE_BANNER_BLOCK,
  ].join('\n');
}

module.exports = { render, renderProse: renderBlock };
