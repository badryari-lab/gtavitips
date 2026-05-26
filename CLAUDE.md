# GTAVITIPS — Claude Working Guide

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
- **Fonts** — Poppins (400, 600, 700, 900) via Google Fonts
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

### CSS variables (always use these, never hardcode colors)

```css
--blue:        #005f90;
--blue-dim:    rgba(0,95,144,0.12);
--blue-border: rgba(0,95,144,0.28);
--pink:        #ff0055;
--pink-dim:    rgba(255,0,85,0.10);
--green:       #28a745;
--green-dim:   rgba(40,167,69,0.12);
--amber:       #ffc107;
--amber-dim:   rgba(255,193,7,0.12);
--bg:          #080c12;   /* darkest background */
--bg-2:        #0d1320;
--bg-3:        #131c2e;
--bg-4:        #192236;
--border:      rgba(255,255,255,0.06);
--border-b:    rgba(0,95,144,0.22);
--t1:          #eef2f7;   /* primary text */
--t2:          #7e8fa3;   /* secondary text */
--t3:          #445060;   /* muted text */
--r:           12px;      /* border radius */
--nav-h:       62px;
```

Light theme overrides exist via `[data-theme="light"]` — always support both.

### Aesthetic

The visual design is intel/military — uppercase headings, tight letter-spacing, scan lines, pulse dots, dossier-style layouts. But the **tone of voice** is different: it's GTA with a bit of internet language. Write like you're *inside* the world of Leonida reporting on what's happening on the ground — not like a journalist covering a video game. 7X doesn't "appear in GTA 6" — they run Vice City and everyone knows it. Lucia isn't "a confirmed protagonist" — she's out and she's moving.

Keep it street-level, in-world, self-assured. A touch of internet language and GTA attitude keeps it from feeling too stiff. Never hype-driven, never clickbait, never "OMG confirmed!!!" — but also never dry or academic. The tagline says it all: "You picked the wrong house, fool."

**Full tone of voice rules, examples, and checklist: see `TOV.md` in the repo root.** When improving any page, reference TOV.md first.

### Typography conventions

- Headings: `font-weight: 900`, `text-transform: uppercase`, `letter-spacing: -.02em`
- Navigation: `font-weight: 600/700`, `text-transform: uppercase`, `letter-spacing: .07em`
- Body: `font-size: 14–16px`, `color: var(--t2)`, `line-height: 1.65–1.75`
- Eyebrow labels: `font-size: 10px`, `font-weight: 800`, `letter-spacing: .14em`
- Badges/tags: `font-size: 9–10px`, `font-weight: 800`, `border-radius: 99px`

### Shared components (replicate exactly)

Every page includes:
1. **Nav** — fixed, with logo badge "VI", links, search button, theme toggle, "Browse Database" CTA, hamburger for mobile
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

Each entry page follows the same dossier structure:
- Header with name, category badge, status badge (Confirmed / Reported)
- Key metadata grid (Status, Role/Type, Affiliation, First Seen, etc.)
- Description paragraph — terse, authoritative, present tense
- Sighting log or connections section where relevant
- Internal links to related characters, locations, factions

Entry slugs follow kebab-case: `/gameplay/characters/lucia-caminos`, `/gameplay/vehicles/karin-sultan-rs`.

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
- **Database size:** 287 entries across 8 categories (as of May 2026)
- **Key confirmed locations:** Vice City, South Beach, Leonida Keys, Port Gellhorn, Grassrivers, Mount Kalaga, Lake Leonida, Red Hill Forest
- **Key confirmed factions:** 7X (dominant Vice City street gang), High Rollerz (car culture crew), Brute Security, VCPD, VCSO, Leonida State Police, NOOSE
- **Interactive map:** In development, targeting November 19, 2026 launch day release

## Contacts & social

- Email: info@gtavitips.com
- X / Twitter: @gtavitips
- TikTok: @gtavi.tips
- Instagram: @gtavi.tips

## Cloudflare Worker name

`wrangler.jsonc` uses `"name": "badr"` — this is intentional. The custom domain gtavitips.com is attached to the "badr" worker. Do NOT rename it without first moving the custom domain in the Cloudflare dashboard, or deploys will silently go to a new orphan worker and the live site will go stale.

## What Claude should always do

1. Match existing CSS variables, class naming conventions, and component patterns exactly
2. Include full SEO markup (canonical, OG tags, JSON-LD) on every page
3. Write mobile-responsive CSS — test breakpoints at 1024px, 768px, 480px
4. Label all content with the correct source status (Confirmed / Reported / Speculation)
5. Use the military/intel tone: terse, uppercase headings, no fluff
6. Keep the dark theme default — light theme must work too via CSS variables
7. After adding a page: remind Badr to update `sitemap.xml`

## What Claude should never do

1. Use hardcoded hex colors instead of CSS variables
2. Add external JS libraries or CSS frameworks
3. Publish content without a source status label
4. Create shared CSS files (until explicitly agreed)
5. Add unverified information without clearly marking it as Speculation
