/* Tajweed lessons. Status "pending" until a qualified teacher has reviewed the text.
   Examples are [surah, ayah] references; the app checks them against the Quran text. */
window.TAJWEED_LESSONS = [
{ id: "makharij", status: "pending", examples: [[1, 2], [2, 6]],
  title: { en: "Makharij: points of articulation", bn: "মাখারিজুল হুরুফ (উচ্চারণস্থান)", ar: "مخارج الحروف" },
  body: {
    en: "Every Arabic letter has a point of articulation (makhraj) in the throat, tongue, lips or nasal passage. Learn the makharij by practising each letter slowly with a teacher, before any rule of tajweed is applied.",
    bn: "প্রতিটি আরবি হরফের একটি উচ্চারণস্থান (মাখরাজ) আছে: কণ্ঠ, জিহ্বা, ঠোঁট বা নাসিকা। নিয়ম প্রয়োগের আগে শিক্ষকের কাছে ধীরে ধীরে প্রতিটি হরফের মাখরাজ অনুশীলন করুন।",
    ar: "لكل حرف عربي مخرج: من الحلق أو اللسان أو الشفتين أو الخيشوم. تعلّم المخارج بالممارسة البطيئة مع المعلم قبل تطبيق أحكام التجويد."
  } },
{ id: "sifat", status: "pending", examples: [[2, 2]],
  title: { en: "Sifat: characteristics of letters", bn: "সিফাতুল হুরুফ (হরফের গুণাবলি)", ar: "صفات الحروف" },
  body: {
    en: "Sifat describe how a letter is produced: whisper or voice (hams, jahr), strength or softness (shiddah, rakhawah), raising or lowering the tongue (isti'la, istifal), and closing or opening (itbaq, infitah).",
    bn: "সিফাত বর্ণনা করে হরফ কীভাবে উচ্চারিত হয়: চাপা বা সরব (হামস, জাহর), শক্ত বা নরম (শিদ্দাহ, রাখাওয়াহ), জিহ্বা উঁচু বা নিচু (ইসতিলা, ইসতিফাল), এবং মিলিত বা খোলা (ইতবাক, ইনফিতাহ)।",
    ar: "الصفات تصف كيفية نطق الحرف: الهمس والجهر، والشدة والرخاوة، والاستعلاء والاستفال، والإطباق والانفتاح."
  } },
{ id: "noon", status: "pending", examples: [[1, 7], [2, 4], [112, 4], [2, 2]],
  title: { en: "Noon sakinah and tanween: izhar, idgham, iqlab, ikhfa", bn: "নূন সাকিন ও তানভীন: ইযহার, ইদগাম, ইকলাব, ইখফা", ar: "النون الساكنة والتنوين: الإظهار والإدغام والإقلاب والإخفاء" },
  body: {
    en: "Noon sakinah (ن with sukun) and tanween (ً ٌ ٍ) follow four rules, decided by the letter that comes next. Izhar (clear): ء ه ع ح غ خ. Idgham (merging): ي و م ن with ghunna, ل ر without ghunna. Iqlab (change to meem): ب. Ikhfa (hidden): the other 15 letters.",
    bn: "নূন সাকিন (ن-এর উপর সুকুন) ও তানভীন (ً ٌ ٍ) চার ভাগে বিভক্ত, পরের হরফ দিয়ে নির্ধারিত হয়। ইযহার (স্পষ্ট): ء ه ع ح غ خ। ইদগাম (মিলিয়ে): ي و م ن গুন্নাহসহ, ل ر গুন্নাহ ছাড়া। ইকলাব (মীমে রূপান্তর): ب। ইখফা (গোপন): বাকি ১৫টি হরফ।",
    ar: "النون الساكنة والتنوين لها أربعة أحكام يحددها الحرف التالي. الإظهار: ء ه ع ح غ خ. الإدغام: ي و م ن بغنة، ل ر بلا غنة. الإقلاب: ب. الإخفاء: الحروف الخمسة عشر الباقية."
  } },
{ id: "mim", status: "pending", examples: [[1, 7]],
  title: { en: "Meem sakinah: idgham, ikhfa, izhar", bn: "মীম সাকিন: ইদগাম, ইখফা, ইযহার", ar: "الميم الساكنة" },
  body: {
    en: "A meem with sukun is followed by one of three rules. Before another meem: idgham shafawi (merge with ghunna). Before ba: ikhfa shafawi (hidden with ghunna). Before any other letter: izhar shafawi (clear).",
    bn: "সুকুনযুক্ত মীমের তিনটি নিয়ম আছে। পরে আরেকটি মীম হলে: ইদগামে শাফাবী (গুন্নাহসহ মিলিয়ে)। পরে বা (ب) হলে: ইখফায়ে শাফাবী (গুন্নাহসহ গোপন)। অন্য হরফ হলে: ইযহারে শাফাবী (স্পষ্ট)।",
    ar: "الميم الساكنة لها ثلاثة أحكام: إدغام شفوي قبل الميم، وإخفاء شفوي قبل الباء، وإظهار شفوي قبل غيرهما."
  } },
{ id: "qalqalah", status: "pending", examples: [[2, 3]],
  title: { en: "Qalqalah: the echoing letters", bn: "ক্বালক্বালাহ (প্রতিধ্বনি)", ar: "القلقلة" },
  body: {
    en: "The five letters ق ط ب ج د, when they carry sukun, are pronounced with a slight echo (qalqalah). The echo is strongest when they stop a word or verse.",
    bn: "ق ط ب ج د — এই পাঁচ হরফে সুকুন থাকলে হালকা প্রতিধ্বনি হয়, একে ক্বালক্বালাহ বলে। শব্দ বা আয়াত শেষে এটি সবচেয়ে স্পষ্ট।",
    ar: "الحروف الخمسة ق ط ب ج د إذا كانت ساكنة تُنطق بصدى خفيف يسمى القلقلة، ويكون أوضح عند الوقف."
  } },
{ id: "madd", status: "pending", examples: [[1, 1]],
  title: { en: "Madd: lengthening", bn: "মাদ্দ (দীর্ঘ করা)", ar: "المد" },
  body: {
    en: "Madd lengthens a vowel through the letters alif, waw and ya. Its types (asli, muttasil, munfasil, lazim, arid, lin) differ in length and cause. Learn each type with a teacher, because the length is taught by practice.",
    bn: "মাদ্দ আলিফ, ওয়াও ও ইয়া দিয়ে স্বরকে দীর্ঘ করে। এর প্রকারভেদ (আসলী, মুত্তাসিল, মুনফাসিল, লাযিম, আরিয, লীন) দৈর্ঘ্য ও কারণে আলাদা। দৈর্ঘ্য অনুশীলনে শেখা হয়, তাই শিক্ষকের কাছে শিখুন।",
    ar: "المد إطالة الحركة بحروف المد: الألف والواو والياء. وله أنواع (أصلي، متصل، منفصل، لازم، عارض، لين) تختلف في المقدار والسبب، ويُتعلم عملياً مع المعلم."
  } },
{ id: "waqf", status: "pending", examples: [[2, 5]],
  title: { en: "Waqf and ibtida: stopping and starting", bn: "ওয়াকফ ও ইবতিদা (থামা ও শুরু)", ar: "الوقف والابتداء" },
  body: {
    en: "Stopping (waqf) and starting (ibtida) must keep the meaning intact. Follow the stop signs printed in the Mushaf and your teacher's guidance; do not stop in the middle of a phrase that is linked in meaning.",
    bn: "থামা (ওয়াকফ) ও শুরু করা (ইবতিদা) অর্থ অক্ষুণ্ণ রেখে করতে হবে। মুসহাফে ছাপা ওয়াকফ চিহ্ন ও শিক্ষকের নির্দেশনা মানুন; অর্থে সংযুক্ত বাক্যের মাঝখানে থামবেন না।",
    ar: "الوقف والابتداء يحفظان المعنى. اتبع علامات الوقف المطبوعة في المصحف وإرشاد المعلم، ولا تقف في منتصف كلام متصل المعنى."
  } }
];
