/* eslint-disable complexity */
import React, { CSSProperties, useState } from "react";
import { DateHandler } from "@neolution-ch/react-pattern-ui";
import { DataTableColumnDescription, DataTableRoutedActions, HighlightInterface , RowStyleType } from "../DataTable/DataTableInterfaces";
import { getDeepValue } from "../Utils/DeepValue";
import { ActionsCell } from "../DataTable/Actions/ActionsCell";
import { ActionsPosition } from "../DataTable/DataTableTypes";

interface DataTableRowProps<T, TRouteNames> {
  keyField: Extract<keyof T, string>;
  record: T;
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableRoutedActions<T, TRouteNames>;
  rowStyle?: RowStyleType<T>;
  highlight?: HighlightInterface;
  actionsPosition?: ActionsPosition;
}

// eslint-disable-next-line complexity
export function DataTableRow<T, TRouteNames>({
  keyField,
  record,
  columns,
  actions,
  rowStyle,
  highlight,
  actionsPosition,
}: DataTableRowProps<T, TRouteNames>) {
  const keyValue = getDeepValue(record, keyField);
  const [collapsed, setCollapsed] = useState(true);

  var operator_table = {
    ">": function (a: number | Date, b: number | Date) { return a > b; },
    "<": function (a: number | Date, b: number | Date) { return a < b; },
    "==": function (a: number | Date, b: number | Date) { return a == b; },
    "!=": function (a: number | Date, b: number | Date) { return a != b; },
  };

  function setStyle(
    rowObjectT: T,
    highlight?: HighlightInterface,
  ): CSSProperties | undefined
  {
    const defaultStyle: CSSProperties = {
      backgroundColor: "rgba(255,0,0,0.5)",
    };
    if (highlight) {
      if (typeof rowObjectT[highlight.compareField] === typeof highlight.compareValue) {
        if (operator_table[highlight.operation](rowObjectT[highlight.compareField], highlight.compareValue)) {
          return highlight.customStyle ?? defaultStyle;
        }
      }
    }
    return undefined;
  }

  return (
    <React.Fragment>
      <tr key={`${keyValue}_row`} style={{ ...rowStyle ? rowStyle(keyValue, record) : undefined, ...setStyle(record, highlight) }}>
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

          if (column.enumValues && !Number.isNaN(deepValueInt) && column.enumValues.filter((c) => c.value === deepValueInt).length > 0)
            return (
              <td key={key} style={style}>
                {column.enumValues.filter((c) => c.value === deepValueInt)[0].text}
              </td>
            );

          if (column.formatter)
            return (
              <td key={key} style={style}>
                {column.formatter({ key: keyValue, row: record, value: deepValue })}
              </td>
            );

          return (
            <td key={key} style={style}>
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
        actions?.collapse?.getRows(record).map((subRow) => (
          <DataTableRow
            key={`${keyValue}_subrow_${getDeepValue(subRow, keyField)}`}
            keyField={keyField}
            highlight={highlight}
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
          />
        ))}
    </React.Fragment>
  );
}
