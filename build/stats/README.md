# Hub stats tables (Nov 20 2026)

Source data: IGN's Official GTA 6 Guide sortable tables (Rockstar links the guide in its Nov 19 Newswire post), scraped page by page.
- `weapons-ign.json`: rows `[name, type, subtype, class, damage, accuracy, handling, range, mag, fire, brand, caliber, ammu-nation stock, ultimateEdition, unlocked]`
- `vehicles-ign.json`: rows `[name, brand, tracker, sell, register, speed, accel, asphalt, offroad, strength, offRating, onRating, type, era, condition, specialist]`

Rebuild (re-runnable, replaces the block between the `arsenal`/`fleet` markers):
    node build/stats/weapons-arsenal.js build/stats/weapons-ign.json hub/gameplay/weapons/index.html
    node build/stats/vehicles-fleet.js build/stats/vehicles-ign.json hub/gameplay/vehicles/index.html hub/gameplay/weapons/index.html

After a rerun: re-check the meta description replacement counts (0 is expected on reruns), sitemap lastmod.
