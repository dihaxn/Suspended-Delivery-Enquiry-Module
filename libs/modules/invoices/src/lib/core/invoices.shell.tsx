import { Route, Routes } from 'react-router-dom';
import InvoicesLayout from './invoices.layout';
import { InvoiceEnquiryPage, InvoiceEntryPage } from '../pages';
import { ToastProvider } from '@cookers/modules/shared';
import { configStore } from '@cookers/store';

export const InvoicesShell = () => {
  return (
    <ToastProvider actionUrl={`/${configStore.appName}/invoices`} actionLabel="Go to List">
      <Routes>
        <Route element={<InvoicesLayout />}>
          <Route index element={<InvoiceEnquiryPage />} />
          <Route path=":code" element={<InvoiceEntryPage />} />
          <Route path="new" element={<InvoiceEntryPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
};
