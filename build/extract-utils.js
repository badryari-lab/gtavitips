'use strict';

// Shared helper for the one-time migration scripts: finds the <div>...</div>
// matching a given opening tag by counting nesting depth, rather than
// guessing a fixed number of consecutive closing tags (which breaks
// whenever inner content happens to end with its own closing tags lined up
// the same way — confirmed on animals' stat-block when an item's last field
// is a sub-div, closing right before the item itself closes).

// openTagEndIndex: index right after the '>' of the opening <div ...> tag.
// Returns the index of the matching </div>'s '<'.
function findMatchingDivClose(html, openTagEndIndex) {
  let depth = 1;
  let i = openTagEndIndex;
  while (depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose === -1) throw new Error('Unbalanced <div> — no matching </div> found');
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      i = nextClose + 6;
    }
  }
  return i - 6;
}

// Finds `<div class="X"...>` starting the search at `from`, and returns its
// full inner content up to the matching </div>, plus the index just past
// that </div> (for chaining further searches).
function extractDivContent(html, classMarker, from = 0) {
  const openStart = html.indexOf(classMarker, from);
  if (openStart === -1) return null;
  const openEnd = html.indexOf('>', openStart) + 1;
  const closeStart = findMatchingDivClose(html, openEnd);
  return { content: html.slice(openEnd, closeStart), nextIndex: closeStart + 6 };
}

module.exports = { findMatchingDivClose, extractDivContent };
