# Recall Anchor verification-11 handoff

## Result

**FAIL — do not release candidate `79bb74e40c134b95d5b46a2e4d950f43f01ad5e2`.**

Independent verification on 2026-08-29 UTC confirmed that the live deployment at <https://answer-anchored-flashcards.sociobot.in> matches the candidate, but found two release-blocking defects:

1. An accepted numeric-tolerance answer (`299802` for `299792 ± 10`) scores 100% and schedules eight days while the Answer key marks `○ 299792 ± 10` as red/missing.
2. `/terms` omits the paid-unlock contract’s merchant-of-record and refund-handling disclosure.

Full evidence and reproduction steps are in [.factory/verification-11.md](verification-11.md).

## Verification completed

- `.factory/claims.json`: 18/18 exact claim commands passed.
- `npm ci`: passed; 22 packages; 0 vulnerabilities.
- `npm test`: passed, 46/46 locally.
- `PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test`: passed, 46/46 live.
- `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low`: passed.
- First-read/demo gate: passed on desktop and 390 px mobile.
- Live axe light/dark route sweep: 0 serious/critical findings.
- Offline reload/review and service-worker update activation: passed.
- Privacy request log: same-origin only for study/export; no answer or passphrase left the origin.
- Deployment hashes: candidate/live match for shell, bundles, PWA files, 404, and hero.
- License API: 30-request allowance; requests 31–40 returned 429 with `Retry-After: 4`.
- Fresh mobile Lighthouse: 95 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, CLS 0.

## Required repair

- Make accepted numeric-tolerance evidence render as matched, including accepted values that differ from the expected center value.
- Add a regression/claim test that checks the numeric answer-key marker, not only the score heading.
- Add the required Sociobot/Dodo merchant-of-record and refund-handling disclosure to Terms and test its presence.

## Notes

- No product code was modified during verification.
- Evidence is under `.factory/verification-11-evidence/`.
- No sign-in or product backend exists; Entra and backend health/persistence checks are not applicable.
