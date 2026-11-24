# Free data sources near McGill (ING-02)

**Status:** draft for lead review · **Checked:** 2026-11-19 to 2026-11-24 · **Author:** williamli218

Free sources for places, events and promotions around McGill. "Free" means **free for our use**, so we are allowed to store in our database and show in a public app.

## Summary

- **Places:** lots of free coverage, but only about half is accurate. OpenStreetMap scored **4/10** (closed places, wrong or missing names) and Overture **5/10** (mostly closed places). No free source has per-person prices, ratings or reliable opening hours.
- **City of Montreal open data** is the most accurate (**10/10** for events) but its events are city-run (libraries, workshops), no upcoming event is within 1 km of campus and the dataset has dates but no times.
- **Student events have no working free feed.** McGill's RSS is empty and SSMU's iCal stopped in 2019.
- **The best event data isn't free for us.** PredictHQ scored **10/10** and includes club nights but storing is "only allowed with a paid plan".

**Method:** test point Roddick Gates (45.5048, -73.5772) with 1 km for places and 3 km upcoming for events. 10 random results were checked by hand. They are deemed correct if it exists and nothing listed is wrong (missing fields don't count as wrong).

## Sources

| Source | Covers | How to get it | Limits | Licence / credit | Store / show | 10-check | Checked |
|---|---|---|---|---|---|---|---|
| OpenStreetMap (Overpass) | Places | API, no key | Guideline: < 100 queries & 10 MB/day for regular use, whole app | ODbL / "© OpenStreetMap contributors" | Yes / yes; share-alike may apply if mixed | **4/10** | 2026-11-19 (terms), 2026-11-23 (check) |
| Overture Maps Places | Places | File download, monthly | None | Mostly CDLA-2.0 (credit optional) / Apache-2.0 for Foursquare-sourced places (credit Foursquare, keep licence notice) | Yes / yes | **5/10** | 2026-11-24 |
| Montréal: Événements publics | City events | CSV, daily | None | CC BY 4.0 / "With data from … City of Montreal's Open Data Website" | Yes / yes | **10/10** | 2026-11-23 |
| Montréal: Établissements alimentaires | Food businesses | CSV, weekly | None | CC BY 4.0 / same as above | Yes / yes | **7/10** usable | 2026-11-23 |
| Montréal: Lieux culturels | City venues | CSV | None | CC BY 4.0 / same as above | Yes / yes | — (1 result) | 2026-11-23 |
| McGill Channels | Campus events | RSS empty; iCal per event only | — | None ("© McGill") | Ask McGill | — | 2026-11-23 |
| SSMU calendar | Student events | iCal stale (1 event, 2019) | — | None found | Ask SSMU | — | 2026-11-23 |
| PredictHQ (free plan) | Concerts, club nights, festivals… | API + CSV export | Saved locations only (2–3; PredictHQ's pages disagree) | Proprietary / "Events by PredictHQ" | **No storing**; cache ≤ 24 h only if the plan allows | **10/10** | 2026-11-24 |
| Ticketmaster | Big ticketed events | API, free key | 5,000 calls/day | Proprietary | Cache "reasonable periods" only | Pending (sign-up stuck) | 2026-11-23 (terms) |

## Fields

| Source | Category | Price | Location | Hours / Event date time |
|---|---|---|---|---|---|
| OpenStreetMap | Yes | No | Yes (address often missing) | 24% |
| Overture | Yes (95%) | No | Yes (address 95%) | No | — |
| Montréal events | Yes | Free/paid only | Yes | Date yes / **time no** |
| Montréal food | Partial | No | Yes (100%) | No |
| McGill | Partial | No | Yes | Yes / yes |
| PredictHQ | Yes (loose) | No | Yes | Yes / yes (93%) |

## Notes

- **OpenStreetMap:** 450 food and venue places found within 1 km. Errors were due to 1 being closed, 1 wrong name, 1 food name used as a name, 1 no name and 1 wrong hours. Names are mostly French.
- **Overture** (release 2026-11-18.0): 5,420 places within 1 km, ~550 food. The are mostly from Meta pages. Errors were due to 2  being closed, 1 not found. Its confidence score didn't predict errors (a closed place scored 1.00).
- **Montréal events:** 258 upcoming within 3 km, 0 within 1 km. Times and many addresses were only present on the event web page. French only.
- **Montréal food:** 3,331 within 1 km but only 873 are open. It marks closures (OSM has no status field; Overture has one for only 2% of places). It lists every licensed kitchen (private clubs, hotel banquets) under legal company names.
- **McGill / SSMU:** both calendars are kept up to date as web pages, but neither has a working feed and neither publishes reuse terms.
- **PredictHQ:** 707 events in 90 days with precise times for 93%. It includes StereoBar, Bar Datcha, Cabaret Berlin. Categories are loose and recurring events are repeated. **Export not committed**, because the free plan forbids storing.
- **Ticketmaster:** TODO: run the sample once the account works (currently pending for approval).

## Checked, not tested

| Source | Why |
|---|---|
| Foursquare API | Free tier gives the same fields as Foursquare's open data (partly included in Overture), but hours, ratings, price are paid |
| Geoapify | Free, but built on OSM (same quality) |
| Google Places, Yelp, Meetup | Paid, or no storage |
| SeatGeek | Terms forbid storing and overlaps Ticketmaster |
| Eventbrite | Public search shut down in 2019 |
| Resident Advisor | No official API |

## What no free source covers

- **Student events** and **club/nightlife events** (only PredictHQ, which needs a paid plan to store)
- **Promotions** (no source at all)
- **Price per person**, **ratings**, and reliable **opening hours**
- **Recent closures** (the main cause of errors)

When storage is forbidden, live API calls with a short cache may be allowed (Ticketmaster, PredictHQ), but limits apply to the whole app and the data generally can't be kept long-term (e.g. for ML).

## Samples (`docs/samples/`)

`openstreetmap-mcgill.json`, `overture-mcgill.geojson`, `montreal-events-3km-upcoming.csv`, `montreal-food-mcgill.csv`, `mcgill-rss.xml`, `mcgill-event-example.ics`, `ssmu-events.ics`

Overpass query used:
```
[out:json][timeout:60];
(nwr(around:1000,45.5048,-73.5772)[amenity~"^(restaurant|cafe|bar|pub|fast_food|nightclub|cinema|theatre|arts_centre|ice_cream)$"];);
out center tags;
```
