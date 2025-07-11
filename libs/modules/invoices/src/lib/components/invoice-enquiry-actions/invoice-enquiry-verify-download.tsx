import React from 'react';
import { Button, Dialog, Flex, Link, Text } from '@cookers/ui';
import { X, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setIsOpenVerifyDownloadPopup, setUnverifiedInvoices, STORE, useStoreSelector } from '@cookers/store';
import { IconButton } from '@radix-ui/themes';

interface InvoiceVerifyDownloadPopupProps {
  missingInvoices?: string[];
}

export const InvoiceVerifyDownloadPopup: React.FC<InvoiceVerifyDownloadPopupProps> = ({ missingInvoices = [] }) => {
  const dispatch = useDispatch();
  const { isOpenVerifyDownloadPopup, unverifiedInvoices } = useStoreSelector(STORE.Invoice);

  const handleClose = () => {
    dispatch(setIsOpenVerifyDownloadPopup(false));
    dispatch(setUnverifiedInvoices({ message: '', invoices: [] }));
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  // Parse the invoice numbers from the provided string or use the prop
  const defaultInvoices = ['9104310P', 'OS2', 'OS1', 'SKTEST14', '9104305B', 'SKTEST23', 'SKTEST16', 'SKTEST22', 'SKTEST8', 'SKTEST7', 'SKTEST6', 'SKTEST5', '2019830', '3534661', '9104290B', '476879', '4365478'];

  const invoiceList = missingInvoices.length > 0 ? missingInvoices : unverifiedInvoices.invoices;

  return (
    <Dialog.Root open={isOpenVerifyDownloadPopup} onOpenChange={handleCloseDialog}>
      <Dialog.Content maxWidth="600px">
        {/* Header with icon and title */}
        <Flex align="center" justify="between" gap="3" mb="4">
          <Flex align="center" gap="3">
            <AlertTriangle className="text-orange-500" size={24} />
            <Dialog.Title className="flex mb-0">Missing Signed Documents</Dialog.Title>
          </Flex>
          <Dialog.Close>
            <IconButton variant="soft" className="cursor-pointer" color="amber" radius="full" type="button">
              <X width="18" height="18" />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <Flex direction="column" gap="4" px="4">
          {/* Warning Message */}
          <Text size="3" className="text-gray-700 leading-relaxed">
            {unverifiedInvoices.message || 'No invoices to be verified.'}
          </Text>

          {/* Invoice List */}
          {unverifiedInvoices.invoices.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {unverifiedInvoices.invoices.map((invoice) => (
                  <div key={invoice} className="bg-white border border-gray-300 rounded px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors">
                    {invoice}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {unverifiedInvoices.invoices.length > 0 && (
            <Text size="2" className="text-gray-600 italic">
              Total invoices missing signed documents: <span className="font-semibold">{unverifiedInvoices.invoices.length}</span>
            </Text>
          )}
          {/* Action Buttons */}
          <Flex gap="3" align="center" justify="end" mt="4">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
              size="3"
              weight={'medium'}
            >
              Close
            </Link>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
