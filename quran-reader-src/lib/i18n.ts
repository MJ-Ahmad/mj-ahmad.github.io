import { useSyncExternalStore } from "react";
import { bn as toBnDigits } from "@/lib/bn";
import { dicts, type Key } from "@/lib/dict";
import { SURAHS, surahBnName } from "@/lib/data";

export type { Key };
export type Lang = "bn" | "en" | "ar";
export type Theme = "auto" | "light" | "dark";
export const LANGS: Lang[] = ["bn", "en", "ar"];
export const THEMES: Theme[] = ["auto", "light", "dark"];
export const LANG_LABEL: Record<Lang, string> = { bn: "বাং", en: "EN", ar: "عربي" };

interface Prefs { lang: Lang; theme: Theme }
const KEY = "qr:prefs";
const DEFAULTS: Prefs = { lang: "bn", theme: "auto" };
let prefs: Prefs = DEFAULTS;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Puts the language and theme on <html>, so the page direction and colours follow the choice. */
function applyDom(p: Prefs) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.lang = p.lang;
  el.dir = p.lang === "ar" ? "rtl" : "ltr";
  if (p.theme === "auto") delete el.dataset.theme;
  else el.dataset.theme = p.theme;
}

export function setPrefs(patch: Partial<Prefs>) {
  prefs = { ...prefs, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* storage unavailable */ }
  applyDom(prefs);
  emit();
}

/** Restores saved preferences. Called once on the client, after mount (the server always renders the defaults). */
export function hydratePrefs() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<Prefs>;
      prefs = {
        lang: LANGS.includes(v.lang as Lang) ? (v.lang as Lang) : DEFAULTS.lang,
        theme: THEMES.includes(v.theme as Theme) ? (v.theme as Theme) : DEFAULTS.theme,
      };
      emit();
    }
  } catch { /* malformed storage: keep defaults */ }
  applyDom(prefs);
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, () => prefs, () => DEFAULTS);
}

/** Localised digits: Bangla digits in bn, Arabic-Indic digits in ar, plain in en. */
export function num(x: number | string, lang: Lang): string {
  const s = String(x);
  if (lang === "bn") return toBnDigits(s);
  if (lang === "ar") return s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
  return s;
}

/** Surah title in the UI language: Bangla name, Arabic name, or the English transliteration. */
export function surahTitle(id: number, lang: Lang): string {
  if (lang === "bn") return surahBnName(id);
  if (lang === "ar") return SURAHS[id - 1].name;
  return SURAHS[id - 1].tname;
}

export function useT() {
  const { lang } = usePrefs();
  const d = dicts[lang];
  return {
    lang,
    t: (k: Key): string => d[k],
    n: (x: number | string) => num(x, lang),
    title: (id: number) => surahTitle(id, lang),
  };
}

/** Hizb quarter fraction, e.g. "¼" written with the UI's digits: 1/4 */
export function hizbPart(part: number, lang: Lang): string {
  if (part === 0) return "";
  const frac: Record<number, [number, number]> = { 1: [1, 4], 2: [1, 2], 3: [3, 4] };
  const [a, b] = frac[part];
  return ` ${num(a, lang)}/${num(b, lang)}`;
}
