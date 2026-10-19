'use strict';

// GTAVITIPS static build script. Zero npm dependencies by design (see
// CLAUDE.md: no external libraries, no build step for the deployed site —
// this tool only runs locally and its *output* is the same plain static
// HTML the site has always shipped).
//
// Usage: node build/build.js [category]
//   node build/build.js vehicles   -> builds build/data/vehicles/*.md into build/output/vehicles/<slug>/index.html
//   node build/build.js            -> builds every category that has a template

const fs = require('fs');
const path = require('path');

const DATA_ROOT = path.join(__dirname, 'data');
const OUTPUT_ROOT = path.join(__dirname, 'output');
const TEMPLATES_ROOT = path.join(__dirname, 'templates');

// Splits "<JSON frontmatter>\n---\n<markdown body>" into { data, body }.
function parseEntryFile(raw) {
  const sepIndex = raw.indexOf('\n---\n');
  if (sepIndex === -1) {
    throw new Error('Entry file missing "---" separator between JSON frontmatter and Markdown body');
  }
  const frontmatterRaw = raw.slice(0, sepIndex).trim();
  const body = raw.slice(sepIndex + 5);
  let data;
  try {
    data = JSON.parse(frontmatterRaw);
  } catch (err) {
    throw new Error(`Invalid JSON frontmatter: ${err.message}`);
  }
  return { data, body };
}

function buildCategory(category) {
  const templatePath = path.join(TEMPLATES_ROOT, `${category}.js`);
  if (!fs.existsSync(templatePath)) {
    console.log(`  (skipping "${category}" — no template at build/templates/${category}.js yet)`);
    return { built: 0 };
  }
  const template = require(templatePath);

  const dataDir = path.join(DATA_ROOT, category);
  if (!fs.existsSync(dataDir)) {
    console.log(`  (skipping "${category}" — no build/data/${category}/ directory yet)`);
    return { built: 0 };
  }

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.md'));
  let built = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
    let entry, body;
    try {
      ({ data: entry, body } = parseEntryFile(raw));
    } catch (err) {
      console.error(`  ERROR in ${category}/${file}: ${err.message}`);
      continue;
    }
    entry.slug = entry.slug || slug;
    entry.proseHtml = template.renderProse(body);

    const html = template.render(entry);
    const outDir = path.join(OUTPUT_ROOT, category, entry.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    built++;
  }
  console.log(`  ${category}: built ${built} page(s) -> build/output/${category}/`);
  return { built };
}

function main() {
  const requested = process.argv[2];
  const categories = requested ? [requested] : fs.readdirSync(DATA_ROOT).filter((f) => fs.statSync(path.join(DATA_ROOT, f)).isDirectory());

  console.log('GTAVITIPS build');
  let total = 0;
  for (const category of categories) {
    const { built } = buildCategory(category);
    total += built;
  }
  console.log(`Done. ${total} page(s) built into build/output/.`);
}

main();
