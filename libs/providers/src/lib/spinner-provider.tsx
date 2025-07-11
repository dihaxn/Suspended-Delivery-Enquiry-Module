import React, { createContext, useContext, useState } from "react";

interface SpinnerContextType {
  isSpinnerLoading: boolean;
  setIsSpinnerLoading: (loading: boolean) => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSpinnerLoading, setIsLoading] = useState(false);

  const setIsSpinnerLoading = (loading: boolean) => setIsLoading(loading);

  return (
    <SpinnerContext.Provider value={{ isSpinnerLoading, setIsSpinnerLoading }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error("useSpinner must be used within a SpinnerProvider");
  }
  return context;
};
