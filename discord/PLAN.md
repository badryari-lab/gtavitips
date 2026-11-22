# GTAVITIPS Discord — Plan

*Opgesteld 22 nov 2026 · status: **TO-DO, geparkeerd**. Concept, wacht op beslissingen van Badr (zie §10)*

Deze map staat buiten `hub/` en wordt dus nooit gedeployed.

---

## 1. Doel en rol

Het doel komt uit de vision: **de website is de kern, de community is de motor.** De Discord is geen tweede nieuwssite. Hij doet drie dingen:

1. **Retentie**: bezoekers die één keer via Google binnenkomen, krijgen een reden om terug te komen.
2. **Input**: correcties, in-game screenshots, ontbrekende info en vragen die nieuwe FAQ's worden. De community vult de gaten, de site zorgt voor structuur en controle.
3. **Curatie**: creators delen hun walkthroughs, die als embed met credits op de missiepagina's komen.

Elk kanaal moet bij minstens één van die drie horen. Anders komt het er niet in.

**Timing:** de game is sinds 19 nov uit, en de hype is nu op zijn hoogst. Daarom eerst een kleine, werkende versie (MVP) deze week. Uitbreiden doen we op basis van wat mensen echt gebruiken.

**Kernprincipe: begin klein.** Een server met 40 kanalen en 30 leden voelt dood. Het plan start met ±15 kanalen. Een kanaal komt er pas bij als er echt vraag naar is.

---

## 2. Structuur (MVP)

Categorienamen krijgen een licht in-world sausje (TOV), kanaalnamen blijven gewoon en vindbaar.

### 📌 START HERE (alleen-lezen)
| Kanaal | Type | Doel |
|---|---|---|
| `#welcome` | tekst | Korte intro + link naar site; gekoppeld aan Discord Onboarding |
| `#rules` | tekst | Regels (zie §5) — verplicht voor Community-modus |
| `#announcements` | announcement | Site-updates, Intel Drops, nieuwe artikelen. "Follow"-baar door andere servers |
| `#newswire` | tekst | Officieel Rockstar-nieuws, kort + link naar ons artikel |

### 💬 THE STREETS (algemeen)
| Kanaal | Type | Doel |
|---|---|---|
| `#general` | tekst | Hoofdchat, spoilervrij |
| `#photo-mode` | media | Screenshots — media-kanaal toont ze als galerij |
| `#clips` | media | Gameplay-clips, fails, stunts (voedt later het compilatiekanaal-idee) |
| `#off-topic` | tekst | Alles wat niet GTA 6 is |

### 🗺️ LEONIDA INTEL (hulp, spoilervrij)
| Kanaal | Type | Doel |
|---|---|---|
| `#help-desk` | forum | Vragen. Tags: `Missions` `Money` `Vehicles` `Weapons` `Map` `Collectibles` `Technical` `Solved`. Forum = doorzoekbaar, en elke veelgestelde vraag is een FAQ-kandidaat voor de site |
| `#tips-and-tricks` | forum | Community-tips; de beste worden gecrediteerd op de site |
| `#map-and-locations` | tekst | Gekoppeld aan /map: ontbrekende pins, locatievragen |

### 🔥 STORY — SPOILERS (verborgen tot opt-in)
Alleen zichtbaar met de rol **Spoiler Access** (kies je in Onboarding). Verhaal in 5 hoofdstukken, dus:
| Kanaal | Doel |
|---|---|
| `#chapters-1-2` | Discussie t/m hoofdstuk 2 |
| `#chapters-3-4` | t/m hoofdstuk 4 |
| `#chapter-5-and-ending` | Einde, epiloog |

Regel: geen spoilers in thread-titels, en buiten deze categorie altijd `||spoilertags||`.

### 🛰️ GTAVITIPS HQ (de site ↔ community-lus)
| Kanaal | Type | Doel |
|---|---|---|
| `#site-feedback` | forum | Tags: `Bug` `Correction` `Suggestion` `Done`. Een correctie heeft een bron of screenshot nodig, dezelfde sourcing-regels als de site |
| `#submit-intel` | forum | Eigen in-game screenshots en vondsten voor pagina's met weinig bronnen. Door te posten geef je toestemming voor gebruik op de site, met credit (staat in de regels) |
| `#creator-corner` | forum | YouTubers en TikTokkers delen guides en walkthroughs, de bron voor embeds op de missiepagina's |

### 🔊 VOICE
- `Lobby` (voice)
- `Squad 1`, `Squad 2` (voice, max 4) — LFG voor als Online er is

