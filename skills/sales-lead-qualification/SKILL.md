---
name: sales-lead-qualification
description: Qualify or review a lead using observed customer evidence, configurable organization criteria, explicit unknowns, optional deterministic rubric math, and traceable next-action/routing recommendations.
license: MIT
metadata:
  author: Turpial AI Academy
  version: "0.5.0"
---

# Sales Lead Qualification

Use for lead/customer fit, need, timing, urgency, constraints and routing.

## Evidence rules

- Resolve the customer/lead through woia-customer-data when a shared record exists.
- Distinguish customer-stated facts from inference.
- Do not invent budget, urgency, authority, interest or purchase timing.
- Unknown qualification fields remain unknown rather than being guessed.

## Workflow

1. Read organization/Project qualification criteria and relevant customer/context evidence.
2. Identify required facts and missing questions.
3. Record evidence per criterion.
4. If the organization uses a numeric rubric, use the bundled deterministic scorer; the score is evidence, not the final business decision.
5. Explain fit/gaps/risks and recommended next action/routing.
6. Return qualification evidence suitable for independent audit and pipeline/follow-up decisions.

## Deterministic rubric scorer

Use scripts/score-rubric.mjs --file <rubric.json>.

Each criterion supplies a weight, score (0..1) and optional evidence_ref. The tool returns the weighted score and missing-evidence list. It never decides qualified/not-qualified automatically.

## Effects

Qualification is read/analysis by default. It does not contact the lead or mutate pipeline state.
