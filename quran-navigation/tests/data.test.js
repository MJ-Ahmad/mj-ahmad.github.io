// Run with: node tests/data.test.js   (loads the browser data files into a fake window)
const fs = require("fs"), path = require("path"), assert = require("assert"), vm = require("vm");
const root = path.join(__dirname, "..", "site");
const ctx = { window: {}, console };
ctx.window = ctx; vm.createContext(ctx);
["data/quran.js", "data/surahs.js", "data/hizb.js", "data/sajdah.js", "data/topics.js", "data/rukuh.js", "data/reciters.js"]
  .forEach((f) => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f }));
const D = ctx.QURAN_DATA, M = ctx.SURAHS;
const KUFIC = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
let n = 0; const ok = (name) => { n++; console.log("  ok  " + name); };

assert.strictEqual(D.length, 114); ok("114 surahs of text");
D.forEach((s, i) => { assert.strictEqual(s.n, i + 1); assert.strictEqual(s.ayahs.length, KUFIC[i], "ayah count surah " + (i + 1)); });
ok("every surah has the standard ayah count (total 6236)");
assert.strictEqual(D.reduce((a, s) => a + s.ayahs.length, 0), 6236); ok("total ayahs 6236");
D.forEach((s) => s.ayahs.forEach((a, i) => { assert.ok(a.trim().length > 0, "empty ayah " + s.n + ":" + (i + 1)); }));
ok("no empty ayahs");
assert.strictEqual(M.length, 114); M.forEach((m, i) => { assert.strictEqual(m.n, i + 1); assert.ok(m.ar && m.en && m.bn, "names " + m.n); });
ok("surah metadata complete in ar/en/bn");
for (let i = 1; i < M.length; i++) assert.ok(M[i].p >= M[i - 1].p, "page order " + M[i].n);
ok("surah start pages are non-decreasing");
assert.strictEqual(ctx.JUZ_STARTS.length, 30); ok("30 juz starts");
assert.strictEqual(ctx.SAJDAH_AYAHS.length, 15); ok("15 sajdah verses");
ctx.SAJDAH_AYAHS.forEach(([s, a]) => assert.ok(a >= 1 && a <= KUFIC[s - 1], "sajdah " + s + ":" + a));
ok("sajdah references exist");
assert.strictEqual(ctx.HIZB_STARTS.length, 60); ok("60 hizb slots");
ctx.HIZB_STARTS.forEach((h, i) => { if (h) assert.ok(h[1] >= 1 && h[1] <= KUFIC[h[0] - 1], "hizb " + (i + 1)); });
ok("verified hizb references are inside their surah");
ctx.TOPICS.forEach((t) => t.refs.forEach(([s, a, b]) => {
  assert.ok(s >= 1 && s <= 114 && a >= 1 && b >= a && b <= KUFIC[s - 1], "topic " + t.id);
}));
ok("topic references point to real verses");
assert.ok(ctx.RECITERS.length >= 1 && ctx.RECITERS.every((r) => r.base.startsWith("https://")));
ok("reciters use HTTPS audio base URLs");
console.log("\n" + n + " data tests passed");
