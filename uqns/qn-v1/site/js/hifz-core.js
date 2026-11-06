/* Hifz engine: pure logic (no DOM). Shared by the browser UI and the Node test suite.
   Progress is tracked in Mushaf pages (1–604). Dates are local calendar days "YYYY-MM-DD". */
(function (root) {
  "use strict";
  var TOTAL_PAGES = 604;
  var MAX_SABAQ_PAGES = 20;
  var REVIEW_INTERVALS = [1, 3, 7, 14, 30];   // days after the sabaq for each dohor
  var MISTAKE_RESET = 3;                       // this many mistakes in a dohor restarts its cycle
  var MANZIL_BLOCK = 20;                       // ~ one juz of Mushaf pages

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseDay(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function daysBetween(from, to) { return Math.round((parseDay(to) - parseDay(from)) / 86400000); }
  function isDayKey(k) { return typeof k === "string" && /^\d{4}-\d{2}-\d{2}$/.test(k) && !isNaN(parseDay(k)); }
  function isPage(p) { return Number.isInteger(p) && p >= 1 && p <= TOTAL_PAGES; }

  function emptyState() { return { v: 1, sabaqs: [], manzilLog: {} }; }

  /* Validate a proposed sabaq. Returns null if OK, otherwise an error key. */
  function validateSabaq(state, from, to) {
    if (!isPage(from) || !isPage(to)) return "errRange";
    if (from > to) return "errRange";
    if (to - from + 1 > MAX_SABAQ_PAGES) return "errTooLong";
    for (var i = 0; i < state.sabaqs.length; i++) {
      var s = state.sabaqs[i];
      if (from <= s.to && to >= s.from) return "errOverlap";
    }
    return null;
  }

  function addSabaq(state, from, to, date) {
    var err = validateSabaq(state, from, to);
    if (err) return { error: err, state: state };
    var next = clone(state);
    next.sabaqs.push({ id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: date, from: from, to: to, done: false, mistakes: 0, reviewed: 0 });
    next.sabaqs.sort(function (a, b) { return a.from - b.from; });
    return { error: null, state: next };
  }

  function updateSabaq(state, id, patch) {
    var next = clone(state);
    next.sabaqs = next.sabaqs.map(function (s) {
      if (s.id !== id) return s;
      var c = {}; for (var k in s) c[k] = s[k];
      for (var p in patch) c[p] = patch[p];
      return c;
    });
    return next;
  }
  function removeSabaq(state, id) {
    var next = clone(state);
    next.sabaqs = next.sabaqs.filter(function (s) { return s.id !== id; });
    return next;
  }

  /* Pages memorized = pages covered by sabaqs marked done. */
  function memorizedPages(state) {
    var set = {};
    state.sabaqs.forEach(function (s) {
      if (!s.done) return;
      for (var p = s.from; p <= s.to; p++) set[p] = true;
    });
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  }

  /* The next page to start a sabaq on: after the furthest page recorded so far. */
  function nextPage(state) {
    var max = 0;
    state.sabaqs.forEach(function (s) { if (s.to > max) max = s.to; });
    return max ? Math.min(max + 1, TOTAL_PAGES) : 1;
  }

  /* Dohor (spaced review) due today. A sabaq is due when its next interval has passed. */
  function dohorDue(state, today) {
    var due = [];
    state.sabaqs.forEach(function (s) {
      if (!s.done || s.reviewed >= REVIEW_INTERVALS.length) return;
      var age = daysBetween(s.date, today);
      if (age >= REVIEW_INTERVALS[s.reviewed]) {
        due.push({ id: s.id, from: s.from, to: s.to, date: s.date, dueInterval: REVIEW_INTERVALS[s.reviewed],
          age: age, mistakes: s.mistakes, reviewed: s.reviewed });
      }
    });
    // Oldest first, so the most at-risk material appears at the top.
    due.sort(function (a, b) { return b.age - a.age; });
    return due;
  }

  /* Record a completed dohor. Many mistakes restart the cycle; otherwise advance one interval. */
  function completeReview(state, id, mistakes) {
    var next = clone(state);
    next.sabaqs = next.sabaqs.map(function (s) {
      if (s.id !== id) return s;
      var c = {}; for (var k in s) c[k] = s[k];
      c.reviewed = mistakes >= MISTAKE_RESET ? 0 : Math.min(s.reviewed + 1, REVIEW_INTERVALS.length);
      c.mistakes = 0;
      return c;
    });
    return next;
  }

  /* Manzil (long revision): memorized pages split into blocks of about one juz.
     One block is assigned per day, cycling through all blocks. */
  function manzilPlan(state, today) {
    var pages = memorizedPages(state);
    if (!pages.length) return null;
    var blocks = Math.ceil(pages.length / MANZIL_BLOCK);
    var ordinal = Math.floor(parseDay(today).getTime() / 86400000);
    var index = ((ordinal % blocks) + blocks) % blocks;
    var slice = pages.slice(index * MANZIL_BLOCK, index * MANZIL_BLOCK + MANZIL_BLOCK);
    return { from: slice[0], to: slice[slice.length - 1], index: index, blocks: blocks,
      done: !!state.manzilLog[today] };
  }
  function markManzil(state, today) {
    var next = clone(state);
    next.manzilLog = clone(state.manzilLog);
    next.manzilLog[today] = true;
    return next;
  }

  /* Progress and pace. */
  function progress(state) {
    var n = memorizedPages(state).length;
    return { pages: n, total: TOTAL_PAGES, percent: Math.round((n / TOTAL_PAGES) * 1000) / 10,
      remaining: TOTAL_PAGES - n };
  }
  /* Days needed to finish the remaining pages at a given pace (pages per day). */
  function daysToFinish(remaining, pagesPerDay) {
    if (!(pagesPerDay > 0)) return null;
    return Math.ceil(remaining / pagesPerDay);
  }

  /* Backup format. */
  function exportJSON(state) {
    return JSON.stringify({ app: "quran-navigation-hifz", v: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
  }
  function importJSON(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { error: "errFile" }; }
    if (!obj || obj.app !== "quran-navigation-hifz" || !obj.data) return { error: "errFile" };
    var d = obj.data;
    if (!Array.isArray(d.sabaqs)) return { error: "errFile" };
    var ids = {};
    for (var i = 0; i < d.sabaqs.length; i++) {
      var s = d.sabaqs[i];
      if (!s || typeof s.id !== "string" || ids[s.id] || !isPage(s.from) || !isPage(s.to) || s.from > s.to ||
          !isDayKey(s.date) || typeof s.done !== "boolean" || !Number.isInteger(s.reviewed) ||
          s.reviewed < 0 || s.reviewed > REVIEW_INTERVALS.length || !Number.isInteger(s.mistakes) || s.mistakes < 0) {
        return { error: "errFile" };
      }
      ids[s.id] = true;
    }
    var state = emptyState();
    state.sabaqs = d.sabaqs.map(function (s) {
      return { id: s.id, date: s.date, from: s.from, to: s.to, done: s.done, mistakes: s.mistakes, reviewed: s.reviewed };
    });
    state.manzilLog = {};
    if (d.manzilLog && typeof d.manzilLog === "object") {
      Object.keys(d.manzilLog).forEach(function (k) { if (isDayKey(k)) state.manzilLog[k] = true; });
    }
    return { error: null, state: state };
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var API = {
    TOTAL_PAGES: TOTAL_PAGES, MAX_SABAQ_PAGES: MAX_SABAQ_PAGES, REVIEW_INTERVALS: REVIEW_INTERVALS,
    MISTAKE_RESET: MISTAKE_RESET, MANZIL_BLOCK: MANZIL_BLOCK,
    dayKey: dayKey, daysBetween: daysBetween, isDayKey: isDayKey, emptyState: emptyState,
    validateSabaq: validateSabaq, addSabaq: addSabaq, updateSabaq: updateSabaq, removeSabaq: removeSabaq,
    memorizedPages: memorizedPages, nextPage: nextPage, dohorDue: dohorDue, completeReview: completeReview,
    manzilPlan: manzilPlan, markManzil: markManzil, progress: progress, daysToFinish: daysToFinish,
    exportJSON: exportJSON, importJSON: importJSON
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  root.QNHifzCore = API;
})(typeof window !== "undefined" ? window : globalThis);
