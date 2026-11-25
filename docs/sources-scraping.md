# Public listing sites for scraping — legality and feasibility (ING-03)

**Status:** draft for lead review · **Checked:** 2026-11-24 · **Author:** benmochen

Research on **8 Montreal public listing sites** near McGill / downtown (plus 13 additional Montreal & student platforms briefly checked) to determine, with evidence, which ones AfterClass may legally collect from automatically and which ones it may not.

> **Disclaimer:** This is engineering research, not legal advice. Per ING-03, every site whose terms are unclear or silent on reuse is marked **not allowed**. No automated scraper was run; `robots.txt`, Terms of Use, and top-level pages were inspected manually on **2026-11-24**.

## Summary

- **Recommended for unauthorized scraping: 0 of 8 sites** (and 0 across 13 additional Montreal / student platforms checked).
- **Why:** 6 of 8 main sites explicitly prohibit automated collection, copying, or republication without prior written consent (`mcgill.ca` via `robots.txt` + copyright notice, `mtl.org`, `quartierdesspectacles.com`, `lavitrine.com`, `tastet.ca`, `ra.co`). The remaining 2 (`montreal.ca/calendrier` web pages and `ssmu.ca/events/`) reserve all rights or publish no reuse terms, so under our conservative rule they are also **not allowed**.
- **Best non-scraping alternative already available:** Use **City of Montreal Open Data (`vmtl-evenements-publics`, CC BY 4.0)** from ING-02 instead of scraping `montreal.ca/calendrier`.
- **Best partnership targets:** As a McGill student initiative (GDG McGill), direct email outreach for written permission or a feed is realistic for **Bounce** (`help@bouncedinc.com` — hosts McGill/SSMU club events), **SSMU** (`info@ssmu.ca`), **McGill Channels** (`copyright@mcgill.ca`), **Quartier des Spectacles**, and **La Vitrine**.
- **Personal data warning:** McGill and Ville de Montréal event pages frequently include individual organizer names, emails, and phone numbers. Even with permission, ingestion must strip personal contact info (Quebec Law 25 / PIPEDA) and keep only venue/event facts.

## Sites evaluated (checked 2026-11-24)

All 8 sites cover venues or events near McGill / downtown Montreal. Detailed quotes, `robots.txt` rules, technical notes, and outreach options are listed below the table.

