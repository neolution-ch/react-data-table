import { useSortable } from "@dnd-kit/sortable";
import { Row, flexRender } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { FilterModel } from "../types/TableState";
import { ReactDataTableProps } from "./ReactDataTableProps";

interface TableRowProps<TData, TFilter extends FilterModel = Record<string, never>>
  extends Pick<ReactDataTableProps<TData, TFilter>, "onRowClick" | "enableRowClick"> {
  row: Row<TData>;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  fullRowSelectable?: boolean;
  enableExpanding?: boolean | ((row: Row<TData>) => boolean);
  rowStyle?: CSSProperties;
  setNodeRef?: (node: HTMLElement | null) => void;
}

const InternalTableRow = <TData, TFilter extends FilterModel = Record<string, never>>(props: TableRowProps<TData, TFilter>) => {
  const { row, rowStyle, setNodeRef, enableRowSelection = false, fullRowSelectable = true, onRowClick, enableRowClick } = props;
  const isRowSelectionEnabled =
    (typeof enableRowSelection === "function" ? enableRowSelection(row) : enableRowSelection) && fullRowSelectable;
  const isRowClickable = typeof enableRowClick === "function" ? enableRowClick(row) : enableRowClick;
  return (
    <tr
      key={row.id}
      ref={setNodeRef}
      onClick={async () => {
        if (isRowSelectionEnabled) {
          row.toggleSelected();
        } else if (isRowClickable && onRowClick) {
          await onRowClick(row);
        } else {
          // Nothing to execute
        }
      }}
      className={isRowSelectionEnabled || isRowClickable ? "cursor-pointer" : undefined}
      style={rowStyle}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} style={cell.column.columnDef.meta?.cellStyle} className={cell.column.columnDef.meta?.cellClassName}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const DraggableRow = <TData, TFilter extends FilterModel = Record<string, never>>(props: TableRowProps<TData, TFilter>) => {
  const { row, rowStyle } = props;
  const { transform, transition, isDragging } = useSortable({ id: row.id });
  const draggableStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return <InternalTableRow<TData, TFilter> {...props} rowStyle={rowStyle ? { ...rowStyle, ...draggableStyle } : draggableStyle} />;
};

export { InternalTableRow, DraggableRow };
