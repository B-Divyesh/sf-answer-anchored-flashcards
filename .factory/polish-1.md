# Polish round 1 — review finding closure

Commit repaired: `f03d199b3f5fc2a60b26e10f67c4d2825b7c4069`. Live check: 2026-08-29 UTC at <https://answer-anchored-flashcards.sociobot.in>. The production browser run passed 38/38 tests. Screenshots: `.factory/polish-1-home-390.png`, `.factory/polish-1-demo-390.png`, and `.factory/polish-1-404-1440.png`.

In the evidence table, **home screenshot** means `.factory/polish-1-home-390.png`, **demo screenshot** means `.factory/polish-1-demo-390.png`, and **404 screenshot** means `.factory/polish-1-404-1440.png`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Moved facts ahead of the hero art and tightened the hero so all three fit at 390 and 1440. | `all three landing facts fit in the first screen on phone and desktop`; home screenshot; live `/` passed. |
| F-1-2 | Offline claim now scores a sample card and downloads review CSV while offline. | `@claim:offline-reload`; demo screenshot; live `/?demo=1` passed. |
| F-1-3 | Added reset coverage proving sample restoration and real-card isolation. | `@claim:demo-reset`; demo screenshot; live `/?demo=1` passed. |
| F-1-4 | Paid claim checks price, 303 checkout redirect, hosted one-time text, and unlock. | `@claim:paid-desk`; home screenshot; live `/` passed. |
| F-1-5 | Removed the localStorage key from the public README contract. | README copy audit; home screenshot; live `/` passed. |
| F-1-6 | Added recorded-request coverage for no-license, explicit, returned, and stale-cache flows. | `@claim:license-network`; demo screenshot; live `/privacy` passed. |
| F-1-7 | Removed the unsupported merchant-of-record statement. | Terms copy audit; home screenshot; live `/terms` passed. |
| F-1-8 | Removed the unsupported refund-handling statement. | Terms copy audit; home screenshot; live `/terms` passed. |
| F-1-9 | Added revoked-license relock coverage while retaining free exports. | `@claim:license-revocation`; home screenshot; live `/terms` passed. |
| F-1-10 | Replaced jargon help and added accent/case/space normalization coverage. | `@claim:exact-normalization`; demo screenshot; live `/?demo=1` passed. |
| F-1-11 | Rewrote compatibility wording to concrete Anki-formatted CSV fields. | `@claim:anki-export`; demo screenshot; live `/cards?demo=1` passed. |
| F-1-12 | Removed the untestable product-boundary sentence. | Landing copy audit; home screenshot; live `/` passed. |
| F-1-13 | Replaced visible evidence/rubric/interval language with typed answer, answer key, and next review date. | Copy audit; home screenshot; live `/` passed. |
| F-1-14 | Replaced decorative three-step headings with task-complete headings. | Copy audit; home screenshot; live `/` passed. |
| F-1-15 | Replaced privacy slogans with clear storage/privacy headings. | Copy audit; home screenshot; live `/` passed. |
| F-1-16 | Replaced metaphoric pricing language and standardized Recall Anchor Desk license. | Copy audit; home screenshot; live `/` passed. |
| F-1-17 | Rewrote README introduction and moved implementation details under Technical details. | Copy audit; home screenshot; live `/` passed. |
| F-1-18 | Replaced the dead visual-notes reference with direct generated-image provenance. | Live browser footer check; home screenshot; live `/` passed. |
| F-1-19 | `setMeta()` updates canonical, OG, and Twitter metadata for every route. | `every app route updates canonical, Open Graph, and Twitter metadata`; demo screenshot; live routes passed. |
| F-1-20 | Rebuilt static 404 with shared shell, metadata, skip link, legal navigation, and version 1.0.3. | `static host policy serves real 404s and immutable hashed assets`; 404 screenshot; live unknown route returned 404. |

Screenshot paths above are `.factory/polish-1-home-390.png`, `.factory/polish-1-demo-390.png`, and `.factory/polish-1-404-1440.png`. No review finding remains open.
