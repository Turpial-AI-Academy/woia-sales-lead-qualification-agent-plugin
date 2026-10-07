import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {evaluateQualifiedInput as evaluate} from '../skills/sales-lead-qualification/scripts/evaluate-qualified-input.mjs';

function fixture() {
  const context = {authenticated:true,current:true,consumer:'leasing',action:'sales.lead-qualification',purpose:'qualification',org_id:'org',subject_ref:'subject',criteria:{accepted:true,ref:'criteria',version:'1',acceptance_ref:'owner-acceptance',fields:[{id:'fit',weight:1},{id:'need',weight:1}]},readable_fields:['fit','need'],source_authority_ref:'map@1',observations:[{criterion_id:'fit',status:'OBSERVED',org_id:'org',subject_ref:'subject',source_authority_ref:'map@1',evidence_ref:'evidence@1',source_version:'1',current:true,score:1}]};
  return {context,request:{org_id:'org',subject_ref:'subject',criteria_ref:'criteria',criteria_version:'1',observations:structuredClone(context.observations)}};
}
test('each eligible consumer evaluates without CRM, acceptance or effects', () => {
  for (const consumer of ['sales','leasing','customer-service','supply-acquisition']) {
    const {context,request}=fixture();context.consumer=consumer;
    const original=structuredClone({context,request}); const result=evaluate(request,context);
    assert.equal(result.score,1);assert.equal(result.coverage,.5);assert.equal(result.evidence[1].status,'UNKNOWN');assert.equal(result.competent_acceptance,false);assert.equal(result.external_effects,false);assert.equal(result.state_mutated,false);assert.deepEqual({context,request},original);assert.deepEqual(evaluate(request,context),result);
  }
});
test('all missing observations stay UNKNOWN, not score zero',()=>{const {context,request}=fixture();context.observations=[];request.observations=[];assert.equal(evaluate(request,context).score,null)});
test('UNKNOWN does not bypass subject scope',()=>{const {context,request}=fixture();context.observations[0].status='UNKNOWN';context.observations[0].subject_ref='other';request.observations=structuredClone(context.observations);assert.throws(()=>evaluate(request,context))});
test('overflowing aggregate weight fails closed',()=>{const {context,request}=fixture();context.criteria.fields.forEach(c=>c.weight=Number.MAX_VALUE);assert.throws(()=>evaluate(request,context))});
for (const [name,change] of [
  ['untrusted host',x=>x.context.authenticated=false],['stale grant',x=>x.context.current=false],['ineligible consumer',x=>x.context.consumer='ads'],['cross organization',x=>x.request.org_id='other'],['cross subject',x=>x.request.subject_ref='other'],['wrong purpose',x=>x.context.purpose='contact'],['unaccepted criteria',x=>x.context.criteria.accepted=false],['stale criteria',x=>x.request.criteria_version='2'],['field denied',x=>x.context.readable_fields=['fit']],['missing source authority',x=>x.context.source_authority_ref=null],['request forges observation',x=>x.request.observations[0].score=0],['duplicate observations',x=>{x.context.observations.push(x.context.observations[0]);x.request.observations=structuredClone(x.context.observations)}],['stale source',x=>{x.context.observations[0].current=false;x.request.observations=structuredClone(x.context.observations)}],['invalid score',x=>{x.context.observations[0].score='1';x.request.observations=structuredClone(x.context.observations)}]
]) test(`fail closed: ${name}`,()=>{const x=fixture();change(x);assert.throws(()=>evaluate(x.request,x.context))});
test('legacy CLI output remains compatible',()=>{const result=JSON.parse(execFileSync(process.execPath,['skills/sales-lead-qualification/scripts/score-rubric.mjs','--file','skills/sales-lead-qualification/assets/rubric.example.json'],{encoding:'utf8'}));assert.equal(result.result,'PASS');assert.equal(result.score,.55/.7);assert.deepEqual(result.missing_evidence,['fit'])});
