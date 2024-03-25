import { SortingState as CustomSortingState } from "../types/SortingState";
import { SortingState } from "@tanstack/react-table";

const getModelFromSortingState = <TData>(sortingState: SortingState): CustomSortingState<TData> | undefined => {
  const [first] = sortingState;
  return first ? { id: first.id as keyof TData, desc: first.desc } : undefined;
};

export { getModelFromSortingState };
