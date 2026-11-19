/** Translation ids and labels. No Node imports here, so client components can use it. */
export const TRANSLATIONS = {
  bn: { label: "বাংলা" },
  en: { label: "English" },
  muyassar: { label: "আরবি · মুয়াসসার" },
  jalalayn: { label: "আরবি · জালালাইন" },
} as const;

export type TranslationId = keyof typeof TRANSLATIONS;

/** No `tr` parameter means the default (Bangla). `none` (or empty) turns all of them off. */
export function translationsFromParam(value: string | undefined): TranslationId[] {
  if (value === undefined) return ["bn"];
  if (value === "" || value === "none") return [];
  const out: TranslationId[] = [];
  for (const part of value.split(",")) {
    if (part in TRANSLATIONS && !out.includes(part as TranslationId)) out.push(part as TranslationId);
  }
  return out;
}
