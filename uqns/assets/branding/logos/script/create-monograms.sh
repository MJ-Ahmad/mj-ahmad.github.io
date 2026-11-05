#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# QURAN NAVIGATION
# MONOGRAM GENERATOR
###############################################################################

SOURCE="logos/icon/icon-color.png"

OUTPUT_DIR="logos/monogram"

mkdir -p "$OUTPUT_DIR"

###############################################################################
# DEPENDENCY CHECK
###############################################################################

command -v convert >/dev/null 2>&1 || {
    echo "ERROR: ImageMagick not installed."
    exit 1
}

###############################################################################
# VALIDATION
###############################################################################

if [ ! -f "$SOURCE" ]; then
    echo
    echo "ERROR:"
    echo "Source icon not found:"
    echo "$SOURCE"
    echo
    exit 1
fi

echo
echo "========================================"
echo " MONOGRAM GENERATOR SYSTEM"
echo "========================================"
echo

###############################################################################
# BLACK PNG
###############################################################################

echo "Creating monogram-black.png"

convert "$SOURCE" \
    -resize 512x512 \
    PNG32:"$OUTPUT_DIR/monogram-black.png"

###############################################################################
# WHITE PNG
###############################################################################

echo "Creating monogram-white.png"

convert "$SOURCE" \
    -negate \
    -resize 512x512 \
    PNG32:"$OUTPUT_DIR/monogram-white.png"

###############################################################################
# COLOR PNG
###############################################################################

echo "Creating monogram-color.png"

convert "$SOURCE" \
    -resize 512x512 \
    PNG32:"$OUTPUT_DIR/monogram-color.png"

###############################################################################
# BLACK SVG
###############################################################################

echo "Creating monogram-black.svg"

if [ -f "logo-master-black.svg" ]; then
    cp "logo-master-black.svg" \
       "$OUTPUT_DIR/monogram-black.svg"
else
    convert "$OUTPUT_DIR/monogram-black.png" \
        SVG:"$OUTPUT_DIR/monogram-black.svg"
fi

###############################################################################
# WHITE SVG
###############################################################################

echo "Creating monogram-white.svg"

if [ -f "logo-master-white.svg" ]; then
    cp "logo-master-white.svg" \
       "$OUTPUT_DIR/monogram-white.svg"
else
    convert "$OUTPUT_DIR/monogram-white.png" \
        SVG:"$OUTPUT_DIR/monogram-white.svg"
fi

###############################################################################
# COLOR SVG
###############################################################################

echo "Creating monogram-color.svg"

if [ -f "logo-master-color.svg" ]; then
    cp "logo-master-color.svg" \
       "$OUTPUT_DIR/monogram-color.svg"
else
    convert "$OUTPUT_DIR/monogram-color.png" \
        SVG:"$OUTPUT_DIR/monogram-color.svg"
fi

###############################################################################
# REPORT
###############################################################################

echo
echo "========================================"
echo " GENERATED MONOGRAM FILES"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR"

echo
echo "Verification:"
echo

for FILE in "$OUTPUT_DIR"/*
do
    identify "$FILE" 2>/dev/null || true
done

echo
echo "========================================"
echo " SUCCESS"
echo "========================================"
echo
