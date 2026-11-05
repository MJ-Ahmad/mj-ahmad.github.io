#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# QURAN NAVIGATION
# RESPONSIVE LOGO GENERATOR
###############################################################################

SOURCE_PNG="logo-master-color.png"
SOURCE_SVG="logo-master-color.svg"

ROOT_DIR="logos/responsive"

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

[ -f "$SOURCE_PNG" ] || {
    echo "Missing: $SOURCE_PNG"
    exit 1
}

[ -f "$SOURCE_SVG" ] || {
    echo "Missing: $SOURCE_SVG"
    exit 1
}

###############################################################################
# DIRECTORIES
###############################################################################

mkdir -p "$ROOT_DIR/xs"
mkdir -p "$ROOT_DIR/sm"
mkdir -p "$ROOT_DIR/md"
mkdir -p "$ROOT_DIR/lg"
mkdir -p "$ROOT_DIR/xl"

###############################################################################
# BANNER
###############################################################################

echo
echo "========================================"
echo " RESPONSIVE LOGO GENERATOR"
echo "========================================"
echo

###############################################################################
# XS
###############################################################################

echo "Creating XS"

convert "$SOURCE_PNG" \
    -resize 128x128 \
    PNG32:"$ROOT_DIR/xs/logo-xs.png"

cp "$SOURCE_SVG" \
   "$ROOT_DIR/xs/logo-xs.svg"

###############################################################################
# SM
###############################################################################

echo "Creating SM"

convert "$SOURCE_PNG" \
    -resize 256x256 \
    PNG32:"$ROOT_DIR/sm/logo-sm.png"

cp "$SOURCE_SVG" \
   "$ROOT_DIR/sm/logo-sm.svg"

###############################################################################
# MD
###############################################################################

echo "Creating MD"

convert "$SOURCE_PNG" \
    -resize 512x512 \
    PNG32:"$ROOT_DIR/md/logo-md.png"

cp "$SOURCE_SVG" \
   "$ROOT_DIR/md/logo-md.svg"

###############################################################################
# LG
###############################################################################

echo "Creating LG"

convert "$SOURCE_PNG" \
    -resize 768x768 \
    PNG32:"$ROOT_DIR/lg/logo-lg.png"

cp "$SOURCE_SVG" \
   "$ROOT_DIR/lg/logo-lg.svg"

###############################################################################
# XL
###############################################################################

echo "Creating XL"

convert "$SOURCE_PNG" \
    -resize 1024x1024 \
    PNG32:"$ROOT_DIR/xl/logo-xl.png"

cp "$SOURCE_SVG" \
   "$ROOT_DIR/xl/logo-xl.svg"

###############################################################################
# REPORT
###############################################################################

echo
echo "========================================"
echo " GENERATED RESPONSIVE LOGOS"
echo "========================================"
echo

tree "$ROOT_DIR"

echo
echo "Verification:"
echo

find "$ROOT_DIR" -type f -name "*.png" | sort | while read -r FILE
do
    identify "$FILE"
done

echo
echo "========================================"
echo " SUCCESS"
echo "========================================"
echo
