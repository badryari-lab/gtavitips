'use strict';

const {
  renderHead,
  renderNavAndSearch,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderStatBlock,
  renderConnectionsGrid,
  renderSidebarBlocks,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');
const CSS_LOCATIONS = require('./_css-locations');

// Locations template. Confirmed 25/25 CSS-uniform (safe for one shared
// fragment, like vehicles/weapons/factions — unlike characters). Richer
// structure than those categories: two prose sections (Leonida Profile ->
// On the Ground) plus an optional "Operator Notes" key/value grid between
// them, then connections, then FAQ (heading is "Common Questions" here —
// confirmed 25/25, a genuine category convention, not drift).

function renderOperatorNotes(items) {
  if (!items || !items.length) return '';
  return `      <div class="operator-notes reveal" aria-label="Field operator notes">
        <div class="operator-notes__label" aria-hidden="true">Field Intel</div>
        <div class="operator-notes__grid">
${items
  .map(
    (it) => `          <div class="operator-notes__item"><div class="operator-notes__item-key">${it.key}</div><div class="operator-notes__item-val">${renderInline(it.val)}</div></div>`
  )
  .join('\n')}
        </div>
      </div>
`;
}

function render(entry) {
  const {
    slug,
    titleParts,
    seo,
    heroSubtitle,
    heroImage,
    statBlock,
    profileProse,
    operatorNotes,
    groundProse,
    connections,
    faq,
    sidebar,
    sidebarAriaLabel,
  } = entry;
  const canonical = `https://gtavitips.com/gameplay/locations/${slug}`;
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
    ogImagePlaceholder: seo.ogImagePlaceholder,
    canonical,
    jsonLd,
    fullCss: CSS_LOCATIONS,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="location-hero__bg-img">`
    : `<div class="location-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
    </div>`;

  const hero = `    <header class="location-hero">
    ${heroBackground}
    <div class="location-hero__overlay" aria-hidden="true"></div>
    <div class="location-hero__inner">
      <a href="/gameplay/locations" class="location-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Locations Index
      </a>
      <div class="location-hero__eyebrow">Location File</div>
      <h1 class="location-hero__h1">${h1}</h1>
      <p class="location-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const dossier = `<div class="page"><div class="wrap">
${renderStatBlock(statBlock, null, 'Location stats')}
      </div></div>
`;

  const faqHtml = faq && faq.length
    ? `      <section class="section reveal" aria-labelledby="faq-hd">
        <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Common Questions</span></div>
        <h2 class="section__h2" id="faq-hd">Common <span style="color:var(--blue)">Questions</span></h2>
        <div class="faq-list" role="list">
          ${faq
            .map(
              (f) => `<details class="faq-item">
<summary class="faq-item__q">${f.q}<svg class="faq-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
<div class="faq-item__a">${renderInline(f.a)}</div>
</details>`
            )
            .join('\n          ')}
        </div>
      </section>
`
    : '';

  const main = `  <main id="main"><div class="wrap"><div class="content-grid">
    <div class="content-main">
      <section class="section reveal" aria-labelledby="overview-hd">
        <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Location Overview</span></div>
        <h2 class="section__h2" id="overview-hd">Leonida <span style="color:var(--blue)">Profile</span></h2>
        <div class="section__body">${profileProse}</div>
      </section>
${renderOperatorNotes(operatorNotes)}      <section class="section reveal" aria-labelledby="field-hd">
        <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Tactical Assessment</span></div>
        <h2 class="section__h2" id="field-hd">On the <span style="color:var(--blue)">Ground</span></h2>
        <div class="section__body">${groundProse}</div>
      </section>
      <section class="section reveal" aria-labelledby="connected-hd">
        <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Cross-Reference</span></div>
        <h2 class="section__h2" id="connected-hd">What's <span style="color:var(--blue)">Connected</span></h2>
        <div class="connected-grid" role="list">          ${renderConnectionsGrid(connections)}</div>
${faqHtml}    </div>
    ${renderSidebarBlocks(sidebar, sidebarAriaLabel)}
  </div></div></main>
`;

  return [
    head,
    renderNavAndSearch({ label: 'Locations', url: '/gameplay/locations' }),
    hero,
    dossier,
    main,
    FOOTER_HTML,
    SHARED_SCRIPT,
    COOKIE_BANNER_BLOCK,
  ].join('\n');
}

// Two independent prose bodies: the data file's Markdown body holds both,
// separated by a "%%%GROUND%%%" marker line (see extract-locations.js).
function renderProse(body) {
  const [profile, ground] = body.split('\n%%%GROUND%%%\n');
  return { profileProse: renderBlock(profile), groundProse: renderBlock(ground || '') };
}

module.exports = { render, renderProse };
