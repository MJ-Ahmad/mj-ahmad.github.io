#!/usr/bin/env bash
set -Eeuo pipefail

###############################################################################
# Quran Navigation
# Brand Guidelines: Spacing
#
# Project      : Quran Navigation
# Initiative   : MJ Ahmad Quran Navigator Project
# Organization : Quraner Fariwala
# Maintainer   : MJ Ahmad
# Website      : https://mj-ahmad.github.io
# Project URL  : https://mj-ahmad.github.io/qn
# Version      : 1.0.0
###############################################################################

OUTPUT_DIR="logos/brand-guidelines"
mkdir -p "$OUTPUT_DIR"

cat > "$OUTPUT_DIR/spacing.md" <<'MARKDOWN_EOF'
---
title: Quran Navigation Spacing Guidelines
project: Quran Navigation
initiative: MJ Ahmad Quran Navigator Project
organization: Quraner Fariwala
maintainer: MJ Ahmad
author: MJ Ahmad
version: 1.0.0
status: Active
website: https://mj-ahmad.github.io
project_url: https://mj-ahmad.github.io/qn
---

# Quran Navigation Spacing Guidelines

## Metadata

| Property     | Value                            |
|--------------|----------------------------------|
| Project      | Quran Navigation                 |
| Initiative   | MJ Ahmad Quran Navigator Project |
| Organization | Quraner Fariwala                 |
| Maintainer   | MJ Ahmad                         |
| Website      | https://mj-ahmad.github.io       |
| Project URL  | https://mj-ahmad.github.io/qn    |
| Version      | 1.0.0                            |

---

# Purpose

This document establishes the official spacing system for the Quran Navigation ecosystem.
The spacing system ensures:

- Consistency
- Readability
- Accessibility
- Mobile Responsiveness
- Visual Harmony
- Cross-platform Compatibility

---

# Base Unit

The official spacing base unit is:

    8px

All spacing values should be derived from this unit.

---

# Official Spacing Scale

| Token | Value |
|-------|-------|
| 0     | 0px   |
| XS    | 4px   |
| SM    | 8px   |
| MD    | 16px  |
| LG    | 24px  |
| XL    | 32px  |
| 2XL   | 48px  |
| 3XL   | 64px  |
| 4XL   | 96px  |
| 5XL   | 128px |

---

# Layout Spacing

**Mobile** — 16px (Recommended page padding)

**Tablet** — 24px (Recommended page padding)

**Desktop** — 32px (Recommended page padding)

**Large Display** — 48px (Recommended page padding)

---

# Content Width

**Reading Content** — Recommended: 680px - 900px

**Documentation** — Recommended: 780px - 1000px

**Dashboard** — Recommended: Full Width Responsive

---

# Logo Protection Area

Every logo asset shall maintain a clear space.

Minimum safe area: **25% of logo height**

No text, icons, buttons, borders, or graphics should enter this protected area.

---

# Icon Spacing

## Standard Icon Sizes

| Size | Dimension |
|------|-----------|
| XS   | 16px      |
| SM   | 24px      |
| MD   | 32px      |
| LG   | 48px      |
| XL   | 64px      |
| XXL  | 128px     |

---

# Button Spacing

**Small Button** — Padding: 8px 12px

**Medium Button** — Padding: 12px 16px

**Large Button** — Padding: 16px 24px

---

# Card Spacing

**Compact** — 16px

**Standard** — 24px

**Featured** — 32px

---

# Typography Spacing

## Heading Margin Bottom

| Element | Margin |
|---------|--------|
| H1      | 32px   |
| H2      | 24px   |
| H3      | 20px   |
| H4      | 16px   |
| H5      | 12px   |
| H6      | 8px    |

## Paragraph Gap

16px

---

# Quran Reading Layout

## Quran Page Viewer

Recommended:

- Page Padding: 16px
- Page Margin: 16px
- Page Gap: 24px

## Ayah Reader

Recommended:

- Content Padding: 24px
- Line Height: 2.0
- Maximum Width: 900px

---

# Grid System

**Mobile** — 4 Columns

**Tablet** — 8 Columns

**Desktop** — 12 Columns

---

# Accessibility Standards

Spacing should ensure:

- Touch Target >= 44px
- Zoom Compatibility
- Keyboard Navigation Compatibility
- Mobile-first Readability
- Accessible Interaction Areas

---

# Anti-Patterns

Avoid:

- Random spacing values
- Overcrowded interfaces
- Tiny touch targets
- Inconsistent margins
- Overlapping content
- Logo placement without clear space

---

# Coverage

This spacing system applies to:

- Logos
- Icons
- Favicons
- App Icons
- Monograms
- Wordmarks
- Social Assets
- Open Graph Assets
- Documentation
- Web Applications
- Mobile Applications

---

# Stewardship Statement

This spacing system is maintained under the Quran Navigation initiative.

- Project Steward: MJ Ahmad
- Organization: Quraner Fariwala
- Website: https://mj-ahmad.github.io
- Project Portal: https://mj-ahmad.github.io/qn

---

# Revision History

## Version 1.0.0

Initial release.

Includes:

- Base spacing scale
- Logo safe areas
- Mobile layout standards
- Responsive layout standards
- Accessibility spacing guidance
- Governance metadata
MARKDOWN_EOF

echo
echo "========================================"
echo " SPACING GUIDELINES GENERATED"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR/spacing.md"

echo
echo "Created:"
echo "$OUTPUT_DIR/spacing.md"

echo
echo "Done"
