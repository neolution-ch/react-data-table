/* eslint-disable complexity */
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import { ReactDataTableProps } from "./ReactDataTableProps";
import { useReactTableState } from "./useReactDataTableState";
import { ReactDataTableRenderer } from "./ReactDataTableRenderer";

const ReactDataTable = <TData,>(props: ReactDataTableProps<TData>) => {
  const {
    data = [],
    columns,
    onFilterChange,
    onSortingChange,
    onPaginationChange,
    reactTableOptions,
    state,
    isLoading,
    rowStyle,
    isFetching,
    tableClassName,
    tableStyle,
    showPaging = true,
    pageSizes = [5, 10, 25, 50, 100],
    totalRecords = data.length,
  } = props;

  const { columnFilters: columnFiltersProps, sorting: sortingProps, pagination: paginationProps } = state ?? {};

  const {
    columnFilters: initialColumnFilters,
    sorting: initialSorting,
    pagination: initialPagination,
  } = reactTableOptions?.initialState ?? {};

  const {
    sorting: internalSorting,
    columnFilters: internalColumnFilters,
    pagination: internalPagination,
    setColumnFilters: setInternalColumnFilters,
    setPagination: setInternalPagination,
    setSorting: setInternalSorting,
  } = useReactTableState({
    initialColumnFilters,
    initialSorting,
    initialPagination,
  });

  const effectiveColumnFilters = columnFiltersProps ?? internalColumnFilters;
  const effectiveSorting = sortingProps ?? internalSorting;
  const effectivePagination = paginationProps ?? internalPagination;

  if (!pageSizes.includes(effectivePagination.pageSize)) {
    throw new Error(`The page size ${effectivePagination.pageSize} is not in the list of possible page sizes ${pageSizes.join(", ")}`);
  }

  if (onFilterChange && columnFiltersProps === undefined) {
    throw new Error("When using onFilterChange, the columnFilters state must be supplied");
  }

  if (onSortingChange && sortingProps === undefined) {
    throw new Error("When using onSortingChange, the sorting state must be supplied");
  }

  if (onPaginationChange && paginationProps === undefined) {
    throw new Error("When using onPaginationChange, the pagination state must be supplied");
  }

  if (sortingProps !== undefined && onSortingChange === undefined) {
    throw new Error("When using sorting state, the onSortingChange callback must be supplied");
  }

  if (columnFiltersProps !== undefined && onFilterChange === undefined) {
    throw new Error("When using columnFilters state, the onFilterChange callback must be supplied");
  }

  if (paginationProps !== undefined && onPaginationChange === undefined) {
    throw new Error("When using pagination state, the onPaginationChange callback must be supplied");
  }

  const skeletonColumns = columns.map((column) => ({
    ...column,
    cell: () => <Skeleton />,
  }));
  const skeletonData = Array.from({ length: effectivePagination.pageSize }, () => ({} as TData));

  const table = useReactTable<TData>({
    data: isLoading ? skeletonData : data,
    columns: isLoading ? skeletonColumns : columns,

    manualFiltering: !!onFilterChange,
    manualSorting: !!onSortingChange,
    manualPagination: !!onPaginationChange,

    enableColumnFilters: true,
    enableSorting: true,
    enableMultiSort: false,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: onFilterChange ? undefined : getFilteredRowModel(),
    getSortedRowModel: onSortingChange ? undefined : getSortedRowModel(),
    getPaginationRowModel: onPaginationChange ? undefined : getPaginationRowModel(),

    onColumnFiltersChange: onFilterChange ? onFilterChange : setInternalColumnFilters,
    onSortingChange: onSortingChange ? onSortingChange : setInternalSorting,
    onPaginationChange: onPaginationChange ? onPaginationChange : setInternalPagination,

    state: {
      columnFilters: effectiveColumnFilters,
      sorting: effectiveSorting,
      pagination: effectivePagination,
    },

    ...reactTableOptions,
  });

  const effectiveTotalRecords = onFilterChange ? totalRecords : table.getFilteredRowModel().rows.length;

  return (
    <ReactDataTableRenderer
      table={table}
      pageSizes={pageSizes}
      pagination={effectivePagination}
      totalRecords={effectiveTotalRecords}
      isFetching={isFetching}
      isLoading={isLoading}
      rowStyle={rowStyle}
      showPaging={showPaging}
      tableClassName={tableClassName}
      tableStyle={tableStyle}
    />
  );
};

export { ReactDataTable };
