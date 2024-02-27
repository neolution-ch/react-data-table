import { ColumnFiltersState, PaginationState, VisibilityState } from "@tanstack/react-table";
import { SortingState } from "../types";

/**
 * The props for the useReactDataTableState hook
 */
export interface useReactDataTableStateProps<TData> {
  /**
   * the initial column filters
   */
  initialColumnFilters?: ColumnFiltersState;

  /**
   * the initial sorting
   */
  initialSorting?: SortingState<TData>;

  /**
   * the initial pagination
   */
  initialPagination?: Partial<PaginationState>;

    /**
   * the initial visibility
   */
  initialVisibility?: VisibilityState;
}
