/* UQNS — Madinah Mushaf viewer: page by page (604 pages) and juz by juz, with
   swipe / keyboard / buttons, deep links, and per-ayah audio for memorisation.
   Page images: assets/mushaf/pages/NNN.webp. Metadata: data/quran-data.js (QuranData).
   Ayah text for the audio panel is loaded on demand from data/quran-text/uthmani.js. */
(function () {
  var Q = window.QuranData;
  var L = window.UQNS_DATA_LOADER;
  if (!Q || !L) return;

  var SURA = Q.Sura, PAGE = Q.Page, JUZ = Q.Juz;
  var PAGES = 604, TOTAL = 6236;
  var RECITERS = window.UQNS_RECITERS || [];
  var BASE = window.UQNS_AUDIO_BASE || 'https://everyayah.com/data/';

  // ---- ayah <-> global index ------------------------------------------------------
  var GS = [], GA = [];
  for (var s = 1; s <= 114; s++) {
    for (var a = 1; a <= SURA[s][1]; a++) { var gg = SURA[s][0] + a; GS[gg] = s; GA[gg] = a; }
  }
  function g(s, a) { return SURA[s][0] + a; }
  function pageOfRef(s, a) {
    var x = g(s, a), lo = 1, hi = PAGES;
    while (lo < hi) {
      var mid = (lo + hi + 1) >> 1;
      if (g(PAGE[mid][0], PAGE[mid][1]) <= x) lo = mid; else hi = mid - 1;
    }
    return lo;
  }
  function pageRange(p) {
    var st = g(PAGE[p][0], PAGE[p][1]);
    var en = p < PAGES ? g(PAGE[p + 1][0], PAGE[p + 1][1]) - 1 : TOTAL;
    return [st, en];
  }
  function pageAyahs(p) {
    var r = pageRange(p), out = [];
    for (var x = r[0]; x <= r[1]; x++) out.push({ s: GS[x], a: GA[x] });
    return out;
  }
  function juzOfRef(s, a) {
    var x = g(s, a), j = 1;
    for (var i = 1; i <= 30; i++) if (g(JUZ[i][0], JUZ[i][1]) <= x) j = i;
    return j;
  }
  function surahsStartingOn(p) {
    var r = pageRange(p), out = [];
    for (var n = 1; n <= 114; n++) {
      var first = SURA[n][0] + 1;
      if (first >= r[0] && first <= r[1]) out.push(n);
    }
    return out;
  }

  // ---- i18n helpers --------------------------------------------------------------
  function lang() { return document.documentElement.lang || 'en'; }
  function msg(key, p) {
    var d = (window.UQNS_I18N && window.UQNS_I18N[lang()]) || {};
    var s2 = d[key] || (window.UQNS_I18N.en || {})[key] || key;
    if (p) Object.keys(p).forEach(function (k) { s2 = s2.split('{' + k + '}').join(String(p[k])); });
    return s2;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n, w) { var t = String(n); while (t.length < (w || 3)) t = '0' + t; return t; }
  function surahName(n) {
    return lang() === 'ar' ? SURA[n][4] : SURA[n][5];
  }
  function reciterName(r) { return r.name[lang()] || r.name.en; }

  // ---- DOM ------------------------------------------------------------------------
  var $ = function (id) { return document.getElementById(id); };
  var img = $('pageImg'), missing = $('pageMissing'), stage = $('stage');
  var slider = $('pageSlider'), jump = $('pageJump'), counter = $('pageCounter');
  var info = $('pageInfo'), pdfBtn = $('pdfLink');
  var juzList = $('juzList'), juzPanel = $('juzPanel');
  var audioPanel = $('audioPanel'), qariSel = $('qariSel'), styleSel = $('styleSel');
  var playBtn = $('playBtn'), prevAyahBtn = $('prevAyahBtn'), nextAyahBtn = $('nextAyahBtn');
  var speedSel = $('speedSel'), repAyahSel = $('repAyahSel'), repPageSel = $('repPageSel');
  var audioLabel = $('audioLabel'), audioText = $('audioText'), audioStatus = $('audioStatus');
  var bars = document.querySelectorAll('[data-chrome]');

  var current = 1;

  // ---- page rendering -----------------------------------------------------------
  function src(p) { return 'assets/mushaf/pages/' + pad(p) + '.webp'; }

  function preload(p) {
    if (p < 1 || p > PAGES) return;
    var i = new Image(); i.src = src(p);
  }

  function renderInfo(p) {
    var ay = pageAyahs(p)[0];
    var juz = juzOfRef(ay.s, ay.a);
    var starts = surahsStartingOn(p).map(function (n) {
      return msg('mushaf.surahStarts', { name: surahName(n) });
    });
    info.innerHTML = '<span class="m-juz">' + esc(msg('mushaf.juz', { n: juz })) + '</span>' +
      '<span class="m-surah">' + esc(surahName(ay.s)) + '</span>' +
      (starts.length ? '<span class="m-starts">' + esc(starts.join(' · ')) + '</span>' : '');
  }

  function show(p, opts) {
    if (!(p >= 1 && p <= PAGES)) p = 1;
    current = p;
    missing.hidden = true;
    img.hidden = false;
    img.alt = msg('mushaf.pageAlt', { n: p });
    img.src = src(p);
    img.onerror = function () { img.hidden = true; missing.hidden = false; };
    slider.value = p;
    jump.value = p;
    counter.textContent = msg('mushaf.pageOf', { n: p, total: PAGES });
    pdfBtn.href = 'assets/mushaf/pdf/' + pad(p) + '.pdf';
    renderInfo(p);
    preload(p + 1); preload(p - 1);
    if (!(opts && opts.keepHash)) {
      var h = '#p' + p;
      if (location.hash !== h) history.replaceState(null, '', h);
    }
    try { localStorage.setItem('uqns.mushaf.page', String(p)); } catch (e) { /* storage blocked */ }
    if (audioPanel && !audioPanel.hidden) stopAudio(true);
    updateAudioLabel();
  }

  function go(p) { show(p); }
  function next() { if (current < PAGES) go(current + 1); }
  function prev() { if (current > 1) go(current - 1); }

  // ---- deep links: #p100, #j5, #s2, #s2-255 ----------------------------------------
  function fromHash() {
    var h = location.hash.replace(/^#/, '');
    var m;
    if ((m = h.match(/^p(\d{1,3})$/))) return +m[1];
    if ((m = h.match(/^j(\d{1,2})$/)) && +m[1] >= 1 && +m[1] <= 30) return pageOfRef(JUZ[+m[1]][0], JUZ[+m[1]][1]);
    if ((m = h.match(/^s(\d{1,3})(?:-(\d{1,3}))?$/)) && +m[1] >= 1 && +m[1] <= 114) {
      return pageOfRef(+m[1], m[2] ? +m[2] : 1);
    }
    return null;
  }

  // ---- juz panel --------------------------------------------------------------------
  function buildJuz() {
    var html = '';
    for (var j = 1; j <= 30; j++) {
      var st = pageOfRef(JUZ[j][0], JUZ[j][1]);
      var en = j < 30 ? pageOfRef(JUZ[j + 1][0], JUZ[j + 1][1]) : PAGES;
      var endPage = j < 30 ? (en === st ? st : en) : PAGES;
      html += '<button type="button" class="m-juz-item" data-page="' + st + '">' +
        '<b>' + esc(msg('mushaf.juz', { n: j })) + '</b>' +
        '<span>' + esc(msg('mushaf.pages', { from: st, to: endPage })) + '</span>' +
        '<span class="m-juz-surah">' + esc(surahName(JUZ[j][0])) + ' ' + JUZ[j][0] + ':' + JUZ[j][1] + '</span></button>';
    }
    juzList.innerHTML = html;
  }

  // ---- audio ---------------------------------------------------------------------
  var audio = new Audio();
  audio.preload = 'auto';
  var st = { reciter: 0, style: 'murattal', speed: 1, repAyah: 1, repPage: 1 };
  var queue = [], qi = 0, repLeft = 0, pageRepLeft = 0, playing = false, textLoaded = null;

  function loadSettings() {
    try {
      var saved = JSON.parse(localStorage.getItem('uqns.audio') || 'null');
      if (saved) Object.keys(saved).forEach(function (k) { if (k in st) st[k] = saved[k]; });
    } catch (e) { /* ignore */ }
    if (st.reciter >= RECITERS.length) st.reciter = 0;
    if (!(st.repPage >= 1)) st.repPage = 1;   // 1 = play once
    if (!(st.repAyah >= 1)) st.repAyah = 1;
  }
  function saveSettings() {
    try { localStorage.setItem('uqns.audio', JSON.stringify(st)); } catch (e) { /* ignore */ }
  }

  function fillSelectors() {
    qariSel.innerHTML = RECITERS.map(function (r, i) {
      return '<option value="' + i + '">' + esc(reciterName(r)) + '</option>';
    }).join('');
    qariSel.value = String(st.reciter);
    fillStyles();
    speedSel.value = String(st.speed);
    repAyahSel.value = String(st.repAyah);
    repPageSel.value = String(st.repPage);
  }
  function fillStyles() {
    var r = RECITERS[st.reciter];
    var opts = [['murattal', msg('mushaf.murattal')]];
    if (r.mujawwad) opts.push(['mujawwad', msg('mushaf.mujawwad')]);
    styleSel.innerHTML = opts.map(function (o) {
      return '<option value="' + o[0] + '">' + esc(o[1]) + '</option>';
    }).join('');
    if (!r[st.style]) st.style = 'murattal';
    styleSel.value = st.style;
    styleSel.disabled = opts.length < 2;
  }

  function folder() {
    var r = RECITERS[st.reciter];
    return r[st.style] || r.murattal;
  }
  function ayahUrl(a) {
    return BASE + folder() + '/' + pad(a.s, 3) + pad(a.a, 3) + '.mp3';
  }

  function setStatus(text) { audioStatus.textContent = text || ''; }

  function updateAudioLabel() {
    if (!audioLabel) return;
    var a = queue[qi];
    audioLabel.textContent = a ? surahName(a.s) + ' · ' + a.s + ':' + a.a : msg('mushaf.audioReady');
    playBtn.textContent = playing ? msg('mushaf.pause') : msg('mushaf.play');
    playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    loadAyahText(a);
  }

  function loadAyahText(a) {
    if (!a || !audioPanel || audioPanel.hidden) return;
    audioText.textContent = '';
    // Wait for the Qur'anic font as well, so the first paint is not a fallback font
    var fontReady = (document.fonts && document.fonts.load)
      ? document.fonts.load('22px "QPC Hafs"').catch(function () {})
      : Promise.resolve();
    Promise.all([L.text(), fontReady]).then(function (res) {
      if (!queue[qi] || queue[qi].s !== a.s || queue[qi].a !== a.a) return;
      audioText.textContent = res[0][a.s + ':' + a.a] || '';
    }).catch(function () { audioText.textContent = ''; });
  }

  function playIndex(i) {
    if (i < 0 || i >= queue.length) { stopAudio(false); return; }
    qi = i;
    audio.src = ayahUrl(queue[i]);
    audio.playbackRate = st.speed;
    setStatus(msg('mushaf.audioLoading'));
    playing = true;
    updateAudioLabel();
    var p = audio.play();
    if (p && p.catch) p.catch(function () {
      playing = false; setStatus(msg('mushaf.audioError')); updateAudioLabel();
    });
    setStatus('');
  }

  function startPage(fromStart) {
    queue = pageAyahs(current);
    qi = fromStart ? 0 : Math.max(0, Math.min(qi, queue.length - 1));
    if (queue.length === 0) return;
    repLeft = st.repAyah;
    pageRepLeft = st.repPage;
    playIndex(qi);
  }

  function togglePlay() {
    if (playing) { audio.pause(); playing = false; setStatus(msg('mushaf.paused')); updateAudioLabel(); return; }
    if (queue.length && audio.src && audio.paused && !audio.ended && audio.currentTime > 0) {
      playing = true; audio.play(); updateAudioLabel(); return;
    }
    startPage(true);
  }

  function stopAudio(resetQueue) {
    audio.pause();
    playing = false;
    if (resetQueue) { queue = []; qi = 0; setStatus(''); }
    updateAudioLabel();
  }

  audio.addEventListener('ended', function () {
    if (!playing) return;
    if (repLeft > 1) { repLeft--; playIndex(qi); return; }
    repLeft = st.repAyah;
    if (qi + 1 < queue.length) { playIndex(qi + 1); return; }
    if (pageRepLeft > 1) { pageRepLeft--; playIndex(0); return; }
    stopAudio(false);
  });
  audio.addEventListener('error', function () {
    if (!playing) return;
    playing = false; setStatus(msg('mushaf.audioError')); updateAudioLabel();
  });

  // ---- events ----------------------------------------------------------------------
  $('prevBtn').addEventListener('click', prev);
  $('nextBtn').addEventListener('click', next);
  slider.addEventListener('input', function () { go(+slider.value); });
  $('jumpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var p = parseInt(jump.value, 10);
    if (p >= 1 && p <= PAGES) go(p);
  });
  juzList.addEventListener('click', function (e) {
    var b = e.target.closest('[data-page]');
    if (!b) return;
    juzPanel.hidden = true;
    go(+b.getAttribute('data-page'));
  });
  $('juzBtn').addEventListener('click', function () { juzPanel.hidden = !juzPanel.hidden; });
  $('juzClose').addEventListener('click', function () { juzPanel.hidden = true; });
  $('audioBtn').addEventListener('click', function () {
    audioPanel.hidden = !audioPanel.hidden;
    if (!audioPanel.hidden) { updateAudioLabel(); }
  });
  $('audioClose').addEventListener('click', function () { audioPanel.hidden = true; });

  playBtn.addEventListener('click', togglePlay);
  $('playPageBtn').addEventListener('click', function () { startPage(true); });
  prevAyahBtn.addEventListener('click', function () { if (queue.length) playIndex(Math.max(0, qi - 1)); });
  nextAyahBtn.addEventListener('click', function () { if (queue.length) playIndex(Math.min(queue.length - 1, qi + 1)); });

  qariSel.addEventListener('change', function () {
    st.reciter = +qariSel.value; if (!RECITERS[st.reciter][st.style]) st.style = 'murattal';
    fillStyles(); saveSettings(); stopAudio(true);
  });
  styleSel.addEventListener('change', function () { st.style = styleSel.value; saveSettings(); stopAudio(true); });
  speedSel.addEventListener('change', function () { st.speed = +speedSel.value; audio.playbackRate = st.speed; saveSettings(); });
  repAyahSel.addEventListener('change', function () { st.repAyah = +repAyahSel.value; saveSettings(); });
  repPageSel.addEventListener('change', function () { st.repPage = +repPageSel.value; saveSettings(); });

  // Swipe: next page is to the left (Mushaf is read right to left)
  var tx = null, ty = null;
  stage.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    tx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else prev(); }
  }, { passive: true });

  // Tap the page to show or hide the toolbars (not while swiping)
  img.addEventListener('click', function () {
    bars.forEach(function (b) { b.classList.toggle('m-hidden'); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, select, textarea')) return;
    if (e.key === 'ArrowLeft') next();
    if (e.key === 'ArrowRight') prev();
  });

  window.addEventListener('hashchange', function () {
    var p = fromHash();
    if (p && p !== current) go(p);
  });

  document.addEventListener('uqns:lang', function () {
    buildJuz(); fillSelectors(); renderInfo(current); counter.textContent = msg('mushaf.pageOf', { n: current, total: PAGES });
    pdfBtn.title = msg('mushaf.pdf'); updateAudioLabel();
  });

  // ---- start -----------------------------------------------------------------------
  loadSettings();
  buildJuz();
  fillSelectors();
  var start = fromHash();
  if (!start) {
    try { start = +localStorage.getItem('uqns.mushaf.page') || 1; } catch (e) { start = 1; }
  }
  show(start, { keepHash: !!fromHash() });
})();
