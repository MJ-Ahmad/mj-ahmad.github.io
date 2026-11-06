/* Splash screen: fades out once the page has loaded, with a minimum display time
   so it never flashes, and a hard limit so it can never block the app. */
(function () {
  "use strict";
  var el = document.getElementById("splash");
  if (!el) return;

  var MIN_MS = 1100;   // minimum time on screen
  var MAX_MS = 5000;   // never block longer than this
  var started = Date.now();
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finished = false;

  function remove() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  function hide() {
    if (finished) return;
    finished = true;
    var wait = Math.max(0, MIN_MS - (Date.now() - started));
    setTimeout(function () {
      el.classList.add("is-hidden");
      document.body.classList.add("splash-done");
      el.addEventListener("transitionend", remove, { once: true });
      setTimeout(remove, reduceMotion ? 0 : 700); // fallback if transitionend never fires
    }, wait);
  }

  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide);
  setTimeout(hide, MAX_MS);
})();
