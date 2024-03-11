import { ColumnFiltersState, Table } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { DragEndEvent } from "@dnd-kit/core";

/**
 * The props for the ReactDataTable component
 */
export interface ReactDataTableProps<TData> {
  /**
   * the table instance returned from useReactDataTable or useReactTable
   */
  table: Table<TData>;

  /**
   * the page sizes to display in the page size dropdown
   * @default [5, 10, 25, 50, 100]
   */
  pageSizes?: number[];

  /**
   * custom table class name
   */
  tableClassName?: string;

  /**
   * custom table style
   */
  tableStyle?: CSSProperties;

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
   * custom row style
   * @param row the row to style
   * @returns the style
   */
  rowStyle?: (row: TData) => CSSProperties;

  /**
   * boolean flag to indicate if the paging should be displayed
   */
  showPaging?: boolean;

  /**
   * callback that gets trigger by pressing enter or clicking the search icon
   */
  onEnter?: (columnFilters: ColumnFiltersState) => void;

  /**
   * To draw the table without headers (titles + filters)
   */
  withoutHeaders?: boolean;

  /**
   * To draw the table without headers filters
   */
  withoutHeaderFilters?: boolean;

  /**
   * the table drag-and-drop sortable key field for which needs the drag-and-drop
   * if not provided the drag-and-drop is disabled
   */
  draggableField?: keyof TData;

  /**
   * the handle drag end method to be called once the row drag has fulfilled
   * @param event the drag end event
   */
  handleDragEnd?(event: DragEndEvent): void;
}
