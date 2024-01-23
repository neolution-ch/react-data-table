import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

/**
 * The props for the useReactDataTableState hook
 */
export interface useReactDataTableStateProps {
  /**
   * the initial column filters
   */
  initialColumnFilters?: ColumnFiltersState;

  /**
   * the initial sorting
   */
  initialSorting?: SortingState;

  /**
   * the initial pagination
   */
  initialPagination?: Partial<PaginationState>;
}
