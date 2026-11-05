#!/usr/bin/env bash

set -Eeuo pipefail

for logo in \
logo-master-black.png \
logo-master-white.png
do

    echo
    echo "================================"
    echo "Checking: $logo"
    echo "================================"

    if [ ! -f "$logo" ]; then
        echo "MISSING"
        continue
    fi

    echo
    echo "[FILE TYPE]"
    file "$logo"

    echo
    echo "[IMAGE INFO]"
    identify "$logo"

    echo
    echo "[PNG VALIDATION]"
    pngcheck "$logo" || true

    echo
    echo "[HASH]"
    sha256sum "$logo"

done
