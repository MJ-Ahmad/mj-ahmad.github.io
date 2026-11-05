# Quran Navigation · কুরআন নেভিগেশন · ملاحة القرآن

A static, offline-capable Quran navigation website: browse by **Surah**, **Juz**, **Page** (604-page Madani Mushaf) or **Verse**, and search Arabic text or surah names. Interface in **English**, **বাংলা** and **العربية**.

## Run it

No build step and no server required. Open `index.html` in a browser.
For the best experience (and to avoid any browser restriction on local files), serve the folder:

    python3 -m http.server 8000      # then open http://localhost:8000

## Features

- **Surah**: all 114 surahs with Arabic, English and Bangla names, ayah counts and Meccan/Medinan classification. "Continue reading" remembers your last position.
- **Juz**: the 30 parts, each linking to its starting verse.
- **Page**: the 604 Mushaf page images, with the surah and any surah beginning on that page. Use the buttons, the page number box, or the ← → keys.
- **Search**: type a surah name (English, Bangla or Arabic), a surah number, a reference such as `2:255`, or Arabic words (diacritics are ignored).

## Navigation system

Every section is reachable from the top bar or the ☰ Menu (press `/` to open it, `Esc` to close):

| Section | What it does | Data status |
|---|---|---|
| Page | 604 Mushaf pages, with the surah starting on each page | Complete |
| Surah | 114 surahs; reader with audio and bookmarks | Complete |
| Juz | 30 parts, each linking to its first verse | Complete |
| Hizb | 60 divisions | 44 of 60 verified; the rest show "Data pending" |
| Rukuh | Rukuh divisions | Not yet included (`data/rukuh.js` is empty) |
| Ayah | Go directly to any surah and verse | Complete |
| Sajdah | The 15 verses of prostration; they are also marked ۩ in the reader | Complete |
| Topic | Verses grouped by theme (`data/topics.js`) | Starter list of 8 topics |
| Bookmark | Save verses with ☆ in the reader; list and remove them | Stored in the browser |

### Completing the data

- **Hizb:** in `data/hizb.js`, replace each `null` with `[surah, ayah]` from a verified source. Keep the order: entry 1 is hizb 1.
- **Rukuh:** in `data/rukuh.js`, add `[surah, ayah]` pairs in Mushaf order. Use a verified rukuh table (for example one printed with your Mushaf), since the boundaries differ between editions.
- **Topics:** add to `data/topics.js`. Each reference is `[surah, fromAyah, toAyah]`.

## Mobile, themes and offline

- **Language:** the EN / বাং / عربي button in the top bar cycles the interface language. Arabic switches the layout to right-to-left.
- **Theme:** the ◐ / ☀ / ☾ button cycles System → Light → Dark. "System" follows the phone's setting. The choice is remembered, and the theme is applied before the page paints, so there is no flash.
- **Phone layout:** the menu opens as a bottom sheet. Touch targets are at least 48 px. Inputs use 16 px text so iOS does not zoom. Safe areas for notches and gesture bars are respected.
- **Offline:** a service worker (`sw.js`) caches the app, the data, and each Mushaf page once it has been viewed (up to 250 pages). Audio always streams from the network.
- **Install:** on Android Chrome the "⬇ Install" button appears. The app then opens full-screen like a native app.

## Publishing to Android (Play Store)

The project is a PWA with a valid manifest and service worker. Android packages it as a Trusted Web Activity (TWA), which is a Play-ready app with no browser bar.

1. **Host it over HTTPS** on your own domain (for example `https://quran.example.org`). Upload the whole folder. Use the included `_headers` file on Netlify or Cloudflare Pages, or set the same headers on your host. Check that `https://your-domain/manifest.webmanifest` and `https://your-domain/sw.js` load.
2. **Check the PWA score:** open the site in Chrome, then DevTools → Lighthouse → "Progressive Web App". Fix anything it flags.
3. **Build the Android package** with Bubblewrap (needs Node.js, Java 17 and the Android SDK):

       npm i -g @bubblewrap/cli
       bubblewrap init --manifest https://your-domain/manifest.webmanifest
       bubblewrap build

   This produces an `.aab` for Play and an `.apk` for testing. Choose a package name such as `org.example.qurannav`.
4. **Link the app to your domain.** Bubblewrap prints a SHA-256 signing fingerprint. Put it and your package name into `.well-known/assetlinks.json` (replace the two `REPLACE_WITH_...` placeholders), then deploy. Without this step the app shows a browser bar.
5. **Test** the `.apk` on a real phone, in light and dark mode, in English, বাংলা and العربية, and offline after the first visit.
6. **Play Console:** create a developer account, upload the `.aab`, and complete the store listing, screenshots, content rating, data safety form, and a **privacy policy URL** (required).

### Data safety notes (for the form)

- The app stores bookmarks, the last position, language, theme and reciter in the browser's local storage on the phone. Nothing is sent to a server.
- Audio requests go to everyayah.com, so that site receives the phone's IP address and the ayah requested.
- The app has no accounts, ads or analytics.

## Production checklist

- [ ] Final HTTPS domain, and the `_headers` rules applied
- [ ] Hizb (16 pending) and rukuh data completed from a verified source
- [ ] Reciter folder names tested on everyayah.com, with a working audio file for each reciter
- [ ] `assetlinks.json` contains the real package name and fingerprint
- [ ] Privacy policy page live
- [ ] Tested on a low-end Android phone with a slow connection

## Audio and reciters (Qaris)

Open any surah and use the player above the verses:

