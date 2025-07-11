import { useDispatch } from 'react-redux';
import { DataType } from '@cookers/models';
import { useStoreSelector, STORE, clearIncidentRefreshFlag } from '@cookers/store';

export const useClearNewFlag = (dataType: DataType) => {
  const dispatch = useDispatch();

  const clearFlag = () => {
    switch (dataType) {
      case 'Incident':
        dispatch(clearIncidentRefreshFlag(false));
        break;

      // Add more cases for other data types if needed
      default:
        console.warn(`No clear action defined for data type: ${dataType}`);
        break;
    }
  };

  return clearFlag;
};
