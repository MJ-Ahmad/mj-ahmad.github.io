#!/usr/bin/env python3
"""Builds src/data/*.json and public/data/verses.json from ./source/* (Tanzil/MJ QN metadata + text).
Run: python3 scripts/build-data.py"""
import json, re, bisect, xml.etree.ElementTree as ET
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SRC, OUT, PUB = ROOT/"source", ROOT/"src/data", ROOT/"public/data"
OUT.mkdir(parents=True, exist_ok=True); PUB.mkdir(parents=True, exist_ok=True)

x = ET.parse(SRC/"quran-data.xml").getroot()
suras = [{k: v for k, v in s.attrib.items()} for s in x.find("suras")]
start = {int(s["index"]): int(s["start"]) for s in suras}
g = lambda sura, aya: start[int(sura)] + int(aya) - 1          # global verse index, 0-based
def pts(tag): return [dict(sura=int(e.get("sura")), aya=int(e.get("aya")), g=g(e.get("sura"), e.get("aya")), **({"type": e.get("type")} if e.get("type") else {})) for e in x.find(tag)]

pages, juzs, hizbs, manzils, rukus, sajdas = (pts(t) for t in ("pages", "juzs", "hizbs", "manzils", "rukus", "sajdas"))
page_g = [p["g"] for p in pages]
assert len(pages) == 604 and len(juzs) == 30 and len(hizbs) == 240 and len(manzils) == 7 and len(rukus) == 556 and len(sajdas) == 15
assert sum(int(s["ayas"]) for s in suras) == 6236 and sum(int(s["rukus"]) for s in suras) == 556
page_of = lambda gi: bisect.bisect_right(page_g, gi)             # 1-based page number

def num(lst, key="n"):
    for i, e in enumerate(lst, 1): e[key] = i; e["page"] = page_of(e["g"])
    return lst
for e in pages: e["page"] = page_of(e["g"])
num(juzs, "juz"); num(manzils, "manzil"); num(rukus, "ruku"); num(sajdas, "sajda"); num(hizbs, "quarter")
for q in hizbs: q["hizb"] = (q["quarter"] - 1) // 4 + 1; q["part"] = (q["quarter"] - 1) % 4   # part 0 = start of hizb, 1..3 = 1/4, 1/2, 3/4
juz_g = [j["g"] for j in juzs]
out_suras = []
for s in suras:
    i = int(s["index"]); gi = int(s["start"])
    out_suras.append(dict(id=i, name=s["name"], tname=s["tname"], ename=s["ename"], type=s["type"], order=int(s["order"]),
                          ayahs=int(s["ayas"]), rukus=int(s["rukus"]), start=gi, page=page_of(gi), juz=bisect.bisect_right(juz_g, gi)))
dump = lambda name, data: (OUT/name).write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
dump("surahs.json", out_suras); dump("pages.json", pages); dump("juzs.json", juzs); dump("hizbs.json", hizbs)
dump("manzils.json", manzils); dump("rukus.json", rukus); dump("sajdas.json", sajdas)

# ---- verse text + normalized text for search (same normalisation as src/lib/search.ts)
MARKS = re.compile("[\u0640\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]")
def norm(t):
    t = MARKS.sub("", t)
    for a in "أإآٱ": t = t.replace(a, "ا")
    return t.replace("ى", "ي").replace("ة", "ه")
verses = [l.rstrip("\r") for l in (SRC/"quran-simple.txt").read_text(encoding="utf-8").split("\n") if l.strip() and not l.startswith("#")]
assert len(verses) == 6236
# In this source file the basmala is prefixed to verse 1 of surahs 2..114 (except 9). Strip it so every verse is the
# verse alone; the basmala is stored once as "basmala" and shown as a heading by the app.
BASMALA = verses[0]
for sid in range(2, 115):
    if sid == 9: continue
    i = start[sid]
    head, rest = verses[i].split(" ", 4)[:4], verses[i].split(" ", 4)[4]
    assert norm(" ".join(head)) == norm(BASMALA), sid          # (surahs 95 and 97 carry a shadda variant in the source)
    verses[i] = rest
(PUB/"verses.json").write_text(json.dumps({"basmala": BASMALA, "text": verses, "norm": [norm(v) for v in verses]}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("ok", len(out_suras), "suras;", len(verses), "verses")

# ---- word index for the research page: distinct normalised words -> count + verse indices
from collections import defaultdict
occ = defaultdict(list)
for gi, n in enumerate(norm(v) for v in verses):
    for w in n.split():
        if w and (not occ[w] or occ[w][-1] != gi): occ[w].append(gi)
cnt = defaultdict(int)
for gi, v in enumerate(verses):
    for w in norm(v).split():
        if w: cnt[w] += 1
order = sorted(occ, key=lambda w: (-cnt[w], w))
(PUB/"words.json").write_text(json.dumps({"w": order, "n": [cnt[w] for w in order], "o": [occ[w] for w in order]}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("words:", len(order), "distinct;", sum(cnt.values()), "tokens")
