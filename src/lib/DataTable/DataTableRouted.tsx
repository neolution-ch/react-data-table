/* eslint max-lines: ["error", 230]  */ // Increased max-lines required due to new implementations.
/* eslint-disable complexity */
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Paging } from "@neolution-ch/react-pattern-ui";
import { Table } from "reactstrap";
import { DataTableRoutedProps, FilterPageState, Filters, OrderOption, TableQueryResult } from "./DataTableInterfaces";
import { setDeepValue, getDeepValue } from "../Utils/DeepValue";
import useDidMountEffect from "../Utils/UseDidMountEffect";
import { ListSortDirection, ColumnFilterType, ActionsPosition } from "./DataTableTypes";
import { DataTableFilterRow } from "../DataTableFilterRow/DataTableFilterRow";
import { DataTableRow } from "../DataTableHeader/DataTableRow";
import { dataTableTranslations } from "./DataTable";
import { ActionsHeaderTitleCell } from "./Actions/ActionsHeaderTitleCell";

export function DataTableRouted<T, TFilter, TRouteNames>({
  keyField,
  data,
  columns,
  actions,
  actionsPosition = ActionsPosition.Left,
  client,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  query,
  rowStyle,
  showPaging = true,
  predefinedFilter = undefined,
  handlers,
  tableClassName,
  tableStyle,
  asc = true,
  orderBy,
  highlight,
}: DataTableRoutedProps<T, TFilter, TRouteNames>) {
  const [queryResult, setQueryResult] = useState<TableQueryResult<T>>(data);
  const [filterState, setFilterState] = useState<FilterPageState>({
    currentPage: 1,
    filter: predefinedFilter ?? {},
    itemsPerPage: predefinedItemsPerPage ?? 25,
  });
  const [orderState, setOrderState] = useState<OrderOption>({ orderBy: orderBy ?? columns[0].dataField, asc });
  const filterRefs = useRef<Filters>({});

  function loadPage(filter: any, limit?: number, page?: number, orderBy?: string, asc?: boolean) {
    if (query) {
      query(filter, limit, page, orderBy, asc).then((result) => setQueryResult(result));
    } else if (client && client.query) {
      client
        .query(filter, limit, page, orderBy, asc ? ListSortDirection.Ascending : ListSortDirection.Descending)
        .then((result) => setQueryResult(result));
    }
  }

  function getFilterRefs(): Filters {
    return filterRefs?.current;
  }

  function setFilterRef(filterName: string, ref: HTMLInputElement) {
    setDeepValue(filterRefs.current, filterName, ref);
  }

  function setCurrentPage(page: number) {
    setFilterState({ currentPage: page, filter: filterState.filter, itemsPerPage: filterState.itemsPerPage });
  }

  function onSearch() {
    const search = predefinedFilter ?? {};
    Object.entries(filterRefs.current).forEach(([name, ref]) => {
      const column = columns.find((c) => c.dataField === name && c.filter);
      if (column && column.filter && column.filter.filterType === ColumnFilterType.Enum) {
        if (ref.value === "null") setDeepValue(search, name, null);
        else if (!Number.isNaN(parseInt(ref.value, 10)) && parseInt(ref.value, 10).toString() === ref.value)
          setDeepValue(search, name, parseInt(ref.value, 10));
        else setDeepValue(search, name, ref.value);
      } else if (column && column.filter && column.filter.filterType === ColumnFilterType.String) {
        const validationString = column?.filter?.validate ? column?.filter?.validate(ref.value.toString()) : null;
        clearFilterError(ref);
        if (validationString === null || validationString === null || validationString?.length === 0)
          setDeepValue(search, name, ref.value.toString());
        else setFilterError(ref, validationString);
      } else setDeepValue(search, name, ref.value);
    });
    setFilterState({ currentPage: 1, filter: search, itemsPerPage: filterState.itemsPerPage });
  }

  function setFilterError(filter: HTMLInputElement, validationString: string) {
    filter.classList.add("is-invalid");
    // eslint-disable-next-line no-param-reassign
    filter.title = validationString;
  }

  function clearFilterError(filter: HTMLInputElement) {
    filter.classList.remove("is-invalid");
    // eslint-disable-next-line no-param-reassign
    filter.title = "";
  }

  function setItemsPerPage(itemsPerPage: number) {
    setFilterState({ currentPage: 1, filter: filterState.filter, itemsPerPage });
  }

  function onOrder(key: string) {
    const order = { ...orderState };
    if (order.orderBy === key) {
      order.asc = !order.asc;
    } else {
      order.asc = true;
      order.orderBy = key;
    }
    setOrderState(order);
  }

  function getOrderIcon(key: string): IconProp {
    if (key !== orderState.orderBy) return faSort;
    return orderState.asc ? faSortDown : faSortUp;
  }

  if (handlers) {
    handlers({
      reloadData: () => loadPage(filterState.filter, filterState.itemsPerPage, filterState.currentPage, orderState.orderBy, orderState.asc),
    });
  }

  useDidMountEffect(() => {
    loadPage(filterState.filter, filterState.itemsPerPage, filterState.currentPage, orderState.orderBy, orderState.asc);
  }, [filterState, orderState]);

  return (
    <React.Fragment>
      <Table striped hover size="sm" className={tableClassName} style={tableStyle}>
        <thead>
          <tr>
            {actionsPosition == ActionsPosition.Left && <ActionsHeaderTitleCell<T, TRouteNames> actions={actions} />}
            {columns.map((column) =>
              column.sortable === true ? (
                <th
                  key={column.dataField}
                  style={{ cursor: "pointer", ...column.headerStyle }}
                  onClick={() => onOrder(column.sortField ?? column.dataField)}
                >
                  {column.text} {column.sortable === true && <FontAwesomeIcon icon={getOrderIcon(column.sortField ?? column.dataField)} />}
                </th>
              ) : (
                <th style={column.headerStyle} key={column.dataField}>
                  {column.text}
                </th>
              ),
            )}
            {actionsPosition == ActionsPosition.Right && <ActionsHeaderTitleCell<T, TRouteNames> actions={actions} />}
          </tr>
          <DataTableFilterRow
            actions={actions}
            columns={columns}
            onSearch={onSearch}
            filterPossible={!!(query || client)}
            getFilterRefs={getFilterRefs}
            setFilterRef={setFilterRef}
            translations={dataTableTranslations}
            actionsPosition={actionsPosition}
          />
        </thead>
        <tbody>
          {queryResult && queryResult.records && queryResult.totalRecords && queryResult.totalRecords > 0 ? (
            queryResult.records.map((record) => (
              <DataTableRow
                record={record}
                columns={columns}
                keyField={keyField}
                actions={actions}
                key={getDeepValue(record, keyField)}
                rowStyle={rowStyle}
                highlight={ highlight }
                actionsPosition={actionsPosition}
              />
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)}>{dataTableTranslations.noEntries}</td>
            </tr>
          )}
        </tbody>
      </Table>

      {showPaging && (
        <Paging
          currentItemsPerPage={filterState.itemsPerPage}
          currentPage={filterState.currentPage}
          totalRecords={queryResult.totalRecords ?? 0}
          currentRecordCount={queryResult.records ? queryResult.records.length : 0}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          possiblePageItemCounts={possiblePageItemCounts}
          translations={dataTableTranslations}
          pagingPossible={!!(query || client)}
        />
      )}
    </React.Fragment>
  );
}
