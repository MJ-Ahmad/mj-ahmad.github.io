#!/usr/bin/env bash

set -Eeuo pipefail

OUTPUT_DIR="logos/brand-guidelines"

mkdir -p "$OUTPUT_DIR"

cat > "$OUTPUT_DIR/typography.md" <<'EOF'
---
title: Quran Navigation Typography Guidelines
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

# Quran Navigation Typography Guidelines

## Metadata

| Property | Value |
|----------|----------|
| Project | Quran Navigation |
| Initiative | MJ Ahmad Quran Navigator Project |
| Organization | Quraner Fariwala |
| Maintainer | MJ Ahmad |
| Author | MJ Ahmad |
| Version | 1.0.0 |
| Website | https://mj-ahmad.github.io |
| Project URL | https://mj-ahmad.github.io/qn |

---

# Purpose

This document defines the official typography standards for Quran Navigation.

---

# Primary UI Font

## Preferred

```text
Inter
```

## Fallback

```text
Segoe UI
Arial
sans-serif
```

### Usage

- Navigation
- Dashboard
- Forms
- Metadata
- UI Components

---

# Documentation Font

## Preferred

```text
Source Serif Pro
```

## Fallback

```text
Georgia
Times New Roman
serif
```

### Usage

- Policies
- Documentation
- Guides
- Reports

---

# Arabic Font

## Preferred

```text
Amiri
```

## Alternatives

```text
Noto Naskh Arabic
Scheherazade New
```

### Usage

- Quran Text
- Arabic Citations
- Islamic Content

---

# Bengali Font

## Preferred

```text
Noto Sans Bengali
```

## Alternatives

```text
Hind Siliguri
Kalpurush
```

### Usage

- Bengali Interfaces
- Bengali Documentation
- Community Content

---

# Typography Scale

## Desktop

| Element | Size |
|----------|----------|
| H1 | 48px |
| H2 | 40px |
| H3 | 32px |
| H4 | 24px |
| H5 | 20px |
| H6 | 18px |
| Body | 16px |
| Small | 14px |

---

## Mobile

| Element | Size |
|----------|----------|
| H1 | 36px |
| H2 | 30px |
| H3 | 24px |
| H4 | 20px |
| H5 | 18px |
| H6 | 16px |
| Body | 16px |
| Small | 14px |

---

# Font Weights

| Weight | Value |
|----------|----------|
| Light | 300 |
| Regular | 400 |
| Medium | 500 |
| Semibold | 600 |
| Bold | 700 |

---

# Accessibility

Typography should ensure:

- Minimum 16px body text
- Accessible contrast ratios
- Mobile readability
- Responsive scaling
- Quran-friendly reading experience

---

# Stewardship

Maintainer: MJ Ahmad

Project: Quran Navigation

Organization: Quraner Fariwala

Website:

https://mj-ahmad.github.io

Project Portal:

https://mj-ahmad.github.io/qn

---

# Revision History

## Version 1.0.0

- Initial typography guideline.
- Arabic, Bengali and English font standards established.
- Accessibility requirements documented.

EOF

echo
echo "========================================"
echo " TYPOGRAPHY GUIDELINES GENERATED"
echo "========================================"
echo

ls -lh "$OUTPUT_DIR/typography.md"

echo
echo "Created:"
echo "$OUTPUT_DIR/typography.md"
echo
echo "Done."
