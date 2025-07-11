import { DataTable, IncidentsList } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { STORE, useStoreSelector } from '@cookers/store';
import { useInfiniteQuery } from '@tanstack/react-query';

const URL = `GetIncidentGridColumn`;

const LIMIT = 50;

export const useIncidentsQuery = () => {
  const { filter } = useStoreSelector(STORE.IncidentManagement);

  const fetchIncidentsData = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<{
    data: IncidentsList[];
    currentPage: number;
    nextPage: number | null;
    count: number;
  }> => {
    const config = {
      params: {
        //sid: props.sorting.length > 0 ? props.sorting[0].id : '',
        //sdesc: props.sorting.length > 0 ? props.sorting[0].desc : '',
        fduration: filter.duration,
        fdateFrom: filter.dateFrom,
        fdateTo: filter.dateTo,
        fstatus: filter.status,
        fdateRange: filter.dateRange,
        ftype: filter.type,
        fdepot: filter.depot,
        page: pageParam,
        pageSize: LIMIT,
      },
    };

    const incidentsData = await getAxiosInstance().get<DataTable<IncidentsList>>(URL, config);

    return Promise.resolve({
      data: incidentsData.data.data,
      currentPage: pageParam,
      nextPage: pageParam + LIMIT < incidentsData.data.count ? pageParam + LIMIT : null,
      count: incidentsData.data.count,
    });
  };

  const { data, error, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['incidents-query'],
    queryFn: fetchIncidentsData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return {
    incidentsData: data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
  };
};
