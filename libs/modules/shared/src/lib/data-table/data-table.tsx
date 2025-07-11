/**
 * DataTable component for displaying tabular data with advanced features such as:
 * - Virtualized rows for efficient rendering of large datasets
 * - Column sorting, filtering, and visibility toggling
 * - Row selection with optional selection column
 * - Sticky column pinning for left/right columns
 * - Infinite scrolling with server-side data fetching
 * - Customizable column filters with debounced input
 * - Integration with TanStack Table and Virtual libraries
 * - Customizable row click and double-click handlers
 *
 * @template T - The type of data for each row in the table.
 *
 * @param columns - Array of column definitions for the table.
 * @param dataType - The type of data being displayed (used for fetching).
 * @param onRowClick - Callback invoked when a row is clicked.
 * @param onRowDoubleClick - Callback invoked when a row is double-clicked.
 * @param leftColumnPin - Optional column ID to pin on the left.
 * @param onRowSelect - Optional callback invoked when row selection changes.
 * @param defaultColumnVisibility - Optional default visibility state for columns.
 * @param addColumnFilter - Optional callback to add a column filter (for server-side filtering).
 * @param columnFilterList - Optional list of current column filters (for controlled filtering).
 *
 * @returns The rendered DataTable component.
 */
//3 TanStack Libraries!!!
import { Column, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, OnChangeFn, SortingState, useReactTable, VisibilityState, ColumnFiltersState, getFilteredRowModel } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { DropdownMenu, Flex, Spinner, Text, Checkbox, Select } from '@radix-ui/themes';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import { DataType, FilterItem } from '@cookers/models';
import { useDataTableData } from '@cookers/queries';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import './data-table.css';
import { DataTableScrollContainer } from './lib/data-table-scroll-container';
import type { Table, Row, RowSelectionState, Header } from '@tanstack/react-table';
import { ListRestart, SlidersHorizontal } from 'lucide-react';
import { CustomDatePicker, DatepickerField, TextField, InputAutoCompleteVirtualized } from '@cookers/ui';
import { LoadingOverlay } from '../components';

