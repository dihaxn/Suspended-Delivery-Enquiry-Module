import { useDispatch } from 'react-redux';
import { DataType } from '@cookers/models';
import { useStoreSelector ,STORE,clearNewIncidentFlag} from '@cookers/store';


export const useDispatchRefetchFlag = (dataType: DataType): boolean => {
  const dispatch = useDispatch();
  let isNew=false;
  const resetRefetchFlag = () => {
    switch (dataType) {
      case 'Incident':
        const { isNewIncident } = useStoreSelector(STORE.IncidentManagement) ;
        isNew=isNewIncident
        dispatch(clearNewIncidentFlag(false));
        break;
      // Add cases for other data types if needed
      default:
        break;
    }
  };

  return isNew;
};

