# Getting visitors (strategy, written Nov 6 2026)

Not deployed: this folder sits outside `hub/`. Nothing here goes live by itself.

## Where we start

- Search Console (3 months): 31 clicks, all from Nepal at position 1.0. Real organic traffic from other countries has 0 clicks. No query ranks above position 36. **0 external links** point at the site.
- The queries we do get impressions for are GTA V and Vice City trivia (Ocelot Jugular, Malibu Club). We have no sourced GTA V facts to answer them well, so we leave them alone.
- New GTA 6 sites do almost what we do: gta6record.com, leonidaunlocked.com, endgametools.com, gta6cheatsheet.com, vicepulse.net, getgvide.com. For "how to pre-load GTA 6" alone there are at least six guides, including HotHardware and Kotaku-level outlets. Unlock-time tables and pre-load guides are crowded.

## What that means

We will not outrank big outlets on the head terms in the 13 days before launch. A site with no links does not climb that fast, and nobody can promise a visitor number. Real visitors in the launch window come from three places:

1. **Places that do not need authority:** short video, communities, direct links, AI assistants that cite clear, sourced answers.
2. **Long-tail questions** where a plain, sourced answer is still missing.
3. **Paid**, if Badr wants to buy a first wave.

Search is the slow lane. Plan for it to matter after launch, not during it.

## The levers, in order of realistic payoff

| # | Lever | Who | Notes |
|---|---|---|---|
| 1 | Short vertical video (TikTok, Shorts, Reels) | Badr makes, scripts below | No authority needed. Launch week is the peak. Site name on screen, link in bio. |
| 2 | Answering in communities (r/GTA6, X, Discord) | Badr, own accounts | Replies with one link where it answers the question, not announcement posts. Kit in `DISTRIBUTION.md`. |
| 3 | Long-tail pages (done Nov 6) | Claude | Pre-load how-to, pre-load not starting, launch night checklist, storage checker, PS4/Xbox One, free download, region trick. |
| 4 | AI assistants | Claude | They cite pages that answer first and show their source. Our FAQ pages do. Keep status pages current. AI bots are allowed in robots.txt since July. We cannot measure this directly. |
| 5 | Paid test | Badr decides and pays | See below. |
| 6 | Backlinks | Badr | Slow, but the only thing that moves search. Do it alongside, not instead. |

## Paid test (optional)

A small budget on "GTA 6 unlock time" style searches (Google Ads) or on r/GTA6 (Reddit Ads) for the days 16 to 19 November, landing on `/faq/what-time-does-gta-6-unlock`. Decide a hard cap first. GA4 is already on the site (consent banner), so read the result under Acquisition, not in Search Console. We cannot spend money for Badr.

## Calendar: what to check and update

| Date | What happens | Our job |
|---|---|---|
| Mon Nov 9, 7 p.m. ET | Xbox pre-load opens (12 a.m. GMT Nov 10) | Post a reminder. Check the Xbox pages. |
| Tue Nov 10 | PS5 pre-load opens (midnight local) | Read Newswire and Support for new facts. Fix `when-can-you-pre-load-gta-6`, `how-to-pre-load-gta-6`, `gta-6-pre-load-not-starting`. |
| Thu Nov 12 | Boxed codes at retailers | Check `gta-6-physical-collector-edition`. |
| Nov 16 to 18 | Last week | Post "your unlock time" content. Re-check `what-time-does-gta-6-unlock` against Rockstar's release-times page (we only have it via two outlets). |
| Wed Nov 18 evening | New Zealand unlocks first | `launch/day0-is-out-yet.js --dry`, then follow `PLAYBOOK.md`. |
| Thu Nov 19 | Unlock in every region, free poster and map on the official site | Launch-day article. Link the poster and map. |
| After | Guides from what players search | Export GSC (28 days), compare with the Oct 25 baseline in notes. |
| Fri Dec 11 | Justice score album | Small update on `gta-6-original-score-justice`. |

## Video scripts (CapCut plus voice, 25 to 40 seconds each)

Voice: inside Leonida, dry, confident, no hype. Every fact below is Confirmed by Rockstar unless noted. On screen: the line in capitals, the source label, `gtavitips.com` at the end.

**1. Clear your drive**
- Hook: "Rockstar just put a number on it. Two hundred and twelve gigabytes."
- Beats: Pre-load opens Tuesday, November 10. PlayStation 5: midnight, your own time zone. Xbox: 12 a.m. GMT, so evening of the 9th in the Americas. That is about a third of a launch PS5.
- Close: "Clear it now. Not at midnight." Source: Rockstar Newswire, Nov 3.

**2. When does it unlock where you live**
- Hook: "Same game. Nineteen hours apart."
- Beats: Midnight local time on November 19. New Zealand first, Mexico last. US: midnight Eastern, so the West Coast starts at 9 p.m. the night before. Label: Reported.
- Close: "Find your window on our unlock page." Source: PlayStation Support, Rockstar Support as quoted.

**3. Six stations, named**
- Hook: "Six radio stations. Real hosts. One of them has a swamp meteorologist."
- Beats: Cocoteo FM, Back Country Radio, AfroBank FM, The Chamber 106.6, Flash FM, Dirty South Classics. First podcasts in the series. Earbuds on foot.
- Close: "That is six. Rockstar says there are more." Source: Rockstar Newswire, Oct 8.

**4. Justice scores Leonida**
- Hook: "The music changes when you do."
- Beats: Justice composed the score. Adaptive, tuned to how you play. 30 tracks, December 11. New single "Pusher" with Gesaffelstein.
- Close: "Not the same as The Album. That is 34 tracks." Source: Rockstar Newswire, Oct 29.

**5. Thirty-nine new screenshots**
- Hook: "Rockstar posted new pictures. Here is what they are not telling you."
- Beats: Vice City takes 15 of 39. Lucia is armed in every one of her four. No HUD, no map, no mission names. Everything is a place Rockstar already named.
- Close: "Breakdown on our site." Source: Rockstar Launch Gallery, Nov 5. Use only our own hero images, not Rockstar's, unless Badr clears it.

## What not to do

- No fake accounts, no bought links, no engagement trading.
- Do not present the New Zealand region trick as a method. It stays Unconfirmed.
- Do not copy competitors' tables. Our edge is sourced labels, speed in fixing status pages, and the database.
- Do not post a number or time that is not confirmed on the day. Fix the page first, then post.

## How we will know it works

- Nov 12, Nov 19 to 20, Nov 27: Search Console, performance, last 7 days. Look for the first clicks outside Nepal, impressions on the new pages, and positions under 20 for the long-tail pages.
- GA4: sources and mediums. Video and community traffic shows up there, not in Search Console.
- The indexing report: "last update" must be after Oct 23.

## What we need from Badr

- Videos and community replies (he posts from his own accounts).
- The Discord invite link, when it exists, for the homepage button.
- A yes or no on the paid test, and a cap.
- The link to Rockstar's release-times Support page, so the unlock time can move from Reported to Confirmed.
