import React from "react";
import { Story, Meta } from "@storybook/react";
import { DataTable, DataTableStatic } from "./DataTable";
import { DataTableColumnDescription, DataTableProps, DataTableStaticProps, TableQueryResult } from "./DataTableInterfaces";
import { ListSortDirection } from "./DataTableTypes";

export default {
  title: "Examples/Static DataTable",
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
  name: string;
  count: number;
  status: Status;
  dateCreated: Date;
}

const Template: Story<DataTableStaticProps<DataInterface>> = (args) => (
  <React.Fragment>
    <DataTableStatic {...args} />
  </React.Fragment>
);

const DynamicTemplate: Story<DataTableStaticProps<DataInterface>> = (args) => (
  <React.Fragment>
    <DataTable {...args} />
  </React.Fragment>
);

const data: DataInterface[] = [
  { id: "id1", count: 2, dateCreated: new Date("2020-06-01"), name: "Name 1", status: Status.Active },
  { id: "id2", count: 6, dateCreated: new Date("2020-02-01"), name: "Name 2", status: Status.Active },
  { id: "id3", count: 90, dateCreated: new Date("2020-06-08"), name: "Name 3", status: Status.Active },
  { id: "id4", count: 3, dateCreated: new Date("2018-06-01"), name: "Name 4", status: Status.Deleted },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
];

const dataDynamic: DataInterface[] = [
  { id: "id1", count: 2, dateCreated: new Date("2020-06-01"), name: "Name 1", status: Status.Active },
  { id: "id2", count: 6, dateCreated: new Date("2020-02-01"), name: "Name 2", status: Status.Active },
  { id: "id3", count: 90, dateCreated: new Date("2020-06-08"), name: "Name 3", status: Status.Active },
  { id: "id4", count: 3, dateCreated: new Date("2018-06-01"), name: "Name 4", status: Status.Deleted },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
  { id: "id5", count: 898, dateCreated: new Date("2019-12-13"), name: "Name 5", status: Status.Active },
];

const columns: DataTableColumnDescription<DataInterface>[] = [
  { dataField: "name", text: "NAME" },
  { dataField: "count", text: "COUNT" },
  {
    dataField: "status",
    text: "STATUS",
    enumValues: [
      { value: Status.Active, text: "Active" },
      { value: Status.Deleted, text: "Deleted" },
    ],
  },
  { dataField: "dateCreated", text: "CREATED", dateTimeFormat: "dd.MM.yyyy" },
];

const columnsDynamic: DataTableColumnDescription<DataInterface>[] = [
  { dataField: "name", text: "NAME" },
  { dataField: "count", text: "COUNT" },
  {
    dataField: "status",
    text: "STATUS",
    enumValues: [
      { value: Status.Active, text: "Active" },
      { value: Status.Deleted, text: "Deleted" },
    ],
  },
  { dataField: "dateCreated", text: "CREATED", dateTimeFormat: "dd.MM.yyyy" },
];

export const StaticTable = Template.bind({});
StaticTable.args = {
  keyField: "id",
  tableTitle: "Static Table",
  hideIfEmpty: false,
  columns,
  data,
} as DataTableStaticProps<DataInterface>;
StaticTable.decorators = [
  (StoryComponent: any) => (
    <React.Fragment>
      <p>Your intro text goes here if needed.</p>
      <StoryComponent />
    </React.Fragment>
  ),
];

const dynamicClient = {
  query: (
    filter: any,
    limit?: number,
    page?: number,
    orderBy?: string,
    sortDirection?: ListSortDirection,
  ): Promise<TableQueryResult<DataInterface>> => {
    console.log("test");
    return new Promise(() => {
      console.log(filter);
      console.log(page);
      console.log(orderBy);
      console.log(sortDirection);
      return dataDynamic.slice(0, limit);
    });
  },
};

const DynamicTable = DynamicTemplate.bind({});
DynamicTable.args = {
  keyField: "id",
  tableTitle: "Dynamic Table",
  hideIfEmpty: false,
  columns: columnsDynamic,
  data: dataDynamic.slice(0, 25),
  client: dynamicClient,
} as DataTableProps<DataInterface, DataFilter>;
DynamicTable.decorators = [
  (StoryComponent: any) => (
    <React.Fragment>
      <p>Your intro text goes here if needed.</p>
      <StoryComponent />
    </React.Fragment>
  ),
];
