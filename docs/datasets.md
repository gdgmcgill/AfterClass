
# Dataset Sourcing and Benchmarking

To evaluate our ranking models and event/activity text-based classifiers, we aim to identify publicly available datasets that can be used to benchmark their performance.

Most publicly available datasets contain raw information about restaurants, activities, and events, including descriptions, categories, prices, and ratings. While useful as realistic model inputs, **these datasets alone are often insufficient for meaningful evaluation**, as they may lack the ground-truth labels or user preferences needed to assess model performance.

We divide our dataset requirements into two categories: **classification** and **ranking**.

## Preliminary Evaluation Framework

Before assessing dataset suitability, it is important to establish a preliminary understanding of how the data may be used (details as to how it will be used is yet to be finalized and is subject to discussions).
We distinguish between two evaluation objectives:

- **Functional testing:** Assess whether models can process realistic inputs, handle missing or ambiguous information, and produce outputs consistent with defined constraints.
- **Performance benchmarking:** Measure how accurately model outputs align with independently established ground truth.

A dataset may be suitable for functional testing without necessarily supporting quantitative performance benchmarking.

### Classification

Ideally, datasets should contain event/activity descriptions paired with **ground-truth category labels**. Since many datasets are unlabeled or use incompatible taxonomies, we can make them useful by:

- Mapping existing categories to our taxonomy.
- Manually annotating a representative subset.
- Generating preliminary labels using an LLM, followed by human verification on the full set or a subset.

This would allow us to evaluate classification performance using metrics such as precision, recall, and F1-score. Unlabeled datasets can still be useful for testing model behavior, but cannot independently establish classification accuracy.

### Ranking

Ideally, datasets should contain **activity attributes, user/group preferences, and relevance judgments** indicating which activities are most suitable for a given group.

However, most public datasets only provide venue attributes or individual user interactions, rather than explicit group preferences and decisions. Their usefulness therefore depends on how we intend to construct group scenarios and evaluate the resulting rankings.

Potential approaches include:

- **Real-world candidate activities:** Use public datasets containing venue categories, prices, ratings, and locations to provide realistic activities for ranking.
- **Synthetic group profiles:** Define hypothetical groups with explicit preferences, budgets, availability windows, and other constraints matching our application's expected inputs.
- **Constraint validation:** Verify that recommendations respect objectively testable requirements such as budgets, availability, and distance limits.
- **Independent relevance judgments:** Collect human assessments of activity suitability for specific group scenarios to evaluate ranking quality.

Synthetic scenarios can help test constraint compliance, but they do not necessarily reflect real group decisions. Evaluating recommendation quality requires independent preference or relevance judgments.

