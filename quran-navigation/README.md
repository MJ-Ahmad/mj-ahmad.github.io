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

## Release

1. Complete the open data items in `site/data/` (hizb, rukuh), and verify reciter folders on everyayah.com.
2. Fill in the contact line in `PRIVACY.md`, and publish the policy at a public URL.
3. Deploy `site/` over HTTPS and apply `site/_headers`. Check `manifest.webmanifest` and `sw.js` load.
4. Run a Lighthouse PWA audit in Chrome on the live URL.
5. Bump `VERSION` in `site/sw.js` and the version in `package.json`, and add a `CHANGELOG.md` entry.
6. Fill in `site/.well-known/assetlinks.json` with the real package name and signing fingerprint.
7. Build the Android package with Bubblewrap (see `site/README.md`, "Publishing to Android"), then test the `.apk` on a real phone.
8. Upload the `.aab` to Google Play Console, with the privacy policy URL and Data Safety form.

## Known open items (tracked, not hidden)

- Hizb: 16 of 60 boundaries are not yet verified (shown as "Data pending").
- Rukuh: no verified boundary data included yet.
- Audio: reciter folder names are configured but need a live check on everyayah.com.
- Topics: starter list of 8 topics.
- Android app link file has placeholders until the signing key exists.
- Google Fonts load from the network the first time; they are then cached for offline use.
