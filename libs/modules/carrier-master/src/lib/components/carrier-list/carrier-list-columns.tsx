import { DropDownMenuItem, CarrierMasterList } from '@cookers/models';
import { configStore } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';


export const CarrierMasterColumns: ColumnDef<CarrierMasterList>[] = [
  {
    accessorKey: 'carrierCode',
    header: 'Carrier Code',
    size: 120,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 380,
  },
  {
    accessorKey: 'depotName',
    header: 'Depot',
    size: 210,
  },
  {
    accessorKey: 'truckTypeName',
    header: 'Truck Type',
    size: 125,
  },
  {
    accessorKey: 'regoNo',
    header: 'Rego No',
    size: 100,
  },
  {
    accessorKey: 'driverName',
    header: 'Driver Name',
    size: 280,
  },
  {
    accessorKey: 'employeeNo',
    header: 'Employee No',
    size: 150,
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    size: 200,
  },
  {
    accessorKey: 'autoSequenceFlag',
    header: 'Auto Runsheet Sequence',
    size: 120,
    cell: (info) => {
      const value = info.getValue<number>();
    return value === 1 ? 'Yes' : 'No';
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
            console.log('Delete', row.original);
            navigate(`/${configStore.appName}/carrier-master/${row.original.carrierCode}`);
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
