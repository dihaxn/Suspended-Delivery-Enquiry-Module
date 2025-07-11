import { RootState, configStore } from '@cookers/store';
import { useState } from 'react';
import { Flex, ConfirmAlertDialog } from '@cookers/ui';
import { Button, SegmentedControl, Heading, IconButton, Badge } from '@radix-ui/themes';
import { ArrowLeftIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useIncidentReadOnly } from '../../../provider/read-only-incident-provider';
import { useNavigationBlock } from '@cookers/modules/common';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { downloadIncidentReport } from '../../../hooks';
import { convertBase64ToBlob } from '@cookers/utils';
import { downloadIncidentHelperDoc } from '../../../hooks/use-incident-helper';
import { CircleHelp } from 'lucide-react';
import { colorSelectorByStatusName } from '../../../util/incidentManagementUtils';

export const IncidentReportTypeSelector = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { masterData, incidentDocUnsaved, isIncidentDocDeleted } = useSelector((state: RootState) => state.incidentManagement);
  const { formState, control, getValues } = useFormContext();
  const { isReadOnly } = useIncidentReadOnly();
  const { id } = useParams<{ id?: string }>(); // Define id as optional string
  const paramId = id ? Number(id) : 0;
  const isNew = paramId === 0;
  const status = useWatch({ control: control, name: 'status' });
  const statusLabel = masterData.statusList.find((option) => option.value === status)?.label || '';
  const { isBlocked, setBlocked, handleNavigation } = useNavigationBlock();

  const OpenRedirect = () => {
    if (formState.isDirty || incidentDocUnsaved > 0 || isIncidentDocDeleted) {
      handleNavigation(`/${configStore.appName}/incident-management`);
    } else {
      navigate(`/${configStore.appName}/incident-management`); // Redirect directly
    }
  };

  const handleDownloadPDF = async () => {
    if (isNew) {
      return;
    }
    const incidentData = await downloadIncidentReport((id as unknown as number) || 0);

    if (incidentData) {
      const base64DocumentFile = incidentData.documentFile;
      const mimeType = incidentData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };

    const handleHelperPDF = async () => {
        const helperData = await downloadIncidentHelperDoc();
    
        if (helperData) {
          const base64DocumentFile = helperData.documentFile;
          const mimeType = helperData.detailedExtension;
          const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
          const objURL = URL.createObjectURL(blob);
          openWindow(objURL);
        }
      };
      const openWindow = (URL: string) => {
        window.open(URL, '_blank');
      };

  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem' }}>
      <Button type="button" size="3" color="gray" variant="ghost" onClick={OpenRedirect} highContrast>
        <ArrowLeftIcon width="18" height="18" /> Back
      </Button>
      <Controller
        name="reportType"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <SegmentedControl.Root value={value} onBlur={onBlur} onValueChange={onChange} size="2" radius="full" onChange={onChange} data-textid="reportType">
            {masterData.reportTypeList.map((item) => (
              <SegmentedControl.Item className={`segmented-control ${!isNew ? 'disabled' : ''}`} key={item.value} value={item.value} aria-disabled={!isNew}>
                {item.label}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        )}
      />
      <Flex align="center" gap="2">
        <span className="opacity-85 font-thin">Status:{' '}</span>
        <Heading size="2">
          <Badge
            color={colorSelectorByStatusName(statusLabel ?? '')}
            variant="soft"
          >
            {statusLabel}
          </Badge>
        </Heading>
        <span className='text-lg opacity-65 font-extralight' >|</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton variant="soft" color="blue" className="cursor-pointer" radius="full" type="button" onClick={handleHelperPDF}>
                <CircleHelp size={20} />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Employee Incident Reports Classification</TooltipContent>
          </Tooltip>
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
