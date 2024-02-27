import { ColumnDef, ColumnFiltersState, CoreOptions, OnChangeFn, PaginationState, TableOptions } from "@tanstack/react-table";
import { SortingState } from "../types";

interface State<TData> extends Pick<CoreOptions<TData>["state"], "columnFilters" | "pagination">{
  columnVisibility: Record<keyof TData, boolean>;
  sorting: SortingState<TData>;
}

/**
 * The props for the useReactDataTable hook
 */
export interface useReactDataTableProps<TData> {
  /**
   * data to display in the table
   */
  data?: TData[];

  /**
   * columns to display in the table. You can use the createColumnHelper to create the columns
   * ref: https://tanstack.com/table/v8/docs/guide/column-defs#column-helpers
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];

  /**
   * indicates if the table is loading data for the first time
   * will display skeletons if true
   */
  isLoading?: boolean;

  /**
   * initial state of the table, for column filters, global filter, sorting and pagination
   * will only be used if the corresponding state property is not supplied.
   * So for example, if you supply the `state.columnFilters` property, the `initialState.columnFilters` property will be ignored.
   */
  initialState?: State<TData>;

  /**
   * the state of the table for column filters, global filter, sorting and pagination
   */
  state?: State<TData>;

  /**
   * indicates if the table should be manually filtered
   */
  manualFiltering?: boolean;

  /**
   * indicates if the table should be manually paginated
   */
  manualPagination?: boolean;

  /**
   * indicates if the table should be manually sorted
   */
  manualSorting?: boolean;

  /**
   * event handler for when the column filters change
   */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;

  /**
   * event handler for when the pagination changes
   */
  onPaginationChange?: OnChangeFn<PaginationState>;

  /**
   * event handler for when the sorting changes
   */
  onSortingChange?: OnChangeFn<SortingState<TData>>;

  /**
   * the react table options that will be passed to the `useReactTable` hook.
   * Omits the `state` property. Use the `state` property instead.
   * ref: https://tanstack.com/table/v8/docs/api/core/table#usereacttable--createsolidtable--usevuetable--createsveltetable
   */
  reactTableOptions?: Partial<Omit<TableOptions<TData>, "state">>;
}
