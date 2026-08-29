# Independent product verification 5 — FAIL

Verified 2026-08-29 UTC against candidate commit
`d1a4b11214be7991d459dac02bdd71b364b76dff` and the live product at
<https://answer-anchored-flashcards.sociobot.in>.

## Release decision

**FAIL.** The candidate and live deployment match, the first-read/demo gates
pass, and all 16 registered claim tests pass. However, a malformed but
correctly encrypted backup is committed to IndexedDB before its card schema is
validated. The next load is a blank page with an uncaught `Invalid time value`
error. This can replace a user's working collection with data the app cannot
render, with no in-app recovery path.

The paid terms also omit the required merchant-of-record and refund handling
disclosure.

## Required first checks

The first cold live screen answers all three questions in plain words:

- **What:** “Score flashcards from typed answers.”
- **For whom:** “For people studying alone who want the next review date based
  on an answer, not a guessed rating.”
- **First action:** **Try it with sample data**, beside “Three due cards open
  next.”

The action is visible without scrolling at 1440×900 and 390×844. It opens the
populated demo in one click. The persistent banner says “Demo — sample data,
nothing is saved to your cards” and provides **Reset demo** and **Start for
real**. This gate passes.

## Claims gate

`.factory/claims.json` exists. From the clean candidate checkout, `npm ci`
installed 22 packages with zero audit vulnerabilities. Every listed command
was then run separately through the product's demo entry point. Each ID occurs
on exactly one test.

| Claim | Result |
|---|---|
| `offline-reload` | PASS |
| `answer-types` | PASS |
| `interval-reason` | PASS |
| `csv-export` | PASS |
| `anki-export` | PASS |
| `encrypted-backup` | PASS |
| `demo-isolation` | PASS |
| `demo-sample` | PASS |
| `demo-reset` | PASS |
| `local-privacy` | PASS |
| `keyboard-review` | PASS |
| `exact-normalization` | PASS |
| `free-limit` | PASS |
| `paid-desk` | PASS |
| `license-network` | PASS |
| `license-revocation` | PASS |

The first attempt before dependency installation could not start because
`tsc` was not installed. That was environment bootstrap, not a product test;
the authoritative post-`npm ci` runs above all passed.

## Defects by severity

### High — QA5-01: structurally invalid encrypted backup corrupts saved state

Reproduced in a fresh production browser context:

1. Open `/cards` and enter the passphrase `valid-pass`.
2. Create an AES-GCM/PBKDF2 envelope with the documented version-1 format and
   correct passphrase, but decrypted payload `{"cards":[{}],"reviews":[]}`.
3. Select it and choose **Import encrypted backup**.
4. Accept the explicit replacement confirmation.
5. Reload `/cards`.

Observed:

- `decryptBackup` accepts any two arrays and does not validate card/review
  fields.
- The invalid payload is saved before the render fails.
- The import surface misleadingly reports “The backup could not be opened.
  Check the file and passphrase.”
- Reload produces an empty body, zero `h1` elements, and the uncaught page
  error `Invalid time value`.
- The persisted bad record cannot be removed through the app. Clearing site
  storage or using developer tools is required. If a real collection existed,
  the confirmed replacement has already overwritten it.

This violates the required invalid-input recovery path and makes encrypted
restore unsafe. Validate the complete decrypted schema before confirmation or
any write, and leave the prior collection untouched on every validation or
render failure.

### Medium — QA5-02: paid terms omit required purchase disclosures

The `/terms` purchase section says only that checkout is hosted by Sociobot and
that the license must stay active. It does not state that Sociobot/Dodo is the
merchant of record or that refunds are handled there, both required by the
paid-unlock contract. Add those plain-language disclosures to `/terms`.

## Clean checkout and build evidence

- Initial repository state: clean `main` at the exact requested SHA.
- Runtime: Node `v22.23.2`, npm `10.9.8`.
- `npm test`: **41/41 passed** locally.
- `npm run typecheck`: passed.
- There is no configured lint script.
- Exact production command `npm run build`: passed and produced `dist/`.
- `npm audit --audit-level=low`: zero vulnerabilities.
- Build output: JavaScript 34,215 B raw / 11.54 KB gzip; CSS 18,644 B raw /
  5.01 KB gzip; mobile hero 79,516 B. There are no downloaded fonts.

The complete suite was also run against production. Its first parallel run was
40/41: the real-card persistence check timed out once with the completed form
still visible. That same production test then passed three consecutive times
with one worker, and an independent card creation/recovery flow also passed.
This is recorded as a transient test anomaly, not a reproduced product defect.

## End-to-end and boundary evidence

Fresh production contexts verified:

