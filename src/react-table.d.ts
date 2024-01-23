/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-table";
import { RowData } from "@tanstack/react-table";
import { CSSProperties } from "react";

interface DropdownColumnFilterOption {
  label: string;
  value: string | number;
}

interface DropdownColumnFilter {
  options: DropdownColumnFilterOption[];
}

export interface EnumValue {
  value: number | string | undefined;
  text: string;
  disabled?: boolean;
}

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    dropdownFilter?: DropdownColumnFilter;
    parseValueAs?: "number" | "date";
    cellStyle?: CSSProperties;
    enumValues?: EnumValue[];
    customFilter?: (filterValue: any, setFilterValue: (filterValue: any) => void) => JSX.Element;
  }
}
