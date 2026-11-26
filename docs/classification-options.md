# Classification Options

### The task
- Input: short string (less than or equal to 100 words) in English or French
- Output: classification (event, promotion, neither), details, tags
- Details are event-specific requirements, while tags are generic descriptors of the event
- Details:
    - Price/offer in $/%/free
    - Currency if applicable
    - Date (Year, Month, Day) or date range (YMD to YMD)
    - Location (address)
    - Organization: club, McGill, business, etc.
    - Time (in 24h00 time, can be converted to am/pm later)
    - Repetition: none, weekly, biweekly (every 2 weeks), monthly, quarterly, yearly, other
    - Restrictions: 18+, McGill students only, Science majors only, etc.
- Tags: various descriptors of the event, are only added if applicable, multiple tags of the same category are allowed
  - Event type: social, sport, academic, professional, competition, workshop
  - Food: food provided, dietary accomadations (vegetarian, vegan, halal, kosher, etc.), food not provided
  - Experience Level: beginner, intermediate, advanced, expert
  - Promotion type: buy one get one free, sale, happy hour
  - Other tags may be added as the scope expands and depending on developer capabilities

Output Schema:
```json
{
  "classification": "event | promotion | neither",
  "details": {
    "price": null,
    "currency": null,
    "date": null,
    "location": null,
    "organization": null,
    "time": null,
    "repetition": null,
    "restrictions": []
  },
  "tags": []
}
```

## Decision-Making Ladder
1. Word-Matching: search for keywords relating to tags, restrictions, prices, and dates
  - Tags: "trivia", "pizza", "student", "coding", "CV", "internship", etc.
  - Restrictions: "student", "professional", "teams"
  - Prices: "ticket", "optional donation", etc.
  - Dates: "Tomorrow", "this Wednesday", "every Tuesday", etc.
2. Patterns: use regular expressions (regex) to isolate prices, time, dates (in numerical format or word format)
  - Prices: "4$", "$2", "$3.00", "5000 dollar", "300 dollars"
  - Time: "12h00", "11:00am", "11:00", "6 pm", "5-7 pm", "18h00 à 20h00" "5à7"
  - Dates: "2026-03-14", "July 20, 2027", "December 12", "12/20/2026", "06/12/2026"
    - Note that dates can be ambiguous (06/12/2026 can be December 6 or June 12)
3. Duplicate-Check: Check for duplicate or similar events in the database using a similarity index
  - Compute a weighted average similarity score, weighing rarer words more than common words to find some 75%+ weighted agreement
  - If no duplicate found using weighted average, compute a points checklist with a threshold score for duplicate
  - Example checklist:
    a. Same organization (including null): required
    b. Same date: +5 per date / - 5 per different date
    c. Same prices: +2 per price / -2 per different price
    d. Same restrictions: +1 per restriction / -1 per different restriction
    e. Same tags: +1 per tag / -1 per different tag
    Threshold: 5 points
4. Server-Side Small Model
  - Small LLM running on the server-side processing events as they are received (e.g. Qwen3.5-4B, custom model)
  - Input: text
  - Output: JSON of event, certainty score (threshold of 80%)
  - Verification: Verify that pre-generated tags match LLM output
5. Scrapping
  - If event classified as neither, scrap it and do not add it to the database

Start at step 1 & 2. Proceed to step 3. If a duplicate event is found, stop the ladder (event is already recorded). Else, proceed to run a small LLM on the text to output the JSON. If the event does not apply to AfterClass (e.g. an announcement about midterms), the event should not be added to the database to save storage and keep only relevant events. This minimizes compute cost while maximizing utility and versatility of the system.

## Unsure Cases
In the event that the system is unsure, unsure events should be "suspended" for human review.
Once reviewed, they may be added back and the new event may form part of training data of the model.

## Minimum Viable Product
- A function `match_event_words()` that takes as input event text, and outputs word-matched tags, restrictions, prices, dates
- A function `match_event_patterns()` that takes as input event text, and outputs prices, time, dates
- A function `is_event_duplicate()` that takes as input event text, and sends a GET request to the API for a duplicate event, returns true (if duplicate)/false (if not duplicate)
- A function `analyze_event()` that takes as input event text and returns formatted JSON, confidence percentage
- A function `post_event()` that takes as input formatted JSON and sends POST request to API
- A function `create_event()` that takes as input event text and runs through the decision-making ladder using the other functions

## Examples
#### English

1. Free pizza and trivia night at Thompson House this Thursday, Nov 19 at 7pm! Hosted by the Arts Undergraduate Society. Vegetarian options available.
Step 1:
  - Tags: "pizza" -> "food provided", "vegetarian" -> "vegetarian"
  - Date: "Thursday", "Nov 19"
  - Prices: "Free"
