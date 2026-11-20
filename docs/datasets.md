
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

[Dataset on Données Québec](https://www.donneesquebec.ca/recherche/dataset/vmtl-evenements-publics) · [Open Canada listing](https://open.canada.ca/data/en/dataset/6a4cbf2c-c9b7-413a-86b1-e8f7081e2578)

Official Montréal event-calendar data. Records include event descriptions and event types alongside information such as dates, target audiences, costs, and locations. It is promising for extracting structured details from real French event descriptions, although some listings are civic rather than recreational.

- **What it contains:** Event descriptions, types, dates, audiences, costs and locations.
- **Size:** Continuously updated feed; total number of usable descriptions not verified.
- **License:** CC BY 4.0; attribution required, including for public/commercial reuse.
- **Language:** Primarily French.
- **Region:** Montréal, Québec, Canada.
- **How to get it:** Download CSV or GeoJSON resources from Données Québec; the Open Canada link is an alternate catalogue listing for the **same dataset**.
- **Need served:** **Need 3** — event-description input and partial reference attributes for ML-02.
- **Verdict:** **Yes.** Strong local event source, subject to filtering irrelevant records and checking description completeness.

### 2. Ville de Montréal — Sports & Leisure Programming

[Dataset on Données Québec](https://www.donneesquebec.ca/recherche/dataset/vmtl-programmation-sports-loisirs-montreal)

Municipal sports and recreation programming, including descriptions of activities and their categories. This complements one-off event calendars with recurring classes and organized leisure activities, closer to some of the experiences the app may recommend.

- **What it contains:** Activity names, descriptions, categories and scheduling-related metadata.
- **Size:** Multiple current/historical resources; total number of usable descriptions not verified.
- **License:** CC BY 4.0; attribution required, including for public/commercial reuse.
- **Language:** Primarily French.
- **Region:** Montréal, Québec, Canada.
- **How to get it:** Download the published CSV, JSON or GeoJSON resources from Données Québec, as available for the relevant release.
- **Need served:** **Need 3** — activity text with existing category information for ML-02.
- **Verdict:** **Yes.** Useful for activity descriptions, but not a source of restaurant promotions; assess which structured fields are also stated in the text.

### 3. OpenAgenda — Public Event Agendas

[OpenAgenda developer documentation](https://developers.openagenda.com/en/)

OpenAgenda publishes event listings with human-written descriptions, dates, venues and optional conditions or keywords. It is a promising source of short French event announcements, but **OpenAgenda is a platform rather than one single downloadable dataset**; the particular agenda and each event's reuse rights matter.

- **What it contains:** Event titles, short descriptions, optional long descriptions, keywords, conditions, timings and locations.
- **Size:** Varies by selected agenda; no single platform-wide dataset size applies.
- **License:** Varies by event/agenda (`rights.license`); confirm a compatible licence and attribution requirements before reuse.
- **Language:** Frequently French; English and other languages may be available.
- **Region:** Mainly France, with agendas in other regions.
- **How to get it:** Select a public agenda and use its export or API; authentication/access conditions depend on the endpoint.
- **Need served:** **Need 3** — natural-language event descriptions and some structured metadata.
- **Verdict:** **Yes, conditionally.** Choose an exact agenda and verify per-record rights before including it in a reusable benchmark. The specific OpenAgenda dataset initially mentioned has not been identified.

### 4. Orléans Métropole — Public Events (OpenAgenda Export)

[Dataset on data.gouv.fr](https://www.data.gouv.fr/datasets/liste-des-evenements-publics-openagenda-orleans-metropole)

A named, downloadable OpenAgenda-based dataset of public events from the Orléans area. Unlike the general OpenAgenda platform, it is a concrete candidate with published export files. It may provide natural-language French event descriptions, though the actual fields and text completeness still need checking.

- **What it contains:** Public-event listings exported from OpenAgenda; description field coverage requires sample verification.
- **Size:** Published CSV approximately **66.8 MB** and JSON approximately **99.1 MB**; usable event count not verified.
- **License:** Licence Ouverte 2.0; attribution required.
- **Language:** French.
- **Region:** Orléans Métropole, France.
- **How to get it:** Download CSV or JSON exports from the dataset page on data.gouv.fr.
- **Need served:** **Need 3** — supplementary event text and event metadata.
- **Verdict:** **Yes, provisional.** Openly licensed and accessible, but confirm that the export includes sufficiently informative prose descriptions.

### 5. Ticketmaster — Discovery API v2

[Discovery API documentation](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) · [API terms](https://developer.ticketmaster.com/support/terms-of-use/)

Ticketmaster exposes structured listings for concerts, sports, theatre and other ticketed events. It can return event descriptions or notes when present, plus classifications, venues, dates and sometimes price ranges. It is valuable for experimenting with event extraction, but it is **not an openly licensed dataset**.

- **What it contains:** Event names, classifications, dates, venues, optional `info` / `pleaseNote` text and `priceRanges`.
- **Size:** API advertises 230,000+ events across its coverage; number with useful prose descriptions not verified.
- **License:** Proprietary API terms; storage, caching, redistribution and commercial uses are restricted. An API key alone does not authorize creating a persistent benchmark corpus.
- **Language:** Multiple markets; `en-ca` and `fr-ca` locale options exist, but description availability in both languages is not guaranteed.
- **Region:** International, including Canada.
- **How to get it:** Register for a developer API key and query Discovery API v2.
- **Need served:** **Need 3** — structured event records and optional descriptive text.
- **Verdict:** **No for a reusable public benchmark; conditional for limited API-based tests** if permitted by the applicable terms.

### 6. EventKG v3.0

[EventKG archive](https://zenodo.org/records/3733829) · [Project information](https://eventkg.l3s.uni-hannover.de/data.html)

A multilingual event knowledge graph designed for research. It contains historical and encyclopedic event entities with structured facts, but its content is much less representative of informal leisure listings and short promotional announcements.

- **What it contains:** Event entities, labels, descriptions, temporal information and linked knowledge-graph relationships.
- **Size:** Approximately **5.4 GB** archive for v3.0; not a ready-to-use short-text table.
- **License:** Reuse rights for this archive version not confirmed; do not assume approval for the app.
- **Language:** Multilingual, including English and French.
- **Region:** Global.
- **How to get it:** Download research data archives from Zenodo and parse the RDF/N-Quads representation.
- **Need served:** **Need 3**, indirectly — possible event descriptions but a weak domain match.
- **Verdict:** **No.** Poor fit for short, informal activity and promotion extraction; substantial processing required.

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

### References and access

- [Montréal Public Events — source/catalogue](https://www.donneesquebec.ca/recherche/dataset/vmtl-evenements-publics); [Open Canada metadata / CC BY licence](https://open.canada.ca/data/en/dataset/6a4cbf2c-c9b7-413a-86b1-e8f7081e2578)
- [Montréal Sports & Leisure — source/catalogue](https://www.donneesquebec.ca/recherche/dataset/vmtl-programmation-sports-loisirs-montreal)
- [OpenAgenda event fields](https://developers.openagenda.com/en/evenements/export-json/); [per-event licensing](https://developers.openagenda.com/licence/)
- [Orléans OpenAgenda published dataset](https://www.data.gouv.fr/datasets/liste-des-evenements-publics-openagenda-orleans-metropole)
- [Ticketmaster Discovery API documentation](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/); [Ticketmaster API terms](https://developer.ticketmaster.com/support/terms-of-use/)
- [EventKG data](https://eventkg.l3s.uni-hannover.de/data.html); [v3.0 archive](https://zenodo.org/records/3733829)


