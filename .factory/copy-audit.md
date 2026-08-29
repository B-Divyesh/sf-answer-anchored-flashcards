# Copy audit

Audited 2026-08-29. Counts treat hyphenated terms as one word. Every landing sentence is 22 words or fewer and contains no banned plain-words term.

## Landing page

| Copy | Words | Result |
|---|---:|---|
| Typed-answer flashcard review | 3 | Pass |
| Score flashcards from typed answers | 5 | Pass |
| For people studying alone who want the next review date based on an answer, not a guessed rating. | 18 | Pass |
| Try it with sample data | 5 | Pass |
| Three due cards open next. | 5 | `demo-sample` |
| Works offline after your first visit | 6 | Pass |
| Cards stay in this browser | 5 | Pass |
| Free for 30 cards | 4 | Pass |
| Typed answer → answer key → next review date | 7 | Pass |
| How Recall Anchor scores a review | 6 | Pass |
| See what matched and when to review again | 9 | Pass |
| Type your answer before seeing the key | 7 | Pass |
| Write the answer you remember. | 5 | Pass |
| Compare it with the answer key | 6 | Pass |
| Use exact text, a number range, or a checklist. | 9 | Pass |
| See why the card returns when it does | 9 | Pass |
| Read what matched and the next review date. | 8 | Pass |
| Data storage and privacy | 4 | Pass |
| Cards and reviews stay in this browser | 7 | Pass |
| Cards and reviews are stored on this device. | 9 | Pass |
| Plans | 1 | Pass |
| Use 30 cards free or buy unlimited cards | 9 | Pass |
| one-time purchase | 2 | Pass |
| The Recall Anchor Desk license adds unlimited cards and review trends. | 11 | Pass |
| The free plan includes 30 cards, every card type, and every export. | 12 | Pass |
| Score cards from typed answers, not guessed ratings. | 8 | Pass |

Read-aloud check: “Score flashcards from typed answers. For people studying alone who want the next review date based on an answer, not a guessed rating. Try it with sample data.” It states the task, audience, and first action in one breath.

## Terms and 404 review

| Copy | Words | Result |
|---|---:|---|
| Use Recall Anchor for personal study | 6 | Heading |
| The free plan holds 30 cards. | 6 | `free-limit` |
| The Recall Anchor Desk license costs $19 once and adds unlimited cards plus review trends. | 14 | `paid-desk` |
| The Desk purchase opens Sociobot’s hosted checkout. | 7 | `paid-desk` |
| A license must be active for paid features to remain available. | 11 | `license-revocation` |
| Keep an encrypted backup and its passphrase. | 7 | Instruction |
| Browser storage can be cleared by your device or browser. | 10 | Storage warning |
| The software is provided as is under the MIT License. | 10 | License term |
| Use it only where local law allows. | 7 | Legal instruction |
| Error 404 | 2 | Literal status label |
| Page not found | 3 | Literal h1 |
| The address may be wrong or the page may have moved. | 10 | Clear recovery explanation |
| Return home | 2 | Result-naming action |

The paid claim checks only observable price, checkout, and license behavior. Terms makes no merchant-of-record, refund, learning-measurement, or recall-guarantee claim. Both 404 implementations use the same literal h1.

## README review

The README now starts with the ordinary study task before implementation details. Technical storage, encryption, and license-key information are grouped under **Technical details**. No README sentence exceeds 22 words.

## Terminology

| Concept | One word or phrase |
|---|---|
| Study prompt and answer key | card |
| Group of cards | deck |
| Scored study attempt | review |
| What the learner types | typed answer |
| Scoring key | answer key |
| Scheduled return | next review date |
| Isolated sample workspace | demo |
| Paid one-time tier | Recall Anchor Desk license |

## Privacy and removal review

| Copy | Words | Result |
|---|---:|---|
| Remove cards from the Cards page. | 6 | `card-removal-retention` |
| Past review rows stay in Review CSV exports. | 8 | `card-removal-retention` |
| Use your browser’s site-data controls to remove cards, reviews, demo changes, licenses, and cached app files. | 17 | `local-data-deletion` |
| Remove “card”? Its past review rows stay in exports. | 9 | `card-removal-retention` |
| Card removed. Past review rows were kept. | 7 | `card-removal-retention` |

The clearing instruction names each tested storage category. The removal wording states both outcomes at the destructive action.

Catalog description: “Score flashcards from typed answers and set the next review date.” (65 characters, verb-first)
