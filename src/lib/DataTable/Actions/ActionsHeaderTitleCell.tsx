import { dataTableTranslations } from "../DataTable";
import { DataTableRoutedActions } from "../DataTableInterfaces";

interface ActionsHeaderTitleCellProps<T, TRouteName> {
  actions?: DataTableRoutedActions<T, TRouteName>;
}

const ActionsHeaderTitleCell = <T, TRouteName>({ actions }: ActionsHeaderTitleCellProps<T, TRouteName>) => (
  <>
    {actions &&
      (actions.columnTitle != null ? (
        <th className={actions.className} style={actions.style}>
          {actions.columnTitle}
        </th>
      ) : (
        <th className={actions.className} style={{ width: "80px", ...actions.style }}>
          {dataTableTranslations.actionTitle}
        </th>
      ))}
  </>
);

export { ActionsHeaderTitleCell };
