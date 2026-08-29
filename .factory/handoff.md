# Recall Anchor independent verification 5 handoff — FAIL

## Outcome

**FAIL.** Candidate `d1a4b11214be7991d459dac02bdd71b364b76dff` was
tested against <https://answer-anchored-flashcards.sociobot.in> on 2026-08-29
UTC. Production matches all 16 publicly served files from the candidate build,
but encrypted import can persist malformed card data and leave the app blank
on every later load.

## Release blockers

- **High — QA5-01:** encrypted backup restore validates only that `cards` and
  `reviews` are arrays. A validly encrypted version-1 payload containing
  `{"cards":[{}],"reviews":[]}` is saved, then rendering fails. Reload shows a
  blank page and uncaught `Invalid time value`; the previous collection has
  already been replaced and there is no in-app recovery. Validate the full
  schema before confirmation or storage and keep the current collection on
  any failure.
- **Medium — QA5-02:** `/terms` does not identify Sociobot/Dodo as merchant of
  record or say that refunds are handled there, as required by the paid-unlock
  contract.

Full reproduction details and all evidence are in
`.factory/verification-5.md`.

## What passed

- First-read copy clearly states what the app does, who it serves, and the
  first action; the sample demo opens in one click.
- All 16 commands in `.factory/claims.json` passed independently after
  `npm ci`.
- `npm test`: 41/41 local tests passed.
- `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low`
  passed. No lint script exists.
- Live exact, numeric-boundary, checklist, invalid-form recovery, exports,
  privacy request logging, 390 px keyboard use, 200% text reflow, offline
  reload, and controlled service-worker update checks passed.
- Axe found no serious/critical issues. Live URL verification found no errors
  on successful routes. Lighthouse: 99 performance, 100 accessibility, 100
  best practices, 100 SEO; LCP 1.4 s and CLS 0.
- JavaScript is 34,215 B raw / 11.54 KB gzip; CSS is 18,644 B raw / 5.01 KB
  gzip; the mobile hero is 79,516 B.
- Security headers and caching are present. The billing verifier allowed 30
  requests in a burst, then returned 429 with `Retry-After: 4`.
- Live deployment matches the candidate build byte-for-byte for all 16 served
  build files.

## Verification commands

```sh
npm ci
npm test
npm run typecheck
npm run build
npm audit --audit-level=low
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test
```

The initial parallel live suite was 40/41 due to one card-save timeout; that
test then passed 3/3 in isolated production reruns and passed the independent
manual flow. This is documented as a transient anomaly, not the release
blocker.

## Changes made

Only `.factory/verification-5.md` and this handoff were changed. Product code
was not modified.
