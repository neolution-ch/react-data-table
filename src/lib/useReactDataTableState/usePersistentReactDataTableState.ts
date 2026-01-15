import { getLocalStorageItem, setLocalStorageItem } from "@neolution-ch/javascript-utils";
import { OptionalNullable } from "../types/NullableTypes";
import { useReactDataTableStateProps } from "./useReactDataTableStateProps";
import { useReactDataTableStateResult } from "./useReactDataTableStateResult";
import { useReactDataTableState } from "./useReactDataTableState";
import { FilterModel } from "../types/TableState";

/**
 * A custom hook that will initialize all the state needed for the react data table and will persist it to local storage
 * @param props The properties to configure the initial state
 * @returns the state and the setters
 */
const usePersistentReactDataTableState = <TData, TFilter extends FilterModel = Record<string, never>>(
  props: OptionalNullable<useReactDataTableStateProps<TData, TFilter>> & { localStorageKey: string },
): useReactDataTableStateResult<TData, TFilter> => {
  const {
    initialColumnFilters,
    initialSorting,
    initialPagination,
    initialRowSelection,
    initialExpanded,
    initialColumnPinning,
    initialAfterSearchFilter,
    localStorageKey,
  } = props as useReactDataTableStateProps<TData, TFilter> & { localStorageKey: string };

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
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialColumnPinning"]>(`${localStorageKey}_columnPinning`) ??
      initialColumnPinning,
    initialExpanded:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialExpanded"]>(`${localStorageKey}_expanded`) ?? initialExpanded,
    initialPagination:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialPagination"]>(`${localStorageKey}_pagination`) ??
      initialPagination,
    initialRowSelection:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialRowSelection"]>(`${localStorageKey}_rowSelection`) ??
      initialRowSelection,
    initialSorting:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialSorting"]>(`${localStorageKey}_sorting`) ?? initialSorting,
    initialColumnFilters:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialColumnFilters"]>(`${localStorageKey}_columnFilters`) ??
      initialColumnFilters,
    initialAfterSearchFilter:
      getLocalStorageItem<useReactDataTableStateProps<TData, TFilter>["initialAfterSearchFilter"]>(
        `${localStorageKey}_afterSearchFilter`,
      ) ?? initialAfterSearchFilter,
  } as useReactDataTableStateProps<TData, TFilter> as OptionalNullable<useReactDataTableStateProps<TData, TFilter>>);

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
