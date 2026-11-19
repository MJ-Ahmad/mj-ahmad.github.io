"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SurahView, { type Row } from "@/components/SurahView";
import { bn, TYPE_BN } from "@/lib/bn";
import { DEFAULT_LAYOUT } from "@/lib/layouts";
import { surahById, surahBnName } from "@/lib/data";
import { TRANSLATIONS, translationsFromParam, type TranslationId } from "@/lib/translation-ids";

/**
 * The surah page UI. The ?tr= choice is read here (not on the server), so the
 * statically exported page still switches translations.
 */
export default function SurahClient({
  id,
  rows,
  basmala,
  labels,
}: {
  id: number;
  rows: Row[];
  basmala: string | null;
  labels: Record<string, string>;
}) {
  const s = surahById(id);
  const [wanted, setWanted] = useState<TranslationId[]>(["bn"]);

  useEffect(() => {
    setWanted(translationsFromParam(new URLSearchParams(window.location.search).get("tr") ?? undefined));
  }, []);

  if (!s) return null;

  const have = new Set(Object.keys(rows[0]?.tr ?? {}));
  const activeIds = wanted.filter((t) => have.has(t));
  const trQuery = (ids: TranslationId[]) => `?tr=${ids.length ? ids.join(",") : "none"}`;
  const choose = (ids: TranslationId[]) => {
    setWanted(ids);
    window.history.replaceState(null, "", `${window.location.pathname}${trQuery(ids)}`);
  };
  const toggle = (t: TranslationId) => (wanted.includes(t) ? wanted.filter((x) => x !== t) : [...wanted, t]);

  const prev = s.id > 1 ? surahById(s.id - 1) : null;
  const next = s.id < 114 ? surahById(s.id + 1) : null;

  return (
    <main className="page">
      <header className="surah-head">
        <h1>
          {surahBnName(s.id)} <small className="ar-inline" dir="rtl">{s.name}</small>
        </h1>
        <p className="meta">
          {s.tname} · {s.ename} · {TYPE_BN[s.type] ?? s.type} · {bn(s.ayahs)} আয়াত · পারা {bn(s.juz)} · পৃষ্ঠা {bn(s.page)}
        </p>
        <div className="actions">
          <Link className="pill" href={`/reader/${s.page}?print=${DEFAULT_LAYOUT}`}>মুসহাফে খুলুন</Link>
        </div>
      </header>

      <div className="tr-toggles" role="group" aria-label="অনুবাদ ও তাফসীর">
        <span>অনুবাদ:</span>
        {(Object.keys(TRANSLATIONS) as TranslationId[]).map((t) => (
          <button
            key={t}
            type="button"
            className={wanted.includes(t) ? "pill on" : "pill"}
            aria-pressed={wanted.includes(t)}
            onClick={() => choose(toggle(t))}
          >
            {TRANSLATIONS[t].label}
          </button>
        ))}
      </div>

      <SurahView
        title={surahBnName(s.id)}
        rows={rows}
        trIds={activeIds}
        trLabels={labels}
        layout={DEFAULT_LAYOUT}
        basmala={basmala}
      />

      <nav className="surah-pager" aria-label="সূরা নেভিগেশন">
        {prev ? <Link href={`/surah/${prev.id}${trQuery(wanted)}`}>← {surahBnName(prev.id)}</Link> : <span />}
        {next ? <Link href={`/surah/${next.id}${trQuery(wanted)}`}>{surahBnName(next.id)} →</Link> : <span />}
      </nav>
    </main>
  );
}
