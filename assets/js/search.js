/* UQNS — search over the Qur'anic text, the selected translation and surah names.
   Data is loaded on the first search (see data-loader.js). Results link to reader.html. */
(function () {
  var L = window.UQNS_DATA_LOADER;
  var form = document.getElementById('bigSearch');
  var input = form ? form.querySelector('input') : null;
  var out = document.getElementById('searchResults');
  var status = document.getElementById('searchStatus');
  var header = document.getElementById('headerSearch');
  var chips = document.getElementById('searchChips');
  if (!form || !input || !out || !L) return;

  var LIMIT = 60;
  var lastQuery = '';
  var run = 0;
  var cache = {}; // language -> rows

  function lang() { return document.documentElement.lang || 'en'; }

  function msg(key, p) {
    var d = (window.UQNS_I18N && window.UQNS_I18N[lang()]) || {};
    var s = d[key] || (window.UQNS_I18N.en || {})[key] || key;
    if (p) Object.keys(p).forEach(function (k) { s = s.split('{' + k + '}').join(String(p[k])); });
    return s;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Ignore harakat, tatweel and alif variants so typing without diacritics still matches.
  function norm(s) {
    return String(s || '')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
      .replace(/\u0649/g, '\u064A')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function snippet(s, max) {
    s = String(s || '');
    return s.length > max ? s.slice(0, max) + '…' : s;
  }

  function surahName(sura, lg) {
    if (lg === 'ar') return sura[4];
    return sura[5]; // transliteration (Bengali surah names are not in the data yet)
  }

  function buildRows(translation) {
    var lg = lang();
    if (cache[lg]) return cache[lg];
    var T = window.QuranText.uthmani;
    var TR = translation || null;
    var rows = Object.keys(T).map(function (k) {
      var p = k.split(':');
      var ar = T[k];
      var tr = TR && TR[k] ? TR[k] : '';
      return { s: +p[0], a: +p[1], ar: ar, arN: norm(ar), tr: tr, trN: norm(tr) };
    });
    cache[lg] = rows;
    return rows;
  }

  function setStatus(text) { if (status) status.textContent = text || ''; }

  function showHint() {
    out.innerHTML = '';
    setStatus(msg('search.enterQuery'));
  }

  function search(query) {
    var q = (query || '').trim();
    lastQuery = q;
    if (!q) { showHint(); return; }
    var id = ++run;
    setStatus(msg('search.loading'));
    out.innerHTML = '';

    var lg = lang();
    Promise.all([L.meta(), L.text(), L.translation(lg)]).then(function (res) {
      if (id !== run) return; // a newer search started
      var rows = buildRows(res[2]);
      render(q, rows);
    }).catch(function () {
      if (id !== run) return;
      setStatus(msg('search.error'));
    });
  }

  function render(q, rows) {
    var lg = lang();
    var nq = norm(q);
    var SURA = window.QuranData.Sura;
    var html = '';

    // Direct reference, e.g. "2:255"
    var m = q.match(/^\s*(\d{1,3})\s*[:：.]\s*(\d{1,3})\s*$/);
    if (m) {
      var s = +m[1], a = +m[2];
      if (s >= 1 && s <= 114 && a >= 1 && a <= SURA[s][1]) {
        var ref = s + ':' + a;
        html += '<p class="search-direct"><a class="btn btn-primary" href="reader.html#s' + s + '-' + a + '">' +
          esc(msg('search.open', { ref: ref })) + ' · ' + esc(surahName(SURA[s], lg)) + '</a></p>';
      }
    }

    // Surah names
    var surahs = [];
    for (var i = 1; i <= 114; i++) {
      var sr = SURA[i];
      if (!nq) break;
      if (norm(sr[4]).indexOf(nq) !== -1 || sr[5].toLowerCase().indexOf(q.toLowerCase()) !== -1 ||
          sr[6].toLowerCase().indexOf(q.toLowerCase()) !== -1) surahs.push(i);
    }
    if (surahs.length) {
      html += '<h2 class="small-head">' + esc(msg('search.surahsHead')) + '</h2><ul class="refs">' +
        surahs.slice(0, 12).map(function (n) {
          var sr = SURA[n];
          return '<li><a href="reader.html#s' + n + '">' + n + '. ' + esc(surahName(sr, lg)) +
            ' <span class="quran" lang="ar">' + esc(sr[4]) + '</span></a></li>';
        }).join('') + '</ul>';
    }

    // Verses
    var hits = [], total = 0;
    for (var r = 0; r < rows.length && nq; r++) {
      var row = rows[r];
      if (row.arN.indexOf(nq) !== -1 || (row.trN && row.trN.indexOf(nq) !== -1)) {
        total++;
        if (hits.length < LIMIT) hits.push(row);
      }
    }
    if (hits.length) {
      html += '<h2 class="small-head">' + esc(msg('search.versesHead')) + '</h2><ol class="search-hits">' +
        hits.map(function (h) {
          return '<li><a href="reader.html#s' + h.s + '-' + h.a + '">' +
            '<span class="ref">' + h.s + ':' + h.a + '</span>' +
            '<span class="quran hit-ar" lang="ar">' + esc(snippet(h.ar, 160)) + '</span>' +
            (h.tr ? '<span class="hit-tr" lang="' + esc(lg) + '">' + esc(snippet(h.tr, 200)) + '</span>' : '') +
            '</a></li>';
        }).join('') + '</ol>';
    }

    out.innerHTML = html;
    if (!html) {
      setStatus(msg('search.none', { q: q }));
    } else if (total > hits.length) {
      setStatus(msg('search.countOf', { n: hits.length, total: total }));
    } else {
      setStatus(msg('search.count', { n: total }));
    }
  }

  // ---- wiring -----------------------------------------------------------------
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    search(input.value);
  });

  if (header) {
    header.addEventListener('submit', function (e) {
      e.preventDefault();
      var hi = header.querySelector('input');
      var q = hi ? hi.value : '';
      window.location.hash = '#search';
      input.value = q.trim();
      search(q);
      input.focus({ preventScroll: true });
    });
  }

  if (chips) {
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      input.value = b.textContent;
      search(b.textContent);
      input.focus({ preventScroll: true });
    });
  }

  document.addEventListener('uqns:lang', function () {
    if (lastQuery) search(lastQuery); else if (out.innerHTML === '') showHint();
  });

  window.UQNS_SEARCH = { run: search };
})();
