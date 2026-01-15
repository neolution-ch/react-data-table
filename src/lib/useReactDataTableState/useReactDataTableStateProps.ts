import { ColumnPinningState, ExpandedState, PaginationState, RowSelectionState } from "@tanstack/react-table";
import { SortingState } from "../types/SortingState";
import { FilterModel } from "../types/TableState";
import { ColumnFilterState } from "../types/ColumnFilterState";

/**
 * The props for the useReactDataTableState hook
 */
export interface useReactDataTableStateProps<TData, TFilter extends FilterModel> {
  /**
   * the initial column filters
   */
  initialColumnFilters: ColumnFilterState<TFilter>;

  /**
   * the initial after search filter
   */
  initialAfterSearchFilter?: ColumnFilterState<TFilter>;

  /**
   * the initial sorting
   */
  initialSorting?: SortingState<TData>;

  /**
   * the initial pagination
   */
  initialPagination?: Partial<PaginationState>;

  /**
   * the initial row selection
   */
  initialRowSelection?: RowSelectionState;

  /**
   * the initial expanded
   */
  initialExpanded?: ExpandedState;

  /**
   * the initial column pinning
   */
  initialColumnPinning?: ColumnPinningState;
}
