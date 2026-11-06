/* Tajweed and Manzumah strings (English, Bangla, Arabic). */
(function () {
  var X = {
    en: { catTajweed: "Tajweed", descTajweed: "Rules, lessons and quiz", catManzumah: "Manzumah", descManzumah: "Ibn al-Jazari's Muqaddimah",
      tjIntro: "Lessons on the rules of recitation, an ayah scanner that marks each rule in the text, and a quiz.",
      tjLessons: "Lessons", tjExamples: "Examples", tjScanHint: "Open an example to see its rules marked in the verse.",
      tjPending: "Teacher review pending: this lesson text is not yet approved for study.", tjStatusPending: "Teacher review pending",
      tjScanBtn: "Scan verse", tjScanTitle: "Tajweed in {s}:{a}", tjLegend: "Rules in this verse", tjNoRules: "No noon/tanween or meem sakinah rules in this verse.",
      tjOpenAyah: "Open verse in reader", tjKeyNoon: "Noon / tanween", tjKeyMim: "Meem sakinah", tjKeyQal: "Qalqalah",
      tjQuiz: "Quiz", tjQuestion: "Which rule applies to the highlighted letter?", tjRef: "Verse {s}:{a}",
      tjScore: "Score: {r} / {n}", tjCorrect: "Correct.", tjWrong: "Not quite. The answer is: {g}.", tjNext: "Next question",
      ruleGroup_izhar: "Izhar (clear)", ruleGroup_idgham: "Idgham (merge)", ruleGroup_iqlab: "Iqlab (change to meem)", ruleGroup_ikhfa: "Ikhfa (hidden)",
      ruleIzhar: "Izhar (clear)", ruleIdghamGhunna: "Idgham with ghunna", ruleIdghamBila: "Idgham without ghunna", ruleIqlab: "Iqlab",
      ruleIkhfa: "Ikhfa (hidden)", ruleMimIdgham: "Idgham shafawi", ruleMimIkhfa: "Ikhfa shafawi", ruleMimIzhar: "Izhar shafawi", ruleQalqalah: "Qalqalah",
      mzPending: "The verse text of the Muqaddimah is not yet included.", mzPendingNote: "It is added only from a verified source, after a teacher has reviewed it.",
      mzProgress: "{d} of {n} lines memorized", mzHide: "Hide Arabic (recite from memory)", mzReveal: "Show Arabic", mzDone: "Memorized"
    },
    bn: { catTajweed: "তাজবীদ", descTajweed: "নিয়ম, পাঠ ও কুইজ", catManzumah: "মানজুমা", descManzumah: "ইবনুল জাযারী (রাহ.)-এর মুকাদ্দামা",
      tjIntro: "তিলাওয়াতের নিয়মের পাঠ, আয়াতে নিয়ম চিহ্নিতকারী স্ক্যানার, এবং কুইজ।",
      tjLessons: "পাঠসমূহ", tjExamples: "উদাহরণ", tjScanHint: "কোনো উদাহরণ খুললে আয়াতে নিয়ম চিহ্নিত দেখা যাবে।",
      tjPending: "শিক্ষক যাচাই বাকি: এই পাঠ এখনও অনুমোদিত নয়।", tjStatusPending: "শিক্ষক যাচাই বাকি",
      tjScanBtn: "আয়াত স্ক্যান করুন", tjScanTitle: "{s}:{a} আয়াতে তাজবীদ", tjLegend: "এই আয়াতের নিয়মসমূহ", tjNoRules: "এই আয়াতে নূন/তানভীন বা মীম সাকিনের নিয়ম নেই।",
      tjOpenAyah: "রিডারে আয়াত খুলুন", tjKeyNoon: "নূন / তানভীন", tjKeyMim: "মীম সাকিন", tjKeyQal: "ক্বালক্বালাহ",
      tjQuiz: "কুইজ", tjQuestion: "হাইলাইট করা হরফে কোন নিয়ম প্রযোজ্য?", tjRef: "আয়াত {s}:{a}",
      tjScore: "স্কোর: {r} / {n}", tjCorrect: "সঠিক।", tjWrong: "ঠিক হয়নি। উত্তর: {g}।", tjNext: "পরের প্রশ্ন",
      ruleGroup_izhar: "ইযহার (স্পষ্ট)", ruleGroup_idgham: "ইদগাম (মিলিয়ে)", ruleGroup_iqlab: "ইকলাব (মীমে রূপান্তর)", ruleGroup_ikhfa: "ইখফা (গোপন)",
      ruleIzhar: "ইযহার (স্পষ্ট)", ruleIdghamGhunna: "গুন্নাহসহ ইদগাম", ruleIdghamBila: "গুন্নাহ ছাড়া ইদগাম", ruleIqlab: "ইকলাব",
      ruleIkhfa: "ইখফা (গোপন)", ruleMimIdgham: "ইদগামে শাফাবী", ruleMimIkhfa: "ইখফায়ে শাফাবী", ruleMimIzhar: "ইযহারে শাফাবী", ruleQalqalah: "ক্বালক্বালাহ",
      mzPending: "মুকাদ্দামার পদ্যের মূল পাঠ এখনও যুক্ত হয়নি।", mzPendingNote: "যাচাইকৃত উৎস থেকে এবং শিক্ষকের অনুমোদনের পর যুক্ত হবে।",
      mzProgress: "{n}টির মধ্যে {d}টি লাইন মুখস্থ", mzHide: "আরবি লুকান (স্মৃতি থেকে পড়ুন)", mzReveal: "আরবি দেখান", mzDone: "মুখস্থ হয়েছে"
    },
    ar: { catTajweed: "التجويد", descTajweed: "الأحكام والدروس والاختبار", catManzumah: "المنظومة", descManzumah: "مقدمة ابن الجزري",
      tjIntro: "دروس في أحكام التلاوة، وماسح للآية يبيّن الأحكام، واختبار قصير.",
      tjLessons: "الدروس", tjExamples: "أمثلة", tjScanHint: "افتح مثالاً لترى أحكامه معلّمة في الآية.",
      tjPending: "بانتظار مراجعة المعلم: لم يُعتمد نص هذا الدرس بعد.", tjStatusPending: "بانتظار مراجعة المعلم",
      tjScanBtn: "امسح الآية", tjScanTitle: "أحكام التجويد في {s}:{a}", tjLegend: "أحكام هذه الآية", tjNoRules: "لا توجد أحكام النون الساكنة والتنوين أو الميم الساكنة في هذه الآية.",
      tjOpenAyah: "افتح الآية في القارئ", tjKeyNoon: "النون والتنوين", tjKeyMim: "الميم الساكنة", tjKeyQal: "القلقلة",
      tjQuiz: "اختبار", tjQuestion: "ما الحكم الذي ينطبق على الحرف المظلل؟", tjRef: "الآية {s}:{a}",
      tjScore: "النتيجة: {r} / {n}", tjCorrect: "إجابة صحيحة.", tjWrong: "ليست صحيحة. الجواب: {g}.", tjNext: "السؤال التالي",
      ruleGroup_izhar: "الإظهار", ruleGroup_idgham: "الإدغام", ruleGroup_iqlab: "الإقلاب", ruleGroup_ikhfa: "الإخفاء",
      ruleIzhar: "الإظهار", ruleIdghamGhunna: "الإدغام بغنة", ruleIdghamBila: "الإدغام بلا غنة", ruleIqlab: "الإقلاب",
      ruleIkhfa: "الإخفاء", ruleMimIdgham: "الإدغام الشفوي", ruleMimIkhfa: "الإخفاء الشفوي", ruleMimIzhar: "الإظهار الشفوي", ruleQalqalah: "القلقلة",
      mzPending: "لم يُضَف نص أبيات المقدمة بعد.", mzPendingNote: "يُضاف من مصدر موثّق بعد مراجعة المعلم.",
      mzProgress: "حُفظ {d} من {n} بيتاً", mzHide: "أخفِ العربية (سمّع من الحفظ)", mzReveal: "أظهر العربية", mzDone: "محفوظ"
    }
  };
  ["en", "bn", "ar"].forEach(function (l) {
    Object.keys(X[l]).forEach(function (k) { window.I18N[l][k] = X[l][k]; });
  });
})();
