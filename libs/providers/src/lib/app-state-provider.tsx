import { ChildrenProp } from '@cookers/models';
import { FC, createContext, useContext, useMemo, useState } from 'react';

interface AppStateContextType {
  AppName: string;
  currentPage: string;
  setCurrentPage: (currentPage: string) => void;
  currentModule: string;
  setCurrentModule: (currentModule: string) => void;
}

export const AppStateContext = createContext({} as AppStateContextType);
export const useAppStateContext = () => useContext(AppStateContext);

export const AppStateProvider: FC<ChildrenProp> = ({ children }) => {
  const AppName = 'Cookers App';

  const [currentPage, setCurrentPage] = useState('Home');
  const [currentModule, setCurrentModule] = useState('Home');

  const contextValue = useMemo(
    () => ({ AppName, currentPage, currentModule, setCurrentPage, setCurrentModule }),
    [AppName, currentPage, currentModule, setCurrentModule, setCurrentPage]
  );

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};
