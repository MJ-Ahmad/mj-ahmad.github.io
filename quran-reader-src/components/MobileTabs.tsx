"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { isActive } from "@/lib/nav";

const TABS = [["/", "nav.home"], ["/reader", "nav.mushaf"], ["/sections", "nav.index"], ["/search", "nav.search"], ["/settings", "nav.settings"]] as const;

/** Bottom tab bar for phones. Hidden on wider screens (CSS). */
export default function MobileTabs() {
  const { t } = useT();
  const path = usePathname();
  return (
    <nav className="tabs-bottom" aria-label="Tabs">
      {TABS.map(([h, k]) => (
        <Link key={h} href={h} className={isActive(path, h) ? "on" : ""} aria-current={isActive(path, h) ? "page" : undefined}>
          <span>{t(k)}</span>
        </Link>
      ))}
    </nav>
  );
}
