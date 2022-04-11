/* eslint-disable complexity */
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { DeleteAction, DateHandler } from "@neolution-ch/react-pattern-ui";
import { DataTableColumnDescription, DataTableRoutedActions, RowStyleType } from "../DataTable/DataTableInterfaces";
import { getDeepValue } from "../Utils/DeepValue";

interface DataTableRowProps<T, TRouteNames> {
  keyField: Extract<keyof T, string>;
  record: T;
  columns: DataTableColumnDescription<T>[];
  actions?: DataTableRoutedActions<T, TRouteNames>;
  rowStyle?: RowStyleType<T>;
}

// eslint-disable-next-line complexity
export function DataTableRow<T, TRouteNames>({ keyField, record, columns, actions, rowStyle }: DataTableRowProps<T, TRouteNames>) {
  const keyValue = getDeepValue(record, keyField);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <React.Fragment>
      <tr key={`${keyValue}_row`} style={rowStyle ? rowStyle(keyValue, record) : undefined}>
        {actions && (
          <th scope="row">
            {actions.collapse && (
              <FontAwesomeIcon
                icon={collapsed ? faPlus : faMinus}
                style={{ marginRight: "5px", cursor: "pointer" }}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
            {actions.view && (
              <actions.view.link route={actions.view.route} params={actions.view.getParams({ keyValue, cell: record })}>
                <a>
                  <FontAwesomeIcon icon={faEye} style={{ marginRight: "5px" }} />
                </a>
              </actions.view.link>
            )}
            {actions.delete && (
              <DeleteAction
                title={actions.delete.title}
                text={actions.delete.text}
                iconOnly
                onDelete={() => actions?.delete?.action({ key: keyValue, cell: record })}
              />
            )}
            {actions.others && actions.others.map((action) => action.formatter({ key: keyValue, row: record }))}
          </th>
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
      </tr>
      {!collapsed &&
        actions?.collapse?.getRows &&
        actions?.collapse?.getRows(record).map((subRow) => (
          <DataTableRow
            key={`${keyValue}_subrow_${getDeepValue(subRow, keyField)}`}
            keyField={keyField}
            columns={actions?.collapse?.columns || columns}
            record={subRow}
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
