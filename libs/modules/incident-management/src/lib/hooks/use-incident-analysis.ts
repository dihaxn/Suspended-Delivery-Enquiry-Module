import { IncidentsAnalysis,DocDetailModel,IncidentAnalysisFormData,IncidentsFilters,IncidentMasterData} from '@cookers/models';
import { formattoDate } from '@cookers/utils';
import { getAxiosInstance } from "@cookers/services";

export const downloadAnalysisReport = async (data: IncidentAnalysisFormData,filter:IncidentsFilters,masterData:IncidentMasterData) => {
    console.log(getAxiosInstance());
   

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`incidents/analysis`,  { params: modifyJsonFields(data,filter,masterData) });
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};
const getPeriodType = (reportitem: string, data: IncidentAnalysisFormData): string => {
  switch (reportitem) {
    case "CALY":
      return data.targetYear;
    case "FINY":
      return data.targetFinYear;
    case "YD3F":
      return data.targetPeriod;
    default:
      return "";
  }
};

const modifyJsonFields = (data: IncidentAnalysisFormData,filter:IncidentsFilters,masterData:IncidentMasterData): IncidentsAnalysis => {
  let apiData = {} as IncidentsAnalysis;
  apiData.fromDate = formattoDate(data.dateFrom);
  apiData.toDate = formattoDate(data.dateTo);
  apiData.periodType = data.reportitem;
  apiData.currentYear= new Date().getFullYear().toString();
  apiData.indexText= masterData.analysisReportFilterList.filter(i=>i.value===data.reportitem).map(i=>i.label)[0]||'';
  apiData.depot= filter.depot =="all"?"":filter.depot;
  apiData.status= filter.status=='all'?'':filter.status;
   apiData.reportType= filter.type=='all'?'':filter.type;
  return apiData;
};
