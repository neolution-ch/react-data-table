import { getLocalStorageItem, setLocalStorageItem } from "@neolution-ch/javascript-utils";
import { OptionalNullable } from "../types/NullableTypes";
import { useReactDataTableStateProps } from "./useReactDataTableStateProps";
import { useReactDataTableStateResult } from "./useReactDataTableStateResult";
import { useReactDataTableState } from "./useReactDataTableState";

const usePersistentReactDataTableState = <TData, TFilter extends object = Record<string, never>>(
  props: OptionalNullable<useReactDataTableStateProps<TData, TFilter>> & { localStorageKey: string },
): useReactDataTableStateResult<TData, TFilter> => {
  const {
    pagination,
    setPagination,
    columnFilters,
    columnPinning,
    expanded,
    rowSelection,
    sorting,
    setColumnFilters,
    afterSearchFilter,
    setAfterSearchFilter,
    setColumnPinning,
    setExpanded,
    setRowSelection,
    setSorting,
  } = useReactDataTableState<TData, TFilter>({
    initialColumnPinning:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialColumnPinning"]>(`${props.localStorageKey}_columnPinning`) ??
      props?.initialColumnPinning,
    initialExpanded:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialExpanded"]>(`${props.localStorageKey}_expanded`) ??
      props?.initialExpanded,
    initialPagination:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialPagination"]>(`${props.localStorageKey}_pagination`) ??
      props?.initialPagination,
    initialRowSelection:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialRowSelection"]>(`${props.localStorageKey}_rowSelection`) ??
      props?.initialRowSelection,
    initialSorting:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialSorting"]>(`${props.localStorageKey}_sorting`) ??
      props?.initialSorting,
    initialColumnFilters:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialColumnFilters"]>(`${props.localStorageKey}_columnFilters`) ??
      props?.initialColumnFilters,
    initialAfterSearchFilter:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialAfterSearchFilter"]>(
        `${props.localStorageKey}_afterSearchFilter`,
      ) ?? props?.initialAfterSearchFilter,
  } as OptionalNullable<useReactDataTableStateProps<TData, TFilter>>);

  return {
    pagination,
    setPagination: (newPagination) => {
      setPagination(newPagination);
      setLocalStorageItem(`${props.localStorageKey}_pagination`, newPagination);
    },
    columnFilters,
    setColumnFilters: (newColumnFilters) => {
      setColumnFilters(newColumnFilters);
      setLocalStorageItem(`${props.localStorageKey}_columnFilters`, newColumnFilters);
    },
    afterSearchFilter,
    setAfterSearchFilter: (newAfterSearchFilter) => {
      setAfterSearchFilter(newAfterSearchFilter);
      setLocalStorageItem(`${props.localStorageKey}_afterSearchFilter`, newAfterSearchFilter);
    },
    columnPinning,
    setColumnPinning: (newColumnPinning) => {
      setColumnPinning(newColumnPinning);
      setLocalStorageItem(`${props.localStorageKey}_columnPinning`, newColumnPinning);
    },
    expanded,
    setExpanded: (newExpanded) => {
      setExpanded(newExpanded);
      setLocalStorageItem(`${props.localStorageKey}_expanded`, newExpanded);
    },
    rowSelection,
    setRowSelection: (newRowSelection) => {
      setRowSelection(newRowSelection);
      setLocalStorageItem(`${props.localStorageKey}_rowSelection`, newRowSelection);
    },
    sorting,
    setSorting: (newSorting) => {
      setSorting(newSorting);
      setLocalStorageItem(`${props.localStorageKey}_sorting`, newSorting);
    },
  };
};

export { usePersistentReactDataTableState };
