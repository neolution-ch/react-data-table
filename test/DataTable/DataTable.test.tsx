/* eslint-disable max-lines */
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks/server";
import "@testing-library/jest-dom";
import React from "react";
import { ReactDataTable, createReactDataTableColumnHelper, useReactDataTable } from "src";

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

  const dataDynamic: DataInterface[] = Array.from(Array(100)).map((_, i) => {
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
  const columnHelper = createReactDataTableColumnHelper<DataInterface>();
  const columns = [
    columnHelper.accessor("name", { header: "NAME", enableSorting: true, enableColumnFilter: true }),
    columnHelper.accessor("count", { header: "COUNT", enableSorting: true, enableColumnFilter: true }),
    columnHelper.accessor("status", {
      header: "STATUS",
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        dropdownFilter: {
          options: [
            { value: "", label: "All" },
            { value: Status.Active, label: "Active" },
            { value: Status.Deleted, label: "Deleted" },
          ],
        },
      },
    }),
    columnHelper.accessor("dateCreated", {
      header: "CREATED",
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        dropdownFilter: {
          options: [
            { value: "", label: "All" },
            { value: Status.Active, label: "Active" },
            { value: Status.Deleted, label: "Deleted" },
          ],
        },
      },
    }),
  ];

  test("renders correctly", () => {
    const {
      result: {
        current: { table },
      },
    } = renderHook(() =>
      useReactDataTable({
        data: dataDynamic,
        isLoading: false,
        columns,
        reactTableOptions: {
          enableSortingRemoval: false,
        },
      }),
    );
    const { container } = render(
      <ReactDataTable table={table} showPaging totalRecords={dataDynamic?.length} isFetching={false} isLoading={false} />,
    );

    expect(container).toMatchSnapshot();
  });

  test("renders without header correctly", () => {
    const {
      result: {
        current: { table },
      },
    } = renderHook(() =>
      useReactDataTable({
        data: dataDynamic,
        isLoading: false,
        columns,
        reactTableOptions: {
          enableSortingRemoval: false,
        },
      }),
    );

    const { container } = render(
      <ReactDataTable table={table} showPaging totalRecords={dataDynamic?.length} isFetching={false} isLoading={false} withoutHeaders />,
    );

    expect(container).toMatchSnapshot();
  });

  test("renders without paging correctly", () => {
    const {
      result: {
        current: { table },
      },
    } = renderHook(() =>
      useReactDataTable({
        data: dataDynamic,
        isLoading: false,
        columns,
        reactTableOptions: {
          enableSortingRemoval: false,
        },
      }),
    );

    const { container } = render(
      <ReactDataTable table={table} showPaging totalRecords={dataDynamic?.length} isFetching={false} isLoading={false} withoutHeaders />,
    );

    expect(container).toMatchSnapshot();
  });
});
