/* eslint-disable complexity */
/* eslint-disable max-lines */
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input, Spinner, Table } from "reactstrap";
import { Paging } from "@neolution-ch/react-pattern-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSortDown, faSortUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { ReactDataTableProps } from "./ReactDataTableProps";
import { ExtendedColumnDef } from "./ExtendedColumnDef";
import { useReactTableState } from "./useReactDataTableState";

const ReactDataTable = <TData,>(props: ReactDataTableProps<TData>) => {
  const {
    data,
    columns,
    onFilterChange,
    onSortingChange,
    onPaginationChange,
    reactTableOptions,
    state,

    // not passed to useReactTable hook
    totalRecords = data.length,
    isLoading,
    rowStyle,
    isFetching,
    tableClassName,
    tableStyle,
    pageSizes = [5, 10, 25, 50, 100],
    showPaging = true,
  } = props;

  const { columnFilters: columnFiltersProps, sorting: sortingProps, pagination: paginationProps } = state ?? {};

  const {
    columnFilters: initialColumnFilters,
    sorting: initialSorting,
    pagination: initialPagination,
  } = reactTableOptions?.initialState ?? {};

  const {
    sorting: internalSorting,
    columnFilters: internalColumnFilters,
    pagination: internalPagination,
    setColumnFilters: setInternalColumnFilters,
    setPagination: setInternalPagination,
    setSorting: setInternalSorting,
  } = useReactTableState({
    initialColumnFilters,
    initialSorting,
    initialPagination,
  });

  const effectiveColumnFilters = columnFiltersProps ?? internalColumnFilters;
  const effectiveSorting = sortingProps ?? internalSorting;
  const effectivePagination = paginationProps ?? internalPagination;

  if (!pageSizes.includes(effectivePagination.pageSize)) {
    throw new Error(`The page size ${effectivePagination.pageSize} is not in the list of possible page sizes ${pageSizes.join(", ")}`);
  }

  if (onFilterChange && columnFiltersProps === undefined) {
    throw new Error("When using onFilterChange, the columnFilters state must be supplied");
  }

  if (onSortingChange && sortingProps === undefined) {
    throw new Error("When using onSortingChange, the sorting state must be supplied");
  }

  if (onPaginationChange && paginationProps === undefined) {
    throw new Error("When using onPaginationChange, the pagination state must be supplied");
  }

  if (sortingProps !== undefined && onSortingChange === undefined) {
    throw new Error("When using sorting state, the onSortingChange callback must be supplied");
  }

  if (columnFiltersProps !== undefined && onFilterChange === undefined) {
    throw new Error("When using columnFilters state, the onFilterChange callback must be supplied");
  }

  if (paginationProps !== undefined && onPaginationChange === undefined) {
    throw new Error("When using pagination state, the onPaginationChange callback must be supplied");
  }

  const skeletonColumns = columns.map((column) => ({
    ...column,
    cell: () => <Skeleton />,
  }));
  const skeletonData = Array.from({ length: effectivePagination.pageSize }, () => ({} as TData));

  const table = useReactTable<TData>({
    data: isLoading ? skeletonData : data,
    columns: isLoading ? skeletonColumns : columns,

    manualFiltering: !!onFilterChange,
    manualSorting: !!onSortingChange,
    manualPagination: !!onPaginationChange,

    enableColumnFilters: true,
    enableSorting: true,
    enableMultiSort: false,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: onFilterChange ? undefined : getFilteredRowModel(),
    getSortedRowModel: onSortingChange ? undefined : getSortedRowModel(),
    getPaginationRowModel: onPaginationChange ? undefined : getPaginationRowModel(),

    onColumnFiltersChange: onFilterChange ? onFilterChange : setInternalColumnFilters,
    onSortingChange: onSortingChange ? onSortingChange : setInternalSorting,
    onPaginationChange: onPaginationChange ? onPaginationChange : setInternalPagination,

    state: {
      columnFilters: effectiveColumnFilters,
      sorting: effectiveSorting,
      pagination: effectivePagination,
    },

    ...reactTableOptions,
  });

  const effectiveTotalRecords = onFilterChange ? totalRecords : table.getFilteredRowModel().rows.length;

  return (
    <>
      {!isLoading && isFetching && (
        <Spinner color="primary" type="grow">
          Loading...
        </Spinner>
      )}
      <Table striped hover size="sm" className={tableClassName} style={tableStyle}>
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
                  const extendedColumnDef = header.column.columnDef as ExtendedColumnDef<TData>;

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
                            {extendedColumnDef.columnFilterDropDownConfig ? (
                              <Input type="select" onChange={(e) => header.column.setFilterValue(e.target.value)} bsSize="sm">
                                <option value="">All</option>
                                {extendedColumnDef.columnFilterDropDownConfig.values.map((value) => (
                                  <option key={value} value={value}>
                                    {value}
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
      </Table>

      {showPaging && (
        <Paging
          currentItemsPerPage={effectivePagination.pageSize}
          currentPage={effectivePagination.pageIndex + 1}
          totalRecords={effectiveTotalRecords}
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

export { ReactDataTable };
