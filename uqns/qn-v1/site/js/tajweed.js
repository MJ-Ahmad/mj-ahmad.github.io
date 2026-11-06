/* Tajweed screens: lessons, ayah scanner (highlights rules in a verse), quiz. Manzumah drill.
   Uses QNTajweedCore for detection. Lessons come from data/tajweed-lessons.js. */
(function (root) {
  "use strict";
  var Core = root.QNTajweedCore;
  var LESSONS = root.TAJWEED_LESSONS || [];
  var MZ = root.MANZUMAH || { lines: [], reviewed: false };

  function ruleLabelKey(rule) {
    return { izhar: "ruleIzhar", idgham_ghunna: "ruleIdghamGhunna", idgham_bila: "ruleIdghamBila", iqlab: "ruleIqlab",
      ikhfa: "ruleIkhfa", mim_idgham: "ruleMimIdgham", mim_ikhfa: "ruleMimIkhfa", mim_izhar: "ruleMimIzhar",
      qalqalah: "ruleQalqalah" }[rule];
  }
  function ruleClass(rule) {
    if (rule === "qalqalah") return "tj-qal";
    if (rule.indexOf("mim_") === 0) return "tj-mim";
    return "tj-noon";
  }
  function lessonTitle(l, lang) { return l.title[lang] || l.title.en; }
  function lessonBody(l, lang) { return l.body[lang] || l.body.en; }

  /* Render an ayah with rule letters wrapped in highlighted spans. */
  function highlight(text, instances, esc) {
    var out = "", pos = 0;
    instances.slice().sort(function (a, b) { return a.start - b.start; }).forEach(function (x) {
      if (x.start < pos) return;
      out += esc(text.slice(pos, x.start));
      out += '<span class="' + ruleClass(x.rule) + '" title="' + x.rule + '">' + esc(text.slice(x.start, x.end)) + "</span>";
      pos = x.end;
    });
    return out + esc(text.slice(pos));
  }

  function render(container, parts, ctx) {
    var t = ctx.t, num = ctx.localNum, esc = ctx.esc, lang = ctx.lang, D = root.QURAN_DATA;
    var sub = parts[1] || "";
    var pending = '<p class="warn" role="note">' + t("tjPending") + "</p>";

    if (sub === "lesson" && parts[2]) {
      var l = LESSONS.filter(function (x) { return x.id === parts[2]; })[0];
      if (!l) { container.innerHTML = '<p class="muted">' + t("notFound") + "</p>"; return; }
      var ex = l.examples.map(function (e) {
        return '<a class="item" href="#/surah/' + e[0] + "/" + e[1] + '"><div class="num">' + num(e[0]) + ":" + num(e[1]) +
          '</div><div class="names"><div class="ar">' + esc(D[e[0] - 1].ayahs[e[1] - 1]) + "</div></div></a>";
      }).join("");
      container.innerHTML = '<p><a href="#/tajweed">← ' + t("tjLessons") + "</a></p><h2>" + esc(lessonTitle(l, lang)) + "</h2>" +
        (l.status === "pending" ? pending : "") +
        '<div class="card"><p>' + esc(lessonBody(l, lang)) + "</p></div>" +
        '<h3 class="sec">' + t("tjExamples") + '</h3><div class="grid">' + ex + "</div>" +
        '<p class="note">' + t("tjScanHint") + "</p>";
      return;
    }

    if (sub === "ayah" && parts[2] && parts[3]) {
      var s = parseInt(parts[2], 10), a = parseInt(parts[3], 10);
      if (!D[s - 1] || !D[s - 1].ayahs[a - 1]) { container.innerHTML = '<p class="muted">' + t("notFound") + "</p>"; return; }
      var text = D[s - 1].ayahs[a - 1];
      var inst = Core.scanAyah(text);
      var legend = inst.length ? inst.map(function (x) {
        return '<li><span class="' + ruleClass(x.rule) + '">' + esc(text.slice(x.start, x.end)) + "</span> — " +
          t(ruleLabelKey(x.rule)) + (x.next ? " (" + esc(x.next) + ")" : "") + "</li>";
      }).join("") : "<li class=\"muted\">" + t("tjNoRules") + "</li>";
      container.innerHTML = '<p><a href="#/tajweed">← ' + t("tjLessons") + "</a></p><h2>" + t("tjScanTitle", { s: s, a: a }) + "</h2>" +
        '<div class="card ayah-scan" lang="ar">' + highlight(text, inst, esc) + "</div>" +
        '<h3 class="sec">' + t("tjLegend") + '</h3><ul class="legend">' + legend + "</ul>" +
        '<div class="sactions"><a class="btn ghost" href="#/surah/' + s + "/" + a + '">' + t("tjOpenAyah") + "</a></div>" +
        '<div class="legend-key"><span class="tj-noon">' + t("tjKeyNoon") + '</span> <span class="tj-mim">' + t("tjKeyMim") +
        '</span> <span class="tj-qal">' + t("tjKeyQal") + "</span></div>";
      return;
    }

    if (sub === "quiz") {
      var score = (root.__tjScore || { right: 0, total: 0 });
      var q = Core.quizQuestion(D, Math.random);
      if (!q) { container.innerHTML = '<p class="muted">' + t("noResults") + "</p>"; return; }
      var opts = q.options.map(function (g) {
        return '<button class="btn ghost quiz-opt" type="button" data-g="' + g + '">' + t("ruleGroup_" + g) + "</button>";
      }).join("");
      container.innerHTML = '<p><a href="#/tajweed">← ' + t("tjLessons") + "</a></p><h2>" + t("tjQuiz") + "</h2>" +
        '<div class="card"><p class="muted">' + t("tjQuestion") + "</p>" +
        '<div class="ayah-scan" lang="ar">' + highlight(q.text, [{ rule: "izhar", start: q.start, end: q.end }], esc) + "</div>" +
        '<p class="muted">' + t("tjRef", { s: q.surah, a: q.ayah }) + "</p>" +
        '<div class="grid quiz-grid">' + opts + "</div>" +
        '<p id="quizFeedback" role="status"></p>' +
        '<p class="muted">' + t("tjScore", { r: score.right, n: score.total }) + "</p></div>";
      container.querySelectorAll(".quiz-opt").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var ok = btn.getAttribute("data-g") === q.answer;
          root.__tjScore = { right: score.right + (ok ? 1 : 0), total: score.total + 1 };
          document.getElementById("quizFeedback").textContent = ok ? t("tjCorrect") : t("tjWrong", { g: t("ruleGroup_" + q.answer) });
          container.querySelectorAll(".quiz-opt").forEach(function (b) { b.disabled = true; });
          var next = document.createElement("a");
          next.className = "btn"; next.href = "#/tajweed/quiz"; next.textContent = t("tjNext");
          document.getElementById("quizFeedback").appendChild(document.createTextNode(" "));
          document.getElementById("quizFeedback").appendChild(next);
        });
      });
      return;
    }

    // Overview: lessons + ayah scanner entry + quiz
    var cards = LESSONS.map(function (l) {
      return '<a class="item" href="#/tajweed/lesson/' + l.id + '"><div class="num">ت</div><div class="names">' +
        '<div class="ar">' + esc(lessonTitle(l, lang)) + "</div>" +
        (l.status === "pending" ? '<div class="sub">' + t("tjStatusPending") + "</div>" : "") + "</div></a>";
    }).join("");
    container.innerHTML = '<h2>' + t("catTajweed") + "</h2>" + '<p class="muted">' + t("tjIntro") + "</p>" +
      '<div class="sactions" style="margin-bottom:12px">' +
      '<a class="btn" href="#/tajweed/quiz">' + t("tjQuiz") + "</a></div>" +
      '<form id="scanForm" class="card goform"><label class="muted" for="scS">' + t("chooseSurah") + "</label>" +
      '<input id="scS" class="field" type="number" min="1" max="114" value="2" inputmode="numeric">' +
      '<label class="muted" for="scA">' + t("ayahNum") + "</label>" +
      '<input id="scA" class="field" type="number" min="1" max="286" value="4" inputmode="numeric">' +
      '<button class="btn" type="submit">' + t("tjScanBtn") + "</button></form>" +
      '<h3 class="sec">' + t("tjLessons") + '</h3><div class="grid">' + cards + "</div>";
    document.getElementById("scanForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var s = parseInt(document.getElementById("scS").value, 10), a = parseInt(document.getElementById("scA").value, 10);
      if (!D[s - 1] || !D[s - 1].ayahs[a - 1]) { ctx.flash(t("invalidRef")); return; }
      location.hash = "#/tajweed/ayah/" + s + "/" + a;
    });
  }

  function renderManzumah(container, ctx) {
    var t = ctx.t, num = ctx.localNum, esc = ctx.esc;
    var KEY = "qn_manzumah";
    var done = {};
    try { done = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { done = {}; }
    var lines = MZ.lines || [];
    var html = '<h2>' + t("catManzumah") + "</h2>";
    if (!lines.length) {
      container.innerHTML = html + '<div class="card"><p class="warn">' + t("mzPending") + "</p>" +
        '<p class="muted">' + t("mzPendingNote") + "</p></div>";
      return;
    }
    var count = lines.filter(function (l) { return done[l.n]; }).length;
    html += '<p class="muted">' + t("mzProgress", { d: count, n: lines.length }) + "</p>";
    html += '<div class="sactions" style="margin-bottom:10px"><button class="btn ghost" id="mzHide" type="button">' + t("mzHide") + "</button></div>";
    html += '<div id="mzList">' + lines.map(function (l) {
      return '<div class="mz-line" data-n="' + l.n + '"><div class="mz-n">' + num(l.n) + '</div><div class="mz-body">' +
        '<div class="mz-ar" lang="ar">' + esc(l.ar) + '</div><div class="mz-bn">' + esc(l.bn || "") + "</div></div>" +
        '<label class="mz-done"><input type="checkbox" data-done="' + l.n + '"' + (done[l.n] ? " checked" : "") + "> " + t("mzDone") + "</label></div>";
    }).join("") + "</div>";
    container.innerHTML = html;
    var hidden = false;
    document.getElementById("mzHide").addEventListener("click", function () {
      hidden = !hidden;
      document.querySelectorAll("#mzList .mz-ar").forEach(function (el) { el.classList.toggle("blur", hidden); });
      this.textContent = hidden ? t("mzReveal") : t("mzHide");
    });
    container.querySelectorAll("[data-done]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        done[cb.getAttribute("data-done")] = cb.checked;
        try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
        renderManzumah(container, ctx);
      });
    });
  }

  root.QNTajweedView = { render: render };
  root.QNManzumahView = { render: renderManzumah };
})(window);
