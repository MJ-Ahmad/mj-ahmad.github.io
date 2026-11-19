# Vendored: quran-madina-html 2.2.2

- Upstream: https://github.com/tarekeldeeb/quran-madina-html
- Copyright: Tarek Eldeeb
- License: "Waqf" General Public License 2.0 (see LICENSE.md in the upstream package and the header of dist/quran-madina-html.js)
- Source: dist/ from the uploaded dist.zip, unmodified except the patches below.

Local patches:
- removed the "Translation" action that opened quran.com
- the page-level quran.com fallback now points to '#'
- the unpkg fallback for data-cdn now points to /qmh/ (no external runtime requests)

Data: assets/db/v2/ (Madina-1441H, Madina-1405H, IndoPak-15) with juz shards and manifests, from assets.zip.
