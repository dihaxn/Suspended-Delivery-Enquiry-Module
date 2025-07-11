import { DropDownMenuItem, SalesOrderList, SalesOrderMasterData } from '@cookers/models';
import { configStore } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { Badge } from '@radix-ui/themes';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { colorSelectorByStatusName } from '../utils';

export const getSalesOrderColumns = (masterData: SalesOrderMasterData): ColumnDef<SalesOrderList>[] => [
  {
    accessorKey: 'sOrderNo',
    header: 'Order No',
    size: 110,
    meta: { filterable: true, filterType: 'number', textAlignment: 'right' },
  },
  {
    accessorKey: 'pListNo',
    header: 'A.T.D',
    size: 90, meta: { filterable: true, filterType: 'number', textAlignment: 'right' },
  },
  {
    accessorKey: 'statusName',
    header: 'Status',
    size: 120,
    cell: (val) => {
      return (
        <Badge radius="large" color={colorSelectorByStatusName(val.getValue<string>() ?? '')}>
          {val.getValue<string>()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'custCode',
    header: 'Cust Code',
    size: 150,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      options: masterData.customerList.map((item) => ({
        value: item.value,
        label: item.value,
      })),
    },
  },
  {
    accessorKey: 'catlogCode',
    header: 'Product',
    size: 180,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      options: masterData.catalogList.map((item) => ({
        value: item.catlogCode,
        label: item.catlogCode,
      })),
    },
  },
  {
    accessorKey: 'catlogDesc',
    header: 'Description',
    size: 260,
    meta: { filterable: true },
  },
  {
    accessorKey: 'marketDesc',
    header: 'Market',
    size: 150,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      showSearch: false,
      options: masterData.marketStatusList,
    },
  },
  {
    accessorKey: 'depotName',
    header: 'Depot',
    size: 180,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      showSearch: false,
      options: masterData.depotList,
    },
  },
  {
    accessorKey: 'repCode',
    header: 'BDM Code',
    size: 120,
    meta: { filterable: true },
  },
  {
    accessorKey: 'requiredQty',
    header: 'Qty',
    size: 80,
    meta: { filterable: true, filterType: 'number', textAlignment: 'right' },
  },
  {
    accessorKey: 'dateRequired',
    header: 'Date Required',
    size: 150,
    meta: { filterable: true, filterType: 'date' }
  },
  {
    accessorKey: 'isOneOff',
    header: 'One-Off',
    size: 110,
    cell: ({ getValue }) => (getValue<boolean>() ? 'Yes' : 'No'),
    meta: {
      filterable: true,
      filterType: 'dropdown',
      showSearch: false,
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No ', label: 'No' },
      ],
    }, 
  },
  {
    id: 'action',
    cell: ({ row }) => {
      const navigate = useNavigate();
      const menuItems: DropDownMenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          shortcut: '⌘ E',
          action: () => {
            console.log('Edit', row.original);
            navigate(`/${configStore.appName}/sales-order/${row.original.sOrderNo}`);
          },
          isSeparator: false,
        },
      ];
      return <DropdownMenuList buttonVariant="soft" items={menuItems} />;
    },
    enableSorting: false,
    enableHiding: false,
    size: 35,
  },
];


export const DefaultColumnVisibility: VisibilityState = {
  carrierCode: false,
  conNote: false,
  plistNo: false,
  sorderNo: false,
  custBusArea: false,
  custName: false,
  batchNo: false,
  custOrderNo: false,
  createdByName: false,
  sOrderReason: false,
  slackTime: false,
};