#!/usr/bin/env bash
set -Eeuo pipefail

###############################################################################
# Quran Navigation
# Logo Usage Guidelines Generator
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

cat > "$OUTPUT_DIR/logo-usage.md" <<'MARKDOWN_EOF'
---
title: Quran Navigation Logo Usage Guidelines
project: Quran Navigation
initiative: MJ Ahmad Quran Navigator Project
organization: Quraner Fariwala
maintainer: MJ Ahmad
author: MJ Ahmad
version: 1.0.0
status: Active
website: https://mj-ahmad.github.io
project_url: https://mj-ahmad.github.io/qn
last_updated: 2026-11-05
---

# Quran Navigation Logo Usage Guidelines

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
| Status       | Active                           |

---

# Purpose

This document defines the official rules governing the use of the Quran Navigation logo system.
The purpose is to ensure:

- Visual consistency
- Brand recognition
- Accessibility
- Scalability
- Asset integrity
- Long-term stewardship

---

# Official Logo Assets

The following logo variants are considered official assets.

## Master Logos

    logo-master-black
    logo-master-white
    logo-master-color

## Responsive Logos

    logo-xs
    logo-sm
    logo-md
    logo-lg
    logo-xl

## Monograms

    monogram-black
    monogram-white
    monogram-color

## Wordmarks

    wordmark-black
    wordmark-white
    wordmark-color

## Seals

    official-seal
    round-seal
    square-seal

---

# Preferred Usage

**Light Background**

Use:

- logo-master-black
- logo-master-color

**Dark Background**

Use:

- logo-master-white
- logo-master-color

**Small Spaces**

Use:

- monogram-color
- icon-color

**Examples:**

- Mobile App
- Favicon
- Navigation Bar
- Mobile Drawer
- Browser Tab

---

# Clear Space Requirements

A minimum protected area must surround the logo.

Standard: **25% of logo height**

No content should enter the protected area.

**Examples:**

- Text
- Buttons
- Icons
- Images
- Borders
- Decorative Elements

---

# Minimum Size Requirements

## Digital

| Asset   | Minimum Size |
|---------|--------------|
| Logo    | 120px        |
| Monogram| 32px         |
| Icon    | 24px         |
| Wordmark| 140px        |

## Print

| Asset   | Minimum Size |
|---------|--------------|
| Logo    | 25mm         |
| Monogram| 12mm         |
| Wordmark| 30mm         |

---

# Approved Backgrounds

Approved:

- White
- Black
- Brand Gold
- Slate
- Navy
- Transparent

---

# Approved Color Usage

**Primary Brand Gold:** #DDB441

**Primary Black:** #000000

**Primary White:** #FFFFFF

Only approved brand colors should be used.

---

# Incorrect Usage

The following modifications are prohibited.

## Do Not

- Stretch the logo
- Squash the logo
- Rotate the logo
- Add shadows
- Add outlines
- Change brand colors
- Distort proportions
- Replace approved typography
- Place logo on low-contrast backgrounds
- Modify logo structure

---

# Digital Usage

Applies to:

- Web Applications
- Mobile Applications
- PWA
- Social Media
- Documentation
- Presentations
- GitHub Repositories

---

# Social Media Usage

**Recommended Avatar:**

- icon-color
- monogram-color

**Cover Images:**

- logo-wide
- logo-master-color

---

# Open Graph Usage

Recommended:

- og-image.png
- twitter-card.png
- social-banner.png

---

# Asset Hierarchy

Priority Order:

1. Master Logo
2. Responsive Logo
3. Wordmark
4. Monogram
5. Icon
6. Seal

---

# Accessibility

The logo system should always maintain:

- Adequate contrast
- Readability
- Recognisability
- Responsive presentation

---

# Governance

Any structural modification to official logo assets should be reviewed by the project steward.

**Project Steward:** MJ Ahmad

**Organization:** Quraner Fariwala

---

# Repository Structure

Official assets reside within:

    logos/
    ├── app-icons/
    ├── favicon/
    ├── icon/
    ├── monogram/
    ├── open-graph/
    ├── responsive/
    ├── seal/
    ├── social/
    ├── source/
    ├── watermark/
    ├── web/
    └── wordmark/

---

# Stewardship Statement

This branding system forms part of the Quran Navigation initiative.

- Maintainer: MJ Ahmad
- Organization: Quraner Fariwala
- Website: https://mj-ahmad.github.io
- Project Portal: https://mj-ahmad.github.io/qn

---

# Revision History

## Version 1.0.0

Initial logo governance document.

Includes:

- Official logo hierarchy
- Usage rules
- Safe area requirements
- Accessibility requirements
- Asset classifications
- Brand governance framework
MARKDOWN_EOF

echo
echo "========================================"
echo " LOGO USAGE GUIDELINES GENERATED"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR/logo-usage.md"

echo
echo "Created:"
echo "$OUTPUT_DIR/logo-usage.md"

echo
echo "Done."
