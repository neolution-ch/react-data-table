import { useReactDataTable } from "../useReactDataTable/useReactDataTable";
import { useReactDataTableProps } from "../useReactDataTable/useReactDataTableProps";
import { useReactDataTableResult } from "../useReactDataTable/useReactDataTableResult";
import { FilterModel, TableState } from "../types/TableState";

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

interface useFullyControlledReactDataTableProps<TData, TFilter extends FilterModel>
  extends WithRequired<
    Omit<useReactDataTableProps<TData, TFilter>, "manualFiltering" | "manualPagination" | "manualSorting">,
    "onColumnFiltersChange" | "onPaginationChange" | "onSortingChange"
  > {
  state: {
    columnFilters: TableState<TData, TFilter>["columnFilters"];
    pagination: TableState<TData, TFilter>["pagination"];
    sorting: TableState<TData, TFilter>["sorting"];
    expanded: TableState<TData, TFilter>["expanded"];
    rowSelection?: TableState<TData, TFilter>["rowSelection"];
    columnPinning?: TableState<TData, TFilter>["columnPinning"];
  };
}

/**
 * A helper hook to use the useReactDataTable hook which is fully controlled. Usefull for server side filtering, sorting and pagination.
 * @param props The properties to configure the table
 * @returns The table instance and the state of the table
 */
const useFullyControlledReactDataTable = <TData, TFilter extends FilterModel>(
  props: useFullyControlledReactDataTableProps<TData, TFilter>,
): useReactDataTableResult<TData, TFilter> =>
  useReactDataTable<TData, TFilter>({ manualFiltering: true, manualPagination: true, manualSorting: true, ...props });

export { useFullyControlledReactDataTable };
