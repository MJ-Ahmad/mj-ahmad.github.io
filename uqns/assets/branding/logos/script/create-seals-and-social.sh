#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# QURAN NAVIGATION
# SEAL + SOCIAL AVATAR GENERATOR
###############################################################################

SOURCE="logos/icon/icon-color.png"

SEAL_DIR="logos/seal"
SOCIAL_DIR="logos/social"

mkdir -p "$SEAL_DIR"
mkdir -p "$SOCIAL_DIR"

###############################################################################
# DEPENDENCIES
###############################################################################

command -v convert >/dev/null 2>&1 || {
    echo "ImageMagick not installed."
    exit 1
}

###############################################################################
# VALIDATION
###############################################################################

if [ ! -f "$SOURCE" ]; then
    echo
    echo "ERROR: Source icon not found:"
    echo "$SOURCE"
    echo
    exit 1
fi

echo
echo "========================================"
echo " SEAL & SOCIAL GENERATOR"
echo "========================================"
echo

###############################################################################
# OFFICIAL SEAL
###############################################################################

echo "Creating official-seal.png"

convert "$SOURCE" \
    -background none \
    -gravity center \
    -resize 1024x1024 \
    PNG32:"$SEAL_DIR/official-seal.png"

convert "$SEAL_DIR/official-seal.png" \
    SVG:"$SEAL_DIR/official-seal.svg"

###############################################################################
# ROUND SEAL
###############################################################################

echo "Creating round-seal.png"

convert "$SOURCE" \
    -alpha set \
    -background none \
    -gravity center \
    -resize 1024x1024 \
    -extent 1024x1024 \
    PNG32:"$SEAL_DIR/round-seal.png"

convert "$SEAL_DIR/round-seal.png" \
    SVG:"$SEAL_DIR/round-seal.svg"

###############################################################################
# SQUARE SEAL
###############################################################################

echo "Creating square-seal.png"

convert "$SOURCE" \
    -background none \
    -gravity center \
    -resize 1024x1024 \
    -extent 1024x1024 \
    PNG32:"$SEAL_DIR/square-seal.png"

convert "$SEAL_DIR/square-seal.png" \
    SVG:"$SEAL_DIR/square-seal.svg"

###############################################################################
# SOCIAL FILES
###############################################################################

echo "Creating Social Avatars"

convert "$SOURCE" \
    -resize 512x512 \
    PNG32:"$SOCIAL_DIR/facebook-avatar-512.png"

convert "$SOURCE" \
    -resize 512x512 \
    PNG32:"$SOCIAL_DIR/github-avatar-512.png"

convert "$SOURCE" \
    -resize 1024x1024 \
    PNG32:"$SOCIAL_DIR/github-avatar-1024.png"

convert "$SOURCE" \
    -resize 800x800 \
    PNG32:"$SOCIAL_DIR/linkedin-avatar-800.png"

convert "$SOURCE" \
    -resize 512x512 \
    PNG32:"$SOCIAL_DIR/telegram-avatar-512.png"

convert "$SOURCE" \
    -resize 800x800 \
    PNG32:"$SOCIAL_DIR/youtube-avatar-800.png"

###############################################################################
# REPORT
###############################################################################

echo
echo "========================================"
echo " SEAL FILES"
echo "========================================"

ls -lh "$SEAL_DIR"

echo
echo "========================================"
echo " SOCIAL FILES"
echo "========================================"

ls -lh "$SOCIAL_DIR"

echo
echo "========================================"
echo " SUCCESS"
echo "========================================"
echo
