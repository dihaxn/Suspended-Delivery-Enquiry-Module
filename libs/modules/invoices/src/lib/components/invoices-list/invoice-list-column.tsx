import { DropDownMenuItem, EmailType, InvoiceListItem, InvoiceMasterData } from '@cookers/models';
import { configStore, setIsOpenEmailPopup } from '@cookers/store';
import { DropdownMenuList } from '@cookers/ui';
import { Badge } from '@radix-ui/themes';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Mail } from 'lucide-react';
import { invoiceStatusColorSelectorByStatusName, invoiceStatusLabelSelectorByStatusName } from '../../util';
import { useDispatch } from 'react-redux';

export const InvoiceListColumns = (masterData: InvoiceMasterData): ColumnDef<InvoiceListItem>[] => [
  {
    accessorKey: 'ivceNo',
    header: 'Ref #',
    size: 80,
    meta: { filterable: true, filterType: 'number' },
  },
  {
    accessorKey: 'custCode',
    header: 'Cust Code',
    size: 120,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      allowCustomValue: true,
      options: masterData.customerList.map((customer) => ({
        value: customer.custCode,
        label: customer.custCode + ' - ' + customer.name,
      })),
      popOverWidth: '450px',
    },
  },
  {
    accessorKey: 'custName',
    header: 'Customer Name',
    size: 300,
    meta: {
      // filterable: true,
      // filterType: 'dropdown',
      // allowCustomValue: true,
      // options: masterData.customerList.map((customer) => ({
      //   value: customer.name,
      //   label: customer.name,
      // })),
    },
  },
  {
    accessorKey: 'dateShippedOn',
    header: 'Shipped',
    size: 180,
    meta: { filterable: true, filterType: 'date' },
  },
  {
    accessorKey: 'catlogCode',
    header: 'Product',
    size: 160,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      allowCustomValue: true,
      options: masterData.catalogList.map((product) => ({
        value: product.catlogCode,
        label: product.displayName,
      })),
      popOverWidth: '350px',
    },
  },
  {
    accessorKey: 'marketDesc',
    header: 'Market',
    size: 150,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      showSearch: false,
      options: [
        { value: 'Industrial', label: 'Industrial' },
        { value: 'FoodService', label: 'FoodService' },
      ],
    },
  },
  {
    accessorKey: 'depotCode',
    header: 'Depot',
    size: 100,
    meta: {
      filterable: true,
      textAlignment: '',
      filterType: 'dropdown',
      allowCustomValue: true,
      options: masterData.depotList.map((item) => ({
        value: item.value,
        label: item.label,
      })),
      popOverWidth: '200px',
    },
  },
  {
    accessorKey: 'repCode',
    header: 'BDM Code',
    size: 100,
    meta: {
      filterable: true,
      textAlignment: '',
      filterType: 'dropdown',
      allowCustomValue: true,
      options: masterData.repList.map((item) => ({
        value: item.repCode,
        label: item.repCode + ' - ' + item.name,
      })),
      popOverWidth: '250px',
    },
  },
  {
    accessorKey: 'despQty',
    header: 'Desp Qty',
    size: 100,
    meta: { filterable: true, filterType: 'number', textAlignment: 'right', className: '' },
  },
  {
    accessorKey: 'tonnes',
    header: 'Litres',
    size: 100,
    meta: { filterable: true, filterType: 'number', textAlignment: 'right' },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    size: 100,
    meta: { filterable: true, filterType: 'number', textAlignment: 'right' },
  },
  {
    accessorKey: 'netAmount',
    header: 'Net Amount',
    size: 130,
    meta: { filterable: true, filterType: 'number', textAlignment: 'right' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 140,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      showSearch: false,
      options: masterData.statusList,
      textAlignment: 'center',
    },
    cell: (val) => {
      return (
        <Badge radius="large" className="min-w-[80px] justify-center" color={invoiceStatusColorSelectorByStatusName(val.getValue<string>() ?? '')}>
          {invoiceStatusLabelSelectorByStatusName(val.getValue<string>())}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'carrierCode',
    header: 'Carrier',
    size: 140,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      allowCustomValue: true,
      options: masterData.carrierList.map((carrier) => ({
        value: carrier.value,
        label: carrier.label,
      })),
    },
  },
  {
    accessorKey: 'delTime',
    header: 'Delivered Date & Time',
    size: 200,
  },
  {
    accessorKey: 'slackTime',
    header: 'Slack (mins)',
    size: 150,
    meta: { filterType: 'number', textAlignment: 'right' },
  },
  {
    accessorKey: 'conNote',
    header: 'Invoice No',
    size: 100,
    meta: { filterable: true },
  },
  {
    accessorKey: 'batchNo',
    header: 'Batch No',
    size: 100,
    meta: { filterable: true },
  },
  {
    accessorKey: 'custBusArea',
    header: 'Area',
    size: 100,
    meta: { filterable: true },
  },
  {
    accessorKey: 'plistNo',
    header: 'A.T.D',
    size: 100,
    meta: { filterable: true },
  },
  {
    accessorKey: 'custOrderNo',
    header: 'Customer Order No',
    size: 200,
    meta: { filterable: true },
  },
  {
    accessorKey: 'sorderNo',
    header: 'Order No',
    size: 100,
    meta: { filterable: true },
  },
  {
    accessorKey: 'createdByName',
    header: 'BDM Name',
    size: 200,
    meta: {
      filterable: true,
      filterType: 'dropdown',
      allowCustomValue: true,
      options: masterData.repList.map((item) => ({
        value: item.name,
        label: item.repCode + ' - ' + item.name,
      })),
      popOverWidth: '300px',
    },
  },
  {
    accessorKey: 'sigReason',
    header: 'Reason',
    size: 100,
    meta: { filterable: true },
  },
  {
    id: 'action',
    cell: ({ row }) => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const menuItems: DropDownMenuItem[] = [
        {
          id: 'view',
          label: 'View Invoice',
          shortcut: '',
          action: () => {
            navigate(`/${configStore.appName}/invoices/${row.original.ivceNo}`);
          },
          isSeparator: true,
        },
        {
          id: 'kovis',
          label: 'Kovis',
          btnIcon: <ClipboardCheck size={16} />,
          action: () => {
            window.open(masterData.kovisUrl + row.original.ivceNo + masterData.kovisUrlEndParam, '_blank');
          },
          isSeparator: false,
        },
        row.original?.invoiceType === 'A'
          ? {
              id: 'email-non-signed-invoice',
              label: 'Email 1-Off Invoice',
              shortcut: '',
              btnIcon: <Mail size={16} />,
              action: () => {
                dispatch(setIsOpenEmailPopup({ emailType: EmailType.OneOff, isOpen: true }));
                console.log('Email 1-Off Invoice');
              },
              isSeparator: false,
              disabled: row.original.status === 'C',
            }
          : {
              id: 'email-non-signed-invoice',
              label: 'Email Non-Signed Invoice',
              shortcut: '',
              btnIcon: <Mail size={16} />,
              action: () => {
                dispatch(setIsOpenEmailPopup({ emailType: EmailType.NonSigned, isOpen: true }));
                console.log('Email Non Signed Invoice');
              },
              isSeparator: false,
              disabled: row.original.status !== 'T',
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
  plistNo: false,
  sorderNo: false,
  custBusArea: false,
  custName: false,
  batchNo: false,
  custOrderNo: false,
  createdByName: false,
  sigReason: false,
  carrierCode: true,
  conNote: true,
};
