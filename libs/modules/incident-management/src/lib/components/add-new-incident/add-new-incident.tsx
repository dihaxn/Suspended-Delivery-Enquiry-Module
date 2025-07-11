import { FC,useState,useEffect } from 'react';
import {  useForm } from 'react-hook-form';

import { z } from 'zod';
import { IncidentFormValue,IncidentMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { RootState } from '@cookers/store';
import { FormSelect, FormRadio } from '@cookers/ui';
import { zodResolver } from '@hookform/resolvers/zod';

import { useMutation, useQueryClient } from '@tanstack/react-query';


import {  useDispatch,useSelector } from 'react-redux';

type incidentFormProps = {
  
  onValueChange?: (value: string) => void;
};


export const AddNewIncidentForm:React.FC<incidentFormProps> = ({ onValueChange}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  //const { masterData } = useStoreSelector(STORE.IncidentManagement);
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
console.log(masterData.statusList);
  

  /* const { mutateAsync } = useMutation({
    mutationFn: (newIncident: IncidentModel) => {
      return getAxiosInstance().post('incidents\'+newIncident.empReportId, newIncident, requestOptions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents-query'] });
    },
  }); */

  /* if (!masterData) return;
  const requestOptions = {
    method: 'post',
  };
 */
  
 
  return (
    
        <div>
        <FormSelect label="Report Type" name="reportType" data={masterData.reportTypeList} onValueChange={onValueChange } />
        <FormSelect label="WorkSite" name="worksite" data={masterData.workSiteList} />  
        <FormRadio label="Status" name="status" itemList={masterData.statusList} />
           
        </div>

        
     
       
    
  );
};

export default AddNewIncidentForm;
