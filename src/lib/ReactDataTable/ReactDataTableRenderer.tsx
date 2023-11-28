import { faSortDown, faSortUp, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paging } from "@neolution-ch/react-pattern-ui";
import { PaginationState, Table, flexRender } from "@tanstack/react-table";
import { Spinner, Table as ReactStrapTable, Input } from "reactstrap";
import { ReactDataTableProps } from "./ReactDataTableProps";

interface ReactDataTableRendererProps<TData>
  extends Pick<ReactDataTableProps<TData>, "isLoading" | "isFetching" | "tableClassName" | "tableStyle" | "rowStyle" | "showPaging"> {
  table: Table<TData>;
  pageSizes: number[];
  pagination: PaginationState;
  totalRecords: number;
}

const ReactDataTableRenderer = <TData,>(props: ReactDataTableRendererProps<TData>) => {
  const { isLoading, isFetching, table, tableClassName, tableStyle, rowStyle, pageSizes, pagination, showPaging, totalRecords } = props;

  return (
    <>
      {!isLoading && isFetching && (
        <Spinner color="primary" type="grow">
          Loading...
        </Spinner>
      )}
      <ReactStrapTable striped hover size="sm" className={tableClassName} style={tableStyle}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <>
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={header.column.getCanSort() ? { cursor: "pointer" } : {}}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

                    {header.column.getIsSorted() === "desc" ? (
                      <FontAwesomeIcon icon={faSortDown} />
                    ) : header.column.getIsSorted() === "asc" ? (
                      <FontAwesomeIcon icon={faSortUp} />
                    ) : (
                      ""
                    )}
                  </th>
                ))}
              </tr>
              <tr key={`${headerGroup.id}-col-filters`}>
                {headerGroup.headers.map((header) => {
                  const {
                    column: {
                      columnDef: { meta },
                    },
                  } = header;

                  return (
                    <>
                      <th>
                        {header.index === 0 && (
                          <>
                            <FontAwesomeIcon
                              style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
                              icon={faSearch}
                              onClick={() => {
                                // onSearch();
                              }}
                            />

                            <FontAwesomeIcon
                              style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
                              icon={faTimes}
                              onClick={() => {
                                table.resetColumnFilters();
                              }}
                            />
                          </>
                        )}

                        {header.column.getCanFilter() && (
                          <>
                            {meta?.dropdownFilter ? (
                              <Input
                                type="select"
                                onChange={(e) => {
                                  header.column.setFilterValue(e.target.value);
                                }}
                                bsSize="sm"
                              >
                                <option value="">All</option>
                                {meta.dropdownFilter.options.map(({ label, value }, i) => (
                                  <option key={i} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </Input>
                            ) : (
                              <Input
                                type="text"
                                value={(header.column.getFilterValue() as string) ?? ""}
                                onChange={(e) => {
                                  header.column.setFilterValue(e.target.value);
                                }}
                                bsSize="sm"
                              ></Input>
                            )}
                          </>
                        )}
                      </th>
                    </>
                  );
                })}
              </tr>
            </>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={rowStyle && rowStyle(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </tfoot>
      </ReactStrapTable>

      {showPaging && (
        <Paging
          currentItemsPerPage={pagination.pageSize}
          currentPage={pagination.pageIndex + 1}
          totalRecords={totalRecords}
          currentRecordCount={table.getRowModel().rows.length}
          setItemsPerPage={(x) => {
            table.setPageSize(x);
          }}
          setCurrentPage={(x) => table.setPageIndex(x - 1)}
          possiblePageItemCounts={pageSizes}
          translations={{
            itemsPerPageDropdown: "Anzahl pro Seite",
            showedItemsText: "Zeige {from} bis {to} von insgesamt {total} Resultaten",
          }}
          pagingPossible={true}
        />
      )}
    </>
  );
};

export { ReactDataTableRenderer, ReactDataTableRendererProps };
