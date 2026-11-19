"use client";

import { useEffect } from "react";
import { player, usePlayer } from "@/lib/player";
import { useT } from "@/lib/i18n";

/** Fixed player bar. Shown only while a playlist is loaded. */
export default function AudioBar() {
  const s = usePlayer();
  const { t, n, title } = useT();

  useEffect(() => { player.hydrate(); }, []);
  useEffect(() => {
    document.body.dataset.audio = s.list ? "on" : "off";
  }, [s.list]);

  const item = s.list?.items[s.index];
  if (!s.list || !item) return null;

  return (
    <div className="audiobar" role="region" aria-label="Recitation player">
      <div className="ab-info">
        <strong>{s.list.title}</strong>
        <span>
          {title(item.sura)} · {t("ayah")} {n(item.aya)} · {n(s.index + 1)}/{n(s.list.items.length)}
        </span>
        {s.error && <span className="ab-err" role="alert">{s.error}</span>}
      </div>
      <div className="ab-controls">
        <button type="button" onClick={() => player.go(-1)} aria-label={t("reader.prev")} disabled={s.index === 0}>⏮</button>
        <button type="button" className="ab-main" onClick={player.togglePlay} aria-label={s.playing ? "Pause" : "Play"}>{s.playing ? "⏸" : "▶"}</button>
        <button type="button" onClick={() => player.go(1)} aria-label={t("reader.next")} disabled={s.index >= s.list.items.length - 1}>⏭</button>
        <button type="button" onClick={player.close} aria-label="Close player">✕</button>
      </div>
    </div>
  );
}
