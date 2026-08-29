# Recall Anchor review 3 handoff

## Result

**FAIL** for commit `cdd7638feabccb9913bcf3d22a680a8f6d50ef29` and the live site checked on 2026-08-29 UTC.

Two blocking regressions remain. The live Terms page again claims that Sociobot/Dodo is merchant of record and handles refunds. These are the previously closed F-1-7 and F-1-8; neither is registered or proven by a contract-backed claim test. Full evidence and concrete fixes are in `.factory/review-3.md` as F-3-1/F-1-7 and F-3-2/F-1-8.

## Verification completed

- Cold 390 × 844 and 1440 × 900 first-screen checks passed.
- The live one-click demo, reset, real-data isolation, same-origin request log, and offline scoring passed.
- All 16 exact `claims.json` commands passed independently from `/tmp/recall-anchor-review3-9P9Ntk/repo`.
- The full clean-clone `npm test` passed 42/42 and produced `dist/` (12.09 kB gzip JavaScript).
- Live route, metadata, link, 404, Back/Forward focus/scroll, and asset-hash checks passed.
- Live Axe checks reported zero WCAG 2 A/AA violations across six routes in light and dark modes; `verify-url.sh` passed Home.

## Next step

Remove the two unsupported Terms clauses, or add distinct claims backed by an authoritative purchase/refund policy rather than a test that only checks the sentence is displayed. Rerun every claim command and the cumulative history audit afterward.
