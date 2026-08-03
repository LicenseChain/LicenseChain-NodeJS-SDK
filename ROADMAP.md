# LicenseChain NodeJS SDK Roadmap

## Current Focus

- Keep Node.js server-side SDK behavior aligned with `https://api.licensechain.app/v1`.
- Preserve stable `verifyWithDetails` and JWKS verification helper behavior for backend integrations.
- Maintain compatibility with shared HTTP core and workspace governance.

## Consolidation Track

- Continue Track C alignment with JavaScript SDK shared core while preserving Node-specific server ergonomics.
- Avoid duplicate logic drift between NodeJS and JavaScript SDK packages.
- Keep migration notes explicit when shared-core updates alter runtime expectations.

## Next Operational Tasks

- Re-run conformance and integration checks after Core API auth/license contract updates.
- Keep Node-specific docs clear on server-only usage and environment expectations.
- Record dependency and behavior changes in changelog entries for release traceability.
