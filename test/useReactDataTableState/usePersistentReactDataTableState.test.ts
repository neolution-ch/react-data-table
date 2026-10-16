import { act, render, renderHook } from "@testing-library/react";
import { createElement, startTransition, useLayoutEffect } from "react";
import { usePersistentReactDataTableState } from "src";

const localStorageKey = "testTable";

const getStoredItem = (suffix: string) =>
  JSON.parse(localStorage.getItem(`${localStorageKey}_${suffix}`) ?? "null") as { data: unknown; expirationDate?: string } | null;

describe("usePersistentReactDataTableState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("persists the state without an expiration date by default", () => {
    const { result } = renderHook(() => usePersistentReactDataTableState({ localStorageKey }));

    act(() => result.current.setPagination({ pageIndex: 2, pageSize: 25 }));

    expect(getStoredItem("pagination")).toEqual({ data: { pageIndex: 2, pageSize: 25 } });
  });

  test("persists the state with the date returned by getExpirationDate on every write", () => {
    const expirationDate = new Date(Date.now() + 60_000);
    const getExpirationDate = jest.fn(() => expirationDate);
    const { result } = renderHook(() =>
      usePersistentReactDataTableState<unknown, { name?: string }>({ localStorageKey, getExpirationDate }),
    );

    act(() => result.current.setPagination({ pageIndex: 2, pageSize: 25 }));
    act(() => result.current.setColumnFilters({ name: "test" }));

    expect(getExpirationDate).toHaveBeenCalledTimes(2);
    expect(getStoredItem("pagination")?.expirationDate).toBe(expirationDate.toISOString());
    expect(getStoredItem("columnFilters")).toEqual({ data: { name: "test" }, expirationDate: expirationDate.toISOString() });
  });

  test("restores the persisted state as long as it is not expired", () => {
    const { result: firstVisit } = renderHook(() =>
      usePersistentReactDataTableState({ localStorageKey, getExpirationDate: () => new Date(Date.now() + 60_000) }),
    );
    act(() => firstVisit.current.setPagination({ pageIndex: 2, pageSize: 25 }));

    const { result: secondVisit } = renderHook(() =>
      usePersistentReactDataTableState({ localStorageKey, initialPagination: { pageIndex: 0, pageSize: 10 } }),
    );

    expect(secondVisit.current.pagination).toEqual({ pageIndex: 2, pageSize: 25 });
  });

  test("uses the initial state when the persisted state is expired", () => {
    const { result: firstVisit } = renderHook(() =>
      usePersistentReactDataTableState({ localStorageKey, getExpirationDate: () => new Date(Date.now() - 60_000) }),
    );
    act(() => firstVisit.current.setPagination({ pageIndex: 2, pageSize: 25 }));

    const { result: secondVisit } = renderHook(() =>
      usePersistentReactDataTableState({ localStorageKey, initialPagination: { pageIndex: 0, pageSize: 10 } }),
    );

    expect(secondVisit.current.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
    expect(localStorage.getItem(`${localStorageKey}_pagination`)).toBeNull();
  });

  test("keeps the setters stable when getExpirationDate is passed inline", () => {
    const { result, rerender } = renderHook(() =>
      usePersistentReactDataTableState({ localStorageKey, getExpirationDate: () => new Date(Date.now() + 60_000) }),
    );
    const { setPagination } = result.current;

    rerender();

    expect(result.current.setPagination).toBe(setPagination);
  });

  test("persists the resolved state when a setter gets an update function", () => {
    const { result } = renderHook(() => usePersistentReactDataTableState<unknown, { name?: string; type?: string }>({ localStorageKey }));

    act(() => result.current.setColumnFilters({ name: "test" }));
    act(() => result.current.setColumnFilters((previous) => ({ ...previous, type: "active" })));

    expect(result.current.columnFilters).toEqual({ name: "test", type: "active" });
    expect(getStoredItem("columnFilters")).toEqual({ data: { name: "test", type: "active" } });
  });

  test("persists the latest state when several update functions are applied in one go", () => {
    const { result } = renderHook(() =>
      usePersistentReactDataTableState({ localStorageKey, initialPagination: { pageIndex: 0, pageSize: 10 } }),
    );

    act(() => {
      result.current.setPagination((previous) => ({ ...previous, pageIndex: previous.pageIndex + 1 }));
      result.current.setPagination((previous) => ({ ...previous, pageIndex: previous.pageIndex + 1 }));
    });

    expect(result.current.pagination).toEqual({ pageIndex: 2, pageSize: 10 });
    expect(getStoredItem("pagination")).toEqual({ data: { pageIndex: 2, pageSize: 10 } });
  });

  test("persists the last state when the component unmounts in the same batch", () => {
    const { result, unmount } = renderHook(() => usePersistentReactDataTableState({ localStorageKey }));

    act(() => {
      result.current.setPagination({ pageIndex: 1, pageSize: 10 });
      result.current.setPagination({ pageIndex: 2, pageSize: 10 });
      unmount();
    });

    expect(getStoredItem("pagination")).toEqual({ data: { pageIndex: 2, pageSize: 10 } });
  });

  test("uses a changed getExpirationDate for writes from a layout effect in the same render", () => {
    const expirationDate = new Date(Date.now() + 60_000);

    const { rerender } = renderHook(
      ({ currentExpirationDate }: { currentExpirationDate?: Date }) => {
        const state = usePersistentReactDataTableState({
          localStorageKey,
          getExpirationDate: currentExpirationDate ? () => currentExpirationDate : undefined,
        });
        const { setPagination } = state;

        useLayoutEffect(() => {
          if (currentExpirationDate) {
            setPagination({ pageIndex: 1, pageSize: 10 });
          }
        }, [currentExpirationDate, setPagination]);

        return state;
      },
      { initialProps: {} },
    );

    rerender({ currentExpirationDate: expirationDate });

    expect(getStoredItem("pagination")).toEqual({ data: { pageIndex: 1, pageSize: 10 }, expirationDate: expirationDate.toISOString() });
  });

  test("uses a changed getExpirationDate for writes from a child's layout effect in the same render", () => {
    const expirationDate = new Date(Date.now() + 60_000);

    const Child = ({
      setPagination,
      isEnabled,
    }: {
      setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
      isEnabled: boolean;
    }) => {
      useLayoutEffect(() => {
        if (isEnabled) {
          setPagination({ pageIndex: 1, pageSize: 10 });
        }
      }, [isEnabled, setPagination]);

      return null;
    };

    const Parent = ({ currentExpirationDate }: { currentExpirationDate?: Date }) => {
      const { setPagination } = usePersistentReactDataTableState({
        localStorageKey,
        getExpirationDate: currentExpirationDate ? () => currentExpirationDate : undefined,
      });

      return createElement(Child, { setPagination, isEnabled: !!currentExpirationDate });
    };

    const { rerender } = render(createElement(Parent, {}));
    rerender(createElement(Parent, { currentExpirationDate: expirationDate }));

    expect(getStoredItem("pagination")).toEqual({ data: { pageIndex: 1, pageSize: 10 }, expirationDate: expirationDate.toISOString() });
  });

  test("lets React render an urgent update before a pending transition", () => {
    const renderedPageIndexes: number[] = [];
    const { result } = renderHook(() => {
      const state = usePersistentReactDataTableState({ localStorageKey, initialPagination: { pageIndex: 0, pageSize: 10 } });
      renderedPageIndexes.push(state.pagination.pageIndex);
      return state;
    });

    act(() => {
      startTransition(() => result.current.setPagination((previous) => ({ ...previous, pageIndex: previous.pageIndex + 10 })));
      result.current.setPagination((previous) => ({ ...previous, pageIndex: previous.pageIndex + 1 }));
    });

    expect(renderedPageIndexes).toEqual([0, 1, 11]);
    expect(getStoredItem("pagination")).toEqual({ data: { pageIndex: 11, pageSize: 10 } });
  });
});
