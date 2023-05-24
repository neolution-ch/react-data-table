import React from "react";
import { Input } from "reactstrap";
import { DataTableColumnDescription, DataTableActions, Filters, FilterTranslations } from "../DataTable/DataTableInterfaces";
import { ColumnFilterType, ActionsPosition } from "../DataTable/DataTableTypes";
import { ActionsHeaderFilterCell } from "../DataTable/Actions/ActionsHeaderFilterCell";

interface DataTableFilterRowProps<T> {
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableActions<T>;
  actionsPosition?: ActionsPosition;
  translations: FilterTranslations;
  filterPossible: boolean;
  useDragAndDrop?: boolean;
  getFilterRefs(): Filters;
  setFilterRef(filterName: string, ref: HTMLInputElement): void;
  onSearch(): void;
}

export function DataTableFilterRow<T>({
  columns,
  actions,
  actionsPosition,
  filterPossible = true,
  translations,
  useDragAndDrop,
  getFilterRefs,
  setFilterRef,
  onSearch,
}: DataTableFilterRowProps<T>) {
  if (!filterPossible || columns.filter((column) => column.filter).length <= 0) return <React.Fragment />;
  return (
    <tr>
      {useDragAndDrop && (
        <th key="drag">
        </th> 
      )}
      {actionsPosition == ActionsPosition.Left && (
        <ActionsHeaderFilterCell<T> onSearch={onSearch} translations={translations} actions={actions} getFilterRefs={getFilterRefs} />
      )}
      {columns.map((column) => (
        <th key={column.dataField}>
          {column.filter && column.filter.filterType === ColumnFilterType.String && (
            <Input
              bsSize="sm"
              id={`filter-${column.dataField}`}
              innerRef={(ref) => ref && ref instanceof HTMLInputElement && setFilterRef(column.dataField, ref)}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              onChange={() => onSearch()}
            >
              {column.enumValues.map((item) => (
                <option value={item.value ?? "null"} key={`${column.dataField}_filter_${item.value}`}>
                  {item.text}
                </option>
              ))}
            </Input>
          )}
        </th>
      ))}
      {actionsPosition == ActionsPosition.Right && (
        <ActionsHeaderFilterCell<T> onSearch={onSearch} translations={translations} actions={actions} getFilterRefs={getFilterRefs} />
      )}
    </tr>
  );
}
