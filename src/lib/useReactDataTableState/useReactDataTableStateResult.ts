﻿import { Dispatch, SetStateAction } from "react";
import { ColumnPinningState, ExpandedState, PaginationState, RowSelectionState } from "@tanstack/react-table";
import { SortingState } from "../types/SortingState";

/**
 * The props for the useReactDataTableState hook
 */
export interface useReactDataTableStateResult<TData, TFilter> {
  /**
   * the current sorting state
   */
  sorting: SortingState<TData> | undefined;

  /**
   * the current pagination state
   */
  pagination: PaginationState;

  /**
   * the current column filters state
   */
  columnFilters: TFilter;

  /**
   * the column filters state after search was triggered
   */
  afterSearchFilter: TFilter;

  /**
   * the current row selection state
   */
  rowSelection: RowSelectionState;

  /**
   * the expanded state
   */
  expanded: ExpandedState;

  /**
   * the column pinning state
   */
  columnPinning: ColumnPinningState;

  /**
   * the setter for the sorting state
   */
  setSorting: Dispatch<SetStateAction<SortingState<TData> | undefined>>;

  /**
   * the setter for the pagination state
   */
  setPagination: Dispatch<SetStateAction<PaginationState>>;

  /**
   * the setter for the column filters state
   */
  setColumnFilters: Dispatch<SetStateAction<TFilter>>;

  /**
   * the setter for the column filters state after search was triggered
   */
  setAfterSearchFilter: Dispatch<SetStateAction<TFilter>>;

  /**
   * the setter for the row selection state
   */
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;

  /**
   * the setter for the expanded state
   */
  setExpanded: Dispatch<SetStateAction<ExpandedState>>;

  /**
   * the setter for the column pinning state
   */
  setColumnPinning: Dispatch<SetStateAction<ColumnPinningState>>;
}
