// Builds the "Full Arsenal" section for hub/gameplay/weapons/index.html from the scraped IGN Official Guide table.
// Usage: node arsenal.js <ign-weapons-table.json> <hub weapons index.html> [--dry]
// Re-runnable: CSS lives between <!--arsenal-css:start/end--> in <head>, markup between <!--arsenal:start/end--> after </main>.
const fs = require('fs');
const [SRC, PAGE] = process.argv.slice(2); const DRY = process.argv.includes('--dry');
let d = JSON.parse(fs.readFileSync(SRC, 'utf8')); if (typeof d === 'string') d = JSON.parse(d);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; };

const rows = d.filter(r => !/Fully Modded/.test(r[0]));
const guns = rows.filter(r => num(r[4]) !== null);
const isStd = r => r[0] === 'Deever Tech GLR40' || (r[12] && r[12] !== 'N/A');
const std = guns.filter(isStd), variants = guns.filter(r => !isStd(r));
const MELEE_STD = ['Baton', 'Brass Knuckles', 'Bushcraft Knife', 'Combat Knife', 'Diving Knife', 'EDC Knife', 'Hunting Knife', 'Survival Knife', 'Switchblade'];
const melee = rows.filter(r => num(r[4]) === null && /Melee|Knife|Switchblade/.test(r[3]));
const meleeStd = melee.filter(r => MELEE_STD.includes(r[0])), meleeVar = melee.filter(r => !MELEE_STD.includes(r[0]));
const expl = rows.filter(r => r[3] === 'Explosives');
if (std.length !== 53 || meleeStd.length !== 9 || expl.length !== 4) throw new Error(`counts off: std ${std.length}, melee ${meleeStd.length}, expl ${expl.length}`);

const LINKS = { 'Fortune & Son Moreland 850': 'fortune-and-son-moreland-850', 'Hauners H-AT': 'hauners-h-at', 'Wortham W-10': 'wortham-w-10', 'Zhang Wu Type 9': 'zhang-wu-type-9', 'Duke 556': 'duke-556', 'Scorpio Akulus': 'scorpio-akulus', 'Hawk & Little Morgan': 'hawk-little-morgan-revolvers', 'Frag Grenade': 'frag-grenade', 'Sticky Bomb': 'sticky-bomb', 'Molotov': 'molotov', 'Flash Grenade': 'flash-grenade', 'Combat Knife': 'combat-knife' , 'Klose K17': 'klose-k17', 'Vom Feuer VF5C': 'vom-feuer-vf5c', 'Fortune & Son Laird 350': 'fortune-and-son-laird-350', 'AdB FRA': 'adb-fra', 'Goodwin LMG 6': 'goodwin-lmg-6', 'Kozlov KZ-59': 'kozlov-kz-59'};
const name = n => LINKS[n] ? `<a href="/gameplay/weapons/${LINKS[n]}">${esc(n)}</a>` : esc(n);
const STORE = { 'Standard': 'Standard', 'Standard or Hunting': 'Standard, Hunting', 'Expanded Only': 'Expanded', 'Expanded or Hunting': 'Expanded, Hunting', 'Hunting Only': 'Hunting' };
const CLS = { 'Pistol': 'pistol', 'Revolver': 'revolver', 'Submachine Gun': 'smg', 'Shotgun': 'shotgun', 'Assault Rifle': 'ar', 'Tactical Rifle': 'tactical', 'Sniper Rifle': 'sniper', 'Small Game Rifle': 'smallgame', 'Machine Gun': 'mg', 'Launcher': 'launcher', 'Grenade Launcher': 'launcher' };
const ORDER = ['Pistol', 'Revolver', 'Submachine Gun', 'Shotgun', 'Assault Rifle', 'Tactical Rifle', 'Sniper Rifle', 'Small Game Rifle', 'Machine Gun', 'Launcher', 'Grenade Launcher'];
const sortRows = a => a.slice().sort((x, y) => ORDER.indexOf(x[3]) - ORDER.indexOf(y[3]) || num(y[4]) - num(x[4]) || x[0].localeCompare(y[0]));
const stat = v => { const n = num(v); return n === null ? '<td data-v="-1">n/a</td>' : `<td data-v="${n}"><span class="ars-stat"><b>${n.toFixed(1)}</b><i style="width:${n * 10}%"></i></span></td>`; };
const tr = (r, store) => {
  const mag = num(r[8]);
  return `<tr data-cls="${CLS[r[3]]}"><th scope="row" data-v="${esc(r[0])}">${name(r[0])}<small>${esc([r[2], r[1]].filter(Boolean).join(' · '))}</small></th>`
    + `<td data-v="${ORDER.indexOf(r[3])}">${esc(r[3] === 'Grenade Launcher' ? 'Launcher' : r[3])}</td>`
    + stat(r[4]) + stat(r[5]) + stat(r[6]) + stat(r[7])
    + `<td data-v="${mag || -1}">${mag ? mag : 'n/a'}</td><td>${esc(r[9] || 'n/a')}</td><td>${esc(r[10] || 'n/a')}</td>`
    + (store ? `<td>${esc(STORE[r[12]] || 'Not sold')}</td>` : '') + `</tr>`;
};
const head = store => `<thead><tr><th scope="col"><button type="button" data-k="0">Weapon</button></th><th scope="col"><button type="button" data-k="1">Class</button></th><th scope="col"><button type="button" data-k="2">Damage</button></th><th scope="col"><button type="button" data-k="3">Accuracy</button></th><th scope="col"><button type="button" data-k="4">Handling</button></th><th scope="col"><button type="button" data-k="5">Range</button></th><th scope="col"><button type="button" data-k="6">Mag</button></th><th scope="col">Fire</th><th scope="col">Brand</th>${store ? '<th scope="col">Ammu-Nation</th>' : ''}</tr></thead>`;
const chips = [['all', 'All'], ['pistol', 'Pistols'], ['revolver', 'Revolvers'], ['smg', 'SMGs'], ['shotgun', 'Shotguns'], ['ar', 'Assault Rifles'], ['tactical', 'Tactical'], ['sniper', 'Snipers'], ['smallgame', 'Small Game'], ['mg', 'Machine Guns'], ['launcher', 'Launchers']];
const hitter = std.slice().sort((a, b) => num(b[4]) - num(a[4]))[0];

