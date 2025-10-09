/* eslint-disable max-lines */
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReactDataTableState, useReactDataTableStateProps } from "../useReactDataTableState/useReactDataTableState";
import Skeleton from "react-loading-skeleton";
import { useReactDataTableProps } from "./useReactDataTableProps";
import { useReactDataTableResult } from "./useReactDataTableResult";
import { getColumnFilterFromModel } from "../utils/getColumnFilterFromModel";
import { FilterModel } from "../types/TableState";
import { getModelFromColumnFilter } from "../utils/getModelFromColumnFilter";
import { getSortingStateFromModel } from "../utils/getSortingStateFromModel";
import { getModelFromSortingState } from "../utils/getModelFromSortingState";
import { OptionalNullable } from "../types/NullableTypes";
import { useMemo } from "react";

/**
 * A react hook that returns a react table instance and the state of the table
 * @param props The properties to configure the table
 * @returns The table instance and the state of the table
 */
// eslint-disable-next-line complexity
const useReactDataTable = <TData, TFilter extends FilterModel = Record<string, never>>(
  props: useReactDataTableProps<TData, TFilter>,
): useReactDataTableResult<TData, TFilter> => {
  const {
    data = [],
    columns,
    isLoading,
    initialState,
    manualFiltering,
    manualPagination,
    manualSorting,
    state,
    onColumnFiltersChange,
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange,
    onExpandedChange,
    onColumnPinningChange,
    reactTableOptions,
  } = props;

  const {
    columnFilters: columnFiltersInitial,
    sorting: sortingInitial,
    pagination: paginationInitial,
    rowSelection: rowSelectionInitial,
    expanded: expandedInitial,
    columnPinning: columnPinningInitial,
  } = initialState ?? {};
  const {
    columnFilters: columnFiltersExternal,
    pagination: paginationExternal,
    sorting: sortingExternal,
    rowSelection: rowSelectionExternal,
    expanded: expandedExternal,
    columnPinning: columnPinningExternal,
  } = state ?? {};

  const {
    columnFilters: columnFiltersInternal,
    pagination: paginationInternal,
    sorting: sortingInternal,
    rowSelection: rowSelectionInteral,
    expanded: expandedInternal,
    columnPinning: columnPinningInternal,
    setColumnFilters: setColumnFiltersInternal,
    setPagination: setPaginationInternal,
    setSorting: setSortingInternal,
    setRowSelection: setRowSelectionInternal,
    setExpanded: setExpandedInternal,
    setColumnPinning: setColumnPinningInternal,
  } = useReactDataTableState<TData, TFilter>({
    initialColumnFilters: columnFiltersInitial as TFilter,
    initialPagination: paginationInitial,
    initialSorting: sortingInitial,
    rowSelection: rowSelectionInitial,
    expanded: expandedInitial,
    columnPinning: columnPinningInitial,
  } as unknown as OptionalNullable<useReactDataTableStateProps<TData, TFilter>>);

  const effectiveColumnFilters = columnFiltersExternal ?? columnFiltersInternal;
  const effectivePagination = paginationExternal ?? paginationInternal;
  const effectiveSorting = sortingExternal ?? sortingInternal;
  const effectiveRowSelection = rowSelectionExternal ?? rowSelectionInteral;
  const effectiveExpanded = expandedExternal ?? expandedInternal;
  const effectiveColumnPinning = columnPinningExternal ?? columnPinningInternal;
  const effectiveOnColumnFiltersChange = onColumnFiltersChange ?? setColumnFiltersInternal;
  const effectiveOnPaginationChange = onPaginationChange ?? setPaginationInternal;
  const effectiveOnSortingChange = onSortingChange ?? setSortingInternal;
  const effectiveOnRowSelectionChange = onRowSelectionChange ?? setRowSelectionInternal;
  const effectiveOnExpandedChange = onExpandedChange ?? setExpandedInternal;
  const effectiveOnColumnPinningChange = onColumnPinningChange ?? setColumnPinningInternal;

  // If we active the manual filtering, we have to unset the filter function, else it still does automatic filtering
  if (manualFiltering) for (const x of columns) x.filterFn = undefined;

  const internalColumns = columns.filter((x) => x.meta?.isHidden !== true);
  const skeletonColumns = internalColumns.map((column) => ({
    ...column,
    cell: () => <Skeleton />,
  }));
  const skeletonData = Array.from({ length: paginationInternal.pageSize }, () => ({}) as TData);

  const columnFilters = useMemo(() => getColumnFilterFromModel(effectiveColumnFilters), [effectiveColumnFilters]);
  const sorting = useMemo(() => getSortingStateFromModel(effectiveSorting), [effectiveSorting]);

  const table = useReactTable<TData>({
    data: isLoading ? skeletonData : data,
    columns: isLoading ? skeletonColumns : internalColumns,

    onColumnFiltersChange: (filtersOrUpdaterFn) => {
      const newFilter = typeof filtersOrUpdaterFn === "function" ? filtersOrUpdaterFn(columnFilters) : filtersOrUpdaterFn;
      return effectiveOnColumnFiltersChange(getModelFromColumnFilter(newFilter));
    },
    onPaginationChange: (paginationOrUpdaterFn) => {
      const newFilter = typeof paginationOrUpdaterFn === "function" ? paginationOrUpdaterFn(effectivePagination) : paginationOrUpdaterFn;
      return effectiveOnPaginationChange(newFilter);
    },
    onSortingChange: (sortingOrUpdaterFn) => {
      const newFilter = typeof sortingOrUpdaterFn === "function" ? sortingOrUpdaterFn(sorting) : sortingOrUpdaterFn;
      return effectiveOnSortingChange(getModelFromSortingState(newFilter));
    },
    onRowSelectionChange: (rowSelectionOrUpdaterFn) => {
      const newRowSelection =
        typeof rowSelectionOrUpdaterFn === "function" ? rowSelectionOrUpdaterFn(effectiveRowSelection) : rowSelectionOrUpdaterFn;
      return effectiveOnRowSelectionChange(newRowSelection);
    },
    onExpandedChange: (expandedOrUpdaterFn) => {
      const newExpanded = typeof expandedOrUpdaterFn === "function" ? expandedOrUpdaterFn(effectiveExpanded) : expandedOrUpdaterFn;
      return effectiveOnExpandedChange(newExpanded);
    },
    onColumnPinningChange: (columnPinningOrUpdaterFn) => {
      const newColumnPinning =
        typeof columnPinningOrUpdaterFn === "function" ? columnPinningOrUpdaterFn(effectiveColumnPinning) : columnPinningOrUpdaterFn;
      return effectiveOnColumnPinningChange(newColumnPinning);
    },

    state: {
      columnFilters,
      pagination: effectivePagination,
      sorting,
      rowSelection: effectiveRowSelection,
      expanded: effectiveExpanded,
      columnPinning: effectiveColumnPinning,
    },

    initialState: {
      columnFilters: getColumnFilterFromModel(columnFiltersInitial ?? columnFiltersExternal ?? {}),
      pagination: paginationInitial ?? paginationExternal,
      sorting: getSortingStateFromModel(sortingInitial ?? sortingExternal),
      expanded: expandedInitial ?? expandedExternal,
      columnPinning: columnPinningInitial ?? columnPinningExternal,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),

    manualFiltering,
    manualPagination,
    manualSorting,

    enableMultiSort: false,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,

    // The row selection is enabled by default in Tanstack API. We don't want it per default
    enableRowSelection: reactTableOptions?.enableRowSelection ?? false,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
    },

    enableExpanding: reactTableOptions?.enableExpanding ?? false,

    ...reactTableOptions,
  });

  return {
    table,
    columnFilters: effectiveColumnFilters,
    pagination: effectivePagination,
    sorting: effectiveSorting,
    rowSelection: effectiveRowSelection,
    expanded: effectiveExpanded,
    columnPinning: effectiveColumnPinning,
    setColumnFilters: effectiveOnColumnFiltersChange,
    setPagination: effectiveOnPaginationChange,
    setSorting: effectiveOnSortingChange,
    setRowSelection: effectiveOnRowSelectionChange,
    setExpanded: effectiveOnExpandedChange,
    setColumnPinning: effectiveOnColumnPinningChange,
  };
};

export { useReactDataTable };

export { useReactDataTableProps } from "./useReactDataTableProps";

export { useReactDataTableResult } from "./useReactDataTableResult";
