import { useRef } from "react";
import { DataHandlers, DataTable, DataTableProps } from "src";

const DataTableReload = <T, F>(props: { reloadButtonName: string } & Omit<DataTableProps<T, F>, "handlers">) => {
  const { actions, client, columns, data, keyField, reloadButtonName } = props;
  const dataHandlersRef = useRef<DataHandlers>();

  return (
    <>
      <button type="button" onClick={() => dataHandlersRef.current?.reloadData()} className="btn btn-primary">
        {reloadButtonName}
      </button>

      <DataTable<T, undefined>
        keyField={keyField}
        actions={actions}
        data={data}
        client={client}
        columns={columns}
        handlers={(dataHandlers) => {
          dataHandlersRef.current = dataHandlers;
        }}
        asc={true}
      />
    </>
  );
};

export { DataTableReload };
