# Quran Navigation

A static, offline-capable Quran navigation app for Android (PWA, packaged as a Trusted Web Activity), with recitation audio, English / বাংলা / العربية interface, system / light / dark themes and a hifz tracker.

## Project layout

    quran-navigation/
    ├── site/          the deployable website (upload this folder to HTTPS hosting)
    ├── tests/         unit tests (Node.js, no dependencies)
    ├── scripts/       release check (run before every release)
    ├── PRIVACY.md     privacy policy (English and Bangla); fill in the contact line
    ├── CHANGELOG.md
    └── package.json

`site/README.md` describes the features, data files and how to complete the hizb and rukuh data.

## Development

Requires Node.js 18 or newer. Python 3 is used only for the local server.

    npm test          # unit tests: hifz engine and data integrity
    npm run check     # release gate: assets, service worker cache, manifest, syntax, tests
    npm run serve     # http://localhost:8000

Run `npm run check` before every release. It must pass with no failures.

## Live address

Production: **https://mj-ahmad.github.io/qn/** (GitHub Pages, project site under the `qn` repository).

Every URL in the site is relative, so it runs unchanged under `/qn/`. The absolute addresses used for search, sharing and the install manifest are set in one place: `site/js/site-meta.js` (`url`) and the `<link rel="canonical">`, `og:*` and `twitter:*` tags in `site/index.html`. If the address ever changes, update those together.

GitHub Pages ignores `site/_headers`. The same Content-Security-Policy is therefore set as a `<meta>` tag in `index.html`, so it applies on every host. Keep the two in step if you change one.

## Release


1. Complete the open data items in `site/data/` (hizb, rukuh), and verify reciter folders on everyayah.com.
2. Fill in the contact line in `PRIVACY.md`, and publish the policy at a public URL.
3. Deploy `site/` over HTTPS and apply `site/_headers`. Check `manifest.webmanifest` and `sw.js` load.
4. Run a Lighthouse PWA audit in Chrome on the live URL.
5. Bump `VERSION` in `site/sw.js`, the `version` in `package.json` and `site/js/site-meta.js`, set `lastUpdated` in `site/js/site-meta.js` to today's date (YYYY-MM-DD, Dhaka time), and add a `CHANGELOG.md` entry. `npm run check` fails if the versions do not match.
6. Fill in `site/.well-known/assetlinks.json` with the real package name and signing fingerprint. Android looks for this file at the root of the domain (`https://mj-ahmad.github.io/.well-known/assetlinks.json`), so for a project site it must be published from the user site repository (`mj-ahmad.github.io`), not from the `qn` folder.
7. Build the Android package with Bubblewrap (see `site/README.md`, "Publishing to Android"), then test the `.apk` on a real phone.
8. Upload the `.aab` to Google Play Console, with the privacy policy URL and Data Safety form.

## Known open items (tracked, not hidden)

- Hizb: 16 of 60 boundaries are not yet verified (shown as "Data pending").
- Rukuh: no verified boundary data included yet.
- Audio: reciter folder names are configured but need a live check on everyayah.com.
- Topics: starter list of 8 topics.
- Android app link file has placeholders until the signing key exists.
- The footer shows the last-updated date from `site/js/site-meta.js`; it is not generated automatically.
- Google Fonts load from the network the first time; they are then cached for offline use.

## Site features (1.2.1)

- **Splash screen**: shown while the app loads (about one second minimum, five seconds at most). It respects reduced-motion settings and is skipped without JavaScript. Markup in `index.html`, logic in `js/splash.js`.
- **Footer**: developer credit with a link to https://mj-ahmad.github.io/mj/, the last-updated date, live clocks for Dhaka (UTC+6) and UTC, version and copyright. Logic in `js/footer.js`.
- **Share**: the ⤴ button in the header and the Share button in the footer open a sheet with native share (where supported), WhatsApp, Messenger, Facebook, Telegram, X and copy-link. Logic in `js/share.js`.
- **Metadata**: search, Open Graph (Facebook, Messenger, WhatsApp, Telegram, LinkedIn) and X/Twitter cards, with the 1200×630 image at `assets/og-image.png`. Structured data (JSON-LD) names the developer.
- **Brand**: favicon, apple-touch, PWA and maskable icons are generated from the official logo (gold #DDB441 on black). Interface strings for the new parts are in `js/i18n-site.js`.
