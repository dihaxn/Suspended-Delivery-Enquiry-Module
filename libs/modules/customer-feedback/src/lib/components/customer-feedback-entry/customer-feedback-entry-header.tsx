import { useNavigationBlock } from '@cookers/modules/common';
import { STORE, configStore, useStoreSelector } from '@cookers/store';
import { Flex } from '@cookers/ui';
import { ArrowLeftIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { Badge, Button, Heading, IconButton } from '@radix-ui/themes';
import { useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { colorSelectorByStatusName } from '../utils';
import { downloadCustomerFeedbackReport } from '../../queries/download-customer-feedback-entry-pdf';
import { convertBase64ToBlob } from '@cookers/utils';
export const CustomerFeedbackEntryHeader: React.FC = () => {
  const navigate = useNavigate();
  const { masterData, customerFeedbackApiData } = useStoreSelector(STORE.CustomerFeedback);
  const { formState } = useFormContext();
  const { id } = useParams<{ id?: string }>(); // Define id as optional string
  const paramId = id ? Number(id) : 0;
  const isNew = paramId === 0;
  const status = customerFeedbackApiData.complaintRequest.status
  const createdDate = customerFeedbackApiData.complaintRequest.createdOnDate;
  const refCode = customerFeedbackApiData.complaintRequest.refCode;
  const statusLabel = masterData.statusList.find((option) => option.value === status)?.label || 'New';
  const { handleNavigation, setBlocked } = useNavigationBlock();

  const OpenRedirect = () => {
    if (formState.isDirty) {
      setBlocked(true)
      handleNavigation(`/${configStore.appName}/customer-feedback`);
    } else {
      navigate(`/${configStore.appName}/customer-feedback`);
    }
  };

  const handleDownloadPDF = async () => {
    const incidentData = await downloadCustomerFeedbackReport(paramId);
    if (incidentData) {
      const base64DocumentFile = incidentData.documentFile;
      const mimeType = incidentData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      window.open(objURL, '_blank');
    }
  };

  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem' }}>
      <Button type="button" size="3" color="gray" variant="ghost" onClick={OpenRedirect} highContrast>
        <ArrowLeftIcon width="18" height="18" /> Back
      </Button>

      <Flex align="center" gap="2">
        <Heading size="2">
          {createdDate && (
            <span className="mx-2">
              <span className="opacity-85 font-thin">Raised Date: </span> {createdDate} 
            </span> 
          )}
          {createdDate && <span className='text-lg opacity-65 font-extralight'>|</span>}
          {refCode && (
            <span className="mx-2 ">
              <span className="opacity-85 font-thin">Log No: </span> <Badge variant="soft">{refCode}</Badge> 
            </span>
          )}
          {refCode && <span className='text-lg opacity-65 font-extralight' >|</span>}
          <span className="mx-2">
            <span className="opacity-85 font-thin">Status: </span>
            <Badge color={colorSelectorByStatusName(statusLabel)} variant="soft">
              {statusLabel}
            </Badge>
          </span>
          {!isNew && <span className='text-lg opacity-65 font-extralight' >|</span>}
        </Heading> 
        {!isNew && (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton variant="soft" color="blue" className="cursor-pointer" radius="full" type="button" onClick={handleDownloadPDF}>
                <PinBottomIcon />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Download PDF</TooltipContent>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  );
};

export default CustomerFeedbackEntryHeader;