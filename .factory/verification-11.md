# Independent product verification 11 — FAIL

Verified on 2026-08-29 UTC from candidate `79bb74e40c134b95d5b46a2e4d950f43f01ad5e2`.

- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact: local-first offline PWA
- Result: **FAIL — do not release this candidate**
- Product-code changes in this work order: none

The candidate and deployment are healthy in most respects, and every declared claim test passes. Release remains blocked because an accepted numeric answer is shown as missing on the evidence screen, contradicting the 100% score and resulting interval. The paid Terms page also omits disclosures required by the paid-unlock contract.

## Mandatory first-read and demo gate

**PASS.** A cold 1440 × 900 visit answered the required questions in the first screen:

- What: “Score flashcards from typed answers.”
- For whom: “For people studying alone who want the next review date based on an answer, not a guessed rating.”
- First action: **Try it with sample data**, with “Three due cards open next.”

The same screen shows the offline, local-storage, and free-plan facts. One click opened isolated demo mode with three due cards and the persistent **Demo — sample data, nothing is saved to your cards** banner, **Reset demo**, and **Start for real**. The action and all three facts also fit at 390 px.

Evidence: [cold-page record](verification-11-evidence/first-read.json), [desktop capture](verification-11-evidence/live-cold-desktop.png), and [mobile capture](verification-11-evidence/verify-live/screenshot-mobile.png).

## Required claims

`.factory/claims.json` exists with 18 entries. After the locked install, every listed command was run separately and exactly; all exited 0. Each ID also has exactly one matching `@claim:<id>` tag.

| Claim | Result |
|---|---|
| `offline-reload` | PASS |
| `answer-types` | PASS |
| `interval-reason` | PASS |
| `csv-export` | PASS |
| `anki-export` | PASS |
| `encrypted-backup` | PASS |
| `demo-isolation` | PASS |
| `demo-sample` | PASS |
| `demo-reset` | PASS |
| `local-privacy` | PASS |
| `local-data-deletion` | PASS |
| `card-removal-retention` | PASS |
| `keyboard-review` | PASS |
| `exact-normalization` | PASS |
| `free-limit` | PASS |
| `paid-desk` | PASS |
| `license-network` | PASS |
| `license-revocation` | PASS |

The first pre-install invocation could not start because dependencies were absent (`tsc: not found`). This was setup state, not a post-install test failure. `npm ci` then installed the lockfile, and the complete 18-command matrix above passed. Evidence: [claim summary](verification-11-evidence/claims-summary.txt) and the individual `claim-*.txt` logs.

The green claim matrix has a material coverage gap: `answer-types` proves the numeric score heading, while `interval-reason` exercises only an exact-text card. Neither asserts the matched/missing state shown for an accepted numeric-tolerance answer. That gap allowed the core defect below to pass every declared claim.

## Clean-checkout gates

| Gate | Result | Evidence |
|---|---|---|
| Locked install | PASS — 22 packages, 0 vulnerabilities | [npm-ci.txt](verification-11-evidence/npm-ci.txt) |
| Full local suite | PASS — 46/46 | [npm-test.txt](verification-11-evidence/npm-test.txt) |
| Full live suite | PASS — 46/46 | [live-npm-test.txt](verification-11-evidence/live-npm-test.txt) |
| Type check | PASS — `tsc --noEmit` | [typecheck.txt](verification-11-evidence/typecheck.txt) |
| Lint | N/A — no lint script or linter is configured | `package.json` |
| Exact production build | PASS — `dist/` produced | [build.txt](verification-11-evidence/build.txt) |
| Dependency audit | PASS — 0 findings | [npm-audit.txt](verification-11-evidence/npm-audit.txt) |

## End-to-end and boundary checks

Passing behavior:

- Exact text accepted Unicode-composed `café` and showed recorded answer, confidence, and interval explanation.
- Numeric `299802` passed at the inclusive `299792 ± 10` edge; `299802.01` failed and returned in 10 minutes.
- Checklist input `earth` matched none of `claim`, `evidence`, or `reasoning`; substring false positives did not recur.
- Empty prompt, missing numeric answer, and negative tolerance each produced actionable validation; correcting the fields saved the card.
- CSV, Anki CSV, encrypted backup, valid restore, malformed restore preservation, demo reset/isolation, removal retention, multi-tab merge, and the concurrent 30-card limit passed in the full suites.
- A 390 px keyboard-only path reached the demo with Tab and Enter, selected confidence with Space, and scored with `Ctrl+Enter`. Focus used a visible 3 px outline. No visible target was below 44 × 44 px and no horizontal overflow appeared.

Failing behavior:

- On the numeric sample, answer `299802` correctly scores **100%** and schedules the next review in eight days, but the Answer key panel renders **`○ 299792 ± 10`** in the red `missing` state. The same screen says “The answer key passed.” This is directly contradictory evidence for the action that determines scheduling.

Reproduction: open `/?demo=1`; score `café`; review the next card; enter `299802`; select **Certain**; score. Evidence: [structured result](verification-11-evidence/numeric-evidence-and-offline.json) and [screen capture](verification-11-evidence/live-numeric-boundary-contradiction.png).

