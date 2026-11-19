#!/usr/bin/env python3
"""UQNS — build the Madinah Mushaf page assets from the original archives.

Input : a folder with the extracted PNG pages (NNN.png, 001..604) and, optionally,
        the extracted PDF pages (NNN___Hafs39__DM.pdf).
Output: assets/mushaf/pages/NNN.webp   (1200 px wide, phone + tablet sharp)
        assets/mushaf/pdf/NNN.pdf      (copied, optional, for download/print)

Usage : python3 tools/build_mushaf.py <png_dir> [<pdf_dir>]
Needs : Pillow  (pip install pillow)
"""
import glob, os, re, shutil, sys
from PIL import Image

WIDTH = 1200
QUALITY = 80
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT_WEBP = os.path.join(ROOT, 'assets', 'mushaf', 'pages')
OUT_PDF = os.path.join(ROOT, 'assets', 'mushaf', 'pdf')

def build_webp(png_dir):
    os.makedirs(OUT_WEBP, exist_ok=True)
    count = 0
    for src in sorted(glob.glob(os.path.join(png_dir, '*.png'))):
        n = int(os.path.splitext(os.path.basename(src))[0])
        if not 1 <= n <= 604:
            continue
        im = Image.open(src).convert('RGB')
        h = round(im.height * WIDTH / im.width)
        im.resize((WIDTH, h), Image.LANCZOS).save(
            os.path.join(OUT_WEBP, '%03d.webp' % n), 'WEBP', quality=QUALITY, method=4)
        count += 1
    print('webp pages written:', count)

def copy_pdf(pdf_dir):
    os.makedirs(OUT_PDF, exist_ok=True)
    count = 0
    for src in glob.glob(os.path.join(pdf_dir, '*.pdf')):
        m = re.match(r'(\d{3})', os.path.basename(src))
        if m:
            shutil.copyfile(src, os.path.join(OUT_PDF, m.group(1) + '.pdf'))
            count += 1
    print('pdf pages copied:', count)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    build_webp(sys.argv[1])
    if len(sys.argv) > 2:
        copy_pdf(sys.argv[2])
