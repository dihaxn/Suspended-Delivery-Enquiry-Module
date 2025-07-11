import { Button, Flex, Grid, Heading, ModuleBaseLayout, SectionBaseLayout, PopOverControl } from '@cookers/ui';
import { configStore, resetSelectedCustomerFeedback, setSelectedCustomerFeedback, STORE, useStoreSelector } from '@cookers/store';
import { convertBase64ToBlob } from '@cookers/utils';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { CustomerFeedbackFilters, CustomerFeedbackList, CustomerFeedbackQuickView } from '../components/index';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FileBarChart } from 'lucide-react';
import { CustomerFeedbackAnalysisFormData, CustomerFeedbackFPMUFormData } from '@cookers/models';
import { downloadCustomerFeedbackAnalysisReport } from '../queries/use-feedback-analysis-query';
import { CustomerFeedbackAnalysisReport } from '../components/customer-feedback-analysis/customer-feedback-analysis-report';
import { CustomerFeedbackFPMUReport } from '../components/customer-feedback-analysis/customer-feedback-fpmu-report';
import { downloadCustomerFeedbackCSV } from '../queries';
import { downloadFPMUReport } from '../queries/use-fpmu-report-query';
import { FileText } from 'lucide-react';
import { ChartColumn } from 'lucide-react';
import { useDispatch } from 'react-redux';

export const CustomerFeedbackPage: React.FC = () => {
  const { masterData, filter } = useStoreSelector(STORE.CustomerFeedback);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isFPMUOpen, setFPMUOpen] = useState(false);
  const navigate = useNavigate();
  //const analysisReportData = masterData.showAnalysisReport;
  const handlebuttonclick = () => {
    navigate(`/${configStore.appName}/customer-feedback/new`);
  };

  const dispatch = useDispatch();

  const handleCreateNewCustomerFeedback = () => {
    navigate(`new`);
    dispatch(resetSelectedCustomerFeedback(undefined))
  };

  const handleCSVDownload = async () => {
    const customerFeedbackListDocData = await downloadCustomerFeedbackCSV(filter);

    if (customerFeedbackListDocData) {
      const base64DocumentFile = customerFeedbackListDocData.documentFile;
      const mimeType = customerFeedbackListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      window.open(objURL, '_blank');
    }
  };

  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };

  const showAnalysisReportPopup = async (data: CustomerFeedbackAnalysisFormData) => {
    const customerFeedbackListDocData = await downloadCustomerFeedbackAnalysisReport(data);

    if (customerFeedbackListDocData) {
      const base64DocumentFile = customerFeedbackListDocData.documentFile;
      const mimeType = customerFeedbackListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };

  const showFPMUReportPopup = async (data: CustomerFeedbackFPMUFormData) => {
    const response = await downloadFPMUReport(data);
    if (response) {
      const base64DocumentFile = response.documentFile;
      const mimeType = response.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      window.open(objURL, '_blank');
    }
  };

  const header = (
    <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Customer Feedbacks</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
        <Button className="cursor-pointer" radius="full" variant="solid" onClick={handleCreateNewCustomerFeedback}>
          <FileIcon />
          Create New Feedback
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={handleCSVDownload}>
              <PinBottomIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Download CSV</TooltipContent>
        </Tooltip>

        {masterData.permission.showAnalysisReport && (
          <PopOverControl
            buttonLabel={
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={() => setConfirmOpen(true)}>
                      <FileText size={16} />
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
            popoverContent={<CustomerFeedbackAnalysisReport onPopoverClick={showAnalysisReportPopup} onPopoverClose={() => setConfirmOpen(false)} />}
          />
        )}

        {masterData.permission.showFPMUReport && (
          <PopOverControl
            buttonLabel={
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={() => setFPMUOpen(true)}>
                      <ChartColumn size={16} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>FPMU Report</TooltipContent>
                </Tooltip>
              </div>
            }
            radius="full"
            variant="outline"
            isOpen={isFPMUOpen}
            onOpenChange={setFPMUOpen}
            popoverContent={<CustomerFeedbackFPMUReport onPopoverClick={showFPMUReportPopup} onPopoverClose={() => setFPMUOpen(false)} />}
          />
        )}
      </Flex>
    </Flex>
  );
  const main = <SectionBaseLayout header={header} main={<CustomerFeedbackList />}></SectionBaseLayout>;

  return <ModuleBaseLayout aside={<CustomerFeedbackFilters />} main={main} article={<CustomerFeedbackQuickView />} />;
};

export default CustomerFeedbackPage;
