/* eslint-disable max-lines */
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import React, { CSSProperties } from "react";
import { DataTable, DataTableStatic } from "src/lib/DataTable/DataTable";
import { DataTableColumnDescription, TableQueryResult, DataTableActions } from "src/lib/DataTable/DataTableInterfaces";
import { ColumnFilterType, ListSortDirection } from "src/lib/DataTable/DataTableTypes";
import { DataTableReload } from "test/__mocks__/DataTable/dynamic";

global.React = React; // this also works for other globally available libraries

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
    const date = new Date(2022, 12, 31);
    date.setDate(date.getDate() - i);
    return {
      id: `id${i.toString().padStart(3, "0")}`,
      count: i,
      dateCreated: date,
      name: `Name ${i.toString().padStart(3, "0")}`,
      status: i % 20 === 0 ? Status.Deleted : Status.Active,
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

  const tableClassName = "bg-danger";
  const tableStyle: CSSProperties = { color: "blue" };

  test("renders static correctly", () => {
    const { container } = render(
      <DataTableStatic<DataInterface>
        keyField="id"
        tableTitle="Static Table"
        columns={columns}
        data={dataDynamic}
        tableClassName={tableClassName}
        tableStyle={tableStyle}
      />,
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
        possiblePageItemCounts={[10, 15, 20, 25, 50, 100, 200]}
        predefinedItemsPerPage={20}
        tableClassName={tableClassName}
        tableStyle={tableStyle}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test("External event triggers table reload", async () => {
    const reloadButtonName = "Reload";
    const pageSize = 25;
    const filter: DataFilter = {};

    const mockQueryFn = jest.fn((filter, limit, page, orderBy, sortDirection) => fakeQuery(filter, limit, page, orderBy, sortDirection));
    const checkQueryArguments = (
      filter: DataFilter,
      limit: number,
      page: number,
      orderBy: keyof DataInterface,
      sortDirection: ListSortDirection,
    ) => {
      const latestCall = mockQueryFn.mock.calls.length - 1;

      expect(mockQueryFn.mock.calls[latestCall][0]).toMatchObject(filter);
      expect(mockQueryFn.mock.calls[latestCall][1]).toBe(limit);
      expect(mockQueryFn.mock.calls[latestCall][2]).toBe(page);
      expect(mockQueryFn.mock.calls[latestCall][3]).toBe(orderBy);
      expect(mockQueryFn.mock.calls[latestCall][4]).toBe(sortDirection);
    };

    const client = {
      query: (
        filter: DataFilter,
        limit?: number,
        page?: number,
        orderBy?: string,
        sortDirection?: ListSortDirection,
      ): Promise<TableQueryResult<DataInterface>> =>
        new Promise<TableQueryResult<DataInterface>>((resolve) => resolve(mockQueryFn(filter, limit, page, orderBy, sortDirection))),
    };

    render(
      <DataTableReload
        actions={actions}
        client={client}
        columns={columns}
        data={fakeQuery({}, pageSize)}
        keyField="id"
        reloadButtonName={reloadButtonName}
        predefinedFilter={filter}
      />,
    );

    const cellData = {
      row1Data: dataDynamic[0],
      row26Data: dataDynamic[25],
    };

    const reloadButton = screen.getByRole("button", { name: reloadButtonName });
    const table = screen.getByRole("table");
    const row1NameCell = within(table).getByRole("cell", { name: cellData.row1Data.name });
    const pagingButtons = screen.getByRole("group");
    const page1Button = within(pagingButtons).getByRole("button", { name: "1" });
    const page2Button = within(pagingButtons).getByRole("button", { name: "2" });

    // Check initial render
    expect(reloadButton).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(row1NameCell).toBeInTheDocument();
    expect(pagingButtons).toBeInTheDocument();
    expect(page1Button).toBeInTheDocument();
    expect(page2Button).toBeInTheDocument();

    const reloadTable = async () => {
      await waitFor(() => fireEvent.click(reloadButton));
    };

    // Verify reload is triggered - First page
    await reloadTable();
    expect(mockQueryFn).toBeCalledTimes(1);
    checkQueryArguments({}, pageSize, 1, "name", ListSortDirection.Ascending);

    // Change to second page
    await waitFor(() => fireEvent.click(page2Button));
    expect(row1NameCell).not.toBeInTheDocument();
    expect(mockQueryFn).toBeCalledTimes(2);
    checkQueryArguments({}, pageSize, 2, "name", ListSortDirection.Ascending);
    expect(page1Button).toBeInTheDocument();
    expect(page2Button).toBeInTheDocument();

    // Second page tests
    const row26NameCell = screen.getByRole("cell", { name: cellData.row26Data.name });
    expect(row26NameCell).toBeInTheDocument();
    await reloadTable();
    expect(mockQueryFn).toBeCalledTimes(3);
    checkQueryArguments({}, pageSize, 2, "name", ListSortDirection.Ascending);

    // Get filter inputs
    const filterTextInputs: HTMLInputElement[] = await screen.findAllByRole("textbox");
    const [filterNameInput] = filterTextInputs;

    // Change filters
    const newFilterValues: DataFilter = { name: cellData.row26Data.name };
    await waitFor(() => {
      fireEvent.change(filterNameInput, { target: { value: newFilterValues.name } });
      fireEvent.keyDown(filterNameInput, { key: "Enter" });
    });
    expect(mockQueryFn).toBeCalledTimes(4);
    checkQueryArguments(newFilterValues, pageSize, 1, "name", ListSortDirection.Ascending);

    // Get table sections
    const tableSections = within(table).getAllByRole("rowgroup");
    const [tableHeader, tableBody] = tableSections;

    // Change sorting field
    const countHeader = within(tableHeader).getByText(columns[1].text);
    const sortByCount = async () =>
      await waitFor(() => {
        fireEvent.click(countHeader); // Sort ascending
      });
    await sortByCount();
    expect(mockQueryFn).toBeCalledTimes(5);
    checkQueryArguments(newFilterValues, pageSize, 1, "count", ListSortDirection.Ascending);

    // Check data rows
    const dataRows = await within(tableBody).findAllByRole("row");
    expect(dataRows).toHaveLength(1);
    expect(row26NameCell).toBeInTheDocument();

    // Change sort direction
    await waitFor(() => {
      fireEvent.click(countHeader); // Sort descending
    });
    expect(mockQueryFn).toBeCalledTimes(6);

    // Verify reload triggers with the same arguments.
    await reloadTable();
    expect(mockQueryFn).toBeCalledTimes(7);
    checkQueryArguments(newFilterValues, pageSize, 1, "count", ListSortDirection.Descending);
  });
});
