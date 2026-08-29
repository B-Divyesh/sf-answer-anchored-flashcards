# Recall Anchor repair handoff

## Scope

This repair addresses the two findings recorded in `.factory/verification-6.md` for candidate `d1a4b11214be7991d459dac02bdd71b364b76dff`.

## Changes

- Encrypted backup import now validates the full decrypted version-1 schema before showing the replacement confirmation or writing to IndexedDB. Cards and reviews require all fields used by the app; validation checks card type, required text, timestamps, number ranges, review confidence, list values, intervals, and duplicate IDs.
- Invalid decrypted data reports an actionable status and leaves the active collection unchanged. The in-memory collection changes only after a validated replacement is saved.
- `/terms` now states that Sociobot/Dodo is the merchant of record and handles refunds for Desk purchases.
- The encrypted-backup claim includes malformed-data recovery, and the README documents validation before replacement.

## Reproduction and regression coverage

Before the repair, a browser test generated a valid AES-GCM/PBKDF2 version-1 envelope using passphrase `valid-pass` with decrypted JSON `{"cards":[{}],"reviews":[]}`. Import accepted it, so the expected recovery status was absent. This is the verifier's reported input.

`tests/regressions.spec.ts` now confirms that this exact envelope, and a malformed review envelope, are rejected before any replacement confirmation; the existing card remains visible after reload and no page error occurs. `@claim:encrypted-backup` repeats the malformed-card scenario after a valid restore and verifies that the demo collection remains intact. The paid claim checks the Terms disclosure.

## Verification

Run from a clean install:

```sh
npm ci
npm run typecheck
npm test
npm run build
npm audit --audit-level=low
```

Results in this repair checkout:

- `npm ci`: 22 packages installed; audit reported 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm test`: passed, 42 Playwright tests. This includes desktop, 390 px mobile keyboard review, Playwright Axe coverage, privacy request checks, offline reload, service-worker update, response-policy configuration, all 16 claims, and the new recovery tests.
- `npm run build`: passed and produced `dist/index.html`; JavaScript is 12.09 KB gzip and CSS is 5.01 KB gzip.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174`: passed with 200, title, `lang=en`, one h1, main landmark, image alternatives, labelled buttons, and no browser console/page errors.
- No standalone `lint` script is configured in `package.json`; TypeScript is the configured static check.
- The standalone Axe CLI could not create a browser session because the container has no system Chrome binary. The project's Playwright Axe tests passed across the configured routes and themes.

## Deployment

The artifact remains a static Vite PWA. Repair commit `08fa80d` was pushed to
`origin/main`. The built `dist/` was deployed with
`/opt/fleet/lib/deploy-static.sh answer-anchored-flashcards dist` using the
existing `public/staticwebapp.config.json`.

- Azure Static Web Apps deployment ID: `acf5eeca-9232-47d0-98ea-76a92914bce9`.
- Target app: `white-stone-0a0112110.7.azurestaticapps.net` (existing
  Central US app); the managed custom domain
  `https://answer-anchored-flashcards.sociobot.in` returned HTTP 200 after the
  upload.
- Live `verify-url.sh` completed in 954 ms with no console/page errors and
  the required title, language, h1, main landmark, image alternatives, and
  labelled buttons.
- The live malformed-encrypted-import regression and live paid Terms claim
  both passed against the custom domain after deployment.

## Known gaps

No product behavior is intentionally deferred. The only local tooling limitation was the standalone Axe CLI browser dependency noted above.
