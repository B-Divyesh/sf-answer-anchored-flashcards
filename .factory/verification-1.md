# Independent product verification 1 — FAIL

Verified on 2026-08-28 (UTC).

- Candidate: `098c5c52f7677aa938a2c8cd415a060d2992f885`
- Clean test worktree: detached directly at the candidate commit
- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact: offline PWA
- Result: **FAIL — do not release this candidate**

The deployment matches the candidate and the basic PWA is fast and usable. Release is blocked by a dead paid checkout, serious dark-mode contrast failures, incorrect checklist scoring, duplicate review submission, and silent multi-tab data loss.

## Mandatory first-read gate

**PASS.** A cold 390 × 844 browser opened to a first screen that says:

- What: “Score the answer you actually recall.”
- For whom: “For self-learners who want the next interval based on a typed answer, not a rating guess.”
- First action: “Try it with sample data,” with “Three due cards open next.”

The action was visible without setup. One click opened `/demo` with a due exact-answer card and the persistent “Demo — sample data, nothing is saved to your cards” banner, plus **Reset demo** and **Start for real**.

## Required claim tests

`.factory/claims.json` exists with 11 entries. After `npm ci`, every listed command was run separately and exactly as declared from the clean candidate worktree. Every command passed:

| Claim | Result |
|---|---|
| `offline-reload` | PASS, 1 test |
| `answer-types` | PASS, 1 test |
| `interval-reason` | PASS, 1 test |
| `csv-export` | PASS, 1 test |
| `anki-export` | PASS, 1 test |
| `encrypted-backup` | PASS, 1 test |
| `demo-isolation` | PASS, 1 test |
| `local-privacy` | PASS, 1 test |
| `keyboard-review` | PASS, 1 mobile test |
| `free-limit` | PASS, 1 test |
| `paid-desk` | PASS, 1 mocked-verification test |

The commands rebuild before running their tagged test. Logs reported one passing test for every command and no failures.

Claim coverage is incomplete despite the green commands. `encrypted-backup` promises to restore cards and reviews but asserts only the restored card count. `paid-desk` mocks a valid verification reply without checking the advertised checkout. “All card types work offline,” “No account,” and the backup passphrase privacy promise appear in product copy without a dedicated claim assertion covering their full wording. Manual verification did confirm a backup restores three cards and two reviews, but manual evidence does not repair the claims contract.

## Clean-checkout gates

| Gate | Fresh evidence | Result |
|---|---|---|
| Install | `npm ci`: 22 packages, 0 vulnerabilities | PASS |
| Full suite | `npm test`: 20/20 Playwright tests passed in 50.0 s | PASS |
| Type check | `npx tsc --noEmit` | PASS |
| Lint | No lint script or linter is available | N/A |
| Production build | `npm run build` with Vite 7.3.6; `dist/` produced | PASS |
| Dependency audit | `npm audit --audit-level=low`: 0 vulnerabilities | PASS |
| Bundle budget | JS 31.28 KB raw / 10.76 KB gzip; CSS 17.61 KB raw / 4.84 KB gzip; mobile hero 79.52 KB; no web fonts | PASS |

Test runner artifacts (`test-report/` and `test-results/`) were generated only in the disposable test worktree. Product code was not changed.

## Deployment identity, routes, and policy

The live deployment matches the candidate build byte for byte for `index.html`, the hashed JS and CSS, `sw.js`, and `manifest.webmanifest`. Representative SHA-256 values:

- `index.html`: `a1995b2df56d417bfe08a46f76e48c35a09c2f48254ef74fbdeee5e08724b38f`
- JavaScript: `3f4192c42f744d10dbd4d4150d6dc1e2be55708ea4a97e030ac7440e5f466c44`
- CSS: `487dee0d70d5e6df3ac675c692268a101d3125129370889f490fa0ab9db5528b`
- Service worker: `b6dde008ff02628af3ffbf4165b836dc075dd65cd67b8c39e07640387ac3140e`

Home, demo, study, cards, privacy, terms, manifest, service worker, robots, sitemap, and static assets returned HTTPS 200. HTTP redirects to HTTPS. The live site sends HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive permissions policy, and a CSP limited to self plus `api.sociobot.in` connections. The supplied `verify-url.sh` passed with a title, `lang=en`, one `h1`, a main landmark, no missing image alt, and no console errors. Its one unlabeled-button count is the hidden update-toast button; the button has visible text when shown.

Every crawled link returned 200 except the paid checkout, which returned 404. Unknown application routes render the designed not-found view but the host returns HTTP 200.

Hashed JS and CSS are served with `Cache-Control: public, must-revalidate, max-age=30`, not long-lived immutable caching.

## End-to-end and edge-case evidence

Passing behavior:

- Exact, numeric tolerance, and checklist happy paths complete against sample data.
- Unicode normalization works: expected `CAFÉ` and decomposed input `cafe\u0301` scored 100%.
- Numeric `299802` passed at the exact `299792 ± 10` boundary; `299802.01` failed and returned in 10 minutes; `299,792` passed.
- A one-item checklist shows “Add at least two checklist items, one per line”; adding another item recovers and saves.
- Missing confidence invokes the browser’s required-field message and the user can recover without losing the typed answer.
- An exported backup identifies AES-GCM with PBKDF2-SHA256-180000 and does not contain plaintext card content. A wrong passphrase gives a clear recovery message. With confirmation accepted, restore recovered three cards and two reviews.
- Demo reset/isolation, empty real collection, 30-card free limit, CSV downloads, and persisted card reload pass.

