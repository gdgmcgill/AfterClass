# Paid Data Sources Research (`ING-01`)

> **Date checked:** 2026-11-19 *(updated 2026-11-25 with Luma API check & live Foursquare sample near McGill)*
> **Scope:** Paid API providers covering **places**, **events**, and **promotions** around McGill University (`45.5048, -73.5772`, 1 km radius).
> **Constraint:** Research only — no payment details were entered. Prices, quotas, and terms change frequently; re-verify before committing to any paid plan.

---

## Executive Summary

- **Places:** **Google Places API (New)** has the strongest coverage and freshness in downtown Montreal (including bilingual FR/EN names, `priceRange`, and `regularOpeningHours`), followed by **Foursquare Places API** and **Yelp Fusion API**. However, **all three strictly prohibit storing place data in our own database** beyond opaque IDs (`place_id`, `fsq_place_id`, Yelp Business ID) — Yelp allows at most 24-hour caching, Google prohibits long-term caching of place details (30 days max for certain coordinates), and Foursquare allows no server-side caching on pay-as-you-go plans. This means any paid places API would have to be called **live at request time** (or via short-lived cache), increasing ongoing API spend.
- **Events:** **Ticketmaster Discovery API** has a generous free developer tier (5,000 calls/day, no credit card) for major concerts/sports/shows, though commercial scale requires a formal partnership. **PredictHQ** is a true paid events API with rich demand metadata, and **Meetup** gates its GraphQL API behind Meetup Pro (~$55/group/month). **Eventbrite's public event search API (`GET /v3/events/search/`) has been permanently deprecated (returns `404`)**, and **Luma's paid official API** (requires **Luma Plus**, $59–$69/month) is **scoped strictly to calendars you own** with no public city-wide search endpoint — though public Luma calendars expose free `.ics` feeds worth handing off to `ING-02`.
- **What no paid provider covers well:**
  1. **Promotions & student deals** (happy hours, 5 à 7 specials, student discounts, cover-charge waivers) — **none of the evaluated providers expose a structured promotions feed.**
  2. **Grassroots / campus student events** (SSMU clubs, faculty mixers, department talks, small bar trivia nights) — commercial event APIs focus on ticketed concerts/arenas or B2B demand forecasting, not student life around McGill.

---

## Provider Comparison Table

