#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# Master Logo Repair System
###############################################################################

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

require() {
    command -v "$1" >/dev/null 2>&1 || {
        echo "Missing dependency: $1"
        exit 1
    }
}

require file
require identify
require convert

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} MASTER LOGO PNG REPAIR SYSTEM${NC}"
echo -e "${BLUE}========================================${NC}"
echo

mkdir -p backup-original

for LOGO in \
    logo-master-black.png \
    logo-master-white.png
do

    echo
    echo "Processing: $LOGO"

    if [ ! -f "$LOGO" ]
    then
        echo -e "${RED}Missing:${NC} $LOGO"
        continue
    fi

    cp "$LOGO" "backup-original/$LOGO"

    FILE_INFO=$(file -b "$LOGO")

    echo "Current Format:"
    echo "$FILE_INFO"

    TMP="${LOGO}.tmp.png"

    convert "$LOGO" \
        -colorspace sRGB \
        -strip \
        PNG32:"$TMP"

    mv "$TMP" "$LOGO"

    echo
    echo "Converted Successfully"

    echo
    echo "[Verification]"

    file "$LOGO"

    WIDTH=$(identify -format "%w" "$LOGO")
    HEIGHT=$(identify -format "%h" "$LOGO")

    echo "Resolution : ${WIDTH}x${HEIGHT}"

done

echo
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} REPAIR COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}========================================${NC}"
echo

echo "Backup Folder:"
echo "./backup-original"
echo