const CSS = `<!--arsenal-css:start-->
  <style>
    .ars { padding: 8px 0 72px; }
    .ars__intro { font-size: 15px; color: var(--t2); line-height: 1.8; max-width: 760px; margin-bottom: 16px; }
    .ars__intro strong { color: var(--t1); font-weight: 600; }
    .ars__src { display: flex; gap: 12px; align-items: flex-start; background: var(--bg-2); border: 1px solid var(--border-b); border-left: 3px solid var(--blue); border-radius: 4px var(--r) var(--r) 4px; padding: 14px 18px; margin-bottom: 24px; max-width: 760px; font-size: 13px; color: var(--t2); line-height: 1.7; }
    .ars__badge { flex-shrink: 0; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; padding: 4px 10px; border-radius: 6px 2px 6px 2px; background: var(--blue-dim); color: var(--blue); border: 1px solid var(--blue-border); transform: rotate(-1.2deg); }
    .ars__chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .ars__chip { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; padding: 7px 12px; border-radius: 8px 2px 8px 2px; background: var(--bg-3); border: 1px solid var(--border); color: var(--t2); cursor: pointer; }
    .ars__chip[aria-pressed="true"] { background: var(--blue-dim); border-color: var(--blue-border); color: var(--blue); }
    .ars__chip:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
    .ars__scroll { overflow-x: auto; border: 1px solid var(--border-b); border-radius: var(--r) 4px var(--r) 4px; background: var(--bg-2); -webkit-overflow-scrolling: touch; }
    .ars__table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 980px; }
    .ars__table caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .ars__table thead th { background: var(--bg-3); text-align: left; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--t3); padding: 12px; border-bottom: 1px solid var(--border-b); white-space: nowrap; }
    .ars__table thead th:has(button) { padding: 0; }
    .ars__table thead button { font: inherit; letter-spacing: inherit; text-transform: inherit; color: inherit; background: none; border: 0; cursor: pointer; display: block; width: 100%; text-align: left; padding: 12px; }
    .ars__table thead button:focus-visible { outline: 2px solid var(--blue); outline-offset: -2px; }
    .ars__table thead th[aria-sort] button { color: var(--blue); }
    .ars__table thead th[aria-sort="descending"] button::after { content: ' \\2193'; }
    .ars__table thead th[aria-sort="ascending"] button::after { content: ' \\2191'; }
    .ars__table td, .ars__table tbody th { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--t2); vertical-align: middle; white-space: nowrap; }
    .ars__table tbody th { text-align: left; color: var(--t1); font-weight: 600; white-space: normal; min-width: 180px; }
    .ars__table tbody th a { color: var(--blue); text-decoration: none; }
    .ars__table tbody th a:hover { text-decoration: underline; }
    .ars__table tbody th small { display: block; font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--t3); margin-top: 3px; }
    .ars__table tbody tr:hover td, .ars__table tbody tr:hover th { background: var(--bg-3); }
    .ars__table tbody tr[hidden] { display: none; }
    .ars-stat { display: flex; align-items: center; gap: 8px; width: 96px; }
    .ars-stat b { font-family: 'Courier Prime', monospace; font-weight: 700; color: var(--t1); min-width: 26px; font-variant-numeric: tabular-nums; }
    .ars-stat i { display: block; height: 4px; max-width: 56px; background: var(--blue); border-radius: 2px; flex: 0 0 auto; }
    .ars__note { font-size: 12px; color: var(--t3); margin-top: 10px; }
    .ars__h3 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: 22px; text-transform: uppercase; letter-spacing: 0; color: var(--t1); margin: 40px 0 12px; }
    .ars__lists { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .ars__list { background: var(--bg-2); border: 1px solid var(--border-b); border-radius: var(--r) 4px var(--r) 4px; padding: 18px 20px; }
    .ars__list-key { font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--pink); margin-bottom: 10px; }
    .ars__list ul { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0; }
    .ars__list li { font-size: 13px; color: var(--t1); background: var(--bg-3); border: 1px solid var(--border); border-radius: 6px 2px 6px 2px; padding: 5px 10px; }
    .ars__list li a { color: var(--blue); text-decoration: none; }
    .ars__list p { font-size: 12.5px; color: var(--t2); line-height: 1.7; margin-top: 10px; }
    .ars__details { margin-top: 40px; }
    .ars__details summary { cursor: pointer; font-family: 'Anton', sans-serif; font-weight: 400; font-size: 22px; text-transform: uppercase; color: var(--t1); list-style: none; display: flex; align-items: center; gap: 10px; }
    .ars__details summary::-webkit-details-marker { display: none; }
    .ars__details summary::before { content: '+'; font-family: 'Courier Prime', monospace; color: var(--blue); font-size: 20px; width: 16px; }
    .ars__details[open] summary::before { content: '\\2212'; }
    .ars__details > p { font-size: 13.5px; color: var(--t2); line-height: 1.75; margin: 10px 0 14px; max-width: 760px; }
    @media (max-width: 768px) { .ars__lists { grid-template-columns: 1fr; } }
    @media (max-width: 480px) { .ars__src { flex-direction: column; } .ars__table { font-size: 12px; } }
  </style>
  <!--arsenal-css:end-->`;

