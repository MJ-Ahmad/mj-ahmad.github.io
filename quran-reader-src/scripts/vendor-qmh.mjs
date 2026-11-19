// Refreshes public/qmh from a local quran-madina-html package and re-applies the local patches.
// Usage: node scripts/vendor-qmh.mjs <path-to-package-with-dist-and-assets>
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const srcDir = resolve(process.argv[2] ?? "node_modules/quran-madina-html");
const destDir = resolve("public/qmh");
const minJs = join(destDir, "dist/quran-madina-html.min.js");

if (!existsSync(join(srcDir, "dist")) || !existsSync(join(srcDir, "assets"))) {
  console.error(`[vendor-qmh] ${srcDir} must contain dist/ and assets/`);
  process.exit(1);
}

rmSync(destDir, { recursive: true, force: true });
mkdirSync(destDir, { recursive: true });
cpSync(join(srcDir, "dist"), join(destDir, "dist"), { recursive: true });
cpSync(join(srcDir, "assets"), join(destDir, "assets"), { recursive: true });

let src = readFileSync(minJs, "utf8");
const rules = [
  { from: 'window.open(`https://quran.com/${r}/`+a,"_blank")', to: "void 0" },
  { from: 'window.open(e,"_blank")}function at(', to: "void 0}function at(" },
  { from: "`https://www.unpkg.com/${I}/`", to: '"/qmh/"' },
];
let hits = 0;
for (const { from, to } of rules) {
  const n = src.split(from).length - 1;
  if (n) { src = src.split(from).join(to); hits += n; }
}
const urlLeft = src.split("https://quran.com/").length - 1;
if (urlLeft) { src = src.split("https://quran.com/").join("#"); hits += urlLeft; }
writeFileSync(minJs, src);

const external = [...new Set(src.match(/https?:\/\/[a-z0-9.-]+/gi) ?? [])];
console.log(`[vendor-qmh] applied ${hits} patch(es)`);
if (external.length) {
  console.warn(`[vendor-qmh] WARNING: external URLs remain: ${external.join(", ")}`);
  process.exitCode = 1;
}
