import { useAppStateContext } from '@cookers/providers';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSetPageState = (module: string) => {
  const { setCurrentModule, setCurrentPage } = useAppStateContext();
  const location = useLocation();

  useEffect(() => {
    setCurrentModule(module);

    const pageName = location.pathname.split('/').pop();
    setCurrentPage(pageName ?? module);
  }, [setCurrentModule, setCurrentPage, location.pathname, module]);
};
