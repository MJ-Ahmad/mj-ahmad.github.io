"use client";

import { LANGS, LANG_LABEL, THEMES, setPrefs, usePrefs, useT, type Lang, type Theme } from "@/lib/i18n";

const THEME_GLYPH: Record<Theme, string> = { auto: "◐", light: "☀", dark: "☾" };

/** Bn / En / Ar segmented switch. */
export function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang } = usePrefs();
  const { t } = useT();
  return (
    <div className={compact ? "seg compact" : "seg"} role="group" aria-label={t("lang")}>
      {LANGS.map((l: Lang) => (
        <button key={l} type="button" className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => setPrefs({ lang: l })}>
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

/** Auto / Light / Dark. Used as a cycling button in the header and a segmented control on Settings. */
export function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  const { theme } = usePrefs();
  const { t } = useT();
  if (compact) {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    return (
      <button type="button" className="icon-btn" aria-label={`${t("theme")}: ${t(`theme.${theme}`)}`} title={`${t("theme")}: ${t(`theme.${theme}`)}`} onClick={() => setPrefs({ theme: next })}>
        <span aria-hidden="true">{THEME_GLYPH[theme]}</span>
      </button>
    );
  }
  return (
    <div className="seg" role="group" aria-label={t("theme")}>
      {THEMES.map((th) => (
        <button key={th} type="button" className={theme === th ? "on" : ""} aria-pressed={theme === th} onClick={() => setPrefs({ theme: th })}>
          {THEME_GLYPH[th]} {t(`theme.${th}`)}
        </button>
      ))}
    </div>
  );
}
