/* Quran Navigation service worker.
   - App shell and data are precached (works offline after the first visit).
   - Mushaf page images are cached on first view (bounded size).
   - Google Fonts are cached for offline use.
   - Audio (everyayah.com) is never cached: it streams from the network. */
const VERSION = "qn-v1.2.1";
const SHELL_CACHE = VERSION + "-shell";
const PAGE_CACHE = VERSION + "-pages";
const FONT_CACHE = VERSION + "-fonts";
const MAX_PAGES = 250;

const SHELL = [
  "./", "index.html", "manifest.webmanifest",
  "css/style.css",
  "js/theme-init.js", "js/site-meta.js", "js/splash.js", "js/share.js", "js/footer.js",
  "js/i18n.js", "js/i18n-site.js", "js/i18n-nav.js", "js/i18n-pwa.js", "js/i18n-hifz.js", "js/audio.js",
  "js/hifz-core.js", "js/hifz.js", "js/i18n-tajweed.js", "js/tajweed-core.js", "js/tajweed.js",
  "data/tajweed-lessons.js", "data/manzumah.js", "js/app.js", "js/pwa.js",
  "data/quran.js", "data/surahs.js", "data/reciters.js", "data/hizb.js",
  "data/rukuh.js", "data/sajdah.js", "data/topics.js",
  "assets/logo.png", "assets/favicon.ico", "assets/favicon-16.png", "assets/favicon-32.png",
  "assets/favicon.png", "assets/icon-180.png", "assets/icon-192.png", "assets/icon-512.png",
  "assets/icon-maskable-512.png", "assets/og-image.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("qn-") && !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > max) await cache.delete(keys[0]);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Audio and anything else cross-origin (except fonts): straight to network.
  if (url.origin !== self.location.origin) {
    if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
      event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    }
    return;
  }

  // Page navigations: network first, fall back to the cached app shell offline.
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("index.html", { ignoreSearch: true })));
    return;
  }

  // Mushaf page images: cache on first view.
  if (url.pathname.includes("/pages/")) {
    event.respondWith((async () => {
      const cache = await caches.open(PAGE_CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) { cache.put(req, res.clone()); trimCache(PAGE_CACHE, MAX_PAGES); }
      return res;
    })());
    return;
  }

  // App shell and data: cache-first with background refresh.
  event.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
});

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req, { ignoreSearch: false });
  const network = fetch(req).then((res) => {
    if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}
