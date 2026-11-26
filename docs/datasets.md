
# Dataset Sourcing and Benchmarking

To evaluate our event/activity text-based classifiers, we aim to identify publicly available datasets containing natural-language descriptions of events, activities, and promotions. These datasets will provide realistic inputs for testing classification and information extraction techniques.

While our ranking models also require evaluation, we propose a different approach that does not depend on sourcing external public datasets.

## Classification

Ideally, datasets should contain event/activity descriptions paired with **ground-truth labels and structured attributes** corresponding to the classifier's expected outputs, such as categories, dates, prices, locations, and restrictions.

However, most publicly available datasets contain raw descriptions with incomplete labels or incompatible taxonomies. To make these datasets useful for benchmarking, we can:

- Map existing categories to our own defined taxonomy.
- Manually annotate a representative subset of descriptions.
- Generate preliminary labels using an LLM, followed by human verification on the full set or a subset.

This would allow us to evaluate classification performance using metrics such as precision, recall, and F1-score. Unlabeled datasets can still be useful for testing model behavior, but cannot independently establish classification accuracy.

## Ranking

Unlike the classification models, our ranking models operate on **structured data**, which are expected to be collected through user onboarding.

Since the primary objective is to rank candidates according to how well they satisfy each participant's preferences and constraints, external venue datasets are not strictly necessary for evaluating the ranking logic. Instead, we can construct controlled test scenarios that directly reflect the model's expected inputs.

A potential evaluation approach includes:

- **Synthetic candidates/candidates from public datasets:** Generate structured Candidate objects with varying categories, prices, locations, schedules, and other relevant attributes.
- **Synthetic group profiles:** Define groups with explicit individual preferences, budgets, availability windows, and potentially conflicting interests.
- **Constraint validation:** Verify that recommendations respect hard constraints such as budgets, availability, and distance limits.
- **Preference-aware ranking:** Evaluate whether changes in individual preferences produce appropriate changes in ranking, and whether the model balances preferences according to its intended ranking objective.

This approach allows us to systematically test ranking behavior without relying on public datasets that may not reflect our application's input structure.

However, **synthetic scenarios alone cannot establish real-world recommendation quality**. Independent human relevance judgments or actual group feedback would eventually be needed to assess whether the rankings align with users' preferences in practice.


## Dataset Evaluations

The following section focuses on publicly available datasets suitable for evaluating our classification models, particularly those containing natural-language descriptions of events, activities, and promotions.

Each dataset will be assessed based on its description quality, available reference labels, language coverage, accessibility, licensing, and suitability for classification and information extraction benchmarking.

### 1. Ville de Montréal — Public Events

