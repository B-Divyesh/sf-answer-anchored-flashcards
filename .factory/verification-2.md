# Independent product verification 2 — FAIL

Verified on 2026-08-28 (UTC).

- Candidate: `58718aa86cee1ef26debf331acfb9effde38bd19`
- Branch state at start: clean `main`, matching `origin/main`
- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact: offline PWA
- Result: **FAIL — do not release this candidate**

The deployed PWA matches the candidate and most of the repaired product is strong. Release is blocked by a card-creation race that duplicates cards and lets an unlicensed collection exceed the advertised 30-card limit through ordinary UI actions.

## Mandatory first-read gate

**PASS.** A cold browser showed all three required answers on the first screen:

- What: “Score the answer you actually recall.”
- For whom: “For self-learners who want the next interval based on a typed answer, not a rating guess.”
- First action: “Try it with sample data,” with “Three due cards open next.”

At both desktop and 390 × 844, the action was visible on the first screen. One click opened `/demo` with a populated exact-answer card and the persistent “Demo — sample data, nothing is saved to your cards” banner, plus **Reset demo** and **Start for real**. This gate passes.

## Required claim commands

`.factory/claims.json` exists with 11 entries. The exact commands were first invoked before installation and stopped at `tsc: not found`, which is expected in a clean clone without dependencies. After the required lockfile install (`npm ci`), every declared command was rerun separately. Each selected exactly one tagged test and passed:

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
| `free-limit` | `npm test -- --grep @claim:free-limit` | PASS, 1 test, but contradicted by boundary testing below |
| `paid-desk` | `npm test -- --grep @claim:paid-desk` | PASS, 1 test |

The green `free-limit` test is insufficient. It seeds 30 cards and checks that the form disappears; it never submits at the 29→30 boundary twice or from concurrent tabs. Fresh live testing disproved its claimed observable outcome.

## Clean-checkout quality gates

| Gate | Fresh evidence | Result |
|---|---|---|
| Install | `npm ci`; 22 packages; 0 vulnerabilities | PASS |
| Full suite | `npm test`; 32/32 Playwright tests passed in 1.3 minutes | PASS |
| Type check | `npm run typecheck` | PASS |
| Lint | No lint script or linter is configured | N/A |
| Dependency audit | `npm audit --audit-level=low`; 0 vulnerabilities | PASS |
| Exact production build | `npm run build`; Vite 7.3.6; `dist/index.html` produced | PASS |
| JavaScript budget | 32.28 KB raw / 11.15 KB gzip | PASS |
| CSS budget | 18.44 KB raw / 4.97 KB gzip | PASS |
| Mobile hero | 79.52 KB WebP | PASS |
| Fonts | No downloaded font files | PASS |

## Release-blocking reproduction

### High — duplicate card writes bypass the free limit

Two independent live reproductions succeeded in fresh browser contexts:

1. Open `/cards`, enter one valid exact card, and double-click **Save card**. Two identical rows appear and IndexedDB contains two cards.
2. Seed 29 cards, open `/cards` in two tabs, enter one valid card in each, then click **Save card** once in each tab. Reloading shows 31 cards. The stored tail was `Tab A`, `Tab B` and the total was exactly 31.

The form remains enabled while `addCard` awaits storage, and the 30-card check happens only when rendering. The transactional write merges both additions but does not re-check the limit inside the transaction. Consequences:

- a routine double-click duplicates user data;
- two ordinary open tabs bypass the advertised free-plan boundary;
- the tagged `free-limit` test passes while the public claim is false.

This is release blocking under the claims contract and affects a paid-feature boundary. The fix should lock card submission immediately, make the write idempotent, and enforce the unlicensed 30-card maximum inside the same IndexedDB transaction. The claim test should exercise double activation and two tabs starting at 29 cards.

## End-to-end and boundary evidence

Passing behavior:

- The live one-click demo loaded three realistic due cards in its separate namespace.
- Exact matching accepted composed `CAFÉ` and decomposed `cafe\u0301` through Unicode normalization.
- Numeric `100.5` passed at the exact `100 ± 0.5` boundary; `100.5001` failed and scheduled review in 10 minutes.
- Checklist input with one rubric item showed “Add at least two checklist items, one per line”; adding a second item recovered and saved.
- Checklist whole-term matching correctly treated `art` as missing in `earth oxygen`, yielding 50% rather than a substring false positive.
- A rapid double submission of one review created exactly one review and one schedule change.
- Concurrent tabs adding different cards to an ordinary collection retained both cards.
- A wrong encrypted-backup passphrase produced a clear recovery message. The encrypted file did not contain typed answer text.
- Review CSV and Anki-field CSV downloaded with the expected records and columns.
- Demo reset/isolation, empty real state, card persistence, removal confirmation, and review-complete behavior passed through the suite or live checks.

## Accessibility, responsive behavior, and errors

