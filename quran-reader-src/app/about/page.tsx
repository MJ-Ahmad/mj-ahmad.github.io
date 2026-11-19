import { TRANSLATIONS } from "@/lib/translation-ids";

export default function AboutPage() {
  return (
    <main className="page">
      <h1>সম্পর্কে</h1>
      <p>কুরআন রিডার একটি মুসহাফ রিডার: সূচি, সূরা ভিত্তিক পাঠ, অনুবাদ ও তাফসীর, তিলাওয়াত এবং আরবি অনুসন্ধান।</p>

      <h2>তিলাওয়াত</h2>
      <p>
        তিলাওয়াতের অডিও <a href="https://everyayah.com" target="_blank" rel="noopener noreferrer">everyayah.com</a>
        থেকে আয়াত-ভিত্তিক MP3 হিসেবে সরাসরি আপনার ব্রাউজারে চলে। অডিও চালানোর সময় ওই সাইটে অনুরোধ যায়।
        রিসিটার ও মুরাত্তাল/মুজাওয়াদ ধরন ব্রাউজারে সংরক্ষিত থাকে।
      </p>

      <h2>অনুবাদ ও তাফসীর</h2>
      <ul>
        {(Object.keys(TRANSLATIONS) as (keyof typeof TRANSLATIONS)[]).map((id) => (
          <li key={id}>{TRANSLATIONS[id].label}</li>
        ))}
      </ul>
      <p>বিস্তারিত স্বত্ব-বিবরণ প্রতিটি অনুবাদ ফাইলের <code>credit</code> ক্ষেত্রে রয়েছে।</p>

      <h2>তথ্য ও স্বত্ব</h2>
      <ul>
        <li>কুরআনের পাঠ ও মেটাডেটা: (C) 2017-2026 MJ QN Project, CC BY 3.0, https://mj-ahmad.github.io/qn/। কুরআনের পাঠ পরিবর্তন করা হয়নি।</li>
        <li>মুসহাফ রেন্ডারিং: quran-madina-html (Waqf GPL 2.0), <code>public/qmh</code>-এ সংরক্ষিত।</li>
        <li>অডিও: everyayah.com। রিসিটারের নাম বাংলা প্রতিবর্ণীকরণ; পর্যালোচনা সাপেক্ষ।</li>
      </ul>
    </main>
  );
}
