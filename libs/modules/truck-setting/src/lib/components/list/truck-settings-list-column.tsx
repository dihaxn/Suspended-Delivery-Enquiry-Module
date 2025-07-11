import { DropDownMenuItem, TruckSettingList } from '@cookers/models';
import { configStore } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const TruckSettingsColumns: ColumnDef<TruckSettingList>[] = [
  {
    accessorKey: 'settingId',
    header: 'Setting Id',
    size: 90,
  },
  {
    accessorKey: 'carrierCode',
    header: 'Carrier Code',
    size: 150,
  },
  {
    accessorKey: 'version',
    header: 'Version',
    size: 110,
  },
  {
    accessorKey: 'truckTypeName',
    header: 'Truck Type',
    size: 150,
  },
  {
    accessorKey: 'totaliserType',
    header: 'Totaliser Type',
    size: 160,
  },
  {
    accessorKey: 'totaliser1',
    header: 'Totaliser 1',
    size: 180,
  },
  {
    accessorKey: 'totaliser2',
    header: 'Totaliser 2',
    size: 180,
  },
  {
    accessorKey: 'packagedOilCode',
    header: 'Packaged Oil Code',
    size: 200,
  },
  {
    accessorKey: 'oliveoilPrice',
    header: 'Packaged Oil Price',
    size: 180,
    cell: (info) => Number(info.getValue()).toFixed(2),
  },
  {
    accessorKey: 'depotName',
    header: 'Depot',
    size: 200,
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
            console.log('Delete', row.original);
            navigate(`/${configStore.appName}/truck-settings/${row.original.settingId}`);
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
