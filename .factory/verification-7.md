# Recall Anchor independent product QA — FAIL

Verified on 2026-08-29 UTC.

- Candidate commit: `d1a4b11214be7991d459dac02bdd71b364b76dff`
- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Demo entry: <https://answer-anchored-flashcards.sociobot.in/?demo=1>
- Decision: **FAIL**
- Release-blocking findings: **1**
- High-severity findings: **1**
- Medium-severity findings: **1**
- Low-severity findings: **2**

The candidate is not acceptable. Its encrypted-import path accepts invalid decrypted records, replaces the valid collection, and leaves an empty page after reload. The candidate Terms page also omits required purchase disclosures. During QA, the live site changed to a later build and no longer matched the candidate.

## Mandatory first checks

### First-read check — PASS

Confirm that a cold visitor can identify the product from the first screen:

- What it does: “Score flashcards from typed answers.”
- Who it serves: people studying alone who want a review date based on an answer.
- What to click first: “Try it with sample data.”
- What happens next: “Three due cards open next.”

Check that the first screen shows the three required facts: offline use after the first visit, browser-local cards, and the free 30-card allowance. All three fit inside the first 844 px at 390 px width and inside the first 900 px at 1440 px width.

Check that the primary action opens the isolated demo in one click. It opens `/?demo=1`, shows three due cards immediately, and displays the persistent sample-data banner with **Reset demo** and **Start for real**.

### Claim checks — PASS, 16/16

Confirm that `.factory/claims.json` exists and contains 16 entries. Each exact command was run independently from the candidate checkout; every command passed one matching test.

| Claim id | Exact check | Result |
|---|---|---|
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `answer-types` | `npm test -- --grep @claim:answer-types` | PASS |
| `interval-reason` | `npm test -- --grep @claim:interval-reason` | PASS |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS |
| `anki-export` | `npm test -- --grep @claim:anki-export` | PASS |
| `encrypted-backup` | `npm test -- --grep @claim:encrypted-backup` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `demo-sample` | `npm test -- --grep @claim:demo-sample` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `local-privacy` | `npm test -- --grep @claim:local-privacy` | PASS |
| `keyboard-review` | `npm test -- --grep @claim:keyboard-review` | PASS |
| `exact-normalization` | `npm test -- --grep @claim:exact-normalization` | PASS |
| `free-limit` | `npm test -- --grep @claim:free-limit` | PASS |
| `paid-desk` | `npm test -- --grep @claim:paid-desk` | PASS |
| `license-network` | `npm test -- --grep @claim:license-network` | PASS |
| `license-revocation` | `npm test -- --grep @claim:license-revocation` | PASS |

Evidence: [`claims-summary.json`](verification-7-evidence/claims-summary.json).

Check that the passing `encrypted-backup` claim covers a valid backup but does not cover invalid decrypted record structure. The independent recovery check below therefore finds a gap outside that registered test.

## Clean checkout and build checks

Confirm that the starting tree was clean, then check out the exact candidate in detached mode.

| Check | Result | Evidence |
|---|---|---|
| Confirm dependency installation | PASS | `npm ci`; 22 packages installed; 0 vulnerabilities |
| Confirm all unit and browser tests | PASS | `npm test`; 41/41 passed in Chromium and the 390 px project |
| Confirm TypeScript checks | PASS | `npm run typecheck` |
| Confirm the exact production build | PASS | `npm run build`; `dist/index.html` produced |
| Check for a repository lint command | N/A | No lint script is defined |
| Confirm dependency review | PASS | `npm audit --audit-level=low`; 0 vulnerabilities |

Confirm bundle size after the exact candidate build:

- JavaScript: 34,215 bytes raw; 11,519 bytes gzip.
- CSS: 18,644 bytes raw; 5,021 bytes gzip.
- Mobile hero: 79,516 bytes.
- Lighthouse transfer total observed before the live update: 99,851 bytes.

All are within the stated static-product budgets.

## End-to-end product checks

Confirm the normal and boundary paths:

- Exact text: `café`, uppercase decomposed accents, and extra spaces score correctly.
- Numeric tolerance: both inclusive edges, `299782` and `299802`, score 100%; `299781` scores 0%.
- Checklist recall: two of three points scores 67% and names the missing point.
- Evidence: the typed answer, confidence, matched items, missing items, prior interval, next interval, and explanation appear after scoring.
- Exports: review CSV has the required fields and one row per review; the Anki CSV has six fields and three sample-card rows.
- Demo state: reset restores three cards and two reviews without changing a real card; leaving the demo opens the real namespace.
- Persistence: a real card survives reload; concurrent tabs retain both additions; simultaneous additions stop at 30 cards.

