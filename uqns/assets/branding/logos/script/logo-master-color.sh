#!/usr/bin/env bash

set -Eeuo pipefail

INPUT="logo-master-black.png"

GOLD="#DDB441"

convert "$INPUT" \
    -fuzz 10% \
    -transparent black \
    -fill "$GOLD" \
    -opaque "#DDB441" \
    PNG32:logo-master-color.png

convert logo-master-color.png \
    -alpha off \
    -threshold 50% \
    logo-master-color.pbm

potrace \
    logo-master-color.pbm \
    -s \
    -o logo-master-color.svg \
    --tight

rm -f logo-master-color.pbm

echo
echo "Generated:"
echo

ls -lh \
logo-master-color.png \
logo-master-color.svg