- Choose a reciter from the list. Your choice is remembered.
- ▶ plays the selected ayah. ← / → move one ayah at a time.
- "Play whole surah" plays each ayah in order, and stops at the end of the surah.
- Click an ayah number to play that ayah directly.

Audio is streamed from `everyayah.com`, one MP3 per ayah (for example `https://everyayah.com/data/Alafasy_128kbps/002255.mp3`). The reciters are listed in `data/reciters.js`. To add a reciter, copy an entry, and set `folder` to the name of the folder on everyayah.com. Translate the names into `bn` and `ar` as well. If a reciter's folder is wrong, the player shows an error message, and you can correct the folder name there.

Audio needs an internet connection. The app itself works offline.

## Project structure

    index.html          entry page
    css/style.css       styling (dark theme, gold accent from the logo)
    js/i18n.js          interface text in English, Bangla and Arabic
    js/app.js           routing, views, search and language switching
    data/quran.js       Arabic Quran text: 114 surahs, 6,236 ayahs
    data/surahs.js      surah names (ar/en/bn), revelation type, start page, juz starts
    data/reciters.js    reciter (Qari) list and audio folders
    js/audio.js         audio player: per-ayah and whole-surah playback
    js/i18n-nav.js     navigation strings (en, bn, ar)
    js/i18n-pwa.js     toggle, install, offline and update strings
    js/pwa.js          service worker, install prompt, offline indicator
    sw.js              service worker (offline cache)
    manifest.webmanifest  app manifest (install, icons, shortcuts)
    _headers           hosting security and cache headers
    .well-known/assetlinks.json  Android app link (fill in before publishing)
    data/hizb.js        hizb starts (44 of 60 verified)
    data/rukuh.js       rukuh starts (to be added)
    data/sajdah.js      the 15 sajdah verses
    data/topics.js      topic index
    pages/              604 Mushaf page images (page001.png … page604.png)
    assets/             logo and favicon

## Data notes

- Quran text: 6,236 ayahs; per-surah counts follow the standard Kufic count and were verified against the source.
- Page-to-surah mapping follows the standard Madani Mushaf page layout. Please check a few boundaries against your own printed Mushaf if you publish it.
- Verse translations are **not** included. To add one, create a file such as `data/translation_bn.js` with a licensed translation (for example from Tanzil.net, which publishes its translations under a clear license) and render it beside each ayah. Check the license terms before you publish.

## Language

Use the language buttons in the header. The choice is remembered in the browser. The Arabic interface switches to right-to-left layout.

---

## কুরআন নেভিগেশন (বাংলা)

সূরা, পারা, পৃষ্ঠা এবং আয়াত অনুযায়ী কুরআন খোঁজার একটি সহজ ওয়েবসাইট। সরাসরি `index.html` খুললেই চলবে; কোনো ইনস্টলেশন বা সার্ভার লাগে না।

- **সূরা**: ১১৪টি সূরা, আরবি, ইংরেজি ও বাংলা নামসহ। "পড়া চালিয়ে যান" বোতামে সর্বশেষ জায়গায় ফিরে যাওয়া যায়।
- **পারা**: ৩০ পারা; প্রতিটি পারার শুরুর আয়াতে সরাসরি যাওয়া যায়।
- **পৃষ্ঠা**: ৬০৪ পৃষ্ঠার মাদানী মুসহাফ। ← → তীর কী বা বোতাম দিয়ে পৃষ্ঠা বদলানো যায়।
- **অনুসন্ধান**: সূরার নাম, নম্বর, `২:২৫৫` এর মতো রেফারেন্স, অথবা আরবি শব্দ।

অনুবাদ এখনও যুক্ত করা হয়নি; `data/` ফোল্ডারে লাইসেন্সপ্রাপ্ত অনুবাদ যোগ করা যাবে।

---

## ملاحة القرآن (العربية)

موقع ثابت للتصفح في القرآن الكريم حسب السورة والجزء والصفحة والآية، ويعمل دون اتصال بالإنترنت بعد تحميله. افتح الملف `index.html` مباشرة.

- **السور**: ١١٤ سورة بالأسماء العربية والإنجليزية والبنغالية، مع عدد الآيات وتصنيف مكية أو مدنية.
- **الأجزاء**: ٣٠ جزءاً، ينتقل كل منها إلى أول آية فيه.
- **الصفحات**: ٦٠٤ صفحة من المصحف المدني، مع بيان السورة التي تبدأ في كل صفحة.
- **البحث**: اسم السورة أو رقمها، أو مرجع مثل `2:255`، أو كلمات عربية.

لم تُضَف الترجمة بعد، ويمكن إضافتها من ملف ترجمة مرخّص في مجلد `data/`.

## Hifz tracker (#/hifz)

Records sabaq (new lesson, in Mushaf pages), schedules dohor reviews at 1, 3, 7, 14 and 30 days, rotates manzil over memorized pages, and shows progress and a pace calculator. Many mistakes in a review restart its cycle. All data stays on the device; use "Export backup" to keep a copy. The logic is in `js/hifz-core.js` and is covered by `tests/hifz-core.test.js`.

## Tajweed and Manzumah (#/tajweed, #/manzumah)

The ayah scanner marks noon sakinah, tanween, meem sakinah and qalqalah in the Quran text and names the rule. Detection is in `js/tajweed-core.js` and is covered by `tests/tajweed-core.test.js`. Lesson text in `data/tajweed-lessons.js` is marked "teacher review pending" until a qualified teacher approves it. The Manzumah screen is ready, but the verse text in `data/manzumah.js` must be added only from a verified source.