### 🛡️ STAFF (privé)
`#mod-chat`, `#mod-log`, `#automod-log`, `#bot-commands`

### Later, alleen op vraag
- **GTA Online**-categorie (`#online-general`, `#lfg`) zodra Rockstar Online uitbrengt
- Stage-kanaal voor events (Q&A, watch parties)
- Platformkanalen (PS5/Xbox) alleen als `#general` te druk wordt
- `#suggestions` voor de server zelf, nu nog onderdeel van `#site-feedback`

---

## 3. Rollen

| Rol | Hoe je hem krijgt | Doel |
|---|---|---|
| **Boss** (owner/admin) | Badr | Alles |
| **Moderator** | Handmatig | Timeout, berichten beheren, threads beheren |
| **Informant** | Handmatig, als je intel op de site is beland | Erkenning, de belangrijkste beloning voor bijdragen. Eigen kleur, hoog in de ledenlijst |
| **Creator** | Handmatig, na check van kanaal | Herkenbaar in `#creator-corner` |
| **Spoiler Access** | Onboarding (zelf kiezen) | Ontgrendelt STORY |
| **PS5** / **Xbox** | Onboarding | Squad-vorming |
| **Site Updates** | Onboarding | Ping bij `#announcements` |
| **Newswire Pings** | Onboarding | Ping bij `#newswire` |
| Bots | automatisch | — |

Niemand krijgt `@everyone`-pings, die lopen allemaal via opt-in rollen. Dat is de nummer 1 reden dat mensen servers muten of verlaten.

---

## 4. Serverinstellingen en veiligheid

- **Community-modus aan**: nodig voor Onboarding, forum- en announcement-kanalen en Server Insights.
- **Onboarding** (vervangt reaction-role-bots): vragen over (1) spoilers ja/nee, (2) platform, (3) welke pings. Plus standaardkanalen.
- **Verificatieniveau Medium**: geverifieerd e-mailadres en minstens 5 minuten een account.
- **Expliciete-media-filter**: alle leden.
- **Standaardmeldingen: "Only @mentions"**. Cruciaal: anders krijgt elk nieuw lid een notificatie bij elk bericht.
- **2FA verplicht voor moderatie-acties.**
- **Raid protection en safety alerts** aan, met meldingen naar `#mod-log`.
- **AutoMod** (ingebouwd, geen bot nodig):
  - Spam-detectie en mention-spam (5+ mentions = blok + timeout)
  - Discords ingebouwde lijsten voor scheldwoorden en slurs
  - Scam-zinnen blokkeren: "free nitro", "steam gift", "airdrop", enz.
  - Discord-invites van andere servers blokkeren (behalve in staff)
  - Trefwoorden voor piracy en cheats/modded-money-verkoop
- **Owner-account beveiligen**: 2FA aan en back-upcodes offline bewaren. Wie de owner kwijtraakt, raakt de server kwijt.

---

## 5. Regels (inhoud, nog in TOV te schrijven)

1. Respect, geen haat, discriminatie of intimidatie.
2. Spoilers alleen in STORY, elders altijd `||tags||`. Geen spoilers in titels.
3. Geen piracy, cheats of verkoop van modded accounts/money.
4. Geen leaks of links naar leakers (lijn met de rumor-regels van de site).
5. Geen NSFW, geen zelfpromo buiten `#creator-corner`.
6. Correcties en intel graag mét bron of screenshot.
7. Wat je in `#submit-intel`/`#tips-and-tricks` post, mag GTAVITIPS gebruiken met credit.
8. **Disclaimer**: onofficiële fan-community, niet verbonden aan Rockstar Games of Take-Two.

---

## 6. Branding

- **Naam:** `GTAVITIPS`
- **Icoon:** het VI-ticket-merk (`vi-logo.svg`), coral op donker. **Geen** Rockstar- of GTA-logo's (trademark).
- **Rolkleuren** uit het palet: Boss `#e0785f` (coral), Moderator `#4a9e93` (teal), Informant `#d19a3d` (amber), Creator `#3ea35f` (green).
- **Banner/invite-splash** vereisen Server Boost-niveaus, die komen later.
- **Vanity-URL** (`discord.gg/gtavitips`) vereist boost-niveau 3. Tot die tijd een permanente invite.

---

## 7. Koppeling met de site