const HTML = `<!--arsenal:start-->
  <section class="ars" aria-labelledby="arsenal-hd">
    <div class="wrap">
      <h2 class="index-section__h2" id="arsenal-hd">Full <span style="color:var(--blue)">Arsenal</span></h2>
      <p class="ars__intro"><strong>53 guns, 9 melee weapons, 4 explosives.</strong> That is the standard-issue count. Ammu-Nation sells 52 of the guns, but no single store carries them all. The rotary grenade launcher has to be earned. Every number is the weapon menu's own, scored out of 10. Hardest hitter: the ${esc(hitter[0])} at ${num(hitter[4]).toFixed(1)} damage. Tap a column to sort, tap a class to filter.</p>
      
      <div class="ars__chips" role="group" aria-label="Filter by class">${chips.map(([k, l], i) => `<button type="button" class="ars__chip" data-f="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
      <div class="ars__scroll"><table class="ars__table" id="ars-std"><caption>GTA 6 standard-issue guns with in-game menu stats</caption>${head(true)}<tbody>
${sortRows(std).map(r => tr(r, true)).join('\n')}
      </tbody></table></div>
      <p class="ars__note">Unmodded weapons. Mag is rounds per magazine, Fire is the trigger mode, and Standard, Expanded and Hunting are the three Ammu-Nation stock tiers. Stats: the in-game weapon menu.</p>

      <h3 class="ars__h3">Melee <span style="color:var(--blue)">&amp; Explosives</span></h3>
      <div class="ars__lists">
        <div class="ars__list"><div class="ars__list-key">Melee · 9 standard</div><ul>${meleeStd.map(r => `<li>${name(r[0])}</li>`).join('')}</ul><p>Unique melee variants found so far: ${meleeVar.map(r => esc(r[0])).join(', ')}.</p></div>
        <div class="ars__list"><div class="ars__list-key">Explosives · 4</div><ul>${expl.map(r => `<li>${name(r[0])}</li>`).join('')}</ul><p>Sticky bombs also crack safes and locked doors. Throwables carry no menu stats.</p></div>
      </div>

      <details class="ars__details">
        <summary>Unique Variants (${variants.length} listed)</summary>
        <p>Named one-offs: signature guns, gang pieces and trophies pulled from story jobs, illegal operations and Ammu-Nation display cases. They cannot be modded, and one pickup unlocks the gun for both Jason and Lucia. The base game has 127, plus 2 more with the Ultimate Edition. This list is still filling in.</p>
        <div class="ars__scroll"><table class="ars__table" id="ars-var"><caption>GTA 6 unique variant weapons with in-game menu stats</caption>${head(false)}<tbody>
