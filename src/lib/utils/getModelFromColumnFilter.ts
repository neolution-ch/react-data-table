import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";

const getModelFromColumnFilter = <TFilter extends { [k: string]: any }>(filter: ColumnFiltersState): TFilter => {
  return Object.fromEntries(filter.map(({ id, value }: ColumnFilter) => [id, value])) as TFilter;
};

export { getModelFromColumnFilter };