Step 2:
  - Prices: null
  - Time: 7pm
Step 3:
  - No duplicate found
Step 4:
  - See JSON + 80% certainty score
Step 5:
  - Event is not classified as neither, stored in database


```json
{
  "classification": "event",
  "details": {
    "price": "free",
    "currency": null,
    "date": "2026-11-19",
    "location": "Thompson House",
    "organization": "Arts Undergraduate Society",
    "time": "19:00",
    "repetition": "none",
    "restrictions": []
  },
  "tags": ["social", "competition", "food provided", "vegetarian"]
}
```
2. 2 for 1 wings every Tuesday at Wing Shack, students only. Show your student ID.

```json
{
  "classification": "promotion",
  "details": {
    "price": "2 for 1",
    "currency": null,
    "date": null,
    "location": null,
    "organization": "Wing Shack",
    "time": null,
    "repetition": "weekly",
    "restrictions": ["students only"]
  },
  "tags": ["buy one get one free"]
}
```
3. Intro to Python workshop, Nov 24 2026, 17:30 to 19:30. Bring your laptop, beginners welcome. Pizza provided by McGill GDG.

```json
{
  "classification": "event",
  "details": {
    "price": null,
    "currency": null,
    "date": "2026-11-24",
    "location": null,
    "organization": "McGill GDG",
    "time": "17:30-19:30",
    "repetition": "none",
    "restrictions": []
  },
  "tags": ["workshop", "academic", "beginner", "food provided"]
}
```
4. Lost: black Hydroflask with stickers, last seen in Leacock 232. DM me if found!

```json
{
  "classification": "neither",
  "details": {
    "price": null,
    "currency": null,
    "date": null,
    "location": null,
    "organization": null,
    "time": null,
    "repetition": null,
    "restrictions": []
  },
  "tags": []
}
```
5. Weekly open mic at Le Petit Bar, every Wednesday at 20:00. Free entry, all welcome.

```json
{
  "classification": "event",
  "details": {
    "price": "free",
    "currency": null,
    "date": null,
    "location": null,
    "organization": "Le Petit Bar",
    "time": "20:00",
    "repetition": "weekly",
    "restrictions": []
  },
  "tags": ["social"]
}
```
6.  Buy one pizza, get the second free after 9pm at Mario's Pizzeria, Monday to Thursday, until Dec 31, 2026.

```json
{
  "classification": "promotion",
  "details": {
    "price": "buy one get one free",
    "currency": null,
    "date": "until 2026-12-31",
    "location": null,
    "organization": "Mario's Pizzeria",
    "time": "from 21:00",
    "repetition": "weekly",
    "restrictions": []
  },
  "tags": ["buy one get one free"]
}
```
7. Hackathon: 24 hours of coding, prizes up to $5000. Feb 6 to 7, 2027 at the Trottier Building. Teams of 2 to 4, free registration.

Note: the $5000 is a prize, not a price.

```json
{
  "classification": "event",
  "details": {
    "price": "free",
    "currency": null,
    "date": "2027-02-06/2027-02-07",
    "location": "Trottier Building",
    "organization": null,
    "time": null,
    "repetition": "none",
    "restrictions": ["teams of 2 to 4"]
  },
  "tags": ["competition", "academic"]
}
```
8. Yoga for beginners every other Sunday at 10am, Studio B, $8 drop-in.

```json
{
  "classification": "event",
  "details": {
    "price": 8,
    "currency": "CAD",
    "date": null,
    "location": "Studio B",
    "organization": null,
    "time": "10:00",
    "repetition": "biweekly",
    "restrictions": []
  },
  "tags": ["sport", "beginner"]
}
```
9. Reminder: final exam schedule is now posted on Minerva. Good luck everyone!

```json
{
  "classification": "neither",
  "details": {
    "price": null,
    "currency": null,
    "date": null,
    "location": null,
    "organization": null,
    "time": null,
    "repetition": null,
    "restrictions": []
  },
  "tags": []
}
```
10. Annual alumni gala, $100 per person, black tie. March 14, 2027 at 18:30, Fairmont Queen Elizabeth, 900 René-Lévesque Blvd W.

```json
{
  "classification": "event",
  "details": {
    "price": 100,
    "currency": "CAD",
    "date": "2027-03-14",
    "location": "Fairmont Queen Elizabeth, 900 René-Lévesque Blvd W",
    "organization": null,
    "time": "18:30",
    "repetition": "yearly",
    "restrictions": ["black tie"]
  },
  "tags": ["social"]
}
```

#### French

