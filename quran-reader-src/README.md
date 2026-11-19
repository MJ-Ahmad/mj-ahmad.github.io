# কুরআন রিডার · Quran Reader

Next.js 15 App Router. Mushaf rendering uses the vendored copy of quran-madina-html in `public/qmh/`.
Languages: Bangla (default), English, Arabic. Switch in the header or on the Settings page.

## Run
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

## Pages
- `/` home: go-to box (page number, `2:255` or `২:২৫৫`, or a word → search), continue reading with progress,
  verse of the day (changes daily), totals, bookmarks, quick links, popular surahs, and all 114 surahs.
- `/reader` opens the last-read Mushaf page (or page 1). `/reader/[page]?print=<layout>` is the Mushaf reader:
  bookmark ☆/★, play page, reciter, print layout. Turn pages with ‹ ›, arrow keys, or a horizontal swipe.
  The reader is full-screen (no header or tabs).
- `/index` surah, juz, manzil, hizb quarter, ruku, sajda and page index.
- `/surah/[id]` surah text (Uthmani), per-ayah play, "play whole surah", current ayah highlight,
  translations with `?tr=bn,en,muyassar,jalalayn` (default `bn`, `?tr=none` to turn off), text size A−/A+, prev/next surah.
- `/juz/[id]` opens the first page of that juz.
- `/search` Arabic text search, surah names, and `surah:ayah` / page jumps.
- `/settings` language, theme (auto / light / dark), reciter and recitation style.
- `/about` credits.

Preferences, bookmarks, last-read page and the chosen reciter are kept in this browser (`localStorage`).

## Content
Generated from `source/vendor-content/` by `node scripts/build-content.mjs`:
`data/uthmani.json`, `data/reciters.json`, `public/data/translations/{bn,en,muyassar,jalalayn}.json`.
Other build steps: `python3 scripts/build-data.py` (metadata and `data/verses.json`) and
`python3 scripts/import-translation.py <file> <lang>` for another Tanzil translation.

## Audio
Verse-by-verse MP3 from everyayah.com (`https://everyayah.com/data/<folder>/<sss><aaa>.mp3`). 24 reciters in `data/reciters.json`.
Check the reciter folders before a release with `python3 tools/check_audio.py` (needs network).

## Structure (new in this version)
- `lib/dict.ts` strings for en / bn / ar (`bnDict` and `arDict` must have the same keys as `en`; enforced by the type).
- `lib/i18n.ts` language and theme store, `useT()`, localised digits and surah titles.
- `lib/bookmarks.ts`, `lib/lastread.ts` client stores (localStorage).
- `lib/jump.ts` go-to box parser. `lib/search.ts` local surah-name matching. `lib/daily.ts` verse of the day.
- `components/Shell.tsx` chrome (header, bottom tabs) and immersive reader; `Header.tsx`, `MobileTabs.tsx`, `PrefControls.tsx`.

## Credits
Quran text and metadata: (C) 2017-2026 MJ QN Project, CC BY 3.0, https://mj-ahmad.github.io/qn/. The Quran text is not modified.
Translations: Muhiuddin Khan (bn), Yusuf Ali (en), Muyassar and Jalalayn (ar), via MJ QN (see each file's `credit`).
Audio: everyayah.com. Mushaf rendering: quran-madina-html (Waqf GPL 2.0).

## Static design (GitHub Pages)

এই অ্যাপ সম্পূর্ণ স্ট্যাটিক। কোনো সার্ভার-রেন্ডারিং, `/api` রুট বা রিকোয়েস্ট-সময়ের কোড নেই।

- ডাইনামিক রুট (`/surah/[id]`, `/juz/[id]`, `/reader/[page]`) বিল্ডে তৈরি হয়। `generateStaticParams` দিয়ে সব সূরা (১১৪), পারা (৩০) ও পৃষ্ঠা (৬০৪) তালিকাভুক্ত, আর `dynamicParams = false` তালিকার বাইরের যেকোনো মান 404 দেয়।
- যা রিকোয়েস্ট-ভিত্তিক বা ব্রাউজার-ভিত্তিক (`?tr=`, `?print=`, `?q=`, লোকাল সেটিং, বুকমার্ক, আজকের আয়াত), তা ক্লায়েন্টে পড়া হয় `useEffect`-এর ভেতরে।
- `npm run build` তৈরি করে `out/` এবং পরে `scripts/check-static-output.mjs` দিয়ে নিশ্চিত করে সব পেজ আছে। কোনো পেজ না থাকলে বিল্ড ব্যর্থ হয়।
- `next start` এখানে কাজ করে না। লোকালে পরীক্ষা করতে `npm run dev`, আর প্রোডাকশন-সদৃশ পরীক্ষায় `out/` ফোল্ডারটি একটি স্ট্যাটিক সার্ভারে `/quran-reader/` পাথে দিন।