Check ordinary invalid input and recovery paths:

- An empty review shows the browser’s required-field message.
- A one-item checklist explains that at least two items are required; adding the second item then saves the card.
- Import without a file explains that a Recall Anchor backup must be selected.
- A wrong passphrase explains what to check; entering the correct passphrase then restores a valid backup.

Check invalid decrypted record structure separately. This check fails on the candidate and is detailed as QA7-01.

Evidence: [`manual.json`](verification-7-evidence/manual.json) and [`candidate malformed-backup result`](verification-7-evidence/candidate-malformed-backup.json).

## Accessibility and responsive checks

Confirm semantic structure on Home, Demo, Privacy, and Terms with the supplied URL verifier. Each route returned 200 with a descriptive title, `lang=en`, one h1, a main landmark, zero missing image alternatives, zero unnamed buttons, and zero normal-route console or page errors.

Confirm automated accessibility checks:

- Standalone axe 4.10.3: 0 violations on Home, Demo, Privacy, and Terms.
- Repository Playwright checks: no serious or critical findings on six routes in light mode and six routes in dark mode.
- The scored-result state also has no serious or critical findings in dark mode.

Confirm keyboard-only review at 390 px. The answer field accepts typing, Tab reaches the confidence choices, Arrow selects a choice, Tab reaches the score button, and Enter completes the review. The result was 100% and no keyboard trap appeared.

Check that keyboard focus is visible. The skip link becomes visible with a 3 px outline; text fields, radio choices, links, and buttons show designed focus treatment.

Check that touch targets and layout work at 390 px. Visible controls meet the 44 px target check, the document width stays at 390 px, and the review form and result do not overflow.

Check that text enlarged to 200% remains available on Home, Demo, Cards, Privacy, and Terms. At a 390 px layout viewport with a 32 px root font, headings and controls remain present with no horizontal overflow.

Confirm reduced motion. The result animation and transitions resolve to `0.01 ms`, with no looping or flashing content.

Evidence: [`axe-summary.json`](verification-7-evidence/axe-summary.json), [`manual.json`](verification-7-evidence/manual.json), [`root desktop`](verification-7-evidence/root/screenshot-desktop.png), [`root mobile`](verification-7-evidence/root/screenshot-mobile.png), and [`dark mobile demo`](verification-7-evidence/demo-dark-mobile.png).

## Privacy, requests, and response headers

Confirm the live demo request log while scoring, exporting CSV, and creating an encrypted backup. Three requests occurred, all to the product origin. No typed answer, card data, or backup passphrase was sent elsewhere. No analytics request was observed.

Check that license requests occur only after an explicit license action, a returned license, or a saved-license refresh. The registered check passes for all three conditions, and no license request occurs without one of them.

Confirm browser response headers include the expected content policy, transport policy, strict-origin referrer policy, `nosniff`, and denied camera, microphone, and geolocation permissions.

Evidence: [`network.json`](verification-7-evidence/network.json).

Confirm the license-verification request allowance from one client. In a 40-request burst completed in 414 ms, the first 30 responses were HTTP 200 and the next 10 were HTTP 429. Every sampled 429 included `Retry-After: 4`. The observed allowance is 30 requests in the active window.

Evidence: [`request-allowance.json`](verification-7-evidence/request-allowance.json).

## PWA and offline checks

Confirm that the manifest contains a versioned start URL, standalone display, product colors, 192 px and 512 px icons, a maskable icon, and app shortcuts.

Confirm service-worker behavior. The offline claim loaded the demo once, waited for control, disabled networking, reloaded, scored a card, opened Cards, and exported review CSV. The check passed.

Confirm update behavior. The service-worker test installed a changed cache version, showed the update notice, selected **Update now**, reloaded, and confirmed the new worker was active.

Check caching. HTML, the manifest, and `sw.js` use `public, must-revalidate, max-age=30`. Hashed JavaScript and CSS use `public, max-age=31536000, immutable`.

## Deployment identity and routes

Confirm deployment identity twice because the live site changed during QA:

