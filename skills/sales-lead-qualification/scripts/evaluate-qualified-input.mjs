// Host integration must supply this context from current authenticated grants,
// accepted versioned criteria and source-authority records, never request data.
const consumers = new Set(['sales', 'leasing', 'customer-service', 'supply-acquisition']);
const text = value => typeof value === 'string' && value.trim().length > 0;
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };

export function evaluateQualifiedInput(request, context) {
  requireThat(context && context.authenticated === true && context.current === true, 'CURRENT_HOST_CONTEXT_REQUIRED');
  requireThat(consumers.has(context.consumer), 'CONSUMER_NOT_ELIGIBLE');
  requireThat(context.action === 'sales.lead-qualification' && context.purpose === 'qualification', 'EVALUATION_SCOPE_REQUIRED');
  requireThat(text(context.org_id) && text(context.subject_ref) && request.org_id === context.org_id && request.subject_ref === context.subject_ref, 'SUBJECT_SCOPE_MISMATCH');
  requireThat(context.criteria?.accepted === true && text(context.criteria.ref) && text(context.criteria.version) && text(context.criteria.acceptance_ref), 'ACCEPTED_CRITERIA_REQUIRED');
  requireThat(request.criteria_ref === context.criteria.ref && request.criteria_version === context.criteria.version, 'CRITERIA_VERSION_MISMATCH');
  requireThat(text(context.source_authority_ref), 'SOURCE_AUTHORITY_REQUIRED');
  requireThat(Array.isArray(context.criteria.fields) && context.criteria.fields.length > 0 && new Set(context.criteria.fields.map(c => c.id)).size === context.criteria.fields.length, 'INVALID_CRITERIA');
  requireThat(Array.isArray(context.readable_fields) && context.criteria.fields.every(c => context.readable_fields.includes(c.id)), 'FIELD_SCOPE_DENIED');
  requireThat(Array.isArray(request.observations) && Array.isArray(context.observations) && same(request.observations, context.observations), 'HOST_VERIFIED_OBSERVATIONS_REQUIRED');
  const ids = request.observations.map(o => o.criterion_id);
  requireThat(new Set(ids).size === ids.length && ids.every(id => context.criteria.fields.some(c => c.id === id)), 'DUPLICATE_OR_UNKNOWN_CRITERION');
  let weighted = 0, observedWeight = 0, totalWeight = 0;
  const evidence = [];
  for (const criterion of context.criteria.fields) {
    requireThat(text(criterion.id) && typeof criterion.weight === 'number' && Number.isFinite(criterion.weight) && criterion.weight > 0, 'INVALID_CRITERIA');
    totalWeight += criterion.weight;
    const observation = request.observations.find(o => o.criterion_id === criterion.id);
    if (observation) requireThat(observation.org_id === context.org_id && observation.subject_ref === context.subject_ref && observation.source_authority_ref === context.source_authority_ref && observation.current === true, 'OBSERVATION_SCOPE_INVALID');
    if (!observation || observation.status === 'UNKNOWN') {
      evidence.push({criterion_id: criterion.id, status: 'UNKNOWN', score: null});
      continue;
    }
    requireThat(observation.status === 'OBSERVED' && observation.org_id === context.org_id && observation.subject_ref === context.subject_ref && observation.source_authority_ref === context.source_authority_ref && text(observation.evidence_ref) && text(observation.source_version) && observation.current === true, 'OBSERVATION_PROVENANCE_OR_SCOPE_INVALID');
    requireThat(typeof observation.score === 'number' && Number.isFinite(observation.score) && observation.score >= 0 && observation.score <= 1, 'INVALID_SCORE');
    weighted += criterion.weight * observation.score;
    observedWeight += criterion.weight;
    evidence.push({criterion_id: criterion.id, status: 'OBSERVED', score: observation.score, evidence_ref: observation.evidence_ref, source_version: observation.source_version});
  }
  requireThat(Number.isFinite(totalWeight) && Number.isFinite(weighted), 'INVALID_AGGREGATE_WEIGHT');
  return {result: 'EVALUATED', org_id: context.org_id, subject_ref: context.subject_ref, criteria_ref: context.criteria.ref, criteria_version: context.criteria.version, criteria_acceptance_ref: context.criteria.acceptance_ref, source_authority_ref: context.source_authority_ref, score: observedWeight ? weighted / observedWeight : null, coverage: observedWeight / totalWeight, evidence, competent_acceptance: false, external_effects: false, state_mutated: false};
}
