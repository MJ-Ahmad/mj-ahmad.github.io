import { UTHMANI } from "@/lib/quran";
import { SURAHS } from "@/lib/data";

/** Well-known verses (surah, ayah), one per day in rotation. */
export const DAILY_PICKS: [number, number][] = [
  [1, 5], [1, 6], [2, 45], [2, 152], [2, 153], [2, 186], [2, 216], [2, 255], [2, 286],
  [3, 139], [3, 185], [4, 79], [9, 51], [13, 11], [13, 28], [16, 128], [17, 80], [20, 114],
  [29, 69], [39, 10], [39, 53], [40, 60], [49, 13], [50, 16], [55, 13], [57, 4], [59, 22],
  [65, 2], [65, 3], [73, 20], [93, 3], [94, 5], [94, 6], [112, 1],
];

/** The pick for a UTC day. Changes once a day and keeps no state. */
export function dailyPick(now: Date = new Date()): { surah: number; ayah: number } {
  const day = Math.floor(now.getTime() / 864e5);
  const [surah, ayah] = DAILY_PICKS[((day % DAILY_PICKS.length) + DAILY_PICKS.length) % DAILY_PICKS.length];
  return { surah, ayah };
}

/** Server-side: the verse of the day with its Uthmani text. */
export function dailyVerse(now: Date = new Date()) {
  const { surah, ayah } = dailyPick(now);
  const g = SURAHS[surah - 1].start + ayah - 1;
  return { surah, ayah, text: UTHMANI.text[g] };
}
