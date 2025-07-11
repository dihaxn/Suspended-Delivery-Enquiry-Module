import { DataType, TruckSettingList } from '@cookers/models';
import { DataTable } from '@cookers/modules/shared';
import { Grid } from '@cookers/ui';
import { TruckSettingsColumns } from './truck-settings-list-column';
import { useNavigate } from 'react-router-dom';
import { configStore, setSelectedTruckSetting, setSelectedTruckSettingId } from '@cookers/store';
import { useDispatch } from 'react-redux';

const dataType: DataType = 'TruckSettings';
export const TruckSettingsList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onRowClick = (selectObj: TruckSettingList) => {
        dispatch(setSelectedTruckSetting(selectObj));
    };

    const onRowDoubleClick = (selectObj: TruckSettingList) => {
        //navigate(`/${configStore.appName}/truck-settings/${selectObj.settingId}`);
        navigate(`/${configStore.appName}/truck-settings/${selectObj.settingId}`);
    };

    return (
        <Grid width="100%" height="100%">
            <DataTable<TruckSettingList> columns={TruckSettingsColumns} dataType={dataType} onRowClick={onRowClick} onRowDoubleClick={onRowDoubleClick} />
        </Grid>
    );
};