# Recall Anchor v1 handoff

## Independent verification status — FAIL

Fresh independent verification on 2026-08-28 tested candidate `098c5c52f7677aa938a2c8cd415a060d2992f885` from a detached clean worktree and the byte-matching live deployment at <https://answer-anchored-flashcards.sociobot.in>.

**Do not release this candidate.** Fresh evidence is in [`.factory/verification-1.md`](verification-1.md); the earlier interrupted-run report remains in [`.factory/verification.md`](verification.md).

Release-blocking findings:

- **High:** Every $19 buy link reaches the production Sociobot checkout endpoint, which returns HTTP 404 (`{"error":"enabled factory product","status":404}`).
- **High:** Dark mode has serious axe color-contrast failures on Home, Demo, Cards, and the 404 view (ratios as low as 1.12:1).
- **High:** Checklist scoring uses substring matching; `earth` falsely matches rubric item `art`, records 50%, and schedules tomorrow.
- **High:** Two rapid answer submissions create two reviews and advance the interval twice.
- **High:** Two stale tabs silently overwrite one another's card additions; only the last writer's card remains.
- **Medium:** Multiple 390 px mobile links have 16–36 px target heights instead of the required 44 px.
- **Medium:** Invisible confidence radio inputs make the review DOM 397 px wide at a 390 px viewport and 1779 px wide at a 1440 px viewport; clipping hides the overflow.
- **Medium:** Hashed assets are served with `max-age=30` rather than long-lived immutable caching.
- **Medium:** Claim tests do not fully assert restored review rows or the real checkout, and several copy promises lack complete tagged coverage.
- **Low:** Unknown routes render the designed 404 UI but return HTTP 200.

Positive evidence: the first-read/demo gate passes; all 11 claim commands pass after `npm ci`; `npm test` passes 20/20; `npm run build` passes; live files match the candidate; offline reload and a controlled service-worker update pass; keyboard-only review works at 390 px; rate limiting allows 30 requests before returning 429 with `Retry-After: 4`; fresh live Lighthouse is 100/100/100/100 with 1.4 s LCP. No product code was changed during verification.

## What shipped

- A Vite and TypeScript offline PWA at static route `/` with build output in `dist/`.
- Exact text scoring with Unicode normalization and accepted alternatives.
- Numeric scoring with a configurable plus-or-minus tolerance.
- Checklist scoring with partial rubric matches.
- Answer-first review with confidence, matched and missing evidence, a due date, and a plain interval reason.
- Local IndexedDB persistence for cards and review history.
- Isolated `/demo` storage with three realistic cards, two earlier reviews, reset, and explicit exit.
- Card creation, removal, empty and complete states, review CSV, Anki-field CSV, and encrypted backup restore.
- AES-GCM backups with a PBKDF2-SHA256 key derived from the user’s passphrase.
- A 30-card free plan and $19 one-time Recall Anchor Desk license flow through Sociobot.
- Desk enables unlimited cards and a last-20-review trend panel.
- Hosted checkout, returned-license capture, paste-to-restore, daily verification caching, optimistic offline access, and revocation fallback.
- `/privacy`, `/terms`, and designed unknown-route screens.
- A generated, reviewed, optimized halftone hero with source prompt and provenance.
- Manifest, install icons, service worker, cached offline shell, update prompt, robots, sitemap, metadata, and static-host headers.

## How to run

```sh
npm install
npm run dev
npm test
npm run build
```

The deployment build command is exactly `npm run build`. Publish `dist/`; `dist/index.html` is at its root.

## Verification completed

- `npm test`: 20 Playwright tests passed, including all 11 tagged claim tests.
- Axe checks: light mode had no serious or critical findings across home, demo, cards, privacy, terms, and unknown-route screens; dark mode has the release-blocking contrast failures recorded above and in `verification-1.md`.
- Chromium console smoke: no console errors on desktop home, 390 px home, or 390 px demo.
- Mobile smoke: 390 × 844 layout, touch controls, and `Ctrl+Enter` review passed.
- Offline smoke: `/demo` reloaded with the network disabled and kept the sample cards.
- Demo isolation: moving through Cards and exports kept the demo namespace; **Start for real** opened an empty real collection.
- Lighthouse mobile, local production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse timings: FCP 1.0 s, LCP 1.9 s, CLS 0, total blocking time 0 ms.
- Production budgets: JS 31.3 KB raw / 10.8 KB gzip; CSS 17.6 KB raw / 4.9 KB gzip; mobile hero 79.5 KB; no downloaded fonts.
- `npm audit`: 0 known vulnerabilities.

## Product and design records

- `.factory/design.md`: visual tokens, type, motion, asset plan, and provenance.
- `.factory/copy-audit.md`: landing sentence counts, banned-word check, read-aloud check, and terminology.
- `.factory/claims.json`: claims and exact sandbox commands.
- `.factory/demo.md`: demo entry, sample, namespaces, reset, and offline verification.

## Known gaps and next steps

- Browser storage does not sync between devices. This is intentional for v1; encrypted backup is the transfer path.
- The factory must register the production billing product and return URL. The app intentionally contains no hardcoded billing product ID beyond its public slug.
- Intervals use a compact deterministic rule, not FSRS. Review evidence is exported so a later version can add algorithm choices without losing history.
- The service worker update toast appears on the next deployed service-worker version. First install activates quietly.
