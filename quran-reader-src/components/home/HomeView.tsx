"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useT, type Key } from "@/lib/i18n";
import { SURAHS, RUKUS, SAJDAS, JUZS, TOTAL_PAGES, TOTAL_AYAHS, juzOfPage, surahOfPage } from "@/lib/data";
import { parseJump } from "@/lib/jump";
import { useLastRead } from "@/lib/lastread";
import { useBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { DEFAULT_LAYOUT } from "@/lib/layouts";
import { dailyVerse } from "@/lib/daily";
import { BASE_PATH } from "@/lib/base";

export interface DailyVerse { surah: number; ayah: number; text: string }

const POPULAR = [1, 2, 18, 36, 55, 56, 67, 112];

export default function HomeView() {
  const { t, n, title } = useT();
  // The verse of the day changes with the date, so it is chosen after mount (the static HTML has no verse).
  const [daily, setDaily] = useState<DailyVerse | null>(null);
  useEffect(() => setDaily(dailyVerse()), []);
  const router = useRouter();
  const last = useLastRead();
  const marks = useBookmarks();
  const [jump, setJump] = useState("");
  const [invalid, setInvalid] = useState(false);

  const page = last?.page ?? 1;
  const layout = last?.layout ?? DEFAULT_LAYOUT;
  const pct = Math.round((page / TOTAL_PAGES) * 100);
  const surah = surahOfPage(page);
  const juz = juzOfPage(page);

  const stats: [number, Key][] = [
    [SURAHS.length, "stat.surahs"], [TOTAL_AYAHS, "stat.ayahs"], [TOTAL_PAGES, "stat.pages"],
    [JUZS.length, "stat.juzs"], [RUKUS.length, "stat.rukus"], [SAJDAS.length, "stat.sajdas"],
  ];
  const quick = [
    ["/reader", "nav.mushaf", "q.mushaf"], ["/sections", "nav.index", "q.index"],
    ["/search", "nav.search", "q.search"], ["/settings", "nav.settings", "q.settings"],
  ] as const;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const j = parseJump(jump);
    if (!j) return;
    setInvalid(j.kind === "invalid");
    if (j.kind === "page") router.push(`/reader/${j.page}?print=${DEFAULT_LAYOUT}`);
    else if (j.kind === "verse") router.push(`/surah/${j.surah}#ayah-${j.ayah}`);
    else if (j.kind === "search") router.push(`/search?q=${encodeURIComponent(jump.trim())}`);
  };

  const pageIsMarked = marks.some((b) => b.page === page);

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero-in">
          <Image unoptimized src={`${BASE_PATH}/icon-192.png`} alt="" width={96} height={96} priority className="home-logo" />
          <h1>{t("hero.title")}</h1>
          <p className="lede">{t("hero.sub")}</p>

          <form className="jumpbox" onSubmit={submit} role="search">
            <label className="sr-only" htmlFor="jump">{t("home.jump")}</label>
            <input id="jump" dir="auto" value={jump} onChange={(e) => { setJump(e.target.value); setInvalid(false); }} placeholder={t("home.jumpPh")} aria-invalid={invalid} />
            <button type="submit" className="btn primary">{t("home.go")}</button>
          </form>
          {invalid && <p className="jump-err" role="alert">{t("home.invalid")}</p>}

          <Link href={`/reader/${page}?print=${layout}`} className="resume">
            <span>{t("continue")}</span>
            <b>{title(surah.id)} · {t("juz")} {n(juz)} · {t("page")} {n(page)}</b>
            <i className="progress" role="img" aria-label={`${t("progress")}: ${n(pct)}%`}><em style={{ width: `${pct}%` }} /></i>
          </Link>
          <div className="actions center">
            <Link href={`/reader/${page}?print=${layout}`} className="btn primary">{t("hero.cta")}</Link>
          </div>
        </div>
      </section>

      <div className="container home-body">
        <section className="stats" aria-label="Totals">
          {stats.map(([v, k]) => <div key={k}><b>{n(v)}</b><span>{t(k)}</span></div>)}
        </section>

        <section className="home-cols">
          <article className="card verse-card">
            <h2>{t("home.verse")}</h2>
            {daily && (
              <>
                <p className="verse-ar" dir="rtl">{daily.text}</p>
                <div className="verse-foot">
                  <span>{title(daily.surah)} · {n(daily.surah)}:{n(daily.ayah)}</span>
                  <Link className="btn" href={`/surah/${daily.surah}#ayah-${daily.ayah}`}>{t("open")}</Link>
                </div>
              </>
            )}
          </article>

          <article className="card marks-card">
            <h2>{t("home.bookmarks")} {marks.length > 0 && <span className="count">{n(marks.length)}</span>}</h2>
            {marks.length === 0 ? (
              <p className="muted small">{t("marks.empty")}</p>
            ) : (
              <ul className="rows-plain">
                {marks.slice(0, 4).map((b) => (
                  <li key={b.page}><Link href={`/reader/${b.page}?print=${layout}`}><b>{n(b.page)}</b> {title(surahOfPage(b.page).id)}</Link></li>
                ))}
              </ul>
            )}
            <button type="button" className="btn small" onClick={() => toggleBookmark(page)} aria-pressed={pageIsMarked}>
              {pageIsMarked ? t("bookmark.remove") : t("bookmark.add")}
            </button>
          </article>
        </section>

        <h2 className="h2">{t("quick")}</h2>
        <section className="grid4">
          {quick.map(([h, k, d]) => (
            <Link key={h} href={h} className="card tile"><b>{t(k)}</b><span>{t(d)}</span></Link>
          ))}
        </section>

        <h2 className="h2">{t("popular")}</h2>
        <section className="chips">
          {POPULAR.map((id) => (
            <Link key={id} href={`/surah/${id}`} className="chip big"><b>{n(id)}</b> {title(id)} <i dir="rtl">{SURAHS[id - 1].name}</i></Link>
          ))}
        </section>

        <details className="allsurahs">
          <summary>{t("home.allSurahs")}</summary>
          <ul className="surah-grid">
            {SURAHS.map((s) => (
              <li key={s.id}>
                <Link href={`/surah/${s.id}`}>
                  <span className="num">{n(s.id)}</span>
                  <span className="sname">{title(s.id)}</span>
                  <span className="sar" dir="rtl">{s.name}</span>
                  <small>{n(s.ayahs)} {t("ayahs")} · {t(s.type === "Meccan" ? "meccan" : "medinan")}</small>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </>
  );
}
