#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# Quran Navigation
# Icon Asset Generator
###############################################################################

LOGO_BLACK="logo-master-black.png"
LOGO_WHITE="logo-master-white.png"

ICON_DIR="logos/icon"

mkdir -p "$ICON_DIR"

for cmd in convert identify
do
    command -v "$cmd" >/dev/null 2>&1 || {
        echo "Missing dependency: $cmd"
        exit 1
    }
done

echo
echo "========================================"
echo " ICON GENERATOR SYSTEM"
echo "========================================"
echo

###############################################################################
# Validation
###############################################################################

[ -f "$LOGO_BLACK" ] || {
    echo "Missing: $LOGO_BLACK"
    exit 1
}

[ -f "$LOGO_WHITE" ] || {
    echo "Missing: $LOGO_WHITE"
    exit 1
}

###############################################################################
# Create icon-black.png
###############################################################################

echo "Creating icon-black.png"

convert "$LOGO_BLACK" \
    -trim \
    +repage \
    -resize 512x512 \
    PNG32:"$ICON_DIR/icon-black.png"

###############################################################################
# Create icon-black.svg
###############################################################################

echo "Creating icon-black.svg"

cp logo-master-black.svg \
   "$ICON_DIR/icon-black.svg"

###############################################################################
# Create icon-white.png
###############################################################################

echo "Creating icon-white.png"

convert "$LOGO_WHITE" \
    -trim \
    +repage \
    -resize 512x512 \
    PNG32:"$ICON_DIR/icon-white.png"

###############################################################################
# Create icon-white.svg
###############################################################################

echo "Creating icon-white.svg"

cp logo-master-white.svg \
   "$ICON_DIR/icon-white.svg"

###############################################################################
# Create icon-color.png
###############################################################################

echo "Creating icon-color.png"

convert "$LOGO_BLACK" \
    -fuzz 10% \
    -transparent black \
    -trim \
    +repage \
    -resize 512x512 \
    PNG32:"$ICON_DIR/icon-color.png"

###############################################################################
# Create icon-color.svg
###############################################################################

echo "Creating icon-color.svg"

if [ -f logo-master-color.svg ]
then
    cp logo-master-color.svg \
       "$ICON_DIR/icon-color.svg"
else
    cp logo-master-black.svg \
       "$ICON_DIR/icon-color.svg"
fi

###############################################################################
# Report
###############################################################################

echo
echo "========================================"
echo " GENERATED ICON FILES"
echo "========================================"
echo

ls -lh "$ICON_DIR"

echo
echo "Completed Successfully."
