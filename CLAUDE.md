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
├── map/index.html          # Interactive map (in development, launch day)
├── news/                   # News articles (one folder per article)
├── gameplay/               # Main database
│   ├── index.html          # Database hub
│   ├── activities/
│   ├── animals/
│   ├── brands/
│   ├── characters/
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

## Database entry conventions

**Header structure updated Aug 2026** (part of the Tropical Deco redesign): each entry page now opens with a **full-bleed photo hero** (`.char-hero` for characters, equivalent classes per category) instead of the old boxed dossier header:
- Back-link to the category index
- Plain-text eyebrow ("Character File", "Location File", etc.) — no rotated stamp/badge in the hero itself
- H1 with the second part in `<span style="color:var(--blue)">`, sitting over the photo
- One-line subtitle paragraph
- The photo carries a bottom-anchored scrim gradient (see Image overlays above) for legibility. If a subject has no photo at all, the hero falls back to a plain gradient background with a faint line-icon graphic — never fabricated or stock imagery.

Below the hero:
- Stat-block (Role/Type, Affiliation, First Seen, etc.) — **no Status field** (removed May 2026, still true)
- Secondary/gallery photos where more than one image exists — plain, no overlay, no label
- Description paragraph — terse, authoritative, present tense
- **No "On Record" / sightings-intel-log section** (removed Aug 2026 across the whole site — was a per-claim trailer-citation list; Badr's call was to drop it entirely, no replacement, not even folded into body prose)
- "Known Connections" — horizontal cards, internal links to related characters, locations, factions

No status badge anywhere on the page (decided May 2026: presence in the database implies confirmation).

Category-specific details below (stat-block fields, section order) were written pre-redesign and describe content structure that's still accurate; only the header/hero markup changed. When in doubt, read one live page of the same type before building — that's standing practice for this site, not specific to this section.

### Character pages (approved template — May 2026, hero updated Aug 2026)

- Hero eyebrow: "Character File"
- **No** dossier badge, **no** Status stat-block field — skip both from the start
- **H1**: two-part names get the last name in `<span style="color:var(--blue)">` (Lucia <span>Caminos</span>); single-word names (Roxy, Rudi, Wyman, Stefanie, DWNPLY) stay fully white, no color split

### Activity pages (approved template — May 2026)

Reference file: `hub/gameplay/activities/weightlifting/index.html`

- **No** dossier badge, **no** Intel Status stat row
- **H1**: compound word → split at natural boundary (`Weight<span style="color:var(--blue)">lifting</span>`); two words → second word blue; single word → all white
- **Stat block**: Type / Setting / Real-World Basis (3 rows only)
- **Photo**: `transform: scale(1.25)` to crop letterbox bars; no gradient overlay; no text label on image
- **Section order and names** (fixed):
  1. Eyebrow "Activity Overview" / H2 **Dossier** — all body text, how it works, no trailer references
  2. Eyebrow "Filed Connections" / H2 **Known Connections** — horizontal cards, always a mix of activity + character + location + vehicle; 56px avatar with photo if the linked page has one; pick non-obvious connections (not Jason or the Karin Sultan RS by default); card descriptions never name "Trailer X" or "Scene X"
  3. Eyebrow "Frequently Asked" / H2 **Frequently Asked** — native `<details>/<summary>` accordions
- **section__h2** always `color: var(--t1)` (white), never blue

Entry slugs follow kebab-case: `/gameplay/characters/lucia-caminos`, `/gameplay/vehicles/karin-sultan-rs`.

## News article template (approved June 2026)

Reference file: `hub/news/gta-6-playstation-ps5-partnership/index.html` — replicate its structure exactly.

- **Hero**: back-link to `/news`, H1 with the second part in a `<span>`, deck paragraph that answers the story in 2–3 concrete sentences, meta row with badge (Confirmed / Reported / Speculation) + date
- **Sections**: eyebrow (pink line + pink uppercase label) + `article-section__h2` (white). Section names are custom per article — make them say something, not "Introduction"
- **Intel callouts**: `Source — Confirmed` callouts for sourcing, `Analysis` callouts for perspective. The attitude lives in the Analysis callouts; body prose stays dry and precise
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
| Confirmed / Verified | `--green` / `--green-dim` |
| Reported | `--blue` / `--blue-dim` |
| Speculation | `--amber` / `--amber-dim` |
| New (changelog) | `--blue` / `--blue-dim` |
| Upgrade (changelog) | `--green` / `--green-dim` |

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
- **Release date:** November 19, 2026 — PS5 and Xbox Series X/S only at launch. No PC date confirmed.
- **Database size:** 301 entries across 8 categories, plus 26 FAQ pages and 35 news articles (as of July 2026)
- **Key confirmed locations:** Vice City, South Beach, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Lake Leonida, Red Hill Forest
- **Key confirmed factions:** 7X (dominant Vice City street gang), High Rollerz (car culture crew), Brute Security, VCPD, VCSO, Leonida State Police, NOOSE
- **Interactive map:** In development, targeting November 19, 2026 launch day release

## Standing workflows (always follow these step orders)

**Publishing rule (July 2026):** content never goes live without Badr's explicit confirmation on the finished work. Build everything locally first, present a summary, wait for his go, then push related changes as one batch — never piecemeal.

**News article:** voorstel → sparren (dekking, hoek, bronnen) → schrijven (`/news/[slug]/index.html`) → afbeelding kiezen uit `/assets/images/` (zet path in news.json én artikel-hero; vraag of er een tweede afbeelding in het artikel moet) → vragen of het artikel featured op de homepage moet (`featured: true` in news.json) → **`feed.xml` bijwerken** (nieuw item bovenaan, RSS 2.0, pubDate in RFC-822; max ~20 items, oudste eruit) → posten (alles in één commit + push).

**Database entry:** voorstel (naam + categorie) → sparren (confirmed/reported/speculation, bronnen, metadata) → schrijven (`/gameplay/[categorie]/[slug]/index.html`) → JSON updaten (characters.json etc.) → sitemap → herhaal per entry → feed-selectie aan het einde van de sessie (nooit per entry; max ~5 items, mix van categorieën, Badr geeft akkoord) → posten in één commit.

**FAQ:** voorstel (of Claude suggereert ontbrekende vragen) → sparren (antwoord, nuances, lengte) → schrijven (`/faq/[slug]/index.html`) → FAQ-index bijwerken → sitemap → posten.

**Feed (`feed.json`):** alleen in batch aan het einde van een database-sessie of bij een entry-upgrade. Claude stelt mix voor (max ~5, categorieën en badges new/upg gemengd) → akkoord Badr → updaten → posten. De homepage-secties "Live Feed" (hero) én "Latest Updates" renderen beide uit feed.json; een feed-update ververst dus automatisch de homepage.

**Homepage Sitrep (juli 2026):** het Sitrep-blok op de homepage (launch/countdown/pre-orders/trailers + "Updated"-datum) is statische HTML en moet handmatig bijgewerkt worden zodra een feit verandert (nieuwe trailer, prijswijziging, PC-aankondiging, etc.) — check dit blok bij elke news-sessie. De countdown rekent zichzelf uit via JS. Entry-tellingen: `stats.json` én de statische fallback in de hero horen gelijk te lopen met het echte aantal entry-mappen.

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
4. Label all content with the correct source status (Confirmed / Reported / Speculation)
5. Use the military/intel tone: terse, uppercase headings, no fluff
6. Keep the dark theme default — light theme must work too via CSS variables
7. After adding a page: update `sitemap.xml` yourself with the new URL and today's `lastmod` (do not leave this to Badr)

## What Claude should never do

1. Use hardcoded hex colors instead of CSS variables
2. Add external JS libraries or CSS frameworks
3. Publish content without a source status label
4. Create shared CSS files (until explicitly agreed)
5. Add unverified information without clearly marking it as Speculation
