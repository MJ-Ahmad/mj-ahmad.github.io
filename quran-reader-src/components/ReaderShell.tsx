"use client";

import { useEffect, useRef, useState, type FormEvent, type TouchEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MushafViewer from "@/components/MushafViewer";
import PrintSelect from "@/components/PrintSelect";
import ReciterPicker from "@/components/ReciterPicker";
import { PAGE_COUNT, isLayoutId, parsePage, type LayoutId } from "@/lib/layouts";
import type { PageSummary } from "@/lib/quran";
import { player, type Item } from "@/lib/player";
import { setLastRead } from "@/lib/lastread";
import { isBookmarked, toggleBookmark, useBookmarks } from "@/lib/bookmarks";
import { useT } from "@/lib/i18n";

export default function ReaderShell({
  page,
  initialLayout,
  info,
  pageAyahs,
}: {
  page: number;
  initialLayout: LayoutId;
  info: PageSummary | null;
  pageAyahs: Item[];
}) {
  const { t, n, title } = useT();
  const router = useRouter();
  const [layout, setLayout] = useState<LayoutId>(initialLayout);
  const [jump, setJump] = useState(String(page));
  const touch = useRef<{ x: number; y: number } | null>(null);
  useBookmarks(); // re-render when bookmarks change
  const marked = isBookmarked(page);
  // Madina page data (surah, juz, ayah list) does not apply to the IndoPak layout.
  const madina = layout !== "IndoPak";
  const madinaAyahs = madina ? pageAyahs : [];
  const href = (p: number) => `/reader/${p}?print=${layout}`;
  const go = (p: number) => { if (p >= 1 && p <= PAGE_COUNT) router.push(href(p)); };

  // Remember where the reader is, for "continue reading" on the home page.
  useEffect(() => { setLastRead({ page, layout }); }, [page, layout]);
  useEffect(() => setJump(String(page)), [page]);

  // Static export: ?print= is in the browser URL only, so read it here.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("print");
    setLayout(isLayoutId(p) ? p : initialLayout);
  }, [page, initialLayout]);

  // Arrow keys turn pages (left = previous, like the ‹ button), unless typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowLeft") router.push(`/reader/${Math.max(1, page - 1)}?print=${layout}`);
      if (e.key === "ArrowRight") router.push(`/reader/${Math.min(PAGE_COUNT, page + 1)}?print=${layout}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, layout, router]);

  // Swipe: left = next page, right = previous (horizontal swipes only, so scrolling still works).
  const onTouchStart = (e: TouchEvent) => {
    const tp = e.touches[0];
    touch.current = { x: tp.clientX, y: tp.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const tp = e.changedTouches[0];
    const dx = tp.clientX - start.x, dy = tp.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) go(dx < 0 ? page + 1 : page - 1);
  };

  const submitJump = (e: FormEvent) => {
    e.preventDefault();
    const p = parsePage(jump);
    if (p) router.push(href(p));
    else setJump(String(page));
  };

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="home-link" href="/" aria-label={t("reader.home")}>‹ {t("reader.home")}</Link>
        <div className="pageinfo">
          <strong>{t("page")} {n(page)} / {n(PAGE_COUNT)}</strong>
          {info && madina && (
            <span className="meta">
              {info.surahs.length > 0 && <>{t("surah")}: {info.surahs.map((id) => title(id)).join(", ")} · </>}
              {t("juz")} {n(info.juz)} · {t("hizb")} {n(info.hizb)}{hizbPartLabel(info.hizbPart, n)} · {t("ruku")} {n(info.ruku)} · {t("manzil")} {n(info.manzil)}
            </span>
          )}
        </div>
        <div className="topbar-tools">
          <button
            type="button"
            className={marked ? "pill on" : "pill"}
            onClick={() => toggleBookmark(page)}
            aria-pressed={marked}
            aria-label={marked ? t("bookmark.remove") : t("bookmark.add")}
            title={marked ? t("bookmark.remove") : t("bookmark.add")}
          >
            {marked ? "★" : "☆"}
          </button>
          <button
            type="button"
            className="pill"
            onClick={() => player.playList({ title: `${t("page")} ${n(page)}`, items: madinaAyahs }, 0)}
            disabled={madinaAyahs.length === 0}
          >
            ▶ {t("reader.playPage")}
          </button>
          <ReciterPicker />
          <PrintSelect value={layout} page={page} />
        </div>
      </header>

      <section className="viewer" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <MushafViewer page={page} layout={layout} />
      </section>

      <nav className="pager" aria-label="Page navigation">
        <Link className={page <= 1 ? "btn disabled" : "btn"} href={href(page - 1)} aria-disabled={page <= 1} aria-label={t("reader.prev")}>‹</Link>
        <form onSubmit={submitJump}>
          <input inputMode="numeric" aria-label={`${t("reader.goto")} (1–${n(PAGE_COUNT)})`} value={jump} onChange={(e) => setJump(e.target.value)} />
        </form>
        <Link className={page >= PAGE_COUNT ? "btn disabled" : "btn"} href={href(page + 1)} aria-disabled={page >= PAGE_COUNT} aria-label={t("reader.next")}>›</Link>
      </nav>
    </main>
  );
}

/** "¼ / ½ / ¾" part of a hizb, in the UI's digits. */
function hizbPartLabel(part: number, n: (x: number | string) => string): string {
  if (part === 0) return "";
  const [a, b] = ({ 1: [1, 4], 2: [1, 2], 3: [3, 4] } as Record<number, [number, number]>)[part];
  return ` ${n(a)}/${n(b)}`;
}

