import { Button, Flex, Grid, Heading, ModuleBaseLayout, PopOverControl, SectionBaseLayout } from '@cookers/ui';
import { configStore, STORE, useStoreSelector, resetSelectedSalesOrder } from '@cookers/store';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { Filter, SalesOrderList } from '../components';
import SalesOrderQuickView from '../components/sales-order-quick-view/sales-order-quick-view';
import { useState } from 'react';
import { IconButton } from '@radix-ui/themes';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { FileBarChart } from 'lucide-react';
import { downloadSalesOrderCSV } from '../queries/download-sales-order-csv-query';
import { convertBase64ToBlob } from '@cookers/utils';
import { setSelectedSalesOrder } from '@cookers/store';
import { useDispatch } from 'react-redux';
import { DataTable } from '@cookers/modules/shared';
import { DataType } from '@cookers/models';

interface SalesOrderListType {
  sOrderNo: number;
  pListNo: number;
  custCode: string;
  customerName: string;
  orderDate: string;
  orderedBy: string;
  orderType: string;
  dateRequired: string;
  dateDispatched: string;
  custOrderNo: string;
  assigneeNo: number;
  carrierCode: string;
  status: string;
  isOneOff: boolean;
  market: string;
  marketDesc: string;
  depotName: string;
  repCode: string;
  repName: string;
  orderQty: number;
  overallCount: number;
  catlogCode: string;
  catlogDesc: string;
  reason: string;
  specialInst: string;
  uomOrder: string;
  price: number;
  netAmount: number;
  payPeriodCode: number;
}

const dataType: DataType = 'SalesOrder';

export const SalesOrderPage: React.FC = () => {
  const { selectedSalesOrderId, masterData, filter } = useStoreSelector(STORE.SalesOrder);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateNewSalesOrder = () => {
    navigate(`new`);
    dispatch(resetSelectedSalesOrder());
  };

  const handleCSVDownload = async () => {
    const salesOrderListDocData = await downloadSalesOrderCSV(filter);

    if (salesOrderListDocData) {
      const base64DocumentFile = salesOrderListDocData.documentFile;
      const mimeType = salesOrderListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      window.open(objURL);
    }
  };

  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };

  const onRowClick = (selectObj: SalesOrderListType) => {
    dispatch(setSelectedSalesOrder(selectObj));
  };

  const onRowDoubleClick = (selectObj: SalesOrderListType) => {
    navigate(`/${configStore.appName}/sales-order/${selectObj.sOrderNo}`);
  };


  const header = (
     <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Order Enquiry</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
        <Button className="cursor-pointer" radius="full" variant="solid" onClick={handleCreateNewSalesOrder}>
          <FileIcon />
          Create New Sales Order
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={handleCSVDownload}>
              <PinBottomIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Download CSV</TooltipContent>
        </Tooltip>
      </Flex>
    </Flex>
  );

  const main = (
    <SectionBaseLayout
      header={header}
      main={<SalesOrderList /> }
    />
  );

  return <ModuleBaseLayout aside={<Filter />} main={main} article={<SalesOrderQuickView />} />;
};