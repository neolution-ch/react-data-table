/**
 * This are the possible translations for the data table
 *
 * @interface DataTableTranslations
 * @property {string} clearSearchToolTip is used to print out the bottom text, possible placeholders are: {from}, {to} and {total}
 */
export interface ReactDataTableTranslations {
  actionTitle: string;
  showedItemsText: string;
  searchToolTip: string;
  clearSearchToolTip: string;
  itemsPerPageDropdown: string;
  noEntries: string;
}

export let reactDataTableTranslations: ReactDataTableTranslations = {
  actionTitle: "Aktionen",
  clearSearchToolTip: "Suche zurücksetzen",
  searchToolTip: "Suchen",
  showedItemsText: "Zeige {from} bis {to} von insgesamt {total} Resultaten",
  itemsPerPageDropdown: "Anzahl pro Seite",
  noEntries: "Keine Einträge vorhanden",
};

export function setDataTableTranslations(translations: ReactDataTableTranslations) {
  reactDataTableTranslations = translations;
}
