'use strict';

// Generic verification diff: compares every generated page in a category
// against its live original, both whitespace-normalized (collapse runs of
// whitespace to one space, trim between tags) so formatting-only differences
// between "vintages" of hand-written files don't drown out real content
// differences. Reports a real unified diff on the normalized text.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const category = process.argv[2];
if (!category) {
  console.error('Usage: node build/diff.js <category>');
  process.exit(1);
}

const LIVE_ROOT = path.join(__dirname, '..', 'hub', 'gameplay', category);
const OUT_ROOT = path.join(__dirname, 'output', category);

function normalize(html) {
  return html
    .replace(/\r/g, '')
    // Collapse ALL whitespace runs (including newlines) to a single space first,
    // so prose text wrapped across physical lines in some file "vintages" joins
    // back into one line matching the minified form other vintages use —
    // otherwise a wrapped paragraph falsely looks "missing" in a line diff.
    .replace(/\s+/g, ' ')
    .replace(/> </g, '>\n<')
    .trim();
}

function main() {
  const slugs = fs.readdirSync(OUT_ROOT);
  const results = [];
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtavi-diff-'));
  for (const slug of slugs) {
    const livePath = path.join(LIVE_ROOT, slug, 'index.html');
    const builtPath = path.join(OUT_ROOT, slug, 'index.html');
    if (!fs.existsSync(livePath)) {
      results.push({ slug, status: 'NO LIVE PAGE', diffCount: Infinity });
      continue;
    }
    const liveNorm = normalize(fs.readFileSync(livePath, 'utf8'));
    const builtNorm = normalize(fs.readFileSync(builtPath, 'utf8'));
    const liveFile = path.join(tmpDir, 'live.html');
    const builtFile = path.join(tmpDir, 'built.html');
    fs.writeFileSync(liveFile, liveNorm);
    fs.writeFileSync(builtFile, builtNorm);
    let diffOut = '';
    try {
      execSync(`diff -u "${liveFile}" "${builtFile}"`, { encoding: 'utf8' });
    } catch (err) {
      diffOut = err.stdout || '';
    }
    const diffLines = diffOut.split('\n').filter((l) => /^[+-]/.test(l) && !/^[+-]{3} /.test(l));

    // Set-based pass: are the same lines present, just reordered (e.g. CSS
    // rules written in a different order across file "vintages")? Sorting
    // both sides before diffing neutralizes pure reordering, so what's left
    // is real added/removed/changed content.
    const liveSorted = path.join(tmpDir, 'live.sorted.html');
    const builtSorted = path.join(tmpDir, 'built.sorted.html');
    fs.writeFileSync(liveSorted, liveNorm.split('\n').sort().join('\n'));
    fs.writeFileSync(builtSorted, builtNorm.split('\n').sort().join('\n'));
    let sortedDiffOut = '';
    try {
      execSync(`diff -u "${liveSorted}" "${builtSorted}"`, { encoding: 'utf8' });
    } catch (err) {
      sortedDiffOut = err.stdout || '';
    }
    const sortedDiffLines = sortedDiffOut.split('\n').filter((l) => /^[+-]/.test(l) && !/^[+-]{3} /.test(l));

    results.push({ slug, diffCount: diffLines.length, diff: diffOut, realDiffCount: sortedDiffLines.length, realDiff: sortedDiffOut });
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });

  results.sort((a, b) => b.realDiffCount - a.realDiffCount);
  const identical = results.filter((r) => r.realDiffCount === 0);
  const differing = results.filter((r) => r.realDiffCount > 0);
  console.log(`${identical.length}/${results.length} identical content (order/whitespace ignored).`);
  console.log(`${differing.length} with real added/removed/changed lines:\n`);
  for (const r of differing) {
    console.log(`=== ${r.slug} (${r.realDiffCount} real diff lines, ${r.diffCount} before reorder-normalizing) ===`);
    console.log(r.realDiff || r.status);
    console.log('');
  }
}

main();
