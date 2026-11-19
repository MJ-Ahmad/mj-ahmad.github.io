import verses from "@/data/verses.json";
import uthmani from "@/data/uthmani.json";
import { HIZBS, JUZS, MANZILS, PAGES, RUKUS, SURAHS, type Surah } from "@/lib/data";

export const VERSES = verses as { basmala: string; text: string[]; norm: string[] };

/** Uthmani display text (basmala stripped from surahs 2-114 except 9, as in VERSES). Used for reading. */
export const UTHMANI = uthmani as { basmala: string; text: string[] };

/** Page (1-604) that contains a given sura/aya. pages.json lists the first aya of each page. */
export function pageOf(sura: number, aya: number): number {
  let lo = 0, hi = PAGES.length - 1, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const p = PAGES[mid];
    if (p.sura < sura || (p.sura === sura && p.aya <= aya)) { ans = mid; lo = mid + 1; } else { hi = mid - 1; }
  }
  return PAGES[ans].page;
}

/** Surah that contains a global verse index (0-based, over all 6236 ayahs). */
export function surahOfIndex(index: number): Surah {
  return SURAHS.find((s) => index >= s.start && index < s.start + s.ayahs) ?? SURAHS[0];
}

/** Surahs 2-114 store the basmala stripped; 1 and 9 are handled per tradition. */
export function showsBasmala(id: number): boolean {
  return id !== 1 && id !== 9;
}

/** Normalise for search: strip harakat/tatweel, unify alef forms and ya. */
export function normalize(input: string): string {
  return input
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();
}

export interface PageSummary {
  /** Ids of surahs that begin on this page. */
  surahs: number[];
  juz: number;
  hizb: number;
  hizbPart: number;
  ruku: number;
  manzil: number;
}

/** What a Mushaf page contains: the surahs starting on it and the juz/hizb/ruku/manzil it falls in. */
export function pageSummary(page: number): PageSummary {
  const last = <T extends { page: number }>(list: T[]): T | undefined => {
    let found: T | undefined;
    for (const e of list) {
      if (e.page <= page) found = e;
      else break;
    }
    return found;
  };
  const juz = last(JUZS);
  const hizb = last(HIZBS);
  const ruku = last(RUKUS);
  const manzil = last(MANZILS);
  return {
    surahs: SURAHS.filter((s) => s.page === page).map((s) => s.id),
    juz: juz?.juz ?? 1,
    hizb: hizb?.hizb ?? 1,
    hizbPart: hizb?.part ?? 0,
    ruku: ruku?.ruku ?? 1,
    manzil: manzil?.manzil ?? 1,
  };
}

/** Ayahs on a Madina Mushaf page, in reading order. Madina numbering only. */
export function ayahsOnPage(page: number): { sura: number; aya: number }[] {
  const startG = PAGES.find((p) => p.page === page)?.g;
  if (startG === undefined) return [];
  const endG = PAGES.find((p) => p.page === page + 1)?.g ?? VERSES.text.length;
  const out: { sura: number; aya: number }[] = [];
  for (let g = startG; g < endG; g++) {
    const s = surahOfIndex(g);
    out.push({ sura: s.id, aya: g - s.start + 1 });
  }
  return out;
}
