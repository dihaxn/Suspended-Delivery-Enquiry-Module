import { DropDownMenuItem, SupplierNCRList } from '@cookers/models';
import { configStore } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { Badge } from '@radix-ui/themes';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
//import { colorSelectorByStatusName } from '../../util/supplierNcrUtils';

export const SuspendedDeliveryColumns: ColumnDef<SupplierNCRList>[] = [
  {
    accessorKey: 'refCode',
    header: 'Log #',
    size: 80,
  },
  {
    accessorKey: 'supplierName',
    header: 'Customer Code',
    size: 150,
    meta: { filterable: true, filterType: 'number' },

  },
  {
    accessorKey: 'classificationName',
    header: 'Customer Name',
    size: 300,
    meta: { filterable: true, filterType: 'name' },

  },
  {
    accessorKey: 'createdDate',
    header: 'Cust Group',
    size: 150,
  },
  {
    accessorKey: 'receivedDate',
    header: 'ETA for return - Fresh',
    size: 150,
  },
  {
    accessorKey: 'depotName',
    header: 'ETA for return - UCO',
    size: 150,
  },
  {
    accessorKey: 'suppRespBy',
    header: 'BDM Code',
    size: 150,
    meta: { filterable: true, filterType: 'number' },

  },
  {
    accessorKey: 'productName',
    header: 'Carrier Code',
    size: 150,
    meta: { filterable: true, filterType: 'number' },

  },
  {
    accessorKey: 'closeOutOn',
    header: 'Contact',
    size: 150,
  },
{
    accessorKey: 'closeOutOn',
    header: 'Phone',
    size: 150,
  },{
    accessorKey: 'closeOutOn',
    header: 'Mobile',
    size: 150,
  },
  {
    accessorKey: 'closeOutOn',
    header: 'Email Address',
    size: 150,
  },{
    accessorKey: 'closeOutOn',
    header: 'Suspension Comments',
    size: 300,
  },
   {
    id: 'action',
    cell: ({ row }) => {
      const navigate = useNavigate();
      const menuItems: DropDownMenuItem[] = [
        
      ];
      return <DropdownMenuList buttonVariant="soft" items={menuItems} />;
    },
    enableSorting: false,
    enableHiding: false,
    size: 35,
  },
];
