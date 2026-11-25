# UQNS + কুরআন রিডার — প্রোডাকশন সেটআপ

**লাইভ ঠিকানা:** https://mj-ahmad.github.io/
**রিডার:** https://mj-ahmad.github.io/quran-reader/
**মুসহাফ ভিউয়ার:** https://mj-ahmad.github.io/mushaf.html

এই প্রজেক্টে দুটি অংশ আছে:

| অংশ | কোথায় | কী |
|---|---|---|
| UQNS হোম পেজ | রুট (`index.html`) | স্প্ল্যাশ, হোম পেজ, শেয়ার, অ্যাপ ইনস্টল |
| কুরআন রিডার | `/quran-reader/` (সোর্স: `quran-reader-src/`) | সূরা, পারা, হিযব, পৃষ্ঠা, অনুবাদ, তিলাওয়াত, সার্চ |

হোম পেজের সব "কুরআন পড়ুন / Read / পড়ুন" বোতাম এখন রিডারে যায়।

## ফোল্ডার কাঠামো

```
/                          (GitHub Pages-এর রুট)
├── index.html             হোম পেজ: স্প্ল্যাশ, সেকশন, শেয়ার ও ইনস্টল সেকশন
├── mushaf.html            মুসহাফ ভিউয়ার (পৃষ্ঠা ও পারা)
├── reader.html            সার্চ ফলাফলের আয়াতে যাওয়ার পুরনো রিডার (সার্চ লিংকের জন্য রাখা)
├── manifest.webmanifest   অ্যাপ ম্যানিফেস্ট (নাম, আইকন, রং, শর্টকাট)
├── sw.js                  সার্ভিস ওয়ার্কার: অ্যাপ ইনস্টল ও অফলাইন হোম শেল
├── sitemap.xml, robots.txt  সার্চ ইঞ্জিনের জন্য
├── .nojekyll              GitHub Pages-কে Jekyll প্রসেস করতে বারণ
├── .well-known/assetlinks.json   Android অ্যাপ যাচাই (TWA, নিচে দেখুন)
├── assets/
│   ├── css/, js/, logo/, fonts/   UI, স্ক্রিপ্ট ও ব্র্যান্ড ফাইল
│   ├── js/share-install.js        শেয়ার বোতাম, ইনস্টল বোতাম, সার্ভিস ওয়ার্কার নিবন্ধন
│   ├── icons/                     favicon, 192/512 আইকন, maskable, Apple touch আইকন
│   ├── share/og-image.png         শেয়ার কার্ড (1200×630)
│   └── mushaf/pages/*.webp        মুসহাফের ৬০৪টি পৃষ্ঠার ছবি
├── data/                  UQNS-এর মেটাডেটা ও কুরআন পাঠ/অনুবাদ
├── android/twa-manifest.json      Bubblewrap-এর কনফিগ (Play Store-এর জন্য)
├── quran-reader-src/      কুরআন রিডারের সোর্স (Next.js, স্ট্যাটিক এক্সপোর্ট)
├── .github/workflows/pages.yml    বিল্ড ও ডিপ্লয় (GitHub Actions)
├── docs/uqns-notes.md     UQNS-এর আগের ডিজাইন ও ডেটা নোট
└── tools/                 পৃষ্ঠার ছবি তৈরি ও অডিও যাচাইয়ের স্ক্রিপ্ট
```

## ডিপ্লয় করা (GitHub Pages)

1. রিপোজিটরির নাম হতে হবে **`mj-ahmad.github.io`** (তাহলে ঠিকানা হবে `https://mj-ahmad.github.io/`)। এই ফোল্ডারের সব ফাইল `main` ব্রাঞ্চে পুশ করুন।
2. GitHub-এ **Settings → Pages → Build and deployment → Source: GitHub Actions** নির্বাচন করুন।
3. **Actions** ট্যাবে "Deploy to GitHub Pages" চলবে। এটি প্রথমে কুরআন রিডার বিল্ড করে (`npm run build`), তারপর দুটি অংশ একসঙ্গে সাজিয়ে ডিপ্লয় করে।
4. সফল হলে দুটি ঠিকানা খুলুন: রুট ও `/quran-reader/`।

স্থানীয়ভাবে:

```bash
# UQNS হোম পেজ: যেকোনো স্ট্যাটিক সার্ভার
python3 -m http.server 8080            # http://localhost:8080

# কুরআন রিডার (ডেভেলপমেন্ট)
cd quran-reader-src
npm install
npm run dev                            # http://localhost:3000/quran-reader/
npm run build                          # স্ট্যাটিক আউটপুট: quran-reader-src/out
```

> লোকাল রিডারের জন্য `/quran-reader/` পাথ দিয়ে খুলুন। ডাবল-ক্লিকে (`file://`) রিডার কাজ করবে না; একটি সার্ভার দরকার।

## শেয়ার সিস্টেম

