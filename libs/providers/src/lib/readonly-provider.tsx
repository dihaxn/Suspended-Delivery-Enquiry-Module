import { ReadOnlyProps } from '@cookers/models';
import { FC, createContext, useContext, useMemo } from 'react';

interface ReadOnlyContextType {
  readOnly: boolean;
  setReadOnly?: (readOnly: boolean) => void;
  section?: string;
}

export const ReadOnlyContext = createContext({} as ReadOnlyContextType);
export const useReadOnlyContext = () => useContext(ReadOnlyContext);

export const ReadOnlyProvider: FC<ReadOnlyProps> = ({
  readOnly,
  setReadOnly,
  children,
}) => {
  const contextValue = useMemo(
    () => ({ readOnly, setReadOnly }),
    [readOnly, setReadOnly]
  );

  return (
    <ReadOnlyContext.Provider value={contextValue}>
      {children}
    </ReadOnlyContext.Provider>
  );
};
