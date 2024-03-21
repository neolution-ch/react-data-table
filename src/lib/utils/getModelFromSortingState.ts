import { SortingState as CustomSortingState } from "../types/SortingState";
import { SortingState } from "@tanstack/react-table";

const getModelFromSortingState = <TData>(sortingState: SortingState): CustomSortingState<TData> => {
    const [first] = sortingState;
    return { id: first.id as keyof TData, desc: first.desc };
};

export { getModelFromSortingState };
