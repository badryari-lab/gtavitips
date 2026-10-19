'use strict';

// ONE-TIME migration script: reads the 84 existing hand-written vehicle pages
// and reverse-engineers build/data/vehicles/<slug>.md data files from them,
// so the pilot's generated output can be diffed against real production
// pages instead of hand-typing 84 data files from scratch (error-prone, and
// risks silently changing approved copy). Not part of the ongoing build —
// once the pilot is verified and new vehicle entries are authored directly
// as data files, this script has no further use.

const fs = require('fs');
const path = require('path');
const { htmlToMarkdownInline, htmlToMarkdownBlock } = require('./templates/_markdown');

const SRC_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', 'vehicles');
const OUT_ROOT = path.join(__dirname, 'data', 'vehicles');

function must(match, label, file) {
  if (!match) throw new Error(`Could not find ${label} in ${file}`);
  return match;
}

function extractOne(slug, html, file) {
  const title = must(html.match(/<title>([^<]+)<\/title>/), 'title', file)[1];
  const description = must(html.match(/<meta name="description" content="([^"]+)">/), 'description', file)[1];
  const ogDescription = must(html.match(/<meta property="og:description" content="([^"]+)">/), 'og:description', file)[1];
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)">/);
  const ogPlaceholderMatch = html.match(/<!-- OG IMAGE PLACEHOLDER: replace with ([^\s]+) when available -->/);

  const jsonLdRaw = must(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/), 'JSON-LD', file)[1];
  const jsonLd = JSON.parse(jsonLdRaw);

  const h1SplitMatch = html.match(/<h1 class="vehicle-hero__h1">([^<]*)<span>([^<]*)<\/span><\/h1>/);
  const h1PlainMatch = html.match(/<h1 class="vehicle-hero__h1">([^<]*)<\/h1>/);
  const h1Match = must(h1SplitMatch || h1PlainMatch, 'H1', file);
  const titleParts = h1SplitMatch ? [h1Match[1].trim(), h1Match[2].trim()] : [h1Match[1].trim()];

  const heroSubtitleHtml = must(html.match(/<p class="vehicle-hero__sub">([\s\S]*?)<\/p>/), 'hero subtitle', file)[1];
  const heroSubtitle = htmlToMarkdownInline(heroSubtitleHtml);

  // Most vehicles have no real photo yet (gradient + line-icon fallback), but
  // a few do — e.g. grotti-cheetah, vapid-stanier — using a real full-bleed
  // photo hero with a stronger scrim, per CLAUDE.md's photo-hero convention.
  const heroImgMatch = html.match(
    /<img src="([^"]+)" alt="([^"]*)" width="(\d+)" height="(\d+)" loading="eager" class="vehicle-hero__bg-img">/
  );
  const heroImage = heroImgMatch
    ? { src: heroImgMatch[1], alt: heroImgMatch[2], width: heroImgMatch[3], height: heroImgMatch[4] }
    : undefined;

  // Stat block: grab the whole stat-block div (no nested divs beyond items'
  // own leaf fields, so a non-greedy match to the next "</div>\n          </div>"
  // closing sequence — stat-block then dossier__left — is safe here).
  const statBlockMatch = must(
    html.match(/<div class="stat-block" role="list"[^>]*>([\s\S]*?)\n\s*<\/div>\s*<\/div>\s*<\/div>/),
    'stat block',
    file
  );
  const statBlockInner = statBlockMatch[1];
  const itemChunks = statBlockInner.split('<div class="stat-block__item"').slice(1);
  const statBlock = itemChunks.map((chunk) => {
    const key = must(chunk.match(/class="stat-block__key">([^<]*)</), 'stat key', file)[1];
    const value = must(chunk.match(/class="stat-block__val">([\s\S]*?)<\/div>/), 'stat value', file)[1];
    const subMatch = chunk.match(/class="stat-block__sub">([\s\S]*?)<\/div>/);
    const item = { key, value: htmlToMarkdownInline(value) };
    if (subMatch) item.sub = htmlToMarkdownInline(subMatch[1]);
    const wikiHref = chunk.match(/<a href="([^"]+)"[^>]*class="stat-block__wiki"/);
    const wikiLabel = chunk.match(/<\/svg>([^<]*)<\/a>/);
    if (wikiHref) {
      item.wikiUrl = wikiHref[1];
      item.wikiLabel = wikiLabel ? wikiLabel[1] : '';
    }
    return item;
  });

  // Gallery (only grotti-cheetah / vapid-stanier have this variant).
  const gallery = [...html.matchAll(/<div class="entry-gallery__item"><img src="([^"]+)" alt="([^"]*)"(?: width="(\d+)" height="(\d+)")?/g)].map(
    (m) => ({ src: m[1], alt: m[2], width: m[3], height: m[4] })
  );

  // Field Assessment prose — section__body is the last div before </section>.
  const proseMatch = must(
    html.match(/id="assessment-hd">[\s\S]*?<div class="section__body">([\s\S]*?)<\/div>\s*<\/section>/),
    'Field Assessment prose',
    file
  );
  const proseMarkdown = htmlToMarkdownBlock(proseMatch[1]);

  // Connection cards.
  const connections = [
    ...html.matchAll(
      /<a href="([^"]+)" class="conn-card[^"]*"[^>]*>\s*<div class="conn-card__type">([^<]*)<\/div>\s*<div class="conn-card__name">([^<]*)<\/div>\s*<div class="conn-card__desc">([\s\S]*?)<\/div>\s*<\/a>/g
    ),
  ].map((m) => ({ url: m[1], type: m[2], name: m[3], desc: htmlToMarkdownInline(m[4]) }));

  // Sidebar: two callout blocks, "Vehicle Database" then "Explore Database".
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
      ogImage: ogImageMatch ? ogImageMatch[1] : undefined,
      ogImagePlaceholder: ogPlaceholderMatch ? ogPlaceholderMatch[1] : undefined,
      jsonLdHeadline: jsonLd.headline,
      jsonLdDescription: jsonLd.description,
      dateModified: jsonLd.dateModified,
    },
    heroSubtitle,
    heroImage,
    statBlock,
    gallery,
    connections,
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
  console.log(`Extracted ${ok}/${slugs.length} vehicle entries into build/data/vehicles/`);
  if (errors.length) {
    console.log(`\n${errors.length} FAILED:`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main();
