/* UQNS reader — navigation by sura / juz / hizb / page, deep links via the URL hash,
   Uthmani or Simple text plus one translation or tafsir.

   Deep links:  reader.html#s2   sura 2        reader.html#j5   juz 5
                reader.html#h12  hizb 12       reader.html#p100 page 100
                reader.html#s2-255             sura 2, jumps to verse 255

   Large data files (text, translations) are added with <script> tags only when needed,
   so the page also works when opened straight from disk (file://). The Qur'anic text is
   never modified; it is only displayed. */
(function () {
  'use strict';

  var Q = window.QuranData;
  var I18N = window.UQNS_I18N;
  if (!Q || !I18N) return;

  var TOTAL = 6236;
  var SURA = Q.Sura, JUZ = Q.Juz, HQ = Q.HizbQaurter, PAGE = Q.Page, SAJDA = Q.Sajda;

  var MODES = {
    s: { max: 114, key: 'reader.mode.sura' },
    j: { max: 30,  key: 'reader.mode.juz' },
    h: { max: 60,  key: 'reader.mode.hizb' },
    p: { max: 604, key: 'reader.mode.page' }
  };
  var MODE_ORDER = ['s', 'j', 'h', 'p'];

  var SCRIPTS = {
    uthmani: { file: 'data/quran-text/uthmani.js' },
    simple:  { file: 'data/quran-text/simple.js' }
  };

  // Translation / tafsir catalogue. Labels are native-language names, so they are not translated.
  var TRANS = [
    { id: 'en.yusufali',  group: 'T', label: 'English · Yusuf Ali',          lang: 'en', dir: 'ltr', file: 'data/quran-translations/en.yusufali.js' },
    { id: 'bn.bengali',   group: 'T', label: 'বাংলা · মুহিউদ্দীন খান',        lang: 'bn', dir: 'ltr', file: 'data/quran-translations/bn.bengali.js' },
    { id: 'ar.muyassar',  group: 'F', label: 'العربية · تفسير الميسر',        lang: 'ar', dir: 'rtl', file: 'data/quran-translations/ar.muyassar.js' },
    { id: 'ar.jalalayn',  group: 'F', label: 'العربية · تفسير الجلالين',      lang: 'ar', dir: 'rtl', file: 'data/quran-translations/ar.jalalayn.js' }
  ];
  // Used until the reader picks one explicitly; follows the site language.
  var DEFAULT_TR = { en: 'en.yusufali', bn: 'bn.bengali', ar: 'ar.muyassar' };

  var KEY_SCRIPT = 'uqns.reader.script';
  var KEY_TR = 'uqns.reader.tr';
  var KEY_LAST = 'uqns.reader.last';

  /* ---------- helpers ---------- */
  function store(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  function lang() { return document.documentElement.lang || 'en'; }
  function t(key) {
    var d = I18N[lang()] || I18N.en;
    return d[key] !== undefined ? d[key] : (I18N.en[key] || '');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- verse indexing ---------- */
  // Global verse number g runs 1..6236. SURA[n][0] is the number of verses before sura n.
  var GS = new Array(TOTAL + 2), GA = new Array(TOTAL + 2);
  (function () {
    for (var s = 1; s <= 114; s++) {
      for (var a = 1; a <= SURA[s][1]; a++) { GS[SURA[s][0] + a] = s; GA[SURA[s][0] + a] = a; }
    }
  })();
  function gidx(ref) { return ref[0] > 114 ? TOTAL + 1 : SURA[ref[0]][0] + ref[1]; }
  function ref(g) { return GS[g] + ':' + GA[g]; }

  var SAJDA_SET = {};
  SAJDA.forEach(function (x) { if (x && x.length) SAJDA_SET[x[0] + ':' + x[1]] = true; });

  // Largest i in 1..max with gidx(arr[i]) <= g
  function findIdx(arr, g, max) {
    var lo = 1, hi = max;
    while (lo < hi) {
      var mid = (lo + hi + 1) >> 1;
      if (gidx(arr[mid]) <= g) lo = mid; else hi = mid - 1;
    }
    return lo;
  }
  function juzOf(g) { return findIdx(JUZ, g, 30); }
  function hizbOf(g) { return Math.ceil(findIdx(HQ, g, 240) / 4); }
  function pageOf(g) { return findIdx(PAGE, g, 604); }

  function range(mode, n) {
    var a, b, q;
    if (mode === 's') { a = SURA[n][0] + 1; b = SURA[n][0] + SURA[n][1]; }
    else if (mode === 'j') { a = gidx(JUZ[n]); b = gidx(JUZ[n + 1]) - 1; }
    else if (mode === 'h') { q = (n - 1) * 4 + 1; a = gidx(HQ[q]); b = gidx(HQ[q + 4]) - 1; }
    else { a = gidx(PAGE[n]); b = gidx(PAGE[n + 1]) - 1; }
    return [a, b];
  }
  function unitFor(mode, g) {
    if (mode === 's') return GS[g];
    if (mode === 'j') return juzOf(g);
    if (mode === 'h') return hizbOf(g);
    return pageOf(g);
  }

  function suraName(s) { return lang() === 'ar' ? SURA[s][4] : SURA[s][5]; }
  function unitLabel(mode, n) {
    if (mode === 's') return n + '. ' + suraName(n);
    return t(MODES[mode].key) + ' ' + n + ' · ' + ref(range(mode, n)[0]);
  }
  // "3 verses": Arabic uses the plural form for 3-10 (آيات) and the singular after that (آية)
  function versesWord(n) { return t(n >= 3 && n <= 10 ? 'reader.verses.few' : 'reader.verses'); }
  function span(label, x, y) { return label + ' ' + (x === y ? x : x + '–' + y); }

  /* ---------- URL hash <-> state ---------- */
  function parse(str, allowVerse) {
    var m = /^#?([sjhp])(\d{1,3})(?:-(\d{1,3}))?$/.exec(str || '');
    if (!m) return null;
    var mode = m[1], n = +m[2];
    if (n < 1 || n > MODES[mode].max) return null;
    var v = null;
    if (allowVerse && mode === 's' && m[3]) {
      var vv = +m[3];
      if (vv >= 1 && vv <= SURA[n][1]) v = vv;
    }
    return { mode: mode, n: n, verse: v };
  }
  function current() {
    return parse(location.hash, true) || parse(store(KEY_LAST), false) || { mode: 's', n: 1, verse: null };
  }
  function hashFor(mode, n, verse) { return '#' + mode + n + (verse ? '-' + verse : ''); }
  function go(mode, n, verse) {
    var h = hashFor(mode, n, verse);
    if (location.hash === h) render(); else location.hash = h;
  }

  /* ---------- settings ---------- */
  var script = store(KEY_SCRIPT);
  if (!SCRIPTS[script]) script = 'uthmani';
  function trById(id) { for (var i = 0; i < TRANS.length; i++) if (TRANS[i].id === id) return TRANS[i]; return null; }
  var storedTr = store(KEY_TR);
  var explicitTr = storedTr === 'none' || !!trById(storedTr);
  function trChoice() {
    if (explicitTr) return storedTr;
    return DEFAULT_TR[lang()] || 'none';
  }

  /* ---------- on-demand data loading (script tags; no fetch, so file:// works) ---------- */
  var loading = {};
  function loadScript(src, check) {
    if (check()) return Promise.resolve();
    if (loading[src]) return loading[src];
    loading[src] = new Promise(function (resolve, reject) {
      var el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = function () { check() ? resolve() : fail(); };
      el.onerror = fail;
      function fail() {
        delete loading[src];
        if (el.parentNode) el.parentNode.removeChild(el);
        reject(new Error('Failed to load ' + src));
      }
      document.head.appendChild(el);
    });
    return loading[src];
  }
  function loadData(scriptId, trId) {
    var jobs = [loadScript(SCRIPTS[scriptId].file, function () {
      return window.QuranText && window.QuranText[scriptId];
    })];
    var tr = trById(trId);
    if (tr) {
      jobs.push(loadScript(tr.file, function () {
        return window.QuranTranslations && window.QuranTranslations[tr.id];
      }));
    }
    return Promise.all(jobs);
  }

  /* ---------- controls ---------- */
  var elBody = $('readerBody');
  var elUnit = $('unitSelect');
  var elScript = $('scriptSelect');
  var elTr = $('trSelect');
  var elInfo = $('readerInfo');
  var elCredit = $('readerCredit');
  var tabs = document.querySelectorAll('#modeTabs button');
  var steps = document.querySelectorAll('.js-step');

  var unitKey = '';
  function fillUnitSelect(mode) {
    var key = mode + '|' + lang();
    if (key === unitKey) return;
    unitKey = key;
    var html = '';
    for (var n = 1; n <= MODES[mode].max; n++) {
      html += '<option value="' + n + '">' + esc(unitLabel(mode, n)) + '</option>';
    }
    elUnit.innerHTML = html;
  }

  var optKey = '';
  function fillOptions() {
    var key = lang();
    if (key === optKey) return;
    optKey = key;
    elScript.innerHTML = Object.keys(SCRIPTS).map(function (id) {
      return '<option value="' + id + '">' + esc(t('reader.script.' + id)) + '</option>';
    }).join('');
    function group(g, title) {
      return '<optgroup label="' + esc(title) + '">' + TRANS.filter(function (x) { return x.group === g; }).map(function (x) {
        return '<option value="' + x.id + '">' + esc(x.label) + '</option>';
      }).join('') + '</optgroup>';
    }
    elTr.innerHTML = '<option value="none">' + esc(t('reader.tr.none')) + '</option>' +
      group('T', t('reader.tr.groupT')) + group('F', t('reader.tr.groupF'));
  }

  function infoText(mode, n) {
    var r = range(mode, n), a = r[0], b = r[1], parts = [];
    if (mode === 's') {
      parts.push(t(SURA[n][7] === 'Meccan' ? 'reader.meccan' : 'reader.medinan'));
      parts.push(SURA[n][1] + ' ' + versesWord(SURA[n][1]));
    } else {
      parts.push('\u200E' + ref(a) + ' – ' + ref(b));
    }
    if (mode !== 'j') parts.push(span(t('reader.mode.juz'), juzOf(a), juzOf(b)));
    if (mode !== 'h') parts.push(span(t('reader.mode.hizb'), hizbOf(a), hizbOf(b)));
    if (mode !== 'p') parts.push(span(t('reader.mode.page'), pageOf(a), pageOf(b)));
    return parts.join(' · ');
  }

  function syncControls(cur) {
    fillUnitSelect(cur.mode);
    fillOptions();
    elUnit.value = String(cur.n);
    elScript.value = script;
    elTr.value = trChoice();
    Array.prototype.forEach.call(tabs, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mode') === cur.mode ? 'true' : 'false');
    });
    Array.prototype.forEach.call(steps, function (b) {
      var next = cur.n + (+b.getAttribute('data-step'));
      b.disabled = next < 1 || next > MODES[cur.mode].max;
    });
    elInfo.textContent = infoText(cur.mode, cur.n);
    var label = cur.mode === 's' ? suraName(cur.n) : t(MODES[cur.mode].key) + ' ' + cur.n;
    document.title = label + ' · ' + t('reader.title');
  }

  /* ---------- scrolling ---------- */
  function jump(el) {
    var root = document.documentElement, prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    if (el) el.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }
  function firstVisibleKey() {
    var list = elBody.querySelectorAll('.ayah'), limit = 150;
    for (var i = 0; i < list.length; i++) {
      if (list[i].getBoundingClientRect().bottom > limit) return list[i].getAttribute('data-key');
    }
    return null;
  }
  function verseEl(key) { return key ? $('v' + key.replace(':', '-')) : null; }

  /* ---------- rendering ---------- */
  var token = 0, builtKey = null;

  // Split the basmala from verse 1 of a sura for display only. The text itself is untouched:
  // the first four words are compared without diacritics (a few verses differ in marks).
  function skeleton(s) { return s.replace(/[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g, ''); }
  function splitBasmala(text, basmala) {
    var words = text.split(' ');
    if (words.length <= 4) return null;
    var head = words.slice(0, 4).join(' ');
    if (skeleton(head) !== skeleton(basmala)) return null;
    return { basmala: head, rest: words.slice(4).join(' ') };
  }

  function suraHead(s, basmala) {
    var sub = '';
    if (lang() === 'en') sub = SURA[s][5] + ' · ' + SURA[s][6];
    else if (lang() === 'bn') sub = SURA[s][5];
    var html = '<header class="sura-head" id="sura-' + s + '">' +
      '<p class="sura-no">' + esc(t('reader.mode.sura')) + ' ' + s + '</p>' +
      '<h2 class="sura-ar" lang="ar" dir="rtl">' + esc(SURA[s][4]) + '</h2>' +
      (sub ? '<p class="sura-sub">' + esc(sub) + '</p>' : '') +
      '<p class="sura-meta">' + esc(t(SURA[s][7] === 'Meccan' ? 'reader.meccan' : 'reader.medinan')) +
      ' · ' + SURA[s][1] + ' ' + esc(versesWord(SURA[s][1])) + '</p></header>';
    if (basmala) {
      html += '<p class="basmala' + (script === 'simple' ? ' is-simple' : '') + '" lang="ar" dir="rtl">' + esc(basmala) + '</p>';
    }
    return html;
  }

  function build(cur) {
    var r = range(cur.mode, cur.n);
    var text = window.QuranText[script];
    var trId = trChoice();
    var tr = trById(trId);
    var trData = tr ? window.QuranTranslations[tr.id] : null;
    var basmalaRef = text['1:1'];
    var cls = script === 'simple' ? ' is-simple' : '';
    var out = [];

    for (var g = r[0]; g <= r[1]; g++) {
      var s = GS[g], a = GA[g], key = s + ':' + a, verse = text[key];
      if (a === 1) {
        var head = null;
        if (s !== 1 && s !== 9) {
          var sp = splitBasmala(verse, basmalaRef);
          if (sp) { head = sp.basmala; verse = sp.rest; }
        }
        out.push(suraHead(s, head));
      }
      var label = cur.mode === 's' ? String(a) : key;
      out.push('<article class="ayah" id="v' + s + '-' + a + '" data-key="' + key + '">' +
        '<div class="ayah-meta"><a class="ayah-no" href="#s' + s + '-' + a + '">' + label + '</a>' +
        (SAJDA_SET[key] ? '<span class="ayah-tag">۩ ' + esc(t('reader.sajda')) + '</span>' : '') + '</div>' +
        '<p class="ayah-ar' + cls + '" lang="ar" dir="rtl">' + esc(verse) + '</p>' +
        (trData && trData[key] ? '<p class="ayah-tr" lang="' + tr.lang + '" dir="' + tr.dir + '">' + esc(trData[key]) + '</p>' : '') +
        '</article>');
    }
    elBody.innerHTML = out.join('');

    var credit = esc(t('reader.text')) + ': ' + esc(t('reader.script.' + script)) +
      (tr ? ' · ' + esc(t('reader.tr.label')) + ': ' + esc(tr.label) : '') +
      ' · ' + esc(t('reader.source')) + ': <a href="https://mj-ahmad.github.io/qn" target="_blank" rel="noopener">mj-ahmad.github.io/qn</a>';
    elCredit.innerHTML = credit;
  }

  function showStatus(html) { elBody.innerHTML = '<div class="reader-status">' + html + '</div>'; }

  function render(opts) {
    opts = opts || {};
    var cur = current();
    var my = ++token;
    save(KEY_LAST, cur.mode + cur.n);
    syncControls(cur);

    var bkey = [cur.mode, cur.n, script, trChoice(), lang()].join('|');
    if (builtKey === bkey && !opts.force) {
      // Same content already on screen (e.g. only the verse in the hash changed)
      var same = verseEl(cur.verse ? cur.n + ':' + cur.verse : null);
      markTarget(same);
      jump(same);
      return;
    }

    var anchor = opts.keepScroll ? firstVisibleKey() : null;
    if (!opts.keepScroll) showStatus(esc(t('reader.loading')));
    elBody.setAttribute('aria-busy', 'true');

    loadData(script, trChoice()).then(function () {
      if (my !== token) return; // a newer navigation took over
      build(cur);
      builtKey = bkey;
      elBody.removeAttribute('aria-busy');
      var target = cur.verse ? verseEl(cur.n + ':' + cur.verse) : verseEl(anchor);
      markTarget(cur.verse ? target : null);
      jump(target);
    }).catch(function () {
      if (my !== token) return;
      builtKey = null;
      elBody.removeAttribute('aria-busy');
      showStatus('<p>' + esc(t('reader.error')) + '</p><button type="button" class="btn" id="retryBtn">' + esc(t('reader.retry')) + '</button>');
      var btn = $('retryBtn');
      if (btn) btn.addEventListener('click', function () { render({ force: true }); });
    });
  }

  function markTarget(el) {
    var old = elBody.querySelector('.is-target');
    if (old) old.classList.remove('is-target');
    if (el) el.classList.add('is-target');
  }

  /* ---------- events ---------- */
  Array.prototype.forEach.call(tabs, function (b) {
    b.addEventListener('click', function () {
      var cur = current(), mode = b.getAttribute('data-mode');
      if (mode === cur.mode) return;
      // Keep the reading position: translate the current first verse into the other unit type
      var g = cur.verse ? SURA[cur.n][0] + cur.verse : range(cur.mode, cur.n)[0];
      var n = unitFor(mode, g);
      go(mode, n, mode === 's' && GA[g] > 1 ? GA[g] : null);
    });
  });

  elUnit.addEventListener('change', function () { go(current().mode, +elUnit.value, null); });

  Array.prototype.forEach.call(steps, function (b) {
    b.addEventListener('click', function () {
      var cur = current(), n = cur.n + (+b.getAttribute('data-step'));
      if (n >= 1 && n <= MODES[cur.mode].max) go(cur.mode, n, null);
    });
  });

  elScript.addEventListener('change', function () {
    script = SCRIPTS[elScript.value] ? elScript.value : 'uthmani';
    save(KEY_SCRIPT, script);
    render({ keepScroll: true });
  });

  elTr.addEventListener('change', function () {
    storedTr = elTr.value;
    explicitTr = true;
    save(KEY_TR, storedTr);
    render({ keepScroll: true });
  });

  window.addEventListener('hashchange', function () { render(); });

  // The site's language toggle (app.js) fires this after it re-labels the page
  document.addEventListener('uqns:lang', function () { render({ keepScroll: true }); });

  /* ---------- start ---------- */
  if (!parse(location.hash, true)) {
    var c = current();
    try { history.replaceState(null, '', hashFor(c.mode, c.n, null)); } catch (e) { /* some file:// contexts block this */ }
  }
  render();
})();
