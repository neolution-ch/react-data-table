/* eslint max-lines: ["error", 270]  */ // Increased max-lines required due to new implementations.
/* eslint-disable complexity */
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Table } from "reactstrap";
import { DataTableRoutedProps, FilterPageState, Filters, OrderOption, TableQueryResult } from "./DataTableInterfaces";
import { setDeepValue, getDeepValue } from "../Utils/DeepValue";

import { ColumnFilterType, ActionsPosition, ListSortDirection } from "./DataTableTypes";
import { DataTableFilterRow } from "../DataTableFilterRow/DataTableFilterRow";
import { DataTableRow } from "../DataTableHeader/DataTableRow";
import { dataTableTranslations } from "./DataTable";
import { ActionsHeaderTitleCell } from "./Actions/ActionsHeaderTitleCell";
import update from "immutability-helper";
import useDidMountEffect from "../Utils/UseDidMountEffect";
import { Paging } from "@neolution-ch/react-pattern-ui";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  rowHighlight,
  useDragAndDrop,
  onDrag,
}: DataTableRoutedProps<T, TFilter, TRouteNames>) {
  const [queryResult, setQueryResult] = useState<TableQueryResult<T>>(data);
  const [filterState, setFilterState] = useState<FilterPageState>({
    currentPage: 1,
    filter: predefinedFilter ?? {},
    itemsPerPage: predefinedItemsPerPage ?? 25,
  });

  const [orderState, setOrderState] = useState<OrderOption>({ orderBy: orderBy ?? undefined, asc });
  const filterRefs = useRef<Filters>({});

  if (useDragAndDrop) {
    columns.forEach((x) => (x.sortable = false));
    handlers = undefined;
  }

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
    //Page number ci sta che possa essere cambiato ed anche crurrent page, ma quindi vorrebbe dire che devi fare una query per salvare dal DB probabilmente
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
    if (useDragAndDrop) {
      return;
    }
    loadPage(filterState.filter, filterState.itemsPerPage, filterState.currentPage, orderState.orderBy, orderState.asc);
  }, [filterState, orderState]);

  const moveRow = (dragIndex: number, hoverIndex: number): void => {
    const tableRecords = queryResult.records;
    if (!tableRecords) {
      throw new Error("No records found!");
    }
    const updatedTableRecords = update(tableRecords, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, tableRecords[dragIndex] as T],
      ],
    });
    setQueryResult({ ...queryResult, records: updatedTableRecords });
  };
  const [initialIndex, setInitialIndex] = useState<number | null>(null);

  const setNewOrder = (finalIndex: number): void => {
    if (!useDragAndDrop || !queryResult.records) {
      return;
    }

    if (onDrag && initialIndex !== null) {
      const tmpInd = initialIndex;
      setInitialIndex(null);
      if (tmpInd !== finalIndex) {
        onDrag(tmpInd, finalIndex);
      }
    }
  };

  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <Table striped hover size="sm" className={tableClassName} style={tableStyle}>
          <thead>
            <tr>
              {useDragAndDrop && <th></th>}
              {actionsPosition == ActionsPosition.Left && <ActionsHeaderTitleCell<T, TRouteNames> actions={actions} />}
              {columns.map((column) =>
                column.sortable === true ? (
                  <th
                    key={column.dataField}
                    style={{ cursor: "pointer", ...column.headerStyle }}
                    onClick={() => onOrder(column.sortField ?? column.dataField)}
                  >
                    {column.text}{" "}
                    {column.sortable === true && <FontAwesomeIcon icon={getOrderIcon(column.sortField ?? column.dataField)} />}
                  </th>
                ) : (
                  <th style={column.headerStyle} key={column.dataField}>
                    {column.text}
                  </th>
                ),
              )}
              {actionsPosition == ActionsPosition.Right && <ActionsHeaderTitleCell<T, TRouteNames> actions={actions} />}
            </tr>
            {!useDragAndDrop && (
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
            )}
          </thead>
          <tbody>
            {queryResult && queryResult.records && queryResult.totalRecords && queryResult.totalRecords > 0 ? (
              queryResult.records.map((record, index) => (
                <DataTableRow
                  record={record}
                  columns={columns}
                  keyField={keyField}
                  actions={actions}
                  key={getDeepValue(record, keyField)}
                  rowStyle={rowStyle}
                  rowHighlight={rowHighlight}
                  actionsPosition={actionsPosition}
                  moveRow={moveRow}
                  setNewOrder={setNewOrder}
                  id={index}
                  useDragAndDrop={useDragAndDrop}
                  initialIndex={initialIndex}
                  setInitialIndex={setInitialIndex}
                />
              ))
            ) : (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0) + (useDragAndDrop ? 1 : 0)}>{dataTableTranslations.noEntries}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </DndProvider>

      {showPaging && !useDragAndDrop && (
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
