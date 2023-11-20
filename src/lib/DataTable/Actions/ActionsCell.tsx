import { faPlus, faMinus, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteAction } from "@neolution-ch/react-pattern-ui";
import { DataTableRoutedActions } from "../DataTableInterfaces";
import React from "react";

interface ActionsCellProps<T, TRouteName> {
  actions?: DataTableRoutedActions<T, TRouteName>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  keyValue: any;
  record: T;
}

const ActionsCell = <T, TRouteName>({ actions, collapsed, setCollapsed, keyValue, record }: ActionsCellProps<T, TRouteName>) => (
  <>
    {actions && (
      <th scope="row" className={actions.className} style={{ whiteSpace: "nowrap", ...actions.style }}>
        {actions.collapse && (
          <FontAwesomeIcon
            icon={collapsed ? faPlus : faMinus}
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={() => setCollapsed(!collapsed)}
          />
        )}
        {actions.view && (
          <actions.view.link route={actions.view.route} params={actions.view.getParams({ keyValue, cell: record })}>
            <FontAwesomeIcon icon={actions.view.icon ?? faEye} style={{ marginRight: "5px" }} />
          </actions.view.link>
        )}
        {actions.delete && (
          <DeleteAction
            title={actions.delete.title}
            text={actions.delete.text}
            iconOnly
            cancelButtonText={actions.delete.cancelButtonText}
            deleteButtonText={actions.delete.deleteButtonText}
            onDelete={() => actions?.delete?.action({ key: keyValue, cell: record })}
          />
        )}
        {actions.others &&
          actions.others.map((action, idx) => (
            <React.Fragment key={idx}>{action.formatter({ key: keyValue, row: record })}</React.Fragment>
          ))}
      </th>
    )}
  </>
);

export { ActionsCell };
