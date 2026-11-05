#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# QURAN NAVIGATION
# OPEN GRAPH GENERATOR
###############################################################################

SOURCE="logos/icon/icon-color.png"

OUTPUT_DIR="logos/open-graph"

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

###############################################################################
# BANNER
###############################################################################

echo
echo "========================================"
echo " OPEN GRAPH GENERATOR"
echo "========================================"
echo

###############################################################################
# OG IMAGE
# Recommended: 1200x630
###############################################################################

echo "Creating og-image.png"

convert \
    -size 1200x630 xc:"#0F172A" \
    "$SOURCE" \
    -gravity center \
    -geometry +0+0 \
    -composite \
    PNG32:"$OUTPUT_DIR/og-image.png"

###############################################################################
# TWITTER CARD
# Recommended: 1600x900
###############################################################################

echo "Creating twitter-card.png"

convert \
    -size 1600x900 xc:"#111827" \
    "$SOURCE" \
    -gravity center \
    -geometry +0+0 \
    -composite \
    PNG32:"$OUTPUT_DIR/twitter-card.png"

###############################################################################
# SOCIAL BANNER
# Recommended: 1500x500
###############################################################################

echo "Creating social-banner.png"

convert \
    -size 1500x500 xc:"#0B1220" \
    "$SOURCE" \
    -gravity center \
    -geometry +0+0 \
    -composite \
    PNG32:"$OUTPUT_DIR/social-banner.png"

###############################################################################
# REPORT
###############################################################################

echo
echo "========================================"
echo " GENERATED OPEN GRAPH FILES"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR"

echo
echo "Verification:"
echo

for FILE in "$OUTPUT_DIR"/*.png
do
    identify "$FILE"
done

echo
echo "========================================"
echo " SUCCESS"
echo "========================================"
echo
