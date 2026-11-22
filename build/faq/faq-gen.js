// FAQ page generator (Nov 2026). Builds hub/faq/<slug>/index.html from a spec, using an existing FAQ page as the shell
// (head CSS, nav, footer, scripts stay identical to the shell), then updates the FAQ index, search-index and sitemap.
// Output is plain static HTML, still hand-editable afterwards.
// Usage (repo root): node build/faq/faq-gen.js build/faq/<specs>.js [--dry]
// Spec: { slug, q, h1, desc, source, answer:[html paragraphs], related:[{q, html, source, badge?}], more:[slug...],
//         card:{label, big, sub}, intel:[[href,label]...], index:{section, short, source?, replaces?} }
// Spoilers (Nov 2026, see CLAUDE.md "Spoilers"): an answer entry can be {spoiler:{chapter, html}} instead of a string, and a
// related item can carry spoiler:{chapter, html} after its spoiler-free html. Each renders as a native <details class="spoiler">
// click-to-reveal; chapter is a number ("Chapter 4") or a label ("Prologue"). Pages with a spoiler get a notice at the top and
// the spoiler CSS once in <head>; their FAQPage JSON-LD keeps only the spoiler-free text plus SPOILER_LD. Pages without
// spoilers come out exactly as before.
const fs = require('fs'), path = require('path');
const { clean } = require("./sources.js"); // never credit competitor guide sites
const ROOT = process.cwd(), DRY = process.argv.includes('--dry');
const TODAY = new Date().toISOString().slice(0, 10); // sitemap lastmod (was hardcoded 2026-11-20)
const specs = require(path.resolve(process.argv[2]));
const SHELL = 'hub/faq/when-does-gta-6-release/index.html';
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');
const wr = (p, s) => { if (DRY) return; fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };
const strip = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8594;/g, '').replace(/\s+/g, ' ').trim();
const escAttr = s => s.replace(/"/g, '&quot;');
const titles = Object.fromEntries(fs.readdirSync(path.join(ROOT, 'hub/faq'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => { const t = rd(`hub/faq/${d.name}/index.html`).match(/<title>([^<|]+)/); return [d.name, t ? t[1].trim() : d.name]; }));
specs.forEach(s => titles[s.slug] = s.q);
const shell = rd(SHELL);
const head0 = shell.slice(0, shell.indexOf('<main id="main">')), tail0 = shell.slice(shell.indexOf('  </main>'));
const news = JSON.parse(rd('hub/assets/data/news.json')).articles;
const problems = [], pages = [];
const SPOILER_LD = 'The full answer is on the page behind a spoiler warning.';
const SPOILER_NOTE = 'Story spoilers sit behind a click. Nothing opens until you do.';
const SPOILER_CSS = `
    .spoiler-note { font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; line-height: 1.5; color: var(--amber); background: var(--amber-dim); border: 1px solid var(--amber-border); border-radius: 8px 2px 8px 2px; padding: 10px 14px; margin-bottom: 16px; }
    .spoiler { margin-top: 14px; background: var(--bg-3); border: 1px dashed var(--amber-border); border-radius: 8px 2px 8px 2px; }
    .answer-card__answer .spoiler { margin-bottom: 14px; }
    .answer-card__answer .spoiler:last-child { margin-bottom: 0; }
    .spoiler > summary { list-style: none; cursor: pointer; min-height: 44px; padding: 10px 14px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; line-height: 1.4; color: var(--t2); }
    .spoiler > summary::-webkit-details-marker { display: none; }
    .spoiler > summary:focus-visible { outline: 2px solid var(--amber); outline-offset: 2px; }
    .spoiler__stamp { display: inline-block; padding: 4px 10px; color: var(--amber); background: var(--amber-dim); border: 1px solid var(--amber-border); border-radius: 6px 2px 6px 2px; transform: rotate(-1.2deg); }
    .spoiler__hint::after { content: ' +'; color: var(--amber); }
    .spoiler[open] .spoiler__hint::after { content: ' \\2212'; }
    .spoiler__body { padding: 2px 14px 14px; font-size: 13px; color: var(--t2); line-height: 1.75; }
    .spoiler__body p { margin-bottom: 0; }
    .spoiler__body p + p { margin-top: 10px; }
    .spoiler__body strong { color: var(--t1); font-weight: 600; }`;
// Tables (Nov 22 2026, safe codes page): an answer entry {table:{title, head:[...], rows:[[...]]}} renders an H2 plus a
// scrollable table; cells are HTML. Tables stay out of the JSON-LD (the plain answer paragraphs carry the summary).
const TABLE_CSS = `
    .answer-card__answer .code-h2 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: 20px; text-transform: uppercase; letter-spacing: 0; color: var(--t1); line-height: 1.2; margin: 26px 0 10px; }
    .code-table-wrap { overflow-x: auto; margin-bottom: 14px; border: 1px solid var(--border); border-radius: 8px 2px 8px 2px; }
    .code-table { width: 100%; border-collapse: collapse; font-size: 13px; color: var(--t2); line-height: 1.6; }
    .code-table th { text-align: left; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); background: var(--bg-2); padding: 10px 14px; border-bottom: 1px solid var(--border); white-space: nowrap; }
    .code-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
    .code-table tr:last-child td { border-bottom: none; }
    .code-table td:first-child { color: var(--t1); font-weight: 600; }
    .code-table code { font-family: 'Courier Prime', monospace; font-size: 15px; font-weight: 700; color: var(--blue); letter-spacing: .08em; white-space: nowrap; }
    .code-table a { color: var(--blue); }
    @media (max-width: 480px) { .code-table th, .code-table td { padding: 9px 10px; } }`;
const renderTable = (t, ind) => `${t.title ? `<h2 class="code-h2">${t.title}</h2>\n${ind}` : ''}<div class="code-table-wrap"><table class="code-table">
${ind}  <thead><tr>${t.head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
${ind}  <tbody>
${t.rows.map(r => `${ind}    <tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('\n')}
${ind}  </tbody>
${ind}</table></div>`;
// Badge colors follow CLAUDE.md "Status badge colors" (Nov 22 2026; before this every badge rendered amber):
// Rockstar green, Reported blue, Debunked red, everything else (Speculation, Unverified, Analysis) amber.
// The shell only carries green/amber/red, so the blue rule is added to a page that uses it.
const badgeColor = b => ({ rockstar: 'green', reported: 'blue', debunked: 'red' })[String(b).toLowerCase()] || 'amber';
const BLUE_BADGE_CSS = `
    .detail-block__badge--blue { background: var(--blue-dim); color: var(--blue); border: 1px solid var(--blue-border); }`;
const spoilerLabel = c => typeof c === 'number' ? `Chapter ${c}` : String(c);
const renderSpoiler = (sp, ind) => `<details class="spoiler">
${ind}  <summary><span class="spoiler__stamp">Spoiler: ${spoilerLabel(sp.chapter)}</span> <span class="spoiler__hint">Tap to reveal</span></summary>
${ind}  <div class="spoiler__body">${sp.table ? renderTable(sp.table, ind + '    ') : /^\s*<p[ >]/.test(sp.html) ? sp.html : `<p>${sp.html}</p>`}</div>
${ind}</details>`;

for (const s of specs) {
  const url = `https://gtavitips.com/faq/${s.slug}`, title = `${s.h1} | GTA 6 FAQ | GTAVITIPS`;
  if (s.desc.length > 160) problems.push(`${s.slug}: description ${s.desc.length} chars`);
  if (title.length > 70) problems.push(`${s.slug}: title ${title.length} chars`);
  const allText = JSON.stringify(s);
  const ansSpoilers = s.answer.filter(p => p && p.spoiler).map(p => p.spoiler);
  const spoilers = [...ansSpoilers, ...s.related.filter(r => r.spoiler).map(r => r.spoiler)];
  for (const sp of spoilers) if (!sp || sp.chapter === undefined || sp.chapter === '' || !(sp.html || sp.table)) problems.push(`${s.slug}: spoiler needs chapter and html or table`);
  for (const p of s.answer) if (typeof p !== 'string' && !p.spoiler && !p.table) problems.push(`${s.slug}: answer entry must be a string, {spoiler} or {table}`);
  // A light-spoiler page (mission names, no reveal) passes note:'...' to get the top notice without a reveal block.
  const hasSpoiler = spoilers.length > 0 || !!s.note, hasTable = s.answer.some(p => p && (p.table || (p.spoiler && p.spoiler.table))), plain = s.answer.filter(p => typeof p === 'string');
  const ldText = (txt, sp) => sp ? [txt, SPOILER_LD].filter(Boolean).join(' ') : txt;
  if (/\u2014/.test(allText)) problems.push(`${s.slug}: em dash`);
  for (const m of s.more) if (!titles[m]) problems.push(`${s.slug}: more-link missing ${m}`);
  if (s.more.length < 2 || s.more.length > 4) problems.push(`${s.slug}: More FAQ needs 2 to 4 links`);
  for (const [href] of s.intel) if (!fs.existsSync(path.join(ROOT, 'hub' + href, 'index.html'))) problems.push(`${s.slug}: intel missing ${href}`);
  for (const m of allText.matchAll(/href=\\"(\/[^"\\#]+)/g)) if (!fs.existsSync(path.join(ROOT, 'hub' + m[1], 'index.html')) && !specs.some(x => '/faq/' + x.slug === m[1])) problems.push(`${s.slug}: dead link ${m[1]}`);
  const ogImg = 'https://gtavitips.com' + (news.find(a => a.url === s.intel[0][0]) || { image: '/assets/images/vice-city-gta-6-location-04.jpg' }).image;
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: s.q, acceptedAnswer: { '@type': 'Answer', text: ldText(strip(plain.join(' ')), ansSpoilers.length > 0) } }, ...s.related.map(r => ({ '@type': 'Question', name: r.q, acceptedAnswer: { '@type': 'Answer', text: ldText(strip(r.html || ''), !!r.spoiler) } }))] };
  if (hasSpoiler && !/\n  <\/style>/.test(head0)) problems.push(`${s.slug}: shell has no head </style> for the spoiler CSS`);
  const hasBlue = s.related.some(r => r.badge && badgeColor(r.badge) === 'blue');
  const extraCss = (hasSpoiler ? SPOILER_CSS : '') + (hasTable ? TABLE_CSS : '') + (hasBlue ? BLUE_BADGE_CSS : '');
  const head = (extraCss ? head0.replace(/\n  <\/style>/, () => extraCss + '\n  </style>') : head0)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${escAttr(s.desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${escAttr(s.desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, () => `<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, () => `<meta property="og:image" content="${ogImg}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, () => `<link rel="canonical" href="${url}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">\n  ${JSON.stringify(ld)}\n  </script>`)
    .replace(/<span class="breadcrumb__current">[^<]*<\/span>/, () => `<span class="breadcrumb__current">${s.q}</span>`);
  const rel = s.related.map(r => `          <div class="detail-block reveal">
            <div class="detail-block__head">
              <span class="detail-block__q">${r.q}</span>${r.badge ? `\n              <span class="detail-block__badge detail-block__badge--${badgeColor(r.badge)}">${r.badge}</span>` : ''}
            </div>
            <div class="detail-block__body">
              ${r.html || ''}${r.spoiler ? '\n              ' + renderSpoiler(r.spoiler, '              ') : ''}
              <div class="detail-block__source">Source: ${clean(r.source)}</div>
            </div>
          </div>`).join('\n');
  const more = [...s.more.map(m => `            <a href="/faq/${m}" class="related-link">
              <span class="related-link__q">${titles[m]}</span>
              <span class="related-link__arr">&#8594;</span>
            </a>`), `            <a href="/faq" class="related-link">
              <span class="related-link__q">All FAQ questions</span>
              <span class="related-link__arr">&#8594;</span>
            </a>`].join('\n');
  const main = `<main id="main">
    <div class="wrap">
      <div class="layout">
        <div>
${hasSpoiler ? `\n          <p class="spoiler-note reveal">${s.note || SPOILER_NOTE}</p>\n` : ''}
          <div class="answer-card reveal">
            <div class="answer-card__head">
              <span class="answer-card__source">Source: ${clean(s.source)}</span>
            </div>
            <div class="answer-card__body">
              <h1 class="answer-card__h1">${s.h1}</h1>
              <div class="answer-card__answer">${s.answer.map(p => typeof p === 'string' ? `<p>${p}</p>` : p.table ? renderTable(p.table, '                ') : renderSpoiler(p.spoiler, '                ')).join('\n                ')}</div>
            </div>
          </div>

          <div class="section-label reveal">Related Questions</div>

${rel}

          <div class="section-label reveal" style="margin-top:32px">More FAQ</div>
          <div class="related-grid reveal">
${more}
          </div>

        </div>

        <aside>
          <div class="countdown-card reveal">
            <div class="countdown-card__label">${s.card.label}</div>
            <div class="countdown-card__date">${s.card.big}</div>
            <div class="countdown-card__sub">${s.card.sub}</div>
          </div>
          <div class="side-card reveal d1">
            <div class="side-card__head">FAQ Categories</div>
            <a href="/faq#release-and-platforms" class="side-card__item"><div class="side-card__item-dot" aria-hidden="true"></div>Release &amp; Platforms</a>
            <a href="/faq#the-world" class="side-card__item"><div class="side-card__item-dot" aria-hidden="true"></div>The World</a>
            <a href="/faq#story-and-characters" class="side-card__item"><div class="side-card__item-dot" aria-hidden="true"></div>Story &amp; Characters</a>
            <a href="/faq#gameplay" class="side-card__item"><div class="side-card__item-dot" aria-hidden="true"></div>Gameplay</a>
            <a href="/faq#online" class="side-card__item"><div class="side-card__item-dot" aria-hidden="true"></div>Online</a>
            <a href="/faq" class="side-card__item"><div class="side-card__item-dot" aria-hidden="true"></div>All Questions</a>
          </div>
          <div class="side-card reveal d2">
            <div class="side-card__head">Related Intel</div>
${s.intel.map(([h, l]) => `            <a href="${h}" class="side-card__item"><div class="side-card__item-dot" aria-hidden="true"></div>${l}</a>`).join('\n')}
          </div>
        </aside>

      </div>
    </div>
`;
  pages.push([s, head + main + tail0, fs.existsSync(path.join(ROOT, `hub/faq/${s.slug}`))]);
}
if (problems.length) { console.error('PROBLEMS:\n' + problems.join('\n')); process.exit(1); }
for (const [s, page, existed] of pages) { wr(`hub/faq/${s.slug}/index.html`, page); console.log((existed ? 'rewrite ' : 'new     ') + s.slug); }

let idx = rd('hub/faq/index.html');
const item = s => `      <div class="faq-item" data-badge="green">
        <button class="faq-btn" aria-expanded="false">
          <div class="faq-btn__left">
            <span class="faq-btn__q">${s.index.q || s.q}</span>
          </div>
          <svg class="faq-btn__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="faq-answer">
          <div class="faq-answer__inner">
            <p>${s.index.short}</p>
            <p class="faq-answer__source">Source: ${clean(s.index.source || s.source)}</p>
            <a href="/faq/${s.slug}" class="faq-answer__more">Read More &#8594;</a>
          </div>
        </div>
      </div>
`;
for (const s of specs) {
  const items = [...idx.matchAll(/      <div class="faq-item"[\s\S]*?\n      <\/div>\n(?=      <div class="faq-item"|    <\/section>)/g)];
  const hit = items.filter(m => m[0].includes(`<a href="/faq/${s.slug}" class="faq-answer__more">`) || (s.index.replaces || []).some(q => m[0].includes(`<span class="faq-btn__q">${q}</span>`)));
  if (hit.length) { idx = idx.replace(hit[0][0], () => item(s)); for (const extra of hit.slice(1)) idx = idx.replace(extra[0], ''); console.log('index: replaced', s.slug, hit.length > 1 ? `(+${hit.length - 1} merged)` : ''); continue; }
  const secStart = idx.indexOf(`<section class="faq-section reveal" id="${s.index.section}">`); if (secStart < 0) throw new Error('no section ' + s.index.section);
  const secEnd = idx.indexOf('    </section>', secStart);
  idx = idx.slice(0, secEnd) + item(s) + idx.slice(secEnd); console.log('index: added', s.slug, 'to', s.index.section);
}
const vis = [...idx.matchAll(/<span class="faq-btn__q">([\s\S]*?)<\/span>[\s\S]*?<div class="faq-answer__inner">\s*<p>([\s\S]*?)<\/p>/g)].map(m => ({ '@type': 'Question', name: strip(m[1]), acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) } }));
const ldRe = /(<script type="application\/ld\+json">\s*)(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?)(\s*<\/script>)/;
if (!ldRe.test(idx)) throw new Error('index FAQPage JSON-LD not found');
idx = idx.replace(ldRe, (m, a, b, c) => a + JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: vis }) + c);
wr('hub/faq/index.html', idx);
const si = JSON.parse(rd('hub/search-index.json'));
for (const s of specs) { const e = { n: s.q, u: `/faq/${s.slug}`, d: s.desc, c: 'faq' }; const i = si.findIndex(x => x.u === e.u); if (i >= 0) si[i] = e; else si.splice(Math.max(0, si.findIndex(x => x.c === 'faq')), 0, e); }
wr('hub/search-index.json', JSON.stringify(si));
let sm = rd('hub/sitemap.xml');
for (const s of specs) {
  const loc = `<loc>https://gtavitips.com/faq/${s.slug}</loc>`;
  const i = sm.indexOf(loc);
  if (i >= 0) { const j = sm.indexOf('<lastmod>', i); const k = sm.indexOf('</lastmod>', j); sm = sm.slice(0, j) + '<lastmod>' + TODAY + sm.slice(k); }
  else sm = sm.replace('</urlset>', () => `  <url>\n    ${loc}\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
}
{ const loc = '<loc>https://gtavitips.com/faq</loc>'; const i = sm.indexOf(loc); if (i >= 0) { const j = sm.indexOf('<lastmod>', i); const k = sm.indexOf('</lastmod>', j); sm = sm.slice(0, j) + '<lastmod>' + TODAY + sm.slice(k); } }
wr('hub/sitemap.xml', sm);
console.log(DRY ? 'dry ok' : 'written', specs.length, 'faq pages; index items', vis.length);
