#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# Quran Navigation
# Master Logo Verification & Repair Tool
###############################################################################

LOGO_DIR="assets/branding/logos"

BLACK_LOGO="${LOGO_DIR}/logo-master-black.png"
WHITE_LOGO="${LOGO_DIR}/logo-master-white.png"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

###############################################################################
# Dependency Check
###############################################################################

require() {
    command -v "$1" >/dev/null 2>&1 || {
        echo -e "${RED}Missing dependency:${NC} $1"
        exit 1
    }
}

require file
require identify
require convert

###############################################################################
# Banner
###############################################################################

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} MASTER LOGO VERIFICATION SYSTEM${NC}"
echo -e "${BLUE}========================================${NC}"
echo

###############################################################################
# Check Function
###############################################################################

verify_logo() {

    LOGO="$1"

    echo
    echo "Checking: $(basename "$LOGO")"

    if [ ! -f "$LOGO" ]; then
        echo -e "${RED}ERROR:${NC} File missing"
        return 1
    fi

    FILE_TYPE=$(file -b "$LOGO")

    if ! echo "$FILE_TYPE" | grep -iq "PNG"; then

        echo -e "${YELLOW}Extension mismatch detected${NC}"

        TMP=$(mktemp).png

        convert "$LOGO" PNG32:"$TMP"

        mv "$TMP" "$LOGO"

        echo "Rebuilt as valid PNG"
    fi

    if ! identify "$LOGO" >/dev/null 2>&1; then
        echo -e "${RED}Corrupted image:${NC} $LOGO"
        return 1
    fi

    TMP=$(mktemp).png

    convert "$LOGO" \
        -colorspace sRGB \
        -strip \
        PNG32:"$TMP"

    mv "$TMP" "$LOGO"

    WIDTH=$(identify -format "%w" "$LOGO")
    HEIGHT=$(identify -format "%h" "$LOGO")

    echo -e "${GREEN}VALID${NC}"
    echo "Resolution : ${WIDTH}x${HEIGHT}"
}

###############################################################################
# Run Verification
###############################################################################

verify_logo "$BLACK_LOGO"
verify_logo "$WHITE_LOGO"

###############################################################################
# Final Report
###############################################################################

echo
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} VERIFICATION COMPLETED${NC}"
echo -e "${GREEN}========================================${NC}"
echo

echo "Master Logos Ready:"
echo

ls -lh "$BLACK_LOGO" "$WHITE_LOGO"

echo
echo "Done."
