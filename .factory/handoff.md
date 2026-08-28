# Recall Anchor 1.0.1 repair handoff

## Release status

**Ready for independent reverification.** This repair addresses every finding in verifier commit `306cb9d894f220f432a1655890e6c87d0b058a09` against candidate `098c5c52f7677aa938a2c8cd415a060d2992f885`.

- Repair commit: `974a2d4e71e8beffe4f19285597bb508ecd8090e`
- Branch: `main`, pushed to `origin/main`
- Deployment: <https://answer-anchored-flashcards.sociobot.in>
- Artifact class: static offline PWA; build output remains `dist/`
- Deployed `index.html` and hashed JavaScript matched the local build byte for byte.

## Findings repaired

1. Registered Recall Anchor Desk in the production Sociobot/Dodo product registry at $19. The public catalog lists the product and the checkout returns HTTP 303 to `checkout.dodopayments.com`.
2. Reworked dark-mode foreground and surface roles. Axe reports no serious or critical issues on Home, Demo, Cards, Privacy, Terms, the app 404, selected confidence controls, or a scored result.
3. Replaced checklist substring scoring with Unicode-aware complete-term matching. `earth` no longer satisfies `art`.
4. Locked answer submission before persistence begins. Two immediate submit events create one review and one schedule change.
5. Added transactional IndexedDB read-modify-write operations. Concurrent tabs merge card additions instead of replacing a newer collection with stale state.
6. Raised navigation, demo, legal, result, and footer link targets to at least 44 px at 390 px.
7. Constrained visually hidden confidence inputs to 1 px. The review is exactly 390 px wide in a 390 px viewport.
8. Filename-versioned the original image assets and applied one-year immutable caching to `/assets/*`.
9. Expanded claim coverage: encrypted restore now proves both cards and review rows; privacy covers the passphrase/export path; paid coverage asserts the live product catalog and checkout URL.
10. Replaced the catch-all navigation rewrite with explicit app routes. Unknown paths now return the designed 404 page with HTTP 404.

## Regression coverage

`tests/regressions.spec.ts` covers complete checklist terms, duplicate submission, concurrent tabs, dark-mode routes and review states, and static response policy. `tests/mobile.spec.ts` covers target size and real page width. `tests/claims.spec.ts` now verifies restored review rows, passphrase privacy, and the production paid-product catalog.

All 11 commands in `.factory/claims.json` were run separately. Each selected exactly one tagged test and passed.

## Verification evidence

- Clean install: `npm ci` — 22 packages, 0 vulnerabilities.
- Full suite: `npm test` — 32/32 Playwright tests passed in 42.9 seconds.
- Type check: `npm run typecheck` — passed. No separate linter is configured.
- Dependency audit: `npm audit --audit-level=low` — 0 vulnerabilities.
- Production build: `npm run build` — passed; `dist/index.html` exists.
- Bundles: JavaScript 32.28 KB raw / 11.15 KB gzip; CSS 18.44 KB raw / 4.97 KB gzip; mobile hero 79.52 KB; no downloaded fonts.
- Local SWA response check: `/`, `/demo`, `/cards`, `/privacy`, and `/terms` returned 200; an unknown route returned 404; a hashed JavaScript asset returned `Cache-Control: public, max-age=31536000, immutable`.
- Local update check: a changed service worker showed “A new version is ready”; **Update now** activated it, leaving an active controller and no waiting worker.
- Live identity: local and live `index.html` SHA-256 `5790710110f9f3af0596888fbc634baea39727e2af8b43f84ea0cbd8f99cacc8`; local and live JavaScript SHA-256 `7ac9fb0fd62eeef66c30f04bd229385f3a43d387d400afe243c47e586048146b`.
- Live route/policy check: all six app routes returned HTTPS 200; unknown route returned 404; security headers remained present; versioned assets returned one-year immutable caching.
- Live checkout: HTTP 303 to the hosted Dodo checkout; product catalog reports USD 1900 and the production return URL.
- Live browser matrix: five routes in both light and dark desktop modes had zero serious/critical axe findings and zero console errors.
- Live 390 px keyboard/touch check: `Ctrl+Enter` scored 100%; page width was 390 px; no tested target was below 44 px; no off-origin review request occurred.
- Live offline check: a fresh controlled `/demo` context reloaded offline, retained sample data, and displayed the offline notice.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.43 s, CLS 0, TBT 0 ms.
- `/opt/fleet/lib/verify-url.sh` passed live: title, `lang=en`, one `h1`, `main`, image alt text, and no console errors.

## Run and deploy

```sh
npm ci
npm run typecheck
npm test
npm run build
```

Publish `dist/` with:

```sh
/opt/fleet/lib/deploy-static.sh answer-anchored-flashcards /work/repo/dist
```

## Known gaps

- Browser storage does not sync between devices. Encrypted backup remains the explicit transfer path.
- Intervals remain the brief's compact deterministic rule rather than FSRS.

Neither gap blocks the researched v1 scope. No release-blocking finding remains known.
