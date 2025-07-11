import { Route, Routes } from 'react-router-dom';
import SalesOrderLayout from './sales-order.layout';
import { SalesOrderEntryFormPage, SalesOrderPage } from '../pages';

export const SalesOrderShell = () => {
  return (
    <Routes>
      <Route element={<SalesOrderLayout />}>
        <Route index element={<SalesOrderPage />} />
        <Route path=":id" element={<SalesOrderEntryFormPage />} />
        <Route path="new" element={<SalesOrderEntryFormPage />} />
        <Route path="new/:no" element={<SalesOrderEntryFormPage />} />
      </Route>
    </Routes>
  );
};