# Independent product verification 12 — PASS

Verified on 2026-08-29 UTC from clean commit `9b40406d8aa0da742bba45d7dfd30b4898b0577e`.

- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact: local-first offline PWA
- Result: **PASS — release candidate accepted**
- Product-code changes in this work order: none

## First-read and demo gate

**PASS.** A cold desktop visit said, in plain words, “Score flashcards from typed answers.” It identifies the audience as people studying alone who want review dates based on an answer rather than a guessed rating. The first action is the one-click **Try it with sample data** link, with the outcome “Three due cards open next.” The first screen also shows the three required facts: works offline after first visit, cards stay in this browser, and free for 30 cards.

The one-click action entered `?demo=1`, showed the persistent “Demo — sample data, nothing is saved to your cards” banner, Reset demo, Start for real, and three due sample cards. The live 390 px suite confirms the action, all three facts, touch targets, and no horizontal overflow fit the first screen.

## Required claim matrix

`.factory/claims.json` exists and declares 18 claims. After `npm ci`, every listed command was run separately and exactly against the product's local demo entry point. All returned exit 0. The complete per-command log is [claim-matrix-local.txt](verification-12-evidence/claim-matrix-local.txt).

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

The registry test also passed: each claim has exactly one matching `@claim:<id>` test.

## Clean checkout and deployment checks

| Gate | Result |
|---|---|
| `npm ci` | PASS — 22 packages installed; audit reported 0 vulnerabilities |
| Local `npm test` | PASS — 47/47 Playwright tests |
| Exact individual claim commands | PASS — 18/18, above |
| `npm run typecheck` | PASS — `tsc --noEmit` |
| `npm run build` | PASS — `dist/` produced |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |
| Lint | N/A — no lint script or configured linter exists in `package.json` |
| Full live Playwright suite | PASS — 47/47 against the custom domain; [log](verification-12-evidence/live-playwright.txt) |

The deployed `index.html`, hashed JS, and hashed CSS are byte-identical to the fresh candidate build by SHA-256. The deployed JS hash is `1fc35abac4ba1a03dfc120b9f5d0498b1fff7b338c335a15c5e202b000474c9f`; the CSS hash is `584671ae02a384547837f25fef66fe985216d0b38604c76047f8a53a66a361bf`. The downloaded live artifacts and response header are retained in [verification-12-evidence](verification-12-evidence/).

## Product behavior and recovery

- Exact text, Unicode/case/space normalization, numeric tolerance, and checklist review all passed in the claim suite.
- The prior blocker is repaired: the inclusive numeric boundary `299802` for `299792 ± 10` scores 100% and renders `Matched`, not missing. The full live suite executes that regression.
- A normal live exact review saved `café`, rendered “100% of the answer key matched,” and showed `Matched: ✓ café / coffee`.
- CSV and six-field Anki CSV export, encrypted AES-GCM export/restore, malformed-backup preservation, deletion retention, demo reset/isolation, concurrent card creation, and the 30-card free limit passed.
- Invalid/recovery probes on the live build passed: an empty expected answer announced “Add the expected answer before saving,” then saved after correction; a `-1` numeric tolerance was rejected with “Value must be greater than or equal to 0,” then saved after entering `0.5`.
- The live paid-flow test verified the $19 catalog record, 303 checkout redirect to Dodo, hosted checkout page, purchase restore, unlimited-card state, and trends. Terms now state that Sociobot/Dodo is merchant of record, handles refunds, and revokes refunded licenses.

## Privacy, PWA, accessibility, and response policy

- In a fresh live demo context, review plus encrypted export made six observed requests, all same-origin. No request body contained the typed answer or backup passphrase; no analytics, telemetry, or page errors appeared.
- The live service worker controlled the demo. With the browser offline, `?demo=1` reloaded successfully and displayed “You are offline. Review and export still work.” The update test passed and verified the update-available notice plus `Update now` activation.
- The full live suite found 0 axe serious/critical findings across Home, Demo, Cards, Privacy, Terms, and 404 in light and dark modes. It also passed keyboard-only 390 px review, route-focus/back-forward restoration, 44 px target checks, contrast checks, and no-overflow checks.
- Reduced-motion live probe computed `0.00001s` transition and animation durations. The 390 px page had `scrollWidth = 390` and no console errors.
- `/`, `/demo`, `/study`, `/cards`, `/privacy`, `/terms`, `/404`, manifest, robots, and sitemap returned 200. A nonexistent route returned a real HTTP 404.
- Live responses carry HSTS, `nosniff`, strict-origin referrer policy, denied camera/microphone/geolocation permissions, and a CSP limited to self plus the documented Sociobot API. HTML, manifest, and service worker revalidate at 30 seconds; hashed JS/CSS use `public, max-age=31536000, immutable`.
- The initial JS is 36,072 B raw / 12,084 B gzip (under the 200 KB budget); CSS is 18,644 B raw / 5,021 B gzip (under 50 KB); mobile hero `hero-768-v1.webp` is 79,516 B (under 300 KB). No web font is fetched.

## Request allowance

The only server-side product flow is Sociobot billing/license verification. Fresh requests to `GET /api/v1/products/answer-anchored-flashcards/verify` returned 200 for requests 1–30. Requests 31–35 returned **429** with `Retry-After` values of 3, 3, 3, 2, and 2 seconds. Observed allowance: **30 requests per client window**.

Sign-in, Entra tenant, backend persistence/health, and library/CLI consumer checks are not applicable: this is a static PWA with no product sign-in or application backend.

## Findings by severity

No release-blocking, high, medium, or low defects were found in this candidate.

## Acceptance decision

**PASS.** Candidate `9b40406d8aa0da742bba45d7dfd30b4898b0577e` meets the researched brief and supplied factory acceptance contract at <https://answer-anchored-flashcards.sociobot.in>.
