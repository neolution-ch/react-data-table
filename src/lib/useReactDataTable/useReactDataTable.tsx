import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
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
 */
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
    reactTableOptions,
  } = props;

  const {
    columnFilters: columnFiltersInitial,
    sorting: sortingInitial,
    pagination: paginationInitial,
    rowSelection: rowSelectionInitial,
  } = initialState ?? {};
  const {
    columnFilters: columnFiltersExternal,
    pagination: paginationExternal,
    sorting: sortingExternal,
    rowSelection: rowSelectionExternal,
  } = state ?? {};

  const {
    columnFilters: columnFiltersInternal,
    pagination: paginationInternal,
    sorting: sortingInternal,
    rowSelection: rowSelectionInteral,
    setColumnFilters: setColumnFiltersInternal,
    setPagination: setPaginationInternal,
    setSorting: setSortingInternal,
    setRowSelection: setRowSelectionInternal,
  } = useReactDataTableState<TData, TFilter>({
    initialColumnFilters: columnFiltersInitial as TFilter,
    initialPagination: paginationInitial,
    initialSorting: sortingInitial,
    rowSelection: rowSelectionInitial,
  } as unknown as OptionalNullable<useReactDataTableStateProps<TData, TFilter>>);

  const effectiveColumnFilters = columnFiltersExternal ?? columnFiltersInternal;
  const effectivePagination = paginationExternal ?? paginationInternal;
  const effectiveSorting = sortingExternal ?? sortingInternal;
  const effectiveRowSelection = rowSelectionExternal ?? rowSelectionInteral;
  const effectiveOnColumnFiltersChange = onColumnFiltersChange ?? setColumnFiltersInternal;
  const effectiveOnPaginationChange = onPaginationChange ?? setPaginationInternal;
  const effectiveOnSortingChange = onSortingChange ?? setSortingInternal;
  const effectiveOnRowSelectionChange = onRowSelectionChange ?? setRowSelectionInternal;

  // If we active the manual filtering, we have to unset the filter function, else it still does automatic filtering
  if (manualFiltering) columns.forEach((x) => (x.filterFn = undefined));

  const internalColumns = columns.filter((x) => x.meta?.isHidden !== true);
  const skeletonColumns = internalColumns.map((column) => ({
    ...column,
    cell: () => <Skeleton />,
  }));
  const skeletonData = Array.from({ length: paginationInternal.pageSize }, () => ({} as TData));

  const columnFilters = useMemo(() => getColumnFilterFromModel(effectiveColumnFilters), [effectiveColumnFilters]);
  const sorting = useMemo(() => getSortingStateFromModel(effectiveSorting), [effectiveSorting]);

  const table = useReactTable<TData>({
    data: isLoading ? skeletonData : data,
    columns: isLoading ? skeletonColumns : internalColumns,

    onColumnFiltersChange: (filtersOrUpdaterFn) => {
      const newFilter = typeof filtersOrUpdaterFn !== "function" ? filtersOrUpdaterFn : filtersOrUpdaterFn(columnFilters);
      return effectiveOnColumnFiltersChange(getModelFromColumnFilter(newFilter));
    },
    onPaginationChange: (paginationOrUpdaterFn) => {
      const newFilter = typeof paginationOrUpdaterFn !== "function" ? paginationOrUpdaterFn : paginationOrUpdaterFn(effectivePagination);
      return effectiveOnPaginationChange(newFilter);
    },
    onSortingChange: (sortingOrUpdaterFn) => {
      const newFilter = typeof sortingOrUpdaterFn !== "function" ? sortingOrUpdaterFn : sortingOrUpdaterFn(sorting);
      return effectiveOnSortingChange(getModelFromSortingState(newFilter));
    },
    onRowSelectionChange: (rowSelectionOrUpdaterFn) => {
      const newRowSelection =
        typeof rowSelectionOrUpdaterFn !== "function" ? rowSelectionOrUpdaterFn : rowSelectionOrUpdaterFn(effectiveRowSelection);
      return effectiveOnRowSelectionChange(newRowSelection);
    },

    state: {
      columnFilters,
      pagination: effectivePagination,
      sorting,
      rowSelection: effectiveRowSelection,
    },

    initialState: {
      columnFilters: getColumnFilterFromModel(columnFiltersInitial ?? columnFiltersExternal ?? {}),
      pagination: paginationInitial ?? paginationExternal,
      sorting: getSortingStateFromModel(sortingInitial ?? sortingExternal),
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

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

    ...reactTableOptions,
  });

  return {
    table,
    columnFilters: effectiveColumnFilters as TFilter,
    pagination: effectivePagination,
    sorting: effectiveSorting,
    rowSelection: effectiveRowSelection,
    setColumnFilters: effectiveOnColumnFiltersChange,
    setPagination: effectiveOnPaginationChange,
    setSorting: effectiveOnSortingChange,
    setRowSelection: effectiveOnRowSelectionChange,
  };
};

export { useReactDataTable, useReactDataTableProps, useReactDataTableResult };
