import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import { FilterModel } from "../types/TableState";

const getModelFromColumnFilter = <TFilter extends FilterModel>(filter: ColumnFiltersState): TFilter =>
  Object.fromEntries(filter.map(({ id, value }: ColumnFilter) => [id, value])) as TFilter;

export { getModelFromColumnFilter };
