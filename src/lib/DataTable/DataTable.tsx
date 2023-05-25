/* eslint-disable complexity */
import React from "react";
import { DataTableProps, DataTableStaticRoutedProps, DataTableStaticProps, DataTableTranslations } from "./DataTableInterfaces";
import { DataTableRouted } from "./DataTableRouted";
// import update from "immutability-helper";

export let dataTableTranslations: DataTableTranslations = {
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
  actionsPosition,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  rowStyle,
  rowHighlight,
  useDragAndDrop = false,
  showPaging = false,
  tableTitle,
  hideIfEmpty = false,
  tableClassName,
  tableStyle,
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
        actionsPosition={actionsPosition}
        possiblePageItemCounts={possiblePageItemCounts}
        predefinedItemsPerPage={predefinedItemsPerPage}
        rowStyle={rowStyle}
        rowHighlight={rowHighlight}
        showPaging={showPaging}
        tableClassName={tableClassName}
        tableStyle={tableStyle}
        useDragAndDrop={useDragAndDrop}
      />
    </React.Fragment>
  );
}

export function DataTableStatic<T>({
  keyField,
  data,
  columns,
  actions,
  actionsPosition,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  rowStyle,
  rowHighlight,
  useDragAndDrop = false,
  showPaging = false,
  tableTitle,
  hideIfEmpty = false,
  tableClassName,
  tableStyle,
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
        actionsPosition={actionsPosition}
        possiblePageItemCounts={possiblePageItemCounts}
        predefinedItemsPerPage={predefinedItemsPerPage}
        rowStyle={rowStyle}
        rowHighlight={rowHighlight}
        showPaging={showPaging}
        tableClassName={tableClassName}
        tableStyle={tableStyle}
        useDragAndDrop={useDragAndDrop}
      />
    </React.Fragment>
  );
}

export function DataTable<T, TFilter>({
  keyField,
  data,
  columns,
  actions,
  actionsPosition,
  client,
  possiblePageItemCounts,
  predefinedItemsPerPage,
  query,
  rowStyle,
  rowHighlight,
  showPaging = true,
  predefinedFilter = undefined,
  handlers,
  tableClassName,
  tableStyle,
  asc,
  orderBy,
  useDragAndDrop = false,
}: DataTableProps<T, TFilter>) {
  // const [records, setRecords] = useState<TableQueryResult<T>>(data);
  
  if (useDragAndDrop) {
    columns.forEach(x => x.sortable = false);    
  }


  // const moveRow = (dragIndex: number, hoverIndex: number): void => {
  //   const tableRecords = records.records;
  //   if (!tableRecords) {
  //     throw new Error("Ciao");
  //   }
  //   const updatedTableRecords = update(tableRecords, {
  //       $splice: 
  //         [
  //         [dragIndex, 1],
  //         [hoverIndex, 0, tableRecords[dragIndex] as T],
  //       ]
  //     },
  //   )
  //   console.log()
  //   setRecords({ ...records, records: updatedTableRecords });
  // }

  return (
    <DataTableRouted<T, TFilter, T>
      keyField={keyField}
      data={data}
      // data={records}
      columns={columns}
      client={client}
      query={query}
      actions={actions}
      actionsPosition={actionsPosition}
      possiblePageItemCounts={possiblePageItemCounts}
      predefinedItemsPerPage={predefinedItemsPerPage}
      rowStyle={rowStyle}
      rowHighlight={rowHighlight}
      showPaging={showPaging}
      predefinedFilter={predefinedFilter}
      handlers={handlers}
      tableClassName={tableClassName}
      tableStyle={tableStyle}
      asc={asc}
      orderBy={orderBy}
      useDragAndDrop={useDragAndDrop}
      // moveRow={moveRow}
    />
  );
}
