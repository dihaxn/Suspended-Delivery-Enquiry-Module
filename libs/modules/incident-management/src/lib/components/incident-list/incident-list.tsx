import { DataType, IncidentsList } from '@cookers/models';
import { DataTable } from '@cookers/modules/shared';
import { Grid } from '@cookers/ui';
import { IncidentColumns } from './incident-list-column';
import { useNavigate } from 'react-router-dom';
import { configStore, setSelectedIncident } from '@cookers/store';
import { useDispatch } from 'react-redux';

const dataType: DataType = 'Incident';
export const IncidentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onRowClick = (selectObj: IncidentsList) => {
    dispatch(setSelectedIncident(selectObj));
  };

  const onRowDoubleClick = (selectObj: IncidentsList) => {
    navigate(`/${configStore.appName}/incident-management/${selectObj.incidentId}`);
  };

  return (
    <Grid width="100%" height="100%">
      <DataTable<IncidentsList> columns={IncidentColumns} dataType={dataType} onRowClick={onRowClick} onRowDoubleClick={onRowDoubleClick} />
    </Grid>
  );
};
