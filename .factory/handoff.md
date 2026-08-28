# Recall Anchor independent verification handoff

## Release status

**FAIL — do not release candidate `58718aa86cee1ef26debf331acfb9effde38bd19`.**

- Tested URL: <https://answer-anchored-flashcards.sociobot.in>
- Verified: 2026-08-28 UTC
- Deployment identity: checked HTML, JS, CSS, service worker, and manifest match the candidate byte for byte
- Full evidence: [`.factory/verification-2.md`](verification-2.md)
- Product code was not modified during verification

## Release blocker

Card creation has no pending/idempotency guard, and the free limit is checked only when rendering rather than inside the IndexedDB write.

- A real double-click on **Save card** stores two identical cards.
- Starting at 29 cards, two tabs can each click **Save card** once and produce 31 stored cards.
- This directly falsifies the public “Free for 30 cards” / “free plan holds 30 cards” claim.
- The tagged `@claim:free-limit` test still passes because it only seeds an already-full collection and checks that the form is hidden.

Required repair: disable/lock the card form while saving, make card creation idempotent, re-check the unlicensed maximum inside the same transactional update, and add claim-level regressions for double activation and two tabs at 29 cards.

## What passed

- Mandatory first-read and one-click isolated demo gate.
- All 11 declared claim commands after `npm ci`.
- `npm test`: 32/32 tests.
- `npm run typecheck`, `npm audit --audit-level=low`, and `npm run build`.
- Live exact/Unicode, numeric boundary, checklist whole-term, invalid-input recovery, exports, encrypted backup error handling, duplicate-review protection, and ordinary multi-tab merge behavior.
- Desktop and 390 px mobile; keyboard-only review; visible focus; 200% text; reduced motion; 44 px targets; no overflow.
- Zero serious/critical axe findings across all product routes and the 404 in light and dark modes.
- Same-origin-only study/export/backup traffic and required security headers.
- Live offline reload, offline review/export, and controlled service-worker update activation.
- Checkout returns 303 to Dodo; catalog reports USD 1900.
- License endpoint allowance: 30 requests per burst; excess requests return 429 with `Retry-After`.
- Lighthouse mobile: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1.40 s, CLS 0, TBT 230 ms.

## Secondary findings

- Medium: the free-limit claim regression does not test a boundary write or concurrent tabs.
- Low: manifest `start_url` still contains `v=1.0.0` while the product is 1.0.1.
- Low: the offline notice disappears after internal navigation although offline work continues.

## Reproduce and verify

```sh
npm ci
npm run typecheck
npm test
npm audit --audit-level=low
npm run build
```

To reproduce the blocker, use a fresh browser context, seed or create 29 cards, open `/cards` in two tabs, enter a valid card in both, and save once in each. Reloading shows 31 cards. A double-click on one valid **Save card** also produces two stored rows.

No infrastructure, DNS, billing configuration, or product source was changed. Only this handoff and the new independent verification report were updated.
