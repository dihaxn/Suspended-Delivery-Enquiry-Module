import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import styles from '../controls-styles/modal.module.css';
import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
interface FormDialogProps {
  title: string;
  name: string;
  content: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FormDialog: React.FC<FormDialogProps> = ({ title, content, size = 'md', name,isOpen,
  onOpenChange, }) => {
  const sizeClass = styles[`DialogContent_${size}`];
  return (
   
    
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
          <Dialog.Overlay className={styles.DialogOverlay} />
          <Dialog.Content className={`${styles.DialogContent} ${sizeClass}`}>
            <header className={styles.DialogHeader}>
              <Dialog.Title className={styles.DialogTitle}>{title}</Dialog.Title>
              <Dialog.Close asChild>
                <button className={styles.IconButton} aria-label="Close">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </header>
            {content}
            
          </Dialog.Content>
        </Dialog.Root>
     
  );
};
