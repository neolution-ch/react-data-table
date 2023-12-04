import { ColumnFiltersState } from "@tanstack/react-table";

const getStronglyTypedColumnFilter = <TData, TResult extends string | number>(
  columnFilters: ColumnFiltersState,
  id: keyof TData,
  targetType: "string" | "number",
): TResult | undefined => {
  const item = columnFilters.find((element) => element.id === id);

  if (!item) {
    return undefined;
  }

  if (targetType === "string") {
    return item.value as TResult;
  } else if (targetType === "number") {
    const parsedValue = parseFloat(item.value as string);
    return isNaN(parsedValue) ? undefined : (parsedValue as TResult);
  }

  return undefined;
};

export { getStronglyTypedColumnFilter };
