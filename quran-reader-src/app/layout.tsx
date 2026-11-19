import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";

const bengali = Noto_Sans_Bengali({ subsets: ["bengali", "latin"], weight: ["400", "600", "700"], variable: "--font-bn", display: "swap" });

const SITE = "https://mj-ahmad.github.io";
const TITLE = "কুরআন রিডার · Quran Reader · قارئ القرآن";
const DESC = "মুসহাফ, সূরা, পারা, রুকু, হিজব ও আয়াত পড়ার রিডার, তিলাওয়াত ও অনুসন্ধানসহ। Mushaf reader with audio and search.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s · Quran Reader" },
  description: DESC,
  applicationName: "UQNS Quran Reader",
  alternates: { canonical: "/quran-reader/" },
  icons: {
    icon: [{ url: "/quran-reader/icon-96.png", sizes: "96x96", type: "image/png" }],
    apple: [{ url: "/assets/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "UQNS",
    title: TITLE,
    description: DESC,
    url: "/quran-reader/",
    locale: "bn_BD",
    images: [{ url: "/assets/share/og-image.png", width: 1200, height: 630, alt: "UQNS" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/assets/share/og-image.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Applies the saved language, direction and theme before first paint, so nothing flashes.
const prefsInit = `(function(){try{var p=JSON.parse(localStorage.getItem('qr:prefs')||'{}');var e=document.documentElement;if(p.lang){e.lang=p.lang;e.dir=p.lang==='ar'?'rtl':'ltr';}if(p.theme==='light'||p.theme==='dark')e.dataset.theme=p.theme;}catch(x){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={bengali.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsInit }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
