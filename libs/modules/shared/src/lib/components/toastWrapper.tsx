import * as Toast from '@radix-ui/react-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from  '@cookers/ui';
import { ToastWrapperProps } from '@cookers/models';

export const ToastWrapper = ({ open, setOpen, toastState, actionUrl, actionLabel }: ToastWrapperProps) => {
  const navigate = useNavigate();
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={toastState.type === 'error' ? 'ToastRoot !border-red-600' : 'ToastRoot'}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className={toastState.type === 'error' ? 'ToastTitle !text-red-600' : 'ToastTitle'}>
          {toastState.title}
        </Toast.Title>

        {toastState.message && (
          <Toast.Description className="ToastDescription">
            {toastState.message}
          </Toast.Description>
        )}

        {actionUrl && !toastState.hideButton && (
          <Toast.Action className="ToastAction" asChild altText={actionLabel || 'Go'}>
            <Button
              size="1"
              color="indigo"
              radius="full"
              variant="outline"
              onClick={() => navigate(actionUrl)}
            >
              {actionLabel || 'Go'}
            </Button>
          </Toast.Action>
        )}
      </Toast.Root>

      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};
