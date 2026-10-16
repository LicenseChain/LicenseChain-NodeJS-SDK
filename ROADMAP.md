# LicenseChain Node.js SDK Roadmap

## Current Focus

- Keep Node.js server-side SDK behavior aligned with `https://api.licensechain.app/v1`.
- Preserve stable `verifyWithDetails` and JWKS verification helpers for backend integrations.
- Keep `@licensechain/nodejs-sdk` as the server-oriented package beside the JavaScript SDK.

## Next Operational Tasks

- Re-run conformance checks after Core API verify/JWKS contract updates.
- Keep docs and examples synchronized with https://docs.licensechain.app/en/sdk.
- Record release-impacting changes in `CHANGELOG.md`; develop experiments on `dev`, release from `main`.


## Active Milestone (2026-10-16)

- **Conformance re-run**: workspace `sdk-conformance` validate reports `errors=0` (remaining WARN = optional README PATCH license lifecycle aliases; DELETE/update paths cover revoke).
- **Docs sync**: README points at `https://docs.licensechain.app/en/sdk`; default API base documented as `https://api.licensechain.app/v1`.
- **Branch opsec**: land experiments on `dev`; promote to `main` only for release-ready changes.

## Ecosystem Notes

- Continue shared-core alignment with the JavaScript SDK while preserving Node-specific server ergonomics.
- Avoid duplicate logic drift between Node.js and JavaScript packages.
