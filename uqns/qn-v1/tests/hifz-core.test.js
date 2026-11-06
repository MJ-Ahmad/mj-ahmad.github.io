// Run with: node tests/hifz-core.test.js
const assert = require("assert");
const H = require("../site/js/hifz-core.js");
let passed = 0;
function test(name, fn) { fn(); passed++; console.log("  ok  " + name); }

const D0 = "2026-01-10", D1 = "2026-01-11", D3 = "2026-01-13", D7 = "2026-01-17";

test("empty state: next page is 1 and progress is zero", () => {
  const s = H.emptyState();
  assert.strictEqual(H.nextPage(s), 1);
  assert.deepStrictEqual(H.progress(s), { pages: 0, total: 604, percent: 0, remaining: 604 });
});

test("validation rejects bad ranges, long sabaqs and overlaps", () => {
  let s = H.emptyState();
  assert.strictEqual(H.validateSabaq(s, 0, 3), "errRange");
  assert.strictEqual(H.validateSabaq(s, 5, 3), "errRange");
  assert.strictEqual(H.validateSabaq(s, 605, 605), "errRange");
  assert.strictEqual(H.validateSabaq(s, 1, 21), "errTooLong");
  s = H.addSabaq(s, 10, 12, D0).state;
  assert.strictEqual(H.validateSabaq(s, 12, 14), "errOverlap");
  assert.strictEqual(H.validateSabaq(s, 13, 14), null);
});

test("adding a sabaq stores it sorted and nextPage advances after it", () => {
  let s = H.emptyState();
  s = H.addSabaq(s, 20, 21, D0).state;
  s = H.addSabaq(s, 1, 2, D0).state;
  assert.deepStrictEqual(s.sabaqs.map(x => x.from), [1, 20]);
  assert.strictEqual(H.nextPage(s), 22);
});

test("progress counts only completed (done) sabaqs", () => {
  let s = H.emptyState();
  s = H.addSabaq(s, 1, 4, D0).state;
  assert.strictEqual(H.progress(s).pages, 0);
  const id = s.sabaqs[0].id;
  s = H.updateSabaq(s, id, { done: true });
  assert.strictEqual(H.progress(s).pages, 4);
  assert.strictEqual(H.progress(s).remaining, 600);
});

test("dohor: due after 1 day, then 3 days, not before", () => {
  let s = H.addSabaq(H.emptyState(), 1, 1, D0).state;
  s = H.updateSabaq(s, s.sabaqs[0].id, { done: true });
  assert.strictEqual(H.dohorDue(s, D0).length, 0);
  assert.strictEqual(H.dohorDue(s, D1).length, 1);
  s = H.completeReview(s, s.sabaqs[0].id, 0);
  assert.strictEqual(H.dohorDue(s, D1).length, 0);
  assert.strictEqual(H.dohorDue(s, D3).length, 1);
});

test("dohor: many mistakes restart the cycle from day 1", () => {
  let s = H.addSabaq(H.emptyState(), 1, 1, D0).state;
  s = H.updateSabaq(s, s.sabaqs[0].id, { done: true });
  s = H.completeReview(s, s.sabaqs[0].id, 0);   // reviewed = 1
  s = H.completeReview(s, s.sabaqs[0].id, 3);   // 3 mistakes -> reset
  assert.strictEqual(s.sabaqs[0].reviewed, 0);
  assert.strictEqual(H.dohorDue(s, D1).length, 1);
});

test("dohor: finished cycle drops out of the due list", () => {
  let s = H.addSabaq(H.emptyState(), 1, 1, D0).state;
  s = H.updateSabaq(s, s.sabaqs[0].id, { done: true });
  for (let i = 0; i < H.REVIEW_INTERVALS.length; i++) s = H.completeReview(s, s.sabaqs[0].id, 0);
  assert.strictEqual(H.dohorDue(s, "2030-01-01").length, 0);
});

test("manzil: cycles through blocks of memorized pages, one per day", () => {
  let s = H.emptyState();
  for (let p = 1; p <= 45; p++) {
    s = H.addSabaq(s, p, p, D0).state;
  }
  s.sabaqs.forEach(x => { x.done = true; });
  const plan = H.manzilPlan(s, D0);
  assert.strictEqual(plan.blocks, 3);
  const seen = new Set();
  for (let i = 0; i < 3; i++) {
    const day = H.dayKey(new Date(2026, 0, 10 + i));
    const m = H.manzilPlan(s, day);
    seen.add(m.index);
  }
  assert.strictEqual(seen.size, 3, "three consecutive days should cover three blocks");
});

test("manzil: marking done is recorded for that day only", () => {
  let s = H.addSabaq(H.emptyState(), 1, 2, D0).state;
  s = H.updateSabaq(s, s.sabaqs[0].id, { done: true });
  s = H.markManzil(s, D0);
  assert.strictEqual(H.manzilPlan(s, D0).done, true);
  assert.strictEqual(H.manzilPlan(s, D1).done, false);
});

test("pace: days to finish", () => {
  assert.strictEqual(H.daysToFinish(604, 1), 604);
  assert.strictEqual(H.daysToFinish(604, 2), 302);
  assert.strictEqual(H.daysToFinish(605, 2), 303);
  assert.strictEqual(H.daysToFinish(10, 0), null);
});

test("backup round-trips and rejects corrupt files", () => {
  let s = H.addSabaq(H.emptyState(), 5, 7, D0).state;
  const text = H.exportJSON(s);
  const back = H.importJSON(text);
  assert.strictEqual(back.error, null);
  assert.deepStrictEqual(back.state.sabaqs.map(x => [x.from, x.to]), [[5, 7]]);
  assert.strictEqual(H.importJSON("not json").error, "errFile");
  assert.strictEqual(H.importJSON(JSON.stringify({ app: "other", data: {} })).error, "errFile");
  const bad = JSON.parse(text); bad.data.sabaqs[0].from = 900;
  assert.strictEqual(H.importJSON(JSON.stringify(bad)).error, "errFile");
  const dup = JSON.parse(text); dup.data.sabaqs.push(dup.data.sabaqs[0]);
  assert.strictEqual(H.importJSON(JSON.stringify(dup)).error, "errFile");
});

test("immutability: operations never mutate the input state", () => {
  const s = H.addSabaq(H.emptyState(), 1, 1, D0).state;
  const snapshot = JSON.stringify(s);
  H.updateSabaq(s, s.sabaqs[0].id, { done: true });
  H.completeReview(s, s.sabaqs[0].id, 0);
  H.removeSabaq(s, s.sabaqs[0].id);
  H.markManzil(s, D0);
  assert.strictEqual(JSON.stringify(s), snapshot);
});

console.log("\n" + passed + " hifz-core tests passed");
