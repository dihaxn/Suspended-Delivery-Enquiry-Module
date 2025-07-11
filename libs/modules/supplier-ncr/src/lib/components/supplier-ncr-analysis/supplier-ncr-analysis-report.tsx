import React, { useState,useMemo ,useEffect} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { STORE, useStoreSelector } from '@cookers/store';
import { Flex, Button, Box, Popover } from '@radix-ui/themes';
import { FormSelect, FormDate } from '@cookers/ui';
import { AddAllItemOption, GetDateRange } from '@cookers/utils';
import { SupplierNcrAnalysisFormData } from '@cookers/models';

interface SupplierNcrAnalysisReportProps {
  onPopoverClick: (data: SupplierNcrAnalysisFormData) => void;
  onPopoverClose: () => void;
}

export const SupplierNcrAnalysisReport: React.FC<SupplierNcrAnalysisReportProps> = ({ onPopoverClick ,onPopoverClose }) => {
  const { masterData } = useStoreSelector(STORE.SupplierNcr);
  const initialReportItem = 'YD5F';
  const initialTargetValue = masterData.analysisYTDPeriodList[0].value;
  const latestTargetYear = useMemo(() => masterData.analysisCalenderYearList.at(-1)?.value, [masterData.analysisCalenderYearList]);
  const latestTargetFinYear = useMemo(() => masterData.analysisPeriodList.at(-1)?.value, [masterData.analysisPeriodList]);
 const depotList = AddAllItemOption(masterData.depotList);
  const statusList = AddAllItemOption(masterData.statusList);
  const classificationList = AddAllItemOption(masterData.classificationList);
  const [dateRange, setDateRange] = useState<{ fromDate: Date; toDate: Date }>(() => 
    GetDateRange(initialReportItem, initialTargetValue)
  );
   const defDepo = useMemo(() => {
  const depotList = AddAllItemOption(masterData.depotList);
  return depotList[0]?.value;
}, [masterData.depotList]);
 const defClassification = useMemo(() => {
  const classificationList = AddAllItemOption(masterData.classificationList);
  return classificationList[0]?.value;
}, [masterData.classificationList]);
 const defStatus = useMemo(() => {
  const statusList = AddAllItemOption(masterData.statusList);
  return statusList[0]?.value;
}, [masterData.statusList]);
  const methods = useForm<SupplierNcrAnalysisFormData>({
    defaultValues: {
      reportitem: masterData.analysisReportFilterList[0].value,
      targetPeriod: masterData.analysisYTDPeriodList[0].value,
      targetYear: latestTargetYear ?? "",
      targetFinYear: latestTargetFinYear ?? "",
      dateFrom: dateRange.fromDate,
      dateTo: dateRange.toDate,
      depot:defDepo,
      classification:defClassification,
      status:defStatus,
    },
  });

  const { handleSubmit, setValue, watch,getValues } = methods;
  const reportitem = watch('reportitem');
  const cal3Yr = reportitem === 'YD5F';
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

    if (value === "YD5F") targetValue = masterData.analysisYTDPeriodList.at(-1)?.value ?? "";
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
    const formData: SupplierNcrAnalysisFormData = getValues();
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
            {/* {cal3Yr && (
              <FormSelect
                name="targetPeriod"
                data={masterData.analysisYTDPeriodList}
                defaultValue={masterData.analysisYTDPeriodList.at(-1)?.value}
                label="Target Period"
                onValueChange={(value) => handleTargetItemChange(value)}
              />
            )} */}
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
            <FormSelect label="Classification" name="classification" data={classificationList} defaultValue={defClassification} />
            
                          <FormSelect label="Depot" name="depot" data={depotList} defaultValue={defDepo} />
            
                          <FormSelect label="Status" name="status" data={statusList} defaultValue={defStatus} />
            <Flex gap="3" mt="3" justify="between">
            <Popover.Close>
              <Flex justify="start" width="100%">
                <Button size="2"type="button" onClick={handleButtonClick}>
                  Print
                </Button>
              </Flex>
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

export default SupplierNcrAnalysisReport;
