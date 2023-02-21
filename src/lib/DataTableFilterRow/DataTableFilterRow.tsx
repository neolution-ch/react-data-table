import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Input } from "reactstrap";
import { DataTableColumnDescription, DataTableActions, Filters } from "../DataTable/DataTableInterfaces";
import { ColumnFilterType, ActionsPosition } from "../DataTable/DataTableTypes";

interface DataTableFilterRowProps<T> {
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableActions<T>;
  actionsPosition?: ActionsPosition;
  translations: FilterTranslations;
  filterPossible: boolean;
  getFilterRefs(): Filters;
  setFilterRef(filterName: string, ref: HTMLInputElement): void;
  onSearch(): void;
}

interface FilterTranslations {
  searchToolTip: string;
  clearSearchToolTip: string;
}

export function DataTableFilterRow<T>({
  columns,
  actions,
  actionsPosition = ActionsPosition.Left,
  filterPossible = true,
  translations,
  getFilterRefs,
  setFilterRef,
  onSearch,
}: DataTableFilterRowProps<T>) {

    const Actions = () => {
        return (
            <>
                {actions && (
                    <th className={actions.className} style={actions.style}>
                        <FontAwesomeIcon
                            style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
                            title={translations.searchToolTip}
                            icon={faSearch}
                            onClick={() => {
                                onSearch();
                            }}
                        />
                        <FontAwesomeIcon
                            style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
                            title={translations.clearSearchToolTip}
                            icon={faTimes}
                            onClick={() => {
                                const filterRefs = getFilterRefs();
                                if (filterRefs) {
                                    Object.values(filterRefs).forEach((ref) => {
                                        if (ref instanceof HTMLSelectElement) {
                                            // eslint-disable-next-line no-param-reassign
                                            ref.value = null as unknown as string;
                                        } else {
                                            // eslint-disable-next-line no-param-reassign
                                            ref.value = "";
                                        }
                                    });
                                    onSearch();
                                }
                            }}
                        />
                    </th>
                )}
            </>)
    }


  if (!filterPossible || columns.filter((column) => column.filter).length <= 0) return <React.Fragment />;
  return (
    <tr>
      {actionsPosition == ActionsPosition.Left && <Actions></Actions>}
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
          {actionsPosition == ActionsPosition.Right && <Actions></Actions>}
    </tr>
  );
}
