import { DropDownMenuItem, SupplierNCRList } from '@cookers/models';
import { configStore } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { Badge } from '@radix-ui/themes';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { colorSelectorByStatusName } from '../../util/supplierNcrUtils';

export const SupplierNCRColumns: ColumnDef<SupplierNCRList>[] = [
  {
    accessorKey: 'refCode',
    header: 'Log #',
    size: 80,
  },
  {
    accessorKey: 'statusName',
    header: 'Status',
    size: 150,
    cell: (val) => {
      return (
        <Badge radius="large" color={colorSelectorByStatusName(val.getValue<string>() ?? '')}>
          {val.getValue<string>()}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'supplierName',
    header: 'Supplier Name',
    size: 320,
  },
  {
    accessorKey: 'classificationName',
    header: 'Classification',
    size: 150,
  },
  {
    accessorKey: 'createdDate',
    header: 'Raised Date',
    size: 100,
  },
  {
    accessorKey: 'receivedDate',
    header: 'Received Date',
    size: 120,
  },
  {
    accessorKey: 'depotName',
    header: 'Depot',
    size: 150,
  },
  {
    accessorKey: 'suppRespBy',
    header: 'Contact Person',
    size: 150,
  },
  {
    accessorKey: 'productName',
    header: 'Product Name',
    size: 320,
  },
  {
    accessorKey: 'closeOutOn',
    header: 'Date Completed',
    size: 130,
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
            navigate(`/${configStore.appName}/supplier-ncr/${row.original.supplierNcrId}`);
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
