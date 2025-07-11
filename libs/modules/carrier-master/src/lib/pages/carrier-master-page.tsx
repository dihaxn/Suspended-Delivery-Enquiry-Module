import { Button, Flex, Grid, Heading, ModuleBaseLayout,  SectionBaseLayout } from '@cookers/ui';
import { configStore, STORE, useStoreSelector } from '@cookers/store';
import { useNavigate } from 'react-router-dom';
import { Filter, CarrierList,CarrierQuickView } from '../components';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { downloadcarrierCSV } from '../queries/download-carrier-csv';
import { convertBase64ToBlob } from '@cookers/utils';




export function CarrierMasterPage() {
  const {  masterData,filter } = useStoreSelector(STORE.CarrierMaster);
  const navigate = useNavigate();
  
  const handlebuttonclick = () => {
    navigate(`/${configStore.appName}/carrier-master/new`);
  };
const handleCSVDownload = async () => {
    const supplierNCRListDocData = await downloadcarrierCSV(filter);

    if (supplierNCRListDocData) {
      const base64DocumentFile = supplierNCRListDocData.documentFile;
      const mimeType = supplierNCRListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };
 
  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };
  const header = (
    <Flex gap="0" height="64px" align="center" px="3">
      <Flex minWidth="300px">
        <Heading>Carriers</Heading>
      </Flex>
      <Flex gap="4" align="center" justify="end" width="100%">
      {masterData.showCreateCarrier && <Button className="cursor-pointer" radius="full" variant="solid" onClick={handlebuttonclick}>
          <FileIcon />
          Create New Carrier
        </Button>}
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

  const main = <SectionBaseLayout header={header} main={<CarrierList />}></SectionBaseLayout>;

  return <ModuleBaseLayout aside={<Filter />} main={main} article={<CarrierQuickView />} />;
}
