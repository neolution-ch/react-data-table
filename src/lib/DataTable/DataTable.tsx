/* eslint-disable complexity */
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Paging } from "@neolution-ch/react-pattern-ui";
import { Table } from "reactstrap";
import {
  DataTableProps,
  DataTableRoutedProps,
  DataTableStaticProps,
  DataTableStaticRoutedProps,
  DataTableTranslations,
  FilterPageState,
  Filters,
  OrderOption,
  TableQueryResult,
} from "./DataTableInterfaces";
import { setDeepValue, getDeepValue } from "../Utils/DeepValue";
import useDidMountEffect from "../Utils/UseDidMountEffect";
import { ListSortDirection, ColumnFilterType } from "./DataTableTypes";
import { DataTableFilterRow } from "../DataTableFilterRow/DataTableFilterRow";
import { DataTableRow } from "../DataTableHeader/DataTableRow";

let dataTableTranslations: DataTableTranslations = {
  actionTitle: "Aktionen",
  clearSearchToolTip: "Suche zurücksetzen",
  searchToolTip: "Suchen",
  showedItemsText: "Zeige {from} bis {to} von insgesamt {total} Resultaten",
  itemsPerPageDropdown: "Anzahl pro Seite",
  noEntries: "Keine Einträge vorhanden",
};

export function setDataTableTranslations(translations: DataTableTranslations) {
  dataTableTranslations = translations;
}

export function DataTableStaticRouted<T, TRouteNames>({
  keyField,
  data,
  columns,
  actions,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  rowStyle,
  showPaging = false,
  tableTitle,
  hideIfEmpty = false,
}: DataTableStaticRoutedProps<T, TRouteNames>) {
  if (hideIfEmpty === true && (!data || data.length <= 0)) return <React.Fragment />;

  return (
    <React.Fragment>
      {tableTitle && <h4>{tableTitle}</h4>}
      <DataTableRouted<T, T, TRouteNames>
        keyField={keyField}
        data={{ records: data ?? [], totalRecords: data?.length ?? 0 }}
        columns={columns}
        actions={actions}
        possiblePageItemCounts={possiblePageItemCounts}
        predefinedItemsPerPage={predefinedItemsPerPage}
        rowStyle={rowStyle}
        showPaging={showPaging}
      />
    </React.Fragment>
  );
}

export function DataTableStatic<T>({
  keyField,
  data,
  columns,
  actions,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  rowStyle,
  showPaging = false,
  tableTitle,
  hideIfEmpty = false,
}: DataTableStaticProps<T>) {
  if (hideIfEmpty === true && (!data || data.length <= 0)) return <React.Fragment />;

  return (
    <React.Fragment>
      {tableTitle && <h4>{tableTitle}</h4>}
      <DataTable<T, T>
        keyField={keyField}
        data={{ records: data ?? [], totalRecords: data?.length ?? 0 }}
        columns={columns}
        actions={actions}
        possiblePageItemCounts={possiblePageItemCounts}
        predefinedItemsPerPage={predefinedItemsPerPage}
        rowStyle={rowStyle}
        showPaging={showPaging}
      />
    </React.Fragment>
  );
}

export function DataTable<T, TFilter>({
  keyField,
  data,
  columns,
  actions,
  client,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  query,
  rowStyle,
  showPaging = true,
  predefinedFilter = undefined,
}: DataTableProps<T, TFilter>) {
  return (
    <DataTableRouted<T, TFilter, T>
      keyField={keyField}
      data={data}
      columns={columns}
      client={client}
      query={query}
      actions={actions}
      possiblePageItemCounts={possiblePageItemCounts}
      predefinedItemsPerPage={predefinedItemsPerPage}
      rowStyle={rowStyle}
      showPaging={showPaging}
      predefinedFilter={predefinedFilter}
    />
  );
}

export function DataTableRouted<T, TFilter, TRouteNames>({
  keyField,
  data,
  columns,
  actions,
  client,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  query,
  rowStyle,
  showPaging = true,
  predefinedFilter = undefined,
}: DataTableRoutedProps<T, TFilter, TRouteNames>) {
  const [queryResult, setQueryResult] = useState<TableQueryResult<T>>(data);
  const [filterState, setFilterState] = useState<FilterPageState>({
    currentPage: 1,
    filter: predefinedFilter ?? {},
    itemsPerPage: predefinedItemsPerPage ?? 25,
  });
  const [orderState, setOrderState] = useState<OrderOption>({ orderBy: columns[0].dataField, asc: true });
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

  useDidMountEffect(
    () => loadPage(filterState.filter, filterState.itemsPerPage, filterState.currentPage, orderState.orderBy, orderState.asc),
    [filterState, orderState],
  );

  return (
    <React.Fragment>
      <Table striped hover size="sm">
        <thead>
          <tr>
            {actions &&
              (actions.columnTitle != null ? (
                <th>{actions.columnTitle}</th>
              ) : (
                <th style={{ width: "80px" }}>{dataTableTranslations.actionTitle}</th>
              ))}
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
          </tr>
          <DataTableFilterRow
            actions={actions}
            columns={columns}
            onSearch={onSearch}
            filterPossible={!!(query || client)}
            getFilterRefs={getFilterRefs}
            setFilterRef={setFilterRef}
            translations={dataTableTranslations}
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

