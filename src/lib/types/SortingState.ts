/**
 * The type sorting state
 */
export interface SortingState<TData> {
    /**
     * the id of the sortable row
     */
    id: keyof TData;
  
    /**
     * the descending
     */
    desc: boolean;
  }