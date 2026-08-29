# Recall Anchor

Score flashcards from typed answers, not guessed ratings.

Recall Anchor is a study tool for people who study on their own. Type an answer, compare it with the answer key, and see the next review date. After your first visit, it works without an internet connection.

Live site: <https://answer-anchored-flashcards.sociobot.in>

## Try the isolated demo

Open `?demo=1` or <https://answer-anchored-flashcards.sociobot.in/?demo=1>. It opens three due sample cards in separate browser storage. Use **Reset demo** to restore the sample. Use **Start for real** to open your own empty collection.

## What it includes

- Exact answers, numbers within a range, and lists of required points.
- A typed answer, answer-key result, and next review date after every review.
- Offline review after the first visit.
- Review CSV and Anki-formatted card CSV downloads.
- Download an encrypted backup and restore it with your passphrase.
- Keyboard review, including `Ctrl+Enter` to score.
- A free 30-card plan.
- A $19 one-time Recall Anchor Desk license with unlimited cards and review trends.

Cards and reviews stay in browser storage. Demo data stays separate from real cards. Sociobot is contacted only for a Desk checkout or license verification.

### Technical details

Cards and reviews use IndexedDB. Demo data uses the separate `recall-anchor-demo` database. Encrypted backups use AES-GCM. License tokens are namespaced in localStorage.

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

There are no analytics, third-party fonts, or third-party runtime scripts. Study data does not leave the browser. The one-time Desk purchase uses Sociobot’s hosted checkout and license verification.

See `/privacy` and `/terms` in the app.

## License

MIT. See [LICENSE](LICENSE).
