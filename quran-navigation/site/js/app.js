/* Quran Navigation — application logic (vanilla JS, no build step, works offline). */
(function () {
  "use strict";

  var DATA = window.QURAN_DATA;        // [{n, ayahs:[...]}] for 114 surahs
  var META = window.SURAHS;            // names (ar/en/bn), revelation type, start page
  var JUZ = window.JUZ_STARTS;         // [surah, ayah] for each juz
  var HIZB = window.HIZB_STARTS || []; // [surah, ayah] or null (pending)
  var RUKUH = window.RUKUH_STARTS || [];
  var SAJDAH = window.SAJDAH_AYAHS || [];
  var TOPICS = window.TOPICS || [];
  var T = window.I18N;
  var TOTAL_PAGES = 604;
  var lang = localStorage.getItem("qn_lang") || "en";
  if (!T[lang]) lang = "en";
  var app = document.getElementById("app");

  /* ---------- helpers ---------- */
  function t(key, vars) {
    var s = (T[lang] && T[lang][key]) || T.en[key] || key;
    if (vars) for (var k in vars) s = s.replace("{" + k + "}", localNum(vars[k]));
    return s;
  }
  function localNum(n) {
    var str = String(n);
    if (lang === "ar") return str.replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; });
    if (lang === "bn") return str.replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; });
    return str;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function primaryName(m) { return lang === "bn" ? m.bn : m.en; }
  function typeLabel(m) { return m.t === "d" ? t("madani") : t("makki"); }
  function ayahCount(n) { return DATA[n - 1].ayahs.length; }
  function surahMeta(n) { return META[n - 1]; }
  function ayahRef(s, a) { return surahMeta(s).en + " " + localNum(s) + ":" + localNum(a); }

  function normAr(s) {
    return s.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
      .replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي");
  }
  function normLatin(s) { return s.toLowerCase().replace(/[\s'’\-]/g, ""); }

  var searchIndex = null;
  function buildIndex() {
    if (searchIndex) return searchIndex;
    searchIndex = [];
    DATA.forEach(function (s) {
      s.ayahs.forEach(function (a, i) { searchIndex.push({ s: s.n, a: i + 1, n: normAr(a), raw: a }); });
    });
    return searchIndex;
  }

  function isSajdah(s, a) {
    for (var i = 0; i < SAJDAH.length; i++) if (SAJDAH[i][0] === s && SAJDAH[i][1] === a) return true;
    return false;
  }
  function hizbVerified() { return HIZB.filter(Boolean).length; }

  /* ---------- storage ---------- */
  function setLastRead(n, a) { localStorage.setItem("qn_last", JSON.stringify({ n: n, a: a || 1 })); }
  function getLastRead() { try { return JSON.parse(localStorage.getItem("qn_last")); } catch (e) { return null; } }
  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem("qn_bookmarks")) || []; } catch (e) { return []; }
  }
  function saveBookmarks(list) { localStorage.setItem("qn_bookmarks", JSON.stringify(list)); }
  function hasBookmark(n, a) {
    return getBookmarks().some(function (b) { return b.n === n && b.a === a; });
  }
  function toggleBookmark(n, a) {
    var list = getBookmarks();
    var idx = -1;
    list.forEach(function (b, i) { if (b.n === n && b.a === a) idx = i; });
    if (idx > -1) list.splice(idx, 1); else list.push({ n: n, a: a, ts: Date.now() });
    list.sort(function (x, y) { return x.n - y.n || x.a - y.a; });
    saveBookmarks(list);
    return idx === -1;
  }

  /* ---------- navigation menu ---------- */
  var CATS = [
    { key: "page", route: "#/page/1", icon: "📄", count: function () { return TOTAL_PAGES; } },
    { key: "surah", route: "#/", icon: "📖", count: function () { return 114; } },
    { key: "hifz", route: "#/hifz", icon: "🌙", count: function () { return hifzPagesDone() + "/604"; } },
    { key: "juz", route: "#/juz", icon: "📚", count: function () { return 30; } },
    { key: "hizb", route: "#/hizb", icon: "۞", count: function () { return hizbVerified() + "/60"; } },
    { key: "rukuh", route: "#/rukuh", icon: "۝", count: function () { return RUKUH.length ? RUKUH.length : "—"; } },
    { key: "ayah", route: "#/ayah", icon: "﴿﴾", count: function () { return "6236"; } },
    { key: "sajdah", route: "#/sajdah", icon: "۩", count: function () { return SAJDAH.length; } },
    { key: "topic", route: "#/topic", icon: "✦", count: function () { return TOPICS.length; } },
    { key: "bookmark", route: "#/bookmark", icon: "🔖", count: function () { return getBookmarks().length; } },
    { key: "tajweed", route: "#/tajweed", icon: "ت", count: function () { return (window.TAJWEED_LESSONS || []).length; } },
    { key: "manzumah", route: "#/manzumah", icon: "ض", count: function () { return ((window.MANZUMAH || {}).lines || []).length || "—"; } }
  ];
  function hifzPagesDone() {
    try {
      var parsed = window.QNHifzCore.importJSON(localStorage.getItem("qn_hifz") || "null");
      if (parsed.error) return 0;
      return window.QNHifzCore.progress(parsed.state).pages;
    } catch (e) { return 0; }
  }
  function activeCat(route) {
    if (route === "search") return "search";
    if (route === "surah" || route === "") return "surah";
    return route;
  }
  function renderNav(route) {
    var active = activeCat(route);
    var bar = document.getElementById("catbar");
    var html = CATS.map(function (c) {
      return '<a href="' + c.route + '" data-cat="' + c.key + '"' + (c.key === active ? ' aria-current="page"' : "") + ">" +
        c.icon + " " + t("cat" + cap(c.key)) + "</a>";
    }).join("");
    html += '<a href="#/search" data-cat="search"' + (active === "search" ? ' aria-current="page"' : "") + ">⌕ " + t("search") + "</a>";
    bar.innerHTML = html;
    var mega = document.getElementById("megaGrid");
    mega.innerHTML = CATS.map(function (c) {
      return '<a class="mcard" href="' + c.route + '" data-close="1"><span class="mico">' + c.icon + '</span>' +
        '<span class="mtext"><strong>' + t("cat" + cap(c.key)) + '</strong><span class="muted">' + t("desc" + cap(c.key)) + "</span></span>" +
        '<span class="mcount">' + localNum(c.count()) + "</span></a>";
    }).join("");
    document.querySelectorAll("#megaGrid [data-close]").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function openMenu() {
    var m = document.getElementById("megaMenu");
    m.hidden = false;
    document.getElementById("menuBtn").setAttribute("aria-expanded", "true");
    var first = m.querySelector("a"); if (first) first.focus();
  }
  function closeMenu() {
    var m = document.getElementById("megaMenu");
    m.hidden = true;
    document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
  }

  /* ---------- theme (system / light / dark) ---------- */
  function themeMode() {
    var m = localStorage.getItem("qn_theme");
    return m === "light" || m === "dark" ? m : "auto";
  }
  function effectiveDark() {
    var m = themeMode();
    return m === "dark" || (m === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function applyThemeAttr() {
    var m = themeMode();
    if (m === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", m);
    var color = effectiveDark() ? "#0c0f14" : "#faf7f0";
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (el) { el.setAttribute("content", color); });
  }
  function cycleTheme() {
    var order = ["auto", "light", "dark"];
    var next = order[(order.indexOf(themeMode()) + 1) % 3];
    if (next === "auto") localStorage.removeItem("qn_theme"); else localStorage.setItem("qn_theme", next);
    applyThemeAttr();
    applyChrome(currentRoute());
  }
  function cycleLang() {
    var order = ["en", "bn", "ar"];
    lang = order[(order.indexOf(lang) + 1) % 3];
    localStorage.setItem("qn_lang", lang);
    route();
  }
  function currentRoute() {
    return (location.hash.replace(/^#\/?/, "").split(/[\/?]/)[0]) || "surah";
  }

  /* ---------- chrome ---------- */
  function applyChrome(route) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.className = "lang-" + lang;
    document.title = t("appName");
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    var LANG_LABEL = { en: "EN", bn: "বাং", ar: "عربي" };
    var langBtn = document.getElementById("langToggle");
    langBtn.textContent = LANG_LABEL[lang];
    langBtn.setAttribute("aria-label", t("langLabel"));
    langBtn.setAttribute("title", t("langLabel"));
    var mode = themeMode();
    var themeBtn = document.getElementById("themeToggle");
    var icon = mode === "light" ? "☀" : mode === "dark" ? "☾" : "◐";
    var label = mode === "light" ? t("themeLight") : mode === "dark" ? t("themeDark") : t("themeAuto");
    themeBtn.textContent = icon;
    themeBtn.setAttribute("aria-label", label);
    themeBtn.setAttribute("title", label);
    document.getElementById("installBtn").textContent = "⬇ " + t("installApp");
    document.getElementById("menuBtn").textContent = "☰ " + t("menuOpen");
    document.getElementById("menuTitle").textContent = t("navTitle");
    document.getElementById("menuClose").textContent = "✕ " + t("close");
    renderNav(route);
  }

  /* ---------- views ---------- */
  function viewSurahList(query) {
    var q = (query || "").trim();
    var last = getLastRead();
    var html = "";
    if (last && surahMeta(last.n)) {
      html += '<div class="card continue"><div><div class="muted">' + t("lastRead") + "</div>" +
        '<strong>' + esc(surahMeta(last.n).ar) + " · " + t("ayah") + " " + localNum(last.a) + "</strong></div>" +
        '<a class="btn" href="#/surah/' + last.n + "/" + last.a + '">' + t("continueReading") + "</a></div>";
    }
    html += '<input class="searchbox" id="surahFilter" type="search" placeholder="' + esc(t("searchPh")) +
      '" value="' + esc(q) + '" aria-label="' + esc(t("surah")) + '">';
    html += '<div class="grid" id="surahGrid">' + surahCards(q) + "</div>";
    app.innerHTML = html;
    var input = document.getElementById("surahFilter");
    input.addEventListener("input", function () {
      document.getElementById("surahGrid").innerHTML = surahCards(input.value.trim());
    });
  }
  function surahCards(q) {
    var out = "", nq = normLatin(q), arq = normAr(q);
    META.forEach(function (m) {
      if (q) {
        var hit = String(m.n) === q || normLatin(m.en).indexOf(nq) > -1 ||
          normLatin(m.bn).indexOf(nq) > -1 || (arq && normAr(m.ar).indexOf(arq) > -1);
        if (!hit) return;
      }
      out += '<a class="item" href="#/surah/' + m.n + '"><div class="num">' + localNum(m.n) + "</div>" +
        '<div class="names"><div class="ar">' + esc(m.ar) + "</div>" +
        '<div class="sub">' + esc(primaryName(m)) + " · " + t("ayahs", { n: ayahCount(m.n) }) + "</div>" +
        '<span class="tag">' + typeLabel(m) + "</span></div></a>";
    });
    return out || '<p class="muted">' + t("noResults") + "</p>";
  }

  function viewSurah(n, ayah) {
    var m = surahMeta(n);
    if (!m) return viewNotFound();
    var count = ayahCount(n);
    var prevN = n > 1 ? n - 1 : null, nextN = n < 114 ? n + 1 : null;
    var html = '<div class="reader"><div class="reader-head"><div class="ar">' + esc(m.ar) + "</div>" +
      "<div><strong>" + esc(m.en) + "</strong>" + (lang === "en" ? "" : " · " + esc(m.bn)) + "</div>" +
      '<div class="meta">' + t("surah") + " " + localNum(n) + " · " + t("ayahs", { n: count }) +
      " · " + typeLabel(m) + " · " + t("page") + " " + localNum(m.p) + "</div></div>" + '<div id="player"></div>';
    html += '<div class="bar"><div>' +
      (prevN ? '<a class="btn ghost" href="#/surah/' + prevN + '">← ' + t("prev") + " · " + esc(META[prevN - 1].en) + "</a>" : "") +
      "</div><div>" +
      (nextN ? '<a class="btn ghost" href="#/surah/' + nextN + '">' + t("next") + " · " + esc(META[nextN - 1].en) + " →</a>" : "") +
      "</div></div>";
    html += '<div id="ayahs">';
    DATA[n - 1].ayahs.forEach(function (text, i) {
      var a = i + 1;
      var bm = hasBookmark(n, a);
      html += '<div class="ayah" id="a-' + a + '">' +
        '<button class="badge" type="button" aria-label="' + t("play") + " " + localNum(a) + '">' + localNum(a) + "</button>" +
        '<div class="txt" lang="ar">' + esc(text) + (isSajdah(n, a) ? ' <span class="sajdah-mark" title="' + t("sajdahMark") + '">۩</span>' : "") + "</div>" +
        '<button class="bm' + (bm ? " on" : "") + '" type="button" data-a="' + a + '" aria-pressed="' + bm +
        '" aria-label="' + (bm ? t("bookmarkRemove") : t("bookmarkAdd")) + '">' + (bm ? "★" : "☆") + "</button></div>";
    });
    html += "</div>";
    html += '<p class="note">' + t("translationNote") + "</p></div>";
    app.innerHTML = html;
    setLastRead(n, ayah || 1);
    if (window.QNAudio) QNAudio.mount(n, ayah || 1);
    if (ayah && ayah <= count) {
      var el = document.getElementById("a-" + ayah);
      if (el) { el.classList.add("hl"); setTimeout(function () { el.scrollIntoView({ block: "start" }); }, 30); }
    } else {
      window.scrollTo(0, 0);
    }
    document.querySelectorAll(".ayah").forEach(function (el) {
      var a = Number(el.id.split("-")[1]);
      el.addEventListener("click", function () { setLastRead(n, a); });
      el.querySelector(".badge").addEventListener("click", function (e) {
        e.stopPropagation();
        if (window.QNAudio) QNAudio.playAyah(n, a);
      });
    });
    document.querySelectorAll(".bm").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var on = toggleBookmark(n, Number(btn.getAttribute("data-a")));
        btn.textContent = on ? "★" : "☆";
        btn.classList.toggle("on", on);
        btn.setAttribute("aria-pressed", String(on));
        btn.setAttribute("aria-label", on ? t("bookmarkRemove") : t("bookmarkAdd"));
        renderNav(activeCat("surah"));
      });
    });
  }

  function viewJuz() {
    var html = '<h2>' + t("tabJuz") + '</h2><div class="grid">';
    JUZ.forEach(function (pos, i) {
      var s = pos[0], a = pos[1];
      html += '<a class="item juz-card" href="#/surah/' + s + "/" + a + '"><div class="num">' + localNum(i + 1) + "</div>" +
        '<div class="names"><div class="ar">' + t("juz") + " " + localNum(i + 1) + "</div>" +
        '<div class="sub">' + esc(surahMeta(s).ar) + " · " + esc(primaryName(surahMeta(s))) + "</div>" +
        '<div class="sub">' + t("startsAt", { s: s, a: a }) + "</div></div></a>";
    });
    app.innerHTML = html + "</div>";
  }

  function viewHizb() {
    var html = '<h2>' + t("catHizb") + '</h2><p class="muted">' + t("hizbNote") + '</p><div class="grid">';
    HIZB.forEach(function (pos, i) {
      var num = localNum(i + 1);
      if (!pos) {
        html += '<div class="item pending"><div class="num">' + num + '</div><div class="names">' +
          '<div class="ar">' + t("catHizb") + " " + num + '</div><div class="sub">' + t("pending") + "</div></div></div>";
        return;
      }
      html += '<a class="item" href="#/surah/' + pos[0] + "/" + pos[1] + '"><div class="num">' + num + "</div>" +
        '<div class="names"><div class="ar">' + t("catHizb") + " " + num + '</div>' +
        '<div class="sub">' + t("startsAt", { s: pos[0], a: pos[1] }) + "</div></div></a>";
    });
    app.innerHTML = html + "</div>";
  }

  function viewRukuh() {
    var html = '<h2>' + t("catRukuh") + "</h2>";
    if (!RUKUH.length) {
      app.innerHTML = html + '<div class="card"><p class="muted">' + t("rukuhPending") + "</p></div>";
      return;
    }
    html += '<div class="grid">';
    RUKUH.forEach(function (pos, i) {
      html += '<a class="item" href="#/surah/' + pos[0] + "/" + pos[1] + '"><div class="num">' + localNum(i + 1) + "</div>" +
        '<div class="names"><div class="sub">' + t("startsAt", { s: pos[0], a: pos[1] }) + "</div></div></a>";
    });
    app.innerHTML = html + "</div>";
  }

  function viewAyahGo(msg) {
    var opts = META.map(function (m) {
      return '<option value="' + m.n + '">' + m.n + ". " + esc(m.en) + "</option>";
    }).join("");
    app.innerHTML = '<h2>' + t("catAyah") + '</h2><form class="card goform" id="goForm">' +
      '<label class="muted" for="goS">' + t("chooseSurah") + '</label><select id="goS" class="select">' + opts + "</select>" +
      '<label class="muted" for="goA">' + t("ayahNum") + '</label><input id="goA" class="searchbox" type="number" min="1" max="286" value="1">' +
      '<button class="btn" type="submit">' + t("gotoAyah") + "</button>" +
      (msg ? '<p class="muted" role="alert">' + esc(msg) + "</p>" : "") + "</form>";
    document.getElementById("goForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var s = parseInt(document.getElementById("goS").value, 10);
      var a = parseInt(document.getElementById("goA").value, 10);
      if (!a || a < 1 || a > ayahCount(s)) { viewAyahGo(t("invalidRef")); return; }
      location.hash = "#/surah/" + s + "/" + a;
    });
  }

  function viewSajdah() {
    var html = '<h2>' + t("catSajdah") + '</h2><div class="grid">';
    SAJDAH.forEach(function (p, i) {
      var s = p[0], a = p[1];
      html += '<a class="item" href="#/surah/' + s + "/" + a + '"><div class="num">۩</div>' +
        '<div class="names"><div class="ar">' + esc(surahMeta(s).ar) + '</div><div class="sub">' +
        esc(ayahRef(s, a)) + "</div></div></a>";
    });
    app.innerHTML = html + "</div>";
  }

  function viewTopics() {
    var html = '<h2>' + t("topicHeading") + '</h2><div class="grid">';
    TOPICS.forEach(function (tp) {
      html += '<a class="item" href="#/topic/' + tp.id + '"><div class="num">✦</div><div class="names">' +
        '<div class="ar">' + esc(tp[lang] || tp.en) + '</div><div class="sub">' + t("items", { n: tp.refs.length }) + "</div></div></a>";
    });
    app.innerHTML = html + "</div>";
  }

  function viewTopic(id) {
    var tp = TOPICS.filter(function (x) { return x.id === id; })[0];
    if (!tp) return viewNotFound();
    var html = '<p><a href="#/topic">← ' + t("back2") + '</a></p><h2>' + esc(tp[lang] || tp.en) + "</h2>";
    tp.refs.forEach(function (r) {
      for (var a = r[1]; a <= r[2]; a++) {
        html += '<a class="hit" href="#/surah/' + r[0] + "/" + a + '"><span class="ref">' + esc(ayahRef(r[0], a)) +
          '</span><div class="txt" lang="ar">' + esc(DATA[r[0] - 1].ayahs[a - 1]) + "</div></a>";
      }
    });
    app.innerHTML = html;
  }

  function viewBookmarks() {
    var list = getBookmarks();
    var html = '<h2>' + t("catBookmark") + "</h2>";
    if (!list.length) {
      app.innerHTML = html + '<p class="muted">' + t("noBookmarks") + "</p>";
      return;
    }
    html += '<div class="bar"><span class="muted">' + t("items", { n: list.length }) + '</span>' +
      '<button class="btn ghost" id="clearBm" type="button">' + t("clearAll") + "</button></div>";
    list.forEach(function (b) {
      html += '<div class="bmrow"><a class="hit" href="#/surah/' + b.n + "/" + b.a + '"><span class="ref">' + esc(ayahRef(b.n, b.a)) +
        '</span><div class="txt" lang="ar">' + esc(DATA[b.n - 1].ayahs[b.a - 1]) + "</div></a>" +
        '<button class="btn ghost rm" type="button" data-n="' + b.n + '" data-a="' + b.a + '" aria-label="' + t("bookmarkRemove") + '">✕</button></div>';
    });
    app.innerHTML = html;
    document.querySelectorAll(".rm").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var n = Number(btn.getAttribute("data-n")), a = Number(btn.getAttribute("data-a"));
        saveBookmarks(getBookmarks().filter(function (b) { return !(b.n === n && b.a === a); }));
        viewBookmarks(); renderNav("bookmark");
      });
    });
    document.getElementById("clearBm").addEventListener("click", function () {
      saveBookmarks([]); viewBookmarks(); renderNav("bookmark");
    });
  }

  function viewPage(p) {
    p = Math.max(1, Math.min(TOTAL_PAGES, p || 1));
    var current = null, starts = [];
    META.forEach(function (m) { if (m.p <= p) current = m; if (m.p === p) starts.push(m); });
    var num = String(p).padStart(3, "0");
    var startNames = starts.map(function (m) { return esc(m.en); }).join(", ");
    app.innerHTML = '<div class="pager">' +
      '<a class="btn ghost' + (p <= 1 ? " disabled" : "") + '" href="#/page/' + (p - 1) + '">← ' + t("prev") + "</a>" +
      '<form id="pageForm" style="display:flex;gap:8px"><input id="pageNum" type="number" min="1" max="604" value="' + p + '" aria-label="' + t("page") + '">' +
      '<button class="btn" type="submit">' + t("go") + "</button></form>" +
      '<a class="btn ghost' + (p >= TOTAL_PAGES ? " disabled" : "") + '" href="#/page/' + (p + 1) + '">' + t("next") + " →</a></div>" +
      '<div class="page-info"><strong>' + t("pageOf", { n: p }) + '</strong><div class="muted">' +
      t("surahOnPage") + ": " + esc(current ? current.en : "") + (startNames ? " · " + t("startsOn") + ": " + startNames : "") +
      '</div></div><img class="page-img" alt="Quran page ' + p + '" src="pages/page' + num + '.png" width="1260" height="2038">';
    document.getElementById("pageForm").addEventListener("submit", function (e) {
      e.preventDefault();
      location.hash = "#/page/" + (parseInt(document.getElementById("pageNum").value, 10) || 1);
    });
  }

  function viewSearch(query) {
    var q = (query || "").trim();
    app.innerHTML = '<input class="searchbox" id="qInput" type="search" placeholder="' + esc(t("searchPh")) +
      '" value="' + esc(q) + '" aria-label="' + esc(t("search")) + '"><div id="results"></div>';
    var input = document.getElementById("qInput");
    input.addEventListener("input", function () {
      history.replaceState(null, "", "#/search?q=" + encodeURIComponent(input.value));
      renderResults(input.value.trim());
    });
    renderResults(q);
  }
  function renderResults(q) {
    var box = document.getElementById("results");
    if (!q) { box.innerHTML = '<p class="muted">' + t("searchHint") + "</p>"; return; }
    var ref = q.match(/^([0-9٠-٩]{1,3})\s*[:：]\s*([0-9٠-٩]{1,3})$/);
    var toAr = function (x) { return x.replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); }); };
    if (ref) {
      var rs = parseInt(toAr(ref[1]), 10), ra = parseInt(toAr(ref[2]), 10);
      if (rs >= 1 && rs <= 114 && ra >= 1 && ra <= ayahCount(rs)) {
        box.innerHTML = '<a class="hit" href="#/surah/' + rs + "/" + ra + '"><span class="ref">' + esc(ayahRef(rs, ra)) +
          '</span><div class="txt" lang="ar">' + esc(DATA[rs - 1].ayahs[ra - 1]) + "</div></a>";
        return;
      }
      box.innerHTML = '<p class="muted">' + t("notFound") + "</p>";
      return;
    }
    if (/^\d{1,3}$/.test(q) && +q >= 1 && +q <= 114) {
      box.innerHTML = '<a class="hit" href="#/surah/' + q + '"><span class="ref">' + esc(surahMeta(+q).en) + "</span></a>";
      return;
    }
    if (q.length < 2) { box.innerHTML = '<p class="muted">' + t("searchHint") + "</p>"; return; }
    var out = "", nq = normLatin(q), arq = normAr(q);
    META.forEach(function (m) {
      if (normLatin(m.en).indexOf(nq) > -1 || normLatin(m.bn).indexOf(nq) > -1 || normAr(m.ar).indexOf(arq) > -1) {
        out += '<a class="hit" href="#/surah/' + m.n + '"><span class="ref">' + t("surah") + " " + localNum(m.n) + " · " +
          esc(m.ar) + " · " + esc(m.en) + "</span></a>";
      }
    });
    if (/[\u0600-\u06FF]/.test(q) && arq.length >= 2) {
      var idx = buildIndex(), shown = 0;
      for (var i = 0; i < idx.length && shown < 60; i++) {
        if (idx[i].n.indexOf(arq) > -1) {
          out += '<a class="hit" href="#/surah/' + idx[i].s + "/" + idx[i].a + '"><span class="ref">' +
            esc(ayahRef(idx[i].s, idx[i].a)) + '</span><div class="txt" lang="ar">' + esc(idx[i].raw) + "</div></a>";
          shown++;
        }
      }
    }
    box.innerHTML = out || '<p class="muted">' + t("noResults") + "</p>";
  }

  function showToast(message) {
    var el = document.createElement("div");
    el.className = "toast"; el.setAttribute("role", "status");
    var span = document.createElement("span"); span.textContent = message; el.appendChild(span);
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 3500);
  }
  function viewNotFound() { app.innerHTML = '<p class="muted">' + t("notFound") + "</p>"; }

  /* ---------- router ---------- */
  function route() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("?");
    var path = parts[0].split("/").filter(Boolean);
    var query = parts[1] ? decodeURIComponent((parts[1].match(/q=([^&]*)/) || [])[1] || "") : "";
    var key = path[0] || "";
    applyChrome(key || "surah");
    if (key === "surah") {
      var n = parseInt(path[1], 10), a = parseInt(path[2], 10);
      if (!n || n < 1 || n > 114) return viewNotFound();
      viewSurah(n, a);
    } else if (key === "juz") viewJuz();
    else if (key === "hizb") viewHizb();
    else if (key === "rukuh") viewRukuh();
    else if (key === "ayah") viewAyahGo("");
    else if (key === "sajdah") viewSajdah();
    else if (key === "topic") (path[1] ? viewTopic(path[1]) : viewTopics());
    else if (key === "bookmark") viewBookmarks();
    else if (key === "hifz") window.QNHifzView.render(app, { t: t, localNum: localNum, esc: esc });
    else if (key === "tajweed") window.QNTajweedView.render(app, path, { t: t, localNum: localNum, esc: esc, lang: lang, flash: showToast });
    else if (key === "manzumah") window.QNManzumahView.render(app, { t: t, localNum: localNum, esc: esc });
    else if (key === "page") viewPage(parseInt(path[1], 10));
    else if (key === "search") viewSearch(query);
    else viewSurahList("");
  }

  /* ---------- events ---------- */
  document.getElementById("langToggle").addEventListener("click", cycleLang);
  document.getElementById("themeToggle").addEventListener("click", cycleTheme);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (themeMode() === "auto") applyThemeAttr();
  });
  applyThemeAttr();
  document.getElementById("menuBtn").addEventListener("click", function () {
    document.getElementById("megaMenu").hidden ? openMenu() : closeMenu();
  });
  document.getElementById("menuClose").addEventListener("click", closeMenu);
  document.getElementById("megaMenu").addEventListener("click", function (e) {
    if (e.target.id === "megaMenu") closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "/") { e.preventDefault(); openMenu(); return; }
    var m = location.hash.match(/^#\/page\/(\d+)$/);
    if (!m) return;
    if (e.key === "ArrowRight") location.hash = "#/page/" + (+m[1] + 1);
    if (e.key === "ArrowLeft") location.hash = "#/page/" + (+m[1] - 1);
  });
  window.addEventListener("hashchange", function () {
    closeMenu();
    window.scrollTo(0, 0);
    route();
  });

  if (!location.hash) location.hash = "#/";
  route();
})();
