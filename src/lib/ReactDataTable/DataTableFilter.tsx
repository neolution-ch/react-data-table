import { useState } from "react";
import { getFilterValue, setFilterValue } from "../utils/customFilterMethods";
import { FilterModel } from "../types/TableState";
import { ReactDataTableProps } from "./ReactDataTableProps";
import { getModelFromColumnFilter } from "../utils/getModelFromColumnFilter";
import { FormFeedback, Input } from "reactstrap";
import { FilterInputState, Header } from "@tanstack/react-table";
import { reactDataTableTranslations } from "../translations/translations";

interface DataTableFilterProps<TData, TFilter extends FilterModel = Record<string, never>>
  extends Pick<ReactDataTableProps<TData, TFilter>, "onEnter" | "table"> {
  header: Header<TData, unknown>;
}

const DataTableFilter = <TData, TFilter extends FilterModel = Record<string, never>>(props: DataTableFilterProps<TData, TFilter>) => {
  const { onEnter, table, header } = props;
  const {
    column: {
      columnDef: { meta },
    },
  } = header;

  const {
    options: { manualPagination },
    resetPageIndex,
  } = table;

  const [filterState, setFilterState] = useState<FilterInputState>({ isValid: true });
  return (
    <>
      {meta?.customFilter ? (
        meta?.customFilter(getFilterValue(header.column, table), (value) => setFilterValue(header.column, table, value))
      ) : meta?.dropdownFilter ? (
        <div>
          <Input
            type="select"
            className={filterState.isValid ? "" : "is-invalid"}
            value={(getFilterValue(header.column, table) as string) ?? ""}
            onChange={(e) => {
              const filterState = meta?.isInputValid?.(e.target.value) ?? { isValid: true };
              if (filterState.isValid) {
                setFilterValue(
                  header.column,
                  table,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  meta.dropdownFilter?.options[(e.target as any as HTMLSelectElement).selectedIndex]?.value ?? e.target.value,
                );
                if (!onEnter && manualPagination) {
                  resetPageIndex(true);
                }
              }
              setFilterState(filterState);
            }}
            onKeyUp={({ key }) => {
              if (key === "Enter" && onEnter) {
                if (manualPagination) {
                  resetPageIndex(true);
                }
                onEnter(getModelFromColumnFilter(table.getState().columnFilters));
              }
            }}
            bsSize="sm"
          >
            {meta.dropdownFilter.options.map(({ label, value, disabled }, i) => (
              <option key={i} value={value} disabled={disabled}>
                {label}
              </option>
            ))}
          </Input>
          <FormFeedback>{filterState?.errorMessage ?? reactDataTableTranslations.invalidInput}</FormFeedback>
        </div>
      ) : (
        <div>
          <Input
            type="text"
            className={filterState.isValid ? "" : "is-invalid"}
            value={(getFilterValue(header.column, table) as string) ?? ""}
            onChange={(e) => {
              const filterState = meta?.isInputValid?.(e.target.value) ?? { isValid: true };
              if (filterState.isValid) {
                setFilterValue(header.column, table, e.target.value);
                if (!onEnter && manualPagination) {
                  resetPageIndex(true);
                }
              }
              setFilterState(filterState);
            }}
            onKeyUp={({ key }) => {
              if (key === "Enter" && onEnter) {
                if (manualPagination) {
                  resetPageIndex(true);
                }
                onEnter(getModelFromColumnFilter(table.getState().columnFilters));
              }
            }}
            bsSize="sm"
          ></Input>
          <FormFeedback>{filterState?.errorMessage ?? reactDataTableTranslations.invalidInput}</FormFeedback>
        </div>
      )}
    </>
  );
};

export { DataTableFilter };
