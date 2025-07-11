import { useNavigationBlock } from '@cookers/modules/common';
import { RootState, configStore } from '@cookers/store';
import { Flex } from '@cookers/ui';
import { ArrowLeftIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { Badge, Button, Heading, IconButton } from '@radix-ui/themes';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { colorSelectorByStatusName } from '../../util/supplierNcrUtils';
import { downloadSupplierNcrReport } from '../../queries/use-supplier-ncr-pdf';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { convertBase64ToBlob } from '@cookers/utils';
export const SupplierNcrFormHeader = () => {
  const navigate = useNavigate();
  const { masterData } = useSelector((state: RootState) => state.supplierNcr);
  const { formState, control } = useFormContext();
  const { id } = useParams<{ id?: string }>(); // Define id as optional string
  const paramId = id ? Number(id) : 0;
  const isNew = paramId === 0;
  const status = useWatch({ control: control, name: 'supplierNcrRequest.status' });
  const createdDate = useWatch({ control: control, name: 'supplierNcrRequest.createdDate' });
  const refCode = useWatch({ control: control, name: 'supplierNcrRequest.refCode' });
  console.log('status', status);
  const statusLabel = masterData.statusList.find((option) => option.value === status)?.label || 'New';
  const { isBlocked, setBlocked, handleNavigation } = useNavigationBlock();

  const OpenRedirect = () => {
    if (formState.isDirty) {
      handleNavigation(`/${configStore.appName}/supplier-ncr`);
    } else {
      navigate(`/${configStore.appName}/supplier-ncr`); // Redirect directly
    }
  };

  const handleDownloadPDF = async () => {
    const incidentData = await downloadSupplierNcrReport(paramId);
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
            <Badge color={colorSelectorByStatusName(statusLabel ?? '')} variant="soft">
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
