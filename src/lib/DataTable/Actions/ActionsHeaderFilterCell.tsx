import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataTableActions, Filters, FilterTranslations } from "../DataTableInterfaces";

interface ActionsHeaderFilterCellProps<T> {
  actions?: DataTableActions<T>;
  onSearch(): void;
  translations: FilterTranslations;
  getFilterRefs(): Filters;
}

const ActionsHeaderFilterCell = <T,>({ actions, onSearch, translations, getFilterRefs }: ActionsHeaderFilterCellProps<T>) => (
  <>
    {actions && (
      <th className={actions.className} style={actions.style}>
        <FontAwesomeIcon
          style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
          title={translations.searchToolTip}
          icon={faSearch}
          onClick={() => {
            onSearch();
          }}
        />
        <FontAwesomeIcon
          style={{ cursor: "pointer", marginBottom: "4px", marginRight: "5px" }}
          title={translations.clearSearchToolTip}
          icon={faTimes}
          onClick={() => {
            const filterRefs = getFilterRefs();
            if (filterRefs) {
              Object.values(filterRefs).forEach((ref) => {
                if (ref instanceof HTMLSelectElement) {
                  // eslint-disable-next-line no-param-reassign
                  ref.value = null as unknown as string;
                } else {
                  // eslint-disable-next-line no-param-reassign
                  ref.value = "";
                }
              });
              onSearch();
            }
          }}
        />
      </th>
    )}
  </>
);

export { ActionsHeaderFilterCell };
