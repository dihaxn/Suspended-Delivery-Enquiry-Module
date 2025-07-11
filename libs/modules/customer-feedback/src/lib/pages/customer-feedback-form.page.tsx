import { SpinnerProvider } from '@cookers/providers';
import { FormSpinner } from '@cookers/ui';
import { useParams } from 'react-router-dom';
import { CustomerFeedbackEntryForm } from '../components/customer-feedback-entry';

export const CustomerFeedbackForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <SpinnerProvider>
      <FormSpinner />
      <CustomerFeedbackEntryForm />
    </SpinnerProvider>
  );
};

export default CustomerFeedbackForm;
