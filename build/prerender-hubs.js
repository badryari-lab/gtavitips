'use strict';

// Pre-renders the JS-built card grids of the category hub pages into static HTML.
//
// Why: the hubs (/gameplay/brands, /vehicles, ...) fill an empty <div id="x-grid">
// from /assets/data/x.json in the browser. A crawler that does not run JS saw no
// links to any entry (Ahrefs Site Audit, 25 Oct 2026: orphan pages, pages with a
// single incoming link). This script runs each hub's own render code against its
// own JSON and writes the resulting markup between marker comments, so the page
// ships real <a href> links. The page's JS still runs on load and replaces the
// grid with identical markup, so nothing changes for visitors.
//
// Usage (repo root):  node build/prerender-hubs.js          (writes)
//                     node build/prerender-hubs.js --dry    (reports only)
// Re-run after editing any hub JSON in hub/assets/data/.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DRY = process.argv.includes('--dry');
const HUBS = [
  { page: 'hub/gameplay/animals/index.html', grid: 'animals-grid' },
  { page: 'hub/gameplay/brands/index.html', grid: 'brands-grid' },
  { page: 'hub/gameplay/characters/index.html', grid: 'characters-grid' },
  { page: 'hub/gameplay/gangs-and-factions/index.html', grid: 'factions-grid' },
  { page: 'hub/gameplay/locations/index.html', grid: 'locations-grid' },
  { page: 'hub/gameplay/vehicles/index.html', grid: 'vehicles-grid' },
  // The news hub keeps a stale hand-written card list inside the grid; the page's
  // own script replaces it from news.json. `scriptStart` names a function that
  // sits at the top of that script so we can find its IIFE.
  { page: 'hub/news/index.html', grid: 'news-grid', scriptStart: 'function thumbHTML', replaceAll: true },
];
const START = '<!--prerender:start-->';
const END = '<!--prerender:end-->';

async function render(html, gridId, scriptStart) {
  // Find the IIFE that owns the grid.
  const marker = `getElementById('${gridId}')`;
  const at = html.indexOf(marker);
  if (at < 0) throw new Error(`no script for ${gridId}`);
  const from = scriptStart ? html.indexOf(scriptStart) : at;
  if (from < 0) throw new Error(`no script start for ${gridId}`);
  const re = /\(function\s*\(\s*\)\s*\{/g;
  let start = -1, m;
  while ((m = re.exec(html)) && m.index < from) start = m.index;
  if (start < 0) throw new Error(`no IIFE for ${gridId}`);
  const end = html.indexOf('})();', at) + 5;
  const code = html.slice(start, end);

  const grid = { innerHTML: '' };
  const sandbox = {
    document: {
      getElementById: (id) => (id === gridId ? grid : null),
      querySelectorAll: () => ({ forEach() {} }),
      createElement: () => ({}),
    },
    ro: { observe() {} },
    Array,
    fetch: (url) => {
      const file = path.join('hub', url.split('?')[0]);
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      return Promise.resolve({ json: () => Promise.resolve(data) });
    },
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  // Let the fetch().then() chain finish.
  for (let i = 0; i < 20 && !grid.innerHTML; i++) await new Promise((r) => setTimeout(r, 5));
  if (!grid.innerHTML) throw new Error(`render produced nothing for ${gridId}`);
  return grid.innerHTML;
}

(async () => {
  for (const { page, grid, scriptStart } of HUBS) {
    let html = fs.readFileSync(page, 'utf8');
    const inner = await render(html, grid, scriptStart);
    const openRe = new RegExp(`<div[^>]*id="${grid}"[^>]*>`);
    const om = openRe.exec(html);
    if (!om) throw new Error(`no container ${grid} in ${page}`);
    const from = om.index + om[0].length;
    // find the matching </div> by depth counting
    let depth = 1, p = from;
    const tag = /<div\b|<\/div>/g;
    tag.lastIndex = from;
    let tm;
    while ((tm = tag.exec(html))) {
      depth += tm[0] === '</div>' ? -1 : 1;
      if (depth === 0) { p = tm.index; break; }
    }
    if (depth !== 0) throw new Error(`unbalanced container ${grid}`);
    const next = html.slice(0, from) + START + inner + END + html.slice(p);
    const links = (inner.match(/<a href=/g) || []).length;
    console.log(`${DRY ? 'dry ' : ''}${page}: ${links} entry links`);
    if (!DRY) fs.writeFileSync(page, next);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
