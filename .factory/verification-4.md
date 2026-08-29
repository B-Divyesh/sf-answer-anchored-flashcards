# Independent product verification 4 — PASS

Verified 2026-08-29 UTC against candidate commit
`e01a5eda22dd816cccd27c0edb2d25b72cef1882` and the live product at
<https://answer-anchored-flashcards.sociobot.in>.

## Release decision

**PASS.** The deployed PWA matches this candidate byte-for-byte for all
checked release assets. The real typed-answer review workflow, local-first
privacy boundary, one-click demo, exports, purchase handoff, and offline PWA
path all worked from fresh browser contexts. No release-blocking defects were
found.

## Required first checks

The first cold live screen states, in plain language:

- **What:** “Score flashcards from typed answers.”
- **For whom:** “For people studying alone who want the next review date based
  on an answer, not a guessed rating.”
- **First action:** **Try it with sample data**, with “Three due cards open
  next.”

The action is visible on the first screen and opens the populated `/demo`
sandbox in one click. The sandbox has the persistent “Demo — sample data”
banner, **Reset demo**, and **Start for real**. This passes the plain-words
and demo-sandbox gates.

## Clean checkout and claims

The checked-out HEAD was exactly the requested commit and initially clean.
`npm ci` installed the lockfile dependencies (22 packages; `npm audit` found
zero vulnerabilities). Every command declared in `.factory/claims.json` was
run independently through `npm test -- --grep @claim:<id>` after that install;
each selected one tagged browser test and passed.

| Claim | Result |
|---|---|
| `offline-reload` | PASS |
| `answer-types` | PASS |
| `interval-reason` | PASS |
| `csv-export` | PASS |
| `anki-export` | PASS |
| `encrypted-backup` | PASS |
| `demo-isolation` | PASS |
| `demo-reset` | PASS |
| `local-privacy` | PASS |
| `keyboard-review` | PASS |
| `exact-normalization` | PASS |
| `free-limit` | PASS |
| `paid-desk` | PASS |
| `license-network` | PASS |
| `license-revocation` | PASS |

Further local gates passed:

- `npm test`: **39/39** Playwright tests passed.
- `npm run typecheck`: passed. There is no configured lint script.
- `npm run build`: passed and produced `dist/`.
- Controlled `tests/pwa.spec.ts`: passed; it changes the served worker in
  memory, observes **A new version is ready**, activates **Update now**, and
  confirms the replacement controller is active.
- Initial bundles: JavaScript 33,714 B raw / 11,423 B gzip; CSS 18,644 B raw /
  5,021 B gzip; mobile hero 79,516 B. All are inside the stated PWA budgets.

## Independent end-to-end evidence

On the live deployment:

- Exact, numeric-tolerance, and checklist demo cards completed normally.
  Unicode exact-answer normalization is covered by the tagged claim suite.
- Numeric `299802` scored 100% for the sample `299792 ± 10`; boundary-exceeding
  `299802.01` scored 0% and clearly said “Review again in 10 minutes.”
- A required prompt left blank produced the native “Please fill out this
  field.” recovery message; completing it then saved the card.
- A 390 px keyboard flow used the answer field, confidence selection, and
  `Ctrl+Enter` to produce “100% of the answer key matched.” The focused input
  had a visible `3px` vermilion outline. There was no horizontal overflow and
  no visible link, button, or summary control smaller than 44 px.
- With `prefers-reduced-motion`, smooth scrolling computed as `auto`, and the
  result transition computed as `0.00001s`.

## Accessibility and runtime quality

`/opt/fleet/lib/verify-url.sh` passed against the live root: HTTP 200, title,
`lang=en`, one `h1`, a `main` landmark, no missing image alternatives, no
unlabelled visible controls, and no console/page errors (894 ms navigation in
that check).

Independent Playwright axe scans on `/`, `/demo`, `/cards`, `/privacy`,
`/terms`, and the true HTTP 404 route found **zero serious or critical** WCAG
2A/2AA/2.1AA/2.2AA issues in both light desktop and dark 390 px contexts.
Successful routes emitted no console/page errors. Chromium reports the
expected failed-resource line when deliberately loading the HTTP 404 document;
there is no application exception.

Fresh mobile Lighthouse produced: Performance **90**, Accessibility **100**,
Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.4 s, CLS 0, TBT 410 ms,
and interactive 1.5 s.

## Privacy, network, deployment, and PWA

- During a live demo review and review-CSV export, the browser made only the
  document, same-origin JavaScript, and same-origin CSS requests. No request
  was off-origin; the typed answer and backup passphrase never appeared in a
  request body; no analytics, telemetry, third-party font, or CDN request was
  present. The explicit Sociobot license/check-out flows are the only allowed
  external integration.
- The root response has HSTS, `X-Content-Type-Options: nosniff`,
  strict-origin referrer policy, camera/microphone/geolocation-denying
  permissions policy, and a CSP restricted to `self` plus
  `https://api.sociobot.in` for connection/form destinations. Hashed assets
  have `public, max-age=31536000, immutable`; HTML, manifest, and service
  worker revalidate at 30 seconds.
- All landing-page links worked: internal routes returned 200, the deliberate
  unknown route returned 404, Sociobot returned 200, and the advertised
  checkout returned 303 to hosted Dodo checkout.
- The manifest declares standalone display, versioned start URL, theme and
  background colors, 192/512 icons, and a maskable icon. After first live
  `/demo` load, a service-worker controller was active. Offline reload kept
  the sample review screen and displayed “You are offline. Review and export
  still work.”
- No sign-in is used, so the Entra External ID tenant requirement is not
  applicable.

The product has no backend of its own. Its Sociobot license-verification call
was independently burst-tested with 40 invalid-license requests: **30**
returned HTTP 200 invalid verdicts, then **10** returned HTTP 429, each with
`Retry-After: 4`. Observed allowance: **30 requests per client burst window**.

Deployment identity was checked by SHA-256:

| Asset | SHA-256 | Live match |
|---|---|---|
| `index.html` | `824fd81ec2770417430748567820f9fa6f651bc68a18be35eb8e8ef426c45059` | yes |
| `assets/index-CXviTwq1.js` | `c6128d509cfbca0440ea1c725dfcbdf13b24e5b6bc28b7fcf07de44b16efe8f4` | yes |
| `assets/index-EvPMZokD.css` | `584671ae02a384547837f25fef66fe985216d0b38604c76047f8a53a66a361bf` | yes |
| `assets/hero-768-v1.webp` | `5ed74eabb88a4ec87c061226979e45f592f5eb9604f42710f3ef64611e857143` | yes |
| `assets/hero-1200-v1.webp` | `8465231b6f9fa446ebc4a1a742199a89f708c9e2d790d86981e53ee9cae88f9b` | yes |
| `assets/social-v1.webp` | `c5dd1249f69156289f025ba0512d269c495455725e673f469093797f1a49fdd0` | yes |
| `sw.js` | `3ab135b67930d66090085ac1525becffbc889025e30b50117499bc6eba658ea8` | yes |
| `manifest.webmanifest` | `61a56e95b749c5d926ff29136562313bbfdc29da510231abe4be1f2f69006ffd` | yes |

## Defects by severity

No critical, high, medium, or low product defects were found in this candidate.

## Handoff

Release candidate `e01a5eda22dd816cccd27c0edb2d25b72cef1882` is accepted. To repeat
the local verification, run `npm ci`, `npm test`, and `npm run build`; open
`/?demo=1` for the isolated sample workflow.
