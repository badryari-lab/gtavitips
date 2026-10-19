'use strict';

const {
  renderHead,
  NAV_AND_SEARCH_HTML,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderStatBlock,
  renderConnectionsGridAvatar,
  renderSidebarBlocks,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');

// Character template. CSS is kept PER-ENTRY (entry.css, byte-extracted from
// that entry's own live page) rather than one shared category stylesheet —
// characters turned out NOT to be CSS-uniform the way vehicles was: 20/21
// pages run an older, never-migrated typography generation (no Anton on
// headings, font-weight 700, different nav color) while jason-duval alone
// already has the correct Tropical Deco style. Using one shared reference
// would have silently regressed whichever page(s) don't match it. This
// faithfully reproduces each page's current reality; unifying everyone to
// the CLAUDE.md-documented standard is a separate, flagged design decision.

function render(entry) {
  const { slug, css, titleParts, seo, heroSubtitle, heroImage, statBlock, gallery, connections, faq, faqSchema, sidebar } = entry;
  const canonical = `https://gtavitips.com/gameplay/characters/${slug}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]} <span style="color:var(--blue)">${titleParts[1]}</span>` : titleParts[0];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGameCharacter',
      name: seo.jsonLdName,
      description: seo.jsonLdDescription,
      url: canonical,
      dateModified: seo.dateModified,
      publisher: { '@type': 'Organization', name: 'GTAVITIPS', url: 'https://gtavitips.com' },
    },
  ];
  if (faqSchema && faqSchema.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqSchema.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.aPlain },
      })),
    });
  }

  const head = renderHead({
    title: seo.title,
    description: seo.description,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
    canonical,
    jsonLd,
    fullCss: css,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="char-hero__bg-img">`
    : `<div class="char-hero__bg-graphic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg></div>`;

  const hero = `    <header class="char-hero">
    ${heroBackground}
    <div class="char-hero__overlay" aria-hidden="true"></div>
    <div class="char-hero__inner">
      <a href="/gameplay/characters" class="char-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Character Profiles
      </a>
      <div class="char-hero__eyebrow">Character File</div>
      <h1 class="char-hero__h1">${h1}</h1>
      <p class="char-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const dossier = `<div class="page">
    <div class="wrap">
      ${renderStatBlock(statBlock, gallery, 'Character stats')}
  </div>
`;

  const faqHtml = faq && faq.length
    ? `
          <section class="section reveal" aria-labelledby="faq-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Frequently Asked</span></div>
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

          <section class="section reveal" aria-labelledby="overview-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Profile Overview</span></div>
            <h2 class="section__h2" id="overview-hd">Dossier</h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>

          <section class="section reveal" aria-labelledby="connections-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Filed Relationships</span></div>
            <h2 class="section__h2" id="connections-hd">Known <span style="color:var(--blue)">Connections</span></h2>
            <div class="connections" role="list">
${renderConnectionsGridAvatar(connections)}
            </div>
          </section>
${faqHtml}
        </div>

${renderSidebarBlocks(sidebar)}
      </div>
    </div>
  </main>
`;

  return [head, NAV_AND_SEARCH_HTML, hero, dossier, main, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK].join('\n');
}

module.exports = { render, renderProse: renderBlock };
