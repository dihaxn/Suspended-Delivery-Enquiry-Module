import React from 'react';
import { Flex, FormButton } from '@cookers/ui';

interface InvoiceEntryFooterProps {
  onSave: () => void;
  onPrint: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  isPrinting?: boolean;
}

export const InvoiceEntryFooter: React.FC<InvoiceEntryFooterProps> = ({
  onSave,
  onPrint,
  onCancel,
  isSaving = false,
  isPrinting = false,
}) => {
  return (
    <Flex gap="3" justify="end" align="center" p="4" className="border-t">
      <FormButton
        name="cancel"
        label="Cancel"
        size="2"
        type="button"
        onClick={onCancel}
      />
      <FormButton
        name="save"
        label={isSaving ? 'Saving...' : 'Save'}
        size="2"
        type="button"
        onClick={onSave}
      />
      <FormButton
        name="print"
        label={isPrinting ? 'Printing...' : 'Print'}
        size="2"
        type="button"
        onClick={onPrint}
      />
    </Flex>
  );
};

export default InvoiceEntryFooter;