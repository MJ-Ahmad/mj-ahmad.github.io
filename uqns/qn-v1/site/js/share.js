/* Share sheet: native share where the device supports it, plus direct links to
   WhatsApp, Messenger, Facebook, Telegram and X, and copy-link. */
(function () {
  "use strict";
  var META = window.QN_META || {};
  var SHARE_URL = META.url || "https://mj-ahmad.github.io/qn/";
  var T = window.I18N;
  function currentLang() { return localStorage.getItem("qn_lang") || "en"; }
  function t(k) {
    var lang = currentLang();
    return (T[lang] && T[lang][k]) || T.en[k] || k;
  }

  var sheet = document.getElementById("shareSheet");
  var grid = document.getElementById("shareGrid");
  var urlBox = document.getElementById("shareUrl");
  var lastFocus = null;

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  function enc(s) { return encodeURIComponent(s); }

  function targets() {
    var text = t("shareText");
    var full = text + " " + SHARE_URL;
    return [
      { key: "shareWhatsApp", href: "https://wa.me/?text=" + enc(full) },
      // On phones this opens the Messenger app directly; on desktop it falls back to Facebook's sharer.
      { key: "shareMessenger", href: isMobile
          ? "fb-messenger://share/?link=" + enc(SHARE_URL)
          : "https://www.facebook.com/sharer/sharer.php?u=" + enc(SHARE_URL) },
      { key: "shareFacebook", href: "https://www.facebook.com/sharer/sharer.php?u=" + enc(SHARE_URL) },
      { key: "shareTelegram", href: "https://t.me/share/url?url=" + enc(SHARE_URL) + "&text=" + enc(text) },
      { key: "shareX", href: "https://x.com/intent/post?text=" + enc(text) + "&url=" + enc(SHARE_URL) }
    ];
  }

  function toast(message) {
    var el = document.createElement("div");
    el.className = "toast"; el.setAttribute("role", "status");
    var span = document.createElement("span"); span.textContent = message; el.appendChild(span);
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }

  function copyLink() {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = SHARE_URL; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
      toast(ok ? t("copied") : t("copyFailed"));
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(SHARE_URL).then(function () { toast(t("copied")); }, fallback);
    } else {
      fallback();
    }
  }

  function nativeShare() {
    closeSheet();
    navigator.share({ title: "Quran Navigation", text: t("shareText"), url: SHARE_URL })
      .catch(function () { /* user cancelled */ });
  }

  function button(label, onClick, href) {
    var b;
    if (href) {
      b = document.createElement("a");
      b.href = href; b.target = "_blank"; b.rel = "noopener noreferrer";
      if (href.indexOf("fb-messenger:") === 0) b.removeAttribute("target");
      b.addEventListener("click", function () { closeSheet(); });
    } else {
      b = document.createElement("button"); b.type = "button";
      b.addEventListener("click", onClick);
    }
    b.className = "share-opt";
    b.textContent = label;
    return b;
  }

  function render() {
    grid.textContent = "";
    if (navigator.share) grid.appendChild(button(t("shareNative"), nativeShare));
    targets().forEach(function (tg) { grid.appendChild(button(t(tg.key), null, tg.href)); });
    grid.appendChild(button(t("shareCopy"), copyLink));
    urlBox.textContent = SHARE_URL;
    document.getElementById("shareTitle").textContent = t("shareTitle");
    document.getElementById("shareClose").textContent = t("close");
  }

  function openSheet() {
    lastFocus = document.activeElement;
    render();
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    var first = grid.querySelector("button, a");
    if (first) first.focus();
  }

  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    var btn = document.getElementById("shareBtn");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>';
    btn.setAttribute("aria-label", t("shareBtnLabel"));
    btn.setAttribute("title", t("shareBtnLabel"));
    btn.addEventListener("click", openSheet);
    var footBtn = document.getElementById("shareLink");
    if (footBtn) footBtn.addEventListener("click", openSheet);
    document.getElementById("shareClose").addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
    document.addEventListener("keydown", function (e) {
      if (sheet.hidden) return;
      if (e.key === "Escape") { e.stopPropagation(); closeSheet(); }
    });
  }

  window.QNShare = { open: openSheet, close: closeSheet };
  init();
})();
