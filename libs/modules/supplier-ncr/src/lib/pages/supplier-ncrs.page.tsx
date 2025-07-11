import { Button, Flex, Grid, Heading, ModuleBaseLayout, PopOverControl, SectionBaseLayout } from '@cookers/ui';
import { configStore, STORE, useStoreSelector } from '@cookers/store';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { Filter, SupplierNCRList } from '../components';
import SupplierNcrQuickView from '../components/supplier-ncr-quick-view/supplier-ncr-quick-view';
import { useState } from 'react';
import { IconButton } from '@radix-ui/themes';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { FileBarChart } from 'lucide-react';
import { downloadSupplierNcrCSV } from '../queries/download-csv-query';
import { downloadSupplierNcrAnalysisReport } from '../queries/use-supplier-analysis-query';
import { convertBase64ToBlob } from '@cookers/utils';
import { SupplierNcrAnalysisReport } from '../components/supplier-ncr-analysis/supplier-ncr-analysis-report';
import { SupplierNcrAnalysisFormData } from '@cookers/models';
export function SupplierNCRsPage() {
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
  const showAnalysisReportPopup = async (data: SupplierNcrAnalysisFormData) => {
    console.log(data);
    const supplierNCRListDocData = await downloadSupplierNcrAnalysisReport(data);

    if (supplierNCRListDocData) {
      const base64DocumentFile = supplierNCRListDocData.documentFile;
      const mimeType = supplierNCRListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };
  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };
  const header = (
    <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Supplier NCRs {selectedSupplierNcrId ? selectedSupplierNcrId : ''}</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
        {masterData.showCreateNCR && <Button className="cursor-pointer" radius="full" variant="solid" onClick={handlebuttonclick}>
          <FileIcon />
          Create New Supplier NCR
        </Button>}
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={handleCSVDownload}>
              <PinBottomIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Download CSV</TooltipContent>
        </Tooltip>

        {analysisReportData && (
          <PopOverControl
            buttonLabel={
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      variant="soft"
                      className="cursor-pointer"
                      color="blue"
                      radius="full"
                      type="button"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <FileBarChart size={16} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>Analysis Report</TooltipContent>
                </Tooltip>
              </div>
            }
            radius="full"
            variant="outline"
            isOpen={isConfirmOpen}
            onOpenChange={setConfirmOpen}
            popoverContent={<SupplierNcrAnalysisReport onPopoverClick={showAnalysisReportPopup} onPopoverClose={() => setConfirmOpen(false)} />}
          />
        )}
      </Flex>
    </Flex>
  );

  const main = <SectionBaseLayout header={header} main={<SupplierNCRList />}></SectionBaseLayout>;

  return <ModuleBaseLayout aside={<Filter />} main={main} article={<SupplierNcrQuickView />} />;
}
