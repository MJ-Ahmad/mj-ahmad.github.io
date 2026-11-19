import { useSyncExternalStore } from "react";
import { DEFAULT_RECITER, RECITERS, audioUrl, findReciter, resolveStyle, type Style } from "@/lib/reciters";

export interface Item { sura: number; aya: number }
export interface Playlist { title: string; items: Item[] }

interface State {
  reciterId: string;
  style: Style;
  list: Playlist | null;
  index: number;
  playing: boolean;
  error: string | null;
}

const KEY = "qr:reciter";
let state: State = { reciterId: DEFAULT_RECITER, style: "murattal", list: null, index: 0, playing: false, error: null };
const listeners = new Set<() => void>();
let audio: HTMLAudioElement | null = null;
let hydrated = false;

function emit() { for (const l of listeners) l(); }
function set(patch: Partial<State>) { state = { ...state, ...patch }; emit(); }
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }
function getSnapshot() { return state; }

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("playing", () => set({ playing: true, error: null }));
    audio.addEventListener("pause", () => set({ playing: false }));
    audio.addEventListener("ended", () => go(1));
    audio.addEventListener("error", () => set({ playing: false, error: "অডিও লোড হয়নি। ইন্টারনেট সংযোগ দেখুন।" }));
  }
  return audio;
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ reciterId: state.reciterId, style: state.style })); } catch { /* ignore */ }
}

function srcFor(item: Item): string {
  const r = findReciter(state.reciterId);
  return audioUrl(r, resolveStyle(r, state.style), item.sura, item.aya);
}

function loadCurrent(autoplay: boolean) {
  const item = state.list?.items[state.index];
  if (!item) return;
  const a = getAudio();
  a.src = srcFor(item);
  if (autoplay) {
    a.play().catch((err: unknown) => {
      if ((err as Error)?.name !== "AbortError") set({ playing: false, error: "চালানো যায়নি। আবার চেষ্টা করুন।" });
    });
  }
  updateMediaSession();
}

function updateMediaSession() {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !state.list) return;
  const item = state.list.items[state.index];
  if (!item) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: `${state.list.title} · ${item.sura}:${item.aya}`,
    artist: findReciter(state.reciterId).name.en,
  });
  navigator.mediaSession.setActionHandler("nexttrack", () => go(1));
  navigator.mediaSession.setActionHandler("previoustrack", () => go(-1));
  navigator.mediaSession.setActionHandler("play", () => togglePlay());
  navigator.mediaSession.setActionHandler("pause", () => togglePlay());
}

function go(delta: number) {
  const list = state.list;
  if (!list) return;
  const next = state.index + delta;
  if (next < 0 || next >= list.items.length) {
    getAudio().pause();
    set({ playing: false });
    return;
  }
  set({ index: next });
  loadCurrent(true);
}

function playList(list: Playlist, index = 0) {
  if (list.items.length === 0) return;
  set({ list, index: Math.min(Math.max(index, 0), list.items.length - 1), error: null });
  loadCurrent(true);
}

function togglePlay() {
  if (!state.list) return;
  const a = getAudio();
  if (a.paused) {
    if (!a.src) loadCurrent(true);
    else a.play().catch(() => set({ error: "চালানো যায়নি।" }));
  } else {
    a.pause();
  }
}

function close() {
  const a = getAudio();
  a.pause();
  a.removeAttribute("src");
  set({ list: null, index: 0, playing: false, error: null });
}

function setReciter(id: string) {
  if (!RECITERS.some((r) => r.id === id)) return;
  set({ reciterId: id });
  persist();
  if (state.list) loadCurrent(state.playing);
}

function setStyle(style: Style) {
  set({ style });
  persist();
  if (state.list) loadCurrent(state.playing);
}

/** Restores the saved reciter and style. Call once on the client. */
function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const v = JSON.parse(raw) as { reciterId?: string; style?: string };
    set({
      reciterId: RECITERS.some((r) => r.id === v.reciterId) ? (v.reciterId as string) : DEFAULT_RECITER,
      style: v.style === "mujawwad" ? "mujawwad" : "murattal",
    });
  } catch { /* ignore malformed storage */ }
}

export const player = { playList, togglePlay, go, close, setReciter, setStyle, hydrate };

export function usePlayer(): State {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
