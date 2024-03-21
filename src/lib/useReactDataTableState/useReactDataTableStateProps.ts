import { PaginationState } from "@tanstack/react-table";
import { SortingState } from "../types/SortingState";
import { FilterModel } from "../types/TableState";

/**
 * The props for the useReactDataTableState hook
 */
export interface useReactDataTableStateProps<TData, TFilter extends FilterModel> {
  /**
   * the initial column filters
   */
  initialColumnFilters?: TFilter;

  /**
   * the initial sorting
   */
  initialSorting?: SortingState<TData>;

  /**
   * the initial pagination
   */
  initialPagination?: Partial<PaginationState>;
}
