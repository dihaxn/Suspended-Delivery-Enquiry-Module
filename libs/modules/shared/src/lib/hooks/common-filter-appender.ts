import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';

export const useCommonFilterAppender = (filterAction: (payload: any) => (dispatch: Dispatch) => void, filter: any) => {
  //const dispatch = useDispatch();
  const [originator] = useState<string | undefined>(getUserFromLocalStorage()?.originator || '');
  const [proxyUser] = useState<string | undefined>(getProxyUserFromLocalStorage()?.userName || '');

  useEffect(() => {
    if (originator !== filter.originator) {
      // dispatch<any>(filterAction({ ...filter, originator }));
      filterAction({ ...filter, originator });
    }
  }, [originator, filter, filterAction]);

  useEffect(() => {
    if (proxyUser !== filter.proxyUser) {
      // dispatch<any>(filterAction({ ...filter, proxyUser }));
      filterAction({ ...filter, proxyUser });
    }
  }, [proxyUser, filter, filterAction]);

  return {
    originator,
    proxyUser,
  };
};
