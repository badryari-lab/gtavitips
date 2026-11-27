// Builds the "WAiNK Stats" section for hub/gameplay/vehicles/index.html from the scraped IGN Official Guide vehicle table.
// Usage: node fleet.js <ign-vehicles-table.json> <hub vehicles index.html> <hub weapons index.html (CSS reference)> [--dry]
// Source columns: 0 name,1 brand,2 tracker,3 sell,4 register,5 speed,6 accel,7 asphalt,8 offroad,9 strength,10 offRating,11 onRating,12 type,13 era,14 condition,15 specialist
const fs = require('fs'), path = require('path');
const [SRC, PAGE, REF] = process.argv.slice(2); const DRY = process.argv.includes('--dry');
let d = JSON.parse(fs.readFileSync(SRC, 'utf8')); if (typeof d === 'string') d = JSON.parse(d);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = v => { const n = parseFloat(String(v).replace(/,/g, '')); return isFinite(n) ? n : null; };
const disp = n => /^\d\d /.test(n) ? '’' + n : n;
const LINKS = { '65 Buccaneer': 'albany-buccaneer', '95 Hellion': 'annis-hellion', 'Astron': 'pfister-astron', '82 Ruiner': 'imponte-ruiner', '72 Tulip': 'declasse-tulip', '85 Futo': 'karin-futo', '84 Rebel': 'karin-rebel', '97 Penumbra FF': 'maibatsu-97-penumbra-ff', '95 Cheetah': 'grotti-cheetah', '85 Blista': 'dinka-blista-compact', '81 Phantom Custom': 'jobuilt-phantom', '84 Bobcat XL': 'declasse-bobcat-xl', '65 Chino': 'dundreary-chino', '97 Benson': 'interstate-benson' };
for (const s of Object.values(LINKS)) if (!fs.existsSync(path.join(path.dirname(PAGE), s, 'index.html'))) throw new Error('missing entry ' + s);
const TYPES = ['Super', 'Sport', 'Muscle', 'Coupe', 'Sedan', 'SUV', 'Pickup', 'Off-Road', 'Van', 'Truck', 'Emergency', 'Transport', 'Military', 'Utility', 'Industrial'];
const TLABEL = { Super: 'Supercars', Sport: 'Sports', Muscle: 'Muscle', Coupe: 'Coupes', Sedan: 'Sedans', SUV: 'SUVs', Pickup: 'Pickups', 'Off-Road': 'Off-Road', Van: 'Vans', Truck: 'Trucks', Emergency: 'Emergency', Transport: 'Transport', Military: 'Military', Utility: 'Utility', Industrial: 'Industrial' };
const key = t => t.toLowerCase().replace(/[^a-z]/g, '');
const rows = d.slice().sort((a, b) => (num(b[5]) ?? -1) - (num(a[5]) ?? -1) || a[0].localeCompare(b[0]));
const unknownTypes = [...new Set(rows.map(r => r[12]))].filter(t => !TYPES.includes(t)); if (unknownTypes.length) throw new Error('types ' + unknownTypes);
const present = TYPES.filter(t => rows.some(r => r[12] === t));
const stat = v => { const n = num(v); return n === null ? '<td data-v="-1">n/a</td>' : `<td data-v="${n}"><span class="ars-stat"><b>${n.toFixed(1)}</b><i style="width:${n * 10}%"></i></span></td>`; };
const money = v => { const n = num(v); return n === null ? '<td data-v="-1">n/a</td>' : `<td data-v="${n}">$${n.toLocaleString('en-US')}</td>`; };
const nm = r => LINKS[r[0]] ? `<a href="/gameplay/vehicles/${LINKS[r[0]]}">${esc(disp(r[0]))}</a>` : esc(disp(r[0]));
const tr = r => `<tr data-cls="${key(r[12])}"><th scope="row" data-v="${esc(r[0])}">${nm(r)}<small>${esc([r[1], r[13]].filter(Boolean).join(' · '))}</small></th>`
  + `<td data-v="${TYPES.indexOf(r[12])}">${esc(r[12])}</td>`
  + stat(r[5]) + stat(r[6]) + stat(r[7]) + stat(r[8]) + stat(r[9]) + money(r[3]) + money(r[4])
  + `<td>${esc(r[2] || 'n/a')}</td></tr>`;
