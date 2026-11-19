/* UQNS — reciters (qaris) for the Mushaf audio.
   Each reciter has one or both styles:
     murattal — normal recitation (مرتل)        mujawwad — slow, melodic recitation (مجود)
   Audio is read per ayah from the base URL below:  <base><folder>/<sss><aaa>.mp3
   e.g. https://everyayah.com/data/Alafasy_128kbps/002255.mp3  (surah 2, ayah 255)

   Verify folder names before a release with:  python3 tools/check_audio.py
   name.bn values are transliterations for the Bengali interface and should be reviewed. */
window.UQNS_AUDIO_BASE = 'https://everyayah.com/data/';

window.UQNS_RECITERS = [
  { id: 'alafasy', name: { ar: 'مشاري راشد العفاسي', en: 'Mishary Rashid Alafasy', bn: 'মিশারি রাশিদ আলাফাসি' },
    murattal: 'Alafasy_128kbps' },
  { id: 'abdulbasit', name: { ar: 'عبد الباسط عبد الصمد', en: 'Abdul Basit Abdus Samad', bn: 'আবদুল বাসিত আবদুস সামাদ' },
    murattal: 'Abdul_Basit_Murattal_192kbps', mujawwad: 'Abdul_Basit_Mujawwad_128kbps' },
  { id: 'husary', name: { ar: 'محمود خليل الحصري', en: 'Mahmoud Khalil Al-Husary', bn: 'মাহমুদ খলিল আল-হুসারি' },
    murattal: 'Husary_128kbps', mujawwad: 'Husary_Mujawwad_128kbps' },
  { id: 'minshawy', name: { ar: 'محمد صديق المنشاوي', en: 'Mohamed Siddiq Al-Minshawi', bn: 'মুহাম্মদ সিদ্দীক আল-মিনশাবি' },
    murattal: 'Minshawy_Murattal_128kbps', mujawwad: 'Minshawy_Mujawwad_192kbps' },
  { id: 'sudais', name: { ar: 'عبد الرحمن السديس', en: 'Abdur-Rahman As-Sudais', bn: 'আবদুর রহমান আস-সুদাইস' },
    murattal: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 'shuraim', name: { ar: 'سعود الشريم', en: 'Saud Ash-Shuraim', bn: 'সাউদ আশ-শুরাইম' },
    murattal: 'Saood_ash-Shuraym_128kbps' },
  { id: 'muaiqly', name: { ar: 'ماهر المعيقلي', en: 'Maher Al-Muaiqly', bn: 'মাহের আল-মুয়াইকলি' },
    murattal: 'Maher_AlMuaiqly_128kbps' },
  { id: 'ghamdi', name: { ar: 'سعد الغامدي', en: 'Saad Al-Ghamdi', bn: 'সাদ আল-গামিদি' },
    murattal: 'Ghamadi_40kbps' },
  { id: 'shatri', name: { ar: 'أبو بكر الشاطري', en: 'Abu Bakr Ash-Shatri', bn: 'আবু বকর আশ-শাতরি' },
    murattal: 'Abu_Bakr_Ash-Shaatree_128kbps' },
  { id: 'rifai', name: { ar: 'هاني الرفاعي', en: 'Hani Ar-Rifai', bn: 'হানি আর-রিফায়ি' },
    murattal: 'Hani_Rifai_192kbps' },
  { id: 'ajmi', name: { ar: 'أحمد العجمي', en: 'Ahmed Al-Ajmi', bn: 'আহমাদ আল-আজমি' },
    murattal: 'Ahmed_ibn_Ali_al-Ajamy_128kbps' },
  { id: 'dosari', name: { ar: 'ياسر الدوسري', en: 'Yasser Ad-Dussary', bn: 'ইয়াসির আদ-দুসারি' },
    murattal: 'Yasser_Ad-Dussary_128kbps' },
  { id: 'qatami', name: { ar: 'ناصر القطامي', en: 'Nasser Al-Qatami', bn: 'নাসির আল-কাতামি' },
    murattal: 'Nasser_Alqatami_128kbps' },
  { id: 'basfar', name: { ar: 'عبد الله بصفر', en: 'Abdullah Basfar', bn: 'আবদুল্লাহ বাসফার' },
    murattal: 'Abdullah_Basfar_192kbps' },
  { id: 'jaber', name: { ar: 'علي جابر', en: 'Ali Jaber', bn: 'আলী জাবের' },
    murattal: 'Ali_Jaber_64kbps' },
  { id: 'ayyoub', name: { ar: 'محمد أيوب', en: 'Muhammad Ayyoub', bn: 'মুহাম্মদ আইয়ুব' },
    murattal: 'Muhammad_Ayyoub_128kbps' },
  { id: 'tablawi', name: { ar: 'محمد الطبلاوي', en: 'Mohammad Al-Tablawi', bn: 'মুহাম্মদ আত-তাবলাবি' },
    murattal: 'Mohammad_al_Tablaway_128kbps' },
  { id: 'sahl', name: { ar: 'سهل ياسين', en: 'Sahl Yassin', bn: 'সাহল ইয়াসিন' },
    murattal: 'Sahl_Yassin_128kbps' },
  { id: 'jibreel', name: { ar: 'محمد جبريل', en: 'Muhammad Jibreel', bn: 'মুহাম্মদ জিবরীল' },
    murattal: 'Muhammad_Jibreel_128kbps' },
  { id: 'budair', name: { ar: 'صلاح البدير', en: 'Salah Al-Budair', bn: 'সালাহ আল-বুদাইর' },
    murattal: 'Salah_Al_Budair_128kbps' },
  { id: 'matroud', name: { ar: 'عبد الله مطرود', en: 'Abdullah Matroud', bn: 'আবদুল্লাহ মাতরুদ' },
    murattal: 'Abdullah_Matroud_128kbps' },
  { id: 'hudhaify', name: { ar: 'علي الحذيفي', en: 'Ali Al-Hudhaify', bn: 'আলী আল-হুযাইফি' },
    murattal: 'Hudhaify_128kbps' },
  { id: 'abbad', name: { ar: 'فارس عباد', en: 'Fares Abbad', bn: 'ফারেস আব্বাদ' },
    murattal: 'Fares_Abbad_64kbps' },
  { id: 'bahli', name: { ar: 'عبد الرحمن الباهلي', en: 'Abdurrahman Al-Bahli', bn: 'আবদুর রহমান আল-বাহিলি' },
    murattal: 'Abdurrahman_Bahli_128kbps' }
];
