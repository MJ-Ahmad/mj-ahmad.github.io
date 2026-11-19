"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import MobileTabs from "@/components/MobileTabs";
import AudioBar from "@/components/AudioBar";
import { hydratePrefs, usePrefs } from "@/lib/i18n";
import { hydrateBookmarks } from "@/lib/bookmarks";
import { hydrateLastRead } from "@/lib/lastread";

/**
 * Site chrome for normal pages. The Mushaf reader (/reader/...) is full-screen: no header or tabs.
 * Saved preferences, bookmarks and last-read page are restored here, after mount, so the server HTML always matches.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const immersive = path === "/reader" || path.startsWith("/reader/");
  usePrefs(); // re-render on language / theme change

  useEffect(() => {
    hydratePrefs();
    hydrateBookmarks();
    hydrateLastRead();
  }, []);

  return (
    <div className={immersive ? "shell immersive" : "shell"}>
      {!immersive && <Header />}
      <div className="content">{children}</div>
      {!immersive && <MobileTabs />}
      <AudioBar />
    </div>
  );
}
