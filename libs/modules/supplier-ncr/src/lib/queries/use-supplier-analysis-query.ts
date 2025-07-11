import { SupplierNcrAnalysis,DocDetailModel,SupplierNcrAnalysisFormData,SupplierNcrFilters} from '@cookers/models';
import { formattoDate } from '@cookers/utils';
import { getAxiosInstance } from "@cookers/services";

export const downloadSupplierNcrAnalysisReport = async (data: SupplierNcrAnalysisFormData) => {
    console.log(data);
   

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`supplier-ncr/analysis`,  { params: modifyJsonFields(data) });
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};


const modifyJsonFields = (data: SupplierNcrAnalysisFormData): SupplierNcrAnalysis => {
  const apiData = {} as SupplierNcrAnalysis;
  apiData.fromDate = formattoDate(data.dateFrom);
  apiData.toDate = formattoDate(data.dateTo);
  apiData.periodType = data.reportitem;
  apiData.currentYear= new Date().getFullYear().toString();
  
  apiData.depot= data.depot =="all"?"":data.depot;
  apiData.status= data.status=='all'?'':data.status;
   apiData.classification= data.classification=='all'?'':data.classification;
  return apiData;
};
