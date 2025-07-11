import React from 'react';
import { Flex, Heading } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';
import { Badge, Button } from '@radix-ui/themes';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigationBlock } from '@cookers/modules/common';
import { configStore } from '@cookers/store';
import { useNavigate, useParams } from 'react-router-dom';
import { invoiceStatusColorSelectorByStatusName, invoiceStatusLabelSelectorByStatusName } from '../../util';

export const InvoiceEntryHeader: React.FC = () => {
  const navigate = useNavigate();
  const { formState } = useFormContext();
  const { handleNavigation, setBlocked } = useNavigationBlock();
  const { id } = useParams<{ id?: string }>();

  const OpenRedirect = () => {
    if (formState.isDirty) {
      setBlocked(true);
      handleNavigation(`/${configStore.appName}/invoices`);
    } else {
      navigate(`/${configStore.appName}/invoices`);
    }
  };

  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem' }}>
      <Button type="button" size="3" color="gray" variant="ghost" onClick={OpenRedirect} highContrast>
        <ArrowLeftIcon width="18" height="18" /> Back
      </Button>
      <Flex align="center" gap="2">
        <Heading size="2">
          {id && <span className="mx-2 ">
            <span className="opacity-85 font-thin">Log No: </span> <Badge variant="soft">{id}</Badge>
          </span>}
          {id && <span className="text-lg opacity-65 font-extralight">|</span>}
          <span className="mx-2">
            <span className="opacity-85 font-thin">Status: </span>
            <Badge color={invoiceStatusColorSelectorByStatusName('N')} variant="soft">
              {invoiceStatusLabelSelectorByStatusName('N')}
            </Badge>
          </span>
        </Heading>
      </Flex>
    </Flex>
  );
};

export default InvoiceEntryHeader;
