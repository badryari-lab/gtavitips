'use strict';

const {
  renderHead,
  renderNavAndSearch,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderConnectionsGrid,
  renderSidebarBlocks,
  renderStatBlock,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');
const CSS_ANIMALS = require('./_css-animals');

// Animals template. Confirmed 32/32 CSS-uniform, but on the same older
// (pre-Anton) generation as characters/locations — per-category shared CSS
// (_css-animals.js), not the vehicles baseline. Type-label conn-cards like
// vehicles/weapons/factions (not characters'/activities' avatar style).
// Sidebar titles are "Primary Habitat" / "Wildlife Index" — neither matches
// renderSidebar's hardcoded "Explore Database", so uses renderSidebarBlocks.
// Dossier has the same optional gallery variant as vehicles (6/32 entries,
// exactly the ones with a hero photo). Stat items can carry an optional
// "speculation" badge (12/32 entries) for unconfirmed specs.

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, heroImage, statBlock, gallery, connections, faq, sidebar } = entry;
  const canonical = `https://gtavitips.com/gameplay/animals/${slug}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]} <span style="color:var(--blue)">${titleParts[1]}</span>` : titleParts[0];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.jsonLdHeadline,
      description: seo.jsonLdDescription,
      url: canonical,
      dateModified: seo.dateModified,
      publisher: { '@type': 'Organization', name: 'GTAVITIPS', url: 'https://gtavitips.com' },
    },
  ];
  if (faq && faq.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.aPlain || f.a } })),
    });
  }

  const head = renderHead({
    title: seo.title,
    description: seo.description,
    ogDescription: seo.ogDescription,
    canonical,
    jsonLd,
    fullCss: CSS_ANIMALS,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="animal-hero__bg-img">`
    : `<div class="animal-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><circle cx="12" cy="15" r="4.5"/><circle cx="5.5" cy="7.5" r="2.3"/><circle cx="10" cy="4" r="2.3"/><circle cx="14" cy="4" r="2.3"/><circle cx="18.5" cy="7.5" r="2.3"/></svg>
    </div>`;

  const hero = `  <header class="animal-hero">
    ${heroBackground}
    <div class="animal-hero__overlay" aria-hidden="true"></div>
    <div class="animal-hero__inner">
      <a href="/gameplay/animals" class="animal-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Wildlife Index
      </a>
      <div class="animal-hero__eyebrow">Animal File</div>
      <h1 class="animal-hero__h1">${h1}</h1>
      <p class="animal-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const dossier = `  <div class="page">
    <div class="wrap">
${renderStatBlock(statBlock, gallery, 'Species stats')}
    </div>
  </div>
`;

  const faqHtml = faq && faq.length
    ? `
          <section class="section reveal" aria-labelledby="faq-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Common Questions</span></div>
            <h2 class="section__h2" id="faq-hd">Frequently <span style="color:var(--blue)">Asked</span></h2>
            <div class="faq-list" role="list">
              ${faq
                .map(
                  (f) => `<details class="faq-item">
                <summary class="faq-item__q">${f.q}<svg class="faq-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
                <div class="faq-item__a">${renderInline(f.a)}</div>
              </details>`
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
          <section class="section reveal" aria-labelledby="field-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Field Assessment</span></div>
            <h2 class="section__h2" id="field-hd">Behavior and <span style="color:var(--blue)">Threat Profile</span></h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>
          <section class="section reveal" aria-labelledby="species-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Leonida Wildlife</span></div>
            <h2 class="section__h2" id="species-hd">Related <span style="color:var(--blue)">Species</span></h2>
            <div class="connected-grid" role="list">
              ${renderConnectionsGrid(connections)}
            </div>
          </section>
${faqHtml}
        </div>
${renderSidebarBlocks(sidebar, 'Species navigation')}
      </div>
    </div>
  </main>
`;

  return [
    head,
    renderNavAndSearch(),
    hero,
    dossier,
    main,
    FOOTER_HTML,
    SHARED_SCRIPT,
    COOKIE_BANNER_BLOCK,
  ].join('\n');
}

module.exports = { render, renderProse: renderBlock };
