'use strict';

// Verification-only script for the pilot: compares every generated vehicle
// page against the live production page it should reproduce, line by line,
// and reports a per-file diff count so real regressions are easy to spot
// among expected cosmetic noise (e.g. reveal-stagger class placement).

const fs = require('fs');
const path = require('path');

const LIVE_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', 'vehicles');
const OUT_ROOT = path.join(__dirname, 'output', 'vehicles');

function diffLines(a, b) {
  const la = a.split('\n');
  const lb = b.split('\n');
  const max = Math.max(la.length, lb.length);
  const diffs = [];
  for (let i = 0; i < max; i++) {
    if (la[i] !== lb[i]) {
      diffs.push({ line: i + 1, live: la[i] ?? '(missing)', built: lb[i] ?? '(missing)' });
    }
  }
  return diffs;
}

function main() {
  const slugs = fs.readdirSync(OUT_ROOT);
  const results = [];
  for (const slug of slugs) {
    const livePath = path.join(LIVE_ROOT, slug, 'index.html');
    const builtPath = path.join(OUT_ROOT, slug, 'index.html');
    if (!fs.existsSync(livePath)) {
      results.push({ slug, status: 'NO LIVE PAGE' });
      continue;
    }
    const live = fs.readFileSync(livePath, 'utf8');
    const built = fs.readFileSync(builtPath, 'utf8');
    const diffs = diffLines(live, built);
    results.push({ slug, diffCount: diffs.length, diffs });
  }

  const identical = results.filter((r) => r.diffCount === 0);
  const differing = results.filter((r) => r.diffCount > 0).sort((a, b) => a.diffCount - b.diffCount);

  console.log(`${identical.length}/${results.length} byte-for-byte identical.`);
  console.log(`${differing.length} with differences:\n`);
  for (const r of differing) {
    console.log(`--- ${r.slug} (${r.diffCount} line diff${r.diffCount === 1 ? '' : 's'}) ---`);
    for (const d of r.diffs.slice(0, 4)) {
      console.log(`  L${d.line}`);
      console.log(`    live:  ${d.live.slice(0, 160)}`);
      console.log(`    built: ${d.built.slice(0, 160)}`);
    }
    if (r.diffs.length > 4) console.log(`  ...and ${r.diffs.length - 4} more line(s)`);
    console.log('');
  }
}

main();
