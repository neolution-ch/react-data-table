import { ColumnDef } from "@tanstack/react-table";

export type ExtendedColumnDef<TData> = ColumnDef<TData, string> & {
  columnFilterDropDownConfig?: {
    values: string[];
  };
};
