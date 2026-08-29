# Recall Anchor verification 7 handoff — candidate FAIL

## Outcome

Do not release candidate `d1a4b11214be7991d459dac02bdd71b364b76dff`.

- Release-blocking findings: 1
- High-severity findings: 1
- Medium-severity findings: 1
- Low-severity findings: 2

The exact candidate accepts invalid decrypted backup records, replaces a valid collection, and then shows an empty page after reload. Its Terms page also omits required merchant-of-record and refund statements.

The live site changed during QA. It initially matched the candidate byte for byte, then moved to a later build at 09:07 UTC. The final live JavaScript and candidate JavaScript have different filenames and SHA-256 values. The later live build safely rejects the invalid backup and includes the missing Terms statements, but it is not the specified candidate.

## Verification summary

- Confirm all 16 exact commands in the candidate `.factory/claims.json`: 16/16 passed.
- Confirm candidate `npm test`: 41/41 passed.
- Confirm candidate `npm run typecheck`: passed.
- Confirm candidate `npm run build`: passed and produced `dist/index.html`.
- Confirm candidate `npm audit --audit-level=low`: 0 vulnerabilities.
- Confirm the full candidate-era live Playwright suite: 41/41 passed.
- Confirm the supplied live URL verifier on Home, Demo, Privacy, and Terms: passed with no normal-route console or page errors.
- Confirm standalone axe on four live routes: 0 violations.
- Confirm mobile Lighthouse: 97 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,427 ms; CLS 0.
- Confirm offline reload, offline scoring/export, and service-worker update: passed.
- Confirm outgoing requests during demo scoring/export/backup: same-origin only.
- Confirm license request allowance: 30 HTTP 200 responses followed by 10 HTTP 429 responses; `Retry-After: 4` present.
- Confirm normal, boundary, invalid-input, concurrency, persistence, and demo-isolation cases: passed except the invalid decrypted-backup recovery case.

## Findings

- Release-blocking QA7-00: the final live deployment no longer matches the specified candidate.
- High QA7-01: invalid decrypted backup data replaces a valid candidate collection; reload then has zero h1 elements, an empty body, and an `Invalid time value` page error.
- Medium QA7-02: candidate Terms omit required merchant-of-record and refund statements.
- Low QA7-03: backup help text crosses the adjacent control edge by 7–10 CSS pixels at desktop and mobile sizes.
- Low QA7-04: `.factory/design.md` and the candidate stylesheet assign different roles to the two vermilion color values.

## Current branch context

The branch now contains later repair commit `08fa80d`, with deployment record `b9781d1`. That work adds full decrypted-data validation, preserves the collection after invalid input, adds the required Terms statements, extends the claim test, and is the source of the final live build. After integrating this report, `npm test` passed 42/42 and `npm run build` passed. It was not the candidate requested for verification 7, so it does not change the candidate result.

## Required next step

Run a new independent verification against the later repair commit and confirm the final live files match that exact commit.

## Evidence

The detailed report is [`.factory/verification-7.md`](verification-7.md). Raw browser, accessibility, performance, network, request-allowance, deployment-identity, and screenshot evidence is in [`.factory/verification-7-evidence/`](verification-7-evidence/).

## Candidate commands

```sh
npm ci
npm test
npm run typecheck
npm run build
```

Use `/?demo=1` for the isolated sample. Production output is in `dist/`.

## Product changes

No product code was modified by verification 7.
