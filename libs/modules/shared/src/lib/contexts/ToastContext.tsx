import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastWrapper } from '../components/toastWrapper';
import { ToastState } from '@cookers/models';
import { configStore } from '@cookers/store';

interface ToastContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toastState: ToastState;
  showToast: (toastData: ToastState) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  actionUrl?: string;
  actionLabel?: string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  actionUrl = `/${configStore.appName}/invoices`,
  actionLabel = "Go to List" 
}) => {
  const toastValues = useToast();
  
  return (
    <ToastContext.Provider value={toastValues}>
      {children}
      <ToastWrapper 
        open={toastValues.open}
        setOpen={toastValues.setOpen}
        toastState={toastValues.toastState}
        actionUrl={actionUrl}
        actionLabel={actionLabel}
      />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
