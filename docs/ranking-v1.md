# Ranking v1

This document defines the first version of how AfterClass ranks places for a group (ML-01, #189). It is intentionally simple so the results can be checked by hand, and later ML work can be compared against it.

The ranking works in three steps:

1. Remove places that break a hard limit for anyone in the group.
2. Score each remaining place for each person.
3. Combine the individual scores into one group score and rank the places.

## Inputs

The inputs below are assumptions for now and will be updated once Ingestion confirms what the sources provide.

- **Place:** category, approximate price per person, location, opening hours. Location is converted to straight-line distance from campus (Roddick Gates) in km, which is what the score uses.
- **Person:** budget per person, free time window, preferred categories (from the questionnaire).

The group window is the overlap of everyone's free time. For example, if one person is free 7–10 PM and another is free 8–11 PM, the group window is 8–10 PM. Times after midnight are treated as the same evening (for example, closing at 1 AM means 25:00), so windows and hours that cross midnight still compare correctly.

## Hard limits

A place that breaks a hard limit is removed entirely, regardless of its score.

**Budget.** A place is removed if its price is above the lowest budget in the group. If one person's budget is $20, the hard limit is $20: anything above $20 is removed, and a place at exactly $20 passes. If one person cannot afford it, the group cannot go together.

**Time.** A place is removed if the group window is empty, or if the place is open for less than 60 minutes of the group window. A place that is closed when the group is free is not a real option.

**Category** never removes a place and only affects the score. It is a preference rather than a constraint.

**Location** never removes a place and only affects the score through distance. We only know distance from campus, not from each person's location, so it is not reliable enough to act as a hard limit.

## Score

Each place that passes the hard limits receives a score between 0 and 1 for each person:

```
score = 0.5 × category + 0.3 × price + 0.2 × distance
```

- **Category:** 1 if the place's category is in the person's preferences, otherwise 0.
- **Price:** `1 − price / budget`, so places that are cheaper relative to the person's budget score higher.
- **Distance:** `1 − distance_km / 5`, with a minimum of 0 (any place 5 km or more away scores 0).

Category has the highest weight because it is the main factor in whether someone wants to go, followed by price and then distance. The weights are set by hand for v1 and can be tuned later.

## Group score

The group score is the average of the individual scores.

Averaging works well here because the hard limits already guarantee that every remaining place is affordable and open for everyone. The average then selects the option the group prefers overall.

The main alternative considered was least misery, where the group score is the lowest individual score. It was rejected because one person's mild preference could eliminate a place the rest of the group strongly prefers. Least misery is still used as the first tie-breaker.

## Reasons

Each result is shown with a short explanation built from fixed templates:

- **Price:** "$18 each, fits everyone's budget"
- **Hours:** "Open until 11 PM"
- **Distance:** "1.2 km from campus"
- **Category:** "Matches 1 of 2 people's favourites"

Example: *"$18 each, fits everyone's budget · Open until 11 PM · 1.2 km from campus."* When data is missing, the reason includes a flag instead (see below).

## Missing data

| Missing input | Rule | Shown in reason |
|---|---|---|
| Place price | Skip the budget limit; price score = 0.5 | "Price not confirmed" |
| Place hours | Skip the time limit | "Hours not confirmed" |
| Place location | Distance score = 0.5 | "Distance unknown" |
| Place category | Category score = 0 for everyone | — |
| Person budget | No budget limit from this person; price score = 0.5 | — |
| Person time window | Treat them as available all evening | — |
| Person preferences | Category score = 0.5 for every place | — |

## Edge cases

**Group of one.** The same rules apply. The group window is that person's window, and the group score is their individual score.

**No place passes the hard limits.** No results are shown. Instead, the app displays one line naming the limit that removed the most places, for example: "Nothing fits everyone's budget tonight. The cheapest option is $22." v1 does not relax limits automatically.

**Ties.** Ties are broken in this order: (1) the higher lowest individual score, (2) the shorter distance, (3) place ID, so the ordering is always reproducible.

## Worked example

- **Place:** bowling alley, $18 per person, open until 11 PM, 1.2 km from campus (assumed to open before 8 PM).
- **Person A:** budget $20, free 7–10 PM, likes bowling and arcades.
- **Person B:** budget $15, free 8–11 PM, likes cafes.

**Is it shown to the group?** No. The group window is 8–10 PM and the place is open for the full window, so it passes the time limit. However, the lowest budget is $15 and the price is $18, so the budget limit removes it.

**If B's budget were $25,** the place passes both limits and is scored as follows:

| Person | Category | Price | Distance | Score |
|---|---|---|---|---|
| A | 1 | 1 − 18/20 = 0.10 | 1 − 1.2/5 = 0.76 | 0.5(1) + 0.3(0.10) + 0.2(0.76) = **0.682** |
| B | 0 | 1 − 18/25 = 0.28 | 0.76 | 0.5(0) + 0.3(0.28) + 0.2(0.76) = **0.236** |

**Group score:** (0.682 + 0.236) / 2 = **0.459**

The place ranks highly for A, who likes bowling, although the price is close to A's budget. It ranks low for B, whose preferences do not match.

**Reason shown to the group:** "$18 each, fits everyone's budget · Open until 11 PM · 1.2 km from campus · Matches 1 of 2 people's favourites"

## Out of scope for v1

- Learning from votes or past choices
- Ratings, reviews or popularity
- Each person's own location or travel time
- Automatic weight tuning
- Relaxing hard limits when no place passes

## Pending data sources

The following will be revisited once the Ingestion research is complete:

- **Price:** whether sources provide a single value, a range or nothing. A range will need a rule (likely the lower bound).
- **Hours:** how often opening hours are available and up to date.
- **Location:** whether sources give coordinates or only an address that needs geocoding.
- **Categories:** the final category list, which must match the questionnaire.
- **Thresholds:** the 60-minute minimum overlap and the 5 km distance cap are placeholders.
