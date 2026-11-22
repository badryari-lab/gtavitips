/* GTAVITIPS interactieve Leonida-kaart.
 * Basis: de in-game kaart (tegels van gtadb.org, CC BY 4.0), met de Rockstar-poster als tweede weergave.
 * Tegelraster: wereld +-16384 m, zoomniveau 5 = 1 pixel per meter.
 * Coordinaten van pins zijn pixels op de Rockstar-poster (5375 x 7501), oorsprong linksboven;
 * de poster ligt op x = 0.375*X + 4036, y = 4052 - 0.375*Y (X, Y in wereldmeters).
 * Bewerkmodus: open de pagina met ?edit=1. */
(function () {
  'use strict';

  var METER = 5;             // zoomniveau waarop 1 pixel = 1 meter
  var POSTER = { s: 0.375, x0: 4036, y0: 4052 };
  var HELFT = 16384;
  // Elke pin is in de game gecheckt (Badr, 22 nov 2026); een bron volstaat.
  // Pins met "benadering": true zijn niet in de game geverifieerd en tonen gestippeld.
  var BRONNEN_NODIG = 1;
  // Tegels staan op Cloudflare R2 (bucket gtavitips-map-tiles), te veel bestanden voor de site-deploy. Upload: node scripts/r2_upload.js
  var TEGELS = 'https://tiles.gtavitips.com/';
  var RASTER = { cel: 598, x0: 2, y0: 460, rijen: 'ABCDEFGHIJKLM' }; // raster van de Rockstar-poster
  var OPSLAG = 'gtavitips-map-v1';

  var bewerken = new URLSearchParams(location.search).has('edit');
  var staat = laadStaat();
  var kaart, data, iconen, cluster, lagen = {}, pinsPerId = {}, gewijzigd = {}, bases = {};

  Promise.all([
    fetch('data/kaart.json').then(function (r) { return r.json(); }),
    fetch('data/iconen.json').then(function (r) { return r.json(); }).catch(function () { return { lagen: {}, paden: {} }; })
  ]).then(function (r) { iconen = r[1]; maakIcoonStijl(); start(r[0]); });

  /* ---------- iconen (Phosphor, MIT): een CSS-masker per icoon, zodat 2800 pins geen 2800 svg's worden ---------- */
  function maakIcoonStijl() {
    var css = Object.keys(iconen.paden).map(function (naam) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="' + iconen.paden[naam] + '"/></svg>';
      var url = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
      return '.i-' + naam + '::after{-webkit-mask-image:' + url + ';mask-image:' + url + '}';
    }).join('');
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }
  function icoonKlas(l) { var n = iconen.lagen[l.id]; return n ? ' i-' + n : ''; }
  // donker icoon op lichte kleur, licht icoon op donkere kleur
  function inkt(kleur) {
    var c = parseInt(kleur.slice(1), 16), r = c >> 16, g = (c >> 8) & 255, b = c & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#14100c' : '#ffffff';
  }

  function start(json) {
    data = json;
    var B = data.meta.breedte, H = data.meta.hoogte;

    kaart = L.map('kaart', {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 7,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 90,
      attributionControl: true,
      zoomControl: false
    });
    L.control.zoom({ position: 'topright' }).addTo(kaart);
    kaart.attributionControl.setPrefix(false).addAttribution('<a href="https://map.gtadb.org">GTA VI Map Tiles</a> (<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>) &middot; Map &copy; Rockstar Games &middot; <a href="https://gtavitips.com/">GTAVITIPS</a>');

    var grenzen = L.latLngBounds(naarKaart(0, H), naarKaart(B, 0));
    var tegelgrens = L.latLngBounds(wereld(-12288, -12288), wereld(8192, 12288));
    bases.game = L.tileLayer(TEGELS + 'game/{z}/{z},{y},{x}.jpg', {
      minZoom: 0, maxNativeZoom: 6, maxZoom: 7, bounds: tegelgrens, noWrap: true, keepBuffer: 4
    });
    bases.poster = L.tileLayer(TEGELS + 'poster/{z}/{z},{y},{x}.webp', {
      minZoom: 0, maxNativeZoom: 4, maxZoom: 7, bounds: grenzen, noWrap: true, keepBuffer: 4
    });
    kiesBasis(staat.basis === 'poster' ? 'poster' : 'game');
    document.querySelectorAll('[data-basis]').forEach(function (b) {
      b.addEventListener('click', function () { kiesBasis(b.dataset.basis); });
    });

    kaart.setMaxBounds(grenzen.pad(0.35));
    kaart.fitBounds(grenzen);
    kaart.setMinZoom(Math.floor(kaart.getBoundsZoom(grenzen) * 4) / 4 - 0.5);

    bouwLagen();
    bouwPaneel();
    koppelZoeken();
    koppelKnoppen();
    leesHash();
    window.addEventListener('hashchange', leesHash);

    kaart.on('mousemove', function (e) {
      var p = naarPixel(e.latlng);
      if (p.x < 0 || p.y < 0 || p.x > B || p.y > H) { zetPositie(''); return; }
      zetPositie(vak(p.x, p.y) + (bewerken ? '  ·  x ' + p.x + '  y ' + p.y : ''));
    });

    function schaal() { var k = document.getElementById('kaart').classList; k.toggle('ver', kaart.getZoom() < 0.5); k.toggle('overzicht', kaart.getZoom() < 1.75); }
    kaart.on('zoomend', schaal); schaal();

    if (bewerken) startBewerken();
  }

  /* ---------- coordinaten ---------- */
  function wereld(X, Y) { return kaart.unproject([X + HELFT, HELFT - Y], METER); }
  function naarKaart(x, y) { return wereld((x - POSTER.x0) / POSTER.s, (POSTER.y0 - y) / POSTER.s); }
  function naarPixel(latlng) {
    var p = kaart.project(latlng, METER);
    return { x: Math.round((p.x - HELFT) * POSTER.s + POSTER.x0), y: Math.round(POSTER.y0 - (HELFT - p.y) * POSTER.s) };
  }
  function kiesBasis(naam) {
    Object.keys(bases).forEach(function (k) { if (k !== naam) kaart.removeLayer(bases[k]); });
    bases[naam].addTo(kaart);
    document.getElementById('kaart').dataset.basis = naam;
    document.querySelectorAll('[data-basis]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.basis === naam ? 'true' : 'false');
    });
    staat.basis = naam;
    bewaarStaat();
  }
  function vak(x, y) {
    var kol = Math.min(9, Math.max(1, Math.floor((x - RASTER.x0) / RASTER.cel) + 1));
    var rij = Math.min(12, Math.max(0, Math.floor((y - RASTER.y0) / RASTER.cel) + 1));
    return RASTER.rijen[rij] + kol;
  }

  /* ---------- lagen en pins ---------- */
  function bouwLagen() {
    data.groepen.forEach(function (g) {
      g.lagen.forEach(function (l) {
        l.groep = g;
        l.pins = [];
        l.groepLaag = L.layerGroup();
        // plaatsnamen blijven los staan; in de bewerkmodus groeperen we niet, anders valt er niets te verslepen
        l.gegroepeerd = !bewerken && g.id !== 'places';
        l.aan = staat.eerder ? staat.uit.indexOf(l.id) === -1 : !l.uit;
        lagen[l.id] = l;
      });
    });
    data.pins.forEach(function (p) {
      var l = lagen[p.laag];
      if (!l) return;
      l.pins.push(p);
      pinsPerId[p.id] = p;
      p.marker = maakMarker(p, l);
      if (!l.gegroepeerd) p.marker.addTo(l.groepLaag);
    });
    cluster = L.markerClusterGroup({
      maxClusterRadius: 44,
      disableClusteringAtZoom: 4,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false,
      chunkedLoading: true,
      iconCreateFunction: function (c) {
        var n = c.getChildCount(), maat = n < 10 ? 30 : n < 100 ? 36 : 44;
        return L.divIcon({ className: '', html: '<div class="groep-pin" style="--m:' + maat + 'px">' + n + '</div>', iconSize: [maat, maat], iconAnchor: [maat / 2, maat / 2] });
      }
    }).addTo(kaart);
    Object.keys(lagen).forEach(function (id) {
      var l = lagen[id];
      if (!l.aan || !l.pins.length) return;
      if (l.gegroepeerd) cluster.addLayers(zichtbaar(l)); else l.groepLaag.addTo(kaart);
    });
  }
  // markers van een laag die nu getoond horen te worden
  function zichtbaar(l) {
    return l.pins.filter(function (p) { return !(staat.verbergGevonden && staat.gevonden[p.id]); }).map(function (p) { return p.marker; });
  }
  function ververs(l) {
    if (!l.gegroepeerd) return;
    cluster.removeLayers(l.pins.map(function (p) { return p.marker; }));
    if (l.aan) cluster.addLayers(zichtbaar(l));
  }

  // Namen die op Rockstars eigen kaart gedrukt staan hebben geen tweede bron nodig.
  function bevestigd(p) {
    var b = p.bronnen || [];
    if (p.benadering) return false;
    return b.length >= BRONNEN_NODIG || b.indexOf('Official Leonida map') !== -1;
  }

  function icoon(p, l) {
    var klassen = 'pin' + icoonKlas(l) + (bevestigd(p) ? '' : ' open') + (staat.gevonden[p.id] ? ' gevonden' : '');
    return L.divIcon({
      className: '',
      html: '<div class="' + klassen + '" style="--k:' + l.kleur + ';--i:' + inkt(l.kleur) + '"></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -12]
    });
  }

  function maakMarker(p, l) {
    var m = L.marker(naarKaart(p.x, p.y), {
      icon: icoon(p, l),
      title: p.naam,
      alt: p.naam + ' (' + l.naam + ')',
      keyboard: true,
      zIndexOffset: l.groep.id === 'places' ? 1000 : 0,
      draggable: bewerken
    });
    if (l.groep.id === 'places') {
      m.bindTooltip(p.naam, { permanent: true, direction: 'top', offset: [0, -12], className: 'plaatsnaam plaatsnaam-' + l.id, interactive: false });
    }
    m.bindPopup(function () { return kaartje(p, l); }, { maxWidth: 280, autoPanPadding: [30, 30] });
    m.on('popupopen', function () { history.replaceState(null, '', '#pin=' + p.id); });
    m.on('popupclose', function () { history.replaceState(null, '', location.pathname + location.search); });
    if (bewerken) {
      m.on('dragend', function () {
        var px = naarPixel(m.getLatLng());
        p.x = px.x; p.y = px.y;
        gewijzigd[p.id] = { id: p.id, x: p.x, y: p.y };
        document.getElementById('bewerkinfo').textContent = p.naam + ': x ' + p.x + ', y ' + p.y + ' (' + vak(p.x, p.y) + ')';
      });
    }
    return m;
  }

  function kaartje(p, l) {
    var el = document.createElement('div');
    el.className = 'kaartje';
    el.style.setProperty('--k', l.kleur);
    var n = (p.bronnen || []).length;
    var ok = bevestigd(p);
    var html = '<div class="soort">' + esc(l.naam) + '</div><h3>' + esc(p.naam) + '</h3>';
    if (p.tekst) html += '<p>' + esc(p.tekst) + '</p>';
    html += '<div class="feiten"><span>Grid ' + vak(p.x, p.y) + '</span>' +
      (ok || BRONNEN_NODIG === 1 ? '' : '<span class="wacht">' + n + ' of ' + BRONNEN_NODIG + ' sources</span>') +
      (p.benadering ? '<span class="wacht">Approximate position</span>' : '') + '</div>';
    if (n && bewerken) html += '<div class="bronnen">Sources: ' + esc(p.bronnen.join(', ')) + '</div>';
    html += '<div class="acties">';
    var pad = p.pad || l.pad;
    if (pad) html += '<a class="hoofd" href="' + esc(data.meta.database + pad) + '">Open in database</a>';
    if (l.afvinkbaar) {
      html += '<button type="button" data-gevonden aria-pressed="' + (staat.gevonden[p.id] ? 'true' : 'false') + '">' +
        (staat.gevonden[p.id] ? 'Found' : 'Mark as found') + '</button>';
    }
    html += '<button type="button" data-deel>Copy link</button></div>';
    el.innerHTML = html;

    var gv = el.querySelector('[data-gevonden]');
    if (gv) gv.addEventListener('click', function () {
      if (staat.gevonden[p.id]) delete staat.gevonden[p.id]; else staat.gevonden[p.id] = 1;
      bewaarStaat();
      p.marker.setIcon(icoon(p, l));
      if (staat.verbergGevonden) { p.marker.closePopup(); ververs(l); }
      gv.setAttribute('aria-pressed', staat.gevonden[p.id] ? 'true' : 'false');
      gv.textContent = staat.gevonden[p.id] ? 'Found' : 'Mark as found';
      werkTellersBij();
    });
    el.querySelector('[data-deel]').addEventListener('click', function (e) {
      var url = location.origin + location.pathname + '#pin=' + p.id;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () {
        e.target.textContent = 'Link copied';
      }, function () { prompt('Copy this link', url); });
    });
    return el;
  }

  /* ---------- paneel ---------- */
  function bouwPaneel() {
    var nav = document.getElementById('lagen');
    data.groepen.forEach(function (g) {
      var sec = document.createElement('section');
      sec.className = 'groep';
      sec.innerHTML = '<h2>' + esc(g.naam) + '</h2>';
      g.lagen.forEach(function (l) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'laag' + (l.pins.length ? '' : ' leeg');
        b.style.setProperty('--k', l.kleur);
        b.dataset.laag = l.id;
        b.style.setProperty('--i', inkt(l.kleur));
        b.innerHTML = '<span class="bol' + icoonKlas(l) + '"></span><span class="naam">' + esc(l.naam) + '</span><span class="tel"></span>';
        if (l.pins.length) {
          b.setAttribute('aria-pressed', l.aan ? 'true' : 'false');
          b.addEventListener('click', function () { zetLaag(l, !l.aan); });
          b.addEventListener('contextmenu', function (e) { e.preventDefault(); alleen(l); });
        } else {
          b.disabled = true;
          b.title = 'Locations are being verified';
        }
        l.knop = b;
        sec.appendChild(b);
      });
      nav.appendChild(sec);
    });
    werkTellersBij();

    var knop = document.getElementById('paneelknop'), paneel = document.getElementById('paneel');
    knop.addEventListener('click', function () {
      var open = paneel.classList.toggle('open');
      knop.setAttribute('aria-expanded', open ? 'true' : 'false');
      knop.textContent = open ? 'Close' : 'Layers';
    });
    knop.setAttribute('aria-expanded', 'false');
  }

  function werkTellersBij() {
    Object.keys(lagen).forEach(function (id) {
      var l = lagen[id], tel = l.knop.querySelector('.tel');
      if (!l.pins.length) { tel.textContent = l.totaal ? 'soon · ' + l.totaal : 'soon'; return; }
      var gevonden = l.pins.filter(function (p) { return staat.gevonden[p.id]; }).length;
      var isCollectible = !!l.afvinkbaar;
      tel.textContent = isCollectible ? gevonden + ' / ' + l.pins.length + (l.totaal && l.totaal > l.pins.length ? ' (of ' + l.totaal + ')' : '') : String(l.pins.length);
    });
  }

  function zetLaag(l, aan) {
    l.aan = aan;
    if (!l.pins.length) return;
    if (l.gegroepeerd) ververs(l);
    else if (aan) l.groepLaag.addTo(kaart); else kaart.removeLayer(l.groepLaag);
    l.knop.setAttribute('aria-pressed', aan ? 'true' : 'false');
    staat.uit = Object.keys(lagen).filter(function (id) { return !lagen[id].aan; });
    staat.eerder = true;
    bewaarStaat();
  }
  function alleen(l) {
    var alAlleen = Object.keys(lagen).every(function (id) { return (id === l.id) === lagen[id].aan || !lagen[id].pins.length; });
    Object.keys(lagen).forEach(function (id) { zetLaag(lagen[id], alAlleen ? true : id === l.id); });
  }

  function koppelKnoppen() {
    document.querySelectorAll('.knoppen button').forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.dataset.actie;
        if (a === 'alles' || a === 'niets') {
          Object.keys(lagen).forEach(function (id) { zetLaag(lagen[id], a === 'alles'); });
        } else {
          staat.verbergGevonden = !staat.verbergGevonden;
          bewaarStaat();
          pasGevondenToe(b);
          Object.keys(lagen).forEach(function (id) { if (lagen[id].aan) ververs(lagen[id]); });
        }
      });
    });
    pasGevondenToe(document.querySelector('[data-actie="gevonden"]'));
  }
  function pasGevondenToe(b) {
    document.getElementById('kaart').classList.toggle('verberg-gevonden', !!staat.verbergGevonden);
    b.setAttribute('aria-pressed', staat.verbergGevonden ? 'true' : 'false');
  }

  /* ---------- zoeken ---------- */
  function koppelZoeken() {
    var veld = document.getElementById('zoek'), lijst = document.getElementById('zoekresultaten');
    veld.addEventListener('input', function () {
      var q = veld.value.trim().toLowerCase();
      lijst.innerHTML = '';
      if (q.length < 2) { lijst.hidden = true; return; }
      var hits = data.pins.filter(function (p) { return lagen[p.laag] && p.naam.toLowerCase().indexOf(q) !== -1; }).slice(0, 20);
      if (!hits.length) lijst.innerHTML = '<li class="leeg">Nothing on the map by that name yet.</li>';
      hits.forEach(function (p) {
        var li = document.createElement('li'), b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = '<span>' + esc(p.naam) + '</span><small>' + esc(lagen[p.laag].naam) + '</small>';
        b.addEventListener('click', function () { lijst.hidden = true; veld.value = ''; toonPin(p); });
        li.appendChild(b); lijst.appendChild(li);
      });
      lijst.hidden = false;
    });
    veld.addEventListener('keydown', function (e) { if (e.key === 'Escape') { veld.value = ''; lijst.hidden = true; } });
    document.addEventListener('click', function (e) { if (!e.target.closest('.zoek')) lijst.hidden = true; });
  }

  function toonPin(p) {
    var l = lagen[p.laag];
    if (!l.aan) zetLaag(l, true);
    document.getElementById('paneel').classList.remove('open');
    if (l.gegroepeerd && cluster.hasLayer(p.marker)) {
      // zoomt zo ver in als nodig is om de pin uit zijn groep te halen
      cluster.zoomToShowLayer(p.marker, function () { p.marker.openPopup(); });
      return;
    }
    kaart.setView(naarKaart(p.x, p.y), Math.max(kaart.getZoom(), 2.5), { animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches });
    p.marker.openPopup();
  }

  /* ---------- deelbare links: #pin=<id> of #laag=<id> ---------- */
  function leesHash() {
    var h = new URLSearchParams(location.hash.slice(1));
    if (h.get('laag') && lagen[h.get('laag')]) alleen(lagen[h.get('laag')]);
    if (h.get('pin') && pinsPerId[h.get('pin')]) toonPin(pinsPerId[h.get('pin')]);
  }

  /* ---------- bewerkmodus ---------- */
  function startBewerken() {
    document.getElementById('bewerkbalk').hidden = false;
    var info = document.getElementById('bewerkinfo');
    kaart.on('click', function (e) {
      var p = naarPixel(e.latlng);
      var regel = '"x": ' + p.x + ', "y": ' + p.y;
      info.textContent = regel + '  (' + vak(p.x, p.y) + ') copied';
      if (navigator.clipboard) navigator.clipboard.writeText(regel).catch(function () {});
    });
    document.getElementById('exporteer').addEventListener('click', function () {
      var uit = JSON.stringify(Object.keys(gewijzigd).map(function (id) { return gewijzigd[id]; }), null, 1);
      (navigator.clipboard ? navigator.clipboard.writeText(uit) : Promise.reject()).then(function () {
        info.textContent = Object.keys(gewijzigd).length + ' changed pins copied as JSON';
      }, function () { prompt('Changed pins', uit); });
    });
  }

  /* ---------- hulp ---------- */
  function zetPositie(t) { document.getElementById('positie').textContent = t; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function laadStaat() {
    var s = {};
    try { s = JSON.parse(localStorage.getItem(OPSLAG)) || {}; } catch (e) {}
    return { eerder: !!s.uit, uit: s.uit || [], gevonden: s.gevonden || {}, verbergGevonden: !!s.verbergGevonden, basis: s.basis || 'game' };
  }
  function bewaarStaat() {
    try { localStorage.setItem(OPSLAG, JSON.stringify(staat)); } catch (e) {}
  }
})();
