import { ColumnFiltersState } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getColumnFilterFromModel = <TFilter extends { [k: string]: any }>(filter: TFilter): ColumnFiltersState =>
  Object.entries(filter).map(([id, value]) => ({ id, value }));

export { getColumnFilterFromModel };
