
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

[Discovery API documentation](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)

Ticketmaster exposes structured listings for concerts, sports, theatre and other ticketed events. It can return event descriptions or notes when present, plus classifications, venues, dates and sometimes price ranges. It is valuable for experimenting with event extraction.

- **What it contains:** Event names, classifications, dates, venues, optional `info` / `pleaseNote` text and `priceRanges`.
- **Size:** API advertises 230,000+ events across its coverage; number with useful prose descriptions not verified.
- **License:** Proprietary API terms; storage, caching, redistribution and commercial uses are restricted. An API key alone does not authorize creating a persistent benchmark corpus.
- **Language:** Multiple markets; `en-ca` and `fr-ca` locale options exist, but description availability in both languages is not guaranteed.
- **Region:** International, including Canada.
- **How to get it:** Register for a developer API key and query Discovery API v2.
- **Need served:** **Need 3** — structured event records and optional descriptive text.
- **Verdict:** **No for a reusable public benchmark; conditional for limited API-based tests** if permitted by the applicable terms.


### Comparison Table

| Dataset | Need | Size | Language / region | License | Verdict |
|---|---|---|---|---|---|
| Montréal Public Events | 3 | Live feed; count unverified | FR / Montréal | CC BY 4.0 | **Yes** |
| Montréal Sports & Leisure | 3 | Multiple resources; count unverified | FR / Montréal | CC BY 4.0 | **Yes** |
| OpenAgenda public agendas | 3 | Varies by agenda | Mostly FR / France + others | Per event | **Conditional yes** |
| Orléans OpenAgenda export | 3 | ~66.8 MB CSV / ~99.1 MB JSON | FR / Orléans | Licence Ouverte 2.0 | **Provisional yes** |
| Ticketmaster Discovery API | 3 | 230k+ events advertised | Multilingual / global | Proprietary API terms | **No** for reusable corpus |
| EventKG v3.0 | 3 | ~5.4 GB | Multilingual / global | Unverified | **No** |

**Duplicate-source note:** Données Québec Montréal Public Events and the Open Canada link are the same underlying dataset, not two separate candidates. General OpenAgenda access and the specific Orléans export are listed separately because they have different access and rights considerations.

### Recommended sources by need

- **Need 3 (primary):** Montréal Public Events for French event descriptions; Montréal Sports & Leisure for activity descriptions; OpenAgenda/Orléans for additional French event language and possible access conditions. Choose a specifically licensed OpenAgenda agenda before harvesting.
- **Need 1 (deferred by the proposed ML-01 test strategy):** Use schema-matched synthetic `Candidate` objects first; optionally supplement with a small sample of real venue metadata for integration.
- **Need 2 (deferred; requires team discussion):** Individual ratings/check-ins do not directly represent explicit questionnaire preferences or actual group decisions. Do not claim this need is met by the sources above.

### Gaps and evaluation limitations

1. **No complete ML-02 ground truth:** Source categories may provide *weak* labels, but recurrence, price, restrictions, event-versus-promotion and custom tags usually require independent annotation. Treat `null` as correct when the source text lacks a fact.
2. **Promotion scarcity:** Civic/event feeds are not representative of informal student offers such as “2-for-1 wings Tuesdays, students only.” A small, separately human-reviewed promotion set is still needed.
3. **Language/format shift:** Most Montréal and Orléans descriptions are formal French listings, not short campus posts in English/French. Assess each style separately.
4. **Availability / source bias:** Feeds update and may omit descriptions. Define a sampling date, report field completeness and deduplicate syndicated events.
5. **Licensing:** CC BY / Licence Ouverte generally require source attribution; OpenAgenda rights can vary per event; Ticketmaster is **not** a freely reusable training/test corpus.