Independent validation and recovery evidence: [privacy and invalid-input probe](verification-11-evidence/privacy-invalid-recovery.json).

## Accessibility, responsive behavior, and errors

- Independent Playwright axe scans covered Home, Demo, Cards, Privacy, Terms, and 404 in both light and dark modes: 0 serious/critical findings.
- Every route had `lang=en`, one `h1`, one `main`, and a route-specific title. The URL verifier found no missing alt text, unnamed buttons, page errors, or console errors on Home.
- Normal routes and exercised flows emitted no console or page errors. Chromium logged only its expected failed-resource line for the deliberate HTTP 404 document.
- Reduced-motion mode computed 0.01 ms animation/transition durations and automatic scrolling. At 200% root text size, the 390 px page retained its heading and had no horizontal overflow.

Evidence: [independent route and layout checks](verification-11-evidence/independent-live-corrections.json), [reduced-motion and resize record](verification-11-evidence/reduced-motion-resize.json), [axe route sweep](verification-11-evidence/axe-routes.json), and [URL verifier](verification-11-evidence/verify-live/verify.json).

## Privacy, PWA, headers, and networking

- A live demo review, review CSV export, and encrypted-backup export requested only the product origin. No answer or passphrase appeared in a request body, and the AES-GCM envelope did not contain `café` in plaintext.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, denied camera/microphone/geolocation permissions, and CSP limited to same-origin resources plus the documented Sociobot license origin.
- Hashed JavaScript and CSS use `public, max-age=31536000, immutable`; HTML, manifest, and service worker revalidate after 30 seconds. Unknown routes return a real HTTP 404.
- The live service worker controlled the demo. Offline reload retained IndexedDB sample data, displayed the offline notice, and completed a 100% review. The update test changed the worker version, showed **A new version is ready**, activated **Update now**, and ended with an active worker and no waiting worker.
- The manifest is standalone with a versioned `/?v=1.0.6` start URL, 192/512 icons, and a maskable icon. The social image is 1200 × 630 and the Apple icon is 180 × 180.
- The product has no sign-in and no product backend. Entra, backend health, and backend persistence checks are not applicable.
- The Sociobot verification endpoint allowed 30 requests from one client. Requests 31–40 returned 429, each with `Retry-After: 4`.

Evidence: [privacy and invalid-input probe](verification-11-evidence/privacy-invalid-recovery.json), [offline and numeric probe](verification-11-evidence/numeric-evidence-and-offline.json), [deployment/header/link record](verification-11-evidence/deployment-headers-links.json), and [rate-limit record](verification-11-evidence/license-rate-limit.json).

## Paid flow

The live catalog lists the product at 1900 minor units. Checkout returns HTTP 303 to `checkout.dodopayments.com`, and the hosted page returns 200 with the Recall Anchor Desk product name.

The product Terms disclose the $19 one-time price, unlimited cards, trends, hosted checkout, and license requirement. They do **not** say that Sociobot/Dodo is merchant of record or where refunds are handled. `.factory/copy-audit.md` explicitly records that those statements were intentionally omitted. This violates the paid-unlock acceptance contract even though checkout itself works.

Evidence: [paid contract probe](verification-11-evidence/paid-contract.json).

## Deployment identity and performance

The deployed `index.html`, hashed JavaScript, hashed CSS, service worker, manifest, offline page, 404 page, and mobile hero are byte-for-byte identical to candidate `dist/` by SHA-256.

- JavaScript: 35,907 B raw / 12,017 B gzip.
- CSS: 18,644 B raw / 5,021 B gzip.
- Mobile hero: 79,516 B. No web font is downloaded.
- Fresh mobile Lighthouse: Performance 95, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, CLS 0, TBT 270 ms.
- Four-times CPU-throttled Event Timing: maximum observed interaction duration 56 ms.

Evidence: [bundle sizes](verification-11-evidence/bundle-sizes.txt), [Lighthouse summary](verification-11-evidence/lighthouse-summary.json), and [interaction timing](verification-11-evidence/interaction-timing.json).

## Findings by severity

### High — release blocking

1. **Accepted numeric answers are displayed as missing.** The core evidence screen contradicts its 100% score and interval, undermining the product’s answer-anchored scheduling promise. Render numeric tolerance matches as matched whenever the score accepts them, and add a regression/claim assertion for a non-exact value inside the tolerance.
2. **Mandatory paid legal disclosure is absent.** Add the contract-required merchant-of-record and refund-handling statement to Terms and cover the static disclosure in the paid claim test.

### Medium

3. **Claim coverage does not verify numeric result evidence.** Existing tests assert the numeric score but not the matched/missing marker, so the declared claims remain green while the user-facing evidence is wrong.

No additional low-severity finding was identified.

## Acceptance decision

**FAIL.** Do not release candidate `79bb74e40c134b95d5b46a2e4d950f43f01ad5e2`. Reverify after the numeric result state and paid Terms disclosure are corrected and protected by tests.
