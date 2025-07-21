import {  SuspendedDeliveryList } from '@cookers/models';
import { ColumnDef } from '@tanstack/react-table';

export const SuspendedDeliveryColumns: ColumnDef<SuspendedDeliveryList>[] = [
 
  {
    accessorKey: 'customerCode',
    header: 'Customer Code',
    size: 150,
    meta: { filterable: true, filterType: 'number' },

  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    size: 300,
    meta: { filterable: true, filterType: 'name' },

  },
  {
    accessorKey: 'custGroup',
    header: 'Cust Group',
    size: 150,
    },
  {
    accessorKey: 'ETAFresh',
    header: 'ETA for return - Fresh',
    size: 150,
  },
  {
    accessorKey: 'ETAUCO',
    header: 'ETA for return - UCO',
    size: 150,
  },
  {
    accessorKey: 'BDMCode',
    header: 'BDM Code',
    size: 150,
    meta: { filterable: true, filterType: 'number' },

  },
  {
    accessorKey: 'carrierCode',
    header: 'Carrier Code',
    size: 150,
    meta: { filterable: true, filterType: 'number' },

  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    size: 150,
  },
{
    accessorKey: 'phone',
    header: 'Phone',
    size: 150,
  },{
    accessorKey: 'mobile',
    header: 'Mobile',
    size: 150,
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
    size: 150,
  },{
    accessorKey: 'suspensionComments',
    header: 'Suspension Comments',
    size: 300,
  },
   {
    id: 'action',
    enableSorting: false,
    enableHiding: false,
    size: 35,
  },
];
