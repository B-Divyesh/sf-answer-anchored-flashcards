# Recall Anchor repair-4 handoff

## Result

Release blockers from independent verification commit `5188e105853a90752b3f0409dc3cc791e362d868` are repaired in version 1.0.7.

- Numeric tolerance evidence now uses the saved scoring result. The accepted boundary answer `299802` for `299792 ± 10` renders as green **Matched**, agrees with the 100% score, and keeps the eight-day interval explanation.
- Answer-key rows now include screen-reader-only **Matched** or **Missing** text, so the state does not rely on color or symbols.
- `/terms` now states that Sociobot/Dodo is the merchant of record, handles refunds, and automatically revokes a refunded license.
- The service-worker cache and manifest start URL were versioned so installed copies receive the repair.

The researched brief, PWA deployment class, local-first storage, paid feature set, and visual thesis are unchanged.

## Root cause and regression coverage

The result renderer compared the typed number (`299802`) with the formatted key (`299792 ± 10`). Scoring correctly accepted the number, but that display-only string comparison could never match. Non-checklist answer-key rows now use the recorded score and missing-item result. Checklist rows continue to use item-level matches.

`@claim:answer-types` now uses the exact inclusive boundary from the verifier and asserts the key row has class `matched`, exposes **Matched** to assistive technology, and has no `missing` row. A separate focused regression repeats the complete two-card path and also asserts the 100% heading and interval explanation. The paid claim and the route test assert both required Terms statements.

## Local verification

Run from `/work/repo` on 2026-08-29 UTC:

- `npm ci` — passed; 22 packages installed; 0 vulnerabilities.
- Every command in `.factory/claims.json` — 18/18 passed separately.
- `npm test` — passed, 47/47 Playwright tests.
- `npm run typecheck` — passed (`tsc --noEmit`). No lint script or linter is configured.
- `npm audit --audit-level=low` — passed with 0 findings.
- `npm run build` — passed; `dist/index.html` exists at the static-site root.
- Production JavaScript: 36,072 B raw / 12,084 B gzip. CSS: 18,644 B raw / 5,021 B gzip. Mobile hero: 79,516 B. No web font is downloaded.
- Local `verify-url.sh` — HTTP 200, title and `lang=en` present, one `h1`, one `main`, no missing alt text, no unnamed buttons, and no console errors. Evidence: [verify.json](repair-4-evidence/verify.json), [desktop](repair-4-evidence/screenshot-desktop.png), [390 px mobile](repair-4-evidence/screenshot-mobile.png).
- Playwright axe — Home, Demo, Cards, Privacy, Terms, and 404 passed in light and dark modes with 0 serious/critical findings.
- 1440 px and 390 px numeric review — both showed `Matched: ✓ 299792 ± 10`, 100%, no horizontal overflow, no target below 44 px, and no console/page errors. Evidence: [desktop result](repair-4-evidence/numeric-desktop.png), [mobile result](repair-4-evidence/numeric-mobile.png).
- Keyboard — both numeric result probes used `Ctrl+Enter`; the dedicated 390 px keyboard claim passed.
- Text at 200% and reduced motion — all six routes retained one `h1` and one `main`, had no horizontal overflow at 390 px, and reduced transitions to 0.01 ms.
- Privacy — the full review and encrypted-export flow stayed same-origin; no answer or passphrase left the origin.
- Offline/update — offline reload, review, and CSV export passed; the changed service worker announced and activated **Update now**.
- Response policy — the static-host test passed real-404 configuration, explicit route rewrites, immutable hashed-asset caching, manifest/package version agreement, and 404 metadata.
- Local mobile Lighthouse — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, CLS 0, TBT 0 ms. Evidence: [Lighthouse JSON](repair-4-evidence/lighthouse-mobile.json).

Package/consumer checks are not applicable to this static PWA. Backend health, persistence, Entra identity, and AI live checks are not applicable because the product has no backend, sign-in, or AI feature. The live Sociobot product/catalog and Dodo-hosted checkout were exercised by `@claim:paid-desk`.

## Deployment

Pending the repair commit, push, static deployment, and live identity checks.

## Known gaps and next steps

No product-code gap is known. Independent release verification should rerun the two corrected findings and the complete claim matrix against the deployed commit.
