/* eslint max-lines: ["error", 250] */
import { faSortDown, faSortUp, faSearch, faTimes, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paging } from "@neolution-ch/react-pattern-ui";
import { flexRender } from "@tanstack/react-table";
import { Table as ReactStrapTable, Input } from "reactstrap";
import { reactDataTableTranslations } from "../translations/translations";
import { ReactDataTableProps } from "./ReactDataTableProps";
import { Fragment } from "react";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { TableBody } from "./TableBody";

/**
 * The table renderer for the react data table
 * @param props according to {@link ReactDataTableProps}
 */
const ReactDataTable = <TData,>(props: ReactDataTableProps<TData>) => {
  const {
    isLoading,
    isFetching,
    table,
    tableClassName,
    tableStyle,
    rowStyle,
    pageSizes,
    showPaging,
    hidePageSizeChange,
    onEnter,
    totalRecords = table.getCoreRowModel().rows.length,
    withoutHeaders = false,
    withoutHeaderFilters = false,
    dragAndDropOptions,
  } = props;

  const { pagination } = table.getState();

  const loadingCss = `  
  @-webkit-keyframes reloadingAnimation {
    0%{
      background-position-x: 200%
    }
    100%{
      background-position-x: 0%
    }
  }`;

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={dragAndDropOptions?.onDragEnd}
        sensors={sensors}
      >
        <style>{loadingCss}</style>
        <ReactStrapTable
          striped
          hover
          size="sm"
          className={tableClassName}
          style={
            !isLoading && isFetching
              ? {
                  ...tableStyle,
                  background: "linear-gradient(90deg, #E8E8E8, #ffffff, #E8E8E8)",
                  backgroundSize: "200% 200%",
                  animation: "reloadingAnimation 3s linear infinite",
                }
              : tableStyle
          }
        >
          {!withoutHeaders && (
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Fragment key={headerGroup.id}>
                  <tr key={`${headerGroup.id}-col-header`}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          ...header.column.columnDef.meta?.headerStyle,
                          ...(header.column.getCanSort() ? { cursor: "pointer" } : {}),
                        }}
                        className={header.column.columnDef.meta?.headerClassName}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getIsSorted() === "desc" ? (
                          <FontAwesomeIcon icon={faSortDown} className="ms-1" />
                        ) : header.column.getIsSorted() === "asc" ? (
                          <FontAwesomeIcon icon={faSortUp} className="ms-1" />
                        ) : header.column.getCanSort() ? (
                          <FontAwesomeIcon icon={faSort} className="ms-1" />
                        ) : (
                          ""
                        )}
                      </th>
                    ))}
                  </tr>
                  {!withoutHeaderFilters && (
                    <tr key={`${headerGroup.id}-col-filters`}>
                      {headerGroup.headers.map((header) => {
                        const {
                          column: {
                            columnDef: { meta },
                          },
                        } = header;

                        return (
                          <th key={`${header.id}-col-filter`}>
                            {header.index === 0 && (
                              <>
                                {onEnter && (
                                  <FontAwesomeIcon
                                    style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
                                    icon={faSearch}
                                    onClick={() => onEnter(table.getState().columnFilters)}
                                  />
                                )}

                                <FontAwesomeIcon
                                  style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
                                  icon={faTimes}
                                  onClick={() => {
                                    if (onEnter) {
                                      onEnter([]);
                                    }

                                    table.resetColumnFilters(true);
                                  }}
                                />
                              </>
                            )}

                            {header.column.getCanFilter() && (
                              <>
                                {meta?.customFilter ? (
                                  meta?.customFilter(header.column.getFilterValue(), header.column.setFilterValue)
                                ) : meta?.dropdownFilter ? (
                                  <Input
                                    type="select"
                                    onChange={(e) => {
                                      header.column.setFilterValue(
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        meta.dropdownFilter?.options[(e.target as any as HTMLSelectElement).selectedIndex]?.value ??
                                          e.target.value,
                                      );
                                    }}
                                    onKeyUp={({ key }) => {
                                      if (key === "Enter" && onEnter) {
                                        onEnter(table.getState().columnFilters);
                                      }
                                    }}
                                    bsSize="sm"
                                  >
                                    {meta.dropdownFilter.options.map(({ label, value, disabled }, i) => (
                                      <option key={i} value={value} disabled={disabled}>
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
                                    onKeyUp={({ key }) => {
                                      if (key === "Enter" && onEnter) {
                                        onEnter(table.getState().columnFilters);
                                      }
                                    }}
                                    bsSize="sm"
                                  ></Input>
                                )}
                              </>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  )}
                </Fragment>
              ))}
            </thead>
          )}
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length}>{reactDataTableTranslations.noEntries}</td>
              </tr>
            ) : (
              <TableBody<TData> table={table} enableDragAndDrop={!!dragAndDropOptions?.enableDragAndDrop} rowStyle={rowStyle} />
            )}
          </tbody>
          {table.getFooterGroups().length > 0 &&
            table.getFooterGroups().some((x) => x.headers.some((y) => !y.isPlaceholder && y.column.columnDef.footer)) && (
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={header.column.columnDef.meta?.footerStyle}
                        className={header.column.columnDef.meta?.footerClassName}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            )}
        </ReactStrapTable>
      </DndContext>

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
            itemsPerPageDropdown: reactDataTableTranslations.itemsPerPageDropdown,
            showedItemsText: reactDataTableTranslations.showedItemsText,
          }}
          pagingPossible={true}
          changePageSizePossible={!hidePageSizeChange}
        />
      )}
    </>
  );
};

export { ReactDataTable, ReactDataTableProps };
