/* Navigation menu strings (English, Bangla, Arabic), merged into I18N. */
(function () {
  var NAV = {
    en: {
      navTitle: "Navigation", menuOpen: "Menu", close: "Close", search: "Search",
      catPage: "Page", descPage: "Browse the 604 Mushaf pages",
      catSurah: "Surah", descSurah: "114 surahs with names and ayah counts",
      catJuz: "Juz", descJuz: "The 30 parts of the Quran",
      catHizb: "Hizb", descHizb: "60 divisions, two per juz",
      catRukuh: "Rukuh", descRukuh: "Rukuh divisions for recitation",
      catAyah: "Ayah", descAyah: "Go directly to any verse",
      catSajdah: "Sajdah", descSajdah: "The 15 verses of prostration",
      catTopic: "Topic", descTopic: "Verses grouped by theme",
      catBookmark: "Bookmark", descBookmark: "Your saved verses",
      pending: "Data pending", pendingCount: "{n} of 60 verified",
      rukuhPending: "Rukuh boundaries are not included in this release yet. Verified positions go in data/rukuh.js.",
      hizbNote: "Hizb boundaries marked 'Data pending' are still being verified. See README.",
      gotoAyah: "Go to ayah", chooseSurah: "Surah", ayahNum: "Ayah number",
      invalidRef: "This ayah does not exist. Check the surah and ayah numbers.",
      bookmarkAdd: "Bookmark this ayah", bookmarkRemove: "Remove bookmark",
      noBookmarks: "No bookmarks yet. Press the ☆ beside any ayah to save it.",
      clearAll: "Clear all", sajdahMark: "Sajdah", startsAt: "Starts at {s}:{a}",
      topicHeading: "Topics", back2: "All topics", items: "{n} total"
    },
    bn: {
      navTitle: "নেভিগেশন", menuOpen: "মেনু", close: "বন্ধ করুন", search: "অনুসন্ধান",
      catPage: "পৃষ্ঠা", descPage: "৬০৪ পৃষ্ঠার মুসহাফ দেখুন",
      catSurah: "সূরা", descSurah: "১১৪টি সূরা, নাম ও আয়াত সংখ্যাসহ",
      catJuz: "পারা", descJuz: "কুরআনের ৩০ পারা",
      catHizb: "হিযব", descHizb: "৬০টি হিযব, প্রতি পারায় দুটি",
      catRukuh: "রুকু", descRukuh: "তিলাওয়াতের জন্য রুকু বিভাগ",
      catAyah: "আয়াত", descAyah: "যেকোনো আয়াতে সরাসরি যান",
      catSajdah: "সাজদা", descSajdah: "সাজদার ১৫টি আয়াত",
      catTopic: "বিষয়", descTopic: "বিষয়ভিত্তিক আয়াতসমূহ",
      catBookmark: "বুকমার্ক", descBookmark: "আপনার সংরক্ষিত আয়াত",
      pending: "তথ্য যাচাই বাকি", pendingCount: "৬০টির মধ্যে {n}টি যাচাইকৃত",
      rukuhPending: "এই সংস্করণে রুকুর অবস্থান এখনও যুক্ত হয়নি। যাচাইকৃত অবস্থান data/rukuh.js ফাইলে যোগ করুন।",
      hizbNote: "'তথ্য যাচাই বাকি' চিহ্নিত হিযবগুলোর সীমানা এখনও যাচাই করা হচ্ছে। README দেখুন।",
      gotoAyah: "আয়াতে যান", chooseSurah: "সূরা", ayahNum: "আয়াত নম্বর",
      invalidRef: "এই আয়াতটি নেই। সূরা ও আয়াত নম্বর দেখুন।",
      bookmarkAdd: "এই আয়াত বুকমার্ক করুন", bookmarkRemove: "বুকমার্ক সরান",
      noBookmarks: "এখনও কোনো বুকমার্ক নেই। যেকোনো আয়াতের পাশে ☆ চাপুন।",
      clearAll: "সব মুছুন", sajdahMark: "সাজদা", startsAt: "শুরু: {s}:{a}",
      topicHeading: "বিষয়সমূহ", back2: "সব বিষয়", items: "{n}টি"
    },
    ar: {
      navTitle: "التنقل", menuOpen: "القائمة", close: "إغلاق", search: "بحث",
      catPage: "الصفحة", descPage: "تصفح صفحات المصحف الـ604",
      catSurah: "السورة", descSurah: "١١٤ سورة بأسمائها وعدد آياتها",
      catJuz: "الجزء", descJuz: "أجزاء القرآن الثلاثون",
      catHizb: "الحزب", descHizb: "٦٠ حزباً، حزبان في كل جزء",
      catRukuh: "الركوع", descRukuh: "أقسام الركوع للتلاوة",
      catAyah: "الآية", descAyah: "انتقل مباشرة إلى أي آية",
      catSajdah: "السجدة", descSajdah: "آيات السجدة الخمس عشرة",
      catTopic: "الموضوع", descTopic: "آيات مجمّعة حسب الموضوع",
      catBookmark: "الإشارات", descBookmark: "آياتك المحفوظة",
      pending: "البيانات قيد التحقق", pendingCount: "{n} من ٦٠ موثّقاً",
      rukuhPending: "لم تُضف مواضع الركوع في هذا الإصدار بعد. تُضاف المواضع الموثّقة في ملف data/rukuh.js.",
      hizbNote: "الأحزاب المعلَّم عليها «البيانات قيد التحقق» ما زالت قيد التوثيق. انظر ملف README.",
      gotoAyah: "انتقل إلى الآية", chooseSurah: "السورة", ayahNum: "رقم الآية",
      invalidRef: "هذه الآية غير موجودة. تحقق من رقم السورة والآية.",
      bookmarkAdd: "أضف هذه الآية إلى الإشارات", bookmarkRemove: "إزالة الإشارة",
      noBookmarks: "لا توجد إشارات بعد. اضغط ☆ بجانب أي آية لحفظها.",
      clearAll: "حذف الكل", sajdahMark: "سجدة", startsAt: "تبدأ من {s}:{a}",
      topicHeading: "الموضوعات", back2: "كل الموضوعات", items: "{n} عنصر"
    }
  };
  ["en", "bn", "ar"].forEach(function (l) {
    Object.keys(NAV[l]).forEach(function (k) { window.I18N[l][k] = NAV[l][k]; });
  });
})();
