import { Button, Flex, Grid, Heading, ModuleBaseLayout, PopOverControl, SectionBaseLayout } from '@cookers/ui';
import { configStore, STORE, useStoreSelector } from '@cookers/store';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { SuspendedDeliveryFilters, SuspendedDeliveryList} from '../components';
import { SuspendedDeliveryQuickView } from '../components';
import { useState } from 'react';
import { IconButton } from '@radix-ui/themes';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { FileBarChart } from 'lucide-react';
//import { downloadSupplierNcrCSV } from '../queries/download-csv-query';
//import { downloadSupplierNcrAnalysisReport } from '../queries/use-supplier-analysis-query';
import { convertBase64ToBlob } from '@cookers/utils';
//import { SupplierNcrAnalysisReport } from '../components/supplier-ncr-analysis/supplier-ncr-analysis-report';
//import { SupplierNcrAnalysisFormData } from '@cookers/models';
export function SuspendedDeliveryPage () {
 
 /*
  const { selectedSupplierNcrId, masterData, filter } = useStoreSelector(STORE.SupplierNcr);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const analysisReportData = masterData.showAnalysisReport;
  const handlebuttonclick = () => {
    navigate(`/${configStore.appName}/supplier-ncr/new`);
  };

  const handleCSVDownload = async () => {
    const supplierNCRListDocData = await downloadSupplierNcrCSV(filter);

    if (supplierNCRListDocData) {
      const base64DocumentFile = supplierNCRListDocData.documentFile;
      const mimeType = supplierNCRListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };
  

  */
  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };
  const header = (
    <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Suspended Delivery</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
    
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" >
              <PinBottomIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Download CSV</TooltipContent>
        </Tooltip> 
      </Flex>
    </Flex>
  );

  const main = <SectionBaseLayout header={header} main={<SuspendedDeliveryList />}></SectionBaseLayout>;

  return <ModuleBaseLayout aside={<SuspendedDeliveryFilters />} main={main} article={<SuspendedDeliveryQuickView  />} />;
}
