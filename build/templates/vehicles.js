'use strict';

const {
  renderHead,
  NAV_AND_SEARCH_HTML,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderStatBlock,
  renderConnectionsGrid,
  renderSidebar,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');

// Vehicle template (approved pattern, CLAUDE.md "Database entry conventions"):
// hero has no real photo (gradient + line-icon graphic only — vehicles never
// got real photos, see the canonical-images table), stat-block + 2 fixed
// sections: Field Assessment (freeform prose) -> Related Vehicles (data-driven
// cards). No FAQ accordion on vehicle pages.

// Two hero variants: most vehicles have no real photo yet (gradient + faint
// line-icon), a few do (real full-bleed photo with a stronger bottom scrim).
// Shared rules live once; only what actually differs is duplicated below.
const VEHICLE_HERO_CSS_SHARED = `
    .vehicle-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }
    .vehicle-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }
    .vehicle-hero__back:hover { color: var(--blue); }
    .vehicle-hero__back svg { width: 14px; height: 14px; }
    .vehicle-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }
    .vehicle-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(34px, 6vw, 62px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .95; margin-bottom: 14px; }
    .vehicle-hero__h1 span { color: var(--blue); }
    .vehicle-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }
    .vehicle-hero__sub strong { color: var(--t1); font-weight: 600; }
`;

const VEHICLE_HERO_CSS_NO_PHOTO = `
    .vehicle-hero { position: relative; min-height: 400px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .vehicle-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }
    .vehicle-hero__bg-graphic svg { position: absolute; right: -6%; top: 50%; transform: translateY(-50%); width: 50%; max-width: 560px; opacity: .07; color: var(--pink); }
    .vehicle-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.4) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .vehicle-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.45) 55%, rgba(236,228,211,0) 100%); }
${VEHICLE_HERO_CSS_SHARED}`;

const VEHICLE_HERO_CSS_PHOTO = `
    .vehicle-hero { position: relative; min-height: 440px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .vehicle-hero__bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 32%; z-index: 0; }
    .vehicle-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .vehicle-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }
${VEHICLE_HERO_CSS_SHARED}`;

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, heroImage, statBlock, gallery, connections, sidebarDatabase, sidebarExplore } = entry;
  const canonical = `https://gtavitips.com/gameplay/vehicles/${slug}`;
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
    extraCss: heroImage ? VEHICLE_HERO_CSS_PHOTO : VEHICLE_HERO_CSS_NO_PHOTO,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="vehicle-hero__bg-img">`
    : `<div class="vehicle-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v7M4.2 16.5l6.2-3.2M19.8 16.5l-6.2-3.2"/></svg>
    </div>`;

  const hero = `  <header class="vehicle-hero">
    ${heroBackground}
    <div class="vehicle-hero__overlay" aria-hidden="true"></div>
    <div class="vehicle-hero__inner">
      <a href="/gameplay/vehicles" class="vehicle-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Vehicle Database
      </a>
      <div class="vehicle-hero__eyebrow">Vehicle File</div>
      <h1 class="vehicle-hero__h1">${h1}</h1>
      <p class="vehicle-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const dossier = `  <div class="page">
    <div class="wrap">
${renderStatBlock(statBlock, gallery)}
    </div>
  </div>
`;

  const main = `  <main id="main">
    <div class="wrap">
      <div class="content-grid">
        <div class="content-main">

          <section class="section reveal" aria-labelledby="assessment-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Automotive Intel</span></div>
            <h2 class="section__h2" id="assessment-hd">Field <span style="color:var(--blue)">Assessment</span></h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>

          <section class="section reveal" aria-labelledby="related-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Related Intelligence</span></div>
            <h2 class="section__h2" id="related-hd">Related <span style="color:var(--blue)">Vehicles</span></h2>
            <div class="connected-grid" role="list">
              ${renderConnectionsGrid(connections)}
            </div>
          </section>

        </div>
${renderSidebar('Vehicle Database', sidebarDatabase, sidebarExplore)}
      </div>
    </div>
  </main>
`;

  return [head, NAV_AND_SEARCH_HTML, hero, dossier, main, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK].join('\n');
}

// renderBlock is re-exported so build.js can turn a data file's Markdown body
// into entry.proseHtml before calling render().
module.exports = { render, renderProse: renderBlock };
