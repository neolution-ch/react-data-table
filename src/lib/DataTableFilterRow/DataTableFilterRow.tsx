import React from "react";
import { Input } from "reactstrap";
import { DataTableColumnDescription, DataTableActions, Filters, FilterTranslations } from "../DataTable/DataTableInterfaces";
import { ColumnFilterType, ActionsPosition } from "../DataTable/DataTableTypes";
import { ActionsHeaderFilterCell } from "../DataTable/Actions/ActionsHeaderFilterCell";
import { getDeepValue } from "../Utils/DeepValue";

interface DataTableFilterRowProps<T, TFilter> {
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableActions<T>;
  actionsPosition?: ActionsPosition;
  translations: FilterTranslations;
  filterPossible: boolean;
  predefinedFilter?: TFilter;
  getFilterRefs(): Filters;
  setFilterRef(filterName: string, ref: HTMLInputElement): void;
  onSearch(): void;
}

export function DataTableFilterRow<T, TFilter>({
  columns,
  actions,
  actionsPosition,
  filterPossible = true,
  translations,
  predefinedFilter,
  getFilterRefs,
  setFilterRef,
  onSearch,
}: DataTableFilterRowProps<T, TFilter>) {
  if (!filterPossible || columns.filter((column) => column.filter).length <= 0) return <React.Fragment />;
  return (
    <tr>
      {actionsPosition == ActionsPosition.Left && (
        <ActionsHeaderFilterCell<T> onSearch={onSearch} translations={translations} actions={actions} getFilterRefs={getFilterRefs} />
      )}
      {columns.map((column) => {
        var defaultValue = predefinedFilter ? getDeepValue(predefinedFilter, column.dataField) : undefined;
        return (
          <th key={column.dataField}>
            {column.filter && column.filter.filterType === ColumnFilterType.String && (
              <Input
                bsSize="sm"
                id={`filter-${column.dataField}`}
                innerRef={(ref) => ref && ref instanceof HTMLInputElement && setFilterRef(column.dataField, ref)}
                defaultValue={defaultValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
              />
            )}
            {column.filter && column.filter.filterType === ColumnFilterType.Enum && column.enumValues && (
              <Input
                bsSize="sm"
                innerRef={(ref) => ref && ref instanceof HTMLSelectElement && setFilterRef(column.dataField, ref as HTMLInputElement)}
                type="select"
                defaultValue={defaultValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
                onChange={() => onSearch()}
              >
                {column.enumValues.map((item) => (
                  <option value={item.value ?? "null"} key={`${column.dataField}_filter_${item.value}`} disabled={item.disabled}>
                    {item.text}
                  </option>
                ))}
              </Input>
            )}
          </th>
        );
      })}
      {actionsPosition == ActionsPosition.Right && (
        <ActionsHeaderFilterCell<T> onSearch={onSearch} translations={translations} actions={actions} getFilterRefs={getFilterRefs} />
      )}
    </tr>
  );
}
