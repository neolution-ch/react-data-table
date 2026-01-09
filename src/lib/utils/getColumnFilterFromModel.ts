import { ColumnFiltersState } from "@tanstack/react-table";
import { FilterModel } from "../types/TableState";

const getColumnFilterFromModel = <TFilter extends FilterModel>(filter: TFilter): ColumnFiltersState =>
  Object.entries(filter).map(([id, value]) => ({ id, value: value as unknown }));

export { getColumnFilterFromModel };
