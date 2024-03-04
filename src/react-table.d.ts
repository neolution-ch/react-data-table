﻿/* eslint-disable @typescript-eslint/no-unused-vars */
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
    cellStyle?: CSSProperties;
    headerStyle?: CSSProperties;
    customFilter?: <T>(filterValue: T, setFilterValue: (filterValue: T) => void) => JSX.Element;
    isHidden?: boolean;
  }
}
