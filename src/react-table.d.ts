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
     * Add class name to the every cell in this column
     */
    cellClassName?: string;

    /**
     * Add a style to the header cell of this column
     */
    headerStyle?: CSSProperties;

    /**
     * Add class name to the every header in this column
     */
    headerClassName?: string;

    /**
     * Add a style to the footer cell of this column
     */
    footerStyle?: CSSProperties;

    /**
     * Add class name to the every footer in this column
     */
    footerClassName?: string;

    /**
     * Define a custom filter
     * @param filterValue The current value of the filter
     * @param setFilterValue The callback to update the filter state
     * @returns The custom filter component
     */
    customFilter?: <T>(filterValue: T, setFilterValue: (filterValue: T) => void) => JSX.Element;

    /**
     * Define a function which validate the filter input
     * If the filter is not valid, it will not be applied to columnFilters
     * @param value The current value of the filter
     * @returns The filter input state
     */
    isInputValid?: (value: string) => FilterInputState;

    /**
     * Prevents the column from being drawn
     */
    isHidden?: boolean;

    /**
     * Set to true to hide the header filters
     */
    hideHeaderFilters?: boolean;

    /**
     * Sets the header filter style
     */
    headerFilterStyle?: CSSProperties;

    /**
     * Custom filter name to use instead of the default used accessor name
     */
    customFilterName?: string;
  }

  interface RowSelectionOptions<TData extends RowData> {
    fullRowSelectable?: boolean;
  }

  interface FilterInputState {
    isValid: boolean;

    /**
     * Add the possibility to show a custom error message different from the default one
     */
    errorMessage?: string;
  }
}
