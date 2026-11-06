# Changelog

## 1.2.1
- Splash screen on launch (logo, name in English, Bangla and Arabic, developer credit). Respects reduced-motion settings and never blocks for more than 5 seconds.
- Footer: developer credit "MJ Ahmad" linking to https://mj-ahmad.github.io/mj/, last-updated date, live clocks for Dhaka (UTC+6) and UTC, version and copyright.
- Share button and sheet: native share on supported devices, plus WhatsApp, Messenger, Facebook, Telegram, X and copy-link.
- Search and social metadata: canonical URL, Open Graph and X/Twitter cards (1200×630 image), JSON-LD structured data, full icon set (favicon.ico, 16/32/64, apple-touch 180, PWA 192/512 and maskable).
- Brand assets replaced with the official Quran Navigation logo set (gold #DDB441 on black).
- Content-Security-Policy set in the page so it also applies on GitHub Pages. Inline scripts moved to files.
- Manifest uses relative paths, so the app works under a sub-path such as /qn/.
- Service worker caches the new modules and assets (cache qn-v1.2.1).

## 1.2.0
- Tajweed: automatic detection of noon sakinah and tanween (izhar, idgham, iqlab, ikhfa), meem sakinah and qalqalah across the whole Quran text (24,925 detections, each tested against the letter position).
- Tajweed lessons (7), ayah scanner that highlights rules in a verse, and a four-option quiz.
- Manzumah screen with memorization tracking and a hide-to-recite mode. The verse text is not yet included (pending verified source and teacher review).
- Service worker precaches the new modules (cache qn-v1.2.0).

## 1.1.0
- Hifz tracker: sabaq records, spaced dohor reviews, manzil rotation, progress and pace, JSON backup and restore.
- Release checks (`npm run check`) and unit tests (`npm test`).
- Service worker precaches all app assets, including the hifz modules.

## 1.0.0
- Navigation by page, surah, juz, hizb, rukuh, ayah, sajdah, topic and bookmark.
- Recitation audio with reciter selection and per-ayah playback.
- English, Bangla and Arabic interface, with theme (system, light, dark) and language toggles.
- Installable PWA with offline use.
