import { SpinnerProvider } from '@cookers/providers';
import { FormSpinner } from '@cookers/ui';
import { useParams } from 'react-router-dom';
import { SalesOrderEntryForm } from '../components/sales-order-entry';

export const SalesOrderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <SpinnerProvider>
      <FormSpinner />
      <SalesOrderEntryForm />
    </SpinnerProvider>
  );
}; 