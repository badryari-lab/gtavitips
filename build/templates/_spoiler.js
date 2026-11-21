'use strict';

// Shared spoiler component (Nov 2026): one reveal pattern for characters, missions, the story hub and locations.
// Markup + CSS identical to build/faq/faq-gen.js. Story text only ever goes inside renderSpoiler, never into meta/JSON-LD.
const { renderBlock, renderInline } = require('./_markdown');

const SPOILER_NOTE = 'Light story spoilers on this page. The big moments sit behind a click, and nothing opens until you do.';
const SPOILER_CSS = `
    .spoiler-note { font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; line-height: 1.5; color: var(--amber); background: var(--amber-dim); border: 1px solid var(--amber-border); border-radius: 8px 2px 8px 2px; padding: 10px 14px; margin-bottom: 16px; }
    .spoiler { margin-top: 14px; background: var(--bg-3); border: 1px dashed var(--amber-border); border-radius: 8px 2px 8px 2px; }
    .spoiler > summary { list-style: none; cursor: pointer; min-height: 44px; padding: 10px 14px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; line-height: 1.4; color: var(--t2); }
    .spoiler > summary::-webkit-details-marker { display: none; }
    .spoiler > summary:focus-visible { outline: 2px solid var(--amber); outline-offset: 2px; }
    .spoiler__stamp { display: inline-block; padding: 4px 10px; color: var(--amber); background: var(--amber-dim); border: 1px solid var(--amber-border); border-radius: 6px 2px 6px 2px; transform: rotate(-1.2deg); }
    .spoiler__hint::after { content: ' +'; color: var(--amber); }
    .spoiler[open] .spoiler__hint::after { content: ' \\2212'; }
    .spoiler__body { padding: 2px 14px 14px; font-size: 13px; color: var(--t2); line-height: 1.75; }
    .spoiler__body p { margin-bottom: 0; }
    .spoiler__body p + p { margin-top: 10px; }
    .spoiler__body strong { color: var(--t1); font-weight: 600; }
    .faq-item__a .spoiler { margin-top: 12px; }
    .story-arc .spoiler + .spoiler { margin-top: 10px; }
    .story-arc__source, .stat-source { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-top: 14px; }
    .stat-source { margin-top: 12px; }`;
const STAT_SOURCE_CSS = `
    .stat-source { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--t3); margin-top: 12px; }`;

const spoilerLabel = (c) => (typeof c === 'number' ? `Chapter ${c}` : String(c));
function renderSpoiler(sp, ind) {
  if (!sp || sp.chapter === undefined || sp.chapter === '' || !(sp.html || sp.md)) throw new Error('spoiler needs chapter and html or md');
  // md: Markdown paragraphs (blank-line separated), same converter as the Dossier body; html: raw or inline text.
  const body = sp.md ? renderBlock(sp.md) : /^\s*<p[ >]/.test(sp.html) ? sp.html : `<p>${renderInline(sp.html)}</p>`;
  return `<details class="spoiler">
${ind}  <summary><span class="spoiler__stamp">Spoiler: ${spoilerLabel(sp.chapter)}</span> <span class="spoiler__hint">Tap to reveal</span></summary>
${ind}  <div class="spoiler__body">${body}</div>
${ind}</details>`;
}

module.exports = { SPOILER_NOTE, SPOILER_CSS, STAT_SOURCE_CSS, spoilerLabel, renderSpoiler };
