/* Hifz tracker screen. Uses QNHifzCore for all logic; this file only renders and stores. */
(function (root) {
  "use strict";
  var C = root.QNHifzCore;
  var KEY = "qn_hifz";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { state: C.emptyState(), warn: false };
      var parsed = C.importJSON(raw);   // same validation as backup import
      if (parsed.error) return { state: C.emptyState(), warn: true };
      return { state: parsed.state, warn: false };
    } catch (e) { return { state: C.emptyState(), warn: true }; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, C.exportJSON(state)); return true; }
    catch (e) { return false; }   // storage full or blocked
  }

  function render(container, ctx) {
    var t = ctx.t, num = ctx.localNum, esc = ctx.esc;
    var loaded = load();
    var state = loaded.state;
    var today = C.dayKey(new Date());
    var flash = "";

    function commit(next) {
      state = next;
      if (!save(state)) flash = '<p class="warn" role="alert">' + t("hifzSaveErr") + "</p>";
      draw();
    }
    function msg(key) { flash = '<p class="warn" role="alert">' + t(key) + "</p>"; }

    function draw() {
      var prog = C.progress(state);
      var due = C.dohorDue(state, today);
      var manzil = C.manzilPlan(state, today);
      var nxt = C.nextPage(state);
      var h = '<section class="hifz"><h2>' + t("hifzTitle") + "</h2>";
      if (loaded.warn) h += '<p class="warn" role="alert">' + t("hifzLoadWarn") + "</p>";
      h += flash; flash = "";

      // Progress
      h += '<div class="card"><div class="hifz-stat"><strong>' + t("hifzProgress", { n: prog.pages, t: prog.total }) +
        "</strong><span>" + num(prog.percent) + "%</span></div>" +
        '<div class="bar-track" role="progressbar" aria-valuemin="0" aria-valuemax="604" aria-valuenow="' + prog.pages + '">' +
        '<div class="bar-fill" style="width:' + prog.percent + '%"></div></div>' +
        '<p class="muted">' + t("hifzRemaining", { n: prog.remaining }) + "</p></div>";

      // Today's sabaq
      h += '<div class="card"><h3>' + t("hifzAddSabaq") + "</h3>" +
        '<form id="sabaqForm" class="row-form">' +
        '<label>' + t("hifzFrom") + '<input id="sFrom" class="field" type="number" inputmode="numeric" min="1" max="604" value="' + nxt + '"></label>' +
        '<label>' + t("hifzTo") + '<input id="sTo" class="field" type="number" inputmode="numeric" min="1" max="604" value="' + nxt + '"></label>' +
        '<button class="btn" type="submit">' + t("hifzSave") + "</button></form>" +
        '<p class="muted">' + t("hifzSabaqHint") + "</p></div>";

      // Sabaq list
      var recent = state.sabaqs.slice().sort(function (a, b) { return b.from - a.from; });
      h += '<div class="card"><h3>' + t("hifzSabaqList") + "</h3>";
      if (!recent.length) h += '<p class="muted">' + t("hifzNoSabaq") + "</p>";
      recent.forEach(function (s) {
        h += '<div class="srow"><div class="sinfo"><strong>' + t("hifzPages", { a: s.from, b: s.to }) + "</strong>" +
          '<span class="muted">' + esc(s.date) + " · " + (s.done ? t("hifzStatusDone") : t("hifzStatusPlanned")) +
          " · " + t("hifzMistakes") + ": " + num(s.mistakes) + "</span></div>" +
          '<div class="sactions">' +
          '<button class="btn ghost" data-act="toggle" data-id="' + s.id + '">' + (s.done ? t("hifzUndo") : t("hifzDone")) + "</button>" +
          '<button class="btn ghost" data-act="del" data-id="' + s.id + '" aria-label="' + t("hifzDelete") + '">✕</button>' +
          "</div></div>";
      });
      h += "</div>";

      // Dohor due
      h += '<div class="card"><h3>' + t("hifzDueReviews") + "</h3>";
      if (!due.length) h += '<p class="muted">' + t("hifzNoDue") + "</p>";
      due.forEach(function (d) {
        h += '<div class="srow"><div class="sinfo"><strong>' + t("hifzPages", { a: d.from, b: d.to }) + "</strong>" +
          '<span class="muted">' + t("hifzAfterDays", { n: d.dueInterval }) + "</span></div>" +
          '<div class="sactions"><label class="mistake-step">' + t("hifzMistakes") +
          '<input class="field small" type="number" min="0" max="50" value="0" data-mistakes="' + d.id + '" aria-label="' + t("hifzMistakes") + '"></label>' +
          '<button class="btn" data-act="review" data-id="' + d.id + '">' + t("hifzReviewed") + "</button></div></div>";
      });
      h += "</div>";

      // Manzil
      h += '<div class="card"><h3>' + t("hifzManzil") + "</h3>";
      if (!manzil) h += '<p class="muted">' + t("hifzManzilEmpty") + "</p>";
      else {
        h += '<p><strong>' + t("hifzPages", { a: manzil.from, b: manzil.to }) + "</strong></p>";
        h += manzil.done
          ? '<p class="ok">' + t("hifzManzilDone") + "</p>"
          : '<button class="btn" data-act="manzil">' + t("hifzMarkManzil") + "</button>";
      }
      h += "</div>";

      // Pace
      h += '<div class="card"><h3>' + t("hifzPace") + "</h3>" +
        '<label>' + t("hifzPagesPerDay") + '<input id="pace" class="field small" type="number" min="0.5" step="0.5" value="1"></label>' +
        '<p id="paceOut" class="muted"></p></div>';

      // Backup
      h += '<div class="card"><h3>' + t("hifzBackup") + "</h3>" +
        '<div class="sactions wrap"><button class="btn ghost" data-act="export">' + t("hifzExport") + "</button>" +
        '<label class="btn ghost file-label">' + t("hifzImport") + '<input id="importFile" type="file" accept="application/json" hidden></label>' +
        '<button class="btn ghost danger" data-act="clear">' + t("hifzClear") + "</button></div>" +
        '<p class="muted">' + t("hifzBackupNote") + "</p></div>";

      h += '<p class="note">' + t("hifzDisclaimer") + "</p></section>";
      container.innerHTML = h;
      wire();
      updatePace();
    }

    function updatePace() {
      var el = document.getElementById("pace"), out = document.getElementById("paceOut");
      if (!el || !out) return;
      var perDay = parseFloat(el.value);
      var days = C.daysToFinish(C.progress(state).remaining, perDay);
      out.textContent = days === null ? t("hifzPaceInvalid") : t("hifzPaceResult", { n: days });
    }

    function wire() {
      var form = document.getElementById("sabaqForm");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var from = parseInt(document.getElementById("sFrom").value, 10);
        var to = parseInt(document.getElementById("sTo").value, 10);
        var res = C.addSabaq(state, from, to, today);
        if (res.error) { msg(res.error === "errOverlap" ? "hifzErrOverlap" : res.error === "errTooLong" ? "hifzErrTooLong" : "hifzErrRange"); return draw(); }
        commit(res.state);
      });
      document.getElementById("pace").addEventListener("input", updatePace);
      container.querySelectorAll("[data-act]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var act = btn.getAttribute("data-act"), id = btn.getAttribute("data-id");
          if (act === "toggle") {
            var s = state.sabaqs.filter(function (x) { return x.id === id; })[0];
            commit(C.updateSabaq(state, id, { done: !s.done }));
          } else if (act === "del") {
            if (root.confirm(t("hifzDeleteConfirm"))) commit(C.removeSabaq(state, id));
          } else if (act === "review") {
            var input = container.querySelector('[data-mistakes="' + id + '"]');
            var m = Math.max(0, parseInt(input.value, 10) || 0);
            commit(C.completeReview(state, id, m));
          } else if (act === "manzil") {
            commit(C.markManzil(state, today));
          } else if (act === "export") {
            exportFile();
          } else if (act === "clear") {
            if (root.confirm(t("hifzClearConfirm"))) commit(C.emptyState());
          }
        });
      });
      document.getElementById("importFile").addEventListener("change", function (e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        if (f.size > 2 * 1024 * 1024) { msg("hifzImportErr"); return draw(); }
        var reader = new FileReader();
        reader.onload = function () {
          var res = C.importJSON(String(reader.result));
          if (res.error) { msg("hifzImportErr"); return draw(); }
          flash = '<p class="ok" role="status">' + t("hifzImportOk") + "</p>";
          commit(res.state);
        };
        reader.readAsText(f);
      });
    }

    function exportFile() {
      var blob = new Blob([C.exportJSON(state)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "quran-navigation-hifz-" + today + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    draw();
  }

  root.QNHifzView = { render: render };
})(window);