- A fresh independent live Playwright harness ran eight scenarios and passed all eight after correcting harness-only assertions.
- Axe WCAG A/AA, 2.1 AA, and 2.2 AA found zero serious or critical findings across `/`, `/demo`, `/study`, `/cards`, `/privacy`, `/terms`, and the real HTTP 404 in both light and dark modes.
- At 390 px, keyboard-only review used the autofocus answer field, Tab, Space, and `Ctrl+Enter`; it scored 100% without a pointer.
- The focused confidence control had a visible 3 px solid outline. No keyboard trap appeared.
- Every visible link, button, and summary checked on Home, Demo, Cards, Privacy, and Terms measured at least 44 × 44 CSS px.
- At 390 px, tested pages and the review shell had no horizontal overflow. At simulated 200% text sizing, the heading and demo action remained visible without horizontal overflow.
- With reduced motion enabled, smooth scrolling became `auto` and the result animation duration became `0.00001s`.
- Successful routes produced no console errors or uncaught page errors. Directly navigating to the intentional HTTP 404 produces Chromium's expected failed-resource console line for the 404 document, but no application exception.
- `/opt/fleet/lib/verify-url.sh` passed the live root: title, `lang=en`, one `h1`, one `main`, image alt text, and zero console errors. Its reported unlabeled button is the hidden update-toast button; when shown it is named **Update now**, and axe reports no violation.

## Privacy, requests, and response policy

- The browser request log for cold load, review, review CSV, Anki CSV, and encrypted-backup export contained only `https://answer-anchored-flashcards.sociobot.in` requests.
- Neither the typed private answer nor backup passphrase appeared in a request body. No analytics, beacon, telemetry, third-party font, CDN script, raw Azure key, or Azure endpoint was found.
- The only external runtime endpoint in product code is the explicit Sociobot checkout/license API.
- Live HTML responses include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a camera/microphone/geolocation-denying permissions policy, and a restrictive CSP whose only external connection/form origin is `https://api.sociobot.in`.
- HTTP redirects to HTTPS. App routes return 200; an unknown route returns the designed page with HTTP 404.
- All crawled internal links returned 200. `https://sociobot.in/` returned 200. The checkout returned 303 to `checkout.dodopayments.com`.
- The live product catalog lists Recall Anchor Desk at USD 1900 with the expected checkout URL.
- Sign-in is not used, so the Microsoft Entra tenant requirement is not applicable.

## Endpoint allowance

The product has no backend of its own. Its license verification call uses the Sociobot product endpoint. A fresh concurrent burst of 60 invalid-license requests produced:

- 30 responses with HTTP 200 and `{ "valid": false, "reason": "invalid" }`;
- 30 responses with HTTP 429;
- `Retry-After` on every 429, observed at 1–2 seconds.

Observed allowance: **30 requests per burst window per client**. Rate limiting passes.

## PWA and offline behavior

- Chrome parsed the live manifest without errors. It declares standalone display, scope, theme/background colors, 192 px and 512 px icons, and a maskable icon.
- A fresh live `/demo` context gained a service-worker controller, reloaded offline with its populated sample, completed a review offline, and exported the resulting CSV offline.
- A controlled candidate-build update changed the served worker version. The app showed “A new version is ready”; **Update now** activated it, reloaded, retained an active controller, and left no waiting worker.
- Hashed JavaScript, CSS, and image assets return `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and service worker use a 30-second revalidation policy.

Low-severity PWA details:

- `manifest.webmanifest` still uses `start_url: "/?v=1.0.0"` while the product footer/package version is 1.0.1. The URL still works, but the cache-buster is stale.
- The offline notice appears on offline reload but is cleared after subsequent in-app navigation even while the browser remains offline. Review and export continue to work.

## Live deployment identity

The deployed output matches candidate `58718aa86cee1ef26debf331acfb9effde38bd19` byte for byte for the checked artifacts:

| Artifact | SHA-256 | Result |
|---|---|---|
| `index.html` | `5790710110f9f3af0596888fbc634baea39727e2af8b43f84ea0cbd8f99cacc8` | MATCH |
| `assets/index-D_jc_Vkw.js` | `7ac9fb0fd62eeef66c30f04bd229385f3a43d387d400afe243c47e586048146b` | MATCH |
| `assets/index-BB7BhwC2.css` | `926b97b863ee9df99cb8f5b6401719908ca2d001ad0291ad06970bffa21922e6` | MATCH |
| `sw.js` | `3d1e285a38c4c6b66ab43d45263e4e8027eab76c0fbb5492309d82bc3a40be04` | MATCH |
| `manifest.webmanifest` | `e99db72a1ff9a5d016c75a64e54c31c0ba0a01591502b009e752874428cb2dd7` | MATCH |

## Performance

Fresh live mobile Lighthouse 12.8.2:

- Performance 96
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 0.95 s; LCP 1.40 s; CLS 0; TBT 230 ms; Speed Index 0.95 s
- Total transfer 104,120 bytes

The release budgets pass. Lighthouse does not provide lab INP; direct review interactions were immediate.

## Findings by severity

### High — release blocking

1. **Card creation is not idempotent and the free maximum is not enforced at write time.** A real double-click stores a duplicate. Two open tabs at 29 cards store 31. This falsifies the `free-limit` claim and crosses the paid boundary.

### Medium

2. **The `free-limit` claim test has a boundary-coverage gap.** It checks only that the form is absent after directly seeding 30 cards, so it remains green while supported UI actions can write card 31.

### Low

3. **The manifest start URL carries stale version `1.0.0`** while the product is 1.0.1.
4. **The offline status notice is transient across in-app navigation.** Functionality remains available, but the user loses the visible offline state.

## Acceptance decision

**FAIL.** Do not release candidate `58718aa86cee1ef26debf331acfb9effde38bd19`. Reverify after card submission is made idempotent, the 30-card limit is enforced inside the transactional write, and the claim regression covers both rapid activation and the 29-card two-tab boundary.
