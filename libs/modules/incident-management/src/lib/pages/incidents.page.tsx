import { IncidentAnalysisFormData } from '@cookers/models';
import { clearSelectedIncident, configStore, STORE, useStoreSelector } from '@cookers/store';
import { Button, Flex, Grid, Heading, ModuleBaseLayout, PopOverControl, SectionBaseLayout } from '@cookers/ui';
import { convertBase64ToBlob } from '@cookers/utils';
import { FileIcon, PinBottomIcon } from '@radix-ui/react-icons';
import { useEffect,useState } from 'react';
import { IconButton } from '@radix-ui/themes';
import { FileBarChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Filter, IncidentAnalysisReport, IncidentList, IncidentQuickView } from '../components';
import { downloadAnalysisReport } from '../hooks/use-incident-analysis';
import { downloadIncidentCSV } from '../hooks/use-incident-csv-query';
export function IncidentsPage() {
  const { filter, masterData } = useStoreSelector(STORE.IncidentManagement);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearSelectedIncident());
  }, []); // This only runs on initial render
  const handlebuttonclick = () => {
    navigate(`/${configStore.appName}/incident-management/new`);
  };
  const handleCSVDownload = async () => {
    const incidentListDocData = await downloadIncidentCSV(filter);

    if (incidentListDocData) {
      const base64DocumentFile = incidentListDocData.documentFile;
      const mimeType = incidentListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };
  const showAnalysisReportPopup = async (data: IncidentAnalysisFormData) => {
    console.log(data);
    const incidentListDocData = await downloadAnalysisReport(data, filter, masterData);

    if (incidentListDocData) {
      const base64DocumentFile = incidentListDocData.documentFile;
      const mimeType = incidentListDocData.detailedExtension;
      const blob = convertBase64ToBlob(base64DocumentFile, mimeType);
      const objURL = URL.createObjectURL(blob);
      openWindow(objURL);
    }
  };
  const openWindow = (URL: string) => {
    window.open(URL, '_blank');
  };
  const header = (
    <Flex gap="8" height="64px" align="center" px="3">
      <Heading>Incidents</Heading>
      <Flex gap="4" align="center" justify="end" width="100%">
        <Button radius="full" variant="solid" onClick={handlebuttonclick}>
          <FileIcon />
          Create New Incident
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton variant="soft" className="cursor-pointer" color="blue" radius="full" type="button" onClick={handleCSVDownload}>
              <PinBottomIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Download CSV</TooltipContent>
        </Tooltip>
    { masterData.showAnalysisReport&&  <PopOverControl
          buttonLabel={<div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      variant="soft"
                      className="cursor-pointer"
                      color="blue"
                      radius="full"
                      type="button"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <FileBarChart size={16} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>Analysis Report</TooltipContent>
                </Tooltip>
              </div>}
          radius="full"
          variant="outline"
          isOpen={isConfirmOpen}
          onOpenChange={setConfirmOpen}
          popoverContent={<IncidentAnalysisReport onPopoverClick={showAnalysisReportPopup}   onPopoverClose={() => setConfirmOpen(false)} />}
        />}
        </Flex>
    </Flex>
  );

  const main = <SectionBaseLayout header={header} main={<IncidentList />}></SectionBaseLayout>;

  return <ModuleBaseLayout aside={<Filter />} main={main} article={<IncidentQuickView />} />;
}
