/* UQNS — fills the Qur'an verses on the home page from the data files.
   Elements with data-ref="s:a" and data-kind ("ar", "verse" or "tr"; see paint()).
   The i18n text stays as the fallback if data cannot be loaded. */
(function () {
  var L = window.UQNS_DATA_LOADER;
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-ref][data-kind]'));
  if (!els.length || !L) return;

  var started = false, dataReady = false;

  function lang() { return document.documentElement.lang || 'en'; }

  // kind "ar"     -> always the Arabic text
  // kind "verse"  -> Arabic in ar, translation in en / bn
  // kind "tr"     -> translation line; hidden in ar (the Arabic is shown above it)
  function paint(lg, uthmani, tr) {
    els.forEach(function (el) {
      var key = el.getAttribute('data-ref');
      var kind = el.getAttribute('data-kind');
      if (kind === 'tr' && lg === 'ar') { el.hidden = true; return; }
      var useArabic = kind === 'ar' || (kind === 'verse' && lg === 'ar');
      var value = useArabic ? uthmani[key] : (tr ? tr[key] : null);
      if (!value) return; // keep the i18n fallback
      el.textContent = value;
      el.setAttribute('lang', useArabic ? 'ar' : lg);
      el.hidden = false;
    });
  }

  function refresh() {
    var lg = lang();
    Promise.all([L.text(), L.translation(lg)]).then(function (res) {
      dataReady = true;
      paint(lg, res[0], res[1]);
    }).catch(function () { /* fallback text stays */ });
  }

  function start() {
    if (started) return;
    started = true;
    refresh();
  }

  // Load only when the verses are close to the viewport.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); }
    }, { rootMargin: '600px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    start();
  }

  // Re-fill in the new language after the page re-applies its copy.
  document.addEventListener('uqns:lang', function () {
    if (dataReady) refresh(); else start();
  });
})();
