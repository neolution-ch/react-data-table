import { ColumnFiltersState } from "@tanstack/react-table";

const getColumFilterFromModel = <TFilter extends { [k: string]: any }>(filter: TFilter): ColumnFiltersState => {
  return Object.entries(filter).map(([id, value]) => {
    return { id, value };
  });
};

export { getColumFilterFromModel };
