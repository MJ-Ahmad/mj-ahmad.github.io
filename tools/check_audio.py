#!/usr/bin/env python3
"""UQNS — check that every reciter folder in data/reciters.js serves ayah audio.

Run on a machine with internet access:  python3 tools/check_audio.py
For each reciter and style it requests the first ayah (001001) and the
ayat al-kursi (002255) and reports OK / FAIL, so folder names can be corrected
in data/reciters.js before release.
"""
import json, os, re, sys, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = open(os.path.join(ROOT, 'data', 'reciters.js'), encoding='utf8').read()
BASE = re.search(r"UQNS_AUDIO_BASE\s*=\s*'([^']+)'", SRC).group(1)
TESTS = ['001001', '002255']

def reciters():
    body = SRC[SRC.index('UQNS_RECITERS = ') + len('UQNS_RECITERS = '):]
    body = body[:body.rindex('];') + 1]
    body = re.sub(r'(\w+):', r'"\1":', body)            # quote keys
    body = re.sub(r"'([^']*)'", r'"\1"', body)           # single -> double quotes
    return json.loads(body)

def ok(url):
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status == 200
    except Exception:
        return False

bad = 0
for r in reciters():
    for style in ('murattal', 'mujawwad'):
        folder = r.get(style)
        if not folder:
            continue
        res = [ok(BASE + folder + '/' + t + '.mp3') for t in TESTS]
        status = 'OK  ' if all(res) else 'FAIL'
        bad += 0 if all(res) else 1
        print(status, r['id'].ljust(12), style.ljust(9), folder)
print('\nfailures:', bad)
sys.exit(1 if bad else 0)
