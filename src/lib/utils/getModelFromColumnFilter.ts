import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getModelFromColumnFilter = <TFilter extends { [k: string]: any }>(filter: ColumnFiltersState): TFilter =>
  Object.fromEntries(filter.map(({ id, value }: ColumnFilter) => [id, value])) as TFilter;

export { getModelFromColumnFilter };
