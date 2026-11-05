#!/usr/bin/env bash

###############################################################################
# Quran PDF → Mobile Optimized PNG Converter
#
# Author  : ChatGPT
# Version : 3.0 Production
#
# Input
#   quran-pages.pdf/
#       001___Hafs39__DM.pdf
#       ...
#       604___Hafs39__DM.pdf
#
# Output
#   quran-pages.png/
#       001.png
#       ...
#       604.png
#
###############################################################################

set -Eeuo pipefail

#############################################
# Configuration
#############################################

PDF_DIR="quran-pages.pdf"
PNG_DIR="quran-pages.png"

# Mobile Quran Quality
DPI=450

# White Border
BORDER=20

# CPU Threads
THREADS=$(nproc)

#############################################
# Colors
#############################################

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

#############################################
# Dependency Check
#############################################

require()
{
    if ! command -v "$1" >/dev/null 2>&1
    then
        echo -e "${RED}ERROR:${NC} Missing dependency: $1"
        exit 1
    fi
}

require pdftoppm
require convert
require find
require awk
require sort

#############################################
# Validation
#############################################

if [ ! -d "$PDF_DIR" ]
then
    echo -e "${RED}Directory not found:${NC} $PDF_DIR"
    exit 1
fi

mkdir -p "$PNG_DIR"

TOTAL=$(find "$PDF_DIR" -type f -name "*.pdf" | wc -l)

if [ "$TOTAL" -eq 0 ]
then
    echo -e "${RED}No PDF files found.${NC}"
    exit 1
fi

echo
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE} Quran PDF → PNG Converter${NC}"
echo -e "${BLUE}=========================================${NC}"
echo
echo "PDF Files : $TOTAL"
echo "DPI       : $DPI"
echo "Threads   : $THREADS"
echo

#############################################
# Worker Function
#############################################

convert_file()
{
    PDF="$1"

    BASENAME=$(basename "$PDF")

    PAGE=$(echo "$BASENAME" | cut -d'_' -f1)

    FINAL_OUTPUT="${PNG_DIR}/${PAGE}.png"

    if [ -f "$FINAL_OUTPUT" ]
    then
        echo "SKIP $PAGE"
        return
    fi

    TMP="${PNG_DIR}/${PAGE}"

    pdftoppm \
        -png \
        -r "$DPI" \
        "$PDF" \
        "$TMP" \
        >/dev/null 2>&1

    GENERATED="${TMP}-1.png"

    if [ ! -f "$GENERATED" ]
    then
        echo "FAILED $PAGE"
        return
    fi

    convert "$GENERATED" \
        -trim \
        -bordercolor white \
        -border "$BORDER" \
        -strip \
        "$FINAL_OUTPUT"

    rm -f "$GENERATED"

    echo "DONE $PAGE"
}

export PDF_DIR
export PNG_DIR
export DPI
export BORDER

export -f convert_file

#############################################
# Parallel Processing
#############################################

find "$PDF_DIR" \
    -type f \
    -name "*.pdf" \
    | sort \
    | xargs -I {} -P "$THREADS" bash -c \
    'convert_file "$@"' _ {}

#############################################
# Verification
#############################################

echo
echo "Verifying..."

PNG_COUNT=$(find "$PNG_DIR" -type f -name "*.png" | wc -l)

echo
echo "PDF Count : $TOTAL"
echo "PNG Count : $PNG_COUNT"

if [ "$PNG_COUNT" -eq "$TOTAL" ]
then
    echo
    echo -e "${GREEN}SUCCESS${NC}"
    echo "All Quran pages converted successfully."
else
    echo
    echo -e "${YELLOW}WARNING${NC}"
    echo "Some files were not converted."
    echo "Missing : $((TOTAL-PNG_COUNT))"
fi

#############################################
# File Size Report
#############################################

echo
echo "Output Size:"
du -sh "$PNG_DIR"

echo
echo "Finished."