- **Open Graph ও Twitter কার্ড:** হোম পেজে `og:title`, `og:description`, `og:url`, `og:image` (1200×630), `twitter:card` সেট করা আছে। WhatsApp, Facebook, Telegram, X, LinkedIn ও iMessage-এ লিংক দিলে লোগো, হেডিং ও বর্ণনা দেখায়।
- **ক্যানোনিক ঠিকানা:** `https://mj-ahmad.github.io/` (`<link rel="canonical">`, sitemap ও JSON-LD-তেও একই)।
- **শেয়ার বোতাম:** হোম পেজের নিচে "UQNS শেয়ার করুন" সেকশনে Share (ডিভাইসের শেয়ার মেনু, শুধু সমর্থিত ডিভাইসে), লিংক কপি, WhatsApp, Telegram, Facebook, X ও ইমেইল। ভাষা বদলালে এই বোতামের লেখাও বদলায়।
- **প্রিভিউ যাচাই:** https://developers.facebook.com/tools/debug/ , https://www.opengraph.xyz/ , X-এর Card Validator দিয়ে `https://mj-ahmad.github.io/` পরীক্ষা করুন। আগে পরিবর্তন হলে Facebook-এর Debugger-এ "Scrape Again" চাপুন, কারণ সেখানে পুরনো ক্যাশ থাকে।
- **নতুন শেয়ার কার্ড:** `assets/share/og-image.png` বদলান (1200×630, PNG বা JPG)। ফাইলের নাম একই রাখুন।

## অ্যান্ড্রয়েড অ্যাপ

### ১. এখনই: Chrome থেকে ইনস্টল (PWA)

Android-এর Chrome-এ `https://mj-ahmad.github.io/` খুলুন। হোম পেজের "আপনার ফোনে UQNS নিন" সেকশনে **Install Android app** বোতাম আসবে (অথবা Chrome মেনু → Install app)। ইনস্টল হলে হোম স্ক্রিনে আইকন আসবে এবং অ্যাপ ফুল-স্ক্রিনে খুলবে। কুরআন রিডারও এই অ্যাপের ভেতরে চলে।

iPhone/iPad-এ: Safari → Share → Add to Home Screen।

### ২. Play Store-এর জন্য APK/AAB (Trusted Web Activity)

প্রজেক্টে `android/twa-manifest.json` প্রস্তুত আছে (প্যাকেজ নাম `io.github.mjahmad.uqns`; চাইলে বদলান)।

```bash
npm i -g @bubblewrap/cli
mkdir uqns-android && cd uqns-android
bubblewrap init --manifest https://mj-ahmad.github.io/manifest.webmanifest
# android/twa-manifest.json-এর মান এখানে বসাতে পারেন, অথবা প্রশ্নের উত্তর দিন
bubblewrap build                       # app-release-signed.apk ও .aab তৈরি করবে
```

Bubblewrap প্রথমবার একটি সাইনিং কী (keystore) তৈরি করতে বলবে। **কী-ফাইল ও পাসওয়ার্ড নিরাপদে রাখুন**; হারালে পরের আপডেট দেওয়া যাবে না।

তারপর সাইনিং কীর SHA-256 বের করুন:

```bash
keytool -list -v -keystore android.keystore -alias uqns | grep SHA256
```

এই ফিঙ্গারপ্রিন্ট `.well-known/assetlinks.json`-এ `REPLACE_WITH_YOUR_SIGNING_KEY_SHA256_FINGERPRINT`-এর জায়গায় বসান, তারপর আবার পুশ করুন। এতে অ্যাপের ভেতরে URL বার দেখাবে না। (Google Play Console-এ আপলোড করার আগে "App signing" থেকে ফিঙ্গারপ্রিন্টটি Play-এর কী-র সঙ্গে মিলিয়ে নিন।)

## পরিবর্তনের সারসংক্ষেপ

**UQNS হোম পেজ**
- হোম পেজের ৬টি "কুরআন পড়ুন/Read" লিংক (নেভিগেশন ও কল-টু-অ্যাকশন বোতাম) পুরনো `reader.html`-এর বদলে `quran-reader/`-এ যায়।
- হেড: SEO বর্ণনা, canonical, Open Graph, Twitter কার্ড, আইকন, manifest, Apple ওয়েব-অ্যাপ ট্যাগ, JSON-LD।
- নিচে নতুন "অ্যাপ ইনস্টল ও শেয়ার" সেকশন।
- স্প্ল্যাশ, হোম পেজের লেখা, ডিজাইন ও ভাষা-টগল অপরিবর্তিত।

**কুরআন রিডার (স্ট্যাটিক হোস্টিংয়ের জন্য)**
- `output: "export"`, `basePath: /quran-reader`, `trailingSlash: true`। GitHub Pages সার্ভার চলে না, তাই সবকিছু আগে থেকে তৈরি HTML।
- `/api/search` সার্ভার রুট সরানো হয়েছে। আরবি সার্চ এখন ব্রাউজারে হয় (প্রথম সার্চে সূচি লোড হয়)।
- সূরা, পারা ও পৃষ্ঠার পেজ আগে থেকে তৈরি হয় (`generateStaticParams`: ১১৪ সূরা, ৩০ পারা, ৬০৪ পৃষ্ঠা)।
- `?tr=` (অনুবাদ), `?print=` (মুসহাফ ধরন) এখন ব্রাউজারে পড়া হয়, তাই সেগুলো বদলালে ঠিকঠাক কাজ করে।
- পুরনো `manifest` ও `og.png` সরানো হয়েছে; অ্যাপ-ম্যানিফেস্ট এখন রুটের একটিই।