${sortRows(variants).map(r => tr(r, false)).join('\n')}
        </tbody></table></div>
      </details>
    </div>
  </section>
  <script>
    (function(){
      function sortable(t){
        var ths=t.querySelectorAll('thead th');
        t.querySelectorAll('thead button').forEach(function(b){
          b.addEventListener('click',function(){
            var k=+b.dataset.k,th=b.parentNode,cur=th.getAttribute('aria-sort');
            var desc=(k<2)?(cur==='ascending'):(cur!=='descending');
            ths.forEach(function(h){h.removeAttribute('aria-sort')});
            th.setAttribute('aria-sort',desc?'descending':'ascending');
            var tb=t.tBodies[0],rows=[].slice.call(tb.rows);
            rows.sort(function(a,c){var x=a.cells[k].getAttribute('data-v'),y=c.cells[k].getAttribute('data-v');var r=(k===0)?String(x).localeCompare(String(y)):(parseFloat(x)-parseFloat(y));return desc?-r:r});
            rows.forEach(function(r){tb.appendChild(r)});
          });
        });
      }
      var std=document.getElementById('ars-std'),vr=document.getElementById('ars-var');
      if(std)sortable(std);if(vr)sortable(vr);
      document.querySelectorAll('.ars__chip').forEach(function(c){
        c.addEventListener('click',function(){
          document.querySelectorAll('.ars__chip').forEach(function(o){o.setAttribute('aria-pressed',o===c?'true':'false')});
          var f=c.getAttribute('data-f');[std,vr].forEach(function(t){if(!t)return;[].slice.call(t.tBodies[0].rows).forEach(function(r){r.hidden=!(f==='all'||r.getAttribute('data-cls')===f)})});
        });
      });
    })();
  </script>
  <!--arsenal:end-->`;

let t = fs.readFileSync(PAGE, 'utf8');
const crlf = t.includes('\r\n'); t = t.replace(/\r\n/g, '\n');
const once = (hay, needle) => { const n = hay.split(needle).length - 1; if (n !== 1) throw new Error(`expected 1 "${needle}", found ${n}`); };
if (t.includes('<!--arsenal-css:start-->')) t = t.replace(/<!--arsenal-css:start-->[\s\S]*?<!--arsenal-css:end-->/, () => CSS.trim());
else { once(t, '</head>'); t = t.replace('</head>', () => '  ' + CSS + '\n</head>'); }
if (t.includes('<!--arsenal:start-->')) t = t.replace(/<!--arsenal:start-->[\s\S]*?<!--arsenal:end-->/, () => HTML);
else { once(t, '  </main>'); t = t.replace('  </main>', () => '  </main>\n\n  ' + HTML); }
const OLD_D = 'Pistols, rifles, shotguns, explosives, melee: every weapon class in GTA 6\'s Leonida arsenal so far.';
const NEW_D = 'All 53 GTA 6 guns with in-game stats: damage, accuracy, handling, range, mag, brand and Ammu-Nation stock, plus melee, explosives and variants.';
const nD = t.split(OLD_D).length - 1; t = t.split(OLD_D).join(NEW_D);
const OLD_T = 'Weapons &amp; Gear | GTA 6 Arsenal | GTAVITIPS', NEW_T = 'GTA 6 Weapons List: All 53 Guns &amp; Stats | GTAVITIPS';
const nT = t.split(OLD_T).length - 1; t = t.split(OLD_T).join(NEW_T);
console.log({ std: std.length, variants: variants.length, meleeStd: meleeStd.length, meleeVar: meleeVar.length, expl: expl.length, descReplaced: nD, titleReplaced: nT, newDescLen: NEW_D.length, hitter: hitter[0] + ' ' + hitter[4] });
if (!DRY) fs.writeFileSync(PAGE, crlf ? t.replace(/\n/g, '\r\n') : t);
