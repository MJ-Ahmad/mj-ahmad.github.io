/* Audio recitation: per-ayah playback, whole-surah playback, reciter (Qari) selection. */
(function () {
  "use strict";
  var audio = new Audio();
  audio.preload = "none";
  var state = {
    n: null,            // surah currently playing
    a: 1,               // selected / playing ayah
    mode: "ayah",       // "ayah" = single ayah, "surah" = continue to end of surah
    playing: false,
    reciterId: localStorage.getItem("qn_reciter") || RECITERS[0].id,
    error: false
  };
  var viewN = null;     // surah currently rendered in the reader

  function pad(x) { return String(x).padStart(3, "0"); }
  function reciter() {
    for (var i = 0; i < RECITERS.length; i++) if (RECITERS[i].id === state.reciterId) return RECITERS[i];
    return RECITERS[0];
  }
  function lang() { return document.documentElement.lang || "en"; }
  function tr(k) { var L = I18N[lang()] || I18N.en; return L[k] || I18N.en[k] || k; }
  function rname(r) { return r[lang()] || r.en; }
  function ayahCount(n) { return QURAN_DATA[n - 1].ayahs.length; }
  function localNum(n) {
    var s = String(n);
    if (lang() === "ar") return s.replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; });
    if (lang() === "bn") return s.replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; });
    return s;
  }

  function playAt(n, a) {
    state.n = n; state.a = a; state.error = false;
    audio.src = reciter().base + pad(n) + pad(a) + ".mp3";
    var p = audio.play();
    if (p && p.catch) p.catch(function () { state.playing = false; state.error = true; updateUI(); });
    state.playing = true;
    highlight(); updateUI();
  }

  audio.addEventListener("ended", function () {
    if (state.mode === "surah" && state.a < ayahCount(state.n)) {
      playAt(state.n, state.a + 1);
    } else {
      state.playing = false; updateUI(); highlight();
    }
  });
  audio.addEventListener("error", function () {
    if (!state.n) return;
    state.playing = false; state.error = true; updateUI();
  });
  audio.addEventListener("pause", function () { if (!audio.ended) { state.playing = false; updateUI(); } });
  audio.addEventListener("play", function () { state.playing = true; updateUI(); });

  function highlight() {
    document.querySelectorAll(".ayah.playing").forEach(function (el) { el.classList.remove("playing"); });
    if (state.n !== viewN || !state.playing) return;
    var el = document.getElementById("a-" + state.a);
    if (el) {
      el.classList.add("playing");
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function statusText() {
    if (state.error) return tr("audioError");
    if (!state.n) return tr("audioIdle");
    var label = tr("surah") + " " + localNum(state.n) + ":" + localNum(state.a);
    return (state.playing ? tr("nowPlaying") + ": " : tr("paused") + ": ") + label + " · " + rname(reciter());
  }

  function updateUI() {
    var el = document.getElementById("playerStatus");
    if (!el) return;
    el.textContent = statusText();
    var pp = document.getElementById("playPause");
    if (pp) pp.textContent = state.playing ? "❚❚ " + tr("pause") : "▶ " + tr("play");
  }

  function mount(n, ayah) {
    viewN = n;
    var box = document.getElementById("player");
    if (!box) return;
    if (state.n !== n) { state.a = ayah || 1; }
    else if (ayah) { state.a = ayah; }
    var count = ayahCount(n);
    var opts = RECITERS.map(function (r) {
      return '<option value="' + r.id + '"' + (r.id === state.reciterId ? " selected" : "") + ">" + rname(r) + "</option>";
    }).join("");
    box.innerHTML =
      '<div class="player">' +
        '<div class="player-row"><label class="muted" for="reciterSel">' + tr("reciter") + "</label>" +
        '<select id="reciterSel" class="select">' + opts + "</select></div>" +
        '<div class="player-row btns">' +
          '<button class="btn ghost" id="prevAyah" type="button">← ' + tr("prevAyah") + "</button>" +
          '<button class="btn" id="playPause" type="button">▶ ' + tr("play") + "</button>" +
          '<button class="btn ghost" id="nextAyah" type="button">' + tr("nextAyah") + " →</button>" +
        "</div>" +
        '<div class="player-row btns">' +
          '<button class="btn ghost" id="playSurah" type="button">' + tr("playSurah") + "</button>" +
          '<button class="btn ghost" id="stopAudio" type="button">■ ' + tr("stop") + "</button>" +
        "</div>" +
        '<div class="muted" id="playerStatus" role="status" aria-live="polite"></div>' +
        '<div class="note" style="text-align:left;margin:4px 0 0">' + tr("audioNote") + "</div>" +
      "</div>";

    document.getElementById("reciterSel").addEventListener("change", function (e) {
      state.reciterId = e.target.value;
      localStorage.setItem("qn_reciter", state.reciterId);
      if (state.n === n && state.playing) playAt(n, state.a);   // switch reciter mid-ayah
      else updateUI();
    });
    document.getElementById("playPause").addEventListener("click", function () {
      if (state.n !== n) { state.mode = "ayah"; playAt(n, state.a); return; }
      if (audio.paused) { audio.play(); } else { audio.pause(); }
    });
    document.getElementById("prevAyah").addEventListener("click", function () {
      var a = Math.max(1, (state.n === n ? state.a : state.a) - 1);
      state.mode = "ayah"; playAt(n, a);
    });
    document.getElementById("nextAyah").addEventListener("click", function () {
      var a = Math.min(count, (state.n === n ? state.a : state.a) + 1);
      state.mode = "ayah"; playAt(n, a);
    });
    document.getElementById("playSurah").addEventListener("click", function () {
      state.mode = "surah"; playAt(n, state.a || 1);
    });
    document.getElementById("stopAudio").addEventListener("click", function () {
      audio.pause(); audio.removeAttribute("src"); audio.load();
      state.playing = false; state.n = null; state.error = false;
      highlight(); updateUI();
    });
    updateUI();
    highlight();
  }

  window.QNAudio = {
    mount: mount,
    playAyah: function (n, a) { state.mode = "ayah"; playAt(n, a); },
    refresh: updateUI
  };
})();
