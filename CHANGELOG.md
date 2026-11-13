# Changelog

All notable changes are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- A loading screen in the style of the game's HUD: it shows from the first moment, with the real
  progress (interface, icons, profile, each page) and the saved maker's color, and fades out when
  everything is ready. Buttons can't be pressed by accident while it's up.

### Changed

- Faster start: the big stylesheets no longer block the first paint, the saved settings are read
  before the pages are built, and each page is built once instead of twice. No more flash of the
  default theme.
- Switching tabs is instant: every tab is laid out once and kept (each one now scrolls on its own),
  instead of being laid out again on every switch. The maker picker and the settings are prepared
  behind the loading screen, so they open at once the first time too.

## [3.0.0] - 2026-11-03

First public release, for LibreShard 0.1.0.

### Changed

- Renamed for LibreShard: the control profile is now `LibreShard_MFD.xml` ("LibreShard MFD" in the
  game). Its bindings are the same as before; import the new profile once.
- Renamed to SC MFD, with the id `sc-mfd`: it installs as a new shard, next to older copies.
- The interface is in English and Spanish.
- New icon set drawn for this shard, and themes shown as color swatches with a three-letter code.

### Removed

- All material from the game's official fan kit (maker logos, the wallpaper) and the third-party icon
  pack: they can't be redistributed. The background is now drawn with CSS.

[Unreleased]: https://github.com/libreshard/libreshard-sc-mfd/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/libreshard/libreshard-sc-mfd/releases/tag/v3.0.0
