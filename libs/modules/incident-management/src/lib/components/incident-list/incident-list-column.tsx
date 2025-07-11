import { DropDownMenuItem, IncidentsList } from '@cookers/models';
import { configStore } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { truncateTimeFromDateString } from '@cookers/utils';
import { Badge } from '@radix-ui/themes';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { colorSelectorByStatusName } from '../../util/incidentManagementUtils';
type BadgeColor = 'blue' | 'orange' | 'red' | 'green' | 'violet' | 'gray';
const badgeConfig: Record<string, { color: BadgeColor; label: string }> = {
  INCI: { color: 'blue', label: 'Incident' },
  ACCI: { color: 'orange', label: 'Accident' },
  INJU: { color: 'red', label: 'Injury' },
  NOTI: { color: 'green', label: 'Notification' },
  NEMI: { color: 'violet', label: 'Near Miss' },
  UNKNOWN: { color: 'gray', label: 'Unknown' },
};

type BadgeKeys = keyof typeof badgeConfig;
export const IncidentColumns: ColumnDef<IncidentsList>[] = [
  {
    accessorKey: 'refCode',
    header: 'Report #',
    size: 80,
  },
  {
    accessorKey: 'reportType',
    header: 'Type',
    cell: (val) => {
      const value = val.getValue<string>() as BadgeKeys;
      const badge = badgeConfig[value] || badgeConfig.UNKNOWN;
      return (
        <Badge color={badge.color} variant='soft'>
          {badge.label}
        </Badge>
      );
    },
    size: 90,

  },
  {
    accessorKey: 'createdDate',
    header: 'Date',
    cell: (info) => {
      const value = info.getValue<Date>().toLocaleString();
      return truncateTimeFromDateString(value.toLocaleString() ?? '');
    },
    size: 100,
  },
  {
    accessorKey: 'createdByName',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'statusName',
    header: 'Status',
    cell: (val) => {
      const value = val.getValue<string>() ?? '';
      return (
        <Badge variant='soft' color={colorSelectorByStatusName(value)}>
          {value}
        </Badge>
      );
    },
    size: 250,
  },
  {
    accessorKey: 'depotName',
    header: 'Depot',
    size: 150,
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'empName',
    header: 'Employee',
  },
  {
    accessorKey: 'eventSupervisor',
    header: 'Supervisor',
  },
  {
    accessorKey: 'closedDate',
    header: 'Closed Date',
    cell: (info) => {
      const value = info.getValue<Date>(); // Retrieve the value as a Date object
      return truncateTimeFromDateString(value.toLocaleString() ?? ''); // Format date or show "N/A" if value is undefined
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
            navigate(`/${configStore.appName}/incident-management/${row.original.incidentId}`);
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
