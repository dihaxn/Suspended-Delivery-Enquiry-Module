import { DataType, SupplierNCRList as SupplierNcr } from '@cookers/models';
import { DataTable } from '@cookers/modules/shared';
import { configStore, setSelectedSupplierNcr } from '@cookers/store';
import { Grid } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SuspendedDeliveryColumns } from './suspended-delivery-list-column';

const dataType: DataType = 'SupplierNcr';
export const SuspendedDeliveryList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRowClick = (selectObj: SupplierNcr) => {
    dispatch(setSelectedSupplierNcr(selectObj));
  };

  const onRowDoubleClick = (selectObj: SupplierNcr) => {
    navigate(`/${configStore.appName}/supplier-ncr/${selectObj.supplierNcrId}`);
  };

  return (
    <Grid width="100%" height="100%">
      <DataTable<SupplierNcr> columns={SuspendedDeliveryColumns} dataType={dataType} onRowClick={onRowClick} onRowDoubleClick={onRowDoubleClick} />
    </Grid>
  );
};

export default SuspendedDeliveryList;