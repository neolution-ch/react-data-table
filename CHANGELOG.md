# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Virtualization height computation. This is a well know issue on Tanstack virtualizer package.
  When using virtualization, assign to your table the following css

  ````css
  :root {
  --your-pseudo-height--variable: 0px;
  }

  table::after {
      content: "";
      display: block;
      height: var(--your-pseudo-height--variable);
    }
  ```css

  and use the `onPseudoHeightChange` to set it on your side

  ```tsx
  <ReactDataTable<T>
  ...
  onPseudoHeightChange={(height) =>   document.documentElement.style.setProperty("--your-pseudo-height--variable", `${height}px`)}
  />
  ````

## [5.13.0] - 2025-10-08

### Changed

- Updated `react-pattern-ui` from 3.4.0 to 5.3.0

### Added

- `virtualization` features.
- `pagingNavigationComponents` property to customize the paging navigation components

## [5.12.0] - 2025-09-15

### Added

- option `subRowComponent` to pass a render-function for a subrow. This will be rendered additionally to the subrows and if not wanted, make sure the subrows are passed as empty arrayd [], following an example:

```tsx
const { table } = useReactDataTable<T>({
  data,
  columns,
  reactTableOptions: {
    enableExpanding: true,
    getSubRows: (_) => [],
    getRowCanExpand: (row) => row.shouldRenderSubRow,
  },
});
```

## [5.11.0] - 2025-06-03

### Added

- added a flag `isStriped` to the `ReactDataTable` component to enable/disable striped rows
- added a flag `showClearSearchButton` to the `ReactDataTable` component to show/hide the clear search button

## [5.10.0] - 2025-04-29

### Added

- `table` as `customFilter` parameter.
- export for `getModelFromColumnFilter` and `getColumnFilterFromModel` utility functions.

## [5.9.1] - 2024-12-19

### Fixed

- `meta dropdownFilter` in order to be controlled.

## [5.9.0] - 2024-12-17

### Added

- `columnPinning` feature. Allows the pinning of columns.

## [5.8.0] - 2024-12-02

### Added

- option `hideHeaderFilters` added to the column meta to hide the header filter (needs to be set to true for all columns)
- option `headerFilterStyle` added to the column meta to be able to style the header filter
- option `customFilterName` added to the column meta to be able to use different mappings than the `accessor` of the column description

### Fixed

- `pkg.pr.new` workflow in order to prevent caching issues

## [5.7.0] - 2024-10-04

### Added

- property `onRowClick` in `ReactDataTable` in order to define a custom function to execute the row is clicked
- property `enableRowClick` in `ReactDataTable` in order to define if a row should be clickable or not

## [5.6.0] - 2024-10-02

### Added

- property `fullRowSelectable` in the `reactTableOptions` to manually disable the selection once `enableRowSelection` is enabled and the row is anywhere clicked

## [5.5.0] - 2024-09-25

### Added

- added missing col span property for `grouped columns` feature

## [5.4.1] - 2024-07-05

### Fixed

- added missing optional `rowSelection` state in Fully controlled hook

## [5.4.0] - 2024-06-14

### Added

- `expanded` feature

## [5.3.0] - 2024-06-03

### Added

- possibility to override the default `noEntries` message in a singular case

## [5.2.0] - 2024-05-01

### Added

- `rowSelection` feature

### Changed

- the `wiki` documentation is now linked in the readme

## [5.1.0] - 2024-04-05

### Fixed

- endless loop on `pagination` state when paginating client-side

### Added

- auto `pageIndex reset` when paginating server side

## [5.0.1] - 2024-03-27

### Fixed

- `sorting` and `columnFilters` can be possibly undefined for not `useReactDataTable` hook

## [5.0.0] - 2024-03-27

### Changed

- the `reset icon` will now reset the table to the initialState if provided, otherwise to the first value of the state
- :boom: the `sorting` accepts now a strongly typed object instead of a list
- :boom: the `columnFilters` can be used only defining a `filter type` to datatable hooks

