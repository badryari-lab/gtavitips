# Launch playbook (12 and 19 November 2026)

Not deployed: this folder sits outside `hub/`. Nothing here goes live by itself. Publishing rule still applies: build locally, show Badr, wait for go, push as one batch.

News articles are dated snapshots. Do not rewrite them. Only pages that carry live status change.

## Nov 12: pre-load opens (needs facts from the day)

Needs from Badr or the store listing: the real download size, the hour pre-load opened, whether Rockstar's Newswire said anything new.

| File | Change |
|---|---|
| `hub/faq/when-can-you-pre-load-gta-6` | "Starts Nov 12" becomes "Open now". Fill the hour block with the real hour if it is published, else keep Unconfirmed. Fill the size block. |
| `hub/faq/gta-6-download-size` | Replace the estimate with the store size (Reported until Rockstar states it). Check the "100 GB+" paragraph. |
| `hub/faq/how-long-will-gta-6-take-to-download` | Presets: put the real size first, keep estimates only if no size exists. Status Unconfirmed becomes Reported or Confirmed. Rewrite the first answer paragraph. |
| `hub/index.html` | Sitrep: add pre-load status, bump "Updated". |
| `hub/faq/index.html`, `hub/search-index.json`, `hub/sitemap.xml` | Matching entries for the pages above, lastmod. |
| rumor hub | If a size appears, the 676.7 GB check can cite it. |

First to data: if the size shows up on the PS Store or Xbox Store, screenshot it and publish within the hour. Label it Reported. Credit the store listing.

## Nov 19: launch day (Day 0)

Scripted: `launch/day0-is-out-yet.js` flips the static text of the is-out-yet page and its index entries. Run it with `node launch/day0-is-out-yet.js` from the repo root (add `--dry` first).

| File | Change |
|---|---|
| `hub/faq/is-gta-6-out-yet` | Scripted. The browser JS already flips the live view at local midnight. |
| `hub/faq/what-time-does-gta-6-unlock` | Past tense. "It unlocked at local midnight". Keep the table as record. |
| `hub/faq/when-can-you-pre-load-gta-6` | Past tense, point to the unlock page. |
| `hub/faq/when-does-gta-6-release` | Answer says "released". Replace the "Could GTA 6 get delayed again?" block. |
| `hub/faq/gta-6-pre-order` | Check "open now" wording. |
| `hub/index.html` | Sitrep: countdown cell becomes "Live" (JS does it, the static fallback and the `Updated` date need a hand), Latest Trailer cell, any "Next Reveal" copy. |
| `hub/llms.txt`, `hub/about/index.html`, `hub/trailers/index.html` | "Launches November 19" wording, "weeks out" wording. |
| `hub/faq/index.html` | Entries for is-out-yet, unlock, preload. |
| news | Launch-day article (Badr and Claude, same-day). news.json at the top with `featured:false`, feed.xml, sitemap. |

## Nov 20 and after

- Mastery phase from the 2026 report: guides, tips, "how to" pages built from what players are searching.
- Export GSC again (Performance, last 28 days) and compare to the 25 Oct baseline in memory.
- Rumor hub: re-check every Unverified item.

## Always
- Em dash check, TOV.md, source labels per CLAUDE.md.
- Update sitemap lastmod for each touched page.
