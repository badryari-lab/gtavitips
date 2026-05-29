// Updates the search overlay on every page in hub/:
//  1. Adds results container + updated hint to the HTML
//  2. Adds result CSS after the existing search overlay CSS
//  3. Replaces the old search JS with client-side filtering logic

const fs   = require('fs');
const path = require('path');

const HUB = 'C:\\Users\\HP Omen\\Documents\\GitHub\\gtavitips\\hub';

// ─── NEW CSS (appended after existing .search-overlay__hint kbd rule) ──────────
const NEW_CSS = `
    .search-overlay__results{margin-top:14px;display:flex;flex-direction:column;gap:3px;max-height:300px;overflow-y:auto;}
    .search-result{display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;text-decoration:none;transition:border-color .15s,background .15s;}
    .search-result.active,.search-result:hover{border-color:var(--blue-border);background:var(--bg-4);}
    .search-result__cat{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--blue);background:var(--blue-dim);padding:2px 7px;border-radius:99px;flex-shrink:0;white-space:nowrap;}
    .search-result__body{flex:1;min-width:0;}
    .search-result__name{font-size:13px;font-weight:600;color:var(--t1);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .search-overlay__nores{font-size:12px;color:var(--t3);padding:20px 0;text-align:center;}`;

// ─── NEW SEARCH JS ────────────────────────────────────────────────────────────
const NEW_JS = `const overlay=document.getElementById('search-overlay'),searchInp=document.getElementById('search-input'),searchRes=document.getElementById('search-results');
    let _idx=[],_ai=-1,_loaded=false;
    function _load(){if(_loaded)return;fetch('/search-index.json').then(r=>r.json()).then(d=>{_idx=d;_loaded=true;}).catch(()=>{_idx=[];_loaded=true;});}
    function openSearch(){overlay.classList.add('open');setTimeout(()=>searchInp.focus(),60);_load();}
    function closeSearch(){overlay.classList.remove('open');searchRes.innerHTML='';searchInp.value='';_ai=-1;}
    function _render(q){
      if(!q||q.length<2){searchRes.innerHTML='';return;}
      const ql=q.toLowerCase();
      const hits=_idx.filter(e=>e.n.toLowerCase().includes(ql)||e.d.toLowerCase().includes(ql)).slice(0,8);
      if(!hits.length){searchRes.innerHTML='<p class="search-overlay__nores">No results for \\''+q.replace(/'/g,'&#39;')+'\\'</p>';return;}
      searchRes.innerHTML=hits.map((e,i)=>'<a href="'+e.u+'" class="search-result'+(i===0?' active':'')+'" data-i="'+i+'"><span class="search-result__cat">'+e.c+'</span><span class="search-result__body"><span class="search-result__name">'+e.n+'</span></span></a>').join('');
      _ai=0;
    }
    document.getElementById('search-open').addEventListener('click',openSearch);
    document.getElementById('search-close').addEventListener('click',closeSearch);
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeSearch();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();}});
    searchInp.addEventListener('input',e=>{_render(e.target.value.trim());});
    searchInp.addEventListener('keydown',e=>{
      const items=searchRes.querySelectorAll('.search-result');
      if(e.key==='ArrowDown'){e.preventDefault();if(_ai<items.length-1){items[_ai]&&items[_ai].classList.remove('active');_ai++;items[_ai]&&(items[_ai].classList.add('active'),items[_ai].scrollIntoView({block:'nearest'}));}}
      else if(e.key==='ArrowUp'){e.preventDefault();if(_ai>0){items[_ai]&&items[_ai].classList.remove('active');_ai--;items[_ai]&&(items[_ai].classList.add('active'),items[_ai].scrollIntoView({block:'nearest'}));}}
      else if(e.key==='Enter'){if(items[_ai])window.location.href=items[_ai].getAttribute('href');else{const q=searchInp.value.trim();if(q)window.open('https://www.google.com/search?q=site:gtavitips.com+'+encodeURIComponent(q),'_blank');}}
    });`;

// ─── NEW HTML HINT (replaces the existing hint paragraph) ────────────────────
const OLD_HINT = `<p class="search-overlay__hint">Press <kbd>Enter</kbd> to search &nbsp;&middot;&nbsp; <kbd>Esc</kbd> to close</p>`;
const NEW_HINT = `<div class="search-overlay__results" id="search-results"></div>
      <p class="search-overlay__hint">↑↓ to navigate &nbsp;&middot;&nbsp; <kbd>Enter</kbd> to open &nbsp;&middot;&nbsp; <kbd>Esc</kbd> to close</p>`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function walkHtml(dir) {
  const files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files.push(...walkHtml(full));
    else if (item === 'index.html') files.push(full);
  }
  return files;
}

let updated = 0, skipped = 0;

for (const file of walkHtml(HUB)) {
  let html = fs.readFileSync(file, 'utf-8');

  // Skip pages that don't have the search overlay
  if (!html.includes('id="search-overlay"')) { skipped++; continue; }

  // Skip pages already updated (results container already present)
  if (html.includes('search-overlay__results')) { skipped++; continue; }

  let changed = false;

  // 1. HTML: insert results div + update hint
  if (html.includes(OLD_HINT)) {
    html = html.replace(OLD_HINT, NEW_HINT);
    changed = true;
  }

  // 2. CSS: append result styles after the search CSS block
  //    Anchor: the kbd rule inside .search-overlay__hint kbd (handles both formatted & minified)
  const cssAnchorRe = /(\.(search-overlay__hint)\s+kbd\s*\{[^}]+\})/;
  if (cssAnchorRe.test(html)) {
    html = html.replace(cssAnchorRe, (match) => match + NEW_CSS);
    changed = true;
  }

  // 3. JS: replace the old search block
  //    Match from "const overlay" through the window.open/Enter handler to just before "const ro"
  const jsRe = /const overlay[\s\S]*?'_blank'[^;]*;?\s*\}\s*\}\s*\);\s*(?=const ro\b)/;
  if (jsRe.test(html)) {
    html = html.replace(jsRe, NEW_JS + '\n    ');
    changed = true;
  } else {
    // Minified variant: ends with }});  (no space between the three closing tokens)
    const jsReMini = /const overlay[\s\S]*?'_blank'[^}]*\}\}\);\s*(?=const ro\b)/;
    if (jsReMini.test(html)) {
      html = html.replace(jsReMini, NEW_JS + '\n    ');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, html, 'utf-8');
    updated++;
  } else {
    console.warn('  WARN: could not fully update', path.relative(HUB, file));
    skipped++;
  }
}

console.log(`Done. Updated: ${updated} | Skipped/already up-to-date: ${skipped}`);
