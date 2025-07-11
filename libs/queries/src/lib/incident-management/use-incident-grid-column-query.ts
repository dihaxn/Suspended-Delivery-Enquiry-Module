import { EmployeeReport, EmployeeReportGrid, GridColumn, IncidentFormValue } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

const URL = `GetIncidentGridColumn`;


// create useNavQuery types
export const useIncidentGridColumnQuery = () => {
const fetchIncidentData = async () => await getAxiosInstance().get<GridColumn[]>(URL);
  
  const { data, isError, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['incidents-column-query'],
    queryFn: fetchIncidentData,
    select: (data: { data: any; }) => data.data,
  });

 return {
    incidentColumns: data as GridColumn[],
    isError,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};

