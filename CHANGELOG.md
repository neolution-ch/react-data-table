# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- the prop `actionsPosition` to the `DataTable` component to specify the position of the actions column. Possible values are `left` and `right`. The default value is `left`.

## [2.1.2] - 2022-06-20

### Added

- Added asc prop to specify the arrow icon sorting direction
- Added orderBy prop to specify the sorting key value

## [2.1.1] - 2022-05-04

### Changed

- Moved storybook to github pages

## [2.1.0] - 2022-05-02

### Added

- Dynamic table handler to reload the data from an external source.
- Added new story to reload data with sample code.
- Implemented className and style properties to the table and the actions.
- Added reload tests.

### Changed

- Changed max-lines allowed in DataTableInterfaces.ts.
- Changed max-lines allowed in DataTableRouted.tsx.

## [2.0.3] - 2022-04-19

### Added

- Story book

## [2.0.2] - 2022-04-14

### Changed

- Upgraded @neolution-ch/react-pattern-ui dependency to 2.0.2

## [2.0.1] - 2022-04-14

### Fixed

- Fix added for missing react import aftger microbundling

## [2.0.0] - 2022-04-12

### Added

- created package :tada:

[unreleased]: https://github.com/neolution-ch/react-data-table/compare/2.1.2...HEAD
[2.1.2]: https://github.com/neolution-ch/react-data-table/compare/2.1.1...2.1.2
[2.1.1]: https://github.com/neolution-ch/react-data-table/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/neolution-ch/react-data-table/compare/2.0.3...2.1.0
[2.0.3]: https://github.com/neolution-ch/react-data-table/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/neolution-ch/react-data-table/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/neolution-ch/react-data-table/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/neolution-ch/react-data-table/compare/429b3a1c042143eeb0d4e3ec1a50e81faf33e384...2.0.0
