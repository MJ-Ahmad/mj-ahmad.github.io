/* UQNS — shared on-demand loader for the Qur'anic data used by the home page and search.
   Each file is added with a <script> tag once (works from file://). Large files are
   only fetched when a feature needs them. */
(function () {
  var FILES = {
    meta: 'data/quran-data.js',
    text: 'data/quran-text/uthmani.js',
    tr: { en: { id: 'en.yusufali', file: 'data/quran-translations/en.yusufali.js' },
          bn: { id: 'bn.bengali', file: 'data/quran-translations/bn.bengali.js' } }
  };
  var pending = {};

  function load(src, ready) {
    if (ready()) return Promise.resolve();
    if (pending[src]) return pending[src];
    pending[src] = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { ready() ? resolve() : reject(new Error('empty ' + src)); };
      s.onerror = function () { reject(new Error('failed ' + src)); };
      document.head.appendChild(s);
    }).catch(function (err) { delete pending[src]; throw err; });
    return pending[src];
  }

  function meta() {
    return load(FILES.meta, function () { return !!window.QuranData; });
  }
  function text() {
    return meta().then(function () {
      return load(FILES.text, function () { return !!(window.QuranText && window.QuranText.uthmani); });
    }).then(function () { return window.QuranText.uthmani; });
  }
  // Returns the translation object for en / bn, or null for languages without a file (ar).
  function translation(lang) {
    var f = FILES.tr[lang];
    if (!f) return Promise.resolve(null);
    return load(f.file, function () {
      return !!(window.QuranTranslations && window.QuranTranslations[f.id]);
    }).then(function () { return window.QuranTranslations[f.id]; });
  }

  window.UQNS_DATA_LOADER = { meta: meta, text: text, translation: translation };
})();
