import { ExpandedState, PaginationState, RowSelectionState, Table } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { FilterModel } from "../types/TableState";
import { SortingState } from "../types/SortingState";

/**
 * The result of the useReactDataTable hook
 */
export interface useReactDataTableResult<TData, TFilter extends FilterModel> {
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
  columnFilters: TFilter;

  /**
   * the row selection state. Only makes sense to use this if you are not supplying the `state.rowSelection` property
   */
  rowSelection: RowSelectionState;

  /**
   * the column filters state setter. Only makes sense to use this if you are not using the `onColumnFiltersChange` callback
   */
  setColumnFilters: Dispatch<SetStateAction<TFilter>>;

  /**
   * the sorting state. Only makes sense to use this if you are not supplying the `state.sorting` property
   */
  sorting: SortingState<TData> | undefined;

  /**
   * the row selection state setter. Only makes sense to use this if you are not supplying the `state.rowSelection` property
   */
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;

  /**
   * the sorting state setter. Only makes sense to use this if you are not using the `onSortingChange` callback
   */
  setSorting: Dispatch<SetStateAction<SortingState<TData | undefined>>>;

  /**
   * the expanded state. Only makes sense to use this if you are not supplying the `state.expanded` property
   */
  expanded: ExpandedState;

  /**
   * the expanded state setter. Only makes sense to use this if you are not supplying the `state.expanded` property
   */
  setExpanded: Dispatch<SetStateAction<ExpandedState>>;
}
