# Recall Anchor review-5 handoff

## Result

**FAIL — 3 unlisted-claim findings; no blocking finding.** The adversarial review was run against repository and live candidate `f49f8e2bb0b597f4192cbbdc5a4cd97bd29b89f0` on 2026-08-29 UTC. No product code was changed.

## What was done

- Opened the live Home page cold at 390 × 844 and 1440 × 900 and verified the job, audience, first action, outcome text, and three first-screen facts.
- Entered the one-click demo, scored realistic sample data, reset it, exited to an empty real collection, and recorded its request boundary.
- Read the brief, design, claims, README, all four earlier reviews, all four polish reports, and the prior handoff. Rechecked every earlier finding live and in source.
- Cloned remote `main` to `/tmp/recall-anchor-review5-ZlWoiY/repo`, ran `npm ci`, and ran all 16 exact claim commands independently. All passed.
- Ran the full suite against the deployed site: 43/43 passed, including light/dark Axe checks, mobile/keyboard coverage, offline use, isolation, metadata, 404, and history restoration.
- Ran `/opt/fleet/lib/verify-url.sh`; Home returned 200 with no console errors and passed its semantic checks. Crawled internal routes and required assets; all expected targets were live.

## Findings left

- `F-5-1` (major): “Clear this site’s storage to remove every local record” has no claim entry or test.
- `F-5-2` (major): “Its past review rows stay in exports” after card removal has no claim entry or outcome test.
- `F-5-3` (minor): “Remove cards from the Cards page” has no registered claim or persistence test.

The complete evidence, copy audit, claim matrix, and 26-item regression audit are in [.factory/review-5.md](review-5.md).

## Verification commands

```sh
npm ci
npm test -- --grep @claim:<claim-id>
PLAYWRIGHT_BASE_URL=https://answer-anchored-flashcards.sociobot.in npm test
/opt/fleet/lib/verify-url.sh https://answer-anchored-flashcards.sociobot.in <evidence-directory>
```

## Next step

Add one exact tagged claim test for full local-data clearing and one for card removal plus retained review rows, or narrow/remove the three promises. Then rerun all claims and the adversarial checklist.
