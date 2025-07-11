import { clearSelectedTruckSetting, configStore, STORE, useStoreSelector } from '@cookers/store';
import { Button, Flex, Grid, Heading, ModuleBaseLayout, PopOverControl, SectionBaseLayout } from '@cookers/ui';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TruckSettingsFilter, TruckSettingsList, TruckSettingsQuickView } from '../components';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { IconButton } from '@radix-ui/themes';
import { convertBase64ToBlob } from '@cookers/utils';
import { downloadTruckSettingsCSV } from '../hooks/download-csv-query';

export function TruckSettingsPage() {
  const { filter, masterData } = useStoreSelector(STORE.TruckSettings);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlebuttonclick = () => {
    navigate(`/${configStore.appName}/truck-settings/new`);
  };
  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };

  const handleCSVDownload = async () => {
    const truckSettingsListDocData = await downloadTruckSettingsCSV(filter);

    if (truckSettingsListDocData) {
      const base64DocumentFile = truckSettingsListDocData.documentFile;
      const mimeType = truckSettingsListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };

  useEffect(() => {
    dispatch(clearSelectedTruckSetting());
  }, []); // This only runs on initial render

  const header = (
    <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Truck Settings Enquiry</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
        <Button className="cursor-pointer" radius="full" variant="solid" onClick={handlebuttonclick}>
          <FileIcon />
          Create New Truck Settings
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={handleCSVDownload}>
              <PinBottomIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Download CSV</TooltipContent>
        </Tooltip>
        
      </Flex>
    </Flex>
  );

  const main = <SectionBaseLayout header={header} main={<TruckSettingsList />} />;

  return <ModuleBaseLayout aside={<TruckSettingsFilter />} main={main} article={<TruckSettingsQuickView />} />;
}
