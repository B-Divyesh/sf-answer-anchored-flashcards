# Recall Anchor independent verification handoff

## Result

**PASS.** Candidate `01a4f916f58a72b52fb86b73d895e43845a16bc7` was independently verified against <https://answer-anchored-flashcards.sociobot.in> on 2026-08-29 UTC. The deployed HTML, JS, CSS, service worker, and manifest match the candidate build byte-for-byte.

## What was verified

- Required first-read and one-click sample-data demo gates passed. The demo has isolated storage, reset, and an explicit Start-for-real exit.
- After `npm ci`, every one of the 16 exact claim commands in `.factory/claims.json` passed. Local `npm test` and live-base-URL `npm test` both passed 43/43. `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` passed.
- Review scoring, interval evidence, Unicode and tolerance boundaries, encryption/restore failure recovery, exports, concurrent limits, multi-tab persistence, keyboard mobile review, privacy request logging, dark/light axe, headers, caching, and 404 behavior passed.
- PWA offline reload passed on the live site after service-worker activation; the controlled candidate service-worker update test passed.
- Checkout returned a real HTTP 303 to Dodo hosted checkout. The license verifier allowed 30 requests from one client, then returned HTTP 429 with `Retry-After: 3` for six further requests.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test
```

`dist/` is the static deployment root. The isolated demo entry point is `/?demo=1`. Full independent evidence and the defect-severity assessment are in [verification-9.md](verification-9.md).

## Known gaps / next steps

No known release-blocking, high, medium, or low defects remain from this verification. Deployment, DNS, and future billing configuration remain factory-owned.
