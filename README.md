# woia-sales-lead-qualification

WOIA Sales v0.5.7 provider for `sales.lead-qualification`.

- Primary skill: `$sales-lead-qualification`
- Authoring profile: thin
- Origin: WOIA-native

Capability-owned deterministic tools/templates live in this plugin. Generic certification/release tooling lives in `woia-ecosystem`.

Eligible scoped consumers: Sales, Leasing, Customer Service and Supply Acquisition. Customer Data is optional. [Contract](skills/sales-lead-qualification/references/scoped-qualification.md) describe the additive helper and host enforcement boundary.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.
