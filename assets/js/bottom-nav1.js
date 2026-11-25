/* UQNS bottom navigation (phones and small tablets): Home · Read · Search · Knowledge Graph · Menu.
   Self-contained: injects its own CSS, follows the site's theme variables and the EN/BN/AR language setting (uqns.lang). */
(function () {
  "use strict";
  var cs = document.currentScript || document.querySelector('script[src*="bottom-nav.js"]');
  var ROOT = new URL("../../", cs.src).href, RP = new URL(ROOT).pathname, P = location.pathname;
  var HOME = P === RP || P === RP + "index.html";
  var BASE = (P.indexOf(RP + "quran-reader/") === 0 || P === RP + "reader.html" || P === RP + "mushaf.html") ? "read" : HOME ? "home" : "";
  var T = {
    en: { bar: { home: "Home", read: "Read", search: "Search", graph: "Graph", menu: "Menu" },
      full: { home: "Home", read: "Read the Qur'an", search: "Search the Qur'an", graph: "Explore Knowledge Graph", menu: "Menu" },
      menu: ["Read the Qur'an", "Mushaf pages", "Navigate", "Discover", "Research & graph", "Tafseer", "Resources", "Community", "Install & share", "About"] },
    bn: { bar: { home: "হোম", read: "পড়ুন", search: "খুঁজুন", graph: "নলেজ গ্রাফ", menu: "মেনু" },
      full: { home: "হোম", read: "কুরআন পড়ুন", search: "কুরআনে খুঁজুন", graph: "নলেজ গ্রাফ দেখুন", menu: "মেনু" },
      menu: ["কুরআন পড়ুন", "মুসহাফের পৃষ্ঠা", "নেভিগেট", "আবিষ্কার", "গবেষণা ও গ্রাফ", "তাফসীর", "রিসোর্স", "কমিউনিটি", "ইনস্টল ও শেয়ার", "পরিচিতি"] },
    ar: { bar: { home: "الرئيسية", read: "اقرأ", search: "ابحث", graph: "المعرفة", menu: "القائمة" },
      full: { home: "الرئيسية", read: "اقرأ القرآن", search: "ابحث في القرآن", graph: "استكشف الرسم المعرفي", menu: "القائمة" },
      menu: ["اقرأ القرآن", "صفحات المصحف", "التصفح", "اكتشف", "البحث والرسم المعرفي", "التفسير", "المصادر", "المجتمع", "التثبيت والمشاركة", "عن المشروع"] }
  };
  var LINKS = ["quran-reader/", "mushaf.html", "#navigate", "#discover", "#research", "#tafseer", "#resources", "#community", "#get-app", "#about"];
  var IC = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    read: '<path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z"/><path d="M12 6.5v13"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5.5 5.5"/>',
    graph: '<circle cx="6" cy="7" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><circle cx="19" cy="15" r="1.6"/><path d="m8 7.6 8-1.1M7.2 9l3.7 7M14.2 17.3l3.7-1.4M18.4 8.2l.4 5.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  var KEYS = ["home", "read", "search", "graph"], cur = BASE;
  var lang = function () { var l = document.documentElement.lang; if (!T[l]) { try { l = localStorage.getItem("uqns.lang"); } catch (e) {} } return T[l] ? l : "en"; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var smooth = function () { return matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth"; };
  var css = ".uqb,.uqs,.uqp{display:none}@media(max-width:1024px) and (min-height:421px){" +
    ":root{--uqh:64px}html body{box-sizing:border-box;padding-bottom:calc(var(--uqh) + env(safe-area-inset-bottom,0px))!important}" +
    ".uqb{position:fixed;inset-inline:0;bottom:0;z-index:55;display:flex;align-items:stretch;justify-content:space-around;height:calc(var(--uqh) + env(safe-area-inset-bottom,0px));padding:0 4px env(safe-area-inset-bottom,0px);box-sizing:border-box;background:var(--header-bg,var(--bar,#141414));-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5);border-top:1px solid var(--line,#3a3b3f);box-shadow:0 -8px 28px rgba(0,0,0,.22)}" +
    ".uqb a,.uqb button{flex:1 1 0;max-width:104px;min-width:0;height:var(--uqh);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:0 2px;margin:0;background:none;border:0;color:var(--muted,#a29d92);font:600 10.5px/1.15 var(--font,system-ui,sans-serif);text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent;letter-spacing:.01em}" +
    ".uqi{width:56px;height:30px;border-radius:15px;display:grid;place-items:center;transition:background .22s,color .22s,transform .15s}.uqi svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:stroke-width .2s}" +
    ".uqt{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.uqb :active .uqi{transform:scale(.9)}" +
    ".uqb [aria-current=page],.uqb [aria-expanded=true]{color:var(--accent,#ddb441);font-weight:700}.uqb [aria-current=page] .uqi,.uqb [aria-expanded=true] .uqi{background:var(--glow,var(--accent-soft,rgba(221,180,65,.16)))}.uqb [aria-current=page] svg,.uqb [aria-expanded=true] svg{stroke-width:2.15}" +
    ".uqb a:focus-visible,.uqb button:focus-visible,.uqp a:focus-visible{outline:2px solid var(--accent,#ddb441);outline-offset:-3px;border-radius:12px}" +
    ".uqs{display:block;position:fixed;inset:0;z-index:53;background:rgba(0,0,0,.5);opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s}" +
    ".uqp{display:block;position:fixed;inset-inline:0;bottom:calc(var(--uqh) + env(safe-area-inset-bottom,0px));z-index:54;max-height:70vh;overflow:auto;box-sizing:border-box;padding:8px 14px 16px;background:var(--surface,var(--bar,#141414));color:var(--text,var(--ink,#f5f5f5));border:1px solid var(--line,#3a3b3f);border-bottom:0;border-radius:22px 22px 0 0;box-shadow:0 -16px 40px rgba(0,0,0,.35);transform:translateY(110%);visibility:hidden;transition:transform .26s ease,visibility .26s;font-family:var(--font,system-ui,sans-serif)}" +
    ".uq-o .uqs{opacity:1;visibility:visible}.uq-o .uqp{transform:none;visibility:visible}.uqg{width:40px;height:4px;border-radius:2px;background:var(--line,#3a3b3f);margin:2px auto 10px}" +
    ".uql{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-width:640px;margin:auto}.uql a{display:flex;align-items:center;gap:10px;min-height:48px;padding:10px 12px;border:1px solid var(--line,#3a3b3f);border-radius:14px;color:inherit;text-decoration:none;font-size:15px;line-height:1.3}" +
    ".uql a:before{content:'';flex:none;width:7px;height:7px;border-radius:50%;background:var(--accent,#ddb441)}.uql a:active{background:var(--glow,var(--accent-soft,rgba(221,180,65,.16)))}" +
    "}@media(prefers-reduced-motion:reduce){.uqi,.uqi svg,.uqs,.uqp{transition:none!important}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement("div");
  box.innerHTML = '<div class="uqs"></div><div class="uqp" id="uqp" role="region"><div class="uqg"></div><div class="uql"></div></div><nav class="uqb" aria-label="Quick"></nav>';
  document.body.appendChild(box);
  var bar = box.querySelector(".uqb"), sheet = box.querySelector(".uqp"), list = box.querySelector(".uql");
  var ico = function (k) { return '<span class="uqi"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC[k] + "</svg></span>"; };
  var HREF = { home: "./", read: "quran-reader/", search: "#search", graph: "#research" };
  bar.innerHTML = KEYS.map(function (k) { return '<a data-k="' + k + '" href="' + esc(new URL(HREF[k], ROOT).href) + '">' + ico(k) + '<span class="uqt"></span></a>'; }).join("") +
    '<button type="button" data-k="menu" aria-expanded="false" aria-controls="uqp">' + ico("menu") + '<span class="uqt"></span></button>';
  function labels() {
    var l = T[lang()];
    bar.querySelectorAll("[data-k]").forEach(function (el) { var k = el.dataset.k; el.querySelector(".uqt").textContent = l.bar[k]; el.setAttribute("aria-label", l.full[k]); el.title = l.full[k]; });
    list.innerHTML = LINKS.map(function (h, i) { return '<a href="' + esc(new URL(h, ROOT).href) + '">' + esc(l.menu[i]) + "</a>"; }).join("");
    sheet.setAttribute("aria-label", l.full.menu);
  }
  function sync() { bar.querySelectorAll("a[data-k]").forEach(function (a) { a.toggleAttribute("aria-current", a.dataset.k === cur); if (a.dataset.k === cur) a.setAttribute("aria-current", "page"); }); }
  function setCur(k) { cur = k; sync(); }
  function open(o, focus) {
    box.classList.toggle("uq-o", o); bar.querySelector("button").setAttribute("aria-expanded", String(o));
    if (o) { var f = list.querySelector("a"); if (f) f.focus({ preventScroll: true }); } else if (focus) bar.querySelector("button").focus();
  }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (b) { open(!box.classList.contains("uq-o"), true); return; }
    var a = e.target.closest("a[data-k]"); if (!a) return; open(false, false);
    if (!HOME) return; var k = a.dataset.k;
    if (k === "home") { e.preventDefault(); scrollTo({ top: 0, behavior: smooth() }); history.replaceState(null, "", location.pathname + location.search); setCur("home"); }
    else if (k === "search" || k === "graph") {
      var t = document.getElementById(k === "search" ? "search" : "research"); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: smooth() }); history.replaceState(null, "", "#" + t.id); setCur(k);
      var inp = k === "search" && t.querySelector("input"); if (inp) setTimeout(function () { inp.focus({ preventScroll: true }); }, 500);
    }
  });
  box.querySelector(".uqs").addEventListener("click", function () { open(false, true); });
  list.addEventListener("click", function () { open(false, false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("uq-o")) open(false, true); });
  new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  if (HOME && "IntersectionObserver" in window) {
    var seen = {}, io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      var k = seen.search ? "search" : seen.research ? "graph" : "home"; if (k !== cur) setCur(k);
    }, { rootMargin: "-40% 0px -50% 0px" });
    ["search", "research"].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
  labels(); sync();
})();
