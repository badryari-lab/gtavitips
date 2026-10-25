'use strict';

const {
  renderHead,
  renderNavAndSearch,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderSidebarBlocks,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');

// Brands template. Confirmed 72/76 CSS-uniform canonical; 4 known stub
// pages (angstapan, one-eyes-willies, rideout-customs, saras-unisex-salon)
// have only 1 section and are a deliberate, confirmed-complete state (see
// project memory) — not a bug, handled here by treating the second section
// as optional. No FAQ anywhere in this category (0/76). Uses a distinct
// "eco-card" connection style (avatar + industry + name only, no
// description, no arrow) — never conn-card, unlike every other category.
// Section headings/eyebrows are stored as data, not hardcoded, since they
// vary slightly per entry (e.g. "Vice City Profile", "Key Personnel").

const BRAND_EXTRA_CSS = `
    .dossier { margin: 32px 0 56px; display: block; }
    .dossier .stat-block { max-width: 640px; }
    .brand-hero__badge { display: inline-flex; align-items: center; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; padding: 5px 12px; border-radius: 6px 2px 6px 2px; background: var(--bg-2); border: 1px solid var(--blue-border); color: var(--blue); transform: rotate(-1.2deg); margin-bottom: 14px; }
    .eco-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .eco-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r) 4px var(--r) 4px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; text-decoration: none; transition: border-color .2s, transform .2s, background .2s; }
    .eco-card:hover { border-color: var(--border-b); transform: translateY(-2px); background: var(--bg-3); }
    .eco-card__avatar { width: 36px; height: 36px; border-radius: 8px; background: var(--bg-3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-size: 11px; font-weight: 400; color: var(--blue); text-transform: uppercase; flex-shrink: 0; }
    .eco-card__body { flex: 1; min-width: 0; }
    .eco-card__industry { font-family: 'Courier Prime', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t3); margin-bottom: 2px; }
    .eco-card__name { font-size: 13px; font-weight: 700; color: var(--t1); line-height: 1.2; }
    @media(max-width:580px){ .eco-grid{grid-template-columns:1fr} }
    .brand-hero { position: relative; min-height: 420px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .brand-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }
    .brand-hero__bg-graphic svg { position: absolute; right: -6%; top: 50%; transform: translateY(-50%); width: 46%; max-width: 480px; opacity: .07; color: var(--pink); }
    .brand-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .brand-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }
    .brand-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }
    .brand-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }
    .brand-hero__back:hover { color: var(--blue); }
    .brand-hero__back svg { width: 14px; height: 14px; }
    .brand-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }
    .brand-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(34px, 6vw, 62px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .95; margin-bottom: 14px; }
    .brand-hero__slogan { font-family: 'Archivo', sans-serif; font-style: italic; font-size: 15px; color: var(--pink); font-weight: 600; max-width: 560px; line-height: 1.6; }
    .stat-block__pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    .wiki-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; background: var(--blue-dim); border: 1px solid var(--blue-border); border-radius: 99px; color: var(--blue); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; text-decoration: none; transition: background .18s, border-color .18s; }
    .wiki-pill:hover { background: rgba(224,120,95,.22); border-color: rgba(224,120,95,.5); }
    .wiki-pill svg { width: 11px; height: 11px; flex-shrink: 0; }
`;

function render(entry) {
  const { slug, titleParts, seo, heroBadge, heroSlogan, heroImage, heroIcon, statBlock, profileSection, ecoSection, sidebar } = entry;
  const canonical = `https://gtavitips.com/gameplay/brands/${slug}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]} <span style="color:var(--blue)">${titleParts[1]}</span>` : titleParts[0];

  const head = renderHead({
    title: seo.title,
    description: seo.description,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
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
    extraCss: BRAND_EXTRA_CSS,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="brand-hero__bg-img">`
    : `<div class="brand-hero__bg-graphic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6">${heroIcon}</svg></div>`;

  const hero = `  <header class="brand-hero">
    ${heroBackground}
    <div class="brand-hero__overlay" aria-hidden="true"></div>
    <div class="brand-hero__inner">
      <a href="/gameplay/brands" class="brand-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Brands Index
      </a>
      <div class="brand-hero__eyebrow">Brand File</div>${heroBadge ? `\n      <div class="brand-hero__badge">${heroBadge}</div>` : ''}
      <h1 class="brand-hero__h1">${h1}</h1>
      <p class="brand-hero__slogan">${renderInline(heroSlogan)}</p>
    </div>
  </header>
`;

  const statItemsHtml = statBlock
    .map((it) => {
      const sub = it.sub ? `\n            <div class="stat-block__sub">${renderInline(it.sub)}</div>` : '';
      const pills =
        it.pills && it.pills.length
          ? `\n            <div class="stat-block__pills">${it.pills
              .map(
                (p) =>
                  `<a href="${p.url}" target="_blank" rel="noopener noreferrer" class="wiki-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>${p.label}</a>`
              )
              .join('')}</div>`
          : '';
      return `          <div class="stat-block__item" role="listitem">
            <div class="stat-block__key">${it.key}</div>
            <div class="stat-block__val">${renderInline(it.value)}</div>${sub}${pills}
          </div>`;
    })
    .join('\n');

  const dossier = `  <div class="page">
    <div class="wrap">
      <div class="dossier">
        <div class="stat-block" role="list" aria-label="Brand stats">
${statItemsHtml}
        </div>
      </div>
    </div>
  </div>
`;

  const ecoHtml = ecoSection
    ? `
          <section class="section reveal" aria-labelledby="eco-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">${ecoSection.eyebrow}</span></div>
            <h2 class="section__h2" id="eco-hd">${ecoSection.heading}</h2>
            <div class="eco-grid" role="list">
              ${ecoSection.items
                .map(
                  (it) => `<a href="${it.url}" class="eco-card reveal" role="listitem">
                <div class="eco-card__avatar" aria-hidden="true">${it.avatarInitials}</div>
                <div class="eco-card__body">
                  <div class="eco-card__industry">${it.industry}</div>
                  <div class="eco-card__name">${it.name}</div>
                </div>
              </a>`
                )
                .join('\n              ')}
            </div>
          </section>
`
    : '';

  const main = `  <main id="main">
    <div class="wrap">
      <div class="content-grid">
        <div class="content-main">

          <section class="section reveal" aria-labelledby="profile-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">${profileSection.eyebrow}</span></div>
            <h2 class="section__h2" id="profile-hd">${profileSection.heading}</h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>
${ecoHtml}
        </div>
${renderSidebarBlocks(sidebar, 'Brand navigation')}
      </div>
    </div>
  </main>
`;

  return [
    head,
    renderNavAndSearch({ label: 'Brands', url: '/gameplay/brands' }),
    hero,
    dossier,
    main,
    FOOTER_HTML,
    SHARED_SCRIPT,
    COOKIE_BANNER_BLOCK,
  ].join('\n');
}

module.exports = { render, renderProse: renderBlock };
