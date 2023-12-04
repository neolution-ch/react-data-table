import { ColumnDef, ColumnHelper, DeepKeys, RowData, createColumnHelper } from "@tanstack/react-table";

interface ReactDataTableColumnHelper<TData extends RowData> extends ColumnHelper<TData> {
  createEnumColumn: <TEnum extends string | number>(
    columnKey: DeepKeys<TData>,
    enumTranslations: Record<TEnum, string>,
    columndDef?: Partial<ColumnDef<TData, TEnum>>,
  ) => ColumnDef<TData, TEnum>;
}

const createReactDataTableColumnHelper = <TData extends RowData>(): ReactDataTableColumnHelper<TData> => {
  const columnHelper = createColumnHelper<TData>();

  columnHelper.accessor;

  const res: ReactDataTableColumnHelper<TData> = {
    ...columnHelper,
    createEnumColumn: (columnKey, enumTranslations, columndDef) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      columnHelper.accessor(columnKey as any, {
        cell: (cell) => enumTranslations[cell.getValue()],
        enableColumnFilter: true,
        meta: {
          dropdownFilter: {
            options: Object.entries(enumTranslations).map(([key, value]) => ({
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
