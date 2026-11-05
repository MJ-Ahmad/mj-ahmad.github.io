# Changelog

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
