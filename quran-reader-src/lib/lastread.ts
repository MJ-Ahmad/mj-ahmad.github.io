import { useSyncExternalStore } from "react";

export interface LastRead { page: number; layout: string }
const KEY = "qr:last";
const listeners = new Set<() => void>();
let last: LastRead | null = null;
const emit = () => listeners.forEach((l) => l());

export const getLastRead = () => last;

export function setLastRead(v: LastRead) {
  if (last && last.page === v.page && last.layout === v.layout) return;
  last = v;
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ }
  emit();
}

export function hydrateLastRead() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as LastRead;
      if (Number.isInteger(v.page) && v.page >= 1 && v.page <= 604 && typeof v.layout === "string") {
        last = v;
        emit();
      }
    }
  } catch { /* ignore */ }
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const useLastRead = (): LastRead | null => useSyncExternalStore(subscribe, () => last, () => null);