1. Gratuit avant 22h au Bar Le Chat Noir ce vendredi, 5 $ après. 18 ans et plus.
```json
{
  "classification": "promotion",
  "details": {
    "price": "free before 22:00, then 5",
    "currency": "CAD",
    "date": null,
    "location": null,
    "organization": "Bar Le Chat Noir",
    "time": "until 22:00",
    "repetition": null,
    "restrictions": ["18+"]
  },
  "tags": []
}
```
2. Conférence sur l'IA en santé le 12 décembre 2026 de 14h à 16h au 3480 rue University. Réservé aux étudiants de McGill.

```json
{
  "classification": "event",
  "details": {
    "price": null,
    "currency": null,
    "date": "2026-12-12",
    "location": "3480 rue University",
    "organization": null,
    "time": "14:00-16:00",
    "repetition": "none",
    "restrictions": ["McGill students only"]
  },
  "tags": ["academic"]
}
```
3. Du 16 au 22 novembre 2026, 50 % de rabais sur tous les cafés après 15h chez Café Lumière.

```json
{
  "classification": "promotion",
  "details": {
    "price": "50%",
    "currency": null,
    "date": "2026-11-16/2026-11-22",
    "location": null,
    "organization": "Café Lumière",
    "time": "from 15:00",
    "repetition": "none",
    "restrictions": []
  },
  "tags": ["sale"]
}
```
4. Tournoi de volleyball intramural samedi le 5 décembre 2026 au gymnase Love, 9h à 17h. Tous les niveaux. 10 $ par équipe de 6.

```json
{
  "classification": "event",
  "details": {
    "price": "10 per team",
    "currency": "CAD",
    "date": "2026-12-05",
    "location": "gymnase Love",
    "organization": null,
    "time": "09:00-17:00",
    "repetition": "none",
    "restrictions": []
  },
  "tags": ["sport", "competition", "beginner", "intermediate", "advanced"]
}
```
5. Soirée de réseautage pour étudiants en génie, 3 décembre 2026 à 18h. Nourriture végétalienne et halal disponible. Réservé aux étudiants en génie.

```json
{
  "classification": "event",
  "details": {
    "price": null,
    "currency": null,
    "date": "2026-12-03",
    "location": null,
    "organization": null,
    "time": "18:00",
    "repetition": "none",
    "restrictions": ["engineering students only"]
  },
  "tags": ["professional", "social", "food provided", "vegan", "halal"]
}
```
6. Quelqu'un a les notes du cours de COMP 202 de la semaine passée ? Merci d'avance!

```json
{
  "classification": "neither",
  "details": {
    "price": null,
    "currency": null,
    "date": null,
    "location": null,
    "organization": null,
    "time": null,
    "repetition": null,
    "restrictions": []
  },
  "tags": []
}
```
7. Étudiants : 15 % de rabais sur tout en magasin avec votre carte étudiante, du 20 au 22 novembre 2026, chez Librairie Pages.

```json
{
  "classification": "promotion",
  "details": {
    "price": "15%",
    "currency": null,
    "date": "2026-11-20/2026-11-22",
    "location": null,
    "organization": "Librairie Pages",
    "time": null,
    "repetition": "none",
    "restrictions": ["students only"]
  },
  "tags": ["sale"]
}
```
8. Happy hour de 16h à 18h tous les jours au Pub Saint-Laurent : bières à 4 $.

```json
{
  "classification": "promotion",
  "details": {
    "price": 4,
    "currency": "CAD",
    "date": null,
    "location": null,
    "organization": "Pub Saint-Laurent",
    "time": "16:00-18:00",
    "repetition": "other",
    "restrictions": []
  },
  "tags": ["happy hour"]
}
```
9. Atelier de rédaction de CV avec le Service de carrières de McGill, 25 novembre 2026, 12h30. Dîner offert, options végétariennes.

```json
{
  "classification": "event",
  "details": {
    "price": null,
    "currency": null,
    "date": "2026-11-25",
    "location": null,
    "organization": "Service de carrières de McGill",
    "time": "12:30",
    "repetition": "none",
    "restrictions": []
  },
  "tags": ["workshop", "professional", "food provided", "vegetarian"]
}
```
10. Billets de concert à 20 $ US à la porte, portes ouvertes à 19h, samedi 12 décembre 2026, Salle Verte, 1234 boulevard Saint-Laurent. 18 ans et plus.

```json
{
  "classification": "event",
  "details": {
    "price": 20,
    "currency": "USD",
    "date": "2026-12-12",
    "location": "Salle Verte, 1234 boulevard Saint-Laurent",
    "organization": "Salle Verte",
    "time": "19:00",
    "repetition": "none",
    "restrictions": ["18+"]
  },
  "tags": ["social"]
}
```