import { Route, Routes } from 'react-router-dom';
import { IncidentManagementLayout } from '.';
import { IncidentDetailsPage, IncidentFormPage, IncidentsPage } from '../pages';

export const IncidentManagementShell = () => {
  return (
    <Routes>
      <Route element={<IncidentManagementLayout />}>
        <Route index element={<IncidentsPage />} />
        <Route path=":id" element={<IncidentFormPage />} />
        <Route path="new" element={<IncidentFormPage />} />
      </Route>
    </Routes>
  );
};
