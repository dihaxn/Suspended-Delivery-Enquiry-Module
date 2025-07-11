import React, { useState } from 'react';
import { useNavigationBlock } from '@cookers/modules/common';
import { Flex, Button, Heading, Badge, IconButton } from '@radix-ui/themes';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { configStore } from '@cookers/store';
import { FileIcon } from 'lucide-react';
import { MasterFileLogPopup } from '@cookers/master-file-log';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { colorSelectorByStatusName } from '../utils';

// Utility function to select badge color by status name

export const SalesOrderEntryHeader: React.FC = () => {
  const navigate = useNavigate();
  const { formState, watch } = useFormContext();
  const { handleNavigation, setBlocked } = useNavigationBlock();
  const orderType = watch('orderDetails.orderTypeVal');
  const orderNo = watch('orderDetails.orderNo');
  const customerCode = watch('orderDetails.customerCode');
  const orderTypeCode = watch('orderDetails.orderType');

  // Define the variables for MasterFileLogPopup
  const masterFileLogCode = orderNo || '';
  const masterFileLogMasterFile = orderTypeCode === 'STAN' ? 'Standing Order' : 'Sales Order';
  const statusLabel = watch('orderDetails.status');
  const isNew = orderNo === 0;
  
  const masterFileLogDisplayName = customerCode?.label || '';

  const OpenRedirect = () => {
    if (formState.isDirty) {
      setBlocked(true);
      handleNavigation(`/${configStore.appName}/sales-order`);
    } else {
      navigate(`/${configStore.appName}/sales-order`);
    }
  };

  const [isMasterLogPopupOpen, setIsMasterLogPopupOpen] = useState(false);

  // Handle address popup close
  const handleMasterLogPopupClose = () => {
    setIsMasterLogPopupOpen(false);
  };

  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem' }}>
      <Button type="button" size="3" color="gray" variant="ghost" onClick={OpenRedirect} highContrast>
        <ArrowLeftIcon width="18" height="18" /> Back
      </Button>

      <MasterFileLogPopup key={`${masterFileLogCode}`} isOpen={isMasterLogPopupOpen} onClose={handleMasterLogPopupClose} code={masterFileLogCode} masterFile={masterFileLogMasterFile} displayName={masterFileLogDisplayName} />

      <Flex align="center" gap="2">
        <Heading size="2">
          {orderNo && (
            <span className="mx-2 ">
              <span className="opacity-85 font-thin">Order No: </span> <Badge variant="soft">{orderNo}</Badge>
            </span>
          )}
          {orderNo && <span className="text-lg opacity-65 font-extralight">|</span>}
          <span className="mx-2">
            <span className="opacity-85 font-thin">Status: </span>
            <Badge color={colorSelectorByStatusName(statusLabel)} variant="soft">
              {statusLabel}
            </Badge>
          </span>
          {!isNew && <span className="text-lg opacity-65 font-extralight">|</span>}
          {orderType && (
            <span className="mx-2 ">
              <span className="opacity-85 font-thin">Order Type: </span> <Badge variant="soft">{orderType}</Badge>
            </span>
          )}
          {orderType && <span className="text-lg opacity-65 font-extralight">|</span>}
        </Heading>
        {!isNew && (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton variant="soft" color="blue" className="cursor-pointer" radius="full" type="button" onClick={() => setIsMasterLogPopupOpen(true)}>
                <FileIcon size={22} />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Download PDF</TooltipContent>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  );
};

export default SalesOrderEntryHeader;
