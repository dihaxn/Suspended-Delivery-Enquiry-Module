import React from 'react';
import { SpinnerProvider } from '@cookers/providers';
import { FormSpinner } from '@cookers/ui';
import { InvoiceEntryForm } from '../components/invoice-entry';

export const InvoiceEntryPage: React.FC = () => {
  return (
    <SpinnerProvider>
      <FormSpinner />
      <InvoiceEntryForm />
    </SpinnerProvider>
  );
};

export default InvoiceEntryPage;
