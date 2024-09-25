import { useState } from "react";
import { ColumnPinningState, ExpandedState, PaginationState, RowSelectionState } from "@tanstack/react-table";
import { useReactDataTableStateProps } from "./useReactDataTableStateProps";
import { useReactDataTableStateResult } from "./useReactDataTableStateResult";
import { FilterModel } from "../types/TableState";
import { SortingState } from "../types/SortingState";
import { OptionalNullable } from "../types/NullableTypes";

/**
 * A custom hook that will initialize all the state needed for the react data table
 * @returns the state and the setters
 */
const useReactDataTableState = <TData, TFilter extends FilterModel = Record<string, never>>(
  props: OptionalNullable<useReactDataTableStateProps<TData, TFilter>>,
): useReactDataTableStateResult<TData, TFilter> => {
  const { initialColumnFilters, initialSorting, initialPagination, initialRowSelection, initialExpanded, initialColumnPinning } =
    props as useReactDataTableStateProps<TData, TFilter>;

  const [columnFilters, setColumnFilters] = useState<TFilter>((initialColumnFilters ?? {}) as TFilter);
  const [afterSearchFilter, setAfterSearchFilter] = useState<TFilter>((initialColumnFilters ?? {}) as TFilter);
  const [sorting, setSorting] = useState<SortingState<TData> | undefined>(initialSorting);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialRowSelection ?? ({} as RowSelectionState));
  const [expanded, setExpanded] = useState<ExpandedState>(initialExpanded ?? ({} as ExpandedState));
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialColumnPinning ?? ({} as ColumnPinningState));

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex ?? 0,
    pageSize: initialPagination?.pageSize ?? 10,
  });

  return {
    sorting,
    pagination,
    columnFilters,
    afterSearchFilter,
    rowSelection,
    expanded,
    columnPinning,
    setSorting,
    setColumnFilters,
    setPagination,
    setAfterSearchFilter,
    setRowSelection,
    setExpanded,
    setColumnPinning,
  };
};

export { useReactDataTableState, useReactDataTableStateProps, useReactDataTableStateResult };
