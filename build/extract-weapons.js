'use strict';

// One-time migration script for weapons (26 pages).

const fs = require('fs');
const path = require('path');
const { htmlToMarkdownInline, htmlToMarkdownBlock } = require('./templates/_markdown');

const SRC_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', 'weapons');
const OUT_ROOT = path.join(__dirname, 'data', 'weapons');

function must(match, label, file) {
  if (!match) throw new Error(`Could not find ${label} in ${file}`);
  return match;
}

function extractOne(slug, html, file) {
  const title = must(html.match(/<title>([^<]+)<\/title>/), 'title', file)[1];
  const description = must(html.match(/<meta name="description" content="([^"]+)">/), 'description', file)[1];
  const ogDescription = must(html.match(/<meta property="og:description" content="([^"]+)">/), 'og:description', file)[1];
  const ogPlaceholderMatch = html.match(/<!-- OG IMAGE PLACEHOLDER: replace with ([^\s]+) when available -->/);

  const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map((m) =>
    JSON.parse(m[1])
  );
  const articleLd = must(jsonLdMatches.find((j) => j['@type'] === 'Article'), 'Article JSON-LD', file);
  const faqLd = jsonLdMatches.find((j) => j['@type'] === 'FAQPage');

  const h1SplitMatch = html.match(/<h1 class="weapon-hero__h1">([^<]*)<span[^>]*>([^<]*)<\/span><\/h1>/);
  const h1PlainMatch = html.match(/<h1 class="weapon-hero__h1">([^<]*)<\/h1>/);
  const h1Match = must(h1SplitMatch || h1PlainMatch, 'H1', file);
  const titleParts = h1SplitMatch ? [h1Match[1].trim(), h1Match[2].trim()] : [h1Match[1].trim()];

  const heroSubtitleHtml = must(html.match(/<p class="weapon-hero__sub">([\s\S]*?)<\/p>/), 'hero subtitle', file)[1];
  const heroSubtitle = htmlToMarkdownInline(heroSubtitleHtml);

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
    html.match(/id="assessment-hd">[\s\S]*?<div class="section__body">([\s\S]*?)<\/div>\s*<\/section>/),
    'Field Assessment prose',
    file
  );
  const proseMarkdown = htmlToMarkdownBlock(proseMatch[1]);

  const connections = [
    ...html.matchAll(
      /<a href="([^"]+)" class="conn-card[^"]*"[^>]*>\s*<div class="conn-card__type">([^<]*)<\/div>\s*<div class="conn-card__name">([^<]*)<\/div>\s*<div class="conn-card__desc">([\s\S]*?)<\/div>\s*<\/a>/g
    ),
  ].map((m) => ({ url: m[1], type: m[2], name: m[3], desc: htmlToMarkdownInline(m[4]) }));

  // FAQ: extract visible accordion and JSON-LD independently (characters
  // taught us these can diverge — don't assume they match).
  const faq = [
    ...html.matchAll(/<summary class="faq-item__q">([^<]*)<svg[\s\S]*?<\/summary>\s*<div class="faq-item__a">([\s\S]*?)<\/div>/g),
  ].map((m) => ({ q: m[1], a: htmlToMarkdownInline(m[2]) }));
  const faqSchema = faqLd ? faqLd.mainEntity.map((q) => ({ q: q.name, aPlain: q.acceptedAnswer.text })) : [];

  const exploreTitleIdx = html.indexOf('>Explore Database<');
  const asideStart = must(html.match(/<aside class="content-side"/), 'sidebar aside', file).index;
  const allCalloutLinks = [...html.matchAll(/<a href="([^"]+)" class="callout__item"><span[^>]*><\/span>([^<]*)<\/a>/g)].filter(
    (m) => m.index > asideStart
  );
  const sidebarDatabase = allCalloutLinks.filter((m) => m.index < exploreTitleIdx).map((m) => ({ url: m[1], label: m[2] }));
  const sidebarExplore = allCalloutLinks.filter((m) => m.index > exploreTitleIdx).map((m) => ({ url: m[1], label: m[2] }));

  const data = {
    slug,
    titleParts,
    seo: {
      title,
      description,
      ogDescription,
      ogImagePlaceholder: ogPlaceholderMatch ? ogPlaceholderMatch[1] : undefined,
      jsonLdHeadline: articleLd.headline,
      jsonLdDescription: articleLd.description,
      dateModified: articleLd.dateModified,
    },
    heroSubtitle,
    statBlock,
    gallery,
    connections,
    faq,
    faqSchema,
    sidebarDatabase,
    sidebarExplore,
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
  console.log(`Extracted ${ok}/${slugs.length} weapon entries into build/data/weapons/`);
  if (errors.length) {
    console.log(`\n${errors.length} FAILED:`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main();
