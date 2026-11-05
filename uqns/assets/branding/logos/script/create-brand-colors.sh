#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
# Quran Navigation
# Brand Guidelines Generator
###############################################################################

OUTPUT_DIR="logos/brand-guidelines"

mkdir -p "$OUTPUT_DIR"

cat > "$OUTPUT_DIR/colors.md" <<'EOF'
---
title: Quran Navigation Brand Color Guidelines
project: Quran Navigation
initiative: Quran Navigator Project
organization: Quraner Fariwala
maintainer: MJ Ahmad
author: MJ Ahmad
version: 1.0.0
status: Active
license: Internal Project Asset
repository: https://mj-ahmad.github.io/qn
website: https://mj-ahmad.github.io
last_updated: 2026-11-05
---

# Quran Navigation Brand Color Guidelines

## Metadata

| Property | Value |
|----------|----------|
| Project | Quran Navigation |
| Initiative | MJ Ahmad Quran Navigator Project |
| Organization | Quraner Fariwala |
| Maintainer | MJ Ahmad |
| Website | https://mj-ahmad.github.io |
| Project URL | https://mj-ahmad.github.io/qn |
| Version | 1.0.0 |
| Status | Active |
| Last Updated | 2026-11-05 |

---

# Primary Brand Palette

## Gold

Primary identity color.

### Hex

```text
#DDB441
```

### RGB

```text
221, 180, 65
```

### Usage

- Official Logo
- Icon System
- Monogram
- Seal Assets
- Social Avatars
- Wordmark

---

## Deep Black

Primary dark foundation.

### Hex

```text
#000000
```

### Usage

- Dark Logo
- Dark Backgrounds
- Official Seal
- Quran Navigation Night Theme

---

## Pure White

Primary light foundation.

### Hex

```text
#FFFFFF
```

### Usage

- Light Logo
- Light Backgrounds
- Print Assets
- Documentation

---

# Secondary Palette

## Slate 900

### Hex

```text
#0F172A
```

### Usage

- Open Graph Assets
- Hero Sections
- Brand Backgrounds

---

## Gray 900

### Hex

```text
#111827
```

### Usage

- Social Cards
- Metadata Graphics

---

## Navy Dark

### Hex

```text
#0B1220
```

### Usage

- Banner Assets
- Open Graph
- Visual Presentations

---

# Accessibility

## Recommended Contrast

| Foreground | Background |
|------------|------------|
| Gold | Black |
| White | Black |
| Black | White |

---

# Color Integrity Policy

The following colors SHALL NOT be modified without approval from the project steward.

- #DDB441
- #000000
- #FFFFFF

---

# Asset Coverage

The following assets MUST use the approved palette.

- Master Logo
- Responsive Logo
- App Icons
- Favicons
- Monograms
- Wordmarks
- Watermarks
- Official Seals
- Social Avatars
- Open Graph Assets

---

# Stewardship Statement

This branding system is maintained as part of the Quran Navigation initiative.

Project Steward:
MJ Ahmad

Project:
Quran Navigation

Organization:
Quraner Fariwala

Official Website:
https://mj-ahmad.github.io

Project Portal:
https://mj-ahmad.github.io/qn

---

# Revision History

## Version 1.0.0

- Initial color constitution.
- Gold identity palette established.
- Accessibility guidance added.
- Governance metadata introduced.

EOF

echo
echo "========================================"
echo " BRAND COLORS GENERATED"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR/colors.md"

echo
echo "Location:"
echo "$OUTPUT_DIR/colors.md"

echo
echo "Success."





