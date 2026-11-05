#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# QURAN NAVIGATION
# FAVICON GENERATOR
###############################################################################

SOURCE="logos/icon/icon-color.png"

FAVICON_DIR="logos/favicon"

mkdir -p "$FAVICON_DIR"

###############################################################################
# DEPENDENCY CHECK
###############################################################################

command -v convert >/dev/null 2>&1 || {
    echo "ERROR: ImageMagick is not installed."
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
echo " FAVICON GENERATOR SYSTEM"
echo "========================================"
echo

###############################################################################
# GENERATE FAVICONS
###############################################################################

for SIZE in \
16 \
32 \
48 \
64 \
96 \
128 \
256 \
512
do

    OUTPUT="${FAVICON_DIR}/favicon-${SIZE}.png"

    echo "Creating favicon-${SIZE}.png"

    convert "$SOURCE" \
        -background none \
        -gravity center \
        -resize "${SIZE}x${SIZE}" \
        -extent "${SIZE}x${SIZE}" \
        PNG32:"$OUTPUT"

done

###############################################################################
# VERIFY
###############################################################################

echo
echo "========================================"
echo " GENERATED FAVICONS"
echo "========================================"
echo

ls -lh "$FAVICON_DIR"

echo
echo "Verification:"
echo

for FILE in "$FAVICON_DIR"/*.png
do
    identify "$FILE"
done

echo
echo "========================================"
echo " SUCCESS"
echo "========================================"
echo
