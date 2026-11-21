'use strict';
// IndexNow submitter (Nov 2026). Tells Bing (and Yandex, Seznam, Naver) about new or changed URLs right away.
// Google does not use IndexNow; it reads sitemap.xml.
// Usage:
//   node build/indexnow.js --since 2026-11-21     every sitemap URL with lastmod on/after that date
//   node build/indexnow.js /story /gameplay/collectibles   specific paths
//   add --dry to print the count without sending
// Run AFTER the push is live (the key file must be reachable at https://gtavitips.com/<key>.txt).
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOST = 'gtavitips.com';
const KEY = fs.readdirSync(path.join(ROOT, 'hub')).map((f) => f.match(/^([a-f0-9]{32})\.txt$/)).find(Boolean)[1];
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const sinceIdx = args.indexOf('--since');

let urls;
if (sinceIdx >= 0) {
  const since = args[sinceIdx + 1];
  const sm = fs.readFileSync(path.join(ROOT, 'hub/sitemap.xml'), 'utf8');
  urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].filter((m) => m[2] >= since).map((m) => m[1]);
} else {
  urls = args.filter((a) => a.startsWith('/')).map((p) => `https://${HOST}${p}`);
}
if (!urls.length) { console.log('no URLs'); process.exit(0); }
if (urls.length > 10000) urls = urls.slice(0, 10000); // IndexNow limit per request

(async () => {
  if (dry) { console.log(`dry run: ${urls.length} URL(s)`); return; }
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
  });
  // 200 = received, 202 = received, key validation pending. 403 = key not found/invalid, 422 = URLs not on host.
  console.log(`IndexNow: ${urls.length} URL(s) -> HTTP ${res.status}`);
})();
