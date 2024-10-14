import { useSortable } from "@dnd-kit/sortable";
import { Row, flexRender } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { getCommonPinningStyles } from "../utils/getCommonPinningStyles";

interface TableRowProps<TData> {
  row: Row<TData>;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  enableExpanding?: boolean | ((row: Row<TData>) => boolean);
  rowStyle?: CSSProperties;
  setNodeRef?: (node: HTMLElement | null) => void;
}

const InternalTableRow = <TData,>(props: TableRowProps<TData>) => {
  const { row, rowStyle, setNodeRef, enableRowSelection = false } = props;
  const isRowSelectionEnabled = typeof enableRowSelection === "function" ? enableRowSelection(row) : enableRowSelection;

  return (
    <tr
      key={row.id}
      ref={setNodeRef}
      onClick={() => {
        if (isRowSelectionEnabled) {
          row.toggleSelected();
        }
      }}
      className={isRowSelectionEnabled ? "cursor-pointer" : undefined}
      style={rowStyle}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} style={{
          ...cell.column.columnDef.meta?.cellStyle,
          ...getCommonPinningStyles(cell.column)
        }}
        className={cell.column.columnDef.meta?.cellClassName}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const DraggableRow = <TData,>(props: TableRowProps<TData>) => {
  const { row, rowStyle, enableRowSelection, enableExpanding } = props;
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.id });
  const draggableStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return (
    <InternalTableRow
      row={row}
      enableRowSelection={enableRowSelection}
      enableExpanding={enableExpanding}
      setNodeRef={setNodeRef}
      rowStyle={rowStyle ? { ...rowStyle, ...draggableStyle } : draggableStyle}
    />
  );
};

export { InternalTableRow, DraggableRow };
