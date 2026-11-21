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
const { MISSION_CSS } = require('./missions');
const { STAT_SOURCE_CSS } = require('./_spoiler');

// Collectibles template (Nov 2026): one page per collectible TYPE (not per item), /gameplay/collectibles/<slug>.
// Data: build/data/collectibles/<slug>.md. Hub: node build/collectibles/collectibles-hub.js. Spoiler-free (layer 1):
// unlocks are given as a chapter, never a mission name. Reuses the mission page CSS generation (canonical Tropical Deco).
//
// Frontmatter fields:
//   name, titleParts [a, b?], count, cardDesc (<=90 chars, hub card + search), order (hub sort)
//   seo { title, description, dateModified }   heroSubtitle   heroImage? { src, alt, width, height }
//   statBlock [{ key, value, sub? }]   statSource ("GTA VI, in-game")
//   items [{ area, county, locationUrl?, hint }]   -> Locations table, grouped by county in data order, numbered 1..N
//   itemsNote? (one line above the table, e.g. how the game numbers them)
//   tips [md], missables [md]   walkthrough? { youtubeId, title, creator, channelUrl, start? }
//   connections [{ url, name, desc, avatarInitials | avatarImage }]   faq [{ q, a }] (plain, spoiler-free; also FAQPage JSON-LD)
// Markdown body = "How It Works".

const DATA_DIR = path.join(__dirname, '..', 'data', 'collectibles');
let _all = null;
function allCollectibles() {
  if (_all) return _all;
  if (!fs.existsSync(DATA_DIR)) return (_all = []);
  _all = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
      const d = JSON.parse(raw.slice(0, raw.indexOf('\n---\n')).trim());
      return { slug: d.slug || f.replace(/\.md$/, ''), name: d.name, count: d.count, cardDesc: d.cardDesc, order: d.order || 99, seoDescription: d.seo.description, items: d.items || [] };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return _all;
}
const typeUrl = (slug) => `/gameplay/collectibles/${slug}`;

const COLLECTIBLE_CSS = `
    .loc-county { font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--pink); margin: 26px 0 10px; }
    .loc-county:first-of-type { margin-top: 6px; }
    .loc-table { width: 100%; border-collapse: collapse; font-size: 13px; color: var(--t2); line-height: 1.6; border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
    .loc-table th { text-align: left; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); background: var(--bg-2); padding: 10px 14px; border-bottom: 1px solid var(--border); }
    .loc-table td { padding: 11px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
    .loc-table tr:last-child td { border-bottom: none; }
    .loc-table td:first-child { font-family: 'Courier Prime', monospace; font-weight: 700; color: var(--blue); width: 48px; }
    .loc-table td:nth-child(2) { color: var(--t1); font-weight: 600; width: 30%; }
    .loc-table a { color: var(--blue); }
    .loc-note { font-size: 13px; color: var(--t3); margin-bottom: 4px; }
    @media (max-width: 480px) { .loc-table td:nth-child(2) { width: auto; } .loc-table th, .loc-table td { padding: 9px 10px; } }
`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plain = (s) => String(s).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '');

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

function renderLocations(items, note) {
  const counties = [...new Set(items.map((i) => i.county || 'Leonida'))];
  let n = 0;
  const blocks = counties.map((c) => {
    const rows = items.filter((i) => (i.county || 'Leonida') === c).map((i) => {
      n++;
      const area = i.locationUrl ? `<a href="${i.locationUrl}">${i.area}</a>` : i.area;
      return `                <tr><td>${n}</td><td>${area}</td><td>${renderInline(i.hint)}</td></tr>`;
    }).join('\n');
    return `            <div class="loc-county">${c}</div>
            <table class="loc-table">
              <thead><tr><th scope="col">#</th><th scope="col">Area</th><th scope="col">Where to look</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>`;
  }).join('\n');
  return `
          <section class="section reveal" aria-labelledby="locations-hd">
            <h2 class="section__h2" id="locations-hd">All ${items.length} <span style="color:var(--blue)">Locations</span></h2>${note ? `\n            <p class="loc-note">${renderInline(note)}</p>` : ''}
${blocks}
          </section>
`;
}

