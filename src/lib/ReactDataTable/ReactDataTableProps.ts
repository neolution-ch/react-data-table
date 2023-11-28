import { CSSProperties } from "react";
import { ColumnDef, ColumnFiltersState, CoreOptions, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";

export interface ReactDataTableProps<TData> {
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
   * Called when the user changes the filters.
   * When supplied, the table will be in manual filtering mode, otherwise it will be in auto filtering mode
   * @param filters the new filters
   * @returns void
   */
  onFilterChange?: OnChangeFn<ColumnFiltersState>;

  /**
   * Called when the user changes the sorting.
   * When supplied, the table will be in manual sorting mode, otherwise it will be in auto sorting mode
   * @param sorts the new sorting
   * @returns void
   */
  onSortingChange?: OnChangeFn<SortingState>;

  /**
   * Called when the user changes the pagination
   * When supplied, the table will be in manual pagination mode, otherwise it will be in auto pagination mode
   * @param pagination the new pagination
   * @returns void
   */
  onPaginationChange?: OnChangeFn<PaginationState>;

  /**
   * custom row style
   * @param row the row to style
   * @returns the style
   */
  rowStyle?: (row: TData) => CSSProperties;

  /**
   * custom table class name
   */
  tableClassName?: string;

  /**
   * custom table style
   */
  tableStyle?: CSSProperties;

  /**
   * the page sizes to display in the page size dropdown
   * @default [5, 10, 25, 50, 100]
   */
  pageSizes?: number[];

  /**
   * boolean flag to indicate if the paging should be displayed
   */
  showPaging?: boolean;

  /**
   * total number of records in the table, if not supplied,
   * the table will assume that all the data is loaded and set it to the length of the data array
   */
  totalRecords?: number;

  /**
   * indicates if the table is loading data for the first time
   * will display skeletons if true
   */
  isLoading?: boolean;

  /**
   * indicates if the table is fetching data
   * will display loading indicator if true while keeping the data in the table and reactive
   */
  isFetching?: boolean;

  /**
   * the state of the table for column filters, global filter, sorting and pagination
   * :warning: if you supply one of those properties, you must also supply the corresponding callback.
   */
  state?: Pick<CoreOptions<TData>["state"], "columnFilters" | "sorting" | "pagination">;

  /**
   * the react table options that will be passed to the `useReactTable` hook.
   * Omits the `state` property. Use the `initialState` property instead.
   * ref: https://tanstack.com/table/v8/docs/api/core/table#usereacttable--createsolidtable--usevuetable--createsveltetable
   */
  reactTableOptions?: Omit<CoreOptions<TData>, "state">;
}
