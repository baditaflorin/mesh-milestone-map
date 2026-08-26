# Release security audit — 2026-08-26

Scope: the static GitHub Pages client, its browser-local Yjs/WebRTC transport,
and the dependency graph used to build and test this release.

## Results

| Check                                                                                                       | Result                                                                 |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm audit --omit=dev --json`                                                                               | 0 vulnerabilities                                                      |
| `npm audit --json`                                                                                          | 0 vulnerabilities                                                      |
| Secret-pattern scan of tracked source (private-key / GitHub token / AWS key / password assignment patterns) | no matches                                                             |
| Production architecture                                                                                     | static client only; no committed credentials or server-side data store |

## Remediation included in this release

- Refreshed audit-fixable transitive dependencies in the lockfile.
- Updated the Vitest development dependency to the audited current major,
  eliminating vulnerable Vite/Vitest transitive packages from the test stack.
- Preserved the existing Yjs room namespace while correcting public repository
  and Pages links in the product configuration.

## Deliberate boundaries

- TURN credentials are fetched at runtime from the configured credential
  endpoint and are not committed to the application.
- Shared milestones are visible to every participant in the room by design;
  Pathline does not make a private-data or authorization claim.
- Signaling and TURN hardening belongs to the independently deployed services,
  outside this static repository's trust boundary.
