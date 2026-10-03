import { readFile } from "node:fs/promises";
const i=process.argv.indexOf("--file"); if(i<0||!process.argv[i+1]) throw new Error("--file is required");
const doc=JSON.parse(await readFile(process.argv[i+1],"utf8"));
if(!Array.isArray(doc.criteria)||doc.criteria.length===0) throw new Error("criteria must be a non-empty array");
let weighted=0,totalWeight=0,observedWeight=0; const missing=[]; const errors=[];
for(const [index,c] of doc.criteria.entries()){
  const w=Number(c.weight);
  if(typeof c.id!=="string"||!c.id||!Number.isFinite(w)||w<=0){errors.push({index,error:"invalid id/weight"});continue}
  totalWeight+=w;
  if(c.score===null||c.score===undefined){missing.push(c.id);continue}
  const s=Number(c.score); if(!Number.isFinite(s)||s<0||s>1){errors.push({id:c.id,error:"score must be 0..1"});continue}
  weighted+=w*s; observedWeight+=w;
}
const score=observedWeight?weighted/observedWeight:null;
console.log(JSON.stringify({result:errors.length?"ERROR":"PASS",score,coverage:totalWeight?observedWeight/totalWeight:0,missing_evidence:missing,errors},null,2));
process.exitCode=errors.length?2:0;