- Uppercase decomposed `CAFÉ` with extra spaces scored 100% against `café`.
- Numeric `299802` (the inclusive `299792 ± 10` boundary) scored 100%.
- Numeric `299802.01` scored 0% and scheduled review in 10 minutes.
- `claim evidence reasoning` matched all three checklist items.
- A blank required prompt was blocked with “Please fill out this field.”
- A missing exact answer, one-item checklist, and negative numeric tolerance
  each produced specific guidance; correcting each input allowed saving.
- A short backup passphrase, missing backup file, and invalid JSON backup each
  produced actionable errors without a request leaving the origin.
- Valid review CSV, Anki CSV, and encrypted backup/restore paths passed their
  registered outcome tests.
- Concurrent free-plan creation stopped storage at 30 cards, and duplicate
  submission created only one card.
- The live catalog lists Recall Anchor Desk at USD 19.00; checkout returns 303
  to `checkout.dodopayments.com`.

## Accessibility and responsive behavior

`/opt/fleet/lib/verify-url.sh` passed on the live root: HTTP 200, descriptive
title, `lang=en`, one `h1`, a `main`, complete image alternatives, labelled
controls, and no console/page error on successful load (948 ms in that run).

Independent Playwright Axe scans found zero serious or critical WCAG
2A/2AA/2.1AA/2.2AA findings on `/`, `/demo`, `/cards`, `/privacy`, `/terms`,
and the true 404 route at desktop size, plus the demo at 390 px in dark and
reduced-motion modes. The only console error seen in that crawl was Chromium's
expected failed-resource message for the intentional HTTP 404.

- A 390 px review completed using only the keyboard from the autofocus answer
  field: type, Tab to confidence, Space, then Ctrl+Enter.
- Keyboard focus on confidence has a 3 px visible outline. Its contrast is
  3.76:1 on light paper and 5.80:1 on the dark surface.
- No visible link, button, or summary was below 44 px on the mobile paths.
- No horizontal overflow occurred at 390 px, including after setting root text
  to 200%, on `/`, `/demo`, `/cards`, and `/privacy`.
- Under reduced motion, scrolling computes to `auto` and result animation to
  `0.00001s`.

Fresh mobile Lighthouse 12.8.2: Performance **99**, Accessibility **100**,
Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.4 s, TBT 130 ms, CLS 0,
and Speed Index 0.9 s.

## Privacy, headers, links, PWA, and deployment

- A full live demo review, scoring, card creation, export, backup, invalid
  input, and route scan produced no off-origin request. No answer or backup
  passphrase appeared in any request body. There were no analytics, telemetry,
  external font, or external script requests. Explicit billing actions remain
  the documented exception.
- The root response has HSTS, `nosniff`, strict-origin referrer policy, a
  camera/microphone/geolocation-denying permissions policy, and a CSP limited
  to self plus `api.sociobot.in` for connections/forms.
- HTML, service worker, and manifest revalidate at 30 seconds. Hashed assets
  return `public, max-age=31536000, immutable`.
- Every application route returned 200 with one `h1` and its own title. The
  designed unknown route returned a true HTTP 404. All non-404 internal links
  and the Param Factory link returned 200.
- The live service worker controlled the demo with cache
  `recall-anchor-v5`. After going offline, reload showed “You are offline.
  Review and export still work”; a review scored 100% and CSV still
  downloaded. The controlled update test replaced the worker, exposed the
  update notice, activated **Update now**, and confirmed the new controller.
- The manifest uses standalone display, a versioned start URL, matching theme
  colors, 192/512 icons, and a maskable 512 icon.
- All 16 publicly served files in the local `dist/` matched production by
  SHA-256. Key hashes: `index.html`
  `ab04c5d645bd391defa41ac3cab1c18067f6f4ae7ea39fafa6a752f8b8ffe754`,
  JavaScript
  `4a37cca31c01cde2df2112698b01b6ae51ea972be130b9ba69be2a1aa2518469`,
  CSS `584671ae02a384547837f25fef66fe985216d0b38604c76047f8a53a66a361bf`,
  and service worker
  `3ab135b67930d66090085ac1525becffbc889025e30b50117499bc6eba658ea8`.
- The product has no backend or sign-in, so persistence/health identity and
  Entra tenant checks do not apply. Its only server-side product endpoint is
  Sociobot billing. A fresh 40-request invalid-license burst returned 30 HTTP
  200 invalid verdicts followed by 10 HTTP 429 responses. Every 429 included
  `Retry-After: 4`; observed allowance is 30 requests per client burst window.

## Contract and documentation review

The repository includes the researched brief, product-specific visual thesis
and generated-art provenance, demo documentation, copy audit, privacy and
terms routes, README, and MIT license. The live/README claims map to the 16-item
claim register. The PWA is local-first and does not require AI or sign-in.

The report-only verification changes do not modify product code.
