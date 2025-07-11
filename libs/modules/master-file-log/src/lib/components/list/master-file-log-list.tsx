import { DataType, MasterFileLogList } from '@cookers/models';
import { DataTable } from '@cookers/modules/shared';
import { Grid } from '@cookers/ui';
import { MasterFileLogColumns } from './master-file-log-list-column';
//import { useNavigate } from 'react-router-dom';
//import { useDispatch } from 'react-redux';

const dataType: DataType = 'MasterFileLog';
export const MasterFileLogComponent = () => {
    //const navigate = useNavigate();
    //const dispatch = useDispatch();

    const onRowClick = (selectObj:  MasterFileLogList) => {
    };

    const onRowDoubleClick = (selectObj: MasterFileLogList) => {
    };

    return (
        <Grid width="100%" height="100%">
            <DataTable<MasterFileLogList> columns={MasterFileLogColumns} dataType={dataType} onRowClick={onRowClick} onRowDoubleClick={onRowDoubleClick} leftColumnPin="code" />
        </Grid>
    );
};