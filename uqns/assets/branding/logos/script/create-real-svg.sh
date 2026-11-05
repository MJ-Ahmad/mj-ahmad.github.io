#!/usr/bin/env bash

set -Eeuo pipefail

INPUT="logo-master-white.png"
OUTPUT="logo-master-white.svg"

echo "===================================="
echo " REAL SVG GENERATOR"
echo "===================================="

command -v convert >/dev/null || {
    echo "ImageMagick not installed"
    exit 1
}

command -v potrace >/dev/null || {
    echo "Potrace not installed"
    echo
    echo "Install:"
    echo "apt update && apt install -y potrace"
    exit 1
}

TMP="logo-master-white.pgm"

echo
echo "[1/4] Converting PNG -> PGM"

convert "$INPUT" \
    -alpha remove \
    -colorspace Gray \
    "$TMP"

echo "[2/4] Tracing Vector"

potrace \
    "$TMP" \
    -s \
    -o "$OUTPUT" \
    --tight

echo "[3/4] Cleaning"

rm -f "$TMP"

echo "[4/4] Done"

echo
echo "Created:"
echo "$OUTPUT"

ls -lh "$OUTPUT"
