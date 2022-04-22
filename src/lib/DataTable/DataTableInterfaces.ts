/* eslint-disable max-lines */
import { CellFunction, ColumnFilterType, ListSortDirection, QueryFunction, RouteParams } from "./DataTableTypes";

export type RowStyleType<T> = (key: any, record: T) => React.CSSProperties;

export interface CommonDataTableProps<T> {
  rowStyle?: RowStyleType<T>;
  className?: string;
  style?: React.CSSProperties;
}

export interface DataTableRoutedProps<T, TFilter, TRouteName> extends CommonDataTableProps<T> {
  keyField: Extract<keyof T, string>;
  data: TableQueryResult<T>;
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableRoutedActions<T, TRouteName>;
  client?: TableQueryClient<T>;
  possiblePageItemCounts?: number[];
  predefinedItemsPerPage?: number;
  query?: QueryFunction<T, TFilter>;
  showPaging?: boolean;
  predefinedFilter?: TFilter;
  /**
   * The data table handlers.
   */
  handlers?: DataTableHandlers;
}

export interface DataTableProps<T, TFilter> extends CommonDataTableProps<T> {
  keyField: Extract<keyof T, string>;
  data: TableQueryResult<T>;
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableActions<T>;
  client?: TableQueryClient<T>;
  possiblePageItemCounts?: number[];
  predefinedItemsPerPage?: number;
  query?: QueryFunction<T, TFilter>;
  showPaging?: boolean;
  predefinedFilter?: TFilter;
  /**
   * The data table handlers.
   */
  handlers?: DataTableHandlers;
}

export interface DataTableColumnDescription<T> {
  dataField: Extract<keyof T, string>;
  text: string;
  sortable?: boolean;
  sortField?: string;
  filter?: ColumnFilter;
  enumValues?: EnumValue[];
  dateTimeFormat?: string;
  formatter?({ key, row, value }: DataTableCellFormatterParams<T>): JSX.Element | string;
  cellStyle?: CellFunction<T, React.CSSProperties> | React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

export interface ColumnFilter {
  filterType: ColumnFilterType;
  validate?(value: string): string;
}

export interface EnumValue {
  value: number | string | undefined;
  text: string;
}

export interface DataTableRoutedActions<T, TRouteNames> {
  columnTitle?: string;
  view?: DataTablePredefinedActionLink<T, TRouteNames>;
  delete?: DeleteAction<T>;
  collapse?: DataTableCollapseActions<T>;
  others?: DataTableAction<T>[];
  className?: string;
  style?: React.CSSProperties;
}

export interface DataTableActions<T> {
  columnTitle?: string;
  delete?: DeleteAction<T>;
  collapse?: DataTableCollapseActions<T>;
  others?: DataTableAction<T>[];
  className?: string;
  style?: React.CSSProperties;
}

export interface DataTableCollapseActions<T> {
  getRows(cell: T): T[];
  columns?: DataTableColumnDescription<T>[];
}

export interface DataTableAction<T> {
  formatter({ key, row }: DataTableActionFormatterParams<T>): JSX.Element;
}

export interface DataTableActionFormatterParams<T> {
  key: any;
  row: T;
}

export interface DataTableCellFormatterParams<T> extends DataTableActionFormatterParams<T> {
  value: any;
}

export interface DataTablePredefinedAction<T> {
  action({ key, cell }: DataTablePredefinedActionActionParams<T>): void;
}

export interface DataTablePredefinedActionActionParams<T> {
  key: any;
  cell: T;
}

export interface DeleteAction<T> extends DataTablePredefinedAction<T> {
  title: string;
  text: string;
}

export interface DataTablePredefinedActionLink<T, TRouteNames> {
  route: TRouteNames;
  getParams({ keyValue, cell }: DataTablePredefinedActionLinkGetParamsParams<T>): any;
  link: React.ComponentType<LinkProps>;
}

interface LinkProps {
  route: any;
  params?: RouteParams;
}

export interface DataTablePredefinedActionLinkGetParamsParams<T> {
  keyValue: any;
  cell: T;
}

export interface TableQueryResult<T> {
  totalRecords?: number;
  records?: T[];
}

export interface TableQueryClient<T> {
  query?(filter: any, limit?: number, page?: number, orderBy?: string, sortDirection?: ListSortDirection): Promise<TableQueryResult<T>>;
}

/**
 * The data table handlers types.
 */
export type DataTableHandlers = (dataHandlers: DataHandlers) => void;

/**
 * The data handlers.
 */
export interface DataHandlers {
  /**
   * Triggers a table data reload.
   */
  reloadData: () => void;
}

export interface OrderOption {
  orderBy?: string;
  asc?: boolean;
}

export interface Filters {
  [x: string]: HTMLInputElement;
}

export interface FilterState {
  [x: string]: any;
}

export interface FilterPageState {
  currentPage: number;
  itemsPerPage: number;
  filter: FilterState;
}

/**
 * This are the possible translations for the data table
 *
 * @interface DataTableTranslations
 * @property {string} clearSearchToolTip is used to print out the bottom text, possible placeholders are: {from}, {to} and {total}
 */
export interface DataTableTranslations {
  actionTitle: string;
  showedItemsText: string;
  searchToolTip: string;
  clearSearchToolTip: string;
  itemsPerPageDropdown: string;
  noEntries: string;
}

export interface DataTableStaticProps<T> extends CommonDataTableProps<T> {
  keyField: Extract<keyof T, string>;
  data: T[];
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableActions<T>;
  possiblePageItemCounts?: number[];
  predefinedItemsPerPage?: number;
  showPaging?: boolean;
  tableTitle?: string;
  hideIfEmpty?: boolean;
}

export interface DataTableStaticRoutedProps<T, TRouteNames> extends CommonDataTableProps<T> {
  keyField: Extract<keyof T, string>;
  data: T[];
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableRoutedActions<T, TRouteNames>;
  possiblePageItemCounts?: number[];
  predefinedItemsPerPage?: number;
  showPaging?: boolean;
  tableTitle?: string;
  hideIfEmpty?: boolean;
}

export interface DataTableSimpleStaticProps<T> extends CommonDataTableProps<T> {
  keyField: Extract<keyof T, string>;
  data: T[];
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableActions<T>;
  possiblePageItemCounts?: number[];
  predefinedItemsPerPage?: number;
  showPaging?: boolean;
  tableTitle?: string;
  hideIfEmpty?: boolean;
}
