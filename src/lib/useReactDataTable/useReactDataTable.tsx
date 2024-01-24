import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useReactDataTableState } from "../useReactDataTableState/useReactDataTableState";
import Skeleton from "react-loading-skeleton";
import { useReactDataTableProps } from "./useReactDataTableProps";
import { useReactDataTableResult } from "./useReactDataTableResult";

/**
 * A react hook that returns a react table instance and the state of the table
 */
const useReactDataTable = <TData,>(props: useReactDataTableProps<TData>): useReactDataTableResult<TData> => {
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
    reactTableOptions,
  } = props;
  const { columnFilters: columnFiltersInitial, sorting: sortingInitial, pagination: paginationInitial } = initialState ?? {};
  const { columnFilters: columnFiltersExternal, pagination: paginationExternal, sorting: sortingExternal } = state ?? {};

  const {
    columnFilters: columnFiltersInternal,
    pagination: paginationInternal,
    sorting: sortingInternal,
    setColumnFilters: setColumnFiltersInternal,
    setPagination: setPaginationInternal,
    setSorting: setSortingInternal,
  } = useReactDataTableState({
    initialColumnFilters: columnFiltersInitial,
    initialPagination: paginationInitial,
    initialSorting: sortingInitial,
  });

  const effectiveColumnFilters = columnFiltersExternal ?? columnFiltersInternal;
  const effectivePagination = paginationExternal ?? paginationInternal;
  const effectiveSorting = sortingExternal ?? sortingInternal;
  const effectiveOnColumnFiltersChange = onColumnFiltersChange ?? setColumnFiltersInternal;
  const effectiveOnPaginationChange = onPaginationChange ?? setPaginationInternal;
  const effectiveOnSortingChange = onSortingChange ?? setSortingInternal;

  const skeletonColumns = columns.map((column) => ({
    ...column,
    cell: () => <Skeleton />,
  }));
  const skeletonData = Array.from({ length: paginationInternal.pageSize }, () => ({} as TData));

  const table = useReactTable<TData>({
    data: isLoading ? skeletonData : data,
    columns: isLoading ? skeletonColumns : columns,

    onColumnFiltersChange: (filtersOrUpdaterFn) => {
      const newFilter = typeof filtersOrUpdaterFn !== "function" ? filtersOrUpdaterFn : filtersOrUpdaterFn(effectiveColumnFilters);
      return effectiveOnColumnFiltersChange(newFilter);
    },
    onPaginationChange: (paginationOrUpdaterFn) => {
      const newFilter = typeof paginationOrUpdaterFn !== "function" ? paginationOrUpdaterFn : paginationOrUpdaterFn(effectivePagination);
      return effectiveOnPaginationChange(newFilter);
    },
    onSortingChange: (sortingOrUpdaterFn) => {
      const newFilter = typeof sortingOrUpdaterFn !== "function" ? sortingOrUpdaterFn : sortingOrUpdaterFn(effectiveSorting);
      return effectiveOnSortingChange(newFilter);
    },

    state: {
      columnFilters: effectiveColumnFilters,
      pagination: effectivePagination,
      sorting: effectiveSorting,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualFiltering,
    manualPagination,
    manualSorting,

    enableMultiSort: false,

    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
    },

    ...reactTableOptions,
  });

  return {
    table,
    columnFilters: effectiveColumnFilters,
    pagination: effectivePagination,
    sorting: effectiveSorting,
    setColumnFilters: effectiveOnColumnFiltersChange,
    setPagination: effectiveOnPaginationChange,
    setSorting: effectiveOnSortingChange,
  };
};

export { useReactDataTable, useReactDataTableProps, useReactDataTableResult };