Failing behavior:

- A checklist with rubric items `art` and `oxygen` scored typed answer `earth` as 50%. The result marked `art` as matched and scheduled the card for tomorrow. The matcher uses substring containment, so unrelated words create false evidence.
- Dispatching the answer form twice before the async save/render completed grew demo reviews from 2 to 4, changed the sample card review count from 2 to 4, and advanced its interval to five days. The submission is not locked or idempotent.
- Two tabs opened the same empty real collection. Tab A saved “First tab card”; stale tab B saved “Second tab card.” Reloading showed only “Second tab card.” Whole-record writes silently discard concurrent changes.

## Accessibility, keyboard, and responsive checks

- Light mode: axe WCAG A/AA/2.1 AA/2.2 AA found zero serious or critical issues on `/`, `/demo`, `/cards`, `/privacy`, `/terms`, and an unknown route.
- Dark mode: **FAIL**. Axe found serious contrast failures on Home (11 nodes), Demo (5), Cards (10), and the 404 view (1). Examples include white on red at 4.34:1, mustard on the light proof-strip background at 1.58:1, and white on that background at 1.15:1.
- Keyboard-only at 390 px: the demo autofocuses the answer, Tab reaches confidence, Space selects it, and Ctrl+Enter completes a 100% review. Focus uses a visible 3 px outline and no trap was found.
- Reduced motion: smooth scrolling becomes `auto`; measured animation and transition durations become 0.01 ms.
- Text at 200% retained the first-screen heading and primary action without horizontal overflow.
- Touch targets: **FAIL**. Mobile primary-nav links are 36 px tall, **Start for real** is 16 px tall, and footer links are about 19 px tall; the requirement is 44 px.
- The 390 px demo document measures 397 px wide because invisible confidence radio inputs retain `width: 100%`; `overflow-x: clip` hides the extra 7 px. At 1440 px the same review DOM measured 1779 px wide.
- No console or page errors appeared on desktop/light or 390 px mobile/dark across home, demo, study, cards, privacy, terms, and unknown routes.

## Privacy, PWA, and API behavior

- A live demo review plus review CSV, Anki CSV, and encrypted-backup exports made only same-origin requests. No analytics, CDN scripts, third-party fonts, raw credentials, or Azure model endpoints were found.
- Sign-in is not used, so the Entra tenant requirement is not applicable.
- The manifest has 192 px and 512 px icons, a maskable icon, standalone display, theme/background colors, scope, shortcuts, and a versioned start URL.
- A fresh live `/demo` visit gained a service-worker controller, then reloaded offline with its card and the explicit offline notice intact.
- A controlled local test served the candidate build, changed only the in-memory service-worker response, and called `registration.update()`. “A new version is ready” appeared; **Update now** activated the waiting worker and left no worker waiting.
- The license verification endpoint is rate limited. A concurrent burst of 120 requests produced 30 HTTP 200 responses and 90 HTTP 429 responses. All 90 responses included `Retry-After: 4`; the observed burst allowance was 30.

## Performance

Fresh live mobile Lighthouse 12.8.2:

- Performance 100
- Accessibility 100 in the default light-mode run
- Best Practices 100
- SEO 100
- FCP 0.9 s; LCP 1.4 s; CLS 0; TBT 10 ms; Speed Index 0.9 s
- Total transfer 95 KiB

The static budgets and Lighthouse thresholds pass. No lab INP value was available; direct review interactions were immediate.

## Findings by severity

### High — release blocking

1. **Production checkout is dead.** `GET https://api.sociobot.in/api/v1/products/answer-anchored-flashcards/checkout` returns HTTP 404 with `{"error":"enabled factory product","status":404}`. Every $19 buy link leads there.
2. **Dark mode violates the accessibility baseline.** Serious axe contrast failures affect primary actions and core content, with ratios as low as 1.15:1.
3. **Checklist scoring records false recall evidence.** Substring matching lets `earth` satisfy `art`, changes the score, and schedules the wrong interval.
4. **Rapid submission records one answer twice.** Two submits create two reviews and advance scheduling twice.
5. **Concurrent tabs silently lose study data.** A stale tab overwrites another tab’s newly saved card without a warning, merge, or history.

### Medium

6. **Several 390 px touch targets are below 44 px**, including navigation, demo-exit, and footer links.
7. **The review form has clipped horizontal overflow** from visually hidden radio inputs at both tested viewport widths.
8. **Hashed static assets have only a 30-second cache lifetime** instead of immutable long-lived caching.
9. **Claim tests do not cover their complete promises**, notably restored review rows and the real checkout; several additional copy claims have no complete tagged assertion.

### Low

10. **Unknown routes return HTTP 200** while displaying the 404 view.

## Acceptance decision

**FAIL.** Do not release candidate `098c5c52f7677aa938a2c8cd415a060d2992f885`. Register and verify the production Sociobot checkout, correct dark-mode contrast and touch sizing, make checklist matches token/boundary aware, make review submission idempotent, and prevent or surface stale multi-tab writes. Add claim-level regression coverage for the complete promises before reverification.
