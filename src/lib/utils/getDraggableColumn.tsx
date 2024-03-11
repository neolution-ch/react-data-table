import { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { createReactDataTableColumnHelper } from "./createReactDataTableColumnHelper";
import { DisplayColumnDef } from "@tanstack/react-table";

interface DraggableColumnProps<TData> extends Omit<DisplayColumnDef<TData>, "id" | "cell"> {
  keyField: keyof TData;
  draggableElement?: ReactNode;
}

const getDraggableColumn = <TData,>(props: DraggableColumnProps<TData>) => {
  const { keyField, draggableElement } = props;
  const columnHelper = createReactDataTableColumnHelper<TData>();

  const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
    const { attributes, listeners } = useSortable({ id: rowId });
    return (
      <span {...attributes} {...listeners}>
        {draggableElement ?? "🟰"}
      </span>
    );
  };

  return columnHelper.display({
    id: keyField as string,
    cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
    ...props,
  });
};

export { getDraggableColumn };
