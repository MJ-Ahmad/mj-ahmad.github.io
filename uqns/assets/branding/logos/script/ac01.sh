#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BLACK_LOGO="${SCRIPT_DIR}/logo-master-black.png"
WHITE_LOGO="${SCRIPT_DIR}/logo-master-white.png"

echo "Black Logo:"
echo "$BLACK_LOGO"

echo "White Logo:"
echo "$WHITE_LOGO"

[ -f "$BLACK_LOGO" ] && echo "Found Black Logo"
[ -f "$WHITE_LOGO" ] && echo "Found White Logo"
