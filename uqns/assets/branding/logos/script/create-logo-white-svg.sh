#!/usr/bin/env bash

set -Eeuo pipefail

INPUT="logo-master-white.png"
OUTPUT="logo-master-white.svg"

convert "$INPUT" \
    -fuzz 20% \
    -transparent white \
    -alpha off \
    -threshold 70% \
    logo-master-white.pbm

potrace \
    logo-master-white.pbm \
    -s \
    -o "$OUTPUT" \
    --tight

rm -f logo-master-white.pbm

echo "Done:"
ls -lh "$OUTPUT"
