'use strict';

// One-time migration script: reads the 21 existing character pages and
// reverse-engineers build/data/characters/<slug>.md data files from them.

const fs = require('fs');
const path = require('path');
const { htmlToMarkdownInline, htmlToMarkdownBlock } = require('./templates/_markdown');

const SRC_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', 'characters');
const OUT_ROOT = path.join(__dirname, 'data', 'characters');

function must(match, label, file) {
  if (!match) throw new Error(`Could not find ${label} in ${file}`);
  return match;
}

// Confirmed heterogeneous across the 21 character pages (unlike vehicles,
// which was ~100% uniform): jason-duval alone already uses the correct
// Tropical Deco Anton/400 heading style; the other 20 are an older,
// never-migrated generation (font-weight 700, no Anton, different nav
// color). Using one shared reference CSS for all 21 would have silently
// regressed jason-duval. So CSS is captured per-entry here, not once.
const DEAD_CSS_PATTERNS = [
  /\.dossier__badge\{[^}]*\}\n\s*/g,
  /\.dossier__badge--green\{[^}]*\}\n\s*/g,
  /\.dossier__badge--blue\{[^}]*\}\n\s*/g,
  /\.dossier__badge--amber\{[^}]*\}\n\s*/g,
  /\.dossier__badge--pink\{[^}]*\}\n\s*/g,
  /\.dossier__badge::before\{[^}]*\}\n\s*/g,
  /@keyframes pulse\{[^}]*\}\n\s*/g,
  /\.dossier__h1\{[^}]*\}\n\s*/g,
  /\.dossier__tagline\{[^}]*\}\n\s*/g,
  /\.dossier__tagline strong\{[^}]*\}\n\s*/g,
  /\.dossier__img\{[^}]*\}\n\s*/g,
  /\.dossier__img-bg\{[^}]*\}\n\s*/g,
  /\.dossier__img-letter\{[^}]*\}\n\s*/g,
];

function extractCss(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  let css = m[1];
  for (const re of DEAD_CSS_PATTERNS) css = css.replace(re, '');
  return css;
}

