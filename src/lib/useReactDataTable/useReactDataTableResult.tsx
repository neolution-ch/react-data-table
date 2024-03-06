import { ColumnFiltersState, PaginationState, SortingState, Table } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

/**
 * The result of the useReactDataTable hook
 */
export interface useReactDataTableResult<TData> {
  /**
   * the react table instance
   */
  table: Table<TData>;

  /**
   * the pagination state. Only makes sense to use this if you are not supplying the `state.pagination` property
   */
  pagination: PaginationState;

  /**
   * the pagination state setter.
   * Only makes sense to use this if you are not using the `onPaginationChange` callback
   */
  setPagination: Dispatch<SetStateAction<PaginationState>>;

  /**
   * the column filters state. Only makes sense to use this if you are not supplying the `state.columnFilters` property
   */
  columnFilters: ColumnFiltersState;

  /**
   * the column filters state setter. Only makes sense to use this if you are not using the `onColumnFiltersChange` callback
   */
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;

  /**
   * the sorting state. Only makes sense to use this if you are not supplying the `state.sorting` property
   */
  sorting: SortingState;

  /**
   * the sorting state setter. Only makes sense to use this if you are not using the `onSortingChange` callback
   */
  setSorting: Dispatch<SetStateAction<SortingState>>;
}
