import React, { useState,useMemo ,useEffect} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { STORE, useStoreSelector } from '@cookers/store';
import { Flex, Button, Box, Popover } from '@radix-ui/themes';
import { FormSelect, FormDate } from '@cookers/ui';
import { AddAllItemOption, GetDateRange } from '@cookers/utils';
import { CustomerFeedbackFPMUFormData, CustomerFeedbackAnalysisFormData } from '@cookers/models';


interface CustomerFeedbackFPMUReportProps {
    onPopoverClick: (data: CustomerFeedbackFPMUFormData) => void;
    onPopoverClose: () => void;
}

export const CustomerFeedbackFPMUReport: React.FC<CustomerFeedbackFPMUReportProps> = ({
    onPopoverClick,
    onPopoverClose
}) => {
    const { masterData } = useStoreSelector(STORE.CustomerFeedback);
    const depotList = AddAllItemOption(masterData.depotList ?? []);

    const defaultDateRange = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const isBeforeJuly = currentMonth < 6;
    const currentFYYear = isBeforeJuly ? currentYear - 1 : currentYear;
    const fromDate = new Date(currentFYYear - 4, 6, 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const toDate = lastMonth;
    
    return { fromDate, toDate };
}, []);

    const defDepo = useMemo(() => {
        const depotList = AddAllItemOption(masterData.depotList);
        return depotList[0]?.value ?? "all";
    }, [masterData.depotList]);

    const methods = useForm<CustomerFeedbackFPMUFormData>({
      defaultValues: {
        dateFrom: defaultDateRange.fromDate,
        dateTo: defaultDateRange.toDate,
        depot: defDepo,
        isFpmu: 'Y',
        periodType: '',
      },
    });

    const handleButtonClick = () => {
        const formData = methods.getValues();
        onPopoverClick(formData);
    };

    return (
        <FormProvider {...methods}>
            <Flex gap="3">
                <Box flexGrow="1">
                    <FormDate 
                        label="Date From" 
                        name="dateFrom" 
                        defaultValue={defaultDateRange.fromDate} 
                        dateFormat="dd-MMM-yyyy"
                        readOnly
                    />
                    <FormDate 
                        label="Date To" 
                        name="dateTo" 
                        defaultValue={defaultDateRange.toDate} 
                        dateFormat="dd-MMM-yyyy" 
                        readOnly
                    />
                    <FormSelect 
                        label="Depot" 
                        name="depot" 
                        data={depotList} 
                        defaultValue={defDepo} 
                    />
                    <Popover.Close>
                        <Flex justify="start" width="100%">
                            <Button size="2" type="button" onClick={handleButtonClick}>
                                Print PDF
                            </Button>
                        </Flex>
                    </Popover.Close>
                </Box>
            </Flex>
        </FormProvider>
    );
};