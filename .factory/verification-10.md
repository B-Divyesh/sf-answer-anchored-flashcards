# Independent product verification 10 — PASS

Verified on 2026-08-29 UTC from a clean checkout of candidate `0e671d83dfe559fa9b3c3fd13e1f718f64ffe2bc`.

- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact: local-first offline PWA
- Result: **PASS — release candidate accepted**
- Product-code changes in this work order: none

## First-read and sample-data gate

**PASS.** A cold desktop visit confirmed that the first screen answers all three required questions in plain words:

- What it does: “Score flashcards from typed answers.”
- Who it serves: “For people studying alone who want the next review date based on an answer, not a guessed rating.”
- What to click first: **Try it with sample data**, followed by “Three due cards open next.”

Checked that the primary action opens the working demo in one click. The next screen contains three due sample cards and a persistent “Demo — sample data, nothing is saved to your cards” banner with **Reset demo** and **Start for real**. Checked at 390 × 844 that the headline, audience sentence, action, outcome, and all three offline/privacy/price facts remain in the first screen.

Evidence: [first-read output](verification-10-evidence/first-read.txt), [cold desktop capture](verification-10-evidence/live-cold-desktop.png), and [mobile capture](verification-10-evidence/verify-live/screenshot-mobile.png).

## Required claims

`.factory/claims.json` exists. Checked that all 16 claim IDs have exactly one matching `@claim:<id>` test. Ran every listed command independently after `npm ci`; all exited 0.

| Claim | Result | Confirmed behavior |
|---|---|---|
| `offline-reload` | PASS | Offline reload, review, stored result, and review CSV |
| `answer-types` | PASS | Exact text, numeric tolerance, and checklist scoring |
| `interval-reason` | PASS | Typed answer, confidence effect, and next-interval explanation |
| `csv-export` | PASS | Review CSV headers and sample rows |
| `anki-export` | PASS | Six Anki fields and three card rows |
| `encrypted-backup` | PASS | Encrypted envelope, valid restore, and unchanged data after malformed content |
| `demo-isolation` | PASS | Demo cards do not enter the real collection |
| `demo-sample` | PASS | One-click sample opens three due cards in the demo namespace |
| `demo-reset` | PASS | Sample resets while a real card remains unchanged |
| `local-privacy` | PASS | Study and passphrase data remain on origin; no analytics requests |
| `keyboard-review` | PASS | 390 px keyboard review completes with `Ctrl+Enter` |
| `exact-normalization` | PASS | Case, Unicode composition, and repeated spaces normalize correctly |
| `free-limit` | PASS | Repeat submission remains single and concurrent tabs stop at 30 cards |
| `paid-desk` | PASS | Live $19 catalog entry, hosted checkout, valid-license UI, unlimited cards, and trends |
| `license-network` | PASS | Sociobot requests occur only for documented license events |
| `license-revocation` | PASS | An inactive license returns to free limits while exports remain available |

Evidence: [claim summary](verification-10-evidence/claims-summary.txt), [registration check](verification-10-evidence/claim-registration.txt), and the individual `claim-*.txt` logs in the same directory.

## Clean-checkout gates

| Check | Result | Evidence |
|---|---|---|
| Locked dependency install | PASS | `npm ci`; 22 packages installed, no install error |
| Full local suite | PASS | `npm test`; 43/43 passed |
| Type check | PASS | `npm run typecheck`; `tsc --noEmit` passed |
| Lint | N/A | No lint script or linter is configured |
| Exact production build | PASS | `npm run build`; `dist/` produced |
| Dependency review | PASS | `npm audit --audit-level=low`; 0 findings |
| Full live suite | PASS | `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test`; 43/43 passed |

Evidence: [local suite](verification-10-evidence/npm-test.txt), [type check](verification-10-evidence/typecheck.txt), [build](verification-10-evidence/build.txt), [dependency review](verification-10-evidence/npm-audit.txt), and [live suite](verification-10-evidence/live-npm-test.txt).

## Independent functional checks

- Confirmed an end-to-end keyboard-only path at 390 px: Tab reached the sample action, Enter opened the demo, Tab reached the answer, an arrow key selected confidence, and `Ctrl+Enter` produced a 100% result.
- Checked visible focus on the sample action: 3 px solid vermilion outline.
- Confirmed required-answer, required-confidence, and required-prompt validation, followed by successful correction.
- Confirmed that a one-item checklist reports its two-item requirement and saves after a second item is supplied.
- Checked numeric boundaries: `100 ± 5` scores `105` at 100% and `105.01` at 0%.
- Confirmed that a wrong backup passphrase leaves all three sample cards present, then the correct passphrase restores successfully.
- Confirmed exact-text Unicode normalization, checklist whole-item matching, single-review recording, multi-tab card merging, and the concurrent 30-card limit through the full suites.
- Checked route history: Back and Forward restore scroll, focus the route heading, and update the polite route announcement.
- Crawled every rendered link. Internal routes, metadata files, icons, the external factory link, and the hosted checkout responded as expected; the designed unknown route returned HTTP 404.

Evidence: [independent flow output](verification-10-evidence/independent-flows.txt), [390 px result](verification-10-evidence/live-keyboard-result-390.png), and [link crawl](verification-10-evidence/link-crawl.txt).

## Accessibility and responsive presentation

