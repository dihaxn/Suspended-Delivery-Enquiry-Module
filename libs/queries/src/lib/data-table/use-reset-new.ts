import { useDispatch } from 'react-redux';
import { DataType } from '@cookers/models';
import { useStoreSelector, STORE, clearIncidentRefreshFlag } from '@cookers/store';

export const useNewRefetchFlag = (dataType: DataType): boolean => {
  const dispatch = useDispatch();
  let isNew = false;
  switch (dataType) {
    case 'Incident':
      const { isIncidentRefreshed } = useStoreSelector(STORE.IncidentManagement);

      isNew = isIncidentRefreshed;

      break;
    // Add cases for other data types if needed
    default:
      break;
  }

  return isNew;
};
