import { SortingState } from "@tanstack/react-table";
import { SortingState as CustomSortingState } from "../types/SortingState";

const getSortingStateFromModel = <TData>(sortingState: CustomSortingState<TData>): SortingState => [
  { id: String(sortingState.id), desc: sortingState.desc },
];

export { getSortingStateFromModel };
