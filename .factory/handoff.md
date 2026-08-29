# Recall Anchor — adversarial review 6 handoff

## Result

Review 6 is complete against commit `aed015d228c1d6fc28740aeb7c683825be5a11cd` and <https://answer-anchored-flashcards.sociobot.in> on 2026-08-29 UTC.

Verdict: **FAIL — 3 findings: 2 blocking regressions and 1 minor.** The detailed report is [review-6.md](review-6.md).

No product code was changed. The review and this handoff are the only intended repository changes.

## Verification performed

- Fresh 390 × 844 and 1440 × 900 browser contexts for the first-read gate.
- Live one-click demo, realistic sample, scoring, reset, real-mode exit, IndexedDB separation, request log, and console log.
- Every exact command in `.factory/claims.json` independently from clean clone `/tmp/recall-review6-ekAMj0/repo`: 18/18 passed.
- Clean-clone `npm test`: 47/47 passed and produced `dist/`.
- Full deployed suite: 47/47 passed.
- Live `verify-url.sh`: no console errors; title, `lang`, one h1, main, alt text, and button names passed.
- Playwright Axe light/dark route checks, mobile target/overflow checks, keyboard review, offline review/export, Back/Forward focus/scroll, metadata, headers, link crawl, and real HTTP 404 passed.
- Live HTML, JavaScript, and CSS hashes match the clean production build. JavaScript is 12,084 bytes gzip.
- Every finding in review rounds 1–5 and every polish report was rechecked in live behavior and source.

## Known gaps

1. **Blocking:** `/terms` again says “Sociobot/Dodo is the merchant of record” without a matching claim entry or authoritative contract-backed test. This repeats F-3-1 / F-1-7.
2. **Blocking:** `/terms` again promises refund handling and now promises automatic refund revocation without matching claim entries or authoritative outcome tests. This repeats F-3-2 / F-1-8.
3. **Minor:** the designed 404 h1, “This page is not in the deck,” is metaphorical and does not identify the error on its own.

## Next step

Remove or separately register and authoritatively test the legal claims. Change both static and client-side 404 headings to “Page not found.” Then rerun the full review from a clean context; PASS still requires zero findings.
