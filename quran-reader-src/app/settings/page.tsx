"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { LangSwitch, ThemeSwitch } from "@/components/PrefControls";
import ReciterPicker from "@/components/ReciterPicker";

export default function SettingsPage() {
  const { t } = useT();
  return (
    <main className="page settings">
      <h1>{t("settings.title")}</h1>

      <section className="setting">
        <h2>{t("lang")}</h2>
        <LangSwitch />
      </section>

      <section className="setting">
        <h2>{t("theme")}</h2>
        <ThemeSwitch />
      </section>

      <section className="setting">
        <h2>{t("settings.reciter")}</h2>
        <ReciterPicker />
      </section>

      <p className="meta small">{t("settings.saved")}</p>
      <p><Link href="/about">{t("nav.about")} →</Link></p>
    </main>
  );
}
