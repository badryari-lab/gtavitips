# GTAVITIPS — Claude Working Guide

## Rule zero — read this first, every session

This file is the **single source of truth** for all agreements about the site. Memory files point here; if memory and this file ever disagree, this file wins.

1. Before the first action in any session: consult this file.
2. Before building or editing a specific part of the site (database entry, news article, FAQ, feed, intel drop): **step 1 is re-reading that part's section in this file**, plus `TOV.md` for any copy.
3. Never draft copy from memory or summary — read `TOV.md` and one existing page of the same type first.
4. New agreements made with Badr go into this file in the same session, not into separate memory notes.

## What this site is

GTAVITIPS (gtavitips.com) is a GTA 6 intel database and fan hub. The mission is to be the definitive pre- and post-launch resource for GTA 6: verified characters, vehicles, locations, weapons, factions, brands, animals, and activities — plus news, walkthroughs, and tips after launch.

Everything on the site is sourced from official Rockstar communications: trailers, Rockstar Newswire, Take-Two investor posts, and official photos. No speculation is published without a label. No unverified leaks are presented as fact.

**Launch target:** November 19, 2026 (GTA 6 release date).

## The user

Badr is not a professional developer but is a capable and quality-focused amateur. He relies on Claude to write and edit all HTML/CSS/JS. He wants the best possible output, is open to improvements, and will adapt the approach when a better option is presented. Do not dumb things down — explain trade-offs clearly and let him decide.

## Tech stack

- **Pure HTML/CSS/JS** — no framework, no build step, no npm
- **Cloudflare Workers + Wrangler** — the `hub/` directory is the static asset root
- **Deployment** — git push triggers automatic deploy via Cloudflare
- **Analytics** — Google Analytics 4 (ID: `G-J8Q9S7G7K6`) loaded conditionally after cookie consent; Cloudflare Insights beacon on every page
- **Fonts** — Anton (display headings), Archivo (body/UI, 400/600/700), Courier Prime (monospace labels) via Google Fonts — see Design System below
- **No external JS libraries** — everything is vanilla JS

## Site structure

```
hub/
├── index.html              # Homepage
├── about/index.html
├── faq/index.html
├── intel-drops/index.html  # Database changelog
├── map/index.html          # Official Rockstar map image (Nov 21 2026); interactive map in development
├── story/                  # Story hub (index.html) + story/missions/<slug>/ (Nov 2026, generated, see Build tooling)
├── news/                   # News articles (one folder per article)
├── gameplay/               # Main database
│   ├── index.html          # Database hub
│   ├── activities/
│   ├── animals/
│   ├── brands/
│   ├── characters/
│   ├── collectibles/       # One page per collectible type + hub (Nov 2026, generated)
│   ├── gangs-and-factions/
│   ├── locations/
│   ├── vehicles/
│   └── weapons/
├── privacy/index.html
├── cookie-policy/index.html
├── robots.txt
└── sitemap.xml
```

Each article/entry lives in its own folder with an `index.html` (clean URLs, no `.html` in paths).

## Build tooling (`build/`) — all 8 database categories

**Decided and built Oct 19 2026.** Every `hub/gameplay/<category>/` page is now generated from data files instead of hand-written per page. This does **not** change the deployed site: `hub/*/index.html` is still plain static HTML with everything inlined, still what gets committed and served — `build/` is a local, zero-dependency Node tool (no npm, no `node_modules`) that only runs on Badr's/Claude's machine to produce that HTML. The "no external libraries / no shared CSS files" rule is about what ships to the browser, which is unchanged. `news/` and `/faq/` are **not** part of this — still hand-written exactly as described elsewhere in this file.

```
build/
├── data/<category>/<slug>.md  # one file per entry: JSON frontmatter, then "---", then Markdown body
├── templates/
│   ├── _shared.js             # nav/footer/search/cookie-banner + the vehicles-generation CSS, shared where a category uses it
│   ├── _markdown.js           # tiny **bold**/[text](url) converter (internal links auto-get the blue-span style)
│   ├── _css-characters.js / _css-locations.js / _css-animals.js  # per-category CSS for the 3 categories that aren't CSS-uniform with vehicles (see below)
│   └── <category>.js          # one template per category — hero variant, stat-block, section layout, connection-card style all differ by category, see each file's own header comment
├── build.js                   # data + template -> build/output/<category>/<slug>/index.html (run `node build/build.js [category]`, omit category to build all)
├── diff.js                    # verification: node build/diff.js <category> — whitespace/reorder-insensitive diff against the live hub/ pages, used before every copy-over
├── extract-utils.js           # shared div-depth-balanced extraction helper (don't guess closing-tag counts — confirmed to silently drop content when guessed wrong)
└── extract-<category>.js      # one-time migration scripts, not part of the ongoing workflow
```

