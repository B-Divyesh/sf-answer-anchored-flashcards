# Recall Anchor

Score flashcards from the answer you type, not a rating you guess.

Recall Anchor is an offline-first study tool for self-learners. It supports exact text, numeric tolerance, and checklist recall. Each review records the typed answer, confidence, rubric match, and interval reason.

Live site: <https://answer-anchored-flashcards.sociobot.in>

## Try the isolated demo

Open `/demo` or <https://answer-anchored-flashcards.sociobot.in/demo>. It loads three due cards in a separate IndexedDB database. Use **Reset demo** to restore the sample. Use **Start for real** to open your own empty collection.

## What it includes

- Exact, numeric tolerance, and checklist cards.
- Evidence-led intervals with a plain reason after each answer.
- Offline review after the first visit.
- Review CSV and Anki-field CSV exports.
- Passphrase-encrypted backup and restore using AES-GCM.
- Keyboard review, including `Ctrl+Enter` to score.
- A free 30-card plan.
- Recall Anchor Desk for $19 once, with unlimited cards and review trends.

Cards and reviews use browser IndexedDB. Demo data uses a separate `recall-anchor-demo` database. License tokens use the documented `sb_license:answer-anchored-flashcards` localStorage key. The app contacts Sociobot only to buy or verify Desk.

## Develop

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The production build is static.

## Test and build

```sh
npm test
npm run build
```

`npm test` builds the product and runs Playwright claim, accessibility, persistence, route, and 390 px mobile checks. The exact deployment command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at its root.

Each product claim and its sandbox test is listed in [.factory/claims.json](.factory/claims.json). Demo behavior is documented in [.factory/demo.md](.factory/demo.md).

## Deploy

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` supplies SPA fallback, security headers, and the 404 response for Azure Static Web Apps. The factory owns DNS and deployment.

## Privacy and payment

There are no analytics, third-party fonts, or third-party runtime scripts. Study data does not leave the browser. The one-time Desk purchase uses Sociobot’s hosted checkout and license verification. Sociobot and Dodo act as merchant of record.

See `/privacy` and `/terms` in the app.

## License

MIT. See [LICENSE](LICENSE).
