import { SURAHS, surahBnName, type Surah } from "@/lib/data";
import { toAsciiDigits } from "@/lib/jump";

/** Client-side normalisation: no diacritics, unified alef and ya, lower case. Matches scripts/build-data.py loosely. */
export function normalizeQuery(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim()
    .toLowerCase();
}

/** Surahs whose number, Latin, Bangla or Arabic name contains the query. */
export function matchSurahs(query: string, limit = 20): Surah[] {
  const q = normalizeQuery(toAsciiDigits(query));
  if (q.length === 0) return [];
  const out: Surah[] = [];
  for (const s of SURAHS) {
    const hit = String(s.id) === q
      || [s.tname, s.ename, surahBnName(s.id), s.name].some((v) => normalizeQuery(v).includes(q));
    if (hit) out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}
