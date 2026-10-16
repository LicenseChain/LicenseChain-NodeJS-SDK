# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Upgraded ESLint / typescript-eslint toolchain and pinned transitive security floors (`picomatch`, `flatted`, `brace-expansion`, `js-yaml`, `minimatch`).
- Removed unused npm `crypto` package dependency (Node built-in crypto only).

## [1.0.3] - 2026-10-11

- Fixed npm badge URL encoding for `@licensechain/nodejs-sdk` and Node engines badge (20+).
- Corrected homepage and install/import snippets to the scoped package name and docs.licensechain.app/en/sdk.

## [1.0.2] - 2026-10-10

- Relicensed public surface under Elastic License 2.0 (ELv2).
- Raised `engines.node` from `>=14` to `>=20`; CI matrix Node 20 / 22 / 24.
- Added Dependabot for npm and GitHub Actions.

## [1.0.0] - 2026-04-06

- Initial public SDK surface with repository documentation kit.
- Positioned as the server-side Node package alongside the JavaScript SDK shared-core track.
