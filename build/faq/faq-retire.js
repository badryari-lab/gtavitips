// Retire FAQ pages that lost their purpose after launch: 301 to the follow-up page, swap inbound links to the target,
// drop the index item, search entry and sitemap url. New redirect rules go ABOVE the splat block (Cloudflare dynamic limit).
// Usage (repo root): node build/faq/faq-retire.js [--dry]
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DRY = process.argv.includes('--dry'), ROOT = process.cwd();
// Run 1 (Nov 20 2026): how-to-pre-load-gta-6, gta-6-pre-order-payment-timing, gta-6-pre-order, gta-6-early-access,
// gta-6-launch-night-checklist. Run 2: when-can-you-pre-load-gta-6. Edit MAP for the next run.
const MAP = {
  'when-can-you-pre-load-gta-6': '/faq/gta-6-download-size',
};
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8'), wr = (p, s) => { if (!DRY) fs.writeFileSync(path.join(ROOT, p), s); };
for (const t of Object.values(MAP)) if (!fs.existsSync(path.join(ROOT, 'hub' + t, 'index.html'))) throw new Error('target missing ' + t);
const re = s => new RegExp(`/faq/${s}(?![a-z0-9-])`, 'g');
const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['output', '.git'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = [...walk('build/data'), ...walk('hub')].filter(f => /\.(md|html|json|xml|txt)$/.test(f) && !Object.keys(MAP).some(s => f.replace(/\\/g, '/').includes(`hub/faq/${s}/`)));
const st = { swapped: 0, indexItems: 0, search: 0, sitemap: 0, moreDupes: 0 };
for (const f of files) {
  const raw = rd(f); let t = raw;
  if (f.replace(/\\/g, '/').endsWith('hub/faq/index.html')) {
    for (const s of Object.keys(MAP)) t = t.replace(new RegExp(`      <div class="faq-item"(?:(?!      <div class="faq-item")[\\s\\S])*?href="/faq/${s}"[\\s\\S]*?\\n      </div>\\n(?=      <div class="faq-item"|    </section>)`), () => { st.indexItems++; return ''; });
  }
  if (f.endsWith('sitemap.xml')) for (const s of Object.keys(MAP)) t = t.replace(new RegExp(`\\s*<url>\\s*<loc>https://gtavitips\\.com/faq/${s}</loc>[\\s\\S]*?</url>`), () => { st.sitemap++; return ''; });
  if (f.endsWith('search-index.json')) { const a = JSON.parse(t); const b = a.filter(x => !Object.keys(MAP).some(s => x.u === '/faq/' + s)); st.search += a.length - b.length; if (b.length !== a.length) t = JSON.stringify(b); }
  for (const [s, to] of Object.entries(MAP)) t = t.replace(re(s), () => { st.swapped++; return to; });
  t = t.replace(/(<div class="related-grid reveal">)([\s\S]*?)(\n          <\/div>)/, (m, a, body, c) => { const seen = new Set(); const out = body.replace(/\n            <a href="([^"]+)" class="related-link">[\s\S]*?<\/a>/g, (blk, href) => { if (seen.has(href)) { st.moreDupes++; return ''; } seen.add(href); return blk; }); return a + out + c; });
  if (t !== raw) wr(f, t);
}
let idx = DRY ? null : rd('hub/faq/index.html');
let visCount = 'n/a';
if (idx) {
  const strip = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const vis = [...idx.matchAll(/<span class="faq-btn__q">([\s\S]*?)<\/span>[\s\S]*?<div class="faq-answer__inner">\s*<p>([\s\S]*?)<\/p>/g)].map(m => ({ '@type': 'Question', name: strip(m[1]), acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) } }));
  idx = idx.replace(/(<script type="application\/ld\+json">\s*)(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?)(\s*<\/script>)/, (m, a, b, c) => a + JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: vis }) + c);
  wr('hub/faq/index.html', idx); visCount = vis.length;
}
let red = rd('hub/_redirects'); const nl = red.includes('\r\n') ? '\r\n' : '\n';
{
  const have = new Set(red.split(/\r?\n/).map(l => l.trim().split(/\s+/)[0]));
  const lines = Object.entries(MAP).filter(([s]) => !have.has('/faq/' + s)).map(([s, t]) => `/faq/${s}`.padEnd(50) + t.padEnd(46) + '301');
  if (lines.length) {
    const at = red.indexOf('# --- Dynamic (splat) rules'); if (at < 0) throw new Error('splat block marker missing');
    red = red.slice(0, at) + '# --- FAQ retirement (Nov 20 2026) ---' + nl + lines.join(nl) + nl + nl + red.slice(at); wr('hub/_redirects', red);
  }
}
if (!DRY) for (const s of Object.keys(MAP)) cp.execSync(`git rm -rqf "hub/faq/${s}"`, { cwd: ROOT });
console.log(st, 'index items now', visCount, DRY ? 'dry' : 'done');
