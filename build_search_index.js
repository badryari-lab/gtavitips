const fs   = require('fs');
const path = require('path');

const HUB = 'C:\\Users\\HP Omen\\Documents\\GitHub\\gtavitips\\hub';
const OUT = path.join(HUB, 'search-index.json');

// Standalone hub pages that aren't part of a repeated template (news article,
// database entry, FAQ) but are still real content worth surfacing in search.
// Add new ones here explicitly - don't widen a regex, since most top-level
// pages (privacy, cookie-policy, about) are navigation/legal, not searchable content.
const STANDALONE_PAGES = {
  '/timeline': 'page',
  '/trailers': 'page',
  '/map': 'page',
  '/intel-drops': 'page',
};

function category(url) {
  if (/\/gameplay\/characters\/.+/.test(url))        return 'character';
  if (/\/gameplay\/vehicles\/.+/.test(url))           return 'vehicle';
  if (/\/gameplay\/locations\/.+/.test(url))          return 'location';
  if (/\/gameplay\/weapons\/.+/.test(url))            return 'weapon';
  if (/\/gameplay\/animals\/.+/.test(url))            return 'animal';
  if (/\/gameplay\/brands\/.+/.test(url))             return 'brand';
  if (/\/gameplay\/gangs-and-factions\/.+/.test(url)) return 'faction';
  if (/\/gameplay\/activities\/.+/.test(url))         return 'activity';
  if (/\/faq\/.+/.test(url))                         return 'faq';
  if (/\/news\/.+/.test(url))                        return 'news';
  if (STANDALONE_PAGES[url])                         return STANDALONE_PAGES[url];
  return null; // remaining index/hub pages — skip
}

function extract(html) {
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const desc  = (html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || [])[1] || '';
  const name  = title.split('|')[0].trim();
  return { name, desc };
}

function walk(dir, rel = '') {
  const entries = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      entries.push(...walk(full, rel + '/' + item));
    } else if (item === 'index.html') {
      const url = rel || '/';
      const cat = category(url);
      if (cat) {
        const { name, desc } = extract(fs.readFileSync(full, 'utf-8'));
        if (name) entries.push({ n: name, u: url, d: desc, c: cat });
      }
    }
  }
  return entries;
}

const index = walk(HUB);
fs.writeFileSync(OUT, JSON.stringify(index), 'utf-8');
console.log(`search-index.json: ${index.length} entries`);