const btn = (k, l) => `<th scope="col"><button type="button" data-k="${k}">${l}</button></th>`;
const head = `<thead><tr>${btn(0, 'Vehicle')}${btn(1, 'Type')}${btn(2, 'Speed')}${btn(3, 'Accel')}${btn(4, 'Asphalt')}${btn(5, 'Off-Road')}${btn(6, 'Strength')}${btn(7, 'Fence Value')}${btn(8, 'Register')}<th scope="col">Tracker</th></tr></thead>`;
const fastest = rows[0];

const m = fs.readFileSync(REF, 'utf8').match(/<!--arsenal-css:start-->[\s\S]*?<!--arsenal-css:end-->/); if (!m) throw new Error('no arsenal css in reference page');
const CSS = m[0].replace(/\r\n/g, '\n').replace('arsenal-css:start', 'fleet-css:start').replace('arsenal-css:end', 'fleet-css:end');

const HTML = `<!--fleet:start-->
  <section class="ars" aria-labelledby="fleet-hd">
    <div class="wrap">
      <h2 class="index-section__h2" id="fleet-hd">Fleet <span style="color:var(--blue)">Numbers</span></h2>
      <p class="ars__intro"><strong>277 base models in 18 classes, plus 281 standout builds.</strong> Point WAiNK at a car and the phone hands back five bars out of 10, what a fence will pay and what it costs to put the thing in your name. ${rows.length} of them are on the board so far. Quickest: the ${esc(disp(fastest[0]))} at ${num(fastest[5]).toFixed(1)} speed. Tap a column to sort, tap a class to filter.</p>
      
      <div class="ars__chips" id="fleet-chips" role="group" aria-label="Filter by class"><button type="button" class="ars__chip" data-f="all" aria-pressed="true">All</button>${present.map(t => `<button type="button" class="ars__chip" data-f="${key(t)}" aria-pressed="false">${TLABEL[t]}</button>`).join('')}</div>
      <div class="ars__scroll"><table class="ars__table" id="fleet-tbl"><caption>GTA 6 vehicles with in-game WAiNK stats</caption>${head}<tbody>
${rows.map(tr).join('\n')}
      </tbody></table></div>
      <p class="ars__note">Speed, Accel, Asphalt, Off-Road and Strength are the WAiNK bars, out of 10. The vehicle bars only show once you are inside with the engine running. Fence value and registration are in-game dollars. Tracker is the anti-theft tier a fence strips before the car is safe to keep. Stats: in-game WAiNK scans.</p>
    </div>
  </section>
  <script>
    (function(){
      var t=document.getElementById('fleet-tbl');if(!t)return;
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
      var chips=document.querySelectorAll('#fleet-chips .ars__chip');
      chips.forEach(function(c){c.addEventListener('click',function(){
        chips.forEach(function(o){o.setAttribute('aria-pressed',o===c?'true':'false')});
        var f=c.getAttribute('data-f');[].slice.call(t.tBodies[0].rows).forEach(function(r){r.hidden=!(f==='all'||r.getAttribute('data-cls')===f)});
      })});
    })();
  </script>
  <!--fleet:end-->`;

let t = fs.readFileSync(PAGE, 'utf8');
const crlf = t.includes('\r\n'); t = t.replace(/\r\n/g, '\n');
const once = (hay, needle) => { const n = hay.split(needle).length - 1; if (n !== 1) throw new Error(`expected 1 "${needle}", found ${n}`); };
if (t.includes('<!--fleet-css:start-->')) t = t.replace(/<!--fleet-css:start-->[\s\S]*?<!--fleet-css:end-->/, () => CSS);
else { once(t, '</head>'); t = t.replace('</head>', () => '  ' + CSS + '\n</head>'); }
if (t.includes('<!--fleet:start-->')) t = t.replace(/<!--fleet:start-->[\s\S]*?<!--fleet:end-->/, () => HTML);
else { once(t, '  </main>'); t = t.replace('  </main>', () => '  </main>\n\n  ' + HTML); }
const OLD_D = 'Sports cars, trucks, bikes, aircraft, and watercraft: every vehicle spotted in GTA 6\'s Leonida so far.';
const NEW_D = 'Every GTA 6 vehicle on file, plus in-game WAiNK stats: speed, acceleration, handling, strength, fence value and registration cost.';
const nD = t.split(OLD_D).length - 1; t = t.split(OLD_D).join(NEW_D);
console.log({ rows: rows.length, types: present.length, links: Object.keys(LINKS).length, fastest: fastest[0] + ' ' + fastest[5], descReplaced: nD, newDescLen: NEW_D.length });
if (!DRY) fs.writeFileSync(PAGE, crlf ? t.replace(/\n/g, '\r\n') : t);
