import { useSortable } from "@dnd-kit/sortable";
import { Row, flexRender } from "@tanstack/react-table";
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

const DraggableRow = <TData,>(props: TableRowProps<TData>) => {
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

export { InternalTableRow, DraggableRow };
