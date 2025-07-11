import React, { useState } from 'react';
import { Flex, Button } from '@radix-ui/themes';
import { Download, MailOpen, ChartPie, BarChart3, ClipboardCheck } from 'lucide-react';
import { InvoiceEnquiryEmailPopup } from './invoice-enquiry-email-popup';
import { setIsOpenEmailPopup, setIsOpenVerifyDownloadPopup, setUnverifiedInvoices, STORE, useStoreSelector } from '@cookers/store';
import { useDispatch } from 'react-redux';
import { EmailType } from '@cookers/models';
import { AssetInvoicePrintRequest, printAssetInvoice, useInvoiceEnquiryVerifyDownload } from '../../queries';
import { useToastContext } from '@cookers/modules/shared';

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

export const InvoiceEnquiryActionsMenu: React.FC = () => {
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const { selectedInvoices, filter } = useStoreSelector(STORE.Invoice);
  const { showToast } = useToastContext();
  const dispatch = useDispatch();

  const { refetch: refetchVerifyDownload, isLoading: isLoadingVerifyDownload, data: verifyDownloadData } = useInvoiceEnquiryVerifyDownload(filter);

  const handleVerifyDownload = async () => {
    console.log('handleVerifyDownload', filter);
    try {
      const result = await refetchVerifyDownload();
      if (result.data) {
        dispatch(setIsOpenVerifyDownloadPopup(true));
        dispatch(
          setUnverifiedInvoices({
            message: result.data.verifyMessage ?? 'No invoices to be verified.',
            invoices: result.data.invoiceNoList ?? [],
          })
        );
        console.log('Verify download result:', result.data);
      } else {
        showToast({
          title: 'Verify Invoice Download Error',
          type: 'error',
          message: 'Failed to verify invoice download. Please try again.',
          hideButton: true,
        });
      }
    } catch (error) {
      console.error('Error verify invoice download:', error);
      showToast({
        title: 'Verify Invoice Download Error',
        type: 'error',
        message: 'An error occurred while verifying invoice download.',
        hideButton: true,
      });
    }
  };

  const handlePrintAssetInvoice = async () => {
    console.log('Selected Invoices:', selectedInvoices);
    if (selectedInvoices.length === 0) {
      console.error('No invoices selected for printing.');
      showToast({ title: 'No invoices selected for printing.', type: 'error', message: 'Please select at least one invoice to print.', hideButton: true });
      return;
    } else {
      const allInvoicesAreAssetType = selectedInvoices.every((invoice) => invoice.invoiceType === 'A');
      if (!allInvoicesAreAssetType) {
        //handle error here
        console.error('All selected invoices must be Asset Invoice printing.');
        showToast({ title: 'Invalid Selection', type: 'error', message: 'All selected invoices must be Asset Invoice type.', hideButton: true });
        return;
      } else {
        //execute api call to print asset invoice
        const invoiceIds: AssetInvoicePrintRequest[] = selectedInvoices.map((invoice) => {
          return {
            invoiceNo: invoice.ivceNo,
            isDA: filter.archivedData,
          };
        });
        const printedData = await printAssetInvoice(invoiceIds);
        if (printedData.error) {
          console.error('Error printing asset invoices:', printedData.error);
          showToast({ title: 'Print Error', type: 'error', message: 'Failed to print asset invoices. Please try again later.', hideButton: true });
          return;
        }
        showToast({ title: 'Print Success', type: 'success', message: 'Asset invoices printed successfully.', hideButton: true });
      }
    }
    // Implement the print logic here
  };

  const actionsList: ActionItem[] = [
    // { id: 'email-non-signed', label: 'Email Non-Signed Invoice', icon: <Mail className='mr-2'/>, onClick: () => console.log('Email Non-Signed Invoice clicked') },
    // { id: 'kovis', label: 'Kovis', icon: <ClipboardCheck className="mr-2" />, onClick: () => console.log('Kovis clicked') },
    // { id: 'credits', label: 'Credits', icon: <ChartPie  className='mr-2'/>, onClick: () => console.log('Credits clicked') },
    // { id: 'non-required', label: 'Non Required', icon: <XCircle className='mr-2'/>, onClick: () => console.log('Non Required clicked') },
    { id: 'verify-download', label: 'Verify Invoice Download', icon: <Download className="mr-2" />, onClick: () => void handleVerifyDownload() },
    { id: 'asset-invoice-print', label: 'Asset Invoice Print', icon: <BarChart3 className="mr-2" />, onClick: () => void handlePrintAssetInvoice() },
    { id: 'email-signed', label: 'Email Signed Invoice', icon: <MailOpen className="mr-2" />, onClick: () => dispatch(setIsOpenEmailPopup({ emailType: EmailType.Signed, isOpen: true })), disabled: true },
  ];

  return (
    <div>
      <Flex direction="column" gap="5" p="2" width="100%">
        {actionsList.map((action) => (
          <Button disabled={action.disabled} key={action.id} variant="ghost" size={'3'} style={{ width: '100%', justifyContent: 'flex-start', color: 'black', cursor: 'pointer' }} className="hover:!text-blue-600 disabled:!text-black disabled:opacity-45 disabled:hover:!text-black-600" onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        ))}
      </Flex>
    </div>
  );
};

export default InvoiceEnquiryActionsMenu;
