import { Flex, Heading, ModuleBaseLayout, SectionBaseLayout } from '@cookers/ui';
import { STORE, useStoreSelector } from '@cookers/store';
import { PinBottomIcon } from '@radix-ui/react-icons';
import { SuspendedDeliveryFilters, SuspendedDeliveryList} from '../components';
import { SuspendedDeliveryQuickView } from '../components';
import { IconButton } from '@radix-ui/themes';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { downloadSuspendedDeliveryCSV } from '../queries/download-suspended-delivery-query';
import { convertBase64ToBlob } from '@cookers/utils';

export function SuspendedDeliveryPage () {
 
 
  const { filter } = useStoreSelector(STORE.SuspendedDelivery);
 
  

  const handleCSVDownload = async () => {
    const suspendedDeliveryListDocData = await downloadSuspendedDeliveryCSV(filter);

    if (suspendedDeliveryListDocData) {
      const base64DocumentFile = suspendedDeliveryListDocData.documentFile;
      const mimeType = suspendedDeliveryListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      window.open(objURL, '_blank');
    }
  };

  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };

  const header = (
    <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Suspended Delivery</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
     
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
  const main = <SectionBaseLayout header={header} main={<SuspendedDeliveryList />}></SectionBaseLayout>;

  return <ModuleBaseLayout aside={<SuspendedDeliveryFilters />} main={main} article={<SuspendedDeliveryQuickView />} />;
};