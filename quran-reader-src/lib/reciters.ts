import data from "@/data/reciters.json";

/** murattal = normal recitation (مرتل), mujawwad = slow, melodic recitation (مجود). */
export type Style = "murattal" | "mujawwad";

export interface Reciter {
  id: string;
  name: { ar: string; en: string; bn: string };
  murattal: string | null;
  mujawwad: string | null;
}

const DATA = data as { base: string; reciters: Reciter[] };

/** everyayah.com base URL. Audio is per ayah: <base><folder>/<sss><aaa>.mp3 */
export const AUDIO_BASE = DATA.base;
export const RECITERS: Reciter[] = DATA.reciters;
export const DEFAULT_RECITER = "alafasy";

export function availableStyles(r: Reciter): Style[] {
  const out: Style[] = [];
  if (r.murattal) out.push("murattal");
  if (r.mujawwad) out.push("mujawwad");
  return out;
}

/** The requested style if the reciter has it, otherwise the one they do have. */
export function resolveStyle(r: Reciter, style: Style): Style {
  const avail = availableStyles(r);
  return avail.includes(style) ? style : avail[0];
}

export function findReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

export function audioUrl(r: Reciter, style: Style, sura: number, aya: number): string {
  const folder = (style === "mujawwad" ? r.mujawwad : r.murattal) ?? r.murattal ?? r.mujawwad;
  const pad = (n: number) => String(n).padStart(3, "0");
  return `${AUDIO_BASE}${folder}/${pad(sura)}${pad(aya)}.mp3`;
}
