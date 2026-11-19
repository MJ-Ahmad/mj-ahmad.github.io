import { useSyncExternalStore } from "react";

/** One bookmark per Madina page; newest first. */
export interface Bookmark { page: number; createdAt: number }
const KEY = "qr:bookmarks";
const EMPTY: Bookmark[] = [];
let list: Bookmark[] = EMPTY;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function hydrateBookmarks() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Bookmark[];
      if (Array.isArray(v)) {
        list = v.filter((b) => Number.isInteger(b.page) && b.page >= 1 && b.page <= 604);
        emit();
      }
    }
  } catch { /* ignore */ }
}

export const isBookmarked = (page: number) => list.some((b) => b.page === page);

/** Adds the page if it is not bookmarked, removes it otherwise. */
export function toggleBookmark(page: number) {
  list = isBookmarked(page)
    ? list.filter((b) => b.page !== page)
    : [{ page, createdAt: Date.now() }, ...list];
  save();
  emit();
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const useBookmarks = (): Bookmark[] => useSyncExternalStore(subscribe, () => list, () => EMPTY);
