import { DocDetailModel } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { useQuery } from '@tanstack/react-query';

const URL = `incident-docs/content`;

const fetchIncidentDocData = async (documentId: string) => {
  const response = await getAxiosInstance().get<DocDetailModel>(`incident-docs/content/${documentId}`);
  const modifiedData = response.data;
  return modifiedData;
}

export const useIncidentDocQuery = (documentId: string) => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['incident-doc-query', documentId],
    queryFn: () => fetchIncidentDocData(documentId),
    enabled: !!documentId
  });

  return {
    incidentDocData: data as DocDetailModel,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
