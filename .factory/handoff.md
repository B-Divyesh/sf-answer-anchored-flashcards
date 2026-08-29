# Recall Anchor repair handoff

## Release status

**PASS — release-blocking findings from report commit `ec82ec18d54e13f21d43b305cc349174ed732c09` are repaired and deployed.**

- Reported candidate: `58718aa86cee1ef26debf331acfb9effde38bd19`
- Final repair source: `3d373b5` on `main`
- Live URL: <https://answer-anchored-flashcards.sociobot.in>
- Deployed: 2026-08-29 UTC with `/opt/fleet/lib/deploy-static.sh answer-anchored-flashcards dist`
- Azure deployment ID: `31120c90-1366-4fbb-9a52-e99cea933b76`
- Artifact remains a static offline PWA; build output remains `dist/`

## Repairs

### Card creation and the 30-card boundary

- The card form now enters an `aria-busy` pending state and disables **Save card** before storage begins.
- Each rendered form receives one stable UUID. Repeated submission of that form is idempotent.
- `addCardToStore` reads the newest snapshot, rejects a duplicate UUID, checks the unlicensed 30-card maximum, and writes inside one serialized IndexedDB transaction.
- A stale tab that loses the boundary race reloads the current collection and shows the full-plan state.

The tagged `@claim:free-limit` regression now reproduces both verifier cases:

1. Two immediate submit events store one card.
2. Two tabs starting at 29 cards store one boundary card, finish at 30, and both show the limit state.

### PWA and accessibility follow-ups

- Product, footer, lockfile, and manifest now agree on version `1.0.2`.
- The service-worker cache is `recall-anchor-v4`.
- Offline status remains visible through in-app navigation.
- Hidden license and update controls have explicit accessible names; `verify-url.sh` now reports zero unlabeled buttons.
- `.factory/claims.json` documents the expanded free-limit sandbox, and `.factory/copy-audit.md` records the final copy audit.

## Clean local verification

- `npm ci`: 22 packages installed; 0 vulnerabilities.
- Every one of the 11 commands in `.factory/claims.json` was run independently: 11/11 passed.
- `npm test`: 32/32 Playwright tests passed in 41.1 seconds.
- `npm run typecheck`: passed.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- No lint script is configured; type checking and `git diff --check` passed.
- `npm run build`: passed; `dist/index.html` exists.
- Bundle: JS 33.10 KB raw / 11.44 KB gzip; CSS 18.44 KB raw / 4.97 KB gzip; no downloaded fonts.
- Package/consumer checks are not applicable to this static PWA.
- Controlled service-worker update: 2 worker requests; update toast shown; **Update now** activated the new worker; controller present; no worker left waiting.

The full suite covers exact, numeric, and checklist scoring; Unicode and numeric boundaries; review and card idempotency; multi-tab merging; exports and encrypted restore; real/demo isolation; light/dark axe checks; routes and real 404 policy; desktop and 390 px keyboard/touch behavior; privacy; offline reload/navigation; and paid-license behavior.

## Live verification

`/opt/fleet/lib/verify-url.sh` passed the live root in 673 ms:

- title present; `lang=en`; one `h1`; one `main`;
- 0 images missing alt text;
- 0 unlabeled buttons;
- 0 console or page errors.

An independent live browser pass checked `/`, `/demo`, `/cards`, `/privacy`, and `/terms` in light and dark modes. All 10 route/theme combinations returned 200, logged no errors, and had 0 serious or critical axe violations. At 390 px, horizontal overflow was 0 px, undersized visible controls were 0, keyboard review scored 100%, and offline navigation retained `/cards?demo=1` plus the offline notice.

Live privacy flow made 3 requests, all same-origin. The typed answer and backup passphrase appeared in 0 request bodies.

Live Lighthouse 12.8.2:

- Performance 100; Accessibility 100; Best Practices 100; SEO 100.
- FCP 0.91 s; LCP 1.36 s; CLS 0; TBT 0 ms.
- Total transfer: 99,648 bytes.

Response and paid-flow checks:

- `/`, `/demo`, `/study`, `/cards`, `/privacy`, and `/terms`: HTTP 200.
- `/not-a-real-card`: HTTP 404 with the designed page.
- Hashed JS: `Cache-Control: public, max-age=31536000, immutable`.
- HSTS, CSP, `nosniff`, referrer policy, and permissions policy are present.
- Catalog lists `answer-anchored-flashcards` at 1900 USD minor units.
- Checkout returns HTTP 303 to `checkout.dodopayments.com`.
- A 40-request verification burst returned 29 HTTP 200 and 11 HTTP 429 responses; a follow-up 429 included `Retry-After: 3`.

Deployment identity matched byte for byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `ff4cb23c2b904cd9680c4f55a4ee4a064364abbfd6a595ccdd3bd21a73767b20` |
| `assets/index-DhDYIuC6.js` | `3f27a22a5860d820b64a1e33112556a4b504443b9a4dfd7a877a00c8df23ddc5` |
| `assets/index-BB7BhwC2.css` | `926b97b863ee9df99cb8f5b6401719908ca2d001ad0291ad06970bffa21922e6` |
| `sw.js` | `162e292b7c5c1fd2ce9f60a32088ff03a5de5a33feb6aed52df82ff33e121c13` |
| `manifest.webmanifest` | `aa9dc5a56c36be8ae44b4ef189b3813d707012567a6f92cb53cf06e5f0909ed6` |

## Run and verify

```sh
npm ci
npm run typecheck
npm test
npm audit --audit-level=low
npm run build
```

## Known gaps and next steps

No release-blocking product gaps remain. Lighthouse does not provide a lab INP value; direct card and review interactions were immediate. The next step is independent release verification against the deployed commit.
