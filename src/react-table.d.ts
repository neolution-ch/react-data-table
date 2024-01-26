/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-table";
import { RowData } from "@tanstack/react-table";
import { CSSProperties } from "react";

interface DropdownColumnFilterOption {
  label: string;
  value: string | number;
  disabled?: boolean;
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
    customFilter?: <T>(filterValue: T, setFilterValue: (filterValue: T) => void) => JSX.Element;
  }
}
