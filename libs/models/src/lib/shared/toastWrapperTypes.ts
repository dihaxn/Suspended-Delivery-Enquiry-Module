export type ToastType = 'success' | 'error';

export interface ToastState {
  type: ToastType;
  title: string;
  message?: string;
  hideButton?: boolean;
}

export interface ToastWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  toastState: ToastState;
  actionUrl?: string; // optional: navigate on button click
  actionLabel?: string;
}
