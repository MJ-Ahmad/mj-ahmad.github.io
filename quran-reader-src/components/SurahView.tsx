"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { player, usePlayer } from "@/lib/player";
import ReciterPicker from "@/components/ReciterPicker";
import { bn } from "@/lib/bn";

export interface Row {
  sura: number;
  aya: number;
  page: number;
  text: string;
  tr: Record<string, string>;
}

const SIZES = [1.3, 1.5, 1.7, 1.95, 2.2];
const SIZE_KEY = "qr:fontsize";

/** The ayah list of a surah: play, follow the current ayah, translations and text size. */
export default function SurahView({
  title,
  rows,
  trIds,
  trLabels,
  layout,
  basmala,
}: {
  title: string;
  rows: Row[];
  trIds: string[];
  trLabels: Record<string, string>;
  layout: string;
  basmala: string | null;
}) {
  const s = usePlayer();
  const [sizeIdx, setSizeIdx] = useState(2);
  const sura = rows[0]?.sura;
  const cur = s.list?.items[s.index];
  const current = cur && cur.sura === sura ? cur.aya : null;

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(SIZE_KEY));
      if (Number.isInteger(v) && v >= 0 && v < SIZES.length) setSizeIdx(v);
    } catch { /* ignore */ }
  }, []);

  const changeSize = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), SIZES.length - 1);
    setSizeIdx(clamped);
    try { localStorage.setItem(SIZE_KEY, String(clamped)); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (current === null || !s.playing) return;
    document.getElementById(`ayah-${current}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [current, s.playing]);

  const items = rows.map((r) => ({ sura: r.sura, aya: r.aya }));
  const style = { "--ayah-size": `${SIZES[sizeIdx]}rem` } as unknown as CSSProperties;

  return (
    <>
      <div className="surah-tools">
        <button type="button" className="pill primary" onClick={() => player.playList({ title, items }, 0)} disabled={!rows.length}>
          ▶ পুরো সূরা শুনুন
        </button>
        <ReciterPicker />
        <div className="fontctl" role="group" aria-label="লেখার আকার">
          <button type="button" onClick={() => changeSize(sizeIdx - 1)} disabled={sizeIdx === 0} aria-label="ছোট করুন">A−</button>
          <button type="button" onClick={() => changeSize(sizeIdx + 1)} disabled={sizeIdx === SIZES.length - 1} aria-label="বড় করুন">A+</button>
        </div>
      </div>

      {basmala && <p className="basmala" dir="rtl">{basmala}</p>}

      <ol className="ayahs" dir="rtl" style={style}>
        {rows.map((r, i) => (
          <li key={r.aya} id={`ayah-${r.aya}`} className={current === r.aya ? "current" : undefined}>
            <span className="ar">{r.text}</span>{" "}
            <button
              type="button"
              className="ayah-play"
              onClick={() => player.playList({ title, items }, i)}
              aria-label={`আয়াত ${bn(r.aya)} শুনুন`}
            >▶</button>
            <Link className="ayah-no" href={`/reader/${r.page}?print=${layout}`} title="মুসহাফ পৃষ্ঠায় দেখুন">{bn(r.aya)}</Link>
            {trIds.map((id) => (
              <p key={id} className="tr" lang={id === "bn" ? "bn" : id === "en" ? "en" : "ar"} data-label={trLabels[id]}>
                {r.tr[id]}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </>
  );
}
