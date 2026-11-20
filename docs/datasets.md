
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


