# Validation

This thin native provider uses centralized Ecosystem v0.5.4 authoring validation.
No copied Factory toolchain or mandatory checksum manifest is introduced.

- `pnpm test`: scoped evaluation positive/negative regressions and legacy CLI compatibility.
- `pnpm run ci:fast`: complete provider suite.
- Bootstrap: no dependencies to install; parse package/plugin/provider manifests and check Node availability.
- Doctor/manifest/skill/link/root/payload checks: centralized validators from Ecosystem.
- Release check: clean exact Git candidate, unchanged legacy scorer, preserved baseline MIT LICENSE and official `mise run plugin:certify-thin --repo <repo>` (portable archive included). The canonical license blob gate applies to audited migrated providers; this native provider retains its original MIT license bytes.

Candidate certification is local helper/portable-plugin qualification only.
Host grants, source acceptance, storage authorization, integration and Operator
E2E remain separately qualified. There is no external send, persistence or
competent decision in this provider. Stable prior release v0.5.0 is immutable.
