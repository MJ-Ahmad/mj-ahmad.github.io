// Release gate: run with `npm run check` from the project root.
// Fails (exit 1) on any missing file, uncached app asset, invalid manifest or failing test.
const fs = require("fs"), path = require("path"), cp = require("child_process");
const root = path.join(__dirname, "..", "site");
const repo = path.join(__dirname, "..");
const errors = [], warnings = [];
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const exists = (f) => fs.existsSync(path.join(root, f));

// 1. Every local asset referenced by index.html exists.
const html = read("index.html");
const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map((m) => m[1]).filter((r) => !r.startsWith("http"));
refs.forEach((r) => { if (!exists(r)) errors.push("index.html references missing file: " + r); });

// 2. Every app asset is precached by the service worker (so offline works).
const sw = read("sw.js");
const shell = (sw.match(/const SHELL = \[([\s\S]*?)\];/) || [])[1] || "";
const cached = new Set([...shell.matchAll(/"([^"]+)"/g)].map((m) => m[1]));
refs.filter((r) => !r.startsWith("pages/")).forEach((r) => {
  if (!cached.has(r) && r !== "manifest.webmanifest") errors.push("not precached by sw.js: " + r);
});
["index.html", "manifest.webmanifest", "css/style.css"].forEach((f) => { if (!cached.has(f)) errors.push("sw.js SHELL missing " + f); });

// 3. Manifest is valid and its icons exist.
try {
  const m = JSON.parse(read("manifest.webmanifest"));
  ["name", "short_name", "start_url", "display", "icons"].forEach((k) => { if (!m[k]) errors.push("manifest missing " + k); });
  (m.icons || []).forEach((i) => { if (!exists(i.src)) errors.push("manifest icon missing: " + i.src); });
  if (!(m.icons || []).some((i) => i.purpose === "maskable")) warnings.push("no maskable icon");
} catch (e) { errors.push("manifest.webmanifest is not valid JSON: " + e.message); }

// 4. JavaScript syntax for every shipped script.
["js", "data", "."].forEach((dir) => {
  fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith(".js")).forEach((f) => {
    const rel = path.join(dir, f);
    try { cp.execFileSync(process.execPath, ["--check", path.join(root, rel)], { stdio: "pipe" }); }
    catch (e) { errors.push("syntax error in " + rel); }
  });
});

// 5. No debugging leftovers or local-only URLs in shipped code.
["js", "sw.js"].forEach((target) => {
  const files = target === "js" ? fs.readdirSync(path.join(root, "js")).map((f) => "js/" + f) : [target];
  files.forEach((f) => {
    const src = read(f);
    if (/console\.(log|debug)\(/.test(src)) warnings.push("console.log in " + f);
    if (/https?:\/\/(localhost|127\.0\.0\.1)/.test(src)) errors.push("local-only URL in " + f);
  });
});

// 6. Android link file must be filled in before publishing.
if (/REPLACE_WITH/.test(read(".well-known/assetlinks.json"))) warnings.push(".well-known/assetlinks.json still has placeholders (fill before Play release)");

// 7. Unit tests.
["tests/hifz-core.test.js", "tests/tajweed-core.test.js", "tests/data.test.js"].forEach((t) => {
  try { cp.execFileSync(process.execPath, [path.join(repo, t)], { stdio: "pipe" }); }
  catch (e) { errors.push("test failed: " + t + "\n" + String(e.stdout || "") + String(e.stderr || "")); }
});

warnings.forEach((w) => console.log("WARN  " + w));
errors.forEach((e) => console.log("FAIL  " + e));
if (errors.length) { console.log("\n" + errors.length + " error(s). Release blocked."); process.exit(1); }
console.log("\nAll checks passed" + (warnings.length ? " (" + warnings.length + " warning(s))" : "") + ".");
