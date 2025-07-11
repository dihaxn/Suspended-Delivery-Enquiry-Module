
import { DataType, CarrierMasterList } from '@cookers/models';
import { DataTable } from '@cookers/modules/shared';
import { configStore, setSelectedCarrier } from '@cookers/store';
import { Grid } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CarrierMasterColumns } from './carrier-list-columns';

const dataType: DataType = 'CarrierMaster';
export const CarrierList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRowClick = (selectObj: CarrierMasterList) => {
    dispatch(setSelectedCarrier(selectObj));
  };

  const onRowDoubleClick = (selectObj: CarrierMasterList) => {
    navigate(`/${configStore.appName}/carrier-master/${selectObj.carrierCode}`);
  };

  return (
    <Grid width="100%" height="100%">
      <DataTable<CarrierMasterList> columns={CarrierMasterColumns} dataType={dataType} onRowClick={onRowClick} onRowDoubleClick={onRowDoubleClick} />
    </Grid>
  );
};

