import { DataTableCellFormatterParams, TableQueryResult } from "./DataTableInterfaces";

export type QueryFunction<T, TFilter> = (
  filter: TFilter,
  limit?: number | undefined,
  page?: number | undefined,
  orderBy?: string | null | undefined,
  asc?: boolean | undefined,
) => Promise<TableQueryResult<T>>;

export type CellFunction<T, TReturn> = ({ key, row, value }: DataTableCellFormatterParams<T>) => TReturn;

export enum ColumnFilterType {
  String = 0,
  Enum = 1,
}

export enum ListSortDirection {
  Ascending = 0,
  Descending = 1,
}

export enum ActionsPosition {
  Left = 0,
  Right = 1,
}

export type RouteParams = {
  [k: string]: string | number;
};
