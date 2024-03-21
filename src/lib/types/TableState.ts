import { CoreOptions } from "@tanstack/react-table";
import { SortingState } from "./SortingState";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FilterModel = { [k: string]: any };

/**
 * The table sorting state
 */
interface TableState<TData, TFilter extends FilterModel> extends Pick<CoreOptions<TData>["state"], "pagination">{
    /**
 * The column filters state
 */
    columnFilters: TFilter;

    sorting: SortingState<TData>;
}
  
export { TableState, FilterModel };