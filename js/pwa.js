/* PWA layer: service worker, install prompt, offline indicator, update prompt, header height. */
(function () {
  "use strict";
  var T = window.I18N;
  var lang = localStorage.getItem("qn_lang") || "en";
  function t(k) { return (T[lang] && T[lang][k]) || T.en[k] || k; }

  /* Keep sticky player offset in sync with the real header height. */
  var head = document.getElementById("appHead");
  function syncHeadHeight() {
    document.documentElement.style.setProperty("--head-h", head.offsetHeight + "px");
  }
  if ("ResizeObserver" in window) new ResizeObserver(syncHeadHeight).observe(head);
  window.addEventListener("resize", syncHeadHeight);
  syncHeadHeight();

  /* Offline indicator */
  var offlineBar = document.getElementById("offlineBar");
  function syncOnline() {
    offlineBar.hidden = navigator.onLine;
    offlineBar.textContent = t("offlineNow");
  }
  window.addEventListener("online", syncOnline);
  window.addEventListener("offline", syncOnline);
  syncOnline();

  /* Toast helper */
  function toast(message, actions) {
    var el = document.createElement("div");
    el.className = "toast"; el.setAttribute("role", "status");
    var span = document.createElement("span"); span.textContent = message; el.appendChild(span);
    actions.forEach(function (a) {
      var b = document.createElement("button"); b.className = "btn" + (a.ghost ? " ghost" : "");
      b.type = "button"; b.textContent = a.label;
      b.addEventListener("click", function () { a.onClick(); el.remove(); });
      el.appendChild(b);
    });
    document.body.appendChild(el);
    return el;
  }

  /* Install prompt (Chrome/Edge/Android) */
  var deferredPrompt = null;
  var installBtn = document.getElementById("installBtn");
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null; installBtn.hidden = true;
    });
  });
  window.addEventListener("appinstalled", function () { installBtn.hidden = true; });

  /* Service worker: offline use and updates */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () {
      /* Reload only when a new worker takes over from an old one, not on the first visit
         (a first-visit reload would show the splash twice). */
      var hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        reg.addEventListener("updatefound", function () {
          var nw = reg.installing;
          nw.addEventListener("statechange", function () {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              toast(t("updateReady"), [{ label: t("reload"), onClick: function () { nw.postMessage("skipWaiting"); } },
                { label: t("dismiss"), ghost: true, onClick: function () {} }]);
            }
          });
        });
      }).catch(function () { /* offline-only feature; the app still works online */ });
      var reloading = false;
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (!hadController || reloading) return; reloading = true; location.reload();
      });
    });
  }
})();
