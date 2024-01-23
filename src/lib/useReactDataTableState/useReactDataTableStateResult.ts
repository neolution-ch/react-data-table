import { Dispatch, SetStateAction } from "react";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

/**
 * The props for the useReactDataTableState hook
 */
export interface useReactDataTableStateResult {
  /**
   * the current sorting state
   */
  sorting: SortingState;

  /**
   * the current pagination state
   */
  pagination: PaginationState;

  /**
   * the current column filters state
   */
  columnFilters: ColumnFiltersState;

  /**
   * the entered column filters state
   */
  enteredColumnFilters: ColumnFiltersState;

  /**
   * the setter for the sorting state
   */
  setSorting: Dispatch<SetStateAction<SortingState>>;

  /**
   * the setter for the pagination state
   */
  setPagination: Dispatch<SetStateAction<PaginationState>>;

  /**
   * the setter for the column filters state
   */
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;

  /**
   * the setter for the column entered filters state
   */
  setEnteredColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}
