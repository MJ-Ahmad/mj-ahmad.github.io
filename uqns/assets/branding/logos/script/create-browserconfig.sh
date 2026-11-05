#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# Quran Navigation
# BrowserConfig Generator
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

cat > "$OUTPUT_DIR/browserconfig.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>

<!--
===============================================================================
Quran Navigation

Project      : Quran Navigation
Initiative   : MJ Ahmad Quran Navigator Project
Organization : Quraner Fariwala
Maintainer   : MJ Ahmad

Website       : https://mj-ahmad.github.io
Project URL   : https://mj-ahmad.github.io/qn

Version       : 1.0.0
Status        : Active
===============================================================================
-->

<browserconfig>

    <msapplication>

        <tile>

            <square70x70logo
                src="/logos/favicon/favicon-96.png" />

            <square150x150logo
                src="/logos/app-icons/app-icon-256.png" />

            <square310x310logo
                src="/logos/app-icons/app-icon-512.png" />

            <TileColor>#DDB441</TileColor>

        </tile>

    </msapplication>

</browserconfig>
EOF

echo
echo "========================================"
echo " BROWSERCONFIG GENERATED"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR/browserconfig.xml"

echo
echo "Created:"
echo "$OUTPUT_DIR/browserconfig.xml"

echo
echo "Done."
ó

