#!/usr/bin/env python3
"""Import a Tanzil-format translation (lines: sura|aya|text) into public/data/translations/<lang>.json.
Usage: python3 scripts/import-translation.py path/to/bn.bengali.txt bn   (also: en)
Respect the translation's own license/attribution; the app shows the credit you put in <lang>.meta below."""
import json, sys
from pathlib import Path
src, lang = Path(sys.argv[1]), sys.argv[2]
rows = [l.rstrip("\n").split("|", 2) for l in src.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]
assert len(rows) == 6236, f"expected 6236 verses, got {len(rows)}"
out = Path(__file__).resolve().parent.parent / "public/data/translations"; out.mkdir(parents=True, exist_ok=True)
credit = "\n".join(l[1:].strip() for l in src.read_text(encoding="utf-8").splitlines() if l.startswith("#"))[:600]
(out / f"{lang}.json").write_text(json.dumps({"credit": credit, "text": [r[2] for r in rows]}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("ok", lang, len(rows))
