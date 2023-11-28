/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-table";
import { RowData } from "@tanstack/react-table";

interface DropdownColumnFilterOption {
  label: string;
  value: string | number;
}

interface DropdownColumnFilter {
  options: DropdownColumnFilterOption[];
}

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    dropdownFilter?: DropdownColumnFilter;
    parseValueAs?: "number" | "date";
  }
}