- At 08:59 UTC, the candidate’s 16 public files matched the live deployment byte for byte.
- At 09:10 UTC, the live page referenced `/assets/index-C1R0E4zc.js`, while the candidate builds `/assets/index-3otriggV.js`.
- The candidate JavaScript SHA-256 is `4a37cca31c01cde2df2112698b01b6ae51ea972be130b9ba69be2a1aa2518469`.
- The final live JavaScript SHA-256 is `8f5f9fe1490df55c88636a300f684482b6420e83f1301d1a595b8876cadef450`.
- The final live HTML reports `Last-Modified: Sat, 29 Aug 2026 09:07:48 GMT`.

The current live deployment does not match the specified candidate. The current live build safely rejects the invalid decrypted record used for QA7-01 and contains the missing Terms statements, showing it is a later build.

Evidence: [`deployment-match.txt`](verification-7-evidence/deployment-match.txt) and [`terms-comparison.json`](verification-7-evidence/terms-comparison.json).

Check all links found across Home, Demo, Study, Cards, Privacy, and Terms. All internal routes returned 200, the hosted checkout returned its expected 303, the factory link returned 200, and the email link used `mailto:`. An unknown live URL returned the designed page with HTTP 404.

## Performance checks

Confirm the fresh mobile Lighthouse run made before the live update:

- Performance: 97
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- LCP: 1,427 ms
- Total blocking time: 182 ms
- CLS: 0
- Total transfer: 99,851 bytes

Check representative score interaction latency with 4× CPU slowdown. The answer-to-result update completed in 41 ms, below the 200 ms interaction budget. Lighthouse does not report field INP for a fresh one-load run.

Evidence: [`lighthouse-summary.json`](verification-7-evidence/lighthouse-summary.json).

## Applicability checks

Check that no product sign-in exists; the identity-provider requirement does not apply.

Check that this is not a library or CLI; consumer-package checks do not apply.

Check that the product has no application backend. The only server-side product call is the Sociobot license flow, whose request allowance is verified above.

## Findings by severity

### Release-blocking — QA7-00: the final live deployment is not the candidate

Confirm the live file identity after all tests. The live JavaScript path and SHA-256 differ from the candidate values. The current live site contains behavior and Terms text absent from the candidate. Candidate acceptance requires the tested commit and live deployment to match.

### High — QA7-01: invalid decrypted backup data replaces a valid collection

Confirm this on the exact candidate production build:

1. Save a valid exact card named “Collection that must survive.”
2. Create a correctly encrypted version-1 backup whose decrypted content is `{"cards":[{}],"reviews":[]}`.
3. Import it with the correct passphrase.
4. Accept the replacement prompt and reload `/cards`.

Observed candidate result: the replacement prompt reports one card and zero reviews, the invalid record is saved, and reload shows an empty body with zero h1 elements. The browser reports `Invalid time value`, and the original card is no longer available through the product.

Required correction: validate every decrypted card and review field before confirmation or storage. If validation fails, explain that the backup data is invalid and preserve the current collection. Add the recovery case to the encrypted-backup claim test.

Evidence: [`candidate-malformed-backup.json`](verification-7-evidence/candidate-malformed-backup.json).

### Medium — QA7-02: candidate Terms omit required purchase disclosures

Confirm the candidate `/terms` page. It does not identify Sociobot/Dodo as merchant of record and does not state that refunds are handled there. Both statements are required by the paid-license contract.

Evidence: [`terms-comparison.json`](verification-7-evidence/terms-comparison.json).

### Low — QA7-03: backup help text touches the control row

Check the Cards page at 1440 px and 390 px. The backup-passphrase help line begins 7–10 CSS pixels before the adjacent input/button row ends, so the text crosses the control edge. The text remains readable, and export/import remain operable.

Evidence: [`cards-desktop.png`](verification-7-evidence/cards-desktop.png).

### Low — QA7-04: one palette token is documented under a different role

Check `.factory/design.md` against `src/style.css`. The design note names `#d9432f` as the main vermilion action color, while the candidate uses `#b93626` for primary actions and `#d9432f` for the brighter focus treatment. The implemented colors pass the checked contrast rules, but the token record should describe these roles exactly.

## Final decision

**FAIL. Do not release candidate `d1a4b11214be7991d459dac02bdd71b364b76dff`.** The candidate loses access to the current collection after accepting invalid decrypted backup records, omits required paid Terms text, and no longer matches the final live deployment.
