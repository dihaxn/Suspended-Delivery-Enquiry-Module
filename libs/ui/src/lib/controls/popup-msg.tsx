import { AlertDialog, Button, Flex } from '@radix-ui/themes';

interface PopupMsgProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item?: T;
  dialogTitle: string;
  dialogDescription: string | React.ReactNode;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  showCancelButton?: boolean;
  onConfirm: (item?: T) => void;
  maxWidth?: string;
  color?: string;
}

export const PopupMessageBox = <T,>({ isOpen, onOpenChange, item, dialogTitle, dialogDescription, confirmButtonLabel = 'OK', cancelButtonLabel = 'Cancel', showCancelButton = false, onConfirm, maxWidth = '450px', color = 'blue' }: PopupMsgProps<T>) => {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {/* Wrap trigger node */}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{dialogTitle}</AlertDialog.Title>
        <AlertDialog.Description>{dialogDescription}</AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Action>
            <div>
              <Button
                variant="solid"
                onClick={() => {
                  onConfirm(item); // Pass the item to the onConfirm callback
                  onOpenChange(false); // Close dialog after confirm
                }}
              >
                {confirmButtonLabel}
              </Button>
              {showCancelButton && (
                <Button
                  variant="soft"
                  color='gray'
                  style={{ marginLeft: '8px' }}
                  onClick={() => {
                    onOpenChange(false); // Close dialog after confirm
                  }}
                >
                  {cancelButtonLabel}
                </Button>
              )}
            </div>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
