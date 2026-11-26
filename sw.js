/* UQNS service worker: makes the site installable and lets the shell open offline.
   Bump VERSION whenever a cached file changes, so visitors get the new files. */
const VERSION = "uqns-v4";
const SHELL = [
  "./",
  "index.html",
  "mushaf.html",
  "reader.html",
  "install.html",
  "manifest.webmanifest",
  "assets/css/styles.css",
  "assets/css/reader.css",
  "assets/css/mushaf.css",
  "assets/css/install.css",
  "assets/js/i18n.js",
  "assets/js/app.js",
  "assets/js/share-install.js",
  "assets/js/data-loader.js",
  "assets/js/home-quotes.js",
  "assets/js/search.js",
  "assets/js/bottom-nav.js",
  "assets/logo/logo-color.png",
  "assets/share/qr.svg",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/maskable-512.png",
  "assets/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function keep(request, response) {
  if (!response || !response.ok || response.type !== "basic") return;
  caches.open(VERSION).then((c) => c.put(request, response.clone()));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // The reader is its own app with its own caching; leave its requests alone.
  if (url.pathname.startsWith("/quran-reader/")) return;

  if (req.mode === "navigate") {
    // Pages: network first so updates show, cached copy when offline.
    event.respondWith(
      fetch(req)
        .then((res) => { keep(req, res); return res; })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("index.html")))
    );
    return;
  }

  // Assets: cache first, then network. Mushaf page images are large, so they are not cached here.
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (!url.pathname.includes("/mushaf/")) keep(req, res);
      return res;
    }))
  );
});
