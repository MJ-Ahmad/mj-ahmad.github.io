#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# Quran Navigation
# Site Web Manifest Generator
#
# Project      : Quran Navigation
# Initiative   : MJ Ahmad Quran Navigator Project
# Organization : Quraner Fariwala
# Maintainer   : MJ Ahmad
# Website      : https://mj-ahmad.github.io
# Project URL  : https://mj-ahmad.github.io/qn
# Version      : 1.0.0
###############################################################################

OUTPUT_DIR="logos/manifest"

mkdir -p "$OUTPUT_DIR"

cat > "$OUTPUT_DIR/site.webmanifest" <<'EOF'
{
  "name": "Quran Navigation",
  "short_name": "QuranNav",
  "description": "A modern Quran reading, navigation and study platform developed as part of the MJ Ahmad Quran Navigator Project.",
  "lang": "en",
  "dir": "ltr",

  "id": "/",
  "start_url": "/",
  "scope": "/",

  "display": "standalone",
  "display_override": [
    "window-controls-overlay",
    "standalone",
    "minimal-ui"
  ],

  "orientation": "portrait-primary",

  "background_color": "#000000",
  "theme_color": "#DDB441",

  "categories": [
    "education",
    "books",
    "reference",
    "religion"
  ],

  "icons": [
    {
      "src": "/logos/favicon/favicon-16.png",
      "sizes": "16x16",
      "type": "image/png"
    },
    {
      "src": "/logos/favicon/favicon-32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/logos/favicon/favicon-96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/logos/app-icons/app-icon-128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/logos/app-icons/android-icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logos/app-icons/app-icon-256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "/logos/app-icons/android-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],

  "shortcuts": [
    {
      "name": "Read Quran",
      "short_name": "Read",
      "description": "Open Quran reader",
      "url": "/"
    },
    {
      "name": "Pages",
      "short_name": "Pages",
      "description": "Browse Quran pages",
      "url": "/pages"
    }
  ],

  "prefer_related_applications": false,

  "author": "MJ Ahmad",

  "developer": {
    "name": "MJ Ahmad",
    "url": "https://mj-ahmad.github.io"
  },

  "metadata": {
    "project": "Quran Navigation",
    "initiative": "MJ Ahmad Quran Navigator Project",
    "organization": "Quraner Fariwala",
    "website": "https://mj-ahmad.github.io",
    "project_url": "https://mj-ahmad.github.io/qn",
    "version": "1.0.0",
    "status": "Active",
    "last_updated": "2026-11-05"
  }
}
EOF

echo
echo "========================================"
echo " SITE.WEBMANIFEST GENERATED"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR/site.webmanifest"

echo
echo "Created:"
echo "$OUTPUT_DIR/site.webmanifest"

echo
echo "Done."
