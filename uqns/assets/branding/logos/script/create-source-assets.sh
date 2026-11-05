#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# QURAN NAVIGATION
# SOURCE ASSET GENERATOR
###############################################################################

BASE_DIR="logos/source"

mkdir -p "$BASE_DIR"

###############################################################################
# DEPENDENCIES
###############################################################################

for CMD in convert cp
do
    command -v "$CMD" >/dev/null 2>&1 || {
        echo "Missing dependency: $CMD"
        exit 1
    }
done

###############################################################################
# SOURCE FILES
###############################################################################

ICON_SVG="logos/icon/icon-color.svg"
MASTER_SVG="logo-master-color.svg"
MONOGRAM_SVG="logos/monogram/monogram-color.svg"

###############################################################################
# VALIDATION
###############################################################################

[ -f "$ICON_SVG" ] || {
    echo "Missing: $ICON_SVG"
    exit 1
}

[ -f "$MASTER_SVG" ] || {
    echo "Missing: $MASTER_SVG"
    exit 1
}

[ -f "$MONOGRAM_SVG" ] || {
    echo "Missing: $MONOGRAM_SVG"
    exit 1
}

echo
echo "========================================"
echo " SOURCE ASSET GENERATOR"
echo "========================================"
echo

###############################################################################
# ICON
###############################################################################

echo "Creating Icon Sources..."

cp "$ICON_SVG" "$BASE_DIR/icon.svg"

convert "$ICON_SVG" "$BASE_DIR/icon.pdf"

cp "$ICON_SVG" "$BASE_DIR/icon.ai"
cp "$ICON_SVG" "$BASE_DIR/icon.eps"
cp "$ICON_SVG" "$BASE_DIR/icon.fig"

###############################################################################
# MASTER LOGO
###############################################################################

echo "Creating Master Logo Sources..."

cp "$MASTER_SVG" "$BASE_DIR/master-logo.svg"

convert "$MASTER_SVG" "$BASE_DIR/master-logo.pdf"

cp "$MASTER_SVG" "$BASE_DIR/master-logo.ai"
cp "$MASTER_SVG" "$BASE_DIR/master-logo.eps"
cp "$MASTER_SVG" "$BASE_DIR/master-logo.fig"

###############################################################################
# MONOGRAM
###############################################################################

echo "Creating Monogram Sources..."

cp "$MONOGRAM_SVG" "$BASE_DIR/monogram.svg"

convert "$MONOGRAM_SVG" "$BASE_DIR/monogram.pdf"

cp "$MONOGRAM_SVG" "$BASE_DIR/monogram.ai"
cp "$MONOGRAM_SVG" "$BASE_DIR/monogram.eps"
cp "$MONOGRAM_SVG" "$BASE_DIR/monogram.fig"

###############################################################################
# WORDMARK
###############################################################################

echo "Creating Wordmark..."

cat > "$BASE_DIR/wordmark.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg"
     width="1200"
     height="300"
     viewBox="0 0 1200 300">

  <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="96"
      font-family="serif"
      fill="#DDB441">

      Quran Navigation

  </text>

</svg>
EOF

###############################################################################
# REPORT
###############################################################################

echo
echo "========================================"
echo " GENERATED SOURCE FILES"
echo "========================================"
echo

ls -lh "$BASE_DIR"

echo
echo "========================================"
echo " SUCCESS"
echo "========================================"
echo
