# Recall Anchor independent product QA — FAIL

Verified on 2026-08-29 UTC from a clean detached checkout.

- Candidate commit: `d1a4b11214be7991d459dac02bdd71b364b76dff`
- Candidate tree: `e950dd48e63018762b71ad6e6feefa18544ff564`
- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Demo entry: <https://answer-anchored-flashcards.sociobot.in/?demo=1>
- Decision: **FAIL**

## Release decision

Check that the deployed application is the requested candidate. This check fails: the clean candidate build references `assets/index-3otriggV.js`, while the live HTML references `assets/index-C1R0E4zc.js`. The live root response had ETag `"77438053"` and `Last-Modified: Sat, 29 Aug 2026 09:07:48 GMT`. A candidate cannot be accepted when the tested live application is a different build.

Confirm one additional candidate recovery finding. The candidate accepts a correctly encrypted backup whose decrypted `cards` array contains `{}`. After confirming replacement and reloading Cards, the local candidate page has zero `h1` elements, an empty body, and the browser reports `Invalid time value`. The pre-existing collection is replaced. This is a high-severity data-recovery defect.

Check the candidate Terms copy against the paid-license contract. It says that Sociobot hosts checkout, but it does not identify Sociobot/Dodo as merchant of record or state that refunds are handled there. This is a medium-severity documentation defect.

## Mandatory first checks

### First-read check — PASS

Confirm that a cold live visit explains the job, audience, and first action in plain words:

- What it does: “Score flashcards from typed answers.”
- Who it serves: “For people studying alone who want the next review date based on an answer, not a guessed rating.”
- What to click first: “Try it with sample data.”
- What happens next: “Three due cards open next.”

Check that the required one-click sample action is present on the first screen. It opens `/?demo=1`; the live demo shows sample cards and the persistent Demo banner with Reset demo and Start for real.

### Claim checks — PASS, 16/16

Confirm that `.factory/claims.json` exists. It contains 16 entries. Run every exact declared command independently after `npm ci`; every command selected and passed its tagged check.

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

Check the gap in encrypted-backup coverage. The registered check confirms a valid backup round trip, but it does not confirm field-level validation of decrypted records. The focused recovery check above demonstrates why that additional coverage is required.

## Clean checkout and quality checks

Confirm dependency installation with `npm ci`: PASS, 22 packages installed and npm reported 0 known vulnerabilities.

| Check | Result | Evidence |
|---|---|---|
| Confirm all repository tests | PASS | `npm test`: 41/41 passed on a clean rerun |
| Confirm TypeScript checks | PASS | `npm run typecheck` |
| Confirm the production build | PASS | `npm run build`; `dist/index.html` exists |
| Check for a lint command | N/A | package scripts define no lint command |
| Check initial JavaScript budget | PASS | 34,215 bytes raw; 11,542 bytes gzip |
| Check CSS budget | PASS | 18,644 bytes raw; 5,010 bytes gzip |

Confirm the end-to-end paths exercised by the passing suite: all three answer types; answer evidence and interval explanation; case, Unicode-normalization, and whitespace handling; demo reset and real/demo separation; CSV and Anki downloads; encrypted valid-backup restore; persistence; concurrent card additions; the 30-card boundary; license state; offline reload; and service-worker update activation.

Check invalid and recovery behavior separately. Native required-field handling covers an empty form, and the candidate explains missing backup files and incorrect passphrases. The malformed decrypted-record recovery check fails as described in the release decision.

## Accessibility, responsive, and PWA checks

Confirm repository accessibility checks: the 41-test suite reports no serious or critical axe findings on its tested routes and themes. Confirm the candidate keyboard-review claim at 390 px: it passes by entering an answer, selecting confidence, and completing the review with `Ctrl+Enter`.

Check the live routes `/`, `/demo`, `/cards`, `/privacy`, `/terms`, and an unknown URL at 390 px in dark reduced-motion mode. Home, Demo, Cards, Privacy, and Terms each return 200, have one h1, no serious or critical axe findings, no controls below 44 px, no horizontal overflow, and no normal-route console or page errors. The unknown URL returns the designed 404 page; its expected 404 resource message is the only console entry on that route.

Confirm reduced-motion behavior on the live demo: `prefers-reduced-motion` matches, and no running document animations were reported.

Check PWA behavior through the candidate tests. The offline-reload claim passes after service-worker control, including offline review and CSV download. The update test passes after a changed service-worker cache name presents Update now and activates the new worker. The manifest check passes for standalone display, versioned start URL, icons, and product colors.

## Privacy, headers, cache, and request allowance

Confirm the live demo outgoing-request log while scoring an answer, exporting Anki CSV, and exporting an encrypted backup. The log contains only the product document, its CSS, and its JavaScript; all are same-origin. No request body contains the supplied backup passphrase, and there are no console or page errors.

Check browser response headers. The live root includes a restrictive content policy, HSTS, strict-origin referrer policy, `X-Content-Type-Options: nosniff`, and a permissions policy that denies camera, microphone, and geolocation. Check cache behavior: live hashed JavaScript and CSS return `public, max-age=31536000, immutable`; HTML and `sw.js` return `public, must-revalidate, max-age=30`.

Confirm the product-license verification allowance from one client. Forty fresh verification requests produced 30 HTTP 200 responses, then 10 HTTP 429 responses. Each 429 response included `Retry-After` (3 seconds for responses 31–36 and 2 seconds for responses 37–40). The observed allowance is 30 requests per active window.

Check applicability. The product has no sign-in, library package, CLI, or application backend. The only remote product flow is the Sociobot checkout/license verification flow, whose allowance is confirmed above.

## Findings by severity

### Release-blocking — QA7-00: live deployment differs from the candidate

Check the candidate asset name against the live asset name: `index-3otriggV.js` versus `index-C1R0E4zc.js`. Confirm that this is a build-identity difference, not caching: the live asset has a different filename and byte size (35,971 bytes) from the candidate output (34,215 bytes). Deploy the requested candidate or verify the later live commit separately.

### High — QA7-01: malformed decrypted records can replace a collection

Confirm the candidate recovery sequence:

1. Add a valid exact card named “Collection that must survive.”
2. Import a correctly encrypted version-1 backup whose decrypted content is `{"cards":[{}],"reviews":[]}`.
3. Confirm the replacement prompt and reload Cards.

The candidate stores the malformed record, then fails to render after reload with `Invalid time value`. Check `src/backup.ts`: it only confirms that `cards` and `reviews` are arrays. Check `src/main.ts`: it stores the returned object after confirmation without validating individual card and review fields.

Required correction: validate every decrypted card and review before showing the replacement confirmation or writing storage. If validation fails, retain the existing collection and show a plain recovery message. Add this recovery case to the encrypted-backup claim check.

### Medium — QA7-02: Terms omit required purchase disclosures

Check the candidate Terms page and `termsPage()` copy. It omits the required merchant-of-record and refund-handling statements for the one-time paid license.

Required correction: state that Sociobot/Dodo is merchant of record and that refund handling occurs there.

## Final decision

**FAIL. Do not release candidate `d1a4b11214be7991d459dac02bdd71b364b76dff`.** Confirm acceptance only after the decrypted-record recovery path is validated, the paid Terms disclosures are complete, and the deployed files match the candidate being accepted.
