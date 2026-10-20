import { getLocalStorageItem, setLocalStorageItem } from "@neolution-ch/javascript-utils";
import { OptionalNullable } from "../types/NullableTypes";
import { useReactDataTableStateProps } from "./useReactDataTableStateProps";
import { useReactDataTableStateResult } from "./useReactDataTableStateResult";
import { useReactDataTableState } from "./useReactDataTableState";
import { FilterModel } from "../types/TableState";
import { Dispatch, SetStateAction, useCallback, useInsertionEffect, useRef } from "react";

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

type PersistedState<TData, TFilter> = Pick<
  useReactDataTableStateResult<TData, TFilter>,
  "pagination" | "columnFilters" | "afterSearchFilter" | "columnPinning" | "expanded" | "rowSelection" | "sorting"
>;

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

  // kept in a ref, so an inline function does not make the setters change on every render. Updated in an insertion effect, which
  // React runs for the whole tree before any layout effect, so it is already up to date when a setter is called from a layout
  // effect in the same commit (also from a child component).
  const getExpirationDateRef = useRef(getExpirationDate);
  useInsertionEffect(() => {
    getExpirationDateRef.current = getExpirationDate;
  }, [getExpirationDate]);

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

  // The state of every persisted part after all updates so far. All state changes go through the setters below, so React's
  // state ends up at the same value once it has processed them. It lets update functions (e.g. `setSorting(previous => ...)`)
  // be resolved synchronously for persisting, also when several of them are called in a row.
  const latestStateRef = useRef<PersistedState<TData, TFilter>>({
    pagination,
    columnFilters,
    afterSearchFilter,
    columnPinning,
    expanded,
    rowSelection,
    sorting,
  });

  // Resolves the new state and persists it right away, outside of React's updater, so that it is neither lost when the
  // component unmounts before the next render nor written for a render React discards. React still gets the original action,
  // so it can schedule update functions by their priority (e.g. an urgent update while a transition is pending).
  const setAndPersistState = useCallback(
    <TKey extends keyof PersistedState<TData, TFilter>>(
      key: TKey,
      setState: Dispatch<SetStateAction<PersistedState<TData, TFilter>[TKey]>>,
      newState: SetStateAction<PersistedState<TData, TFilter>[TKey]>,
    ) => {
      const resolvedState =
        typeof newState === "function"
          ? (newState as (previousState: PersistedState<TData, TFilter>[TKey]) => PersistedState<TData, TFilter>[TKey])(
              latestStateRef.current[key],
            )
          : newState;

      latestStateRef.current[key] = resolvedState;
      setLocalStorageItem(`${localStorageKey}_${key}`, resolvedState, getExpirationDateRef.current?.());
      setState(newState);
    },
    [localStorageKey],
  );

  return {
    pagination,
    setPagination: useCallback(
      (newPagination) => setAndPersistState("pagination", setPagination, newPagination),
      [setAndPersistState, setPagination],
    ),
    columnFilters,
    setColumnFilters: useCallback(
      (newColumnFilters) => setAndPersistState("columnFilters", setColumnFilters, newColumnFilters),
      [setAndPersistState, setColumnFilters],
    ),
    afterSearchFilter,
    setAfterSearchFilter: useCallback(
      (newAfterSearchFilter) => setAndPersistState("afterSearchFilter", setAfterSearchFilter, newAfterSearchFilter),
      [setAndPersistState, setAfterSearchFilter],
    ),
    columnPinning,
    setColumnPinning: useCallback(
      (newColumnPinning) => setAndPersistState("columnPinning", setColumnPinning, newColumnPinning),
      [setAndPersistState, setColumnPinning],
    ),
    expanded,
    setExpanded: useCallback((newExpanded) => setAndPersistState("expanded", setExpanded, newExpanded), [setAndPersistState, setExpanded]),
    rowSelection,
    setRowSelection: useCallback(
      (newRowSelection) => setAndPersistState("rowSelection", setRowSelection, newRowSelection),
      [setAndPersistState, setRowSelection],
    ),
    sorting,
    setSorting: useCallback((newSorting) => setAndPersistState("sorting", setSorting, newSorting), [setAndPersistState, setSorting]),
  };
};

export { usePersistentReactDataTableState };
