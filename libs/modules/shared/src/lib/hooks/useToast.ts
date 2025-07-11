import { ToastState } from '@cookers/models';
import { useState, useCallback } from 'react';

export function useToast() {
  const [open, setOpen] = useState(false);
  const [toastState, setToastState] = useState<ToastState>({
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = useCallback(({ type = 'success', title, message, hideButton }: ToastState) => {
    setToastState({ type, title, message, hideButton });
    setOpen(true);
  }, []);

  return {
    open,
    setOpen,
    toastState,
    showToast,
  };
}
