# Free data sources near McGill (ING-02)

**Status:** draft for lead review · **Checked:** 2026-11-19 to 2026-11-24 · **Author:** williamli218

Free sources for places, events and promotions around McGill. "Free" means **free for our use**, meaning that we are allowed to store in our database and show in a public app.

## Summary

- **Places:** lots of free coverage, but only about half is accurate. OpenStreetMap scored **4/10** and Overture **5/10**, mostly because of closed places. No free source has prices, ratings or reliable opening hours.
- **City of Montreal open data** is the most accurate (**10/10** for events), but its events are city-run (libraries, workshops), none is within 1 km of campus, and there are no times.
- **Student events have no working free feed.** McGill's RSS is empty; SSMU's iCal stopped in 2019.
- **The best event data isn't free for us.** PredictHQ scored **10/10** and includes club nights, but storing is "only allowed with a paid plan". Handed to ING-01.

**Method:** test point Roddick Gates (45.5048, -73.5772); 1 km for places, 3 km upcoming for events. 10 random results were checked by hand: correct if it exists and nothing listed is wrong (missing fields don't count as wrong).

## Sources

| Source | Covers | How to get it | Limits | Licence / credit | Store / show | 10-check | Checked |
|---|---|---|---|---|---|---|---|
| OpenStreetMap (Overpass) | Places | API, no key | < 100 queries & 10 MB/day for the whole app | ODbL · "© OpenStreetMap contributors" | Yes / yes; share-alike may apply if mixed | **4/10** | 2026-11-23 |
| Overture Maps Places | Places | File download, monthly | None | CDLA-2.0 / Apache-2.0 · credit optional | Yes / yes | **5/10** | 2026-11-24 |
| Montréal: Événements publics | City events | CSV, daily | None | CC BY 4.0 · "With data from … City of Montreal's Open Data Website" | Yes / yes | **10/10** | 2026-11-23 |
| Montréal: Établissements alimentaires | Food businesses | CSV, weekly | None | CC BY 4.0 · same | Yes / yes | **7/10** usable | 2026-11-23 |
| Montréal: Lieux culturels | City venues | CSV | None | CC BY 4.0 · same | Yes / yes | — (1 result) | 2026-11-23 |
| McGill Channels | Campus events | RSS empty; iCal per event only | — | None ("© McGill") | Ask McGill | — | 2026-11-23 |
| SSMU calendar | Student events | iCal stale (1 event, 2019) | — | None found | Ask SSMU | — | 2026-11-23 |
| PredictHQ (free plan) | Concerts, club nights, festivals… | API + CSV export | 2 saved locations | Proprietary · "Events by PredictHQ" | **No storing**; cache ≤ 24 h | **10/10** | 2026-11-24 |
| Ticketmaster | Big ticketed events | API, free key | 5,000 calls/day | Proprietary | Cache "reasonable periods" only | Pending (sign-up stuck) | 2026-11-24 |

## Fields

| Source | Category | Price | Location | Hours | Event date / time |
|---|---|---|---|---|---|
| OpenStreetMap | Yes | No | Yes (address often missing) | 24% | — |
| Overture | Yes (95%) | No | Yes (address 95%) | No | — |
| Montréal events | Yes | Free/paid only | Yes | — | Date yes / **time no** |
| Montréal food | Partial | No | Yes (100%) | No | — |
| McGill | Partial | No | Yes | — | Yes / yes |
| PredictHQ | Yes (loose) | No | Yes | — | Yes / yes (93%) |

## Notes

- **OpenStreetMap:** 450 food and venue places within 1 km. Errors are due to closed place, wrong name, no name, typos and odd hours formats. Names are mostly French.
- **Overture** (release 2026-11-18.0): 5,420 places within 1 km, ~550 food. They are mostly from Meta pages. Errors are due to 2 closed, 1 not found. Its confidence score didn't predict errors (a closed place scored 1.00).
- **Montréal events:** 258 upcoming within 3 km, 0 within 1 km. Times and many addresses are only shown on the event web page (scraping, ING-03). French only.
- **Montréal food:** 3,331 within 1 km but only 873 open. It marks closures, which OSM and Overture miss. It lists every licensed kitchen (private clubs, hotel banquets) under legal company names.
- **McGill / SSMU:** both calendars are kept up to date as web pages, but neither has a working feed and neither publishes reuse terms.
- **PredictHQ:** 707 events in 90 days, real times for 93%, includes StereoBar, Bar Datcha, Cabaret Berlin. Categories are loose and there are recurring events repeated. **Export not committed**, because the free plan forbids storing.
- **Ticketmaster:** terms forbid revenue from the API and replacing Ticketmaster.com. TODO: run the sample once the account works.

## Checked, not tested

| Source | Why |
|---|---|
| Foursquare API | Free tier = same data as Overture, BUT hours, ratings, price are paid → ING-01 |
| Geoapify | Free, but built on OSM (same quality) |
| Google Places, Yelp, Meetup | Paid, or no storage → ING-01 |
| SeatGeek | Terms forbid storing && overlaps Ticketmaster |
| Eventbrite | Public search shut down in 2019 |
| Resident Advisor | No official API → ING-03 |
| Bandsintown | Needs written consent and searches by artist |
| La Vitrine | API access by request only. TODO: email |

## What no free source covers

- **Student events** and **club/nightlife events** (only PredictHQ, which needs a paid plan to store)
- **Promotions** (no source at all)
- **Price per person**, **ratings**, and reliable **opening hours**
- **Recent closures** (the main cause of errors)

Where storage is forbidden, live API calls with a short cache may be allowed (Ticketmaster, PredictHQ), but limits apply to the whole app and the data can't be kept for ML.

## Samples (`docs/samples/`)

`openstreetmap-mcgill.json`, `overture-mcgill.geojson`, `montreal-events-3km-upcoming.csv`, `montreal-food-mcgill.csv`, `mcgill-rss.xml`, `mcgill-event-example.ics`, `ssmu-events.ics`

Overpass query used:
```
[out:json][timeout:60];
(nwr(around:1000,45.5048,-73.5772)[amenity~"^(restaurant|cafe|bar|pub|fast_food|nightclub|cinema|theatre|arts_centre|ice_cream)$"];);
out center tags;
```
