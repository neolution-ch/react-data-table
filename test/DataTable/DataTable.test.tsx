import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DataTable, DataTableStatic } from "src/lib/DataTable/DataTable";
import { DataTableColumnDescription, TableQueryResult, DataTableActions } from "src/lib/DataTable/DataTableInterfaces";
import { ColumnFilterType, ListSortDirection } from "src/lib/DataTable/DataTableTypes";

describe("DataTable", () => {
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

  let dataDynamic: DataInterface[] = Array.from(Array(100)).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      id: `id${i.toString().padStart(3, "0")}`,
      count: 1,
      dateCreated: date,
      name: `Name ${i.toString().padStart(3, "0")}`,
      status: 1 % 20 === 0 ? Status.Deleted : Status.Active,
    };
  });

  const columns: DataTableColumnDescription<DataInterface>[] = [
    { dataField: "name", text: "NAME", sortable: true, filter: { filterType: ColumnFilterType.String } },
    { dataField: "count", text: "COUNT", sortable: true, filter: { filterType: ColumnFilterType.String } },
    {
      dataField: "status",
      text: "STATUS",
      filter: { filterType: ColumnFilterType.Enum },
      sortable: true,
      sortField: "statusCode",
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
      filter: {
        filterType: ColumnFilterType.String,
        validate: (value: string) =>
          value.length === 0 || /^[0-9]{2}\.[0-9]{2}.[0-9]{4}$/.test(value) ? "" : "Muss im Format dd.mm.yyy sein",
      },
    },
  ];

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
        const dateSplited = filter.dateCreated.toString().split(".");
        const filterDate = new Date(parseInt(dateSplited[2], 10), parseInt(dateSplited[1], 10) - 1, parseInt(dateSplited[0], 10));
        dataDynamicResult = dataDynamicResult.filter((item) => filterDate.toDateString() === item.dateCreated.toDateString());
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
        case "statusCode":
          dataDynamicResult =
            sortDirection === ListSortDirection.Descending
              ? dataDynamicResult.sort((a, b) => b.status - a.status)
              : dataDynamicResult.sort((a, b) => a.status - b.status);
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

  const actions: DataTableActions<DataInterface> = {
    delete: {
      action: ({ key }) => {
        dataDynamic = dataDynamic.filter((item) => item.id !== key);
      },
      text: "Will be deleted permanentally! Are you sure?",
      title: "Delete entry",
    },
  };

  test("renders static correctly", () => {
    const { container } = render(
      <DataTableStatic<DataInterface> keyField="id" tableTitle="Static Table" columns={columns} data={dataDynamic} />,
    );

    expect(container).toMatchSnapshot();
  });

  test("renders dynamic correctly", () => {
    const { container } = render(
      <DataTable<DataInterface, DataFilter>
        keyField="id"
        columns={columns}
        data={fakeQuery({}, 20)}
        client={dynamicClient}
        actions={actions}
        showPaging
        possiblePageItemCounts={[10, 15, 20, 25, 50, 100, 200]}
        predefinedItemsPerPage={20}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
