"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useT, type Key } from "@/lib/i18n";
import { LangSwitch, ThemeSwitch } from "@/components/PrefControls";
import { NAV, isActive } from "@/lib/nav";
import { BASE_PATH } from "@/lib/base";

export default function Header() {
  const { t } = useT();
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="container bar">
        <Link href="/" className="brand">
          <Image unoptimized src={`${BASE_PATH}/icon-96.png`} alt="" width={30} height={30} priority />
          <span>{t("brand")}</span>
        </Link>
        <nav className="nav-desktop" aria-label="Main">
          {NAV.slice(0, 5).map(([h, k]) => (
            <Link key={h} href={h} className={isActive(path, h) ? "on" : ""} aria-current={isActive(path, h) ? "page" : undefined}>{t(k)}</Link>
          ))}
        </nav>
        <span className="spacer" />
        <LangSwitch compact />
        <ThemeSwitch compact />
      </div>
    </header>
  );
}
