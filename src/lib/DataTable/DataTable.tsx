/* eslint-disable complexity */
import React from "react";
import { DataTableProps, DataTableStaticRoutedProps, DataTableStaticProps, DataTableTranslations } from "./DataTableInterfaces";
import { DataTableRouted } from "./DataTableRouted";

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
  possiblePageItemCounts,
  predefinedItemsPerPage,
  rowStyle,
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
        possiblePageItemCounts={possiblePageItemCounts}
        predefinedItemsPerPage={predefinedItemsPerPage}
        rowStyle={rowStyle}
        showPaging={showPaging}
        tableClassName={tableClassName}
        tableStyle={tableStyle}
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
        possiblePageItemCounts={possiblePageItemCounts}
        predefinedItemsPerPage={predefinedItemsPerPage}
        rowStyle={rowStyle}
        showPaging={showPaging}
        tableClassName={tableClassName}
        tableStyle={tableStyle}
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
  handlers,
  tableClassName,
  tableStyle,
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
      handlers={handlers}
      tableClassName={tableClassName}
      tableStyle={tableStyle}
    />
  );
}
