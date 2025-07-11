
import React from 'react';
import { AlertDialog, Flex } from '@radix-ui/themes';
import { Button, Box } from '@cookers/ui';

interface NavConfirmationDialogProps {
  isDialogOpen: boolean;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
}

export const NavConfirmationDialog: React.FC<NavConfirmationDialogProps> = ({
  isDialogOpen,
  confirmNavigation,
  cancelNavigation,
}) => {
  return (
   
      <AlertDialog.Root open={isDialogOpen} onOpenChange={(open) => !open && cancelNavigation()}>
        <AlertDialog.Trigger>
          <span style={{ display: 'none' }}></span>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Leave page?</AlertDialog.Title>
          <AlertDialog.Description>You have unsaved changes !!!</AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button onClick={cancelNavigation} variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={confirmNavigation} variant="solid" color="blue">
                Yes
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
  );
};
