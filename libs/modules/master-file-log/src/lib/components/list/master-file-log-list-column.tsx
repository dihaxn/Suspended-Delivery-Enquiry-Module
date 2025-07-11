import { MasterFileLogList } from '@cookers/models';
import { ColumnDef } from '@tanstack/react-table';

export const MasterFileLogColumns: ColumnDef<MasterFileLogList>[] = [  
  {
    accessorKey: 'code',
    header: 'Code',
    size: 90,
  },
  {
    accessorKey: 'originator',
    header: 'Originator',
    size: 100,
  },
  {
    accessorKey: 'modifiedDate',
    header: 'Date',
    size: 120,
  },
  {
    accessorKey: 'modifiedData',
    header: 'Modified Data',
    size: 120,
  },
  
  {
    accessorKey: 'logMessage',
    header: 'Log Message',
    size: 350,
  },
  
  
];
