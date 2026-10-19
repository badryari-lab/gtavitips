'use strict';

// One-time migration script for activities (32 pages).

const fs = require('fs');
const path = require('path');
const { htmlToMarkdownInline, htmlToMarkdownBlock } = require('./templates/_markdown');

const SRC_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', 'activities');
const OUT_ROOT = path.join(__dirname, 'data', 'activities');

function must(match, label, file) {
  if (!match) throw new Error(`Could not find ${label} in ${file}`);
  return match;
}

function extractOne(slug, html, file) {
  const title = must(html.match(/<title>([^<]+)<\/title>/), 'title', file)[1];
  const description = must(html.match(/<meta name="description" content="([^"]+)">/), 'description', file)[1];
  const ogDescription = must(html.match(/<meta property="og:description" content="([^"]+)">/), 'og:description', file)[1];

  const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map((m) =>
    JSON.parse(m[1])
  );
  const articleLd = must(jsonLdMatches.find((j) => j['@type'] === 'Article'), 'Article JSON-LD', file);
  const faqLd = jsonLdMatches.find((j) => j['@type'] === 'FAQPage');

  const h1SplitMatch = html.match(/<h1 class="activity-hero__h1">([^<]*)<span[^>]*>([^<]*)<\/span><\/h1>/);
  const h1PlainMatch = html.match(/<h1 class="activity-hero__h1">([^<]*)<\/h1>/);
  const h1Match = must(h1SplitMatch || h1PlainMatch, 'H1', file);
  const titleParts = h1SplitMatch ? [h1Match[1].trim(), h1Match[2].trim()] : [h1Match[1].trim()];

  const heroSubtitleHtml = must(html.match(/<p class="activity-hero__sub">([\s\S]*?)<\/p>/), 'hero subtitle', file)[1];
  const heroSubtitle = htmlToMarkdownInline(heroSubtitleHtml);

  const heroImgMatch = html.match(
    /<img src="([^"]+)" alt="([^"]*)" width="(\d+)" height="(\d+)" loading="eager" class="activity-hero__bg-img">/
  );
  const heroImage = heroImgMatch
    ? { src: heroImgMatch[1], alt: heroImgMatch[2], width: heroImgMatch[3], height: heroImgMatch[4] }
    : undefined;

  const statBlockMatch = must(
    html.match(/<div class="stat-block" role="list"[^>]*>([\s\S]*?)\n?\s*<\/div>\s*<\/div>/),
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

  // FAQ: visible accordion uses .faq-q/.faq-a here (not .faq-item__q/__a).
  // Independent from JSON-LD — don't assume they match.
  const faq = [...html.matchAll(/<summary class="faq-q">([\s\S]*?)<svg[\s\S]*?<\/summary>\s*<div class="faq-a">([\s\S]*?)<\/div>/g)].map(
    (m) => ({ q: m[1].trim(), a: htmlToMarkdownInline(m[2]) })
  );
  const faqSchema = faqLd ? faqLd.mainEntity.map((q) => ({ q: q.name, aPlain: q.acceptedAnswer.text })) : [];
  for (const f of faq) {
    const match = faqSchema.find((s) => s.q === f.q);
    f.aPlain = match ? match.aPlain : undefined;
  }

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
      jsonLdHeadline: articleLd.headline,
      jsonLdDescription: articleLd.description,
      dateModified: articleLd.dateModified,
    },
    heroSubtitle,
    heroImage,
    statBlock,
    connections,
    faq,
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
  console.log(`Extracted ${ok}/${slugs.length} activity entries into build/data/activities/`);
  if (errors.length) {
    console.log(`\n${errors.length} FAILED:`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main();
