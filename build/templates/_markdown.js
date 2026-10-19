'use strict';

// Hand-written, zero-dependency Markdown subset — exactly what GTAVITIPS entry
// copy actually uses: **bold** and [text](url) links, nothing else. Internal
// links (url starting with "/") automatically get the site's blue-span treatment
// per CLAUDE.md; external links open in a new tab. This file is the only place
// that convention lives, so it can never drift between pages again.

function renderInline(str) {
  if (!str) return '';
  let out = String(str);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const isInternal = url.startsWith('/');
    const styleAttr = isInternal ? ' style="color:var(--blue)"' : '';
    const targetAttr = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<a href="${url}"${styleAttr}${targetAttr}>${text}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

// Blank-line-separated paragraphs -> <p> tags, each run through renderInline.
function renderBlock(markdown) {
  if (!markdown) return '';
  const paragraphs = markdown
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\s*\n\s*/g, ' '))
    .filter(Boolean);
  return paragraphs.map((p) => `<p>${renderInline(p)}</p>`).join('');
}

// Reverse direction, used only by the one-time migration/extraction script:
// turns already-rendered HTML (<a>, <strong>, <p>) back into the Markdown
// source an author would have typed, so migrated data files read the same
// way a hand-authored new entry would.
function htmlToMarkdownInline(html) {
  if (!html) return '';
  let out = String(html);
  out = out.replace(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/g, '[$2]($1)');
  out = out.replace(/<strong>([^<]*)<\/strong>/g, '**$1**');
  return out;
}

function htmlToMarkdownBlock(html) {
  if (!html) return '';
  const paragraphs = [...String(html).matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  return paragraphs.map((p) => htmlToMarkdownInline(p)).join('\n\n');
}

module.exports = { renderInline, renderBlock, htmlToMarkdownInline, htmlToMarkdownBlock };
