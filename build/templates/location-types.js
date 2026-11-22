'use strict';

const path = require('path');
const { createTypeTemplate } = require('./collectibles');

// Location type pages (Nov 22 2026, "Map pages" in CLAUDE.md): one page per place TYPE from the interactive map
// (gas stations, train stations...), never one per pin. Same template code and field list as collectibles.js
// (see its header comment); only paths, labels and the hero icon differ.
// Data: build/data/location-types/<slug>.md -> node build/build.js location-types -> build/output/location-types/<slug>/
// Copy to hub/gameplay/locations/<slug>/ (NOT hub/gameplay/location-types). Add each page to the "Around Leonida"
// section of hub/assets/data/locations.json, then node build/prerender-hubs.js.
// Sourcing: the map dataset is ONE source; a table row needs a second independent guide (CLAUDE.md, Map pages).

const PIN_ICON = 'M12 21.5s-7-6.1-7-11.5a7 7 0 1 1 14 0c0 5.4-7 11.5-7 11.5z M12 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z';

module.exports = createTypeTemplate({
  dataDir: path.join(__dirname, '..', 'data', 'location-types'),
  baseUrl: '/gameplay/locations',
  hubUrl: '/gameplay/locations',
  hubLabel: 'Locations',
  backLabel: 'Back to Locations',
  sidebarTitle: 'Around Leonida',
  sidebarAria: 'Location type navigation',
  statAria: 'Location type stats',
  hintHeader: 'Where to find it',
  heroIconPath: PIN_ICON,
  exploreLinks: [
    { label: 'All Locations', url: '/gameplay/locations' },
    { label: 'Collectibles', url: '/gameplay/collectibles' },
    { label: 'Leonida Map', url: '/map' },
  ],
});
