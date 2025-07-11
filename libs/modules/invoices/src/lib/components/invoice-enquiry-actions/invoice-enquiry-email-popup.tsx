import React, { useEffect, useState } from 'react';
import { Button, Dialog, FormInput, FormButton, FormTextArea, Flex, Link, Heading } from '@cookers/ui';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { CircleX, CrossIcon, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setIsOpenEmailPopup, STORE, useStoreSelector } from '@cookers/store';
import { emailFormSchema } from '../../schema';
import { EmailType } from '@cookers/models';
import { IconButton } from '@radix-ui/themes';
import { InvoiceEmailRequest, sendInvoiceEmail } from '../../queries';
import { useToastContext } from '@cookers/modules/shared';

interface EmailFormData {
  sendTo: string;
  subject: string;
  message: string;
}

export const InvoiceEnquiryEmailPopup: React.FC = () => {
  const dispatch = useDispatch();
  const { showToast } = useToastContext();
  const { selectedInvoice, selectedInvoices, isOpenEmailPopup, emailType, filter} = useStoreSelector(STORE.Invoice);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: EmailFormData = {
    sendTo: '',
    subject: ``,
    message: '',
  };

  const methods = useForm<EmailFormData>({
    defaultValues,
    resolver: zodResolver(emailFormSchema),
  });

  const handleSend = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const emailRequestData : InvoiceEmailRequest = {
        toAddress: [data.sendTo],
        subject: data.subject,
        emailBody: data.message,
        emailType: selectedInvoice?.invoiceType || '',
        payeeNo: selectedInvoice?.custCode || '',
        originator: '', // Set appropriate originator value
        requestCreatedDateTime: new Date().toISOString(),
        invoiceNo: Number(selectedInvoice?.ivceNo) || 0,
        invoiceType: selectedInvoice?.ivceType || '',
        isDA: filter.archivedData || false,
      }
      // Simulate API call
      await sendInvoiceEmail(emailRequestData)
      showToast({
        title: 'Email sent successfully',
        message: 'Your email has been sent successfully.',
        type: 'success',
        hideButton: true
      });
      dispatch(setIsOpenEmailPopup({ emailType: '', isOpen: false }));
    } catch (error) {
      showToast({
        title: 'Failed to send email',
        message: 'Failed to send email. Please try again later.',
        type: 'error',
        hideButton: true
      });
      console.error('Failed to send email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    methods.reset(defaultValues);
    dispatch(setIsOpenEmailPopup({ emailType: '', isOpen: false }));
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  useEffect(() => {
    const newDefaultValues: EmailFormData = {
      sendTo: selectedInvoice?.custEmail || '',
      subject: emailType !== EmailType.Signed ? `Tax Invoice - Cust Code ${selectedInvoice?.custCode || ''} - Inv ${selectedInvoice?.conNote || selectedInvoice?.ivceNo || ''}` : '',
      message: '',
    };
    methods.reset(newDefaultValues);
  }, [selectedInvoice, methods, emailType]);

  return (
    <Dialog.Root open={isOpenEmailPopup} onOpenChange={handleCloseDialog}>
      <Dialog.Content maxWidth="500px">
        {/* Header with logo and title */}
        {/* <div className="flex items-center justify-between gap-3 mb-4"> */}
        <Flex align="center" justify="between" gap="3" mb="4">
          <Dialog.Title className="flex mb-0">Email</Dialog.Title>
          <Dialog.Close>
            <IconButton variant="soft" className="cursor-pointer" color="amber" radius="full" type="button">
              <X width="18" height="18" />
            </IconButton>
          </Dialog.Close>
        </Flex>
        {/* </div> */}

        <form onSubmit={methods.handleSubmit(handleSend)}>
          <FormProvider {...methods}>
            <Flex direction="column" gap="4" px="4">
              <FormInput label="Send To" name="sendTo" required="Email address is required" type="email" />
              <FormInput label="Subject" name="subject" required="Subject is required" />
              <FormTextArea label="Message" name="message" placeHolder="Enter your message" size="l" />
              <Flex gap="5" align="center" justify="end" flexGrow="1">
                <FormButton label="Send Email" name="send" size="2" type="submit" />
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCloseDialog(false);
                  }}
                  size="3"
                  weight={'medium'}
                >
                  Close
                </Link>
              </Flex>
            </Flex>
          </FormProvider>
          {/* <DevTool control={methods.control} /> */}
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
