import { useSortable } from "@dnd-kit/sortable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef, ColumnHelper, DeepKeys, DisplayColumnDef, RowData, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";
import type { DropdownColumnFilterOption } from "src/react-table";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

interface ReactDataTableColumnHelper<TData extends RowData> extends ColumnHelper<TData> {
  createEnumColumn: <TEnum extends string | number>(
    columnKey: DeepKeys<TData>,
    enumTranslations: Record<TEnum, string> | DropdownColumnFilterOption[],
    columndDef?: Partial<ColumnDef<TData, TEnum>>,
  ) => ColumnDef<TData, TEnum>;
  createDraggableColumn: (
    columnKey: DeepKeys<TData>,
    columndDef: Omit<DisplayColumnDef<TData>, "id" | "cell">,
    isEnabled?: boolean,
    draggableElement?: ReactNode,
  ) => ColumnDef<TData>;
}

const createReactDataTableColumnHelper = <TData extends RowData>(): ReactDataTableColumnHelper<TData> => {
  const columnHelper = createColumnHelper<TData>();

  const createDraggableColumn = (
    columnKey: DeepKeys<TData>,
    columndDef: Omit<DisplayColumnDef<TData>, "id" | "cell">,
    isEnabled?: boolean,
    draggableElement?: ReactNode,
  ) => {
    const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
      const { attributes, listeners, isDragging } = useSortable({ id: rowId });

      return (
        <span
          {...attributes}
          {...listeners}
          className={isEnabled === false ? "opacity-25" : "opacity-100"}
          style={{ cursor: isEnabled === false ? "auto" : isDragging ? "grabbing" : "grab" }}
        >
          {draggableElement ?? <FontAwesomeIcon icon={faGripLines} />}
        </span>
      );
    };

    return columnHelper.display({
      ...columndDef,
      id: columnKey as string,
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
    });
  };

  const res: ReactDataTableColumnHelper<TData> = {
    ...columnHelper,
    createDraggableColumn,
    createEnumColumn: (columnKey, enumTranslations, columndDef) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      columnHelper.accessor(columnKey as any, {
        cell: (cell) =>
          Array.isArray(enumTranslations)
            ? enumTranslations.find((x) => x.value === cell.getValue())?.label
            : enumTranslations[cell.getValue()],
        enableColumnFilter: true,
        meta: {
          dropdownFilter: {
            options: Array.isArray(enumTranslations)
              ? enumTranslations
              : Object.entries(enumTranslations).map(([key, value]) => ({
                  label: value as string,
                  value: key,
                })),
          },
        },
        ...columndDef,
      }),
  };

  return res;
};

export { createReactDataTableColumnHelper };