[Québec's official public dataset website](https://www.donneesquebec.ca/recherche/dataset/vmtl-evenements-publics)

Official Montréal event-calendar data. Records include event descriptions and event types alongside information such as dates, target audiences, costs, and locations. It is promising for extracting structured details from real French event descriptions, although some listings are civic rather than recreational.

- **What it contains:** Event descriptions, types, dates, audiences, costs and locations.
- **Size:** Continuously updated feed; total of 3,864 rows of events (~ 1.6MB)
- **License:** CC BY 4.0; attribution required, including for public/commercial reuse.
- **Language:** Primarily French.
- **Region:** Montréal, Québec, Canada.
- **How to get it:** Downloadable as CSV or GeoJSON from the provided link.
- **Need served:** **Need 3 and Need 1** — rich natural-language event descriptions.
- **Verdict:** **Yes/No** Strong local event source, with rich activity descriptions but most of the listed events are more civic oriented. Most of the production data will likely not be of the same nature as those provided with this dataset and can be ineffective at testing a contextual natural language processor. It can still be used for initial classifier development.

#### Sample data

(Selected fields only)

| CSV record | `titre` | `description` | `type_evenement` | `date_debut` | `inscription` | `cout` |
|---|---|---|---|---|---|---|
| 373 | Vendredis jeux de société | Venez passer un moment ludique en famille et découvrez nos nouveautés en jeux de société. | Jeux | 2026-12-11 | Entrée libre | Gratuit |
| 1446 | Danse urbaine | Cours débutant de danse urbaine au centre Sanaaq dès le 23 septembre 2026 près du métro Atwater. C’est gratuit et accessible à toute personne sur inscription. | Sport et plein air | 2026-11-25 | Sur inscription | Gratuit |
| 110 | 400ᵉ anniversaire de Giovanni Legrenzi - Les Ondes | Ne manquez ce concert en hommage à Giovanni Legrenzi présenté par la série Les Ondes et la Chapelle musicale du Bon-Pasteur. | Musique | 2026-11-25 | Avec billet | Gratuit |

### 2. OpenAgenda — Public Events

[Huwise datahub](https://hub.huwise.com/explore/assets/evenements-publics-openagenda/view/?vt=rt)

The data can be accessed from Huwise but the original source of the data is from OpenAgenda, who publishes event listings with human-written descriptions, dates, venues and optional conditions or keywords.

- **What it contains:** Event titles, short descriptions, optional long descriptions, keywords, conditions, timings and locations.
- **Size:** Varies by selected region (user has control over which subset of the data to download). Full dataset contains 1,317,537 records (~ 5GB)
- **License:** Licence Ouverte v2.0; attribution required, including for public/commercial reuse.
- **Language:** Majorly French; English events can be easily filtered from the Canada and US regions.
- **Region:** Mainly France, but can filter for Canada and US.
- **How to get it:** Downloadable as CSV and JSON from the provided link.
- **Need served:** **Need 3 and Need 1** — rich natural-language event descriptions.
- **Verdict:** **Yes** Rich variety in event types (not dominantly civic like in the Ville de Montréal dataset), which is more contextually aligned with production data.

#### Sample data

(Selected fields only)

| CSV record | `Title` | `Description` | `Times` | `Place name` | `Details` |
|---|---|---|---|---|---|
| 1522 | Fête de la Bretagne 2023 dinner in Louisiana! | Join us for an intimate Fête de la Bretagne dinner in Lafayette, Louisiana as we bring together Breizh Amerika members, Bretons, and friends of Brittany. | Samedi 20 mai, 18h00 | Prejean's Restaurant Carencro | Entrée libre |
| 441 | Franco-WAG | Créez votre propre macaron qui célèbre votre francophonie, participez à des jeux dans le musée, et anticipez une visite spéciale des danseurs francophones. Amusons-nous en français. | Dimanche 18 mars 2018, 13h00, 14h30 | 300 boul. Memorial | $20 par famille, Gratuit pour les membres |
| 1031 | LINDIGO à Montréal (Canada) Festival Nuits d'Afrique | Appel à la fête et rassembleuse, la musique de la bande du sympathique Olivier Araste, guidée par les traditionnels Roulèr et kayamb, séduit toutes les générations, gardant le Maloya bien vivant. | Mardi 12 juillet, 20h30 | Club Ballatou | Prix : 25$ |

### 3. Ticketmaster — Discovery API v2

[Discovery API documentation](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) · [API terms](https://developer.ticketmaster.com/support/terms-of-use/)

Ticketmaster exposes structured listings for concerts, sports, theatre and other ticketed events. It can return event descriptions or notes when present, plus classifications, venues, dates and sometimes price ranges. It is valuable for experimenting with event extraction.

- **What it contains:** Event names, classifications, dates, venues, optional `info` / `pleaseNote` text and `priceRanges`.
- **Size:** API advertises 230,000+ events across its coverage.
- **License:** Proprietary API terms; storage, caching, redistribution and commercial uses are restricted. Refer to the API terms of use provided in the link.
- **Language:** Multiple markets; `en-ca` and `fr-ca` locale options exist, but description availability in both languages is unverified.
- **Region:** International, including Canada.
- **How to get it:** Register for a developer API key and query Discovery API v2.
- **Need served:** **Need 3** — structured event records and rich natural-language event descriptions.
- **Verdict:** **Yes but more No** Although Ticketmaster's Discovery API v2 provides relevant event descriptions, its proprietary licensing terms restrict data storage and redistribution. As a result, it is not suitable for building a permanent, reproducible ML-02 evaluation dataset without additional permission. It may still be useful for temporary experimentation, subject to the API's terms.

#### Sample data

(Selected fields only)
**Queries return as JSON; formatted in table format for consistency**

| Event ID | Title | Description | Times | Place name | Details |
|---|---|---|---|---|---|
| 110064C38FB353A7 | Tape Face | Comedy performance. Doors open at 6 PM, show begins at 7 PM. | Sunday, November 22, 2026, 7:00 PM | Club Regent Event Centre, Winnipeg, MB | All ages. Photography and video recording prohibited. |
| 1000650CDAAADCE9 | Josh Baker | Dance/electronic music event featuring Josh Baker. Doors and show at 8 PM. | Saturday, November 28, 2026, 8:00 PM | History Toronto, Toronto, ON | Ages 19+. Maximum 6 tickets per customer. Venue capacity: 2,500. |
| 0D006553CEAFC65F | Tempo Daylife Tampa Bay Presents - Steve Aoki | Dance/electronic event featuring Steve Aoki, with VIP upgrades available. | Sunday, December 27, 2026, 11:00 AM | Seminole Hard Rock Tampa Event Center, Tampa, FL | Ages 21+. No audio or video recording. No refunds. VIP upgrades available. |


### 4. Google Local Data (2021) — UC San Diego

[Dataset documentation](https://mcauleylab.ucsd.edu/public_datasets/gdrive/googlelocal/)

Google Local Data is a large-scale dataset of Google Maps business listings and customer reviews, published by researchers at UC San Diego. It contains business descriptions, categories, ratings, prices, opening hours, and location information, alongside user-generated reviews. It is particularly useful for restaurant/eatery classification.

- **What it contains:** Business names, descriptions, categories, addresses, geographic coordinates, price levels, average ratings, opening hours, and customer reviews with ratings and timestamps.
- **Size:** 4,963,111 businesses, 666,324,103 reviews, and 113,643,107 users (possibility to download relevant subsets).
- **License:** No explicit open-data license was identified in the official dataset documentation. The authors only request citation of their research papers.
- **Language:** Primarily English.
- **Region:** United States, with data collected up to September 2021.
- **How to get it:** Download business metadata and review files directly from the UC San Diego dataset page. Files are organized by US state, with smaller subsets available for experimentation.
- **Need served:** **Need 1 (partial)** — structured venue attributes, including categories, prices, and ratings. **Need 3 (partial)** — natural-language business descriptions and customer reviews.
- **Verdict:** **Yes (with limitations).** Google Local Data provides natural-language business descriptions alongside structured attributes such as categories, price levels, ratings, and opening hours, making it useful for testing restaurant classification and attribute extraction. However, it is less suitable for event-specific extraction tasks involving dates, promotions, and recurring schedules.

#### Sample data

(Selected fields only)
**Queries return as JSON; formatted in table format for consistency**

| JSON record | `name` | `description` | `category` | `price` | `avg_rating` | `address` |
|---|---|---|---|---|---|---|
| 49 | Pizza Autentica | Casual local chain serving Neapolitan pizza, stromboli & panini, plus breakfast sandwiches & gelato. | ["Pizza restaurant", "Italian restaurant", "Neapolitan restaurant", "Pizza delivery", "Pizza Takeout", "Restaurant"] | $ | 4 | Pizza Autentica, 1331 L St NW #1, Washington, DC 20005 |
| 266 | Third Eye Tavern | Nepalese dumplings lead the pub fare at this narrow, brick-walled tavern with live music downstairs. | ["Nepalese restaurant", "American restaurant", "Restaurant"] | $ | 4 | Third Eye Tavern, 1723 Connecticut Ave NW, Washington, DC 20009 |
| 8063 | Ping Pong Dim Sum | Cosmopolitan tea house with a contemporary twist offering a dim sum bar & other Asian specialties & cocktails. | ["Chinese restaurant", "Asian restaurant", "Brunch restaurant", "Cocktail bar", "Dim sum restaurant", "Restaurant", "Tea house"] | $$$ | 3.2 | Ping Pong Dim Sum, 900 7th St NW, Washington, DC 20001 |

## Comparison Table

| Dataset | Need | Size | Language / region | License | Verdict |
|---|---|---|---|---|---|
| Montréal Public Events | 1 and 3 | 3,864 events (~1.6 MB); continuously updated | Primarily FR / Montréal, Canada | CC BY 4.0 | **Mixed.** Useful for initial classifier development; civic content limits production relevance. |
| OpenAgenda Public Events (Huwise) | 1 and 3 | 1,317,537 records (~5 GB); regional subsets available | Mainly FR; EN listings available / mainly France, with Canada and US subsets | Licence Ouverte v2.0 | **Yes.** Varied recreational and dining events align with production inputs. |
| Ticketmaster Discovery API v2 | 3 | 230,000+ events advertised | Multilingual / international, including Canada; EN/FR description coverage unverified | Proprietary API terms | **No for a permanent, reproducible benchmark without additional permission.** Limited experimentation may be possible under the API terms. |
| Google Local Data (2021), UC San Diego | 1 and 3 (partial) | 4,963,111 businesses; 666,324,103 reviews; state subsets available | Primarily EN / United States, collected through September 2021 | No explicit open-data license identified | **Yes, with limitations.** Useful for restaurant classification and venue attributes; limited event-specific extraction and unresolved reuse rights. |

## Gaps and Evaluation Limitations

1. **Ground-truth labels.** Source categories do not necessarily match our taxonomy (still undecided). Define which text fields the classifier receives, map source categories to our taxonomy, and manually verify reference labels for a representative subset.

2. **Real-world ranking quality.** None of the selected sources establishes how a group would rank candidates given its members' preferences and constraints. Google ratings describe individual customer experiences and do not supply those group judgments. Synthetic candidates and group profiles can test ranking logic, but independent relevance judgments or feedback from actual groups are still needed to assess recommendation quality.