export function DataTable<T>({
  columns,
  dataType,
  onRowClick,
  onRowDoubleClick,
  leftColumnPin,
  onRowSelect,
  defaultColumnVisibility,
  addColumnFilter,
  columnFilterList,
  onColumnVisibilityChange,
}: Readonly<{
  readonly columns: ColumnDef<T>[];
  dataType: DataType;
  onRowClick: (selectObj: T) => void;
  onRowDoubleClick: (selectObj: T) => void;
  leftColumnPin?: string;
  onRowSelect?: (selectObj: T[]) => void;
  defaultColumnVisibility?: VisibilityState;
  addColumnFilter?: (item: FilterItem) => void;
  columnFilterList?: FilterItem[];
  onColumnVisibilityChange?: (newVisibility: VisibilityState) => void;
}>): JSX.Element {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility || {});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { fetchNextPage, isFetching, isLoading, flatData, totalDBRowCount, totalFetched } = useDataTableData<T, unknown>(sorting, dataType);

  // Debug: Log isFetching state (remove this later)
  useEffect(() => {
    console.log('DataTable isFetching:', isFetching);
  }, [isFetching]);

  const onChangeRowSelection: OnChangeFn<RowSelectionState> = (updater) => {
    let selectedRows: T[] = [];
    if (typeof updater === 'function') {
      const newSelection = updater(rowSelection);
      selectedRows = flatData.filter((_, idx) => newSelection[idx]);
      if (onRowSelect) onRowSelect(selectedRows);
    } else {
      selectedRows = flatData.filter((_, idx) => updater[idx]);
      if (onRowSelect) onRowSelect(selectedRows);
    }
    setRowSelection(updater);
  };

  //scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };
  // Selection Checkbox Header Component
  function SelectionHeaderCheckbox<T>({ table }: { table: Table<T> }) {
    const ref = useRef<HTMLButtonElement>(null);
    const checked = !!table.getIsAllRowsSelected();
    const indeterminate = !!table.getIsSomeRowsSelected() && !checked;
    useEffect(() => {
      if (ref.current) {
        // @ts-expect-error: Radix Checkbox uses button under the hood
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    return <Checkbox className="mt-0.5" ref={ref} checked={checked} onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)} aria-label="Select all rows" />;
  }

  // Selection Checkbox Cell Component
  function SelectionCellCheckbox<T>({ row }: { row: Row<T> }) {
    const ref = useRef<HTMLButtonElement>(null);
    const checked = !!row.getIsSelected();
    const indeterminate = !!row.getIsSomeSelected() && !checked;
    useEffect(() => {
      if (ref.current) {
        // @ts-expect-error: Radix Checkbox uses button under the hood
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    return <Checkbox ref={ref} className="mt-0.5" checked={checked} onCheckedChange={(checked) => row.toggleSelected(!!checked)} aria-label="Select row" onClick={(e) => e.stopPropagation()} />;
  }

  // Add selection column to the columns array
  const selectionColumn: ColumnDef<T> = {
    id: 'select',
    header: ({ table }) => <SelectionHeaderCheckbox table={table} />,
    cell: ({ row }) => <SelectionCellCheckbox row={row} />,
    size: 36,
    enableSorting: false,
    enableHiding: false,
    meta: { pin: 'left' },
  };

  // Local state for filter input values
  const [filterInputValues, setFilterInputValues] = useState<Record<string, string>>({});

  // Debounce logic for column filter
  const filterTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const handleColumnFilter = (header: Header<T, unknown>, value: string) => {
    const columnId = header.column.id;
    // Update local input value immediately
    setFilterInputValues((prev) => ({ ...prev, [columnId]: value }));

    // Clear previous timeout for this column
    if (filterTimeouts.current[columnId]) {
      clearTimeout(filterTimeouts.current[columnId]);
    }

    filterTimeouts.current[columnId] = setTimeout(() => {
      if (addColumnFilter) {
        addColumnFilter({ id: columnId, label: header.column.columnDef.header as string, value: value.trim() });
      } else {
        header.column.setFilterValue(value.trim());
      }
    }, 500);
  };

  // Sync local filter input values with columnFilterList when it changes
  useEffect(() => {
    if (columnFilterList) {
      setFilterInputValues(
        columnFilterList.reduce((acc, f) => {
          acc[f.id] = f.value ?? '';
          return acc;
        }, {} as Record<string, string>)
      );
    }
  }, [columnFilterList]);

  // State for column visibility changes in dropdown
  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<VisibilityState>(columnVisibility);

  // Sync pendingColumnVisibility with columnVisibility when dropdown is opened or visibility changes externally
  useEffect(() => {
    setPendingColumnVisibility(columnVisibility);
  }, [columnVisibility]);

  const table = useReactTable({
    data: flatData,
    columns: onRowSelect ? [selectionColumn, ...columns] : columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
    },
    initialState: {
      columnPinning: {
        left: leftColumnPin ? ['select', 'refCode', 'settingId', leftColumnPin] : ['select', 'refCode', 'settingId'],
        right: ['action'],
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // <-- Add this line for client-side filtering
    manualSorting: false,
    debugTable: true,
    enableRowSelection: true,
    onRowSelectionChange: onChangeRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement: typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1 ? (element) => element?.getBoundingClientRect().height : undefined,
    overscan: 5,
  });

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const dataTableScrollContainerProps = {
    flatData,
    totalDBRowCount,
    totalFetched,
    isFetching,
    fetchNextPage,
  };

  // if (isLoading && isFetching) {
  //   return (
  //     <Flex gap="4" mt="6" justify="center" align="start">
  //       <Spinner /> <Text size="1">Fetching data from server... </Text>
  //     </Flex>
  //   );
  // }

  // Show "no data found" message when there's no data and not loading
  if (!isLoading && !isFetching && flatData.length === 0) {
    return (
      <Flex gap="4" justify="center" align="center" direction="column">
        <Text size="3" weight="medium" color="gray">
          No data found
        </Text>
        <Text size="1" color="gray">
          There are no records, Try adjusting your filters to see more results.
        </Text>
      </Flex>
    );
  }

  return (
    <div>
      {/* Blurred overlay when fetching more data */}
      {isFetching && <LoadingOverlay isVisible={isFetching} message="Loading..." />}
      <DataTableScrollContainer ref={tableContainerRef} {...dataTableScrollContainerProps}>
        <table className="data-table" style={{ display: 'grid' }}>
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} data-textid={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
                {headerGroup.headers.map((header) => {
                  const metaColumnData = header.column?.columnDef.meta as any;
                  return (
                    <th
                      key={header.id}
                      style={{
                        display: 'flex',
                        width: header.getSize(),
                        ...getCommonPinningStyles(header.column),
                      }}
                    >
                      {header.id === 'action' ? (
                        <Flex>
                          <Tooltip>
                            <DropdownMenu.Root modal={false}>
                              <DropdownMenu.Trigger>
                                <TooltipTrigger asChild>
                                  <SlidersHorizontal className="rounded-sm p-0.5 hover:text-[#3358D4] hover:bg-[#D5EFFF]" />
                                </TooltipTrigger>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Group>
                                <DropdownMenu.Content size="1">
                                  <Flex direction="row" align="center" justify="between" className="p-2">
                                    <h1 className="font-semibold mr-4">Filter Columns</h1>
                                    <ListRestart
                                      className="p-0.5 hover:text-red-600 cursor-pointer"
                                      onClick={() => {
                                        setColumnVisibility(defaultColumnVisibility || {});
                                        if (onColumnVisibilityChange) {
                                          onColumnVisibilityChange(defaultColumnVisibility || {});
                                        }
                                      }}
                                    />
                                  </Flex>
                                  {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                      return (
                                        <DropdownMenu.CheckboxItem
                                          key={column.id}
                                          data-textid={column.id}
                                          className="capitalize"
                                          checked={pendingColumnVisibility[column.id] !== false}
                                          onCheckedChange={(value: boolean) => {
                                            setPendingColumnVisibility((prev) => ({ ...prev, [column.id]: !!value }));
                                          }}
                                          // Prevent dropdown from closing
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          {column.columnDef.header?.toString()}
                                        </DropdownMenu.CheckboxItem>
                                      );
                                    })}
                                  <div>
                                    <DropdownMenu.Item
                                      className="p-3 bg-primary m-2 text-white cursor-pointer rounded-md"
                                      onClick={() => {
                                        setColumnVisibility(pendingColumnVisibility);
                                        if (onColumnVisibilityChange) {
                                          onColumnVisibilityChange(pendingColumnVisibility);
                                        }
                                      }}
                                    >
                                      <span className="w-full text-center font-semibold">Refresh Table</span>
                                    </DropdownMenu.Item>
                                  </div>
                                </DropdownMenu.Content>
                              </DropdownMenu.Group>
                            </DropdownMenu.Root>
                            <TooltipContent align="start" alignOffset={10} sideOffset={8}>
                              Filter Columns
                            </TooltipContent>
                          </Tooltip>
                        </Flex>
                      ) : (
                        <Flex align={'start'} direction={'column'} className="w-full ">
                          <Flex
                            align={'center'}
                            {...{
                              className: header.column.getCanSort() ? 'cursor-pointer select-none ml-1' : 'ml-1',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <TriangleUpIcon />,
                              desc: <TriangleDownIcon />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </Flex>
                          {header.id !== 'select' && metaColumnData?.filterable && (
                            <Flex className="w-full">
                              {metaColumnData.filterType === 'date' ? (
                                <CustomDatePicker value={filterInputValues[header.id] ?? ''} placeholder="Filter..." onChange={(date) => handleColumnFilter(header, date ? (typeof date === 'string' ? date : date.toISOString().slice(0, 10)) : '')} />
                              ) : // <TextField className="w-full" name={`filter-${header.id}`} value={filterInputValues[header.id] ?? ''} type="date" onChange={(e) => handleColumnFilter(header, e.target.value)} placeholder="Filter..." />
                              metaColumnData.filterType === 'number' ? (
                                <TextField className="w-full" name={`filter-${header.id}`} value={filterInputValues[header.id] ?? ''} type="number" onChange={(e) => handleColumnFilter(header, e.target.value)} placeholder="Filter..." />
                              ) : metaColumnData.filterType === 'dropdown' ? (
                                <InputAutoCompleteVirtualized
                                  options={metaColumnData.options || []}
                                  value={filterInputValues[header.id] ?? ''}
                                  onChange={(value) => handleColumnFilter(header, typeof value === 'string' ? value : typeof value === 'object' && value.value ? value.value.toString() : '')}
                                  searchPlaceholder="Filter..."
                                  popOverWidth={metaColumnData.popOverWidth || undefined}
                                  height="200px"
                                  name={`filter-${header.id}`}
                                  allowCustomValue={metaColumnData.allowCustomValue || false}
                                  showSearch={metaColumnData.showSearch ?? true}
                                />
                              ) : (
                                <TextField className="w-full" name={`filter-${header.id}`} value={filterInputValues[header.id] ?? ''} type="text" onChange={(e) => handleColumnFilter(header, e.target.value.toUpperCase())} placeholder="Filter..." />
                              )}
                            </Flex>
                          )}
                        </Flex>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: 'relative', //needed for absolute positioning of rows
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  onClick={() => {
                    setSelectedRowIndex(virtualRow.index);
                  }}
                  key={row.id}
                  data-textid={row.id}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    // alignItems: 'center',
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: '100%',
                    //backgroundColor: selectedRowIndex === virtualRow.index ? '#f4f7f9' : 'transparent',
                  }}
                  className={row.getIsSelected() || selectedRowIndex === virtualRow.index ? 'selected' : ''}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        data-textid={cell.id}
                        className={(() => {
                          const metaColumnData = cell.column?.columnDef.meta as any;
                          const columnName = cell.column.columnDef.id as string;
                          const alignment = metaColumnData?.textAlignment;
                          const customClassName = metaColumnData?.className || '';
                          if (alignment === 'center') return ` ${customClassName}  justify-center`;
                          if (alignment === 'right') return ` ${customClassName} !pr-4 justify-end`;
                          if (columnName === 'select' || columnName === 'action') return customClassName + ' justify-center';
                          return customClassName + (!!addColumnFilter && !!columnFilterList ? '!pl-4' : '');
                        })()}
                        style={{
                          display: 'flex',
                          width: cell.column.getSize(),
                          ...getCommonPinningStyles(cell.column),
                        }}
                        onClick={() => {
                          if (cell.id !== 'select') {
                            onRowClick(row.original);
                          }
                        }}
                        onDoubleClick={(e) => {
                          if (cell.id !== 'select') {
                            onRowDoubleClick(row.original);
                          }
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
      </DataTableScrollContainer>
      <div className="data-table-footer">
        <Flex gap="6">
          <Text size="1">
            ({flatData.length} of {totalDBRowCount} data fetched)
          </Text>
        </Flex>
      </div>
    </div>
  );
}

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = <T,>(column: Column<T>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn ? '-2px 0 2px -2px #708aa4 inset' : isFirstRightPinnedColumn ? '2px 0 2px -2px #708aa4 inset' : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    backgroundColor: isPinned ? '#ffffff' : 'transparent',
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};