function render(entry) {
  const { slug, titleParts, seo, heroSubtitle, heroImage, statBlock, statSource, items, itemsNote, tips, missables, walkthrough, connections, faq } = entry;
  const canonical = `https://gtavitips.com${typeUrl(slug)}`;
  const h1 = titleParts.length > 1 ? `${titleParts[0]}<span style="color:var(--blue)">${titleParts[1]}</span>` : titleParts[0];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title.replace(/\s*\|.*$/, ''),
      description: seo.description,
      url: canonical,
      dateModified: seo.dateModified,
      about: { '@type': 'VideoGame', name: 'Grand Theft Auto VI' },
      publisher: { '@type': 'Organization', name: 'GTAVITIPS', url: 'https://gtavitips.com' },
      ...(items && items.length
        ? { mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: `${entry.name} ${i + 1}: ${it.area}` })) } }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Database', item: 'https://gtavitips.com/gameplay' },
        { '@type': 'ListItem', position: 2, name: 'Collectibles', item: 'https://gtavitips.com/gameplay/collectibles' },
        { '@type': 'ListItem', position: 3, name: entry.name, item: canonical },
      ],
    },
  ];
  if (faq && faq.length) {
    jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })) });
  }

  const head = renderHead({ title: seo.title, description: seo.description, ogImage: seo.ogImage, canonical, jsonLd, extraCss: MISSION_CSS + STAT_SOURCE_CSS + COLLECTIBLE_CSS });

  const heroBackground = heroImage
    ? `<img src="${heroImage.src}" alt="${esc(heroImage.alt)}" width="${heroImage.width}" height="${heroImage.height}" loading="eager" class="mission-hero__bg-img">`
    : `<div class="mission-hero__bg-graphic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6"><path d="M12 2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 16.8 6.1 20l1.3-6.5L2.5 8.9l6.6-.8z"/></svg>
    </div>`;

  const hero = `  <header class="mission-hero">
    ${heroBackground}
    <div class="mission-hero__overlay" aria-hidden="true"></div>
    <div class="mission-hero__inner">
      <a href="/gameplay/collectibles" class="mission-hero__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Collectibles
      </a>
      <h1 class="mission-hero__h1">${h1}</h1>
      <p class="mission-hero__sub">${renderInline(heroSubtitle)}</p>
    </div>
  </header>
`;

  const statItemsHtml = statBlock
    .map((it) => `          <div class="stat-block__item" role="listitem">
            <div class="stat-block__key">${it.key}</div>
            <div class="stat-block__val">${renderInline(it.value)}</div>${it.sub ? `\n            <div class="stat-block__sub">${renderInline(it.sub)}</div>` : ''}
          </div>`)
    .join('\n');

  const dossier = `  <div class="page">
    <div class="wrap">
      <div class="dossier">
        <div class="stat-block" role="list" aria-label="Collectible stats">
${statItemsHtml}
        </div>${statSource ? `\n        <p class="stat-source">Source: ${statSource}</p>` : ''}
      </div>
    </div>
  </div>
`;

  const videoHtml = walkthrough
    ? `
          <section class="section reveal" aria-labelledby="walkthrough-hd">
            <h2 class="section__h2" id="walkthrough-hd">Video Guide</h2>
            <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${walkthrough.youtubeId}${walkthrough.start ? `?start=${walkthrough.start}` : ''}" title="${esc(walkthrough.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
            <p class="video-credit">Video by <a href="${walkthrough.channelUrl}" target="_blank" rel="noopener">${walkthrough.creator}</a> on YouTube</p>
          </section>
`
    : '';

  const connHtml = connections && connections.length
    ? `
          <section class="section reveal" aria-labelledby="connections-hd">
            <h2 class="section__h2" id="connections-hd">Known Connections</h2>
            <div class="connections" role="list">
${renderConnectionsGridAvatar(connections)}
            </div>
          </section>
`
    : '';

  const faqHtml = faq && faq.length
    ? `
          <section class="section reveal" aria-labelledby="faq-hd">
            <h2 class="section__h2" id="faq-hd">Frequently Asked</h2>
            <div class="faq-list">
              ${faq.map((f) => `<details class="faq-item">
                <summary class="faq-q">${f.q}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></summary>
                <div class="faq-a">${renderInline(f.a)}</div>
              </details>`).join('\n              ')}
            </div>
          </section>
`
    : '';

  const sidebar = renderSidebarBlocks(
    [
      { title: 'Collectibles', items: allCollectibles().map((c) => ({ label: c.slug === slug ? `<strong>${c.name}</strong>` : c.name, url: typeUrl(c.slug) })) },
      { title: 'Explore Database', items: [
        { label: 'All Collectibles', url: '/gameplay/collectibles' },
        { label: '100% Completion', url: '/faq/gta-6-100-percent-completion' },
        { label: 'Locations', url: '/gameplay/locations' },
        { label: 'Leonida Map', url: '/map' },
      ] },
    ],
    'Collectible navigation'
  );

  const main = `  <main id="main">
    <div class="wrap">
      <div class="content-grid">
        <div class="content-main">

          <section class="section reveal" aria-labelledby="how-hd">
            <h2 class="section__h2" id="how-hd">How It Works</h2>
            <div class="section__body">${entry.proseHtml}</div>
          </section>
${items && items.length ? renderLocations(items, itemsNote) : ''}${listSection('tips-hd', 'Tips', tips)}${listSection('missables-hd', 'Missables', missables)}${videoHtml}${connHtml}${faqHtml}
        </div>
${sidebar}
      </div>
    </div>
  </main>
`;

  return [head, renderNavAndSearch({ label: 'Collectibles', url: '/gameplay/collectibles' }), hero, dossier, main, FOOTER_HTML, SHARED_SCRIPT, COOKIE_BANNER_BLOCK].join('\n');
}

// Reverse links for location pages: spoiler-free line listing collectible counts found there.
function renderCollectiblesHere(url) {
  const hits = allCollectibles()
    .map((c) => ({ c, n: c.items.filter((i) => i.locationUrl === url).length }))
    .filter((x) => x.n);
  if (!hits.length) return '';
  return hits.map((x) => `<a href="${typeUrl(x.c.slug)}#locations-hd" style="color:var(--blue)">${x.n} ${x.n === 1 ? x.c.name.replace(/s$/, '') : x.c.name}</a>`).join(', ');
}

module.exports = { render, renderProse: renderBlock, allCollectibles, typeUrl, renderCollectiblesHere, COLLECTIBLE_CSS };
