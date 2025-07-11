import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, OnChangeFn, Row, SortingState, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { GridColumn } from '@cookers/models';
import { DropdownMenuCell } from '@cookers/ui';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import CheckboxCell from './checkbox-cell';

interface GridTableProps {
  isFetchingNextPage: boolean;
  data:
    | InfiniteData<
        {
          data: any[];
          currentPage: number;
          nextPage: number | null;
          count: number;
        },
        unknown
      >
    | undefined;
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<
        {
          data: any[];
          currentPage: number;
          nextPage: number | null;
        },
        unknown
      >,
      Error
    >
  >;

  columnsData: GridColumn[];
  sorting1?: SortingState;
  setSorting1?: React.Dispatch<React.SetStateAction<SortingState>>;
  checkboxOn: boolean;
  menuOn: boolean;
}

export const GridTable = memo((props: GridTableProps) => {
  console.log(props.data);

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({ triggerOnce: false });

  useEffect(() => {
    if (inView) {
      props.fetchNextPage();
    }
  }, [props.fetchNextPage, inView]);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  let newColumnsData: GridColumn[] = [];

  if (props.checkboxOn) {
    newColumnsData = [
      {
        id: 'select',
        header: ({ table }) => (
          <CheckboxCell
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <CheckboxCell
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        size: 25,
        accessorKey: 'select',
      },
    ];
    newColumnsData = newColumnsData.concat(props.columnsData);
  } else {
    newColumnsData = props.columnsData;
  }

  if (props.menuOn) {
    newColumnsData = newColumnsData.concat({
      accessorKey: 'Status',
      header: 'Status',
      cell: DropdownMenuCell,
    });
  }

  const columns = React.useMemo<ColumnDef<any>[]>(() => newColumnsData, []);

  const flatData = React.useMemo(() => props.data?.pages?.flatMap((page) => page.data) ?? [], [props.data]);
  const flatCount = React.useMemo(() => props.data?.pages?.flatMap((page) => page.count) ?? [], [props.data]);
  const totalDBRowCount = flatCount[0];
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (scrollHeight - scrollTop - clientHeight < 500 && !props.isFetchingNextPage && totalFetched < totalDBRowCount) {
          props.fetchNextPage();
        }
      }
    },
    [props.fetchNextPage, props.isFetchingNextPage, totalFetched, totalDBRowCount]
  );
  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting: sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
    debugTable: true,
  });

  //scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (table.getRowModel().rows.length) {
      table.getRowModel().rows.sort();
      rowVirtualizer.scrollToIndex?.(0);
      //props.fetchNextPage();
    }
  };

  //since this table option is derived from table row model state, we're using the table.setOptions utility
  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // const paddingTop = virtualRows?.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  // const paddingBottom = virtualRows?.length > 0 ? totalSize - (virtualRows?.at(-1)?.end || 0) : 0;

  return (
    <div
      className="container"
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      ref={tableContainerRef}
      style={{
        backgroundColor: 'pink',
        overflow: 'auto',
        height: '100%',
      }}
    >
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    {...{
                      className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            position: 'relative', //needed for absolute positioning of rows
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<any>;
            return (
              <tr
                data-index={virtualRow.index} //needed for dynamic row height measurement
                ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                key={row.id}
                style={{
                  display: 'table-row',
                  position: 'absolute',
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  width: '100%',
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        display: 'flex',
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>{props.isFetchingNextPage && 'Loading...'}</div>
    </div>
  );
});
