# Recall Anchor polish-5 handoff

## Result

**PASS — all findings from review rounds 1–5 are closed.** Candidate `f49f8e2bb0b597f4192cbbdc5a4cd97bd29b89f0` was repaired in `91b43ea7f7da78038ab8a68d164b6709bc36b9aa`, pushed to `origin/main`, and deployed to <https://answer-anchored-flashcards.sociobot.in>. Deployment ID: `df43d6cb-2a07-4bb5-b9cb-3883d1d7188c`.

## What was done

- Added `local-data-deletion` to `.factory/claims.json`. Its test seeds both IndexedDB collections, real/demo reviews, license state, Cache Storage, and the service worker, clears origin storage through Chromium’s site-data operation, and proves every named store is gone before revisiting.
- Added `card-removal-retention`. Its test creates and reviews a card, removes it, reloads, confirms it stays absent, and confirms its earlier review remains in Review CSV.
- Added a registry integrity test that requires one and only one `@claim:<id>` test for every claim and rejects unregistered tags.
- Rewrote the Privacy clearing instruction to name its tested scope. The removal copy now states both deletion and retained history.
- Updated the PWA/service-worker release, manifest, shared footer, static 404, copy audit, and verb-first 65-character catalog description to version 1.0.6.
- Preserved the warm-paper worksheet, halftone art, clipped corners, and vermilion/mustard visual system.

## Verification evidence

- Fresh clone `/tmp/recall-anchor-polish5-XoW6uo/repo` at `91b43ea`: `npm ci`, every one of the 18 claim commands independently, `npm test` (46/46), `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` all passed.
- Production suite: 46/46 passed, covering claims, offline review/export, local-only requests, demo isolation/reset, browser storage clearing, removal retention, license flows, keyboard, 390 px layout, route focus/history, metadata, service-worker updates, and the HTTP 404.
- Live Axe: zero WCAG 2 A/AA violations across Home, Demo, Cards, Privacy, Terms, and 404 in light and dark themes.
- Live URL verifier: 200, no console errors, `lang=en`, one h1, one main, no missing alt, and no unlabeled buttons. See `.factory/polish-5-live/verify.json`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.433 s; CLS 0. See `.factory/polish-5-live/lighthouse-mobile.json`.
- Bundle: 12.04 kB gzip JavaScript, 5.01 kB gzip CSS, and a 79,516 B mobile hero. Live HTML/JS/CSS hashes match `dist/`.
- Cold production evidence: `.factory/polish-5-home-390.png`, `.factory/polish-5-demo-390.png`, `.factory/polish-5-removal-1440.png`, `.factory/polish-5-privacy-1440.png`, `.factory/polish-5-terms-1440.png`, `.factory/polish-5-back-restored-390.png`, and `.factory/polish-5-404-1440.png`.
- The complete finding-by-finding mapping is in `.factory/polish-5.md`.

## Run and verify

```bash
npm ci
npm run typecheck
npm test
npm run build
npm audit --audit-level=low
npm test -- --grep @claim:<claim-id>
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test
/opt/fleet/lib/verify-url.sh https://answer-anchored-flashcards.sociobot.in .factory/polish-5-live
```

## Known gaps and next steps

None. No finding or deferred severity remains. The factory only needs to monitor the deployed static site through its normal release checks.
