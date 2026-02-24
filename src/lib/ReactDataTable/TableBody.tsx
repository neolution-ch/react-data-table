import { DraggableRow, InternalTableRow } from "./TableRows";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Row, Table } from "@tanstack/react-table";
import { CSSProperties, useMemo } from "react";
import { FilterModel } from "../types/TableState";
import { ReactDataTableProps } from "./ReactDataTableProps";
import { Virtualizer } from "@tanstack/react-virtual";

interface TableBodyProps<TData, TFilter extends FilterModel = Record<string, never>> extends Pick<
  ReactDataTableProps<TData, TFilter>,
  "enableRowClick" | "onRowClick" | "subRowComponent"
> {
  enableDragAndDrop: boolean;
  table: Table<TData>;
  rowStyle?: (row: TData) => CSSProperties;
  virtualizer?: Virtualizer<HTMLDivElement, Element>;
}

interface InternalRow<TData> {
  row: Row<TData>;
  rowStyle?: CSSProperties;
}

const TableBody = <TData, TFilter extends FilterModel = Record<string, never>>(props: TableBodyProps<TData, TFilter>) => {
  const { enableDragAndDrop, table, rowStyle, enableRowClick, onRowClick, virtualizer, subRowComponent } = props;

  if (enableDragAndDrop && !table.options.getRowId) {
    throw new Error("You must provide 'getRowId()' to data-table options in order to use the drag-and-drop feature.");
  }

  const {
    options: { enableRowSelection, enableExpanding, fullRowSelectable },
  } = table;

  const { rows } = table.getRowModel();

  const virtualizerRows = virtualizer?.getVirtualItems();

  const rowsToRender: InternalRow<TData>[] = useMemo(
    () =>
      virtualizerRows
        ? virtualizerRows.map((virtualRow, index) => ({
            row: rows[virtualRow.index],
            rowStyle: {
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
            },
          }))
        : rows.map((row) => ({ row })),
    [rows, virtualizerRows],
  );

  return enableDragAndDrop ? (
    <SortableContext items={table.getRowModel().rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
      {rowsToRender.map((x, index) => {
        const { row } = x;
        return (
          <DraggableRow<TData, TFilter>
            key={index}
            row={row}
            enableRowClick={enableRowClick}
            onRowClick={onRowClick}
            enableRowSelection={enableRowSelection as boolean | ((row: Row<TData>) => boolean)}
            enableExpanding={enableExpanding as boolean | ((row: Row<TData>) => boolean)}
            rowStyle={{
              ...x.rowStyle,
              ...(rowStyle ? rowStyle(row.original) : {}),
            }}
            fullRowSelectable={fullRowSelectable}
            subRowComponent={subRowComponent}
          />
        );
      })}
    </SortableContext>
  ) : (
    <>
      {rowsToRender.map((x, index) => {
        const { row } = x;
        return (
          <InternalTableRow<TData, TFilter>
            key={index}
            row={row}
            enableRowClick={enableRowClick}
            onRowClick={onRowClick}
            enableRowSelection={enableRowSelection as boolean | ((row: Row<TData>) => boolean)}
            enableExpanding={enableExpanding as boolean | ((row: Row<TData>) => boolean)}
            rowStyle={{
              ...x.rowStyle,
              ...(rowStyle ? rowStyle(row.original) : {}),
            }}
            fullRowSelectable={fullRowSelectable}
            hasPinnedColumns={table.getIsSomeColumnsPinned()}
            subRowComponent={subRowComponent}
          />
        );
      })}
    </>
  );
};

export { TableBody };
