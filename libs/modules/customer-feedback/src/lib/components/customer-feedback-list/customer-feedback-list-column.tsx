import { CustomerFeedbackListInterface, DropDownMenuItem } from '@cookers/models';
import { configStore } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { truncateTimeFromDateString } from '@cookers/utils';
import { Badge } from '@radix-ui/themes';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { colorSelectorByStatusName } from '../utils/customerFeedbackUtils';


export const CustomerFeedbackColumns: ColumnDef<CustomerFeedbackListInterface>[] = [
  {
    accessorKey: 'refCode',
    header: 'Log #',
    size: 80,
  },
  {
    accessorKey: 'statusName',
    header: 'Status',
    cell: (val) => {
      return (
        <Badge radius="large" color={colorSelectorByStatusName(val.getValue<string>() ?? '')}>
          {val.getValue<string>()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    size: 300,
  },
  {
    accessorKey: 'catlogName',
    header: 'Product Name',
    size: 250,
  },
  {
    accessorKey: 'complaintOnDate',
    header: 'Received Date',
  },
  {
    accessorKey: 'createdOnDate',
    header: 'Created Date',
    size: 200,
  },
  {
    accessorKey: 'raisedByName',
    header: 'Person Raised',
  },
  {
    accessorKey: 'feedbackTypeName',
    header: 'Feedback Classification',
    size: 180,
  },
  {
    accessorKey: 'natureDesc',
    header: 'Nature',
  },
  {
    accessorKey: 'depotName',
    header: 'Depot',
  },
  {
    accessorKey: 'completedOnDate',
    header: 'Date Completed',
  },
  {
    id: 'action',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const navigate = useNavigate();
      const menuItems: DropDownMenuItem[] = [
        {
          id: 'edit',
          label: 'Edit',
          shortcut: '⌘ E',
          action: () => {
            navigate(`/${configStore.appName}/customer-feedback/${row.original.complaintId}`);
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
