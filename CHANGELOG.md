# Change Log

All notable changes to the "json-parse-validator" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

### 1.1.2

### Added
- None

### Changed
- Fixed logo

## 1.1.1

### Added
- None

### Changed
- Upgrade NPM package references to fix packages with known security vulnerabilities.

## 1.1.0

### Added
- Added support for detecting various whitespace characters that result in a `SyntaxException` when processed by `JSON.parse()`.
- Added quickfix actions to replace invalid characters with normal whitespace (`\u020`) or remove from document.

### Changed
- Unexpected token error in an invalid JSON document now only appears for characters the extension is not looking for.

## 1.0.0

- Initial release

