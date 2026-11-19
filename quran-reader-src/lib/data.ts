import surahs from "@/data/surahs.json";
import juzs from "@/data/juzs.json";
import hizbs from "@/data/hizbs.json";
import manzils from "@/data/manzils.json";
import rukus from "@/data/rukus.json";
import sajdas from "@/data/sajdas.json";
import surahNamesBn from "@/data/surah-names-bn.json";
import pages from "@/data/pages.json";

export interface Surah {
  id: number; name: string; tname: string; ename: string; type: string;
  order: number; ayahs: number; rukus: number; start: number; page: number; juz: number;
}
export interface PageEntry { sura: number; aya: number; g: number; page: number }
export interface JuzEntry extends PageEntry { juz: number }
export interface HizbEntry extends PageEntry { quarter: number; hizb: number; part: number }
export interface ManzilEntry extends PageEntry { manzil: number }
export interface RukuEntry extends PageEntry { ruku: number }
export interface SajdaEntry extends PageEntry { type: string; sajda: number }

export const SURAHS = surahs as Surah[];
export const PAGES = pages as PageEntry[];
export const JUZS = juzs as JuzEntry[];
export const HIZBS = hizbs as HizbEntry[];
export const MANZILS = manzils as ManzilEntry[];
export const RUKUS = rukus as RukuEntry[];
export const SAJDAS = sajdas as SajdaEntry[];
export const SURAH_NAMES_BN = surahNamesBn as string[];

export function surahById(id: number): Surah | null {
  return SURAHS.find((s) => s.id === id) ?? null;
}
export function surahBnName(id: number): string {
  return SURAH_NAMES_BN[id - 1] ?? "";
}

/** Juz that contains a Madina page (pages.json is the Madina numbering). */
export function juzOfPage(page: number): number {
  let juz = 1;
  for (const j of JUZS) { if (j.page <= page) juz = j.juz; else break; }
  return juz;
}

/** The surah in effect at the start of a page. */
export function surahOfPage(page: number): Surah {
  let found = SURAHS[0];
  for (const s of SURAHS) { if (s.page <= page) found = s; else break; }
  return found;
}

export const TOTAL_PAGES = 604;
export const TOTAL_AYAHS = SURAHS.reduce((sum, s) => sum + s.ayahs, 0);
