/* Strings for the language/theme toggles, install, offline and update messages. */
(function () {
  var P = {
    en: { langLabel: "Language: English", themeAuto: "Theme: system", themeLight: "Theme: light", themeDark: "Theme: dark",
      installApp: "Install", installText: "Install Quran Navigation on your home screen for offline use.",
      offlineNow: "You are offline. Downloaded pages and text work; audio needs internet.",
      updateReady: "A new version is ready.", reload: "Reload", dismiss: "Later" },
    bn: { langLabel: "ভাষা: বাংলা", themeAuto: "থিম: সিস্টেম", themeLight: "থিম: হালকা", themeDark: "থিম: গাঢ়",
      installApp: "ইনস্টল", installText: "অফলাইনে ব্যবহারের জন্য হোম স্ক্রিনে কুরআন নেভিগেশন যুক্ত করুন।",
      offlineNow: "আপনি অফলাইনে আছেন। ডাউনলোড করা পৃষ্ঠা ও লেখা দেখা যাবে; অডিওর জন্য ইন্টারনেট লাগবে।",
      updateReady: "নতুন সংস্করণ প্রস্তুত।", reload: "রিলোড", dismiss: "পরে" },
    ar: { langLabel: "اللغة: العربية", themeAuto: "المظهر: تلقائي", themeLight: "المظهر: فاتح", themeDark: "المظهر: داكن",
      installApp: "تثبيت", installText: "ثبّت ملاحة القرآن على شاشتك الرئيسية للاستخدام دون اتصال.",
      offlineNow: "أنت غير متصل. الصفحات والنصوص المحمّلة متاحة؛ الصوت يحتاج إلى اتصال.",
      updateReady: "يتوفر إصدار جديد.", reload: "إعادة التحميل", dismiss: "لاحقاً" }
  };
  // Clearer player labels (override earlier generic labels).
  P.en.prevAyah = "Prev ayah"; P.en.nextAyah = "Next ayah";
  P.bn.prevAyah = "আগের আয়াত"; P.bn.nextAyah = "পরের আয়াত";
  P.ar.prevAyah = "الآية السابقة"; P.ar.nextAyah = "الآية التالية";
  ["en", "bn", "ar"].forEach(function (l) {
    Object.keys(P[l]).forEach(function (k) { window.I18N[l][k] = P[l][k]; });
  });
})();
