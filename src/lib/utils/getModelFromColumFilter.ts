import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";

const getModelFromColumFilter = <TFilter extends { [k: string]: any }>(filter: ColumnFiltersState): TFilter => {
  return Object.fromEntries(filter.map(({ id, value }: ColumnFilter) => [id, value])) as TFilter;
};

export { getModelFromColumFilter };
