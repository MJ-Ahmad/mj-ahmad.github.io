#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# QURAN NAVIGATION
# WATERMARK + WEB + WORDMARK GENERATOR
###############################################################################

SOURCE_ICON="logos/icon/icon-color.png"
SOURCE_SVG="logo-master-color.svg"

WATERMARK_DIR="logos/watermark"
WEB_DIR="logos/web"
WORDMARK_DIR="logos/wordmark"

mkdir -p "$WATERMARK_DIR"
mkdir -p "$WEB_DIR"
mkdir -p "$WORDMARK_DIR"

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

[ -f "$SOURCE_ICON" ] || {
    echo "Missing: $SOURCE_ICON"
    exit 1
}

[ -f "$SOURCE_SVG" ] || {
    echo "Missing: $SOURCE_SVG"
    exit 1
}

###############################################################################
# WATERMARKS
###############################################################################

echo
echo "========================================"
echo " GENERATING WATERMARKS"
echo "========================================"

convert "$SOURCE_ICON" \
    -alpha on \
    -evaluate multiply 0.20 \
    -resize 1200x1200 \
    PNG32:"$WATERMARK_DIR/watermark-dark.png"

cp "$SOURCE_SVG" \
   "$WATERMARK_DIR/watermark-dark.svg"

convert "$SOURCE_ICON" \
    -negate \
    -alpha on \
    -evaluate multiply 0.20 \
    -resize 1200x1200 \
    PNG32:"$WATERMARK_DIR/watermark-light.png"

cp "$SOURCE_SVG" \
   "$WATERMARK_DIR/watermark-light.svg"

###############################################################################
# WEB LOGOS
###############################################################################

echo
echo "========================================"
echo " GENERATING WEB LOGOS"
echo "========================================"

convert "$SOURCE_ICON" \
    -resize 1200x400 \
    -background none \
    -gravity center \
    -extent 1200x400 \
    PNG32:"$WEB_DIR/logo-wide.png"

convert "$SOURCE_ICON" \
    -resize 800x800 \
    -alpha on \
    -evaluate multiply 0.85 \
    PNG32:"$WEB_DIR/logo-soft.png"

###############################################################################
# WORDMARKS
###############################################################################

echo
echo "========================================"
echo " GENERATING WORDMARKS"
echo "========================================"

cat > "$WORDMARK_DIR/wordmark-color.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg"
     width="1600"
     height="300"
     viewBox="0 0 1600 300">

  <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="serif"
      font-size="120"
      fill="#DDB441">

      Quran Navigation

  </text>

</svg>
EOF

cat > "$WORDMARK_DIR/wordmark-black.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg"
     width="1600"
     height="300"
     viewBox="0 0 1600 300">

  <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="serif"
      font-size="120"
      fill="#000000">

      Quran Navigation

  </text>

</svg>
EOF

cat > "$WORDMARK_DIR/wordmark-white.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg"
     width="1600"
     height="300"
     viewBox="0 0 1600 300">

  <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="serif"
      font-size="120"
      fill="#FFFFFF">

      Quran Navigation

  </text>

</svg>
EOF

###############################################################################
# SVG → PNG
###############################################################################

convert "$WORDMARK_DIR/wordmark-color.svg" \
        "$WORDMARK_DIR/wordmark-color.png"

convert "$WORDMARK_DIR/wordmark-black.svg" \
        "$WORDMARK_DIR/wordmark-black.png"

convert "$WORDMARK_DIR/wordmark-white.svg" \
        "$WORDMARK_DIR/wordmark-white.png"

###############################################################################
# REPORT
###############################################################################

echo
echo "========================================"
echo " GENERATED FILES"
echo "========================================"
echo

tree "$WATERMARK_DIR"
echo

tree "$WEB_DIR"
echo

tree "$WORDMARK_DIR"
echo

echo "========================================"
echo " SUCCESS"
echo "========================================"
echo