| Provider | Covers | Pricing & Plans | Free Tier | Rate Limits | Storage & Caching Terms | Attribution & Student/Public App Use | Date Checked |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **[Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service/overview)** | Places | Pay-as-you-go per SKU (determined by highest field mask requested). First paid tier (up to 100k/mo): **Place Details** $5 (Essentials), $17 (Pro), $20 (Enterprise), $25 (Enterprise + Atmosphere) per 1,000 calls. **Text / Nearby Search** $32 (Pro), $35 (Enterprise), $40 (Enterprise + Atmosphere) per 1,000 calls. | Per-SKU monthly free caps (legacy $200 credit removed): **10,000** Essentials, **5,000** Pro, **1,000** Enterprise calls/mo. **Requires a credit card / billing account.** | Per-minute/QPS project quotas managed in Google Cloud Console (typically 600 QPM+ default, configurable). | **No permanent storage** of place details (name, address, hours, price, ratings). **`place_id` may be stored indefinitely**; certain coordinates may be cached up to 30 days. Must fetch details live. ([Google Maps Platform Terms](https://cloud.google.com/maps-platform/terms) & [Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms)) | Must display Google attribution / logo wherever Places data is shown (even without a map). Public student apps are allowed under standard ToS as long as billing & caching rules are followed. | 2026-11-19 |
| **[Foursquare Places API](https://docs.foursquare.com/developer/reference/places-api-overview)** | Places | Pay-as-you-go CPM by field tier. **Pro endpoints/fields:** $15.00 / 1k (501–100k), $12.00 / 1k (100k–500k), $9.00 / 1k (500k+). **Premium endpoints/fields** (hours, price, tips, photos, ratings): $18.75 / 1k (0–100k), $15.00 / 1k (100k–500k), $11.25 / 1k (500k+). | **500 free Pro calls/month** (sandbox/self-serve signup with email; no credit card for basic sandbox). **0 free calls** for Premium fields (`hours`, `price`). | **50 QPS** global cap on Pay-as-you-go / Sandbox; **100 QPS** on Enterprise. Returns `403` / `429` with `X-RateLimit-Reset`. | **No server-side caching or DB storage** on Pay-as-you-go/Sandbox. Only opaque IDs (`fsq_place_id`, `photo_id`, `fsq_addr_id`) may be stored indefinitely. Enterprise allows 24-hour local-device caching only. ([Foursquare API License Agreement](https://foursquare.com/legal/api/platformpolicy)) | Visual Foursquare credit/attribution required when displaying Foursquare data to end users, plus a public privacy policy. Public student apps allowed within terms. | 2026-11-19 |
| **[Yelp Fusion / Places API](https://docs.developer.yelp.com/)** | Places *(+ thin `/events`)* | Shifted away from legacy free tier to paid commercial plans: Starter/Base (~$7.99/1k calls or monthly commercial subscriptions starting ~$229+/mo), Plus/Enhanced (~$9.99/1k for deeper review/detail access), Enterprise (custom quote). | **No permanent free commercial tier**; active paid billing / credit card required for current API access. | **3–5 QPS** (Starter), **8–10 QPS** (Professional), **15+ QPS** (Enterprise); strict daily/monthly caps per plan. | **Max 24-hour cache** for all Yelp response content (names, addresses, hours, prices, ratings). Only **Yelp Business ID** may be stored indefinitely. No bulk warehousing. ([Yelp API Terms of Use](https://www.yelp.com/developers/api_terms)) | Strict Yelp branding & attribution required (Yelp logo, star assets, links back to Yelp). Public student apps allowed only under an active plan and attribution compliance. | 2026-11-19 |
| **[Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)** | Events | Free for standard discovery & prototyping; higher quotas and **monetized/commercial production apps** require a custom commercial partnership agreement with Ticketmaster. | **Free developer tier:** 5,000 calls/day, **no credit card required**. *(Coordinate with `ING-02` to avoid duplicating the free-tier evaluation.)* | **5 requests/second (RPS)**, **5,000 calls/day**, deep paging capped at `size * page < 1000`. HTTP `429` on overage. | **No long-term storage/hoarding.** Event content may only be cached for a "reasonable period" strictly necessary to serve the app, and removed events must be purged within 24 hours of notice. ([Ticketmaster Developer Terms](https://developer.ticketmaster.com/support/terms-of-use/)) | Must follow Ticketmaster branding & attribution guidelines. Student/non-commercial public prototypes are permitted on the free tier; commercial launch requires explicit approval. | 2026-11-19 |
| **[PredictHQ Events API](https://www.predicthq.com/apis/events-api)** | Events | Modular B2B pricing by event category & geographic scope. **Starter:** custom quote (third-party estimates ~$500+/yr entry). **Premium:** enterprise custom quote (global coverage, ML features, data warehouse sync). | **14-day free trial (no credit card required)**, limited to a small number of locations (e.g., up to 3 locations, 5-mile radius) and primarily UI-focused evaluation. | Organization-wide **rolling 1-second RPS limit** (varies by plan); returns `429 Too Many Requests`. | Customers may store/query local copies during an **active subscription** for internal analytics/app use, but **cannot redistribute or resell raw data** and cannot use data on ticketing/reseller platforms. ([PredictHQ Terms of Service](https://www.predicthq.com/terms-of-service)) | Commercial B2B product; student project could evaluate via 14-day trial, but ongoing public app use requires an active paid license. | 2026-11-19 |
| **[Meetup GraphQL API](https://www.meetup.com/api/guide/)** | Events | Exclusively gated behind a **Meetup Pro** subscription: **~$55/group/month** (discounts for 6-month/annual commitments). | **None** — API access is no longer available on free or standard organizer accounts. | No published hard per-second cap; traffic is monitored continuously and high-volume integrations must disclose usage during OAuth setup. | Governed by Meetup API License Terms; public event listings may be displayed externally, but scraping abuse, reselling, or extracting private member data is prohibited. ([Meetup API License Terms](https://www.meetup.com/terms/)) | Requires Meetup Pro account + OAuth app approval; impractical for a zero-budget public student app. | 2026-11-19 |

### Verified Unavailable / Own-Calendar-Only Event APIs

- **Eventbrite API (`GET /v3/events/search/`):** Permanently deprecated and removed (`404 Not Found`) as verified on 2026-11-19. The official Eventbrite API now only returns events belonging to organizations/venues you directly manage via OAuth2, so it **cannot** be used as a public Montreal event discovery source.
- **[Luma API (`public-api.luma.com`)](https://docs.luma.com):** Checked on 2026-11-25. Luma hosts a high density of Montreal tech, startup, student, and social events (`lu.ma/montreal`), and offers an official REST API (rate limits: 200 req/min per calendar, 500 req/min per org; [Luma Terms](https://lu.ma/terms)) gated behind **Luma Plus** (**$59/month billed annually** or **~$69/month monthly**). However, **the official API is strictly scoped to calendars and events you own/manage** — there is **no public city-wide or radius event search endpoint**, so paying for Luma Plus would not let AfterClass discover third-party Montreal events.
  - *Handoff for `ING-02` (free sources):* Individual public Luma calendars and city discover pages expose native **free iCal (`.ics`) subscription feeds** (`https://api.lu.ma/ics/get?entity=calendar&id=...`), which should be evaluated under `ING-02` rather than paying for the API or scraping (`ING-03`).

---

## Field Coverage Matrix

Legend: **Yes** = supported directly | **Partial** = coarse/tier-only or limited | **No** = not provided

| Provider | Category | Approximate Price / Person | Location (Lat/Lng + Address) | Opening Hours | Event Date & Time | Notes on Field Pricing / Gaps |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Google Places API (New)** | Yes (`primaryType`, `types`) | Yes (`priceLevel` enum + `priceRange` start/end CAD) | Yes (`location`, `formattedAddress`) | Yes (`regularOpeningHours`, `currentOpeningHours`) | No | `regularOpeningHours`, `priceLevel`, and `priceRange` all trigger the **Enterprise SKU** ($20–$35/1k after 1k free/mo). |
| **Foursquare Places API** | Yes (`categories`) | Partial (`price` tier 1–4) | Yes (`latitude`/`longitude`, `location`) | Yes (`hours`, `hours_popular`) | No | `price` and `hours` are **Premium fields** ($18.75/1k, **0 free calls**). Confirmed in live test: free Pro tier returns name, location, category, phone, website, and `date_refreshed`, but omits `hours` and `price`. |
| **Yelp Fusion / Places API** | Yes (`categories`) | Partial (`price`: `$`–`$$$$`) | Yes (`coordinates`, `location`) | Yes (`hours`, `is_open_now`) | Partial (`/events` endpoint exists, very sparse in Montreal) | Full hours require the Business Details endpoint (separate call per venue). |
| **Ticketmaster Discovery API** | Yes (`classifications`: segment/genre) | Partial (`priceRanges` ticket min/max CAD) | Yes (`_embedded.venues` lat/lng + address) | No | Yes (`dates.start.localDate`, `localTime`, `dateTime`) | Ticket prices are frequently omitted for some events; covers ticketed venues, not casual drop-in spots. |
| **PredictHQ Events API** | Yes (19 event categories) | No | Yes (`location` GeoJSON, `geo.address`) | No | Yes (`start`, `end`, `timezone`) | Focuses on event impact/attendance (`phq_attendance`, `rank`), not per-person ticket cost. |
| **Meetup GraphQL API** | Yes (group topics/categories) | Partial (`feeSettings` if paid event) | Yes (`venue` lat/lng + address) | No | Yes (`dateTime`, `endTime`, `duration`) | Covers community/tech/hobby meetups; limited bar/nightlife coverage. |

---

## Sample Requests Near McGill (`45.5048, -73.5772`, 1 km radius)

> **Policy:** Per `ING-01` instructions, no payment details or credit cards were entered. Providers requiring a credit card or paid subscription were not queried live and are documented below.

### 1. Google Places API (New)
- **Status:** **Skipped — requires credit card / Google Cloud Billing account.**
- **Reason:** Google Cloud requires an active billing account with payment details before issuing working Places API (New) calls, even within the monthly free SKU caps.

### 2. Foursquare Places API
- **Status:** **Tested live on 2026-11-25** using a free sandbox Pro key (no credit card required).
- **Exact request run (5 bars within 1 km of McGill):**
  ```bash
  curl -s "https://places-api.foursquare.com/places/search?ll=45.5048,-73.5772&radius=1000&fsq_category_ids=4bf58dd8d48988d116941735&limit=5" \
    -H "Authorization: Bearer $FOURSQUARE_API_KEY" \
    -H "X-Places-Api-Version: 2025-06-17" \
    -H "Accept: application/json"
  ```
- **Saved response:** [`docs/samples/foursquare-mcgill-bars.json`](samples/foursquare-mcgill-bars.json) (HTTP `200 OK`, 5 results returned):
  1. **Thomson House** (`204 m`, `3650, rue McTavish`, refreshed `2026-10-16`) — College Rec Center / Coffee Shop / Bar
  2. **Cloakroom Bar** (`594 m`, `2175 Rue de la Montagne # 100`, refreshed `2026-11-10`) — Speakeasy
  3. **Bar George** (`646 m`, `1440 Rue Drummond`, refreshed `2026-11-20`) — Hotel Bar
  4. **The Keg Steakhouse + Bar** (`766 m`, `5 Place Ville-Marie`, refreshed `2026-11-23`) — Steakhouse / Bar
  5. **Bar Nacarat** (`831 m`, `900 Blvd René-Lévesque O`, refreshed `2026-11-19`) — Cocktail Bar (linked to parent `Fairmont The Queen Elizabeth`)
- **Quality observations:**
  - **Completeness:** Strong core metadata on all 5 results (`fsq_place_id`, exact `latitude`/`longitude`, `distance`, structured `location`, `categories`, `tel`, `website`, and partial Instagram handles). However, **neither `hours` nor `price` was returned** on the free Pro tier, confirming both require paid Premium billing.
  - **Currency / freshness:** All 5 venues are real, currently operating spots within 1 km of McGill, with `date_refreshed` timestamps from October–November 2026. Note that default relevance ranking skewed upscale/hotel-bar after Thomson House.
  - **Language (FR/EN):** **Mixed bilingual** — category labels are returned in **English** (`Bar`, `Speakeasy`, `Cocktail Bar`), while street addresses use **French Montreal formatting** (`3650, rue McTavish`, `Montréal`, `coin René-Levesque`) and venue names reflect their local branding.

### 3. Yelp Fusion / Places API
- **Status:** **Skipped — requires paid subscription / credit card.**
- **Reason:** Yelp deprecated its open free tier and now gates API access behind paid commercial plans requiring payment details.

### 4. Ticketmaster Discovery API
- **Status:** **Skipped — developer account pending approval (checked 2026-11-25).**
- **Reason:** Ticketmaster's developer portal required manual account approval before issuing an active API key. Can be tested once approved (or shared with `ING-02`, which also evaluates Ticketmaster's free tier) using:
  ```bash
  curl -s "https://app.ticketmaster.com/discovery/v2/events.json?apikey=$TICKETMASTER_API_KEY&latlong=45.5048,-73.5772&radius=2&unit=km&size=5"
  ```

### 5. PredictHQ Events API
- **Status:** **Optional — 14-day no-credit-card trial available, but full API access is limited on trial.**
- **Reason:** The self-serve 14-day trial focuses on the web UI and restricts geographic/endpoint access; ongoing API use requires a paid B2B contract out of budget for AfterClass.

### 6. Meetup GraphQL API
- **Status:** **Skipped — requires paid Meetup Pro subscription (~$55/group/month).**
- **Reason:** API keys and OAuth client creation are unavailable without paying for Meetup Pro.

---

## What No Paid Provider Covers Well

1. **Promotions, Happy Hours & Student Deals (`promotions`):**
   - **Finding:** *None of the evaluated paid providers offer a structured API for promotions* (e.g., 5 à 7 specials, taco Tuesdays, McGill student ID discounts, or no-cover nights). Even rich place APIs like Google Places and Yelp do not expose reliable structured promotion objects.
   - **Implication for AfterClass:** Promotions cannot be bought from a generic API; they will need to come from community/user submissions, direct venue partnerships, or permitted local listings (`ING-03`).
2. **Campus & Grassroots Student Events:**
   - **Finding:** Ticketmaster only covers large/mid-size ticketed venues (Bell Centre, Place des Arts, MTELUS, Club Soda). PredictHQ aggregates major public/attendance events. Neither captures SSMU club nights, faculty wine-and-cheeses, GDG workshops, or casual bar events near Milton-Parc / Peel.
   - **Implication for AfterClass:** Free campus feeds and calendars (`ING-02`) are far more relevant for student events than any paid event API.
3. **Database Storage Compatibility:**
   - **Finding:** Every major paid places API (Google, Foursquare, Yelp) forbids storing venue details in our own Supabase database (`public.venues`) beyond opaque IDs. If AfterClass's architecture relies on an ingested PostgreSQL catalog (`services/ingestion` -> `supabase`), paid places APIs are a poor legal fit for bulk ingestion and could only be used for live enrichment/on-demand lookup.