- **Aparte invite-links per bron** (site-footer, X, TikTok, Instagram, Reddit). Discord telt per invite hoeveel mensen joinen, en dat is gratis attributie.
- **Site**: Discord-link in footer en Contacts. JSON-LD `sameAs` uitbreiden. Geen Discord-widget, want dat is extern script en past niet bij de "geen externe JS"-regel.
- **Automatische posts**: aanbevolen is **een webhook als vaste stap in de bestaande workflows**. Na een push (news/Intel Drop) post Claude, na akkoord van Badr, de aankondiging via webhook naar `#announcements`. Geen extra bot, en dezelfde publicatieregel als de site.
  - Alternatief later: een Cloudflare Worker-cron die `feed.xml` leest en nieuwe items post. Volledig automatisch, en het blijft in de eigen Cloudflare-stack.
- **CLAUDE.md**: na akkoord een `## Discord`-sectie toevoegen (kanalen, webhook-stap in workflows) en Discord bij Contacts & social zetten.

---

## 8. Launch-aanpak

1. **Inrichten** (fase 1–3 hieronder).
2. **Seeden**: vóór er iemand binnenkomt 6–10 threads klaarzetten (help-desk-vragen met antwoord en link naar de site, een paar photo-mode-posts, een welkomstpost in `#announcements`). Een lege server stoot af.
3. **Soft launch**: 10–20 bekenden of vroege fans, kinderziektes eruit halen.
4. **Aankondigen**: X, TikTok, Instagram + site-footer + een Intel Drop ("The Streets Are Open" o.i.d.).
5. **Eén terugkerend ritueel**, haalbaar voor één persoon. Bijvoorbeeld een **wekelijkse Photo Mode-challenge** met als prijs de rol of credit op de site. Liever één ding dat echt elke week gebeurt dan vijf die doodbloeden.
6. **Moderators werven** uit de eerste actieve leden zodra er >100 actieve mensen zijn. Solo modereren schaalt niet.

---

## 9. Uitvoering met Claude

**Aanpak: een eigen bot + een spec-bestand + een setup-script.** Het script leest de spec en maakt via de Discord API aan wat ontbreekt: rollen, categorieën, kanalen, permissies, forum-tags, AutoMod, Onboarding en het welkomstscherm. Het is idempotent, dus opnieuw draaien maakt niets dubbel. Er is een `--dry`-modus, net als de launch-scripts.

### Fase 0 — Badr doet dit handmatig (±15 min)
Bots kunnen geen server aanmaken en hebben een token nodig. Dat deel kan alleen jij doen:
1. Server aanmaken in de Discord-app: "Create My Own → For a club or community", naam `GTAVITIPS`.
2. 2FA aan op je account.
3. [Developer Portal](https://discord.com/developers/applications) → New Application "GTAVITIPS Setup" → tab Bot → **Reset Token**, kopiëren.
4. Token opslaan in `discord/.env` (komt in `.gitignore`, gaat **nooit** in git en nooit in de chat plakken).
5. OAuth2 → URL Generator → scope `bot`, permissie `Administrator` → de bot uitnodigen op de server.
6. Server-ID kopiëren (Developer Mode aan → rechtsklik server → Copy ID).

### Fase 1 — Claude: spec + script
- `discord/server-spec.json`: alles uit §2–§4 als data.
- `discord/setup.py`: Python 3.13 (`py`), alleen standaardbibliotheek (`urllib`), geen dependencies.
- Eerst `--dry`, dan uitvoeren, dan in de app controleren.

### Fase 2 — Claude: teksten
Welkom, regels, kanaaltopics, gepinde berichten en de Onboarding-vragen, geschreven volgens `TOV.md`. **Badr keurt goed voordat het erin gaat** (publicatieregel).

### Fase 3 — Afwerking
Icoon uploaden, invite-links per bron, de bot terugschalen van Administrator naar alleen de benodigde rechten (of verwijderen), en de webhook voor `#announcements` aanmaken.

### Fase 4 — Site + launch
Footer/Contacts/JSON-LD aanpassen (normale site-workflow, één batch), CLAUDE.md-sectie, seeden, soft launch, aankondigen.

---

## 10. Open beslissingen (Badr)

1. **Spoilermodel**: drie hoofdstukkanalen (voorstel) of één spoilerkanaal?
2. **Informant-erkenning op de site**: krijgen bijdragers credit op de pagina waar hun intel staat (bijv. "Screenshot: @naam via Discord")?
3. **Moderatie**: voorlopig solo, of nu al iemand vragen?
4. **Terugkerend ritueel**: Photo Mode-challenge, of iets anders?
5. **Taal**: alleen Engels (voorstel, gelijk aan de site)?
6. **Kanaalnamen**: gewone namen met in-world categorieën (voorstel), of ook de kanalen in-world (bijv. `#the-streets` i.p.v. `#general`)?
