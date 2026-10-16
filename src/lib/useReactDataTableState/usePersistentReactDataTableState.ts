import { getLocalStorageItem, setLocalStorageItem } from "@neolution-ch/javascript-utils";
import { OptionalNullable } from "../types/NullableTypes";
import { useReactDataTableStateProps } from "./useReactDataTableStateProps";
import { useReactDataTableStateResult } from "./useReactDataTableStateResult";
import { useReactDataTableState } from "./useReactDataTableState";
import { FilterModel } from "../types/TableState";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";

interface PersistentReactDataTableStateProps {
  /**
   * The prefix of the local storage keys the state is persisted under
   */
  localStorageKey: string;
  /**
   * Returns the date the persisted state expires, called on every write (e.g. `() => getEndOfDay(new Date())`).
   * Expired state is ignored and the initial state is used instead. Without it, the persisted state never expires.
   */
  getExpirationDate?: () => Date;
}

/**
 * A custom hook that will initialize all the state needed for the react data table and will persist it to local storage
 * @param props The properties to configure the initial state
 * @returns the state and the setters
 */
const usePersistentReactDataTableState = <TData, TFilter extends FilterModel = Record<string, never>>(
  props: OptionalNullable<useReactDataTableStateProps<TData, TFilter>> & PersistentReactDataTableStateProps,
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
    getExpirationDate,
  } = props as useReactDataTableStateProps<TData, TFilter> & PersistentReactDataTableStateProps;

  // kept in a ref, so an inline function does not make the setters change on every render
  const getExpirationDateRef = useRef(getExpirationDate);
  useEffect(() => {
    getExpirationDateRef.current = getExpirationDate;
  }, [getExpirationDate]);

  // Update functions (e.g. `setSorting(previous => ...)`) are resolved against the previous state, so the resolved state gets
  // persisted and not the function itself. The write happens inside the updater, which React may call twice in StrictMode,
  // that only writes the same state again.
  const setAndPersistState = useCallback(
    <TState>(setState: Dispatch<SetStateAction<TState>>, localStorageKeySuffix: string, newState: SetStateAction<TState>) => {
      setState((previousState) => {
        const resolvedState = typeof newState === "function" ? (newState as (previousState: TState) => TState)(previousState) : newState;
        setLocalStorageItem(`${localStorageKey}_${localStorageKeySuffix}`, resolvedState, getExpirationDateRef.current?.());
        return resolvedState;
      });
    },
    [localStorageKey],
  );

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
    setPagination: useCallback(
      (newPagination) => setAndPersistState(setPagination, "pagination", newPagination),
      [setAndPersistState, setPagination],
    ),
    columnFilters,
    setColumnFilters: useCallback(
      (newColumnFilters) => setAndPersistState(setColumnFilters, "columnFilters", newColumnFilters),
      [setAndPersistState, setColumnFilters],
    ),
    afterSearchFilter,
    setAfterSearchFilter: useCallback(
      (newAfterSearchFilter) => setAndPersistState(setAfterSearchFilter, "afterSearchFilter", newAfterSearchFilter),
      [setAndPersistState, setAfterSearchFilter],
    ),
    columnPinning,
    setColumnPinning: useCallback(
      (newColumnPinning) => setAndPersistState(setColumnPinning, "columnPinning", newColumnPinning),
      [setAndPersistState, setColumnPinning],
    ),
    expanded,
    setExpanded: useCallback((newExpanded) => setAndPersistState(setExpanded, "expanded", newExpanded), [setAndPersistState, setExpanded]),
    rowSelection,
    setRowSelection: useCallback(
      (newRowSelection) => setAndPersistState(setRowSelection, "rowSelection", newRowSelection),
      [setAndPersistState, setRowSelection],
    ),
    sorting,
    setSorting: useCallback((newSorting) => setAndPersistState(setSorting, "sorting", newSorting), [setAndPersistState, setSorting]),
  };
};

export { usePersistentReactDataTableState };