### Removed

- :boom: utilities `getColumnFilterFromModel` and `getModelFromColumnFilter` are not exposed anymore

## [4.2.0] - 2024-03-22

### Added

- option `dragAndDropOptions` to enable drag-and-drop rows via `@dnd-kit` package.

### Added

- option `cellClassName` added to the column meta to add class names to every cell of a column
- option `headerClassName` added to the column meta to add class names to every header of a column
- option `footerStyle` added to the column meta to add styles to every footer of a column
- option `footerClassName` added to the column meta to add class names to every footer of a column

## [4.1.0] - 2024-03-13

### Added

- option `hidePageSizeChange` added to hide the possibility to change the page size

## [4.0.0] - 2024-03-06

### Added

- Skeletons for when the data is loading

### Changed

- :boom: Fundamentally changed how this package works. The state is now managed by the consumer of this package. This means that the consumer has to provide the data and the functions to update the data. The package only provides the UI components to display the data. This change was necessary to make the package more flexible and to allow the consumer to use the package in a wider range of use cases. Behind the scenes, the package uses the `useTable` hook from the `@tanstack/react-table` package. The consumer can use the `useTable` hook directly if he wants to. The `ReactDataTable` component is just a wrapper around the `useTable` hook. The `ReactDataTable` component is still the recommended way to use this package.

- :boom: renamed `possiblePageItemCounts` to `pageSizes`.

- :boom: `columns` is now of type `ColumnDef<TData, TValue>` from the `@tanstack/react-table` package. Please refer to the documentation of the `@tanstack/react-table` package for more information: https://tanstack.com/table/v8/docs/api/core/table#columns (there are additional custom fields in the column.meta object defined by us: `src/react-table.d.ts`)

### Removed

- :boom: removed `rowHighlight`. Use `rowStyle` instead.
- :boom: removed `enablePredefinedSort` prop. Use `initialState.sorting` instead. Or `state.sorting` if you want to manage the state yourself.
- :boom: removed `predefinedFilter` prop. Use `initialState`.
- :boom: removed `asc` prop. Use `initialState.sorting` instead. Or `state.sorting` if you want to manage the state yourself.
- :boom: removed `predefinedItemsPerPage` prop. Use `initialState.pagination.pageSize` instead. Or `state.pagination.pageSize` if you want to manage the state yourself.
- :boom: removed `orderBy` prop. Use `initialState.sorting` instead. Or `state.sorting` if you want to manage the state yourself.
- :boom: removed `client` prop. Use `data` prop instead and manage the state of the data yourself.
- :boom: removed `query` prop. Use `data` prop instead and manage the state of the data yourself.
- :boom: removed `handlers` prop. Since the state is now managed by the user, the user is responsible for updating the data.
- :boom: removed `actions` props. You can easily define whatever actions you would like to have in the `columns` prop.
  This is an example of how you could configure the actions column:

```tsx
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<YourData>();
columnHelper.display({
      id: "edit",
      header: () => <span>Aktionen</span>,
      cell: (props) => (
        <>
          <Link href={{ pathname: "/addresses/[addressId]", query: { addressId: props.row.getValue("addressId") } }}>
            <FontAwesomeIcon icon={faEye} style={{ marginRight: "5px" }} />
          </Link>
          <FontAwesomeIcon
            icon={faTrash}
            style={{ marginRight: "5px" }}
            onClick={async () => {
                //  do something
            }}
          />
        </>
      ),
    }),
```

## [3.8.0] - 2023-11-20

- Changed `DeleteAction` to expose `cancelButtonText` and `deleteButtonText` props for translations

## [3.7.0] - 2023-11-16

### Added

- Added property `withoutHeaders` to draw the table without any header row (title + filters)

## [3.6.0] - 2023-10-26

### Changed

- Updated react-pattern-ui from 2.4.0 to 2.9.0

## [3.5.0] - 2023-10-05

### Added

