import { Column, Table } from "@tanstack/react-table";

const setFilterValue = <TData>(column: Column<TData, unknown>, table: Table<TData>, value: unknown) => {
  const customFilterName = column.columnDef.meta?.customFilterName;

  if (customFilterName) {
    table.setColumnFilters((prev) => [...prev.filter((x) => x.id !== customFilterName), { id: customFilterName, value }]);
  } else {
    column.setFilterValue(value);
  }
};

const getFilterValue = <TData>(column: Column<TData, unknown>, table: Table<TData>): unknown => {
  const customFilterName = column.columnDef.meta?.customFilterName;

  if (customFilterName) {
    return table.getState().columnFilters.find((x) => x.id === customFilterName)?.value;
  }
  return column.getFilterValue();
};

export { setFilterValue, getFilterValue };
