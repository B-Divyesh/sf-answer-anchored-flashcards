# Recall Anchor adversarial review 1 handoff

## Outcome

**FAIL — 20 findings: 0 blocking, 12 major, 8 minor.**

The complete review is in `.factory/review-1.md`. Product code was not modified. The only repository changes are this handoff and the new review.

## What was verified

- Fresh cold reads at 390 × 844 and 1440 × 900.
- One-click live demo, realistic seed data, banner, Reset, Start for real, real/demo IndexedDB separation, and same-origin request logging.
- Every command in `.factory/claims.json`: 11/11 passed independently.
- `npm test`: 33/33 passed; build produced `dist/`.
- Live route/accessibility/regression run: 22/22 passed.
- Live offline reload and navigation, route focus/back behavior, metadata, HTTP status, dead-link crawl, checkout redirect, cache/security headers, and local/live artifact hashes.
- Every earlier verification finding and the previous handoff. No earlier review or polish files exist.

## Main remaining work

- Put all three offline/privacy/price facts above the fold at phone and desktop review sizes.
- Add or strengthen claim tests for offline actions, Reset, checkout outcome, licensing network/storage behavior, revoked licenses, Unicode normalization, and retained payment/product-boundary statements.
- Replace jargon, decorative headings, slogans, and pricing metaphors with the proposed text in the review.
- Update route-specific Open Graph/Twitter metadata.
- Bring the static 404 onto the shared shell and current version.

## Reproduce

```sh
npm ci
npm test
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npx playwright test tests/app.spec.ts tests/mobile.spec.ts tests/regressions.spec.ts
mkdir -p /tmp/recall-verify-1
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh https://answer-anchored-flashcards.sociobot.in /tmp/recall-verify-1
```

The 11 exact claim commands are listed in `.factory/claims.json`; all passed during this review.
