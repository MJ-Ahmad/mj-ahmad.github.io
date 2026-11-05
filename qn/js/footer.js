/* Footer: live clocks for Dhaka (UTC+6) and UTC, last-updated date, version and year. */
(function () {
  "use strict";
  var META = window.QN_META || {};
  var LOCALES = { en: "en-GB", bn: "bn-BD", ar: "ar" };

  function lang() { return localStorage.getItem("qn_lang") || "en"; }
  function fmtLocale() { return LOCALES[lang()] || "en-GB"; }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && el.textContent !== text) el.textContent = text;
    return el;
  }

  function tick() {
    var now = new Date();
    var dhaka = new Intl.DateTimeFormat(fmtLocale(), {
      timeZone: "Asia/Dhaka", day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(now);
    var utc = new Intl.DateTimeFormat(fmtLocale(), {
      timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(now);
    setText("clockDhaka", dhaka);
    setText("clockUtc", utc);

    /* Last-updated date is stored as YYYY-MM-DD and shown in Dhaka time. */
    if (META.lastUpdated) {
      var when = new Date(META.lastUpdated + "T00:00:00+06:00");
      var el = setText("lastUpdated", new Intl.DateTimeFormat(fmtLocale(), {
        timeZone: "Asia/Dhaka", day: "numeric", month: "long", year: "numeric"
      }).format(when));
      if (el) el.setAttribute("datetime", META.lastUpdated);
    }
  }

  function start() {
    if (META.version) setText("appVersion", META.version);
    setText("copyYear", String(new Date().getFullYear()));
    tick();
    // Align updates to the start of each second.
    setTimeout(function () {
      tick();
      setInterval(tick, 1000);
    }, 1000 - (Date.now() % 1000));
    document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