- Confirmed one `h1`, one `main`, `lang=en`, route-specific titles, image alternatives, and named controls on `/`, `/demo`, `/study`, `/cards`, `/privacy`, `/terms`, and the designed 404.
- Checked the live routes with Playwright axe in light and dark modes. There were no serious or critical findings.
- Confirmed the required URL verification script reports one `h1`, a main landmark, title, language, image alternatives, named buttons, and no page or console errors on the home page.
- Checked all visible links, buttons, summaries, inputs, selects, and text areas on the principal routes at 390 px. None measured below 44 × 44 CSS px, and no route had horizontal overflow.
- Checked all principal routes after a 200% root text-size change. Headings and controls remained visible with no horizontal overflow.
- Confirmed the reduced-motion preference changes animation and transition durations to `0.01ms`.
- Checked desktop and 390 px captures against the product-specific printed-workbook visual thesis. The asymmetrical layout, paper palette, ruled fields, and answer-evidence hierarchy are present and usable in both sizes.

The only console line during the route sweep was the browser's expected resource-status message for the deliberate HTTP 404 document. All normal routes and exercised product flows had no console or page errors.

Evidence: [route semantics and console check](verification-10-evidence/route-semantics-console.txt), [URL verification](verification-10-evidence/verify-url.txt), [mobile target check](verification-10-evidence/mobile-targets-reflow.txt), and [200% text check](verification-10-evidence/text-resize.txt).

## Privacy, headers, and request boundaries

- Confirmed that a complete live demo review and CSV export requested only the product origin. The typed answer did not appear in any outgoing URL or request body.
- Confirmed that the cold landing page requested only its own HTML, JavaScript, CSS, and hero image. No analytics, remote font, or third-party runtime script request occurred.
- Checked source and runtime behavior: study records use IndexedDB, demo data uses `recall-anchor-demo`, and license data uses namespaced localStorage. The only configured external runtime connection is `https://api.sociobot.in` for explicit license activity.
- Confirmed live response headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a camera/microphone/location permissions policy, and a content policy limited to same-origin resources plus the documented Sociobot license origin.
- Confirmed that hashed JavaScript and CSS return `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and service worker use 30-second revalidation.
- Checked the Sociobot license-verification request allowance with 40 requests from one client. Requests 1–30 returned HTTP 200 invalid-license verdicts. Requests 31–40 returned HTTP 429, each with `Retry-After`; observed values were 2–3 seconds. Observed allowance: **30 requests per client window**.
- The product has no sign-in and no product backend. Entra authority, backend persistence, and backend health/build checks are not applicable.

Evidence: [request log](verification-10-evidence/independent-flows.txt), [response headers](verification-10-evidence/response-headers.txt), and [allowance output](verification-10-evidence/license-allowance.txt).

## PWA and deployment identity

- Confirmed an active service-worker controller on the live demo, then enabled browser offline mode and reloaded. The sample review remained usable and displayed “You are offline. Review and export still work.”
- Checked the candidate's update path: a changed service-worker version displayed “A new version is ready,” **Update now** activated it, and the controlled page reloaded with no waiting worker.
- Confirmed a standalone manifest with versioned start URL `/?v=1.0.5`, matching theme/background colors, 192 px and 512 px icons, and a maskable 512 px icon. The social asset is 1200 × 630 and the Apple icon is 180 × 180.
- Compared candidate `dist/` with live responses. `index.html`, hashed JavaScript, hashed CSS, `sw.js`, `manifest.webmanifest`, `offline.html`, `404.html`, and the mobile hero are byte-for-byte identical by SHA-256.

Evidence: [PWA manifest](verification-10-evidence/pwa-manifest.txt), [image dimensions](verification-10-evidence/image-dimensions.txt), [candidate/live hashes](verification-10-evidence/live-candidate-hashes.txt), and the PWA check in the local/live suite logs.

## Performance

- Production JavaScript: 35,796 B raw / 11,986 B gzip (budget ≤ 200 KB).
- Production CSS: 18,644 B raw / 5,021 B gzip (budget ≤ 50 KB).
- Mobile hero: 79,516 B (budget ≤ 300 KB). No web-font download occurs.
- Final Lighthouse mobile: performance 96, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, CLS 0, speed index 0.9 s, interactive 1.4 s. Four successful runs scored 85, 91, 96, and 96; median performance was 93.5.
- A 4× CPU-throttled Event Timing check recorded 24–88 ms across five interactions, with a 72 ms median (budget < 200 ms).

Evidence: [bundle sizes](verification-10-evidence/bundle-sizes.txt), [initial Lighthouse summary](verification-10-evidence/lighthouse-summary.txt), [repeat Lighthouse summary](verification-10-evidence/lighthouse-reruns.txt), [final Lighthouse summary](verification-10-evidence/lighthouse-final-summary.txt), and [event timing](verification-10-evidence/event-timing.txt).

## Contract and claims review

Checked the live landing page, application routes, README, `.factory/demo.md`, and `.factory/copy-audit.md` against `.factory/claims.json`. Every retained product promise maps to an observable claim test or is a legal/instructional statement. No unlisted product claim was found.

Confirmed that the brief's smallest useful product is present: exact, numeric, and checklist cards; answer capture before reveal; confidence and rubric evidence; interval explanation; CSV and Anki-field exports; encrypted backup/restore; Unicode handling; local-first storage; and offline use. Card generation, hosted decks, and learning diagnosis remain outside scope. No extra AI feature is implied by the task, and adding one would not improve the required answer-first scoring loop.

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Acceptance decision

**PASS.** Candidate `0e671d83dfe559fa9b3c3fd13e1f718f64ffe2bc` is the artifact deployed at the tested URL and satisfies the original work order, researched brief, and factory acceptance contract.
