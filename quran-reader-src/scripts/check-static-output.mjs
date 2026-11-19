// Runs after `next build`. Fails the build if a route the site promises is missing from out/.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const expected = [
  "index.html", "404.html", "reader/index.html", "search/index.html",
  "settings/index.html", "about/index.html", "sections/index.html",
];
for (let i = 1; i <= 114; i++) expected.push(`surah/${i}/index.html`);
for (let i = 1; i <= 30; i++) expected.push(`juz/${i}/index.html`);
for (let i = 1; i <= 604; i++) expected.push(`reader/${i}/index.html`);

const missing = expected.filter((f) => !existsSync(join(OUT, f)));
if (missing.length) {
  console.error(`Static output is missing ${missing.length} file(s), e.g. ${missing.slice(0, 5).join(", ")}`);
  process.exit(1);
}

// Asset URLs must carry the base path, or the site breaks when served from /quran-reader/.
const home = readFileSync(join(OUT, "index.html"), "utf8");
if (!home.includes("/quran-reader/_next/")) {
  console.error("Assets are not prefixed with /quran-reader/ (basePath missing).");
  process.exit(1);
}
console.log(`Static output OK: ${expected.length} pages, base path /quran-reader.`);
