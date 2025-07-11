import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DataTable } from '@cookers/modules/shared';
import { Grid } from '@cookers/ui';
import { CustomerFeedbackListInterface, DataType } from '@cookers/models';
import { CustomerFeedbackColumns } from './customer-feedback-list-column';
import { configStore, setSelectedCustomerFeedback } from '@cookers/store';

const dataType: DataType = 'CustomerFeedback';
export const CustomerFeedbackList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRowClick = (selectObj: CustomerFeedbackListInterface) => {
    dispatch(setSelectedCustomerFeedback(selectObj));
  };

  const onRowDoubleClick = (selectObj: any) => {
    navigate(`/${configStore.appName}/customer-feedback/${selectObj.complaintId}`);
  };

  return (
    <Grid width="100%" height="100%">
      <DataTable<CustomerFeedbackListInterface>
        columns={CustomerFeedbackColumns}
        dataType={dataType}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
      />
    </Grid>
  );
};

export default CustomerFeedbackList;