| Site | Covers & size | Updates | Feed / API | Data types | Verdict |
|---|---|---|---|---|---|
| [McGill Events / Channels](https://www.mcgill.ca/channels/events) | Campus events (dozens–100s) | Daily | Empty RSS; `.ics` per event | Facts, IP, **PII** | **not allowed** |
| [SSMU Events](https://ssmu.ca/events/) | Student union (~21 upcoming) | Weekly | Stale iCal (2019); WP RSS | Facts, IP, possible **PII** | **not allowed** *(unclear)* |
| [Ville de Montréal — Calendrier](https://montreal.ca/calendrier) | City events (~3,864; ~258 < 3 km) | Daily | **Open Data CSV (CC BY 4.0)** | Facts, IP, **PII** | **not allowed** *(use CSV)* |
| [Tourisme Montréal](https://www.mtl.org/en/what-to-do/festivals-and-events) | Venues & festivals (100s) | Daily | None (`/api/` disallowed) | Facts, IP | **not allowed** |
| [Quartier des Spectacles](https://www.quartierdesspectacles.com/en/calendar) | Downtown shows & venues (100s) | Daily | None | Facts, IP | **not allowed** |
| [La Vitrine](https://www.lavitrine.com/en) | Cultural events (100s–1,000s) | Daily | None | Facts, IP | **not allowed** |
| [Tastet](https://tastet.ca/en/) | Food, cafés & bars (1,000+) | Weekly | WP RSS / JSON (ToS banned) | Facts, IP | **not allowed** |
| [Resident Advisor Montreal](https://ra.co/events/ca/montreal) | Clubs & nightlife (dozens–100s) | Daily | None (`/api/` disallowed) | Facts, IP | **not allowed** |

*Legend: **Facts** = dates, times, addresses, prices · **IP** = copyrighted descriptions, reviews, photos, curated lists · **PII** = personal info (organizer/staff names, emails, phones — never collect).*

---

## Site-by-site evidence

### 1. McGill Events / Channels (`mcgill.ca/channels/events`)
- **Verdict:** **not allowed** *(checked 2026-11-24)*
- **`robots.txt`:** [mcgill.ca/robots.txt](https://www.mcgill.ca/robots.txt) line 93 explicitly sets `Disallow: /*/events/*` and `Crawl-delay: 5`.
- **Terms / supporting line:** No public reuse terms; footer asserts `Copyright © 2026 McGill University`. [Copyright at McGill](https://www.mcgill.ca/copyright/) states: *"No copyrighted work may be copied, published, disseminated, displayed, performed or played without permission of the copyright holder except in accordance with fair dealing or our licensing agreements."*
- **Data types:** Facts (dates, buildings, rooms), copyrighted descriptions/photos, and **personal data** (faculty/organizer names, emails, phones).
- **Effort & stability:** High risk — `/channels/events` returns `HTTP 202` (AWS WAF JS challenge) on direct HTTP requests; Drupal WMS layout.
- **Non-scraping option:** Contact McGill Web Services / Campus Life & Engagement (`copyright@mcgill.ca`) as GDG McGill to request an official campus events feed.

### 2. SSMU Events (`ssmu.ca/events/`)
- **Verdict:** **not allowed** *(unclear → not allowed; checked 2026-11-24)*
- **`robots.txt`:** [ssmu.ca/robots.txt](https://ssmu.ca/robots.txt) only disallows `/webdev`.
- **Terms / supporting line:** No Terms of Use published (`/terms-of-use/` and `/privacy-policy/` return 404); footer only displays `©2026 Students' Society of McGill University`. Without explicit reuse permission, unclear = **not allowed**.
- **Feed / structured data:** WordPress `/wp-json/wp/v2/` exposes posts/pages only (not the custom events post type); `/feed/` RSS exists; iCal stopped updating in 2019 (ING-02); no `Event` JSON-LD.
- **Data types:** Facts (dates, times, 3480 McTavish rooms), short copyrighted descriptions, possible organizer contact info on detail pages.
- **Effort & stability:** Plain server-rendered WordPress HTML (`95 KB`), medium stability — **not worth scraping** regardless because only ~21 upcoming events are listed (mostly Legislative Council, Board meetings, and giveaways).
- **Non-scraping option:** Email `info@ssmu.ca` / VP Student Life for written permission or a live iCal feed, and encourage clubs to submit events directly.

### 3. Ville de Montréal — Calendrier (`montreal.ca/calendrier`)
- **Verdict:** **not allowed** *(use official Open Data CSV instead; checked 2026-11-24)*
- **`robots.txt`:** [montreal.ca/robots.txt](https://montreal.ca/robots.txt) allows `/calendrier` and `/evenements/...`, while disallowing filtered thematic calendars (`/calendrier-culturel?*`, `/recherche?*`).
- **Terms / supporting line:** [Mentions légales](https://montreal.ca/articles/mentions-legales-2654) states: *"L’ensemble des contenus de montreal.ca est la propriété exclusive de la Ville de Montréal, tous droits réservés."* and *"Seule une entente par contrat vous permet d’utiliser un outil numérique de la Ville dans un contexte promotionnel ou commercial."*
- **Feed / structured data:** **Official Open Data CSV/GeoJSON (`vmtl-evenements-publics`, CC BY 4.0)** already exists on `donnees.montreal.ca` (ING-02), making scraping unnecessary. Individual event pages also embed Schema.org `Event` JSON-LD (which includes start/end times missing from the CSV).
- **Data types:** Facts (dates, times, addresses, free/paid), copyrighted descriptions/photos, and **personal data** (organizer names and contact emails on detail pages).
- **Effort & stability:** Plain server HTML + JSON-LD, high stability — but legally superseded by Open Data.
- **Non-scraping option:** Use the CC BY 4.0 CSV/GeoJSON feed and request adding start/end times to the Open Data schema via the City's Open Data portal.

### 4. Tourisme Montréal (`mtl.org`)
- **Verdict:** **not allowed** *(checked 2026-11-24)*
- **`robots.txt`:** [mtl.org/robots.txt](https://www.mtl.org/robots.txt) disallows `/api/`, `/en/search`, `/fr/recherche`.
- **Terms / supporting line:** [Terms of service](https://www.mtl.org/en/terms-of-service) restricts access to *"non-commercial and informative purposes"* and states: *"the contents of this Web site may not be copied, reproduced, republished, downloaded, posted, transmitted, distributed or modified, in part or as a whole, in any form whatsoever... without prior written consent from the Site Owner."*
- **Data types:** Facts (addresses, dates) plus heavily copyrighted editorial guides and credited photos (`© Photographer - Tourisme Montréal`). No public personal data.
- **Effort & stability:** Dynamic JS directory loading; category pages only carry `WebSite`/`Organization` JSON-LD; frequent UI refreshes.
- **Non-scraping option:** Contact [mtl.org/en/contact-us](https://www.mtl.org/en/contact-us) to inquire about a student-app tourism partnership.

### 5. Quartier des Spectacles (`quartierdesspectacles.com/en/calendar`)
- **Verdict:** **not allowed** *(checked 2026-11-24)*
- **`robots.txt`:** [quartierdesspectacles.com/robots.txt](https://www.quartierdesspectacles.com/robots.txt) sets `Allow: /`, disallowing `/en/search` and Algolia filter params (`/*?*refinementList`, `/*?*query`).
- **Terms / supporting line:** [Terms of use](https://www.quartierdesspectacles.com/en/terms-of-use) states: *"The Websites are made available to users exclusively for their personal, non-commercial use."* and *"Any other use of the content... including reproduction, downloading, publication, dissemination and public or commercial use, is prohibited without the prior written permission of the PQDS."*
- **Data types:** Facts (dates, times, venues, free/paid) + copyrighted partner event descriptions, photos, and logos.
- **Effort & stability:** Client-side Svelte + Algolia filtering (requires JS rendering); no `Event` JSON-LD on `/en/calendar`.
- **Non-scraping option:** Contact [quartierdesspectacles.com/en/contact](https://www.quartierdesspectacles.com/en/contact) — local downtown cultural non-profit right next to McGill.

### 6. La Vitrine (`lavitrine.com/en`)
- **Verdict:** **not allowed** *(checked 2026-11-24)*
- **`robots.txt`:** [lavitrine.com/robots.txt](https://www.lavitrine.com/robots.txt) sets `Allow: /`, disallowing `/en/account`, `/fr/compte`, `/en/search`, `/fr/recherche`.
- **Terms / supporting line:** [Terms and conditions](https://www.lavitrine.com/en/terms-and-conditions) states: *"You may share La Vitrine content by hyperlink. No editing, reproduction or communication to the public of La Vitrine's content is permitted except as expressly authorized in writing."* / *"Any other use of de La Vitrine digital space content is forbidden without prior authorization or agreement."*
- **Data types:** Facts (dates, venues, ticket prices) + copyrighted show descriptions and artwork (account pages hold PII and are disallowed).
- **Effort & stability:** Heavy JS-templated frontend; homepage only carries `Organization`/`WebSite` JSON-LD; high maintenance effort.
- **Non-scraping option:** Contact [lavitrine.com/en/contact](https://www.lavitrine.com/en/contact) or their [Pro Zone](https://pro.lavitrine.com/en) — La Vitrine is a cultural non-profit with an explicit data-sharing policy for partners.

### 7. Tastet (`tastet.ca/en/`)
- **Verdict:** **not allowed** *(checked 2026-11-24)*
- **`robots.txt`:** [tastet.ca/robots.txt](https://tastet.ca/robots.txt) has an empty `Disallow:` (permits search indexing, **not** legal scraping).
- **Terms / supporting line:** [Legal / Terms of Use](https://tastet.ca/en/legal/) §II.L states: *"You acknowledge that the use of computer bots, including but not limited to webbots is prohibited for any purpose in connection with the Website."* §II.D also forbids downloading, caching, and displaying on the Internet.
- **Data types:** Facts (addresses, hours, price tiers) + heavily copyrighted original reviews, curated lists, and photography.
- **Effort & stability:** Plain WordPress HTML with RSS (`/en/feed/`) and `/wp-json/`, low technical effort — **high legal risk** due to the explicit anti-bot clause.
- **Non-scraping option:** Commercial licensing only (Tastet monetizes its directory via Tastet+ subscriptions); skip.

### 8. Resident Advisor Montreal (`ra.co/events/ca/montreal`)
- **Verdict:** **not allowed** *(checked 2026-11-24)*
- **`robots.txt`:** [ra.co/robots.txt](https://ra.co/robots.txt) disallows `/api/`, `/pro/`, commercial bots, and AI crawlers.
- **Terms / supporting line:** [Website Terms of Use](https://ra.co/terms) §4.4(f) states: *"you must not access our Website via a means we have not authorised in writing in advance, including automated devices, scripts, bots, spiders, crawlers or scrapers (except for standard search engine technologies)."*
- **Data types:** Facts (dates, venues, lineups, ticket prices) + copyrighted artwork/descriptions (user/promoter profiles hold PII).
- **Effort & stability:** Very high risk — direct HTTP requests to `/events/ca/montreal` return `HTTP 403 Forbidden` (anti-bot protection) on a JS-rendered SPA.
- **Non-scraping option:** Partner directly with local Montreal venues/promoters or evaluate licensed event APIs in ING-01.

---

## Other Montreal sites checked (excluded from top 8)

To verify whether *any* local Montreal or student event platform permits automated collection, 13 additional platforms were checked on **2026-11-24 / 2026-11-25** — none are recommended for scraping:

| Site | Finding | Verdict |
|---|---|---|
| **Bounce** (`bouncelife.com`) | Hosts many McGill/SSMU club events & parties, but Bounced Inc. ToS prohibits unauthorized scraping and attendee data is under PIPEDA. Strong partnership target (`help@bouncedinc.com`). | **not allowed** |
| **Eventbrite** (`eventbrite.ca/d/canada--montreal/events/`) | ToS explicitly has *"Scraping or Commercial Use of Site Content is Prohibited"* + anti-bot CAPTCHAs/IP blocks; public search API shut down in 2019 (ING-02). | **not allowed** |
| **Zeffy** (`zeffy.com`) | Widely used by McGill clubs, but **no public city directory exists** (only individual org checkout links) and ToS explicitly bans *"any robot, spider, scraper, deep link..."*. | **not allowed** |
| **Luma** (`lu.ma/montreal`) | Montreal tech/hackathon/social events; ToS prohibits automated bots/scrapers without written permission + Cloudflare anti-bot. | **not allowed** |
| **Shotgun** (`shotgun.live/en/cities/montreal`) | Montreal clubs & electronic nightlife; ToS bans automated extraction + Cloudflare/DataDome anti-bot; no public consumer API. | **not allowed** |
| **DICE** (`dice.fm/browse/montreal`) | Indie concerts & nightlife; DICE FM Canada ToS bans unauthorized scraping; GraphQL API is strictly promoter/partner-only. | **not allowed** |
| **Fever Montreal** (`feverup.com/en/montreal`) | [Terms](https://feverup.com/legal/terms_en.html) §8.1.E(vi)–(vii) explicitly bans any *"robot, spider, scraper"* and any aggregation with other websites without written permission. | **not allowed** |
| **Time Out Montreal** (`timeout.com/montreal`) | [Terms of Use](https://www.timeout.com/terms-of-use) §11.2–11.3 explicitly bans copying, downloading, caching, or any AI/ML use without written consent. | **not allowed** |
| **Montréal Centre-Ville** (`montrealcentreville.ca/evenements/`) | Only **12 events** listed (mostly duplicate recurring Eaton Centre yoga); no Terms of Use (`© 2026 Tous droits réservés`). Embeds `Event` JSON-LD; better as a student partnership via `/contact/`. | **not allowed** *(too small & unclear)* |
| **BAnQ / Grande Bibliothèque** (`banq.qc.ca/calendrier/`) | Blocked by **Radware Bot Manager CAPTCHA** (`validate.perfdrive.com`) on direct requests. | **not allowed** *(anti-bot)* |
| **Espace pour la vie** (`espacepourlavie.ca/en/programming`) | Returns **HTTP 403 Forbidden** on listing and legal pages; `robots.txt` sets `Crawl-delay: 10`. | **not allowed** *(anti-bot)* |
| **McGill Athletics** (`mcgillathletics.ca/calendar`) | Hosted on Sidearm Sports (proprietary ToS); `robots.txt` sets `Crawl-delay: 30` and blocks `/services/` and major bots. | **not allowed** |
| **RestoMontreal** (`restomontreal.ca`) | Returns **HTTP 410 Gone** on `robots.txt` and legal paths. | **not allowed** *(unavailable)* |

## Sites recommended for scraping

**None (0 sites).**

We do **not** recommend building an automated scraper for any of the sites reviewed:

1. **Broad legal prohibition:** Every major Montreal tourism, cultural, restaurant, and nightlife directory (`mtl.org`, `quartierdesspectacles.com`, `lavitrine.com`, `tastet.ca`, `ra.co`, `feverup.com`, `timeout.com`) explicitly prohibits automated scraping, downloading, or republication without prior written permission.
2. **Active technical blocks & low payoff elsewhere:** `mcgill.ca/channels/events` (`Disallow: /*/events/*` + AWS WAF), `ra.co` (`HTTP 403`), `banq.qc.ca` (Radware CAPTCHA), and `espacepourlavie.ca` (`HTTP 403`) actively block bots; `ssmu.ca` (~21 events) and `montrealcentreville.ca` (12 events) are both too small and legally silent.
3. **Cleanest paths forward for ING-04:**
   - **Use open data already cleared in ING-02:** City of Montreal Open Data (`CC BY 4.0`), OpenStreetMap, and Overture Maps.
   - **Ask for written permission / direct feeds (highest student value):**
     1. **Bounce (`help@bouncedinc.com`), SSMU (`info@ssmu.ca`), & McGill Channels (`copyright@mcgill.ca`)** — directly fills the campus/student-event gap from ING-02.
     2. **Quartier des Spectacles & La Vitrine** — local non-profit cultural hubs right next to campus.
     3. **Tourisme Montréal & Montréal Centre-Ville** — downtown venues and seasonal festivals.
   - **For nightlife, prices, and reliable opening hours:** Evaluate paid/licensed APIs in **ING-01** or direct organizer/student submissions instead of scraping.
