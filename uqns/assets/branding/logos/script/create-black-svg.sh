#!/usr/bin/env bash

set -Eeuo pipefail

INPUT="logo-master-black.png"
OUTPUT="logo-master-black.svg"

if [ ! -f "$INPUT" ]; then
    echo "File not found: $INPUT"
    exit 1
fi

echo "Creating vector SVG..."

# PNG → PBM
convert "$INPUT" \
    -alpha off \
    -threshold 50% \
    logo-master-black.pbm

# PBM → SVG
potrace \
    logo-master-black.pbm \
    -s \
    -o "$OUTPUT"

rm -f logo-master-black.pbm

echo
echo "Done:"
echo "$OUTPUT"

file "$OUTPUT"
