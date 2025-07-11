import { Route, Routes } from 'react-router-dom';
import CustomerFeedbackLayout from './customer-feedback.layout';
import { CustomerFeedbackForm, CustomerFeedbackPage } from '../pages';

export const CustomerFeedbackShell = () => {
  return (
    <Routes>
      <Route element={<CustomerFeedbackLayout />}>
        <Route index element={<CustomerFeedbackPage />} />
        <Route path=":id" element={<CustomerFeedbackForm />} />
        <Route path="new" element={<CustomerFeedbackForm />} />
      </Route>
    </Routes>
  );
};

export default CustomerFeedbackShell;
