"use client";

import { RECITERS, availableStyles, findReciter, resolveStyle, type Style } from "@/lib/reciters";
import { player, usePlayer } from "@/lib/player";
import { useT } from "@/lib/i18n";

/** Reciter and recitation style. Choices are saved and used by every play button. */
export default function ReciterPicker() {
  const s = usePlayer();
  const { t } = useT();
  const reciter = findReciter(s.reciterId);
  const styles = availableStyles(reciter);
  const style = resolveStyle(reciter, s.style);
  const styleLabel: Record<Style, string> = { murattal: t("settings.murattal"), mujawwad: t("settings.mujawwad") };

  return (
    <div className="reciter" role="group" aria-label={t("settings.reciter")}>
      <select value={reciter.id} onChange={(e) => player.setReciter(e.target.value)} aria-label={t("settings.reciter")} title={reciter.name.en}>
        {RECITERS.map((r) => (
          <option key={r.id} value={r.id}>{r.name.bn}</option>
        ))}
      </select>
      {styles.length > 1 && (
        <select value={style} onChange={(e) => player.setStyle(e.target.value as Style)} aria-label={t("settings.style")}>
          {styles.map((st) => (
            <option key={st} value={st}>{styleLabel[st]}</option>
          ))}
        </select>
      )}
    </div>
  );
}
