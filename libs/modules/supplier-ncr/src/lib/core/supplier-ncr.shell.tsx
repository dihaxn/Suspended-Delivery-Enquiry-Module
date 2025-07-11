import { Route, Routes } from 'react-router-dom';
import { SupplierNCRLayout } from '.';
import { SupplierNcrEntryFormPage, SupplierNCRsPage } from '../pages';

export const SupplierNCRShell = () => {
  return (
    <Routes>
      <Route element={<SupplierNCRLayout />}>
        <Route index element={<SupplierNCRsPage />} />
        <Route path=":id" element={<SupplierNcrEntryFormPage />} />
        <Route path="new" element={<SupplierNcrEntryFormPage />} />
      </Route>
    </Routes>
  );
};
