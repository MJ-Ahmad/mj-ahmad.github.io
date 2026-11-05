/* Tajweed rule detection (pure logic, no DOM). Works on the Uthmani text in data/quran.js.
   Detects: noon sakinah / tanween (izhar, idgham, iqlab, ikhfa), mim sakinah (idgham, ikhfa, izhar), qalqalah. */
(function (root) {
  "use strict";
  var SUKUN = "\u0652", SHADDA = "\u0651", FATHATAN = "\u064B";
  var TANWEEN = ["\u064B", "\u064C", "\u064D"];
  var WASL_ALIF = "\u0671", ALIF = "\u0627";

  function isMark(ch) {
    var c = ch.charCodeAt(0);
    return (c >= 0x064B && c <= 0x065F) || c === 0x0670 || (c >= 0x06D6 && c <= 0x06ED) || c === 0x0640;
  }
  function isLetter(ch) {
    var c = ch.charCodeAt(0);
    return (c >= 0x0621 && c <= 0x064A) || c === 0x0671;
  }

  // Letter groups (standard tajweed classification)
  var IZHAR = { "ء": 1, "أ": 1, "إ": 1, "آ": 1, "ؤ": 1, "ئ": 1, "ه": 1, "ع": 1, "ح": 1, "غ": 1, "خ": 1 };
  var IDGHAM_GHUNNA = { "ي": 1, "و": 1, "م": 1, "ن": 1 };   // يومن
  var IDGHAM_NO_GHUNNA = { "ل": 1, "ر": 1 };
  var IKHFA = { "ت": 1, "ث": 1, "ج": 1, "د": 1, "ذ": 1, "ز": 1, "س": 1, "ش": 1, "ص": 1, "ض": 1, "ط": 1, "ظ": 1, "ف": 1, "ق": 1, "ك": 1 };
  var QALQALAH = { "ق": 1, "ط": 1, "ب": 1, "ج": 1, "د": 1 };

  var RULE_NAMES = { izhar: "izhar", idgham_ghunna: "idgham_ghunna", idgham_bila: "idgham_bila",
    iqlab: "iqlab", ikhfa: "ikhfa", mim_idgham: "mim_idgham", mim_ikhfa: "mim_ikhfa",
    mim_izhar: "mim_izhar", qalqalah: "qalqalah" };

  function classifyNoon(next) {
    if (next === "ب") return "iqlab";
    if (IZHAR[next]) return "izhar";
    if (IDGHAM_GHUNNA[next]) return "idgham_ghunna";
    if (IDGHAM_NO_GHUNNA[next]) return "idgham_bila";
    if (IKHFA[next]) return "ikhfa";
    return null;   // e.g. a letter outside the lists: no rule claimed
  }
  function classifyMim(next) {
    if (next === "م") return "mim_idgham";
    if (next === "ب") return "mim_ikhfa";
    return "mim_izhar";
  }

  // Index of the next pronounced base letter after position i (skipping marks, spaces,
  // the hamzat-wasl alif, and the silent alif written after fathatan on tanween).
  function nextLetter(text, i, afterTanween) {
    for (var j = i + 1; j < text.length; j++) {
      var ch = text.charAt(j);
      if (isMark(ch) || !isLetter(ch)) continue;
      if (ch === WASL_ALIF) continue;                       // hamzat wasl is not pronounced mid-recitation
      // The alif (or alif maqsura) written after fathatan on tanween is silent: skip it.
      if (afterTanween && (ch === ALIF || ch === "\u0649") && j === i + 1 + skipMarks(text, i)) continue;
      return { ch: ch, index: j };
    }
    return null;
  }
  function skipMarks(text, i) {   // count marks directly after the letter at i
    var n = 0;
    for (var j = i + 1; j < text.length && isMark(text.charAt(j)); j++) n++;
    return n;
  }
  function marksOf(text, i) {     // all combining marks directly after letter at i
    var out = "";
    for (var j = i + 1; j < text.length && isMark(text.charAt(j)); j++) out += text.charAt(j);
    return out;
  }

  /* Scan one ayah. Returns [{rule, start, end, letter, next}] where start/end index the
     noon/tanween/mim/qalqalah letter in the ayah text. */
  function scanAyah(text) {
    var found = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (!isLetter(ch)) continue;
      var marks = marksOf(text, i);
      if (ch === "ن" && marks.indexOf(SUKUN) > -1 && marks.indexOf(SHADDA) === -1) {
        var n1 = nextLetter(text, i, false);
        if (n1) {
          var r1 = classifyNoon(n1.ch);
          if (r1) found.push({ rule: r1, start: i, end: i + 1, letter: ch, next: n1.ch });
        }
      } else if (TANWEEN.some(function (m) { return marks.indexOf(m) > -1; })) {
        var n2 = nextLetter(text, i, marks.indexOf(FATHATAN) > -1);
        if (n2) {
          var r2 = classifyNoon(n2.ch);
          if (r2) found.push({ rule: r2, start: i, end: i + 1, letter: ch, next: n2.ch, tanween: true });
        }
      } else if (ch === "م" && marks.indexOf(SUKUN) > -1 && marks.indexOf(SHADDA) === -1) {
        var n3 = nextLetter(text, i, false);
        if (n3) found.push({ rule: classifyMim(n3.ch), start: i, end: i + 1, letter: ch, next: n3.ch });
      }
      if (QALQALAH[ch] && marks.indexOf(SUKUN) > -1) {
        found.push({ rule: "qalqalah", start: i, end: i + 1, letter: ch, next: null });
      }
    }
    return found;
  }

  /* Quiz: pick a random noon/tanween case and four answer groups.
     data = [{n, ayahs}], rng returns a float in [0,1). */
  var GROUP = { izhar: "izhar", idgham_ghunna: "idgham", idgham_bila: "idgham", iqlab: "iqlab", ikhfa: "ikhfa" };
  var GROUPS = ["izhar", "idgham", "iqlab", "ikhfa"];
  function quizQuestion(data, rng) {
    for (var tries = 0; tries < 5000; tries++) {
      var s = data[Math.floor(rng() * data.length)];
      var ai = Math.floor(rng() * s.ayahs.length);
      var hits = scanAyah(s.ayahs[ai]).filter(function (x) { return GROUP[x.rule]; });
      if (!hits.length) continue;
      var pick = hits[Math.floor(rng() * hits.length)];
      var options = GROUPS.slice();
      for (var k = options.length - 1; k > 0; k--) {       // shuffle
        var j = Math.floor(rng() * (k + 1)); var tmp = options[k]; options[k] = options[j]; options[j] = tmp;
      }
      return { surah: s.n, ayah: ai + 1, text: s.ayahs[ai], start: pick.start, end: pick.end,
        answer: GROUP[pick.rule], options: options };
    }
    return null;
  }

  /* Expose the pure helpers for tests and the UI. */
  var API = { scanAyah: scanAyah, classifyNoon: classifyNoon, classifyMim: classifyMim, RULES: RULE_NAMES,
    isLetter: isLetter, isMark: isMark, quizQuestion: quizQuestion, GROUP: GROUP };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  root.QNTajweedCore = API;
})(typeof window !== "undefined" ? window : globalThis);
