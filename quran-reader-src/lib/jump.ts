import { SURAHS } from "@/lib/data";

export type Jump =
  | { kind: "page"; page: number }
  | { kind: "verse"; surah: number; ayah: number }
  | { kind: "search" }
  | { kind: "invalid" };

/** Bangla and Arabic-Indic digits to ASCII, so typed ২:২৫৫ or ٢:٢٥٥ work like 2:255. */
export function toAsciiDigits(s: string): string {
  return s
    .replace(/[\u09e6-\u09ef]/g, (d) => String(d.charCodeAt(0) - 0x09e6))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * "152" -> page 152, "2:255" or "2 255" -> that verse, anything else -> a search.
 * Numbers out of range are "invalid" rather than searched. Empty input gives null.
 */
export function parseJump(input: string, totalPages = 604): Jump | null {
  const q = toAsciiDigits(input).trim();
  if (!q) return null;
  const page = q.match(/^(\d{1,4})$/);
  if (page) {
    const n = Number(page[1]);
    return n >= 1 && n <= totalPages ? { kind: "page", page: n } : { kind: "invalid" };
  }
  const verse = q.match(/^(\d{1,3})\s*[:\s/.]\s*(\d{1,3})$/);
  if (verse) {
    const s = Number(verse[1]), a = Number(verse[2]);
    const ok = s >= 1 && s <= SURAHS.length && a >= 1 && a <= SURAHS[s - 1].ayahs;
    return ok ? { kind: "verse", surah: s, ayah: a } : { kind: "invalid" };
  }
  return { kind: "search" };
}
