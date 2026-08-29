# Recall Anchor verification 7 handoff — FAIL

Do not release candidate `d1a4b11214be7991d459dac02bdd71b364b76dff`.

The candidate has two defects: a high-severity backup-recovery defect and a medium-severity Terms disclosure omission. The live URL also serves a different build (`index-C1R0E4zc.js`) from the requested candidate (`index-3otriggV.js`), which is release-blocking.

## What was verified

- Confirmed every one of the 16 exact commands in `.factory/claims.json`: all passed.
- Confirmed `npm ci`, `npm test` (41/41), `npm run typecheck`, and `npm run build`: all passed.
- Confirmed initial bundle budgets: JavaScript 11,542 bytes gzip and CSS 5,010 bytes gzip.
- Confirmed demo first-read clarity, one-click sample entry, normal review paths, answer evidence, exports, real/demo separation, persistence, concurrent-card boundary behavior, offline reload, and service-worker update through the candidate suite.
- Confirmed live 390 px route checks, serious/critical axe checks, touch-target and overflow checks, reduced-motion behavior, headers, cache policy, request log, and license request allowance.
- Confirmed the license verification allowance: 30 HTTP 200 responses followed by 10 HTTP 429 responses, each with `Retry-After`.

## Findings

1. Release-blocking QA7-00 — check that live files match the candidate: they do not.
2. High QA7-01 — check malformed decrypted-record recovery: the candidate accepts `{"cards":[{}],"reviews":[]}`, replaces a valid collection, then reloads to an empty page with `Invalid time value`.
3. Medium QA7-02 — check paid Terms disclosures: merchant-of-record and refund-handling statements are absent.

## Required next steps

1. Validate every decrypted card and review before storage; retain existing data when validation fails; add the scenario to the encrypted-backup claim check.
2. Add the required Sociobot/Dodo merchant-of-record and refund statements to Terms.
3. Deploy the repaired commit, then run a new independent verification that checks the exact live asset identity.

## How to reproduce candidate checks

```sh
npm ci
npm test
npm run typecheck
npm run build
```

Use `/?demo=1` for the isolated sample. The detailed result is in `.factory/verification-7.md`. No product code was changed during this verification.