- Added function `getFilterState` to get current status of filters
- Added function `updateFilters` to update filters and refresh dataTable

## [3.4.0] - 2023-10-03

### Added

- Added nullable `disabled` prop to `EnumValue` type

## [3.3.0] - 2023-08-07

### Changed

- Updated react-pattern-ui to 2.4.0

## [3.2.0] - 2023-08-04

### Added

- Added support to "react" version "^18.0.0" in peerDependencies
- Added support to "react-dom" version "^18.0.0" in peerDependencies
- Added support to "reactstrap" version "^9.0.0" in peerDependencies
- Added support to "@fortawesome/react-fontawesome" version "^0.2.0" in peerDependencies

### Fixed

- Fixed export for CommonJS

## [3.1.0] - 2023-08-03

### Changed

- Updated react-pattern-ui to 2.3.0

## [3.0.0] - 2023-07-26

# Changed

- :boom: `view` default Action does not nest an `<a>` tag anymore.

## [2.7.3] - 2023-06-29

### Changed

- `orderBy` property of `QueryFunction` type can be string or undefined.

## [2.7.2] - 2023-06-29

### Fixed

- Excluded test code from the package and made sure the paths are pointing to the correct `.d.ts` files

## [2.7.1] - 2023-06-16

### Fixed

- update types file location in package.json

## [2.7.0] - 2023-06-16

### Fixed

- update `@neolution-ch/react-pattern-ui` to the latest version (2.2.1)

## [2.6.1] - 2023-06-13

### Fixed

- Moved `@neolution-ch/react-pattern-ui` to the dependencies, so it gets correctly detected by rollup as an external dependency

## [2.6.0] - 2023-06-12

### Changed

- Changed from `microbundle` to `rollup` for building the package
- Updated all the dependencies to the latest possible version

### Fixed

- Display predefined filter in filter row

## [2.5.0] - 2023-05-25

### dependabot: \#33 Bump loader-utils from 1.4.0 to 1.4.2

## [2.4.1] - 2023-05-25

### Added

- the prop `enablePredefinedSort` to all tables. Set boolean condition for which the orderBy option should be ignored. Set as `false` by default if not specified.

## [2.4.0] - 2023-05-17

### Added

- the prop `rowHighlight` to all tables. Check `RowHighlightInterface` for prop definition. Set condition for which a row should be highlighted. Possibility to set custom style for highlights

## [2.3.2] - 2023-03-08

### Added

- the style 'white-space:no-wrap' to default 'ActionCell' to have icons on the same line

## [2.3.1] - 2023-03-07

### Changed:

- depandabot: Bump ejs from 3.1.6 to 3.1.8

## [2.3.0] - 2023-03-06

### Added

- the prop `icon` to the `DataTablePredefinedActionLink` interface to specify the view action column icon. Possible values are all `IconProp`. The default value is the eye icon `faEye`

## [2.2.0] - 2023-02-22

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

