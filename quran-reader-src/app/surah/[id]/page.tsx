import { notFound } from "next/navigation";
import { SURAHS, surahById } from "@/lib/data";
import { UTHMANI, pageOf, showsBasmala } from "@/lib/quran";
import { TRANSLATIONS, type TranslationId } from "@/lib/translation-ids";
import { loadTranslation, type Translation } from "@/lib/translations";
import SurahClient from "@/components/SurahClient";
import type { Row } from "@/components/SurahView";

// Static site: only the routes listed here exist; anything else is a 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return SURAHS.map((s) => ({ id: String(s.id) }));
}

/** Server: builds every translation into the page. The client chooses which ones to show (?tr=). */
export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const n = Number((await params).id);
  const s = Number.isInteger(n) ? surahById(n) : null;
  if (!s) notFound();

  const ids = Object.keys(TRANSLATIONS) as TranslationId[];
  const loaded: Partial<Record<TranslationId, Translation>> = {};
  for (const id of ids) {
    const t = await loadTranslation(id);
    if (t) loaded[id] = t;
  }

  const rows: Row[] = Array.from({ length: s.ayahs }, (_, i) => {
    const g = s.start + i;
    const tr: Record<string, string> = {};
    for (const id of ids) {
      const t = loaded[id];
      if (t) tr[id] = t.text[g];
    }
    return { sura: s.id, aya: i + 1, page: pageOf(s.id, i + 1), text: UTHMANI.text[g], tr };
  });

  const labels = Object.fromEntries(ids.map((k) => [k, TRANSLATIONS[k].label]));
  return (
    <SurahClient
      id={s.id}
      rows={rows}
      basmala={showsBasmala(s.id) ? UTHMANI.basmala : null}
      labels={labels}
    />
  );
}