## নিরাপত্তা ও গুণমান

- সার্ভার কোড ছাড়া সবকিছু স্ট্যাটিক, তাই হ্যাকের মতো সার্ভার-পৃষ্ঠ নেই।
- সার্ভিস ওয়ার্কার শুধু নিজের সাইটের অ্যাসেট ক্যাশ করে, তিলাওয়াত অডিও (everyayah.com) ও `/quran-reader/`-এর ট্রাফিক ধরে না।
- কোনো API কী, সিক্রেট বা ব্যক্তিগত তথ্য কোডে নেই।
- ক্যাশ আপডেট: `sw.js`-এর `VERSION` বদলালে ভিজিটররা নতুন ফাইল পাবেন।

## যা আমি এই পরিবেশে যাচাই করতে পারিনি (প্রকাশের আগে করুন)

- **Next.js বিল্ড:** এখানে npm ইন্টারনেট ছাড়া চলে না, তাই `npm run build` চালানো হয়নি। GitHub Actions-এ প্রথম রানে বিল্ড হবে। কোনো TypeScript ত্রুটি হলে Actions লগে দেখাবে। প্রথমবার `quran-reader-src/` ফোল্ডারে `npm install` চালিয়ে `npm run build` একবার নিজের মেশিনে চালিয়ে নেওয়া ভালো।
- **তিলাওয়াত অডিও:** অডিওর ফোল্ডার নাম আসল সার্ভারের সঙ্গে মিলে কি না, তা ইন্টারনেট-সংযুক্ত মেশিনে `python3 quran-reader-src/tools/check_audio.py` (অথবা `tools/check_audio.py`) দিয়ে যাচাই করুন।
- **কুরআনিক উদ্ধৃতি ও অনুবাদ:** প্রকাশের আগে একজন আলেম দিয়ে মিলিয়ে নিন (আগের `docs/uqns-notes.md`-তেও একই পরামর্শ)। অনুবাদের লাইসেন্স শর্তও নিশ্চিত করুন।
- **প্রকৃত ডিভাইসে পরীক্ষা:** Android Chrome-এ ইনস্টল বোতাম, শেয়ার, মুসহাফ স্ক্রল, এবং অনুবাদ পরিবর্তন।

## জানা সীমাবদ্ধতা

- কুরআন রিডার অফলাইনে পুরোপুরি চলে না: প্রথমবার দেখা পৃষ্ঠাগুলো ব্রাউজার ক্যাশে থাকে, কিন্তু রিডারের পৃষ্ঠা ও অডিও সার্ভিস ওয়ার্কার ক্যাশ করে না। হোম পেজ ও মুসহাফ ভিউয়ার অফলাইনে খোলা যায়।
- UQNS-এর সার্চ ফলাফল এখনো পুরনো `reader.html`-এর আয়াত-পৃষ্ঠায় যায় (ডিপ লিংকের কারণে রাখা হয়েছে)। ভবিষ্যতে এগুলোকেও কুরআন রিডারের `/surah/N/#ayah-N`-এ নিয়ে যাওয়া যাবে।
- বাংলা সূরার নাম এখনো কুরআন রিডারের ডেটায় আছে, UQNS-এর সূরা নামগুলো ইংরেজি ট্রান্সলিটারেশনে।

## মোবাইলের নিচের বার (bottom navigation)

ফোন ও ছোট ট্যাবলেটে (১০২৪px পর্যন্ত) প্রতিটি পেজের নিচে পাঁচটি আইকন থাকে: **Home · Read the Qur'an · Search the Qur'an · Explore Knowledge Graph · Menu**। ফাইল: `assets/js/bottom-nav.js` (নিজের CSS সহ, আলাদা স্টাইল ফাইল লাগে না)।

- হোম পেজে Search ও Graph আইকন সংশ্লিষ্ট সেকশনে স্ক্রল করে (Search-এ সার্চ বক্স ফোকাস হয়); স্ক্রল করলে বর্তমান সেকশনের আইকন নিজে জ্বলে ওঠে।
- Menu আইকনে চাপলে সাইটের সব সেকশন ও মুসহাফের লিংক উঠে আসে। মোবাইলে হেডারের মূল মেনু লুকানো থাকে, তাই এটিই মূল পথ।
- ভাষা (EN/BN/AR), থিম ও RTL নিজে মেনে চলে। লেবেল বদলাতে ফাইলের শুরুর `T` অংশ এবং লিংক বদলাতে `LINKS` সম্পাদনা করুন।
- ফাইল বদলালে `sw.js`-এর `VERSION` সংখ্যা বাড়ান, নইলে ফোনে পুরনো সংস্করণ থাকবে।
