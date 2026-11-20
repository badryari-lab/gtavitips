'use strict';

const {
  renderHead,
  renderNavAndSearch,
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
//
// Post-launch fields (Nov 2026, all optional; an entry without them renders exactly as before):
//   statSource: "GTA VI, in-game"  -> one plain source line under the stat block (credit, not a verdict)
//   storyArc: { intro, beats: [{ chapter, html }], source }
//     -> H2 "Story Arc" after Known Connections. intro is spoiler-light Markdown (who they are when the story
//        starts); each beat is a closed <details class="spoiler"> labelled "Spoiler: Chapter N" (chapter is a
//        number or a label such as "Prologue"). Same markup and CSS as build/faq/faq-gen.js, so the site has one
//        spoiler pattern. A page with a storyArc also gets the spoiler notice at the top and the spoiler CSS.
//   spoilerNote: "..." -> replaces the default top notice (used where the name itself is a heavy spoiler)
//   faq[i].spoiler: { chapter, html } -> a reveal under that answer; faqSchema stays separate and spoiler-free.
// Story text never reaches the JSON-LD or the meta/og descriptions: those only read the seo fields.

const SPOILER_NOTE = 'Light story spoilers on this page. The big moments sit behind a click, and nothing opens until you do.';
const SPOILER_CSS = `
    .spoiler-note { font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; line-height: 1.5; color: var(--amber); background: var(--amber-dim); border: 1px solid var(--amber-border); border-radius: 8px 2px 8px 2px; padding: 10px 14px; margin-bottom: 16px; }
    .spoiler { margin-top: 14px; background: var(--bg-3); border: 1px dashed var(--amber-border); border-radius: 8px 2px 8px 2px; }
    .spoiler > summary { list-style: none; cursor: pointer; min-height: 44px; padding: 10px 14px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; line-height: 1.4; color: var(--t2); }
    .spoiler > summary::-webkit-details-marker { display: none; }
    .spoiler > summary:focus-visible { outline: 2px solid var(--amber); outline-offset: 2px; }
    .spoiler__stamp { display: inline-block; padding: 4px 10px; color: var(--amber); background: var(--amber-dim); border: 1px solid var(--amber-border); border-radius: 6px 2px 6px 2px; transform: rotate(-1.2deg); }
    .spoiler__hint::after { content: ' +'; color: var(--amber); }
    .spoiler[open] .spoiler__hint::after { content: ' \\2212'; }
    .spoiler__body { padding: 2px 14px 14px; font-size: 13px; color: var(--t2); line-height: 1.75; }
    .spoiler__body p { margin-bottom: 0; }
    .spoiler__body p + p { margin-top: 10px; }
    .spoiler__body strong { color: var(--t1); font-weight: 600; }
    .faq-item__a .spoiler { margin-top: 12px; }
    .story-arc .spoiler + .spoiler { margin-top: 10px; }
    .story-arc__source, .stat-source { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-top: 14px; }
    .stat-source { margin-top: 12px; }`;
const STAT_SOURCE_CSS = `
    .stat-source { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-top: 12px; }`;

const spoilerLabel = (c) => (typeof c === 'number' ? `Chapter ${c}` : String(c));
function renderSpoiler(sp, ind) {
  if (!sp || sp.chapter === undefined || sp.chapter === '' || !(sp.html || sp.md)) throw new Error('spoiler needs chapter and html or md');
  // md: Markdown paragraphs (blank-line separated), same converter as the Dossier body; html: raw or inline text.
  const body = sp.md ? renderBlock(sp.md) : /^\s*<p[ >]/.test(sp.html) ? sp.html : `<p>${renderInline(sp.html)}</p>`;
  return `<details class="spoiler">
${ind}  <summary><span class="spoiler__stamp">Spoiler: ${spoilerLabel(sp.chapter)}</span> <span class="spoiler__hint">Tap to reveal</span></summary>
${ind}  <div class="spoiler__body">${body}</div>
${ind}</details>`;
}

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, heroImage, statBlock, gallery, connections, faq, faqSchema, sidebar, statSource, storyArc, spoilerNote } = entry;
  const hasSpoilers = !!(storyArc || (faq || []).some((f) => f.spoiler));
  const css = hasSpoilers
    ? entry.css.replace(/\s*$/, (ws) => SPOILER_CSS + ws)
    : statSource
    ? entry.css.replace(/\s*$/, (ws) => STAT_SOURCE_CSS + ws)
    : entry.css;
  const canonical = `https://gtavitips.com/gameplay/characters/${slug}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]} <span style="color:var(--blue)">${titleParts[1]}</span>` : titleParts[0];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.jsonLdName,
      name: seo.jsonLdName,
      about: { '@type': 'Thing', name: seo.jsonLdName },
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
      <h1 class="char-hero__h1">${h1}</h1>
      <p class="char-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const dossier = `<div class="page">
    <div class="wrap">
${hasSpoilers ? `      <p class="spoiler-note">${spoilerNote || SPOILER_NOTE}</p>\n` : ''}      ${renderStatBlock(statBlock, gallery, 'Character stats')}${statSource ? `\n      <p class="stat-source">Source: ${statSource}</p>` : ''}
  </div>
`;

  const storyArcHtml = storyArc
    ? `
          <section class="section story-arc reveal" aria-labelledby="story-arc-hd">
            <h2 class="section__h2" id="story-arc-hd">Story <span style="color:var(--blue)">Arc</span></h2>
            ${storyArc.intro ? `<div class="section__body">${renderBlock(storyArc.intro)}</div>\n            ` : ''}${storyArc.beats
              .map((b) => renderSpoiler(b, '            '))
              .join('\n            ')}${storyArc.source ? `\n            <p class="story-arc__source">Source: ${storyArc.source}</p>` : ''}
          </section>
`
    : '';

  const faqHtml = faq && faq.length
    ? `
          <section class="section reveal" aria-labelledby="faq-hd">
            <h2 class="section__h2" id="faq-hd">Frequently <span style="color:var(--blue)">Asked</span></h2>
            <div class="faq-list" role="list">
              ${faq
                .map(
                  (f) => `<details class="faq-item">
                <summary class="faq-item__q">${f.q}<svg class="faq-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
                <div class="faq-item__a">${renderInline(f.a)}${f.spoiler ? '\n                  ' + renderSpoiler(f.spoiler, '                  ') : ''}</div>
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
            <h2 class="section__h2" id="overview-hd">Dossier</h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>

          <section class="section reveal" aria-labelledby="connections-hd">
            <h2 class="section__h2" id="connections-hd">Known <span style="color:var(--blue)">Connections</span></h2>
            <div class="connections" role="list">
${renderConnectionsGridAvatar(connections)}
            </div>
          </section>
${storyArcHtml}${faqHtml}
        </div>

${renderSidebarBlocks(sidebar)}
      </div>
    </div>
  </main>
`;

  return [head, renderNavAndSearch(), hero, dossier, main, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK].join('\n');
}

module.exports = { render, renderProse: renderBlock, renderSpoiler, SPOILER_CSS, SPOILER_NOTE };
