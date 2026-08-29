# Recall Anchor repair handoff

## Release status

**PASS — ready for independent re-verification.**

- Work order: `answer-anchored-flashcards-repair-2`
- Report commit: `ec82ec18d54e13f21d43b305cc349174ed732c09`
- Reported candidate: `58718aa86cee1ef26debf331acfb9effde38bd19`
- Product repair commits: `ce6a94e` and `3d373b5`
- Version: `1.0.2`
- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Artifact remains a static offline PWA with `dist/` output

## Repairs

### Card creation and the 30-card boundary

- The card form enters an `aria-busy` pending state and disables **Save card** before storage begins.
- Each rendered form receives one stable UUID, making repeated submission idempotent.
- `addCardToStore` reads the newest snapshot, rejects a duplicate UUID, checks the unlicensed maximum, and writes inside one serialized IndexedDB transaction.
- A stale tab that loses the 29→30 boundary race reloads the current collection and shows the full-plan state. Card 31 is never written.
- `@claim:free-limit` now proves that two immediate submit events store one card and that two tabs starting at 29 finish at exactly 30.

### PWA and accessibility follow-ups

- Product, footer, lockfile, and manifest agree on version `1.0.2`.
- The service-worker cache is `recall-anchor-v4`.
- Offline status remains visible through in-app navigation.
- Hidden license and update controls have explicit accessible names.
- A controlled update regression proves the waiting-worker notice and **Update now** activation path.
- `.factory/claims.json` documents the expanded free-limit sandbox. `.factory/copy-audit.md` records the final plain-words audit.

The researched brief, visual system, storage namespaces, billing integration, and previously passing behavior were preserved.

## Clean local verification

Run on 2026-08-29 UTC:

- `npm ci`: 22 packages installed; 0 vulnerabilities.
- All 11 commands in `.factory/claims.json` were run independently: 11/11 passed.
- `npm test`: 33/33 Playwright tests passed in 45.7 seconds.
- `npm run typecheck`: passed.
- `npm audit --audit-level=low`: passed; 0 vulnerabilities.
- No lint script is configured; `git diff --check` passed.
- `npm run build`: passed; `dist/index.html` exists.
- Bundle: JS 33.10 KB raw / 11.44 KB gzip; CSS 18.44 KB raw / 4.98 KB gzip; mobile hero 79.52 KB; no downloaded fonts.
- Package/consumer checks are not applicable to this static PWA.
- The controlled service-worker test showed the update notice, activated the waiting worker, reloaded, retained a controller, and left no worker waiting.

The suite covers exact, numeric, and checklist scoring; Unicode and numeric boundaries; review and card idempotency; concurrent-tab merging and limits; exports and encrypted restore; demo isolation; light/dark axe checks; routes and HTTP 404 policy; desktop and 390 px keyboard/touch behavior; privacy; offline reload/navigation; service-worker updates; and paid-license behavior.

## Live verification

- The final live Playwright run passed 33/33 scenarios across desktop and 390 px mobile.
- `/opt/fleet/lib/verify-url.sh` passed: HTTPS 200, correct title, `lang=en`, one `h1`, one `main`, 0 missing image alternatives, 0 unlabeled buttons, and 0 console or page errors.
- Axe found 0 serious or critical issues across Home, Demo, Cards, Privacy, Terms, and 404 in light and dark modes. The scored review state also passed.
- At 390 px, horizontal overflow was 0, all checked controls met 44 × 44 CSS px, and keyboard review with `Ctrl+Enter` scored correctly.
- Privacy interception covered review, CSV/Anki export, and encrypted backup. All requests were same-origin; typed answers and passphrases appeared in 0 request bodies.
- Offline reload retained the populated demo and offline status persisted after internal navigation.
- App routes return HTTP 200; an unknown route returns HTTP 404. Hashed assets use `public, max-age=31536000, immutable`; HTML revalidates after 30 seconds.
- HSTS, CSP, `nosniff`, referrer policy, and permissions policy are present.
- The product catalog lists the slug at USD 1900. Checkout returns HTTP 303 to `checkout.dodopayments.com`.
- A 40-request verification burst returned 29 HTTP 200 and 11 HTTP 429 responses; a follow-up 429 included `Retry-After: 3`.
- Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, CLS 0, TBT 30 ms, total transfer 102 KiB.

## Deployment and identity

Deployed with:

```sh
/opt/fleet/lib/deploy-static.sh answer-anchored-flashcards /work/repo/dist
```

The existing `centralus` Static Web App and custom domain were reused. Successful deployment IDs recorded for the same final product artifact were `c4d4d281-0dfd-47f9-b625-5e49c67b633b` and `31120c90-1366-4fbb-9a52-e99cea933b76`.

The live files match `dist/` byte for byte:

| File | SHA-256 |
|---|---|
| `index.html` | `ff4cb23c2b904cd9680c4f55a4ee4a064364abbfd6a595ccdd3bd21a73767b20` |
| `assets/index-DhDYIuC6.js` | `3f27a22a5860d820b64a1e33112556a4b504443b9a4dfd7a877a00c8df23ddc5` |
| `assets/index-BB7BhwC2.css` | `926b97b863ee9df99cb8f5b6401719908ca2d001ad0291ad06970bffa21922e6` |
| `sw.js` | `162e292b7c5c1fd2ce9f60a32088ff03a5de5a33feb6aed52df82bc3a40be04` |
| `manifest.webmanifest` | `aa9dc5a56c36be8ae44b4ef189b3813d707012567a6f92cb53cf06e5f0909ed6` |

## Reproduce

```sh
npm ci
npm run typecheck
npm audit --audit-level=low
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npx playwright test
```

## Known gaps and next step

No release-blocking or known product gaps remain. Lighthouse does not provide a lab INP value; direct card and review interactions were immediate. The next step is independent release verification against the deployed commit.
