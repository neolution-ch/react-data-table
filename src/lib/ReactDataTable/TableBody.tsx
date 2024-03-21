import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { Row, Table, flexRender } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";

interface TableRowProps<TData> {
  row: Row<TData>;
  rowStyle?: CSSProperties;
  setNodeRef?: (node: HTMLElement | null) => void;
}

const InternalTableRow = <TData,>(props: TableRowProps<TData>) => {
  const { row, rowStyle, setNodeRef } = props;
  return (
    <tr key={row.id} ref={setNodeRef} style={rowStyle}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} style={cell.column.columnDef.meta?.cellStyle} className={cell.column.columnDef.meta?.cellClassName}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const DraggableRow = <TData,>(props: Omit<TableRowProps<TData>, "setNodeRef">) => {
  const { row, rowStyle } = props;
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.id });
  const draggableStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return <InternalTableRow row={row} setNodeRef={setNodeRef} rowStyle={rowStyle ? { ...rowStyle, ...draggableStyle } : draggableStyle} />;
};

interface TableRowsProps<TData> {
  enableDragAndDrop: boolean;
  table: Table<TData>;
  rowStyle?: (row: TData) => CSSProperties;
}

const TableBody = <TData,>(props: TableRowsProps<TData>) => {
  const { enableDragAndDrop, table, rowStyle } = props;

  if (enableDragAndDrop && !table.options.getRowId) {
    throw new Error("You must provide 'getRowId()' to data-table options in order to use the drag-and-drop feature.");
  }

  return enableDragAndDrop === true ? (
    <SortableContext items={table.getRowModel().rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
      {table.getRowModel().rows.map((row) => (
        <DraggableRow<TData> key={row.id} row={row} rowStyle={rowStyle && rowStyle(row.original)} />
      ))}
    </SortableContext>
  ) : (
    <>
      {table.getRowModel().rows.map((row) => (
        <InternalTableRow<TData> key={row.id} row={row} rowStyle={rowStyle && rowStyle(row.original)} />
      ))}
    </>
  );
};

export { TableBody };
