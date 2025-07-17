import { DataType, SuspendedDeliveryList as SuspendedDelivery } from '@cookers/models';
import { DataTable } from '@cookers/modules/shared';
import { configStore, setQuickview, setSuspendedDeliveryLoading } from '@cookers/store';
import { Grid } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SuspendedDeliveryColumns } from './suspended-delivery-list-column';

const dataType: DataType = 'SuspendedDelivery'; // or another value that matches your use case
export const SuspendedDeliveryList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRowClick = (selectObj: SuspendedDelivery) => {
   dispatch(setQuickview(selectObj));
  };

//need to add double click form

  return (
    <Grid width="100%" height="100%">
      <DataTable<SuspendedDelivery> columns={SuspendedDeliveryColumns} dataType={dataType} onRowClick={onRowClick} onRowDoubleClick={onRowClick} />
    </Grid>
  );
};

export default SuspendedDeliveryList;