# Scoped qualification contract

Eligible consumers: Sales, Leasing, Customer Service and Supply Acquisition
(Property Acquisition uses its qualified base + delta). This eligibility grants
no retrieval or acceptance authority. Accepted versioned organization criteria
and authorized subject/field/purpose scope are required for each evaluation.

Identity and domain owners supply references and original evidence. Customer
Data is an optional configured CRM adapter, never a mandatory master. Preserve
source-authority version, criteria acceptance reference, UNKNOWN and provenance.
Scores, completeness and routing recommendations never accept an applicant,
offer, mandate or other competent business decision.

`evaluateQualifiedInput(request, context)` is a pure deterministic evaluation
helper. The trusted host must authenticate current grants, fetch the exact
accepted criteria, resolve Source Authority and supply verified observations;
the request cannot supply or replace this context. It must enforce storage and
retrieval isolation before calling the helper. No backend or legal rule is
selected. The helper does not persist, contact people or mutate pipeline state.

The existing `score-rubric.mjs --file` generic offline math interface and output
remain compatible. It is not the scoped evaluation entry point and must not be
used as evidence of authoritative acceptance or authorized retrieval.

Derivation: accepted WOIA Real Estate docs/21, docs/22, docs/24, docs/25 and
docs/26 at coordination commit b716f1d1c0e2bc5ecf946043b337a2ddba4285f0.
Those planning documents are provenance, not a runtime dependency.
