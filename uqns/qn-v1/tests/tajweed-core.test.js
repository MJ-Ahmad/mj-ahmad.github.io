// Run with: node tests/tajweed-core.test.js
const assert = require("assert"), fs = require("fs"), path = require("path"), vm = require("vm");
const site = path.join(__dirname, "..", "site");
const ctx = { window: {}, console }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(site, "data", "quran.js"), "utf8"), ctx);
const T = require(path.join(site, "js", "tajweed-core.js"));
const D = ctx.QURAN_DATA;
const scan = (s, a) => T.scanAyah(D[s - 1].ayahs[a - 1]);
const has = (list, rule, letter, next) => list.some(x => x.rule === rule && x.letter === letter && x.next === next);
let n = 0; const ok = (name) => { n++; console.log("  ok  " + name); };

assert.strictEqual(T.classifyNoon("ب"), "iqlab"); ok("iqlab before ba");
assert.strictEqual(T.classifyNoon("ء"), "izhar"); assert.strictEqual(T.classifyNoon("أ"), "izhar"); ok("izhar before hamza forms and throat letters");
assert.strictEqual(T.classifyNoon("ي"), "idgham_ghunna"); assert.strictEqual(T.classifyNoon("ل"), "idgham_bila"); ok("idgham (with ghunna: ي و م ن; without: ل ر)");
["ت","ق","ك","ف","ص"].forEach(l => assert.strictEqual(T.classifyNoon(l), "ikhfa")); ok("ikhfa before its letters");
assert.strictEqual(T.classifyMim("م"), "mim_idgham"); assert.strictEqual(T.classifyMim("ب"), "mim_ikhfa"); assert.strictEqual(T.classifyMim("ت"), "mim_izhar"); ok("mim sakinah: idgham, ikhfa, izhar");
assert.ok(has(scan(1, 7), "izhar", "ن", "ع"), "1:7"); ok("1:7 أَنْعَمْتَ → izhar (ن + ع)");
assert.ok(has(scan(2, 4), "ikhfa", "ن", "ق"), "2:4"); ok("2:4 مِن قَبْلِكَ → ikhfa (ن + ق)");
assert.ok(has(scan(112, 4), "izhar", "و", "أ"), "112:4"); ok("112:4 كُفُوًا أَحَدٌ → izhar via tanween (و + أ)");
assert.ok(has(scan(112, 4), "idgham_bila", "ن", "ل"), "112:4 b"); ok("112:4 يَكُنْ لَّهُ → idgham bila ghunna (ن + ل)");
assert.ok(has(scan(2, 2), "idgham_bila", "د", "ل"), "2:2"); ok("2:2 هُدًى لِلْمُتَّقِينَ → tanween idgham (د + ل), silent alif skipped");
assert.ok(scan(2, 3).some(x => x.rule === "qalqalah"), "2:3"); ok("2:3 رَزَقْنَاهُمْ → qalqalah on sukun ق");
const known = new Set(Object.values(T.RULES));
let total = 0;
D.forEach(s => s.ayahs.forEach((text) => {
  T.scanAyah(text).forEach(x => {
    total++;
    assert.ok(known.has(x.rule), "unknown rule " + x.rule);
    assert.strictEqual(text.charAt(x.start), x.letter, "index mismatch in surah " + s.n);
  });
}));
ok("all " + total + " detections point at the right letter with a known rule");
console.log("\n" + n + " tajweed-core tests passed");
