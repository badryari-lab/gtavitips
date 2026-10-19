'use strict';

// One-time migration script for locations (25 pages). More complex than
// vehicles/weapons/factions: two prose sections, an optional Operator Notes
// grid, and no wiki/sub variance to worry about.

const fs = require('fs');
const path = require('path');
const { htmlToMarkdownInline, htmlToMarkdownBlock } = require('./templates/_markdown');

const SRC_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', 'locations');
const OUT_ROOT = path.join(__dirname, 'data', 'locations');

function must(match, label, file) {
  if (!match) throw new Error(`Could not find ${label} in ${file}`);
  return match;
}

function extractOne(slug, html, file) {
  const title = must(html.match(/<title>([^<]+)<\/title>/), 'title', file)[1];
  const description = must(html.match(/<meta name="description" content="([^"]+)">/), 'description', file)[1];
  const ogDescription = must(html.match(/<meta property="og:description" content="([^"]+)">/), 'og:description', file)[1];
  const ogPlaceholderMatch = html.match(/<!-- OG IMAGE PLACEHOLDER: replace with ([^\s]+) when available -->/);

  // south-beach has a genuinely malformed live page: a second <script> tag
  // opens before the first one closes, so matching by </script> boundaries
  // grabs both JSON blocks concatenated. Every JSON-LD payload on this site
  // is single-line, so match each JSON object directly instead.
  const jsonLdMatches = [...html.matchAll(/\{"@context":"https:\/\/schema\.org"[^\n]*\}/g)].map((m) => JSON.parse(m[0]));
  const articleLd = must(jsonLdMatches.find((j) => j['@type'] === 'Article'), 'Article JSON-LD', file);
  const faqLd = jsonLdMatches.find((j) => j['@type'] === 'FAQPage');

  const h1SplitMatch = html.match(/<h1 class="location-hero__h1">([^<]*)<span[^>]*>([^<]*)<\/span><\/h1>/);
  const h1PlainMatch = html.match(/<h1 class="location-hero__h1">([^<]*)<\/h1>/);
  const h1Match = must(h1SplitMatch || h1PlainMatch, 'H1', file);
  const titleParts = h1SplitMatch ? [h1Match[1].trim(), h1Match[2].trim()] : [h1Match[1].trim()];

  const heroSubtitleHtml = must(html.match(/<p class="location-hero__sub">([\s\S]*?)<\/p>/), 'hero subtitle', file)[1];
  const heroSubtitle = htmlToMarkdownInline(heroSubtitleHtml);

  const heroImgMatch = html.match(
    /<img src="([^"]+)" alt="([^"]*)" width="(\d+)" height="(\d+)" loading="eager" class="location-hero__bg-img">/
  );
  const heroImage = heroImgMatch
    ? { src: heroImgMatch[1], alt: heroImgMatch[2], width: heroImgMatch[3], height: heroImgMatch[4] }
    : undefined;

  const statBlockMatch = must(
    html.match(/<div class="stat-block" role="list"[^>]*>([\s\S]*?)\n?\s*<\/div>\s*<\/div>\s*<\/div>/),
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

  const profileMatch = must(
    html.match(/id="overview-hd">[\s\S]*?<div class="section__body">([\s\S]*?)<\/div>\s*<\/section>/),
    'Leonida Profile prose',
    file
  );
  const profileMarkdown = htmlToMarkdownBlock(profileMatch[1]);

  const groundMatch = must(
    html.match(/id="field-hd">[\s\S]*?<div class="section__body">([\s\S]*?)<\/div>\s*<\/section>/),
    'On the Ground prose',
    file
  );
  const groundMarkdown = htmlToMarkdownBlock(groundMatch[1]);

  const operatorMatch = html.match(/<div class="operator-notes__grid">([\s\S]*?)\n\s*<\/div>\s*<\/div>/);
  const operatorNotes = operatorMatch
    ? [
        ...operatorMatch[1].matchAll(
          /<div class="operator-notes__item-key">([^<]*)<\/div>\s*<div class="operator-notes__item-val">([\s\S]*?)<\/div>/g
        ),
      ].map((m) => ({ key: m[1], val: htmlToMarkdownInline(m[2]) }))
    : [];

  const connections = [
    ...html.matchAll(
      /<a href="([^"]+)" class="conn-card[^"]*"[^>]*>\s*<div class="conn-card__type">([^<]*)<\/div>\s*<div class="conn-card__name">([^<]*)<\/div>\s*<div class="conn-card__desc">([\s\S]*?)<\/div>\s*<\/a>/g
    ),
  ].map((m) => ({ url: m[1], type: m[2], name: m[3], desc: htmlToMarkdownInline(m[4]) }));

  // FAQ: independent visible-accordion vs JSON-LD extraction (lesson from characters).
  const faq = [
    ...html.matchAll(/<summary class="faq-item__q">([^<]*)<svg[\s\S]*?<\/summary>\s*<div class="faq-item__a">([\s\S]*?)<\/div>/g),
  ].map((m) => ({ q: m[1], a: htmlToMarkdownInline(m[2]) }));
  const faqSchema = faqLd ? faqLd.mainEntity.map((q) => ({ q: q.name, aPlain: q.acceptedAnswer.text })) : [];
  // Merge aPlain into the visible-accordion faq entries when questions match
  // (locations' JSON-LD matched the accordion closely in the sample read;
  // fall back to the rich answer's own text if no schema match exists).
  for (const f of faq) {
    const match = faqSchema.find((s) => s.q === f.q);
    f.aPlain = match ? match.aPlain : undefined;
  }

  // Sidebar titles and aria-label genuinely vary per entry here (confirmed:
  // 23/25 "Location navigation" + "Locations Index", but some say "Nearby
  // locations" + "Nearby Locations") — extract per-entry, don't assume.
  const asideMatch = must(html.match(/<aside class="content-side" aria-label="([^"]*)"[^>]*>([\s\S]*?)<\/aside>/), 'sidebar aside', file);
  const sidebarAriaLabel = asideMatch[1];
  const calloutChunks = asideMatch[2].split('<div class="callout reveal').slice(1);
  const sidebar = calloutChunks.map((chunk) => {
    const sidebarTitle = must(chunk.match(/callout__title">([^<]*)</), 'callout title', file)[1];
    const items = [...chunk.matchAll(/<a href="([^"]+)" class="callout__item"><span[^>]*><\/span>([^<]*)<\/a>/g)].map((m) => ({
      url: m[1],
      label: m[2],
    }));
    return { title: sidebarTitle, items };
  });

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
    heroImage,
    statBlock,
    operatorNotes,
    connections,
    faq,
    sidebar,
    sidebarAriaLabel,
  };

  return `${JSON.stringify(data, null, 2)}\n---\n${profileMarkdown}\n%%%GROUND%%%\n${groundMarkdown}\n`;
}

function main() {
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  // vice-city is the main hub location — custom structure (no "On the
  // Ground" section, different ids throughout), not a fit for this
  // standard 25-page template. Left hand-maintained, excluded here.
  const EXCLUDE = new Set(['vice-city']);
  const slugs = fs.readdirSync(SRC_ROOT).filter((f) => fs.statSync(path.join(SRC_ROOT, f)).isDirectory() && !EXCLUDE.has(f));
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
  console.log(`Extracted ${ok}/${slugs.length} location entries into build/data/locations/`);
  if (errors.length) {
    console.log(`\n${errors.length} FAILED:`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main();