function extractOne(slug, html, file) {
  const css = extractCss(html);
  const title = must(html.match(/<title>([^<]+)<\/title>/), 'title', file)[1];
  const description = must(html.match(/<meta name="description" content="([^"]+)">/), 'description', file)[1];
  const ogDescription = must(html.match(/<meta property="og:description" content="([^"]+)">/), 'og:description', file)[1];
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)">/);

  // One live page (erin-henshaw) has a genuinely malformed VideoGameCharacter
  // JSON-LD block (unescaped quote in the description — invalid JSON on
  // production right now). Parse leniently and fall back to the clean meta
  // description rather than letting one broken page block the whole run.
  const jsonLdRaws = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map((m) => m[1]);
  const jsonLdMatches = [];
  for (const raw of jsonLdRaws) {
    try {
      jsonLdMatches.push(JSON.parse(raw));
    } catch (err) {
      console.warn(`  WARNING: malformed JSON-LD in ${file}, falling back to meta description (${err.message})`);
    }
  }
  const faqLd = jsonLdMatches.find((j) => j['@type'] === 'FAQPage');

  const h1SplitMatch = html.match(/<h1 class="char-hero__h1">([^<]*)<span[^>]*>([^<]*)<\/span><\/h1>/);
  const h1PlainMatch = html.match(/<h1 class="char-hero__h1">([^<]*)<\/h1>/);
  const h1Match = must(h1SplitMatch || h1PlainMatch, 'H1', file);
  const titleParts = h1SplitMatch ? [h1Match[1].trim(), h1Match[2].trim()] : [h1Match[1].trim()];

  const dateModifiedFallback = html.match(/"dateModified":"([^"]+)"/);
  const charLd = jsonLdMatches.find((j) => j['@type'] === 'VideoGameCharacter') || {
    name: titleParts.join(' '),
    description,
    dateModified: dateModifiedFallback ? dateModifiedFallback[1] : undefined,
  };

  const heroSubtitleHtml = must(html.match(/<p class="char-hero__sub">([\s\S]*?)<\/p>/), 'hero subtitle', file)[1];
  const heroSubtitle = htmlToMarkdownInline(heroSubtitleHtml);

  const heroImgMatch = html.match(
    /<img src="([^"]+)" alt="([^"]*)" width="(\d+)" height="(\d+)" loading="eager" class="char-hero__bg-img">/
  );
  const heroImage = heroImgMatch
    ? { src: heroImgMatch[1], alt: heroImgMatch[2], width: heroImgMatch[3], height: heroImgMatch[4] }
    : undefined;

  const statBlockMatch = must(
    html.match(/<div class="stat-block" role="list"[^>]*>([\s\S]*?)\n\s*<\/div>\s*<\/div>\s*<\/div>/),
    'stat block',
    file
  );
  const itemChunks = statBlockMatch[1].split('<div class="stat-block__item"').slice(1);
  const statBlock = itemChunks.map((chunk) => {
    const key = must(chunk.match(/class="stat-block__key">([^<]*)</), 'stat key', file)[1];
    const value = must(chunk.match(/class="stat-block__val">([\s\S]*?)<\/div>/), 'stat value', file)[1];
    const subMatch = chunk.match(/class="stat-block__sub">([\s\S]*?)<\/div>/);
    const item = { key, value: htmlToMarkdownInline(value) };
    if (subMatch) item.sub = htmlToMarkdownInline(subMatch[1]);
    return item;
  });

  const gallery = [...html.matchAll(/<div class="entry-gallery__item"><img src="([^"]+)" alt="([^"]*)"(?: width="(\d+)" height="(\d+)")?/g)].map(
    (m) => ({ src: m[1], alt: m[2], width: m[3], height: m[4] })
  );

  const proseMatch = must(
    html.match(/id="overview-hd">[\s\S]*?<div class="section__body">([\s\S]*?)<\/div>\s*<\/section>/),
    'Dossier prose',
    file
  );
  const proseMarkdown = htmlToMarkdownBlock(proseMatch[1]);

  const connections = [
    ...html.matchAll(
      /<a href="([^"]+)" class="conn-card[^"]*"[^>]*>\s*<div class="conn-card__avatar"[^>]*(?:\s+style="([^"]*)")?>(?:<img src="([^"]+)"[^>]*>)?([^<]*)<\/div>\s*<div class="conn-card__body">\s*<div class="conn-card__role">([^<]*)<\/div>\s*<div class="conn-card__name">([^<]*)<\/div>\s*<div class="conn-card__desc">([\s\S]*?)<\/div>\s*<\/div>/g
    ),
  ].map((m) => {
    const conn = { url: m[1], role: m[5], name: m[6], desc: htmlToMarkdownInline(m[7]) };
    if (m[3]) conn.avatarImage = { src: m[3] };
    else conn.avatarInitials = m[4];
    return conn;
  });

  // IMPORTANT: the JSON-LD FAQPage block and the visible <details> accordion
  // are NOT the same content on these pages — confirmed on lucia-caminos,
  // only 1 of 5 questions actually matches by text between the two. They are
  // independently authored. Extract both, independently, rather than trying
  // to merge/match them (a pre-existing content-integrity gap, flagged in
  // the migration report, not silently reconciled here).
  const faq = [
    ...html.matchAll(/<summary class="faq-item__q">([^<]*)<svg[\s\S]*?<\/summary>\s*<div class="faq-item__a">([\s\S]*?)<\/div>/g),
  ].map((m) => ({ q: m[1], a: htmlToMarkdownInline(m[2]) }));
  const faqSchema = faqLd ? faqLd.mainEntity.map((q) => ({ q: q.name, aPlain: q.acceptedAnswer.text })) : [];

  // Sidebar: N callout blocks inside <aside>, each with a title + item links.
  const asideMatch = must(html.match(/<aside class="content-side"[^>]*>([\s\S]*?)<\/aside>/), 'sidebar aside', file);
  const calloutChunks = asideMatch[1].split('<div class="callout reveal').slice(1);
  const sidebar = calloutChunks.map((chunk) => {
    const sidebarTitle = must(chunk.match(/callout__title">([^<]*)</), 'callout title', file)[1];
    const items = [...chunk.matchAll(/<a href="([^"]+)" class="callout__item">\s*<span[^>]*><\/span>\s*([^<]*?)\s*<\/a>/g)].map(
      (m) => ({ url: m[1], label: m[2].trim() })
    );
    return { title: sidebarTitle, items };
  });

  const data = {
    slug,
    css,
    titleParts,
    seo: {
      title,
      description,
      ogDescription,
      ogImage: ogImageMatch ? ogImageMatch[1] : undefined,
      jsonLdName: charLd.name,
      jsonLdDescription: charLd.description,
      dateModified: charLd.dateModified,
    },
    heroSubtitle,
    heroImage,
    statBlock,
    gallery,
    connections,
    faq,
    faqSchema,
    sidebar,
  };

  return `${JSON.stringify(data, null, 2)}\n---\n${proseMarkdown}\n`;
}

function main() {
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  const slugs = fs.readdirSync(SRC_ROOT).filter((f) => fs.statSync(path.join(SRC_ROOT, f)).isDirectory());
  let ok = 0;
  const errors = [];
  for (const slug of slugs) {
    const file = path.join(SRC_ROOT, slug, 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    try {
      const out = extractOne(slug, html, `${slug}/index.html`);
      fs.writeFileSync(path.join(OUT_ROOT, `${slug}.md`), out, 'utf8');
      ok++;
    } catch (err) {
      errors.push(`${slug}: ${err.message}`);
    }
  }
  console.log(`Extracted ${ok}/${slugs.length} character entries into build/data/characters/`);
  if (errors.length) {
    console.log(`\n${errors.length} FAILED:`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main();
