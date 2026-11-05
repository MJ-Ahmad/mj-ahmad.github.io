/* Runs before first paint: marks JS as enabled (the splash needs it) and applies the saved theme. */
(function () {
  document.documentElement.classList.add("js");
  try {
    var m = localStorage.getItem("qn_theme");
    if (m === "light" || m === "dark") document.documentElement.setAttribute("data-theme", m);
  } catch (e) { /* storage unavailable: follow the system theme */ }
})();
