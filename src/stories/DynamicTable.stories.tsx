/* eslint-disable max-lines */
import React, { CSSProperties, useRef } from "react";
import { Story, Meta } from "@storybook/react";
import { DataTable, DataTableStatic } from "../lib/DataTable/DataTable";
import {
  DataHandlers,
  DataTableActions,
  DataTableColumnDescription,
  DataTableProps,
  TableQueryResult,
} from "../lib/DataTable/DataTableInterfaces";
import { ColumnFilterType, ListSortDirection } from "../lib/DataTable/DataTableTypes";

export default {
  title: "Examples/Dynamic Table",
  component: DataTableStatic,
} as Meta;

enum Status {
  Active = 0,
  Deleted = 1,
}

interface DataInterface {
  id: string;
  name: string;
  count: number;
  status: Status;
  dateCreated: Date;
}

interface DataFilter {
  name?: string;
  count?: number;
  status?: Status;
  dateCreated?: Date;
}

const INFO_STYLE: CSSProperties = Object.freeze({ backgroundColor: "#cfd9e6", border: "1px dotted gray" });

const DynamicTemplate: Story<DataTableProps<DataInterface, DataFilter>> = (args) => (
  <React.Fragment>
    <DataTable {...args} />
  </React.Fragment>
);

const TriggeredReloadDynamicTemplate: Story<DataTableProps<DataInterface, DataFilter>> = (args) => {
  const dataHandlersRef = useRef<DataHandlers>();

  return (
    <React.Fragment>
      <div style={INFO_STYLE}>
        <p>Try deleting a row and then click the button below to reload the table.</p>
        <button type="button" onClick={() => dataHandlersRef.current?.reloadData()} className="btn btn-primary">
          Reload table
        </button>
      </div>

      <DataTable
        {...args}
        handlers={(dataHandlers) => {
          dataHandlersRef.current = dataHandlers;
        }}
      />
    </React.Fragment>
  );
};

let dataDynamic: DataInterface[] = Array.from(Array(100)).map((_, i) => {
  const randomNumber: number = Math.floor(Math.random() * 500);
  const date = new Date();
  date.setDate(date.getDate() - randomNumber);
  return {
    id: `id${i.toString().padStart(3, "0")}`,
    count: randomNumber,
    dateCreated: date,
    name: `Name ${i.toString().padStart(3, "0")}`,
    status: randomNumber % 20 === 0 ? Status.Deleted : Status.Active,
  };
});

const columnsDynamic: DataTableColumnDescription<DataInterface>[] = [
  { dataField: "name", text: "NAME", sortable: true, filter: { filterType: ColumnFilterType.String } },
  { dataField: "count", text: "COUNT", sortable: true, filter: { filterType: ColumnFilterType.String } },
  {
    dataField: "status",
    text: "STATUS",
    filter: { filterType: ColumnFilterType.Enum },
    enumValues: [
      { value: undefined, text: "All" },
      { value: Status.Active, text: "Active" },
      { value: Status.Deleted, text: "Deleted" },
    ],
  },
  {
    dataField: "dateCreated",
    text: "CREATED",
    dateTimeFormat: "dd.MM.yyyy",
    sortable: true,
    filter: { filterType: ColumnFilterType.String },
  },
];

// eslint-disable-next-line complexity
function fakeQuery(
  filter: DataFilter,
  limit?: number,
  page?: number,
  orderBy?: string,
  sortDirection?: ListSortDirection,
): TableQueryResult<DataInterface> {
  let dataDynamicResult = [...dataDynamic];

  if (filter !== null) {
    if (filter.name !== undefined && filter.name !== "") {
      dataDynamicResult = dataDynamicResult.filter((item) => item.name.indexOf(filter.name || "") >= 0);
    }

    if (filter.count !== undefined && filter.count.toString() !== "") {
      dataDynamicResult = dataDynamicResult.filter((item) => item.count.toString() === filter.count?.toString());
    }

    if (filter.dateCreated !== undefined && filter.dateCreated.toString() !== "") {
      dataDynamicResult = dataDynamicResult.filter((item) => item.dateCreated === filter.dateCreated);
    }

    if (filter.status !== undefined && filter.status !== null) {
      dataDynamicResult = dataDynamicResult.filter((item) => item.status === filter.status);
    }
  }

  if (orderBy !== undefined) {
    switch (orderBy) {
      case "count":
        dataDynamicResult =
          sortDirection === ListSortDirection.Descending
            ? dataDynamicResult.sort((a, b) => b.count - a.count)
            : dataDynamicResult.sort((a, b) => a.count - b.count);
        break;
      case "dateCreated":
        dataDynamicResult =
          sortDirection === ListSortDirection.Descending
            ? dataDynamicResult.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime())
            : dataDynamicResult.sort((a, b) => a.dateCreated.getTime() - b.dateCreated.getTime());
        break;
      case "name":
      default:
        dataDynamicResult =
          sortDirection === ListSortDirection.Descending
            ? dataDynamicResult.sort((a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" }))
            : dataDynamicResult.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
        break;
    }
  }

  const result: TableQueryResult<DataInterface> = {
    totalRecords: dataDynamicResult.length,
  };
  const start: number = ((page || 1) - 1) * (limit || 25);
  result.records = dataDynamicResult.slice(start, start + (limit || 25));
  return result;
}

const dynamicClient = {
  query: (
    filter: DataFilter,
    limit?: number,
    page?: number,
    orderBy?: string,
    sortDirection?: ListSortDirection,
  ): Promise<TableQueryResult<DataInterface>> =>
    new Promise<TableQueryResult<DataInterface>>((resolve) => resolve(fakeQuery(filter, limit, page, orderBy, sortDirection))),
};

const dynamicActions: DataTableActions<DataInterface> = {
  delete: {
    action: ({ key }) => {
      dataDynamic = dataDynamic.filter((item) => item.id !== key);
    },
    text: "Will be deleted permanentally! Are you sure?",
    title: "Delete entry",
  },
};

export const DynamicTable = DynamicTemplate.bind({});
DynamicTable.args = {
  keyField: "id",
  tableTitle: "Dynamic Table 23",
  hideIfEmpty: false,
  columns: columnsDynamic,
  data: fakeQuery({}),
  client: dynamicClient,
  actions: dynamicActions,
  showPaging: true,
} as DataTableProps<DataInterface, DataFilter>;
DynamicTable.decorators = [
  (StoryComponent: any) => (
    <React.Fragment>
      <p>This is a dynamic table with a faked api client.</p>
      <StoryComponent />
    </React.Fragment>
  ),
];

export const TriggeredReload = TriggeredReloadDynamicTemplate.bind({});

TriggeredReload.args = {
  keyField: "id",
  columns: columnsDynamic,
  data: fakeQuery({}),
  client: dynamicClient,
  actions: dynamicActions,
  showPaging: true,
} as DataTableProps<DataInterface, DataFilter>;

TriggeredReload.parameters = {
  docs: {
    source: {
      format: true,
      code: `
const dataHandlersRef = useRef<DataHandlers>();

type DataType = {};
type FilterType = {};

return (
  <React.Fragment>
    <button type="button" onClick={() => dataHandlersRef.current?.reloadData()} className="btn btn-primary">
      Reload Dynamic Table
    </button>

    <DataTable<DataType, FilterType>
      // ...other properties
      handlers={(dataHandlers) => {
        dataHandlersRef.current = dataHandlers;
      }}
    />
  </React.Fragment>
);`,
      language: "tsx",
    },
  },
};