[unreleased]: https://github.com/neolution-ch/react-data-table/compare/5.13.0...HEAD
[5.13.0]: https://github.com/neolution-ch/react-data-table/compare/5.12.0...5.13.0
[5.12.0]: https://github.com/neolution-ch/react-data-table/compare/5.11.0...5.12.0
[5.11.0]: https://github.com/neolution-ch/react-data-table/compare/5.10.0...5.11.0
[5.10.0]: https://github.com/neolution-ch/react-data-table/compare/5.9.1...5.10.0
[5.9.1]: https://github.com/neolution-ch/react-data-table/compare/5.9.0...5.9.1
[5.9.0]: https://github.com/neolution-ch/react-data-table/compare/5.8.0...5.9.0
[5.8.0]: https://github.com/neolution-ch/react-data-table/compare/5.7.0...5.8.0
[5.7.0]: https://github.com/neolution-ch/react-data-table/compare/5.6.0...5.7.0
[5.6.0]: https://github.com/neolution-ch/react-data-table/compare/5.5.0...5.6.0
[5.5.0]: https://github.com/neolution-ch/react-data-table/compare/5.4.1...5.5.0
[5.4.1]: https://github.com/neolution-ch/react-data-table/compare/5.4.0...5.4.1
[5.4.0]: https://github.com/neolution-ch/react-data-table/compare/5.3.0...5.4.0
[5.3.0]: https://github.com/neolution-ch/react-data-table/compare/5.2.0...5.3.0
[5.2.0]: https://github.com/neolution-ch/react-data-table/compare/5.1.0...5.2.0
[5.1.0]: https://github.com/neolution-ch/react-data-table/compare/5.0.1...5.1.0
[5.0.1]: https://github.com/neolution-ch/react-data-table/compare/5.0.0...5.0.1
[5.0.0]: https://github.com/neolution-ch/react-data-table/compare/4.2.0...5.0.0
[4.2.0]: https://github.com/neolution-ch/react-data-table/compare/4.1.0...4.2.0
[4.1.0]: https://github.com/neolution-ch/react-data-table/compare/4.0.0...4.1.0
[4.0.0]: https://github.com/neolution-ch/react-data-table/compare/3.8.0...4.0.0
[3.8.0]: https://github.com/neolution-ch/react-data-table/compare/3.7.0...3.8.0
[3.7.0]: https://github.com/neolution-ch/react-data-table/compare/3.6.0...3.7.0
[3.6.0]: https://github.com/neolution-ch/react-data-table/compare/3.5.0...3.6.0
[3.5.0]: https://github.com/neolution-ch/react-data-table/compare/3.4.0...3.5.0
[3.4.0]: https://github.com/neolution-ch/react-data-table/compare/3.3.0...3.4.0
[3.3.0]: https://github.com/neolution-ch/react-data-table/compare/3.2.0...3.3.0
[3.2.0]: https://github.com/neolution-ch/react-data-table/compare/3.1.0...3.2.0
[3.1.0]: https://github.com/neolution-ch/react-data-table/compare/3.0.0...3.1.0
[3.0.0]: https://github.com/neolution-ch/react-data-table/compare/2.7.3...3.0.0
[2.7.3]: https://github.com/neolution-ch/react-data-table/compare/2.7.2...2.7.3
[2.7.2]: https://github.com/neolution-ch/react-data-table/compare/2.7.1...2.7.2
[2.7.1]: https://github.com/neolution-ch/react-data-table/compare/2.7.0...2.7.1
[2.7.0]: https://github.com/neolution-ch/react-data-table/compare/2.6.1...2.7.0
[2.6.1]: https://github.com/neolution-ch/react-data-table/compare/2.6.0...2.6.1
[2.6.0]: https://github.com/neolution-ch/react-data-table/compare/2.5.0...2.6.0
[2.5.0]: https://github.com/neolution-ch/react-data-table/compare/2.4.0...2.5.0
[2.4.0]: https://github.com/neolution-ch/react-data-table/compare/2.3.2...2.4.0
[2.3.2]: https://github.com/neolution-ch/react-data-table/compare/2.3.1...2.3.2
[2.3.1]: https://github.com/neolution-ch/react-data-table/compare/2.3.0...2.3.1
[2.3.0]: https://github.com/neolution-ch/react-data-table/compare/2.2.0...2.3.0
[2.2.0]: https://github.com/neolution-ch/react-data-table/compare/2.1.2...2.2.0
[2.1.2]: https://github.com/neolution-ch/react-data-table/compare/2.1.1...2.1.2
[2.1.1]: https://github.com/neolution-ch/react-data-table/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/neolution-ch/react-data-table/compare/2.0.3...2.1.0
[2.0.3]: https://github.com/neolution-ch/react-data-table/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/neolution-ch/react-data-table/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/neolution-ch/react-data-table/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/neolution-ch/react-data-table/compare/429b3a1c042143eeb0d4e3ec1a50e81faf33e384...2.0.0
