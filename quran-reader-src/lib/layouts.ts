export const LAYOUT_IDS = ["1441H", "1405H", "IndoPak"] as const;
export type LayoutId = (typeof LAYOUT_IDS)[number];

export interface LayoutDef {
  id: LayoutId;
  label: string;
  /** The library's data-layout value (its v2 DB stems map from it). */
  libLayout: "1441H" | "1405H" | "indopak";
  /** Note shown when the data is missing (none for the layouts installed now). */
  note?: string;
}

export const LAYOUTS: Record<LayoutId, LayoutDef> = {
  "1441H": { id: "1441H", label: "Madina 1441H", libLayout: "1441H" },
  "1405H": { id: "1405H", label: "Madina 1405H", libLayout: "1405H" },
  IndoPak: { id: "IndoPak", label: "IndoPak, 15 lines", libLayout: "indopak" },
};

export const DEFAULT_LAYOUT: LayoutId = "1405H";
export const PAGE_COUNT = 604;

export function isLayoutId(value: unknown): value is LayoutId {
  return typeof value === "string" && (LAYOUT_IDS as readonly string[]).includes(value);
}

export function parsePage(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= PAGE_COUNT ? n : null;
}
