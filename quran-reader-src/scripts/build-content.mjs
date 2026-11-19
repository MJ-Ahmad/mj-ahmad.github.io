// Builds the Mushaf content JSON used by the app from the MJ QN source files in source/vendor-content/.
// Run: node scripts/build-content.mjs
// Outputs:
//   data/uthmani.json                    Uthmani text (basmala stripped, same convention as verses.json)
//   data/reciters.json                   everyayah.com base URL and reciter list
//   public/data/translations/<id>.json   translations (credit + 6236 texts), id = bn | en | muyassar | jalalayn
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "source/vendor-content");

function load(file) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(SRC, file), "utf8"), ctx, { filename: file });
  return ctx.window;
}

// Letters only, with harakat removed and alef-wasla unified, for comparing basmala forms.
const lettersOnly = (t) => t.replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED\s]/g, "").replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627");

// ---- Uthmani ----
const uth = load("quran-text/uthmani.js").QuranText.uthmani;
const surahs = (() => {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "data/surahs.json"), "utf8"));
})();
const flat = [];
for (const s of surahs) for (let a = 1; a <= s.ayahs; a++) flat.push(`${s.id}:${a}`);
if (flat.length !== 6236) throw new Error("surah table does not sum to 6236");
const basmalaUth = uth["1:1"].split(" ").slice(0, 4).join(" ");
const uthText = flat.map((k) => {
  const v = uth[k];
  if (v === undefined) throw new Error("missing uthmani " + k);
  return v;
});
for (const s of surahs) {
  if (s.id === 1 || s.id === 9) continue;
  const i = s.start;
  const head = uthText[i].split(" ").slice(0, 4).join(" ");
  if (lettersOnly(head) !== lettersOnly(basmalaUth)) throw new Error("basmala prefix not found in " + s.id);
  uthText[i] = uthText[i].split(" ").slice(4).join(" ");
}
fs.writeFileSync(path.join(ROOT, "data/uthmani.json"), JSON.stringify({ basmala: basmalaUth, text: uthText }, null, 0));
console.log("uthmani: 6236 verses");

// ---- Reciters ----
const rw = load("reciters.js");
const reciters = {
  base: rw.UQNS_AUDIO_BASE,
  reciters: rw.UQNS_RECITERS.map((r) => ({
    id: r.id,
    name: r.name,
    murattal: r.murattal ?? null,
    mujawwad: r.mujawwad ?? null,
  })),
};
fs.writeFileSync(path.join(ROOT, "data/reciters.json"), JSON.stringify(reciters, null, 2));
console.log("reciters:", reciters.reciters.length);

// ---- Translations ----
const TRANSLATION_FILES = {
  bn: ["quran-translations/bn.bengali.js", "bn.bengali"],
  en: ["quran-translations/en.yusufali.js", "en.yusufali"],
  muyassar: ["quran-translations/ar.muyassar.js", "ar.muyassar"],
  jalalayn: ["quran-translations/ar.jalalayn.js", "ar.jalalayn"],
};
fs.mkdirSync(path.join(ROOT, "public/data/translations"), { recursive: true });
for (const [id, [file, key]] of Object.entries(TRANSLATION_FILES)) {
  const raw = fs.readFileSync(path.join(SRC, file), "utf8");
  const header = raw.split("*/")[0].split("\n")
    .map((l) => l.replace(/^\s*\/?\*+\s?/, "").trim())
    .filter((l) => l && !/^Please credit/i.test(l) && !/^Format:/i.test(l));
  const credit = header.join(" · ");
  const table = load(file).QuranTranslations[key];
  const text = flat.map((k) => {
    const v = table[k];
    if (typeof v !== "string" || !v.trim()) throw new Error(`missing translation ${id} ${k}`);
    return v;
  });
  fs.writeFileSync(path.join(ROOT, "public/data/translations", `${id}.json`), JSON.stringify({ credit, text }));
  console.log("translation", id, text.length);
}
