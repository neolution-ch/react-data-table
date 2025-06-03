import { Row, Table } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { FilterModel } from "../types/TableState";
import { DragAndDropOptions } from "./DragAndDropOptions";

/**
 * The props for the ReactDataTable component
 */
export interface ReactDataTableProps<TData, TFilter extends FilterModel> {
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
   * boolean indicating whether to enable click for specific row
   * Notice that this is ignored in case of rowSelection feature is enabled and fullRowSelectable is not provided as false
   * @param row the row model
   */
  enableRowClick?: boolean | ((row: Row<TData>) => boolean);

  /**
   * callback which gets triggered when the row is clicked
   * Notice that this is ignored in case of rowSelection feature is enabled and fullRowSelectable is not provided as false
   * @param row the row model
   */
  onRowClick?: (row: Row<TData>) => void | Promise<void>;

  /**
   * boolean flag to indicate if the paging should be displayed
   */
  showPaging?: boolean;

  /**
   * boolean flag to hide the possibility to change the page size
   */
  hidePageSizeChange?: boolean;

  /**
   * callback that gets trigger by pressing enter or clicking the search icon
   */
  onEnter?: (columnFilters: TFilter) => void;

  /**
   * To draw the table without headers (titles + filters)
   */
  withoutHeaders?: boolean;

  /**
   * to draw the table without headers filters
   */
  withoutHeaderFilters?: boolean;

  /**
   * to define drag-and-drop options
   */
  dragAndDropOptions?: DragAndDropOptions;

  /**
   * to override the default message in case no entries is found
   */
  noEntriesMessage?: string;

  /**
   * boolean flag to indicate if the table should be striped
   * @default true
   */
  isStriped?: boolean;

  /**
   * boolean flag to indicate if the table should have hover effect
   * @default true
   */
  showClearSearchButton?: boolean;
}
