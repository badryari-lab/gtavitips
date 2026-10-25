'use strict';

const {
  renderHead,
  renderNavAndSearch,
  FOOTER_HTML,
  SHARED_SCRIPT,
  COOKIE_BANNER_BLOCK,
  renderConnectionsGridAvatar,
  renderSidebar,
} = require('./_shared');
const { renderBlock, renderInline } = require('./_markdown');

// Activities template — matches CLAUDE.md's documented approved template
// exactly (reference file weightlifting/index.html). Confirmed 32/32
// CSS-uniform, canonical Anton style; all 32 have a real hero photo (no
// gradient-fallback variant seen, but one is still supported defensively).
// Distinct from other categories: dossier has NO gallery column (plain
// block, not a grid), "Known Connections"/"Frequently Asked" headings are
// PLAIN text (no blue-span half), and FAQ markup uses .faq-q/.faq-a class
// names (not .faq-item__q/.faq-item__a like characters/weapons/locations).

const ACTIVITY_EXTRA_CSS = `
    .dossier { margin: 32px 0 56px; display: block; }
    .dossier .stat-block { max-width: 640px; }
    .connections { display: flex; flex-direction: column; gap: 8px; }
    .conn-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--r) 4px var(--r) 4px; padding: 16px 18px; display: flex; align-items: center; gap: 16px; text-decoration: none; transition: border-color .2s, transform .2s, background .2s; }
    .conn-card:hover { border-color: var(--border-b); transform: translateX(4px); background: var(--bg-3); }
    .conn-card__avatar { width: 56px; height: 56px; border-radius: 8px; background: var(--bg-3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-size: 15px; font-weight: 400; color: var(--blue); text-transform: uppercase; flex-shrink: 0; }
    .conn-card__body { flex: 1; min-width: 0; }
    .conn-card__role { font-family: 'Courier Prime', monospace; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .10em; color: var(--pink); margin-bottom: 3px; }
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
    .reveal.d3 { transition-delay: .21s; }
    .activity-hero { position: relative; min-height: 420px; display: flex; align-items: flex-end; padding-top: var(--nav-h); overflow: hidden; border-bottom: 1px solid var(--border); }
    .activity-hero__bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 35%; z-index: 0; }
    .activity-hero__bg-graphic { position: absolute; inset: 0; background: linear-gradient(155deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg) 100%); overflow: hidden; }
    .activity-hero__bg-graphic svg { position: absolute; right: -6%; top: 50%; transform: translateY(-50%); width: 50%; max-width: 520px; opacity: .07; color: var(--pink); }
    .activity-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%); z-index: 1; }
    [data-theme="light"] .activity-hero__overlay { background: linear-gradient(to top, var(--bg) 0%, rgba(236,228,211,.6) 55%, rgba(236,228,211,0) 100%); }
    .activity-hero__inner { position: relative; z-index: 2; max-width: 1120px; margin: 0 auto; padding: 0 28px 34px; width: 100%; }
    .activity-hero__back { display: inline-flex; align-items: center; gap: 7px; font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--t2); margin-bottom: 18px; transition: color .18s; text-decoration: none; }
    .activity-hero__back:hover { color: var(--blue); }
    .activity-hero__back svg { width: 14px; height: 14px; }
    .activity-hero__eyebrow { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--pink); margin-bottom: 14px; }
    .activity-hero__h1 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(38px, 6vw, 68px); text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: .92; margin-bottom: 14px; }
    .activity-hero__h1 span { color: var(--blue); }
    .activity-hero__sub { font-size: 15px; color: var(--t2); max-width: 560px; line-height: 1.65; }
    .activity-hero__sub strong { color: var(--t1); font-weight: 600; }
`;

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, heroImage, statBlock, connections, faq, sidebarDatabase, sidebarExplore } = entry;
  const canonical = `https://gtavitips.com/gameplay/activities/${slug}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]}<span style="color:var(--blue)">${titleParts[1]}</span>` : titleParts[0];

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
    ogImage: seo.ogImage,
    canonical,
    jsonLd,
    extraCss: ACTIVITY_EXTRA_CSS,
  });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="activity-hero__bg-img">`
    : `<div class="activity-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>
    </div>`;

  const hero = `  <header class="activity-hero">
    ${heroBackground}
    <div class="activity-hero__overlay" aria-hidden="true"></div>
    <div class="activity-hero__inner">
      <a href="/gameplay/activities" class="activity-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Activities
      </a>
      <div class="activity-hero__eyebrow">Activity File</div>
      <h1 class="activity-hero__h1">${h1}</h1>
      <p class="activity-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const statItemsHtml = statBlock
    .map(
      (it) => `          <div class="stat-block__item" role="listitem">
            <div class="stat-block__key">${it.key}</div>
            <div class="stat-block__val">${renderInline(it.value)}</div>${
        it.sub ? `\n            <div class="stat-block__sub">${renderInline(it.sub)}</div>` : ''
      }
          </div>`
    )
    .join('\n');

  const dossier = `  <div class="page">
    <div class="wrap">
      <div class="dossier">
        <div class="stat-block" role="list" aria-label="Activity stats">
${statItemsHtml}
        </div>
      </div>
    </div>
  </div>
`;

  const faqHtml = faq && faq.length
    ? `
          <section class="section reveal" aria-labelledby="faq-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Frequently Asked</span></div>
            <h2 class="section__h2" id="faq-hd">Frequently Asked</h2>
            <div class="faq-list">
              ${faq
                .map(
                  (f) => `<details class="faq-item">
                <summary class="faq-q">${f.q}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
                <div class="faq-a">${renderInline(f.a)}</div>
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
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Activity Overview</span></div>
            <h2 class="section__h2" id="overview-hd">Dossier</h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>

          <section class="section reveal" aria-labelledby="connections-hd">
            <div class="section__eyebrow" aria-hidden="true"><div class="section__eyebrow-line"></div><span class="section__eyebrow-text">Filed Connections</span></div>
            <h2 class="section__h2" id="connections-hd">Known Connections</h2>
            <div class="connections" role="list">
${renderConnectionsGridAvatar(connections)}
            </div>
          </section>
${faqHtml}
        </div>
${renderSidebar('Activities Index', sidebarDatabase, sidebarExplore, 'Activity navigation')}
      </div>
    </div>
  </main>
`;

  return [
    head,
    renderNavAndSearch({ label: 'Activities', url: '/gameplay/activities' }),
    hero,
    dossier,
    main,
    FOOTER_HTML,
    SHARED_SCRIPT,
    COOKIE_BANNER_BLOCK,
  ].join('\n');
}

module.exports = { render, renderProse: renderBlock };
