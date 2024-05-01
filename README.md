# react-data-table

This package relies heavly on `tanstack/react-table` and `reactstrap` to provide a simple and easy to use data table.

## Installation

```bash
npm install @neolution-ch/react-data-table
or
yarn add @neolution-ch/react-data-table
```

### CSS

The skeletons are provided by `react-loading-skeleton` so you need to import the css file in your project.

```tsx
import "react-loading-skeleton/dist/skeleton.css";
```

### Peer dependencies

todo

## Usage

The main entry point for everything is the `ReactDataTable` component.

The props that you provide will determine if the table is sorted, filtered, paginated, etc. on the client or if the consumer of this package has to provide the data and the functions to update the data.

### Fully Static / Client Side Example

In this configuration the table is fully static meaning that the data will be sorted, filtered, paginated, etc. on the client.

```tsx
<ReactDataTable<Person, string> data={data} columns={columns} />
```

### Fully Dynamic / Server Side Example

In this configuration the table is fully dynamic meaning that the consumer of this package has to provide the data and the functions to update the data.

| use case                                                                                                   | onSorting | sorting |
| ---------------------------------------------------------------------------------------------------------- | --------- | ------- |
| you want to manually sort your data (possible server side) but you don't want to manage the state yourself | yes       | no      |
| you want the data table to handle the sorting but would like to influence the sorting from the outside     | no        | yes     |
| you want to manually sort your data AND you want to mange the state yourself                               | yes       | yes     |
| you want the data table to handle the sorting and you don't want to manually influence the state           | no        | no      |

### Documentation

Detailed documentation can be found at [ReactDataTable Wiki](https://tanstack.com/table/v8/docs/introduction)
