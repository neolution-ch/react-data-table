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
    /**
     * Define a dropdown filter
     */
    dropdownFilter?: DropdownColumnFilter;

    /**
     * Add a style to every cell in this column
     */
    cellStyle?: CSSProperties;

    /**
     * Add a style to the header cell of this column
     */
    headerStyle?: CSSProperties;

    /**
     * Define a custom filter
     * @param filterValue The current value of the filter
     * @param setFilterValue The callback to update the filter state
     * @returns The custom filter component
     */
    customFilter?: <T>(filterValue: T, setFilterValue: (filterValue: T) => void) => JSX.Element;

    /**
     * Prevents the column from being drawn
     */
    isHidden?: boolean;
  }
}
