import { EmployeeReport, EmployeeReportGrid } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { useInfiniteQuery } from '@tanstack/react-query';

const URL = `GetEmployeeReportGrid`;

interface IncidentsProps {
  //sorting: SortingState;
  filter: {
    duration: string;
    dateFrom: Date;
    dateTo: Date;
    status: string;
    dateRange: string;
    type: string;
    depot: string;
  };
}

// create useNavQuery types
export const useIncidentQuery = (props: IncidentsProps) => {
  const fetchNavigationData = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<{
    data: EmployeeReport[];
    currentPage: number;
    nextPage: number | null;
    count: number;
  }> => {
    const config = {
      params: {
        //sid: props.sorting.length > 0 ? props.sorting[0].id : '',
        //sdesc: props.sorting.length > 0 ? props.sorting[0].desc : '',
        fduration: props.filter.duration,
        fdateFrom: props.filter.dateFrom,
        fdateTo: props.filter.dateTo,
        fstatus: props.filter.status,
        fdateRange: props.filter.dateRange,
        ftype: props.filter.type,
        fdepot: props.filter.depot,

        page: pageParam,
        pageSize: LIMIT,
      },
    };

    const incidentData = await getAxiosInstance().get<EmployeeReportGrid>(URL, config);

    return new Promise((resolve) => {
      resolve({
        data: incidentData.data.data,
        currentPage: pageParam,
        nextPage: pageParam + LIMIT < incidentData.data.count ? pageParam + LIMIT : null,
        count: incidentData.data.count,
      });
    });
  };

  const { data, error, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['incidents-table-query', props.filter], //queryKey: ['incidents-table-query',props.sorting],
    queryFn: fetchNavigationData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const LIMIT = 10;

  return {
    incidentsData: data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
  };
};
