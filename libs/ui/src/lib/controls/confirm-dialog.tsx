import { AlertDialog, Button, Flex } from '@radix-ui/themes';

interface ConfirmDialogProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item ?: T; 
  dialogTitle: string;
  dialogDescription: string;
  confirmButtonText: string;
  onConfirm: (item?: T) => void;
  maxWidth?: string;
  color?: string;
}

export const ConfirmAlertDialog = <T,>({
  isOpen,
  onOpenChange,
  item,
  dialogTitle,
  dialogDescription,
  confirmButtonText,
  onConfirm,
  maxWidth = '450px',
  color = 'blue',
}: ConfirmDialogProps<T>) => {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {/* Wrap trigger node */}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{dialogTitle}</AlertDialog.Title>
        <AlertDialog.Description>{dialogDescription}</AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="blue"
              onClick={() => {
                onConfirm(item); // Pass the item to the onConfirm callback
                onOpenChange(false); // Close dialog after confirm
              }}
            >
              {confirmButtonText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
