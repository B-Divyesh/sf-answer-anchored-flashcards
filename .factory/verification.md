# Independent product verification — FAIL

Verified on 2026-08-28 (UTC).

- Candidate: `098c5c52f7677aa938a2c8cd415a060d2992f885`
- Branch state at start: clean `main`, matching `origin/main`
- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact: offline PWA
- Result: **FAIL — do not release this candidate**

The free core is small, fast, usable, and largely complete. Release is blocked by a dead production checkout, serious dark-mode accessibility failures, incorrect checklist scoring, duplicate review submission, and silent multi-tab data loss.

## Required first-read gate

**PASS.** In a fresh 1440 × 900 browser context, the first screen said:

- What: “Score the answer you actually recall.”
- For whom: “For self-learners who want the next interval based on a typed answer, not a rating guess.”
- First action: “Try it with sample data,” followed by “Three due cards open next.”

The action is visible on the first screen. One click opened `/demo`, a populated exact-answer card, and the persistent banner “Demo — sample data, nothing is saved to your cards,” with **Reset demo** and **Start for real**. The gate therefore passes.

## Claim tests

`.factory/claims.json` exists and contains 11 claims. After the required `npm ci`, every listed command was run independently from a fresh Playwright context against the product's `/demo` entry point. All passed:

| Claim | Exact command | Result |
|---|---|---|
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, 1 test |
| `answer-types` | `npm test -- --grep @claim:answer-types` | PASS, 1 test |
| `interval-reason` | `npm test -- --grep @claim:interval-reason` | PASS, 1 test |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS, 1 test |
| `anki-export` | `npm test -- --grep @claim:anki-export` | PASS, 1 test |
| `encrypted-backup` | `npm test -- --grep @claim:encrypted-backup` | PASS, 1 test |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS, 1 test |
| `local-privacy` | `npm test -- --grep @claim:local-privacy` | PASS, 1 test |
| `keyboard-review` | `npm test -- --grep @claim:keyboard-review` | PASS, 1 mobile test |
| `free-limit` | `npm test -- --grep @claim:free-limit` | PASS, 1 test |
| `paid-desk` | `npm test -- --grep @claim:paid-desk` | PASS, 1 mocked-verification test |

The first pre-install invocations stopped at `tsc: not found`, as expected for a clean clone without dependencies. The authoritative rerun above followed a successful lockfile install (`npm ci`, 0 vulnerabilities).

The claim suite has two coverage weaknesses even though it passes: `@claim:encrypted-backup` does not remove or assert restored review rows, and `@claim:paid-desk` mocks verification without exercising or asserting the checkout link. Manual backup testing confirmed review restoration behavior, but the live checkout defect below shows why the latter omission matters.

## Clean-checkout gates

| Gate | Evidence | Result |
|---|---|---|
| Install | `npm ci`; 22 packages; 0 vulnerabilities | PASS |
| Full suite | `npm test`; 20/20 Playwright tests passed in 51.2 s | PASS |
| Type check | `tsc --noEmit` runs inside build | PASS |
| Lint | No lint script or separate linter exists | N/A |
| Exact production build | `npm run build`; Vite 7.3.6; `dist/index.html` produced | PASS |
| Bundle budget | JS 31.28 KB raw / 10.76 KB gzip; CSS 17.61 KB raw / 4.84 KB gzip; mobile hero 79.52 KB; no web fonts | PASS |

## Live deployment identity and policy

The deployed artifact matches the candidate build byte for byte for `index.html`, the hashed JS and CSS, `sw.js`, and `manifest.webmanifest`. Representative SHA-256 pairs matched, including JS `3f4192c42f744d10dbd4d4150d6dc1e2be55708ea4a97e030ac7440e5f466c44` and service worker `b6dde008ff02628af3ffbf4165b836dc075dd65cd67b8c39e07640387ac3140e`.

Home, demo, cards, privacy, terms, manifest, service worker, assets, robots, and sitemap returned HTTPS 200. Live headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive permissions policy, and a CSP limited to self plus `api.sociobot.in` for connections. No page or console errors appeared in desktop, 390 px mobile, light-mode, or dark-mode route smoke tests. No analytics, CDN scripts, third-party fonts, raw model credentials, or Azure endpoints are present.

`/opt/fleet/lib/verify-url.sh` passed against the live root: title present, `lang=en`, one `h1`, a `main` landmark, no missing image alt, and no console errors. Its one “unlabeled” count is the hidden update-toast button; it has visible text when the toast is shown and axe does not report it.

## End-to-end and boundary evidence

Passing behavior:

- Exact, numeric tolerance, and checklist happy paths completed against demo data.
- Unicode NFKC behavior passed live: expected `CAFÉ` and decomposed input `cafe\u0301` scored 100%.
- Numeric `299802` passed at the exact `299792 ± 10` boundary; `299802.01` failed and returned in 10 minutes; `299,792` passed.
- A one-item checklist showed “Add at least two checklist items, one per line”; adding a second item then saved normally.
- An AES-GCM backup contained no plaintext card answer. A wrong passphrase produced a clear error; retrying with the correct passphrase restored the data.
- The empty collection, review-complete state, 30-card limit, destructive confirmation, CSV exports, and real/demo storage separation were exercised by the suite or manual smoke tests.

