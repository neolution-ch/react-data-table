import { act, renderHook } from "@testing-library/react";
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
});
