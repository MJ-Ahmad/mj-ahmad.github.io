"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { parseJump } from "@/lib/jump";
import { matchSurahs } from "@/lib/search";
import { DEFAULT_LAYOUT } from "@/lib/layouts";

type Hit = { surah: number; ayah: number; page: number; text: string };

export default function SearchPage() {
  const { t, n, title } = useT();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [busy, setBusy] = useState(false);

  // Start from ?q=... when arriving from the home page's go-to box.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);

  // Arabic text search runs in the browser on the verse index, loaded on first use.
  useEffect(() => {
    const term = q.trim();
    const arabic = /[\u0600-\u06FF]/.test(term);
    if (!arabic || term.length < 2) { setHits([]); return; }
    let cancelled = false;
    setBusy(true);
    import("@/lib/quran")
      .then(({ VERSES, normalize, surahOfIndex, pageOf }) => {
        const needle = normalize(term);
        const found: Hit[] = [];
        for (let i = 0; needle.length >= 2 && i < VERSES.norm.length && found.length < 50; i++) {
          if (VERSES.norm[i].includes(needle)) {
            const s = surahOfIndex(i);
            const ayah = i - s.start + 1;
            found.push({ surah: s.id, ayah, page: pageOf(s.id, ayah), text: VERSES.text[i] });
          }
        }
        if (!cancelled) setHits(found);
      })
      .catch(() => { if (!cancelled) setHits([]); })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [q]);

  const jump = parseJump(q);
  const surahs = jump?.kind === "search" ? matchSurahs(q) : [];

  return (
    <main className="page">
      <h1>{t("search.title")}</h1>
      <input className="search" type="search" dir="auto" placeholder={t("search.ph")} value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      <p className="meta small">{t("search.hint")}</p>

      {jump?.kind === "page" && (
        <p className="notice-inline"><Link href={`/reader/${jump.page}?print=${DEFAULT_LAYOUT}`}>{t("page")} {n(jump.page)} →</Link></p>
      )}
      {jump?.kind === "verse" && (
        <p className="notice-inline"><Link href={`/surah/${jump.surah}#ayah-${jump.ayah}`}>{title(jump.surah)} {n(jump.surah)}:{n(jump.ayah)} →</Link></p>
      )}
      {jump?.kind === "invalid" && <p className="notice-inline">{t("home.invalid")}</p>}

      {surahs.length > 0 && (
        <>
          <h2>{t("search.surahs")}</h2>
          <ul className="hit-list">
            {surahs.map((s) => (
              <li key={s.id}><Link href={`/surah/${s.id}`}><b>{n(s.id)}</b> {title(s.id)} <i dir="rtl">{s.name}</i></Link></li>
            ))}
          </ul>
        </>
      )}

      {hits.length > 0 && (
        <>
          <h2>{t("search.verses")}</h2>
          <ol className="hits" dir="rtl">
            {hits.map((h) => (
              <li key={`${h.surah}:${h.ayah}`}>
                <Link href={`/surah/${h.surah}#ayah-${h.ayah}`}>{n(h.surah)}:{n(h.ayah)}</Link>{" "}
                <span className="ar">{h.text}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {busy && <p className="meta">{t("search.searching")}</p>}
      {!busy && q.trim().length >= 2 && hits.length === 0 && surahs.length === 0 && jump?.kind !== "page" && jump?.kind !== "verse" && (
        <p>{t("search.none")}</p>
      )}
    </main>
  );
}
