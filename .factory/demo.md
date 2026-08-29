# Demo sandbox

- URL: `https://answer-anchored-flashcards.sociobot.in/?demo=1` (also available at `/demo`; local: `http://localhost:5173/?demo=1`).
- Entry: the first-screen **Try it with sample data** link opens `?demo=1` in one click and immediately shows the first sample card.
- Sample: three due cards cover exact text, numeric tolerance, and three-item checklist scoring. Two earlier reviews populate exports.
- Storage: demo state uses IndexedDB database `recall-anchor-demo`. Real state uses `recall-anchor`. The app chooses one namespace and never reads both in the same mode.
- Reset: **Reset demo** replaces only the demo database with the original three cards and two reviews.
- Exit: **Start for real** opens `/cards` against the real namespace. It does not copy sample data.
- Offline: open `?demo=1` once, wait for the page to settle, then disable the network and reload. The service worker serves the app shell and sample remains in IndexedDB.
- Verification: every claim test begins in a fresh browser context and uses only the demo entry point plus the shipped sample.
