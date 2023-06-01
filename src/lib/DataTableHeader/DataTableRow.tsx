/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { CSSProperties, useRef, useState } from "react";
import { DateHandler } from "@neolution-ch/react-pattern-ui";
import { DataTableColumnDescription, DataTableRoutedActions, RowHighlightInterface, RowStyleType } from "../DataTable/DataTableInterfaces";
import { getDeepValue } from "../Utils/DeepValue";
import { ActionsCell } from "../DataTable/Actions/ActionsCell";
import { ActionsPosition } from "../DataTable/DataTableTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { DragSourceMonitor, XYCoord, useDrag, useDrop } from "react-dnd";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DataTableRowProps<T, TRouteNames> {
  keyField: Extract<keyof T, string>;
  record: T;
  columns: DataTableColumnDescription<T>[];
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  setNewOrder: (id: number) => void;
  id: number;
  actions?: DataTableRoutedActions<T, TRouteNames>;
  rowStyle?: RowStyleType<T>;
  rowHighlight?: RowHighlightInterface<T>;
  actionsPosition?: ActionsPosition;
  useDragAndDrop?: boolean;
  setInitialIndex(id: number | null): void;
  initialIndex: number | null;
}

// eslint-disable-next-line complexity
export function DataTableRow<T, TRouteNames>({
  keyField,
  record,
  columns,
  actions,
  rowStyle,
  rowHighlight,
  actionsPosition,
  moveRow,
  setNewOrder,
  id,
  useDragAndDrop,
  setInitialIndex,
  initialIndex,
}: DataTableRowProps<T, TRouteNames>) {
  const keyValue = getDeepValue(record, keyField);
  const [collapsed, setCollapsed] = useState(true);

  const operator_table = {
    ">": function (a: number | Date, b: number | Date) {
      return a > b;
    },
    "<": function (a: number | Date, b: number | Date) {
      return a < b;
    },
    "==": function (a: number | Date, b: number | Date) {
      return a == b;
    },
    "!=": function (a: number | Date, b: number | Date) {
      return a != b;
    },
  };

  function getStyle(rowObjectT: T, rowHighlight?: RowHighlightInterface<T>): CSSProperties | undefined {
    const defaultStyle: CSSProperties = {
      color: "red",
    };

    if (!rowHighlight) {
      return undefined;
    }

    let selectedValue: number | Date | undefined;
    if (typeof rowObjectT[rowHighlight.compareField] == "number") {
      selectedValue = rowObjectT[rowHighlight.compareField] as unknown as number;
    } else if (typeof rowObjectT[rowHighlight.compareField] == "string") {
      selectedValue = new Date(rowObjectT[rowHighlight.compareField] as unknown as string);
    }

    if (selectedValue == null) {
      return undefined;
    }

    if (typeof selectedValue != "number" && isNaN(selectedValue?.getDate())) {
      return undefined;
    }

    if (operator_table[rowHighlight.operation](selectedValue, rowHighlight.compareValue)) {
      return rowHighlight.customStyle ?? defaultStyle;
    }

    return undefined;
  }

  const dropRef = useRef<any>(null);
  const dragRef = useRef<any>(null);
  let opacity = 1;
  let hId: string | symbol | null = null;

  if (useDragAndDrop) {
    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
      accept: "draggableItem",
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item: DragItem, monitor) {
        if (!dragRef.current) {
          return;
        }

        const dragIndex = item.index;
        const hoverIndex = id;
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = dragRef.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        if (initialIndex == null) {
          setInitialIndex(item.index);
        }
        moveRow(dragIndex, hoverIndex);

        item.index = hoverIndex;
      },
      drop() {
        setNewOrder(id);
      },
    });

    const [{ isDragging }, drag, preview] = useDrag({
      type: "draggableItem",
      item: () => {
        const dragItem = { id, index: id };
        return dragItem;
      },
      collect: (monitor: DragSourceMonitor<DragItem, void>) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    opacity = isDragging ? 0 : 1;
    hId = handlerId;

    preview(drop(dropRef));
    drag(dragRef);
  }

  return (
    <React.Fragment>
      <tr
        key={`${keyValue}_row`}
        data-handler-id={hId}
        ref={dropRef}
        style={{ ...(rowStyle ? rowStyle(keyValue, record) : undefined), opacity }}
      >
        {useDragAndDrop && (
          <td ref={dragRef}>
            <FontAwesomeIcon icon={faBars} style={{ cursor: "move" }} />
          </td>
        )}

        {actionsPosition === ActionsPosition.Left && (
          <ActionsCell collapsed={collapsed} setCollapsed={setCollapsed} actions={actions} keyValue={keyValue} record={record} />
        )}

        {columns.map((column) => {
          const deepValue = getDeepValue(record, column.dataField);
          const deepValueInt = parseInt(deepValue, 10);
          const key = `${keyValue}_td_${column.dataField}`;
          const style =
            column.cellStyle instanceof Function
              ? column.cellStyle({ key: keyValue, row: record, value: deepValue })
              : column.cellStyle ?? undefined;
          const cellStyle = { ...getStyle(record, rowHighlight), ...style };
          if (column.enumValues && !Number.isNaN(deepValueInt) && column.enumValues.filter((c) => c.value === deepValueInt).length > 0)
            return (
              <td key={key} style={cellStyle}>
                {column.enumValues.filter((c) => c.value === deepValueInt)[0].text}
              </td>
            );

          if (column.formatter)
            return (
              <td key={key} style={cellStyle}>
                {column.formatter({ key: keyValue, row: record, value: deepValue })}
              </td>
            );

          return (
            <td key={key} style={cellStyle}>
              {column.dateTimeFormat ? DateHandler.getDateFormattedWithDefault(deepValue, column.dateTimeFormat, "-") : deepValue}
            </td>
          );
        })}

        {actionsPosition === ActionsPosition.Right && (
          <ActionsCell collapsed={collapsed} setCollapsed={setCollapsed} actions={actions} keyValue={keyValue} record={record} />
        )}
      </tr>
      {!collapsed &&
        actions?.collapse?.getRows &&
        actions?.collapse?.getRows(record).map((subRow, index) => (
          <DataTableRow
            key={`${keyValue}_subrow_${getDeepValue(subRow, keyField)}`}
            keyField={keyField}
            rowHighlight={rowHighlight}
            columns={actions?.collapse?.columns || columns}
            record={subRow}
            actionsPosition={actionsPosition}
            actions={{
              others: [
                {
                  formatter: () => <React.Fragment />,
                },
              ],
            }}
            moveRow={moveRow}
            setNewOrder={setNewOrder}
            id={index}
            initialIndex={initialIndex}
            setInitialIndex={setInitialIndex}
          />
        ))}
    </React.Fragment>
  );
}
