import { useState } from "react";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

interface useReactTableStateProps<> {
  initialColumnFilters?: ColumnFiltersState;
  initialSorting?: SortingState;
  initialPagination?: Partial<PaginationState>;
}
/**
 * A custom hook that will initialize all the state needed for the react table
 * @returns the state and the setters
 */
const useReactTableState = (props: useReactTableStateProps = {}) => {
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

export { useReactTableState };