Failing behavior:

- A checklist with rubric items `art` and `oxygen` scored the answer `earth` as 50% because scoring uses substring matching. The app displayed `✓ art` and scheduled the card for tomorrow even though neither item was recalled.
- Calling the answer form twice before its asynchronous save/render completed created two review rows. Demo reviews rose from 2 to 4, and the sample card advanced from review count 2 to 4 with a four-day interval.
- Two tabs loaded the same empty real collection. Tab A saved “First tab card”; stale tab B saved “Second tab card.” Reloading showed only “Second tab card,” silently losing tab A's card.

## Accessibility and responsive behavior

- Light mode: axe WCAG A/AA/2.1 AA/2.2 AA reported no serious or critical findings across `/`, `/demo`, `/cards`, `/privacy`, `/terms`, and an unknown route.
- Dark mode: **FAIL**. Axe reported serious color-contrast violations on Home (11 nodes), Demo (5), Cards (10), and the 404 view (1). Examples include white on dark-mode red at 4.34:1, white/mustard content on the light `--ink` background at 1.15–1.58:1, and locked-trend text at 1.12:1.
- Keyboard-only at 390 px: PASS. Tab order reached the demo textarea and radio controls, `Space` selected confidence, `Ctrl+Enter` scored 100%, and focused controls had a visible 3 px outline. No trap appeared.
- Reduced motion: PASS. Computed smooth scrolling became `auto`; animation and transition durations became 0.01 ms.
- 390 px layout: no normal-state horizontal overflow; the first action is visible; the complete demo remains usable.
- Touch targets: **FAIL**. Mobile header links are 36 px tall; “Start for real” is 16 px tall; footer and inline links are about 19 px tall. These are below the required 44 px target.

## PWA, privacy, and networking

- Manifest has 192 px and 512 px icons, a maskable icon, standalone display, theme/background colors, scope, and versioned start URL.
- Live offline reload passed after warming `/demo`: it reloaded under a service-worker controller, retained sample data, and showed the offline notice.
- A controlled local update test served the candidate build, changed only the service-worker response in memory, and called `registration.update()`. The app showed “A new version is ready,” **Update now** activated the waiting worker, and the reloaded page had an active controller with no waiting worker.
- Review/export traffic remained same-origin. The only configured runtime API is the Sociobot license endpoint, called after an explicit license action or cached-license refresh. Sign-in is not used, so the Entra authority requirement is not applicable.
- API rate limiting passed. A 120-request concurrent burst to the product verification endpoint produced 30 HTTP 200 responses and 90 HTTP 429 responses. Every 429 included `Retry-After: 4`; the observed burst allowance was 30 requests per window (completion order made request number 30 the first numbered 429).
- Hashed assets are served with `Cache-Control: public, must-revalidate, max-age=30`, not long-lived immutable caching.

## Performance

Live mobile Lighthouse (Lighthouse 12.8.2, headless Chromium):

- Performance 96
- Accessibility 100 (light-mode run)
- Best Practices 100
- SEO 100
- FCP 0.8 s; LCP 1.4 s; CLS 0; TBT 230 ms; Speed Index 0.8 s

The bundle and Lighthouse release budgets pass. No lab INP was available; interaction smoke tests were immediate.

## Findings by severity

### High — release blocking

1. **Production checkout is dead.** `GET https://api.sociobot.in/api/v1/products/answer-anchored-flashcards/checkout` returned HTTP 404 with `{"error":"enabled factory product","status":404}`. Every advertised $19 buy link leads there, so the paid contract cannot be completed.
2. **Dark mode has serious WCAG contrast failures.** The declared dark treatment is unusable in several core sections and violates the non-negotiable ≥4.5:1 baseline.
3. **Checklist scoring produces false evidence and intervals.** Substring matching lets unrelated words satisfy short rubric items (`earth` → `art`). This breaks the core promise that recorded evidence determines scheduling.
4. **Rapid submission duplicates a review and advances scheduling twice.** The form is not locked/idempotent while saving.
5. **Concurrent tabs silently lose cards.** Whole-record stale writes overwrite another tab's newer collection with no conflict warning or recoverable history.

### Medium

6. **Mobile touch targets are below 44 px** in the header, demo exit, inline legal links, and footer.
7. **Hashed static assets are cached for only 30 seconds**, contrary to the long-lived immutable caching requirement.
8. **Claim coverage is incomplete** for restored review rows and the real paid checkout, allowing the suite to pass while a claimed purchase flow is unavailable.

### Low

9. **Unknown routes return HTTP 200** while rendering the designed not-found screen. This weakens correct browser/crawler response semantics.

## Acceptance decision

**FAIL.** Do not release candidate `098c5c52f7677aa938a2c8cd415a060d2992f885`. Reverify after registering the production Sociobot billing product, fixing dark-mode contrast and mobile targets, making checklist matching boundary-aware, making review submission idempotent, and preventing or surfacing stale multi-tab writes. Add regression tests for every fix and for the gaps in the current claim tests.