**To add or edit an entry:** write/edit `build/data/<category>/<slug>.md` (see that category's existing data files and its `templates/<category>.js` header comment for the exact field shape — they differ meaningfully by category, listed below) → `node build/build.js <category>` → `node build/diff.js <category>` if checking against something that should match → copy the relevant `build/output/<category>/<slug>/index.html` into `hub/gameplay/<category>/<slug>/` → sitemap lastmod → commit. Same Badr-approval discipline as any other page (see Publishing rule below) — build locally, show the result, wait for the go before copying into `hub/`.

**Real per-category differences, confirmed while building (don't assume vehicles' shape applies elsewhere):**
- **CSS generation**: vehicles/weapons/gangs-and-factions/activities use the canonical Anton/Courier-Prime CSS documented below, safe to share. characters/locations/animals are internally uniform but on an older, pre-redesign CSS generation (no Anton on headings, different nav color) — each gets its own `_css-<category>.js`, extracted from a live reference page, not vehicles' CSS. characters additionally has ONE exception within itself (jason-duval already uses the canonical style while the other 20 don't) — when a category isn't provably 100% uniform, CSS is kept **per-entry** instead of shared; characters is the only category that needed this.
- **Connection-card style**: three different designs exist — vehicles/weapons/gangs-and-factions/animals use type-label cards (`.conn-card`, `renderConnectionsGrid`); characters/activities use avatar cards with an arrow (`.conn-card__avatar`, `renderConnectionsGridAvatar`); brands uses a third style, `.eco-card` (avatar + industry + name only, no description or arrow) — never reuse one category's card renderer for another without checking.
- **FAQ**: present on characters/weapons/locations/activities/animals, absent entirely from vehicles/gangs-and-factions/brands. Where present, the visible `<details>` accordion and the `FAQPage` JSON-LD block are extracted and stored **independently** — confirmed on characters that they can be genuinely different content (not duplicates), not just two renderings of the same text.
- **Sidebar**: vehicles/weapons/gangs-and-factions use a fixed 2-block shape (`renderSidebar`, pass an explicit `ariaLabel` — it does not default correctly). characters/locations/animals/brands have per-entry-variable block counts and/or titles (`renderSidebarBlocks`) — some brands (the 10 vehicle-manufacturer ones) show a custom first-block title instead of "Brands Index".
- **Hero**: vehicles/characters/gangs-and-factions/locations/brands support both a real photo and a gradient-fallback variant per entry (never assume one or the other for a whole category — e.g. only 2/84 vehicles have a photo, but 63/76 brands do). weapons has no photo variant at all. activities always has a photo. Brands' fallback icon additionally **varies per entry** (60/67 share one icon, 7 are unique) — never hardcode a single fallback icon.
- **Pages excluded from migration, left hand-maintained**: `vice-city` (locations) has a custom hub-page structure, no "On the Ground" section. The 4 brand directories that were empty 404s (`electric-fang-tattoo`, `goodtime-gear`, `stock-305`, `vice-city-style`, linked from `saras-unisex-salon` and a news article) were written as full stub entries Oct 19 2026 — same 1-section depth as angstapan/one-eyes-willies/rideout-customs/saras-unisex-salon, sourced from the pre-order announcement article. Brands is now a complete 76/76.

**Hub pre-render (Oct 2026):** the category hubs (`/gameplay/animals|brands|characters|gangs-and-factions|locations|vehicles`) and `/news` fill their card grids in the browser from `hub/assets/data/*.json`. `node build/prerender-hubs.js` runs each hub's own render code against its own JSON and writes the markup between `<!--prerender:start-->` and `<!--prerender:end-->` inside the grid container, so crawlers that skip JS see real `<a href>` links to every entry (Ahrefs flagged 15 orphan pages and 37 single-link pages before this). **Run it after every edit to a hub JSON or to `news.json`**, then commit the hub pages with it. New brand/entry pages must also be added to their hub JSON, or they stay unlisted.

**Hub stats tables (Nov 2026):** the weapons hub ("Full Arsenal") and vehicles hub ("Fleet Numbers") carry sortable in-game stat tables, generated by `build/stats/*.js` from scraped IGN guide data in `build/stats/*.json` and written between `<!--arsenal:...-->` / `<!--fleet:...-->` markers outside the JS-rendered grid. See `build/stats/README.md` to rerun when IGN's tables grow.

**Story hub and missions (agreed with Badr Nov 21 2026):** `/story` is the story hub (prologue + five chapters, mission cards, one closed chapter recap each) and `/story/missions/<slug>` holds one page per story mission (94: 91 required + 3 optional); `/story/missions` 301s to `/story`. "Story" sits in the top nav, mobile menu and footer of every page. Data: `build/data/missions/<slug>.md` + `build/data/missions/_chapters.json`; template `build/templates/missions.js` (field list in its header); hub `node build/story/story-hub.js`. Mission pages copy to `hub/story/missions/<slug>/`, not `/gameplay`. Section order: hero, spoiler notice, stat block (Chapter, Mission N of 94, Playable As, Contact, Location, Unlocks) + source line, Objective, Rewards, Missables, Tips, Story (closed reveal), Walkthrough (YouTube embed by an independent creator, credited by channel name; never a guide-site channel), In This Mission cards, previous/next, FAQ. Mission names show in titles, URLs, hub cards, sidebars and search even when the name is a heavy spoiler (Badr: people search for them); those pages get the stronger `spoilerNote`, everything else around the name stays spoiler-free. Reverse links are automatic: a character or location page that a mission links to (stat block or card) gets one closed "N Missions" reveal (inside Story Arc, or its own "Story Missions" section), so rebuild characters and locations after adding missions. The spoiler component lives in `build/templates/_spoiler.js` (shared by characters, missions, story hub, locations). Mission facts need 2+ independent sources (heavy beats 3+), recorded in the gitignored work files, never named.

**Collectibles (agreed with Badr Nov 21 2026):** a database category at `/gameplay/collectibles` (in the Database menu, footer and `/gameplay` cards), one page per collectible TYPE with a locations table grouped by county, never one page per item (too thin to index). 12 types; unique weapon variants and Wyman's cars belong to weapons/vehicles, underwater discoveries + Kenton's treasures + doubloons share one page. A location only goes in a table when 2+ independent sources agree; a partial table carries `itemsNote` ("N of M listed so far") and is filled in later. Pages are spoiler-free: unlocks say "Chapter N", never a mission name. Data `build/data/collectibles/<slug>.md`, template `build/templates/collectibles.js`, hub `node build/collectibles/collectibles-hub.js`. Location pages named in a table get a "Collectibles Here" line automatically (rebuild locations after edits).

