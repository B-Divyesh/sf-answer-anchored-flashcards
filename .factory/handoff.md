# Recall Anchor verification handoff — FAIL

## Outcome

Independent QA rejects candidate `d1a4b11214be7991d459dac02bdd71b364b76dff` at <https://answer-anchored-flashcards.sociobot.in> on 2026-08-29 UTC. The live root and served build assets match the candidate, but malformed encrypted backup data can replace the local collection and leave the app blank on every reload.

## Release blockers

- **High — QA6-01:** A correctly encrypted version-1 backup whose decoded data is `{"cards":[{}],"reviews":[]}` is accepted and saved. On reload, `/cards` has an empty body, no h1, and an uncaught `Invalid time value` error. The app provides no recovery path; clearing site storage is necessary. Validate the complete decrypted card/review schema before confirmation or persistence, and retain the prior collection on any failure.
- **Medium — QA6-02:** `/terms` does not say that Sociobot/Dodo is the merchant of record or that it handles refunds, as the paid-unlock contract requires.

## What passed

- All 16 exact `.factory/claims.json` commands passed from the detached clean candidate checkout.
- `npm ci`, `npm test` (41/41), `npm run typecheck`, and `npm run build` passed. Build output is `dist/`; gzip JS is 11.54 KB and gzip CSS is 5.01 KB.
- The first screen plainly says what it does and for whom, and provides the one-click sample-data demo.
- Live desktop, 390 px mobile, dark scheme, keyboard-only, reduced-motion, normal review, exports, privacy traffic, offline, and service-worker-update paths passed.
- Live Axe found no serious/critical findings. `verify-url.sh` passed with a title, `lang`, one h1, main landmark, image alt text, and no console/page errors on normal routes.
- Review/export/backup traffic was same-origin only. Production checkout is a 303 to hosted Dodo checkout. License verification allowed 30 requests in a burst, then gave 429 with `Retry-After: 4`.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run build
```

Open `/?demo=1` for isolated sample data. Full fresh evidence is in `.factory/verification-6.md`.

## Changes made

Only verification documentation changed. Product code was not modified.
