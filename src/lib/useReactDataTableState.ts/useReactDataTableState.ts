import { useState } from "react";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useReactDataTableStateProps } from "./useReactDataTableStateProps";
import { useReactDataTableStateResult } from "./useReactDataTableStateResult";

/**
 * A custom hook that will initialize all the state needed for the react data table
 * @returns the state and the setters
 */
const useReactDataTableState = (props: useReactDataTableStateProps = {}): useReactDataTableStateResult => {
  const { initialColumnFilters, initialSorting, initialPagination } = props;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters ?? []);
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex ?? 0,
    pageSize: initialPagination?.pageSize ?? 10,
  });

  return {
    sorting,
    pagination,
    columnFilters,
    setSorting,
    setColumnFilters,
    setPagination,
  };
};

export { useReactDataTableState, useReactDataTableStateProps, useReactDataTableStateResult };
