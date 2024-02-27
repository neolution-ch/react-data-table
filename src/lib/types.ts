interface ColumnSort<TData> {
    desc: boolean;
    id: keyof TData;
}
  
export type SortingState<TData> = ColumnSort<TData>[];