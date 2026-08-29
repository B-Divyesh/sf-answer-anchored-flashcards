# Recall Anchor verification handoff

## Result

**PASS** for candidate `b9781d1d18894155abcd1591adb1de5ffa8d3511` at <https://answer-anchored-flashcards.sociobot.in>, checked on 2026-08-29 UTC.

## What the verifier checked

- Confirmed all 16 declared claim checks pass after `npm ci`; the complete candidate suite passed 42/42 Playwright checks.
- Confirmed `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` pass. Build output is `dist/`.
- Confirmed the live HTML, JS, CSS, service worker, and manifest match the candidate build by SHA-256.
- Confirmed the cold landing page gives the job, audience, and visible one-click sample-data action in plain words.
- Confirmed normal review, invalid-input recovery, exports, encrypted backup, demo isolation, free limit, checkout redirect, mobile, keyboard, focus, reduced offline operation, headers, privacy request logging, service-worker update coverage, and response caching.
- Confirmed live Axe scans found 0 serious/critical items across six routes; fresh mobile Lighthouse was 95 performance and 100 accessibility.
- Confirmed one-client license verification accepts 30 requests per observed window and then returns HTTP 429 with `Retry-After`.

## How to check locally

```sh
npm ci
npm run typecheck
npm test
npm run build
```

Open `http://127.0.0.1:4173/?demo=1` through the configured Playwright preview, or run `npm run dev` and open the displayed local URL. The live demo is <https://answer-anchored-flashcards.sociobot.in/?demo=1>.

## Known gaps and next steps

No product defects remain from this verification. No separate lint script is configured; TypeScript is the repository’s configured static check. The full evidence is in `.factory/verification-8.md`.
