import React, { useState, useMemo, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { STORE, useStoreSelector } from '@cookers/store';
import { Flex, Button, Box, Popover } from '@radix-ui/themes';
import { FormSelect, FormDate } from '@cookers/ui';
import { AddAllItemOption, GetDateRange } from '@cookers/utils';
import { CustomerFeedbackAnalysisFormData } from '@cookers/models';

interface CustomerFeedbackAnalysisReportProps {
  onPopoverClick: (data: CustomerFeedbackAnalysisFormData) => void;
  onPopoverClose: () => void;
}

export const CustomerFeedbackAnalysisReport: React.FC<CustomerFeedbackAnalysisReportProps> = ({ onPopoverClick, onPopoverClose }) => {
  const { masterData } = useStoreSelector(STORE.CustomerFeedback);
  const initialReportItem = 'YD5F';
  const initialTargetValue = masterData.analysisYTDPeriodList.at(-1)!.value;
  const latestTargetYear = useMemo(() => masterData.analysisCalenderYearList?.at(-1)?.value ?? '', [masterData.analysisCalenderYearList]);
  const depotList = AddAllItemOption(masterData.depotList ?? []);
  //const statusList = AddAllItemOption(masterData.statusList ?? []);
  const natureList = AddAllItemOption(masterData.natureList ?? []);
  const feedbackClassList = AddAllItemOption(masterData.feedbackTypeList ?? []);
  const issueClassList = AddAllItemOption(masterData.issueList ?? []);

  const [dateRange, setDateRange] = useState<{ fromDate: Date; toDate: Date }>(() => GetDateRange(initialReportItem, initialTargetValue));

  const defDepo = useMemo(() => {
    const depotList = AddAllItemOption(masterData.depotList);
    return depotList[0]?.value;
  }, [masterData.depotList]);

  // const defStatus = useMemo(() => {
  //   const statusList = AddAllItemOption(masterData.statusList);
  //   return statusList[0]?.value;
  // }, [masterData.statusList]);

  const defNature = useMemo(() => {
    const natureList = AddAllItemOption(masterData.natureList);
    return natureList[0]?.value;
  }, [masterData.natureList]);

  const defFeedbackClassification = useMemo(() => {
    const feedbackClassList = AddAllItemOption(masterData.feedbackTypeList);
    return feedbackClassList[0]?.value;
  }, [masterData.feedbackTypeList]);

  const defIssueClassification = useMemo(() => {
    const issueClassList = AddAllItemOption(masterData.issueList);
    return issueClassList[0]?.value;
  }, [masterData.issueList]);

  const methods = useForm<CustomerFeedbackAnalysisFormData>({
    defaultValues: {
      reportItem: initialReportItem,
      targetPeriod: initialTargetValue,
      targetYear: latestTargetYear,
      targetFinYear: masterData.analysisPeriodList.at(-1)!.value,
      dateFrom: dateRange.fromDate,
      dateTo: dateRange.toDate,
      depot: defDepo ?? 'all',
      //status: defStatus ?? "all",
      nature: defNature ?? 'all',
      feedbackClassification: defFeedbackClassification ?? 'all',
      issueClassification: defIssueClassification ?? 'all',
      isFpmu: 'N',
    },
  });

  const { handleSubmit, setValue, watch, getValues } = methods;
  const reportItem = watch('reportItem');
  const cal5CalYr = reportItem === 'YD5C';
  const calYr = reportItem === 'CALY';
  const calFinYr = reportItem === 'FINY';
  const isCust = reportItem === 'CUST';

  const calculateAndSetDateRange = (targetKey: string, value: string) => {
    const calculatedDateRange = GetDateRange(targetKey, value);
    setValue('dateFrom', calculatedDateRange.fromDate);
    setValue('dateTo', calculatedDateRange.toDate);
    setDateRange(calculatedDateRange);
  };

  const handleReportItemChange = (value: string) => {
    const targetKey = value;
    let targetValue = '';
    if (value === 'YD5F') {
      // YTD (5 financial yrs)
      targetValue = masterData.analysisYTDPeriodList.at(-1)!.value;
      setValue('targetPeriod', targetValue);
    } else if (value === 'YD5C') {
      // YTD (5 calendar yrs)
      targetValue = masterData.analysisYTDPeriodList.at(-1)!.value;
      setValue('targetPeriod', targetValue);
    } else if (value === 'CALY') {
      targetValue = latestTargetYear;
      setValue('targetYear', targetValue);
    } else if (value === 'FINY') {
      targetValue = masterData.analysisPeriodList.at(-1)!.value;
      setValue('targetFinYear', targetValue);
    }
    calculateAndSetDateRange(targetKey, targetValue);

  };

  const handleTargetItemChange = (value: string) => {
    calculateAndSetDateRange(reportItem, value);
  };

  useEffect(() => {
    if (reportItem === 'CALY') {
      setValue('targetYear', latestTargetYear);
      calculateAndSetDateRange('CALY', latestTargetYear);
    }
    if (reportItem === 'FINY') {
      const fin = masterData.analysisPeriodList.at(-1)!.value;
      setValue('targetFinYear', fin);
      calculateAndSetDateRange('FINY', fin);
    }
  }, [reportItem, latestTargetYear, masterData.analysisPeriodList, setValue]);

  const handleButtonClick = () => {
    const formData: CustomerFeedbackAnalysisFormData = getValues();
    onPopoverClick(formData);
  };

  return (
    <FormProvider {...methods}>
      <Flex gap="3">
        <Box flexGrow="1">
          <FormSelect
            label="Report Type"
            name="reportItem"
            data={masterData.analysisReportFilterList}
            defaultValue={initialReportItem}
            onValueChange={(value) => {
              setValue('reportItem', value);
              handleReportItemChange(value);
            }}
          />

          {calYr && <FormSelect name="targetYear" data={masterData.analysisCalenderYearList} defaultValue={latestTargetYear} label="Year" onValueChange={(value) => handleTargetItemChange(value)} />}
          {calFinYr && <FormSelect name="targetFinYear" label="Financial Year" data={masterData.analysisPeriodList} defaultValue={masterData.analysisPeriodList.at(-1)!.value} onValueChange={handleTargetItemChange} />}

          <FormDate label="Date From" name="dateFrom" defaultValue={dateRange.fromDate} readOnly={!isCust} dateFormat="dd-MMM-yyyy" />
          <FormDate label="Date To" name="dateTo" defaultValue={dateRange.toDate} readOnly={!isCust} dateFormat="dd-MMM-yyyy" />
          <FormSelect label="Nature" name="nature" data={natureList ?? []} defaultValue={defNature ?? 'all'} />
          <FormSelect label="Feedback Classification" name="feedbackClassification" data={feedbackClassList ?? []} defaultValue={defFeedbackClassification ?? 'all'} />
          <FormSelect label="Issue Classification" name="issueClassification" data={issueClassList ?? []} defaultValue={defIssueClassification ?? 'all'} />
          <FormSelect label="Depot" name="depot" data={depotList ?? []} defaultValue={defDepo ?? 'all'} />
          {/* <FormSelect label="Status" name="status" data={statusList ?? []} defaultValue={defStatus ?? 'all'} /> */}

          <Flex gap="3" mt="3" justify="between">
            <Popover.Close>
              <Flex justify="start" width="100%">
                <Button size="2" type="button" onClick={handleButtonClick}>
                  Print
                </Button>
              </Flex>
            </Popover.Close>
          </Flex>
        </Box>
      </Flex>
    </FormProvider>
  );
};

export default CustomerFeedbackAnalysisReport;
