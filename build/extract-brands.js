'use strict';

// One-time migration script for brands (76 pages) — the most structurally
// varied category: optional hero badge/image, optional second section
// (4 known stub entries have only 1), distinct eco-card connections style,
// no FAQ anywhere, and flexible per-entry sidebar titles.

const fs = require('fs');
const path = require('path');
const { htmlToMarkdownInline, htmlToMarkdownBlock } = require('./templates/_markdown');
const { extractDivContent } = require('./extract-utils');

const SRC_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', 'brands');
const OUT_ROOT = path.join(__dirname, 'data', 'brands');

function must(match, label, file) {
  if (!match) throw new Error(`Could not find ${label} in ${file}`);
  return match;
}

function extractOne(slug, html, file) {
  const title = must(html.match(/<title>([^<]+)<\/title>/), 'title', file)[1];
  const description = must(html.match(/<meta name="description" content="([^"]+)">/), 'description', file)[1];
  const ogDescription = must(html.match(/<meta property="og:description" content="([^"]+)">/), 'og:description', file)[1];

  const jsonLdRaw = must(html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/), 'JSON-LD', file)[1];
  const jsonLd = JSON.parse(jsonLdRaw);

  const h1SplitMatch = html.match(/<h1 class="brand-hero__h1">([^<]*)<span[^>]*>([^<]*)<\/span><\/h1>/);
  const h1PlainMatch = html.match(/<h1 class="brand-hero__h1">([^<]*)<\/h1>/);
  const h1Match = must(h1SplitMatch || h1PlainMatch, 'H1', file);
  const titleParts = h1SplitMatch ? [h1Match[1].trim(), h1Match[2].trim()] : [h1Match[1].trim()];

  const heroBadgeMatch = html.match(/<div class="brand-hero__badge">([^<]*)<\/div>/);
  const heroBadge = heroBadgeMatch ? heroBadgeMatch[1] : undefined;

  const heroSloganHtml = must(html.match(/<p class="brand-hero__slogan">([\s\S]*?)<\/p>/), 'hero slogan', file)[1];
  const heroSlogan = htmlToMarkdownInline(heroSloganHtml);

  const heroImgMatch = html.match(
    /<img src="([^"]+)" alt="([^"]*)" width="(\d+)" height="(\d+)" loading="eager" class="brand-hero__bg-img">/
  );
  const heroImage = heroImgMatch
    ? { src: heroImgMatch[1], alt: heroImgMatch[2], width: heroImgMatch[3], height: heroImgMatch[4] }
    : undefined;

  // No-photo brands use a decorative icon that varies per entry (60/67 use
  // a shared "storefront" icon, 7 have a unique one matching their
  // industry) — extract the real markup, never assume a single default.
  let heroIcon;
  if (!heroImage) {
    const iconMatch = must(
      html.match(/brand-hero__bg-graphic" aria-hidden="true"><svg[^>]*>([\s\S]*?)<\/svg><\/div>/),
      'hero icon',
      file
    );
    heroIcon = iconMatch[1];
  }

  const statBlockExtract = extractDivContent(html, 'class="stat-block" role="list"');
  if (!statBlockExtract) throw new Error(`Could not find stat block in ${file}`);
  const itemChunks = statBlockExtract.content.split('<div class="stat-block__item"').slice(1);
  const statBlock = itemChunks.map((chunk) => {
    const key = must(chunk.match(/class="stat-block__key">([^<]*)</), 'stat key', file)[1];
    const value = must(chunk.match(/class="stat-block__val">([\s\S]*?)<\/div>/), 'stat value', file)[1];
    const subMatch = chunk.match(/class="stat-block__sub">([\s\S]*?)<\/div>/);
    const item = { key, value: htmlToMarkdownInline(value) };
    if (subMatch) item.sub = htmlToMarkdownInline(subMatch[1]);
    const pillsMatch = chunk.match(/class="stat-block__pills">([\s\S]*?)<\/div>/);
    if (pillsMatch) {
      item.pills = [...pillsMatch[1].matchAll(/<a href="([^"]+)"[^>]*class="wiki-pill"[^>]*>[\s\S]*?<\/svg>([^<]*)<\/a>/g)].map((m) => ({
        url: m[1],
        label: m[2],
      }));
    }
    return item;
  });

  // Section 1 (always present): eyebrow + heading (both stored as data,
  // confirmed to vary slightly per entry) + prose body.
  const section1Match = must(html.match(/<section class="section reveal" aria-labelledby="profile-hd">([\s\S]*?)<\/section>/), 'profile section', file);
  const profileEyebrow = must(section1Match[1].match(/section__eyebrow-text">([^<]*)</), 'profile eyebrow', file)[1];
  const profileHeadingMatch = must(section1Match[1].match(/id="profile-hd">([\s\S]*?)<\/h2>/), 'profile heading', file);
  const profileHeading = profileHeadingMatch[1].trim();
  const proseExtract = extractDivContent(section1Match[1], 'class="section__body"');
  if (!proseExtract) throw new Error(`Could not find profile prose in ${file}`);
  const proseMarkdown = htmlToMarkdownBlock(proseExtract.content);

  // Section 2 (optional — absent on the 4 known stub pages): eco-card grid.
  const section2Match = html.match(/<section class="section reveal" aria-labelledby="eco-hd">([\s\S]*?)<\/section>/);
  let ecoSection;
  if (section2Match) {
    const ecoEyebrow = must(section2Match[1].match(/section__eyebrow-text">([^<]*)</), 'eco eyebrow', file)[1];
    const ecoHeadingMatch = must(section2Match[1].match(/id="eco-hd">([\s\S]*?)<\/h2>/), 'eco heading', file);
    const ecoHeading = ecoHeadingMatch[1].trim();
    const items = [
      ...section2Match[1].matchAll(
        /<a href="([^"]+)" class="eco-card[^"]*"[^>]*>\s*<div class="eco-card__avatar"[^>]*>([^<]*)<\/div>\s*<div class="eco-card__body">\s*<div class="eco-card__industry">([^<]*)<\/div>\s*<div class="eco-card__name">([^<]*)<\/div>\s*<\/div>\s*<\/a>/g
      ),
    ].map((m) => ({ url: m[1], avatarInitials: m[2], industry: m[3], name: m[4] }));
    ecoSection = { eyebrow: ecoEyebrow, heading: ecoHeading, items };
  }

  // Sidebar: flexible N blocks (vehicle-manufacturer brands have a custom
  // first-block title like "Annis Vehicles" instead of "Brands Index").
  const asideMatch = must(html.match(/<aside class="content-side"[^>]*>([\s\S]*?)<\/aside>/), 'sidebar aside', file);
  const calloutChunks = asideMatch[1].split('<div class="callout reveal').slice(1);
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
      jsonLdHeadline: jsonLd.headline,
      jsonLdDescription: jsonLd.description,
      dateModified: jsonLd.dateModified,
    },
    heroBadge,
    heroSlogan,
    heroImage,
    heroIcon,
    statBlock,
    profileSection: { eyebrow: profileEyebrow, heading: profileHeading },
    ecoSection,
    sidebar,
  };

  return `${JSON.stringify(data, null, 2)}\n---\n${proseMarkdown}\n`;
}

function main() {
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  // 4 empty directories (no index.html) — live 404s right now, each linked
  // from saras-unisex-salon and/or a news article. CLAUDE.md: "don't link
  // it... never create a page just to satisfy a link" — flagged in the
  // migration report, not authored here.
  const EXCLUDE = new Set(['electric-fang-tattoo', 'goodtime-gear', 'stock-305', 'vice-city-style']);
  const slugs = fs
    .readdirSync(SRC_ROOT)
    .filter((f) => fs.statSync(path.join(SRC_ROOT, f)).isDirectory() && !EXCLUDE.has(f));
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
  console.log(`Extracted ${ok}/${slugs.length} brand entries into build/data/brands/`);
  if (errors.length) {
    console.log(`\n${errors.length} FAILED:`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main();
