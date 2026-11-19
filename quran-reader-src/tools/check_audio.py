#!/usr/bin/env python3
"""Checks every reciter folder in data/reciters.json against everyayah.com.

For each murattal/mujawwad folder it requests the first ayah (001001.mp3) and reports
whether the server answers with audio. Run it before a release:
    python3 tools/check_audio.py
Needs network access. Exit code 1 if any folder fails.
"""
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "data/reciters.json").read_text(encoding="utf-8"))
base = data["base"]
failed = 0

for r in data["reciters"]:
    for style in ("murattal", "mujawwad"):
        folder = r.get(style)
        if not folder:
            continue
        url = f"{base}{folder}/001001.mp3"
        try:
            req = urllib.request.Request(url, method="HEAD")
            with urllib.request.urlopen(req, timeout=15) as res:
                ok = res.status == 200 and "audio" in (res.headers.get("Content-Type") or "")
                status = f"{res.status} {res.headers.get('Content-Type')}"
        except urllib.error.HTTPError as e:
            ok, status = False, f"HTTP {e.code}"
        except Exception as e:  # network or DNS error
            ok, status = False, type(e).__name__
        print(("OK  " if ok else "FAIL"), r["id"], style, folder, status)
        if not ok:
            failed += 1

print(f"\n{failed} folder(s) failed" if failed else "\nall folders OK")
sys.exit(1 if failed else 0)
