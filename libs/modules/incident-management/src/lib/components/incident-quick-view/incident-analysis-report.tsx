import React, { useState,useMemo ,useEffect} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { STORE, useStoreSelector } from '@cookers/store';
import { Flex, Button, Box, Popover } from '@radix-ui/themes';
import { FormSelect, FormDate } from '@cookers/ui';
import { GetDateRange } from '@cookers/utils';
import { IncidentAnalysisFormData } from '@cookers/models';

interface IncidentAnalysisReportProps {
  onPopoverClick: (data: IncidentAnalysisFormData) => void;
  onPopoverClose: () => void;
}

export const IncidentAnalysisReport: React.FC<IncidentAnalysisReportProps> = ({ onPopoverClick ,onPopoverClose }) => {
  const { masterData } = useStoreSelector(STORE.IncidentManagement);
  const initialReportItem = 'YD3F';
  const initialTargetValue = masterData.analysisYTDPeriodList[0].value;
  const latestTargetYear = useMemo(() => masterData.analysisCalenderYearList.at(-1)?.value, [masterData.analysisCalenderYearList]);
  const latestTargetFinYear = useMemo(() => masterData.analysisPeriodList.at(-1)?.value, [masterData.analysisPeriodList]);

  const [dateRange, setDateRange] = useState<{ fromDate: Date; toDate: Date }>(() => 
    GetDateRange(initialReportItem, initialTargetValue)
  );
  const methods = useForm<IncidentAnalysisFormData>({
    defaultValues: {
      reportitem: masterData.analysisReportFilterList[0].value,
      targetPeriod: masterData.analysisYTDPeriodList[0].value,
      targetYear: latestTargetYear ?? "",
      targetFinYear: latestTargetFinYear ?? "",
      dateFrom: dateRange.fromDate,
      dateTo: dateRange.toDate,
    },
  });

  const { handleSubmit, setValue, watch,getValues } = methods;
  const reportitem = watch('reportitem');
  const cal3Yr = reportitem === 'YD3F';
  const calYr = reportitem === 'CALY';
  const calFinYr = reportitem === 'FINY';
  const isCust = reportitem === 'CUST';
  const calculateAndSetDateRange = (targetKey: string, value: string) => {
    const calculatedDateRange = GetDateRange(targetKey, value);
    console.log(calculatedDateRange);

    setValue('dateFrom', calculatedDateRange.fromDate);
    setValue('dateTo', calculatedDateRange.toDate);
    setDateRange(calculatedDateRange);
  };
  const handleReportItemChange = (value: string) => {
    let targetKey = value;
    let targetValue = "";

    if (value === "YD3F") targetValue = masterData.analysisYTDPeriodList.at(-1)?.value ?? "";
    else if (value === "CALY") {
      targetValue = latestTargetYear ?? "";
      setValue("targetYear", latestTargetYear ?? "");
    } else if (value === "FINY") {
      targetValue = latestTargetFinYear ?? "";
      setValue("targetFinYear", latestTargetFinYear ?? "");
    }

    calculateAndSetDateRange(targetKey, targetValue);
  };
  const handleTargetItemChange = (value: string) => {
    calculateAndSetDateRange(reportitem, value);
   
  };
  useEffect(() => {
    if (reportitem === "CALY") setValue("targetYear", latestTargetYear ?? "");
    if (reportitem === "FINY") setValue("targetFinYear", latestTargetFinYear ?? "");
  }, [reportitem, latestTargetYear, latestTargetFinYear, setValue]);
  const handleButtonClick = () => {
    const formData: IncidentAnalysisFormData = getValues();
    onPopoverClick(formData);
  };
  return (
    <FormProvider {...methods}>
        <Flex gap="3">
          <Box flexGrow="1">
            <FormSelect
              name="reportitem"
              data={masterData.analysisReportFilterList}
              defaultValue={masterData.analysisReportFilterList[0].value}
              label=""
              onValueChange={(value) => handleReportItemChange(value)}
            />
            {cal3Yr && (
              <FormSelect
                name="targetPeriod"
                data={masterData.analysisYTDPeriodList}
                defaultValue={masterData.analysisYTDPeriodList.at(-1)?.value}
                label="Target Period"
                onValueChange={(value) => handleTargetItemChange(value)}
              />
            )}
            {calYr && (
              <FormSelect
                name="targetYear"
                data={masterData.analysisCalenderYearList}
                defaultValue={latestTargetYear}
                label="Year"
                onValueChange={(value) => handleTargetItemChange(value)}
              />
            )}
            {calFinYr && (
              <FormSelect
                name="targetFinYear"
                data={masterData.analysisPeriodList}
                defaultValue={latestTargetFinYear}
                label="Target Period"
                onValueChange={(value) => handleTargetItemChange(value)}
              />
            )}

            <FormDate label="Date From" name="dateFrom" defaultValue={dateRange.fromDate} readOnly={!isCust} dateFormat="dd-MMM-yyyy"/>
            <FormDate label="Date To" name="dateTo" defaultValue={dateRange.toDate} readOnly={!isCust}  dateFormat="dd-MMM-yyyy"/>
            <Flex gap="3" mt="3" justify="between">
              <Popover.Close>
                <Button size="2"type="button" onClick={handleButtonClick}>
                  Print
                </Button>
              </Popover.Close>
              {/* <Button size="1" type="button" onClick={onPopoverClose}>
              Close
            </Button> */}
            </Flex>
          </Box>
        </Flex>
    </FormProvider>
  );
};

export default IncidentAnalysisReport;
