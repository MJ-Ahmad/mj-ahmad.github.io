/* UQNS — language toggle (EN | BN | AR), RTL handling, dark/light theme, splash,
   and working search entry points (header search, main search, suggestion chips).
   Copy lives in assets/js/i18n.js; this file only applies it. */
(function () {
  var SUPPORTED_LANGS = ['en', 'bn', 'ar'];
  var THEMES = ['dark', 'light'];
  var LANG_KEY = 'uqns.lang';
  var THEME_KEY = 'uqns.theme';
  var dict = window.UQNS_I18N;

  var currentLang = 'en';
  var currentTheme = 'dark';

  function store(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable: ignore */ }
  }
  function t(key, lang) {
    var d = dict[lang] || dict.en;
    return d[key] !== undefined ? d[key] : (dict.en[key] || '');
  }

  /* ---------- Theme ---------- */
  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (THEMES.indexOf(theme) === -1) theme = 'dark';
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton();
  }

  function updateThemeButton() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    // Label describes the action: in dark mode the button offers light mode, and vice versa
    var label = t(currentTheme === 'dark' ? 'theme.toLight' : 'theme.toDark', currentLang);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      save(THEME_KEY, next); // remember only an explicit choice
    });
  }

  /* ---------- Language ---------- */
  function apply(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = 'en';
    currentLang = lang;
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var text = t(el.getAttribute('data-i18n'), lang);
      el.textContent = text;
      // Hide elements whose translation is intentionally empty (e.g. no AR gloss)
      el.hidden = text === '';
    });

    // Attributes, e.g. data-i18n-attr="placeholder:search.placeholder"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim(), lang));
      });
    });

    // Suggestion chips, e.g. data-i18n-list="s10.chips" — rendered as real buttons
    document.querySelectorAll('[data-i18n-list]').forEach(function (el) {
      var items = t(el.getAttribute('data-i18n-list'), lang).split(/[,،]\s*/);
      el.innerHTML = '';
      items.forEach(function (item) {
        if (!item) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = item;
        el.appendChild(b);
      });
    });

    // Document title and description
    // Pages can use their own title/description keys, e.g. <body data-title-key="reader.title">
    var titleKey = document.body.getAttribute('data-title-key') || 'meta.title';
    var descKey = document.body.getAttribute('data-desc-key') || 'meta.description';
    document.title = t(titleKey, lang);
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t(descKey, lang));

    // Language toggle state
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('active', active);
    });

    // Keep the search status message in the active language
    updateThemeButton();
    save(LANG_KEY, lang);
    // Let page scripts (e.g. the reader) react to a language switch
    document.dispatchEvent(new CustomEvent('uqns:lang', { detail: { lang: lang } }));
  }

  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { apply(btn.getAttribute('data-lang')); });
  });

  /* ---------- Splash: auto-hide after a short moment, or on click/skip ---------- */
  var splash = document.getElementById('splash');
  function hideSplash() {
    if (!splash || splash.classList.contains('hide')) return;
    splash.classList.add('hide');
    splash.setAttribute('aria-hidden', 'true');
  }
  var skip = document.getElementById('splashSkip');
  if (skip) skip.addEventListener('click', hideSplash);
  if (splash) splash.addEventListener('click', hideSplash);
  setTimeout(hideSplash, 3000);

  /* ---------- Initial state ---------- */
  // Theme: saved explicit choice, else the device's light/dark preference, else dark
  var savedTheme = store(THEME_KEY);
  applyTheme(THEMES.indexOf(savedTheme) !== -1 ? savedTheme : systemTheme());

  // Language: saved choice, else browser language (bn/ar), else English
  var initial = store(LANG_KEY);
  if (!initial || SUPPORTED_LANGS.indexOf(initial) === -1) {
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    initial = SUPPORTED_LANGS.indexOf(nav) !== -1 ? nav : 'en';
  }
  apply(initial);
})();
