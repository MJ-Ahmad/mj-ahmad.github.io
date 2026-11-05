/* Reciters (Qaris). Audio comes from everyayah.com, one MP3 per ayah: <base><SSSAAA>.mp3
   If a folder name changes on the server, correct only the "folder" value here. */
window.RECITERS = [
  { id: "alafasy", folder: "Alafasy_128kbps",
    en: "Mishary Rashid Alafasy", bn: "মিশারি রাশিদ আলাফাসি", ar: "مشاري راشد العفاسي" },
  { id: "basit", folder: "Abdul_Basit_Murattal_192kbps",
    en: "Abdul Basit Abdus-Samad", bn: "আবদুল বাসিত আবদুস সামাদ", ar: "عبد الباسط عبد الصمد" },
  { id: "sudais", folder: "Abdurrahmaan_As-Sudais_192kbps",
    en: "Abdur-Rahman As-Sudais", bn: "আবদুর রহমান আস-সুদাইস", ar: "عبد الرحمن السديس" },
  { id: "ghamidi", folder: "Ghamadi_40kbps",
    en: "Saad Al-Ghamdi", bn: "সাদ আল-গামিদি", ar: "سعد الغامدي" },
  { id: "husary", folder: "Husary_128kbps",
    en: "Mahmoud Khalil Al-Husary", bn: "মাহমুদ খলিল আল-হুসারি", ar: "محمود خليل الحصري" },
  { id: "minshawi", folder: "Minshawy_Murattal_128kbps",
    en: "Muhammad Siddiq Al-Minshawi", bn: "মুহাম্মদ সিদ্দিক আল-মিনশাবি", ar: "محمد صديق المنشاوي" }
].map(function (r) {
  r.base = "https://everyayah.com/data/" + r.folder + "/";
  return r;
});
