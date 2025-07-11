// import React from 'react';
// import { ModuleBaseLayout } from '@cookers/ui';
import InvoiceEnquiryFilters from '../components/invoice-filters/invoice-enquiry-filters';
import InvoiceEnquiryQuickView from '../components/invoice-quick-view/invoice-enquiry-quick-view';

// export const InvoiceEnquiryPage: React.FC = () => {
//   return <ModuleBaseLayout aside={<InvoiceEnquiryFilters />} main={<>Main Section</>} article={<InvoiceEnquiryQuickView />} />;
// };

// export default InvoiceEnquiryPage;

import { Button, Flex, Heading, ModuleBaseLayout, SectionBaseLayout, PopOverControl } from '@cookers/ui';
import { configStore, resetSelectedCustomerFeedback, setIsOpenEmailPopup, STORE, useStoreSelector } from '@cookers/store';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CustomerFeedbackAnalysisFormData } from '@cookers/models';

import { EllipsisVertical, FileText } from 'lucide-react';
import { useDispatch } from 'react-redux';
import InvoiceList from '../components/invoices-list/invoice-list';
import { InvoiceEnquiryActionsMenu, InvoiceEnquiryEmailPopup, InvoiceVerifyDownloadPopup } from '../components';
import { downloadInvoicesCSV } from '../queries';
import { convertBase64ToBlob } from '@cookers/utils';
import { useToastContext } from '@cookers/modules/shared';

const InvoiceEnquiryContent: React.FC = () => {
  const { masterData, filter, selectedInvoice, isOpenEmailPopup } = useStoreSelector(STORE.Invoice);
  const { showToast } = useToastContext();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const navigate = useNavigate();
  //const analysisReportData = masterData.showAnalysisReport;
  const handlebuttonclick = () => {
    navigate(`/${configStore.appName}/customer-feedback/new`);
  };

  const dispatch = useDispatch();

  const handleCreateNewCustomerFeedback = () => {
    navigate(`new`);
    dispatch(resetSelectedCustomerFeedback(undefined));
  };

  const handleCSVDownload = async () => {
    const invoiceCSVDate = await downloadInvoicesCSV(filter);
    if (invoiceCSVDate) {
      const base64DocumentFile = invoiceCSVDate.documentFile;
      const mimeType = invoiceCSVDate.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      window.open(objURL, '_blank');

      // Show toast notification
      showToast({
        type: 'success',
        title: 'Download Complete',
        message: 'CSV file has been downloaded successfully',
        hideButton : true
      });
    } else {
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Could not download the CSV file',
        hideButton : true
      });
    }
  };

  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };

  const header = (
    <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Invoices</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
        <Button className="cursor-pointer" radius="full" variant="solid" onClick={handleCreateNewCustomerFeedback}>
          <FileIcon />
          Create New Invoice
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={handleCSVDownload}>
              <PinBottomIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Download CSV</TooltipContent>
        </Tooltip>
        {
          <PopOverControl
            buttonLabel={
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={() => setIsOptionsOpen(true)}>
                      <EllipsisVertical size={16} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>Actions Menu</TooltipContent>
                </Tooltip>
              </div>
            }
            width="300px"
            radius="full"
            variant="outline"
            isOpen={isOptionsOpen}
            onOpenChange={setIsOptionsOpen}
            popoverContent={<InvoiceEnquiryActionsMenu />}
          />
        }
      </Flex>
      <InvoiceEnquiryEmailPopup />
    </Flex>
  );
  const main = <SectionBaseLayout header={header} main={<InvoiceList />}></SectionBaseLayout>;

  return (
    <>
      <ModuleBaseLayout aside={<InvoiceEnquiryFilters />} main={main} article={<InvoiceEnquiryQuickView />} />
      <InvoiceEnquiryEmailPopup />
      <InvoiceVerifyDownloadPopup />
    </>
  );
};

export const InvoiceEnquiryPage: React.FC = () => {
  return <InvoiceEnquiryContent />;
};

export default InvoiceEnquiryPage;
