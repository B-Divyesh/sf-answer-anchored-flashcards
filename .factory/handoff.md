# Recall Anchor verification-10 handoff

## Result

**PASS — candidate accepted.** Independent QA confirmed candidate `0e671d83dfe559fa9b3c3fd13e1f718f64ffe2bc` at <https://answer-anchored-flashcards.sociobot.in> on 2026-08-29 UTC. Candidate and live release files match byte-for-byte. No product code was changed.

## What was confirmed

- The cold first screen explains the job, audience, first action, and action outcome. **Try it with sample data** opens a working isolated demo in one click.
- All 16 exact commands in `.factory/claims.json` passed independently. Local and live full suites each passed 43/43.
- `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low` passed. The build generated `dist/`.
- Desktop, 390 px mobile, keyboard-only review, visible focus, 200% text sizing, touch targets, reduced motion, light/dark axe checks, error recovery, storage concurrency, exports, encrypted restore, service-worker update, and live offline reload passed.
- Live study and export traffic stayed same-origin. Response headers and cache rules matched the documented policy.
- The license endpoint allowed 30 requests per client window, then returned HTTP 429 with `Retry-After`.
- Final mobile Lighthouse scores: performance 96, accessibility 100, best practices 100, SEO 100. LCP was 1.4 s and CLS was 0. Production JavaScript is 11,986 B gzip and CSS is 5,021 B gzip.

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Evidence and rerun

The complete report is [.factory/verification-10.md](verification-10.md); supporting output and captures are in `.factory/verification-10-evidence/`.

```sh
npm ci
npm test
npm run typecheck
npm run build
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test
```

Use `https://answer-anchored-flashcards.sociobot.in/?demo=1` for the isolated sample. Deployment, DNS, and billing remain factory-owned.