**IndexNow (Nov 21 2026):** `hub/<key>.txt` is the IndexNow key file (never delete or rename it). After a push is live, run `node build/indexnow.js --since <date>` (or with paths) so Bing and other IndexNow engines pick up new and changed URLs within hours; Google still reads `sitemap.xml` only. A brand-new key can return 403 for a few minutes until the engines have fetched it; retry, it then returns 200 (first run Nov 21 2026: 573 URLs, 200).

**Thin pages get in-game facts (agreed with Badr Nov 22 2026):** ~230 database pages (brands, vehicles, animals, gangs, weapons) sit under 300 words and match the ~248 "Crawled, not indexed" pages in GSC. Fix: replace atmosphere filler with what players search for, where to find or buy it and how to get it, only where 2+ independent guides agree (uncredited, per Content sourcing rules); conflicting spots are left out. Vehicles: a "How to Get" stat row (Randy's Wish List: opens in Chapter 3, Key Cloner, deliver to Leonida Auto World, $10,000 clean-delivery bonus), title "<Name> Location | GTA 6 Vehicle | GTAVITIPS". Weapons: "Where to Buy" (Ammu-Nation stock tier from `build/stats/weapons-ign.json`) and "Unique Versions" rows plus a paragraph with each variant's spot. Database pages stay spoiler-free: "Chapter N", never a mission name. Animals: habitat, the animal log (Progress > Animals, study with binoculars or a scope), hunting for Bret (rifle, Target Decks) and fishing lures; title "<Name> Location | GTA 6 Animal | GTAVITIPS". Gangs: territory, Illegal Operations and the unique weapons inside them. Brands: store or station locations, map filter, Ultimate Edition shops with their chapter. Names follow the game: renamed with a 301 on Nov 22 2026 were Final Chapter (was Outlaw Motorcycle Gang), La Polilla Negra (Leonida Cartel), Globe Oil (Global Oil), One-Eyed Willie's (One-Eyes Willies); display spellings San4San, PTT Youngin$, Taco Bomb, Ron. Done Nov 22 2026: 9 Wish List vehicles, the Zorrusso, 4 Ultimate Edition vehicles, 18 weapons, 15 animals, 5 gangs, 13 brands. Skipped for lack of 2+ agreeing guides: 17 animals, 15 factions (7X, Real Dimez and the agencies besides the VCPD; no guide confirms agency tiers or 7X in the game), 64 brands (Binco, Ponsonbys and other chains have no stores in the game; car makers have no dealers), the Flash Grenade, the other base-model vehicles (only one-off standouts, each on one source). Open: the "26 stores" Ammu-Nation line on weapon pages conflicts with guides that count 24; pre-launch "carrier" cards on weapon pages now name La Polilla Negra; check GSC indexing for the done pages before the next round.

**Redirects and the Worker:** `src/index.js` sends http to https and strips trailing slashes in a single 301 hop (localhost is exempt). New static rules go **above** the splat block at the bottom of `hub/_redirects`: Cloudflare counts every rule after the first splat (`*`) rule as dynamic, max 100, and a breach fails the deploy (happened Nov 20 2026). Before adding a rule, also check for loops (A to B plus an older B to A) and chains. Never add an `_redirects` rule whose source path has a real page (`gruppe-6` was hidden that way until Oct 2026): check with the audit below.

**Social images:** a page gets `og:image` only when a real image of that page's own subject exists. Data-driven entries: set `seo.ogImage` to the absolute URL of `heroImage.src` (templates pass it through); entries without a hero photo keep the placeholder comment. News articles use the image from `news.json`; FAQ pages use the image of the first linked news article in the sidebar, else `vice-city-gta-6-location-04.jpg`. Never generate or stock an image for this.

**Image sources (agreed with Badr Nov 21 2026):** Rockstar's own media (rockstargames.com/VI/media packs, Newswire) is always fine. Third-party screenshots are allowed only when both hold: it is verifiably GTA VI, and the provider itself states the images may be reused (a published license or explicit permission, e.g. a creator or community archive that offers its captures for use). Credit them as they ask. Never take images at random from guide or news sites (IGN and the like). Before adding any image, check it is not already on the site by image content, not by file name (files were renamed over time): a 9x8 difference hash with Hamming distance of 10 or less counts as the same image (script: `build/images/dhash.ps1 -Dir <folder> -Out <csv>`, PowerShell System.Drawing, no Python needed). On Nov 21 2026, 132 of Rockstar's 201 launch images were already in `hub/assets/images/`, many of them unused on any page.

**Site audit (Ahrefs, Oct 2026):** the free Ahrefs Site Audit reports broken links, orphan pages, single-incoming-link pages, titles over 70 characters, schema.org validation and meta tags. Dates in JSON-LD must be full ISO dates or left out (never "April 2026"); there is no `VideoGameCharacter` type in schema.org (character pages use `Article` with `about`); a meta `content` attribute must escape double quotes as `&quot;` (an unescaped quote silently empties the description). When replacing text with `String.replace`, use a function as the replacement, because `$100` is read as a group reference.

## Design system

All CSS is written inline per page inside a `<style>` block — no shared stylesheet. When adding or editing pages, replicate the existing CSS pattern exactly. Never introduce external CSS files unless explicitly agreed.

**Visual identity: Tropical Deco.** The site went through a full redesign (Aug 2026, merged to main in commit `0f9d4dfd`, confirmed live). Every page site-wide — index/hub pages, all 8 database categories, FAQ, news — uses the palette and fonts below. These values replace anything from before Aug 2026; if you find a page still using the old palette or Poppins, it wasn't migrated, flag it rather than porting the old style forward.

### CSS variables (always use these, never hardcode colors)

Base (`:root`, also the dark-mode values):
```css
--blue:         #e0785f;   /* coral */
--blue-dim:     rgba(224,120,95,0.14);
--blue-border:  rgba(224,120,95,0.30);
--pink:         #4a9e93;   /* teal */
--pink-dim:     rgba(74,158,147,0.10);
--paper:        #ece4d3;
--paper-ink:    #2a2420;
--green:        #3ea35f;
--green-dim:    rgba(62,163,95,0.12);
--green-border: rgba(62,163,95,0.30);
--amber:        #d19a3d;
--amber-dim:    rgba(209,154,61,0.12);
--amber-border: rgba(209,154,61,0.30);
--red:          #c0503f;
--red-dim:      rgba(192,80,63,0.12);
--red-border:   rgba(192,80,63,0.30);
--bg:           #0b0a08;
--bg-2:         #131110;
--bg-3:         #1c1815;
--bg-4:         #262019;
--border:       rgba(255,255,255,0.055);
--border-b:     rgba(224,120,95,0.22);
--t1:           #f2ede4;   /* primary text */
--t2:           #a89a86;   /* secondary text */
--t3:           #6b5f4f;   /* muted text */
--r:            12px;
--nav-h:        62px;
```

`[data-theme="light"]` overrides to warm paper tones (`--bg:#ece4d3`, `--blue:#a8442c` rust, `--pink:#2c6b61` deep teal, etc.); `[data-theme="dark"]` re-asserts the base values so the toggle wins over `prefers-color-scheme` in both directions. Copy the exact override blocks from a live page (e.g. `hub/news/gta-6-playstation-ps5-partnership/index.html`) rather than retyping them by hand.

### Fonts

Three-font system, loaded from Google Fonts:
- **Anton** — display headings (H1/H2 everywhere), always uppercase, `font-weight: 400` (the typeface is inherently heavy)
- **Archivo** — body text and UI (nav, buttons, form fields), weights 400/600/700
- **Courier Prime** — monospace, used for every small structural label: eyebrows, badges, stat-block keys, dates, breadcrumbs — always uppercase with wide letter-spacing (`.09em`–`.14em`)

Poppins is gone site-wide.

### Aesthetic

Visually the site reads as **Tropical Deco** — a street-artifact identity: warm paper/kraft tones in light mode, warm dark charcoal in dark mode, a coral + teal accent duo, rotated stamp-shaped tags and badges (asymmetric corner radius, e.g. `border-radius: 8px 2px 8px 2px`, `transform: rotate(-1.2deg)`) instead of pill+dot chips. The site's mark is a small rotated ticket/flag shape ("VI") used as the nav logo badge and footer brand badge.

The **tone of voice** is a separate layer from the visual skin and hasn't changed: it's GTA with a bit of internet language. Write like you're *inside* the world of Leonida reporting on what's happening on the ground — not like a journalist covering a video game. 7X doesn't "appear in GTA 6" — they run Vice City and everyone knows it. Lucia isn't "a confirmed protagonist" — she's out and she's moving.

Keep it street-level, in-world, self-assured. A touch of internet language and GTA attitude keeps it from feeling too stiff. Never hype-driven, never clickbait, never "OMG confirmed!!!" — but also never dry or academic. The tagline says it all: "You picked the wrong house, fool."

**Full tone of voice rules, examples, and checklist: see `TOV.md` in the repo root.** When improving any page, reference TOV.md first.

### Typography conventions

- Headings (H1/H2): `font-family: 'Anton'`, `font-weight: 400`, `text-transform: uppercase`, `letter-spacing: 0`
- Eyebrow / badge / stat-key labels: `font-family: 'Courier Prime'`, `font-size: 9–11px`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: .09em–.14em`
- Navigation: `font-family: 'Archivo'`, `font-weight: 600/700`, `text-transform: uppercase`, `letter-spacing: .07em`
- Body: `font-family: 'Archivo'`, `font-size: 14–16px`, `color: var(--t2)`, `line-height: 1.6–1.85`
- Tags/badges: rotated stamp shape (see Aesthetic above), not `border-radius: 99px` pills
- **Section H2s (`section__h2`, `article-section__h2`) are always `color: var(--t1)` (white), never blue — applies to every page type.** Recurring problem, check it on every page you touch.

### Image overlays — three contexts now

- **Cards with a background image** (homepage, category cards, news cards): directional gradient overlay, coral tint at top fading to transparent, dark at bottom, text pinned to the bottom. Never a flat dark wash.
  Example: `linear-gradient(to bottom, rgba(224,120,95,.10) 0%, rgba(19,17,16,0) 32%, rgba(19,17,16,.80) 60%, rgba(19,17,16,.95) 100%)`
- **Entry-page photo hero** (`.char-hero`, `.location-hero`, etc. — the full-bleed image at the top of a database entry page): carries a bottom-anchored scrim so the H1/eyebrow/subtitle stay legible over the photo. Example: `linear-gradient(to top, var(--bg) 0%, rgba(11,10,8,.55) 55%, rgba(11,10,8,0) 100%)`. This replaces the old "no overlay on entry photos" rule.
- **Secondary/gallery photos** further down an entry page (additional shots beyond the hero): no overlay, no text label, plain framed images.

### Shared components (replicate exactly)

Every page includes:
1. **Nav** — fixed, with logo badge "VI" (rotated ticket/flag clip-path shape), links, search button, theme toggle, "Browse Database" CTA, hamburger for mobile
2. **Search overlay** — fullscreen, redirects to `google.com/search?q=site:gtavitips.com+{query}`
3. **Footer** — 5-column grid: brand description, Database links, Site links, Legal links, Contact
4. **Cookie banner** — GA4 loads only on accept, stores consent in `localStorage` as `gtavitips-cookie-consent`
5. **Theme toggle** — persists in `localStorage` as `gtavitips-theme`, applied before render to prevent flash

The nav has a dropdown for "Database" with all 8 category links. The dropdown uses hover + click with a 120ms close delay.

## SEO requirements

Every page must have:
- `<title>` — descriptive, includes "GTAVITIPS" or "GTA 6"
- `<meta name="description">` — specific, under 160 chars
- `<meta property="og:type">`, `og:title`, `og:description`, `og:url`
- `<meta name="twitter:card" content="summary_large_image">`
- `<meta property="og:image">` with an absolute URL to a real image of the page's own subject (see Social images under Build tooling); no image is better than a wrong one
- Every FAQ page ends with a "More FAQ" block of 2 to 4 related FAQ links plus the link to the FAQ index
- `<link rel="canonical">`
- `<script type="application/ld+json">` — appropriate Schema.org type (WebPage, Article, FAQPage, etc.)

Structured data must be accurate. The FAQ page uses `FAQPage` schema. Database entry pages should use `Article` or `WebPage`. News articles use `NewsArticle`.

After adding or editing any page, update `sitemap.xml` with the new URL and today's date as `lastmod`.

## Content sourcing rules

This is the most important editorial rule on the site. Every piece of information must carry a source status:

| Label | Meaning |
|---|---|
| **Confirmed / Verified** | Cross-referenced across 2+ approved sources |
| **Reported** | Single approved source, named explicitly |
| **Speculation / Unverified** | No approved source — always labeled clearly, never called Confirmed |

**Approved sources:** Official Rockstar trailers, Rockstar Newswire, Take-Two investor communications, official social media posts, Tez2, Matheusvictorbr.

Never present unverified leaks as facts. Never omit a source label on a claim.

**Newswire announcements (pre-launch rule, Nov 2026; for game facts superseded by "After launch" below):** a Rockstar Newswire announcement counts as **Confirmed** on its own, even though the table asks for 2+ sources. A secondary detail that appears only in one Newswire post and nowhere else approved (for example the free poster and map announced with the pre-load date) gets **Reported**. Read the Newswire post itself on rockstargames.com before labeling anything. Trackers and press coverage help find the post and are never cited as sources.

**After launch (agreed with Badr Nov 20 2026): no verdict labels on game facts.** The game is out, so stats, names, missions, locations and mechanics carry **no** Confirmed/Reported badge. They get one plain source line instead, credited to the game itself ("GTA VI, in-game", "the in-game weapon menu", "in-game WAiNK scans"): credit, not a verdict. **Never credit a competitor as a source** (agreed with Badr Nov 20 2026): no guide sites or guide outlets (IGN guide, GameSpot, PowerPyx, KeenGamer, GamesRadar, Sportskeeda and the like), no fan databases (gtabase, meowdb, timesaver), no relay outlets ("as reported by X", "via X"). They may be read to find and cross-check facts, never named. Primary sources stay credited: Rockstar (Newswire, trailers, credits, Support), Take-Two, PlayStation/Xbox, Digital Foundry for technical tests, the original outlet of an exclusive report or interview (GamesBeat, Game Informer, Famitsu), Metacritic for review scores. `build/faq/sources.js` enforces this in the FAQ generators. "Confirmed" is gone as a label everywhere; news badges that said Confirmed now say **Rockstar** (where it came from). **Reported / Speculation / Unverified / Analysis stay only where something is genuinely uncertain:** sales figures, PC version, GTA Online, business news, the rumor hub.

**No eyebrows (agreed Nov 20 2026).** No small label above an H2 or H1 (no `section__eyebrow`, `article-section__eyebrow`, `index-section__eyebrow`, hero eyebrows like "Character File"). The heading stands on its own. Badr called them AI slop. Also avoid the punchy one-liner closer in Analysis callouts. Removed site-wide by `build/stats/sitewide-labels-eyebrows.js`; templates no longer emit them. The same goes for small labels on cards: no "Live Now" on the homepage ops cards (Badr, Nov 20 2026). The "Quick Lookup" label above the hub search fields is gone too, and all dead eyebrow CSS was stripped from every page and template (Badr, Nov 21 2026); don't reintroduce eyebrow rules.

**Spoilers (agreed with Badr Nov 20 2026): yes, in three layers.** (1) Default spoiler-free: database entries, gameplay FAQs and news carry no story beats. (2) Light spoilers, flagged with a short notice at the top of the page: chapter and mission names, who a character is, the opening of the story. (3) Heavy spoilers (antagonist, deaths, betrayals, endings) only inside a click-to-reveal block with a warning and the chapter ("Spoiler: Chapter 4"); the text stays in the HTML for search engines. The story lives in three places, written once: mission pages (goal, rewards, missables, summary behind the reveal, a creator walkthrough embed with credit), a story hub (five chapters, linking to missions) and a collapsible "Story Arc" section on character pages. Story FAQs answer in one line behind the reveal and link to the hub. **Sourcing story facts:** plot facts reported by several good sources (guides, press, creator videos, widely shared community posts) are facts and fine to use; write them in our own words and voice, never copy or sentence-by-sentence paraphrase someone else's text. Credit story facts to the game ("GTA VI, in-game"), never to the guide or outlet they were cross-checked against.

**Before writing about a new Rockstar post:** search the site for the old claim it may overturn (the date, size, or status it replaces, for example "November 12", "has not published", "no station confirmed"). Correct the live status pages, and add an update callout to any dated article that now says the opposite. Otherwise news articles stay dated snapshots.

## Database entry conventions

**Header structure updated Aug 2026** (part of the Tropical Deco redesign): each entry page now opens with a **full-bleed photo hero** (`.char-hero` for characters, equivalent classes per category) instead of the old boxed dossier header:
- Back-link to the category index
- No eyebrow above the H1 (removed Nov 2026), no rotated stamp/badge in the hero itself
- H1 with the second part in `<span style="color:var(--blue)">`, sitting over the photo
- One-line subtitle paragraph
- The photo carries a bottom-anchored scrim gradient (see Image overlays above) for legibility. If a subject has no photo at all, the hero falls back to a plain gradient background with a faint line-icon graphic — never fabricated or stock imagery.

Below the hero:
- Stat-block (Role/Type, Affiliation, First Seen, etc.) — **no Status field** (removed May 2026, still true)
- Secondary/gallery photos where more than one image exists — plain, no overlay, no label
- Description paragraph — terse, authoritative, present tense
- **No "On Record" / sightings-intel-log section** (removed Aug 2026 across the whole site — was a per-claim trailer-citation list; Badr's call was to drop it entirely, no replacement, not even folded into body prose)
- "Known Connections" — horizontal cards, internal links to related characters, locations, factions
- **Connection card descriptions must be specific per relationship, never a generic stamp** ("The high-performance variant.", "Jason is among the operatives Wyman contracts for vehicle retrieval.") — never "Confirmed carrier/user in official footage." repeated across cards. Found as the established pattern on 25/26 weapons pages (restated the removed status-badge as prose instead of actually dropping it) and fixed Oct 2026; apply this standard to any category.

No status badge anywhere on the page (decided May 2026: presence in the database implies confirmation).

Category-specific details below (stat-block fields, section order) were written pre-redesign and describe content structure that's still accurate; only the header/hero markup changed. When in doubt, read one live page of the same type before building — that's standing practice for this site, not specific to this section.

### Character pages (approved template — May 2026, hero updated Aug 2026)

- **No** dossier badge, **no** Status stat-block field — skip both from the start
- **H1**: two-part names get the last name in `<span style="color:var(--blue)">` (Lucia <span>Caminos</span>); single-word names (Roxy, Rudi, Wyman, Stefanie, DWNPLY) stay fully white, no color split
- **FAQ section heading**: no eyebrow, H2 always "Frequently <span style="color:var(--blue)">Asked</span>" — never "Common Questions" (found drifted on 9/21 character pages Oct 2026, corrected to match the site-wide convention used by activities/weapons/animals)
- **Post-launch revision (agreed with Badr Nov 20 2026, pilot: jason-duval, lucia-caminos):** section order hero, spoiler notice, stat block + gallery + one plain source line (`statSource`), Dossier (spoiler-free), Known Connections, Story Arc, Frequently Asked. Story Arc (`storyArc` in the data file) stays open with a light intro; every chapter's beats sit in their own closed `<details class="spoiler">` labelled "Spoiler: Chapter N" / "Prologue", same component as the story FAQs, never in JSON-LD or meta. Heavy beats need 3+ independent good sources, not counting our own FAQs. Protagonist stat blocks carry gameplay facts (fitness, Criminal Profile, abilities); starting weapons and signature vehicles only once well sourced. Connection cards carry no role label; the relationship lives in the description, and connections that are spoilers live only in the Story Arc. Revised pages move to the canonical Tropical Deco CSS. The list of missing characters is `build/data/characters/_missing-characters-SPOILERS.md`: gitignored, never committed, never quoted in chat.
- **Missing characters get pages, all of them (agreed with Badr Nov 20 2026), including the ones whose name alone is a heavy spoiler.** Badr accepted that such a name shows in the title, URL, hub card and search. Keep everything else around it spoiler-free: meta/og/JSON-LD description, hub card, search-index line, hero subtitle, Dossier and stat block say who they are at first meeting only (or nothing story-specific); the heavy role lives only inside Story Arc reveals. Those pages get the stronger top notice (`spoilerNote` field). Built in batches of about five, light names first, heavy names last.

### Activity pages (approved template — May 2026)

Reference file: `hub/gameplay/activities/weightlifting/index.html`

- **No** dossier badge, **no** Intel Status stat row
- **H1**: compound word → split at natural boundary (`Weight<span style="color:var(--blue)">lifting</span>`); two words → second word blue; single word → all white
- **Stat block**: Type / Setting / Real-World Basis (3 rows only)
- **Photo**: `transform: scale(1.25)` to crop letterbox bars; no gradient overlay; no text label on image
- **Section order and names** (fixed):
  1. H2 **Dossier** — all body text, how it works, no trailer references
  2. H2 **Known Connections** — horizontal cards, always a mix of activity + character + location + vehicle; 56px avatar with photo if the linked page has one; pick non-obvious connections (not Jason or the Karin Sultan RS by default); card descriptions never name "Trailer X" or "Scene X"
  3. H2 **Frequently Asked** — native `<details>/<summary>` accordions
- **section__h2** always `color: var(--t1)` (white), never blue

Entry slugs follow kebab-case: `/gameplay/characters/lucia-caminos`, `/gameplay/vehicles/karin-sultan-rs`.

## News article template (approved June 2026)

Reference file: `hub/news/gta-6-playstation-ps5-partnership/index.html` — replicate its structure exactly.

- **Hero**: back-link to `/news`, H1 with the second part in a `<span>`, deck paragraph that answers the story in 2–3 concrete sentences, meta row with badge (Rockstar / Reported / Speculation, never Confirmed) + date
- **Sections**: `article-section__h2` (white), no eyebrow. Section names are custom per article — make them say something, not "Introduction"
- **Intel callouts**: `Source` callouts for sourcing (label is just "Source", or "Source, Reported" when uncertain), `Analysis` callouts for perspective. The attitude lives in the Analysis callouts; body prose stays dry and precise
- **Voice**: news is factual and self-assured, not forced street language. TOV.md rules apply in full (no meta-language, no hedging, no AI patterns, no em dashes)
- **Author block**: bio line is always exactly **"You picked the wrong house, fool!"** — never a custom bio per article
- **Comments section**: standard in every article (CSS + HTML block + Supabase script tags — see the Xbox wishlist article as reference)
- **`news.json` entry** with: url, title, date, badge, badgeClass, cat, deck, image, imageAlt, imagePosition (optional), thumb, featured
- **`featured` semantics (counterintuitive!):** the homepage Latest Updates grid shows the first three articles with `featured: false` — the top one becomes the hero card. `featured: true` *excludes* an article from that grid (used to pin evergreens out of the rotation). To spotlight a new article on the homepage: `featured: false` + put it at the top of the array.
- **Internal links**: every database entry mentioned gets its link, plus related news articles and relevant FAQs
- **Sitemap**: add the new URL with today's `lastmod`

## Internal linking rules

Every page must link to logically related content. This is not a separate step — it's part of creating the page. Rules by page type:

**Database entries** — link to all meaningfully related entries across categories:
- Characters → their locations, faction affiliations, vehicles spotted with them, connected characters
- Locations → factions operating there, characters associated, vehicles spotted, activities available
- Vehicles → associated brand, factions using them, characters spotted with them, locations seen
- Gangs/Factions → territory locations, associated characters, vehicles they use
- Brands → locations where present, associated vehicles or factions
- Animals → habitat locations, other animals in the same region
- Weapons → characters carrying them, factions using them, locations where spotted
- Activities → locations where they take place, associated factions or characters

**FAQ pages** — link to 2–4 related FAQ questions at the bottom. Also link to any database entries or news articles directly relevant to the answer.

**News articles / deepdives** — link to every database entry mentioned. Also link to related news articles and relevant FAQ questions.

**Index/hub pages** — structural links already handled by nav and category cards. No extra action needed.

When a referenced entry doesn't have a page yet: don't link it. Flag it as a missing entry for a future database session — never create a page just to satisfy a link.

## Status badge colors

| Status | Color |
|---|---|
| Rockstar (news source badge) | `--green` / `--green-dim` |
| Reported | `--blue` / `--blue-dim` |
| Speculation | `--amber` / `--amber-dim` |
| New (changelog) | `--blue` / `--blue-dim` |
| Upgrade (changelog) | `--green` / `--green-dim` |

## Rumor checks (agreed Oct 2026)

Rumor checks live on `/faq/gta-6-rumors-true-or-false` (one hub, one block per rumor, linking to the dedicated FAQ where one exists). Each rumor gets exactly one verdict:

| Verdict | Meaning | Color |
|---|---|---|
| True | Rockstar's own material shows it | `--green` |
| Debunked | Rockstar's own material contradicts it, or the evidence is shown to be doctored (e.g. the fake 676.7 GB file size screenshot) | `--red` |
| Unverified | No approved source either way | `--amber` |
| Outdated | Overtaken by news | `--blue` |

A rumor with no approved source never counts as True. No personal names on rumors about people, no links to leakers or leak sources. Add a new check only after the sources were opened and read; update the hub, FAQ index, sitemap and search-index in the same batch.

## Canonical category images

Each database category has one locked image used wherever that category appears as a visual card (homepage, future use). Never mix these up across pages.

| Category | Canonical image | Note |
|---|---|---|
| Activities | `gameplay-index-gta-6-01.jpg` | ✓ |
| Animals | `mount-kalaga-national-park-gta-6-location-05.jpg` | ✓ |
| Brands | `jason-duval-gta-6-character-06.jpg` | ⚠ placeholder — needs a brands/storefront shot |
| Characters | `vice-city-gta-6-location-04.jpg` | ⚠ placeholder — needs a character shot |
| Gangs & Factions | `ambrosia-gta-6-location-01.jpg` | ✓ |
| Locations | `grassrivers-gta-6-location-02.jpg` | ✓ |
| Vehicles | `grassrivers-gta-6-location-03.jpg` | ⚠ placeholder — needs a vehicle shot |
| Weapons | `jason-duval-gta-6-character-05.jpg` | ⚠ placeholder — needs a weapons shot |

When a better image is found for a ⚠ category, update it on the homepage card AND anywhere else it appears — always keep them in sync.

## Key facts about GTA 6 (for content accuracy)

- **Setting:** State of Leonida (fictional Florida). Vice City is the main urban hub (Miami analog).
- **Protagonists:** Lucia Caminos (Liberty City origin, released from Leonida correctional at story start) and Jason Duval (Leonida native, military background, drug running history)
- **Release date:** released November 19, 2026 (Newswire "Grand Theft Auto VI Now Available") — PS5 and Xbox Series X/S only. No PC date confirmed.
- **In-game counts (IGN Official Guide, Reported):** 53 guns + 9 melee + 4 explosives standard issue, ~129 unique weapon variants; 277 base vehicles in 18 classes + 281 standout vehicles; 255 animals; 91 story missions in 5 chapters. Weapon names are brand + model (Girardi ES9, Klose K17, Duke 556), sold at Ammu-Nation (26 stores, Standard/Expanded/Hunting stock).
- **Database size:** 301 entries across 8 categories, plus 26 FAQ pages and 35 news articles (as of July 2026)
- **Key confirmed locations:** Vice City, Ocean Beach, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Lake Leonida, Red Hill Forest
- **Place names follow Rockstar's official map (agreed with Badr Nov 21 2026):** when a pre-launch name differs from the map, rename the page to the map name with a 301 (South Beach became Ocean Beach, North Beaches became Washington Beach). Exception for search: the county page keeps the URL `/gameplay/locations/vice-county` and is titled Vice-Dale County with "Vice County" alongside, so it ranks for both. Shrewsbury and Yorktown (not on the map) stay as they are for now.
- **Locations are hub-and-spoke by county (agreed with Badr Nov 21 2026):** every named place gets its own page, and each county has an area page (`lummox-county`, `kelly-county`, `leonard-county`, `mariana-county`, plus `vice-county` for Vice-Dale) that walks through its places and links them. Every place page carries a "County" stat row and a connection card back to its county. Which place sits in which county: `build/output/_work/county-of.json` (gitignored working file; map label placement plus 2+ sources). Pages for places with thin sources stay short and true; enrich them as guides appear or from Badr's own in-game screenshots.
- **Key confirmed factions:** 7X (dominant Vice City street gang), Brute Security, VCPD, VCSO, Leonida State Police, NOOSE
- **Map:** /map shows Rockstar's official "Great State of Leonida" map (released at launch, five counties: Lummox, Kelly, Leonard, Vice-Dale, Mariana) as a static image since Nov 21 2026; the interactive map is in development, no date

## Standing workflows (always follow these step orders)

**Publishing rule (July 2026):** content never goes live without Badr's explicit confirmation on the finished work. Build everything locally first, present a summary, wait for his go, then push related changes as one batch — never piecemeal.

**News article:** voorstel → sparren (dekking, hoek, bronnen) → schrijven (`/news/[slug]/index.html`) → afbeelding kiezen uit `/assets/images/` (zet path in news.json én artikel-hero; vraag of er een tweede afbeelding in het artikel moet) → vragen of het artikel featured op de homepage moet (`featured: true` in news.json) → **`feed.xml` bijwerken** (nieuw item bovenaan, RSS 2.0, pubDate in RFC-822; max ~20 items, oudste eruit) → posten (alles in één commit + push).

**Database entry:** voorstel (naam + categorie) → sparren (confirmed/reported/speculation, bronnen, metadata) → schrijven (`/gameplay/[categorie]/[slug]/index.html`) → JSON updaten (characters.json etc.) → sitemap → herhaal per entry → feed-selectie aan het einde van de sessie (nooit per entry; max ~5 items, mix van categorieën, Badr geeft akkoord) → posten in één commit.

**FAQ tooling (Nov 2026):** `build/faq/faq-gen.js <specs>` writes FAQ pages from a spec file (shell = when-does-gta-6-release) and updates index, FAQPage JSON-LD, search-index and sitemap; `faq-retire.js` folds an obsolete FAQ into its follow-up with a 301; `faq-index-inline.js` edits short index answers without their own page. Output is still plain HTML. See the specs files for the field shape. Spoiler blocks: an answer entry `{spoiler:{chapter, html}}` or a related item's `spoiler:{chapter, html}` renders a `<details class="spoiler">` reveal, adds the top notice and the spoiler CSS to that page only, and keeps the spoiler text out of the JSON-LD (example: `specs-2026-11-20d.js`; story index answers in `index-inline-2026-11-20d.js` via `faq-index-inline.js <items.js>`).

**FAQ:** voorstel (of Claude suggereert ontbrekende vragen) → sparren (antwoord, nuances, lengte) → schrijven (`/faq/[slug]/index.html`) → FAQ-index bijwerken → sitemap → posten.

**Feed (`feed.json`):** alleen in batch aan het einde van een database-sessie of bij een entry-upgrade. Claude stelt mix voor (max ~5, categorieën en badges new/upg gemengd) → akkoord Badr → updaten → posten. De homepage-secties "Live Feed" (hero) én "Latest Updates" renderen beide uit feed.json; een feed-update ververst dus automatisch de homepage.

**Homepage Sitrep (juli 2026):** het Sitrep-blok op de homepage (launch/countdown/pre-orders/trailers + "Updated"-datum) is statische HTML en moet handmatig bijgewerkt worden zodra een feit verandert (nieuwe trailer, prijswijziging, PC-aankondiging, etc.) — check dit blok bij elke news-sessie. De countdown rekent zichzelf uit via JS. Entry-tellingen: `stats.json` én de statische fallback in de hero horen gelijk te lopen met het echte aantal entry-mappen.

**Launch week (Nov 12 pre-load, Nov 19 launch):** `launch/PLAYBOOK.md` lists every page that carries live status and what changes on each date; `launch/day0-is-out-yet.js` flips the static text of the is-out-yet FAQ (run with `--dry` first). The `launch/` folder is outside `hub/` and is never deployed. Same publishing rule applies: build locally, show Badr, wait for go.

**Intel Drop (`/intel-drops/`):** alleen bij mijlpalen (nieuwe categorie, 10+ entries, grote site-change, significant officieel materiaal). Sparren over titel (één blauw woord in `<span style="color:var(--blue)">`), context-alinea en source badge (Official groen / Internal blauw / Leaker amber) → nieuw `<div class="drop">` blok **bovenaan** de lijst → geen sitemap-update nodig → posten. Entry badges: `--new` of `--upg`.

## Contacts & social

- Email: info@gtavitips.com
- X / Twitter: @gtavitips
- TikTok: @gtavi.tips
- Instagram: @gtavitipsdotcom

## Cloudflare Worker name

`wrangler.jsonc` uses `"name": "badr"` — this is intentional. The custom domain gtavitips.com is attached to the "badr" worker. Do NOT rename it without first moving the custom domain in the Cloudflare dashboard, or deploys will silently go to a new orphan worker and the live site will go stale.

## What Claude should always do

1. Match existing CSS variables, class naming conventions, and component patterns exactly
2. Include full SEO markup (canonical, OG tags, JSON-LD) on every page
3. Write mobile-responsive CSS — test breakpoints at 1024px, 768px, 480px
4. Credit the source on every claim; use a Reported/Speculation label only where something is genuinely uncertain (see Content sourcing rules)
5. Use the military/intel tone: terse, uppercase headings, no fluff
6. Keep the dark theme default — light theme must work too via CSS variables
7. After adding a page: update `sitemap.xml` yourself with the new URL and today's `lastmod` (do not leave this to Badr)

## What Claude should never do

1. Use hardcoded hex colors instead of CSS variables
2. Add external JS libraries or CSS frameworks
3. Publish a claim without a source, or put a Confirmed badge or an eyebrow on anything
4. Create shared CSS files (until explicitly agreed)
5. Add unverified information without clearly marking it as Speculation
