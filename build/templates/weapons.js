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

// Weapons template. Confirmed 26/26 CSS-uniform; no page has a real hero
// photo (always gradient fallback), unlike vehicles/characters/factions.
// 3 fixed sections: Field Assessment (prose) -> Also Carried (connections)
// -> FAQ accordion (characters-style: JSON-LD FAQPage kept independent of
// the visible accordion's rich text, not derived from it).

const WEAPON_HERO_CSS = `
    .weapon-hero { position: relative; min-height: 400px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .weapon-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }
    .weapon-hero__bg-graphic svg { position: absolute; right: -6%; top: 50%; transform: translateY(-50%); width: 50%; max-width: 560px; opacity: .07; color: var(--pink); }
    .weapon-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.4) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .weapon-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.45) 55%, rgba(236,228,211,0) 100%); }
    .weapon-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }
    .weapon-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }
    .weapon-hero__back:hover { color: var(--blue); }
    .weapon-hero__back svg { width: 14px; height: 14px; }
    .weapon-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }
    .weapon-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(34px, 6vw, 62px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .95; margin-bottom: 14px; }
    .weapon-hero__h1 span { color: var(--blue); }
    .weapon-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }
    .weapon-hero__sub strong { color: var(--t1); font-weight: 600; }
    .faq-list { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-item:last-child { border-bottom: none; }
    .faq-item__q { list-style: none; cursor: pointer; padding: 18px 22px; font-size: 14px; font-weight: 700; color: var(--t1); line-height: 1.4; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
    .faq-item__q::-webkit-details-marker { display: none; }
    .faq-item__chevron { width: 15px; height: 15px; flex-shrink: 0; color: var(--t3); transition: transform .2s; }
    .faq-item[open] .faq-item__chevron { transform: rotate(180deg); }
    .faq-item__a { padding: 0 22px 18px; font-size: 13px; color: var(--t2); line-height: 1.75; }
`;

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, statBlock, gallery, connections, faq, faqSchema, sidebarDatabase, sidebarExplore } = entry;
  const canonical = `https://gtavitips.com/gameplay/weapons/${slug}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]} <span>${titleParts[1]}</span>` : titleParts[0];

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
    ogImagePlaceholder: seo.ogImagePlaceholder,
    canonical,
    jsonLd,
    extraCss: WEAPON_HERO_CSS,
  });

  const hero = `  <header class="weapon-hero">
    <div class="weapon-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>
    </div>
    <div class="weapon-hero__overlay" aria-hidden="true"></div>
    <div class="weapon-hero__inner">
      <a href="/gameplay/weapons" class="weapon-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Weapons
      </a>
      <div class="weapon-hero__eyebrow">Weapon File</div>
      <h1 class="weapon-hero__h1">${h1}</h1>
      <p class="weapon-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const dossier = `  <div class="page">
    <div class="wrap">
${renderStatBlock(statBlock, gallery, 'Weapon stats')}
    </div>
  </div>
`;

  const faqHtml = faq && faq.length
    ? `
          <section class="section reveal" aria-labelledby="faq-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Frequently Asked</span></div>
            <h2 class="section__h2" id="faq-hd">Frequently <span style="color:var(--blue)">Asked</span></h2>
            <div class="faq-list">
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

          <section class="section reveal" aria-labelledby="assessment-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Weapon Intelligence</span></div>
            <h2 class="section__h2" id="assessment-hd">Field <span style="color:var(--blue)">Assessment</span></h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>

          <section class="section reveal" aria-labelledby="related-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Filed Connections</span></div>
            <h2 class="section__h2" id="related-hd">Also <span style="color:var(--blue)">Carried</span></h2>
            <div class="connected-grid" role="list">
              ${renderConnectionsGrid(connections)}
            </div>
          </section>
${faqHtml}
        </div>
${renderSidebar('Weapon Database', sidebarDatabase, sidebarExplore, 'Weapon navigation')}
      </div>
    </div>
  </main>
`;

  return [
    head,
    renderNavAndSearch({ label: 'Weapons', url: '/gameplay/weapons' }),
    hero,
    dossier,
    main,
    FOOTER_HTML,
    SHARED_SCRIPT,
    COOKIE_BANNER_BLOCK,
  ].join('\n');
}

module.exports = { render, renderProse: renderBlock };
