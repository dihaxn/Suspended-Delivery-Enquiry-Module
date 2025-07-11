import { DataType } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';
import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { useClearNewFlag } from './use-clear-new-flag';
import { useFilters } from './use-filter';
import { useFilterApi } from './use-filter-api';
import { useNewRefetchFlag } from './use-reset-new';
const fetchSize = 50;

const fetchDataTableData = async <T, F = Record<string, never>>({
  pageParam = 0,
  sorting,
  dataType,
  filters = {} as F,
  url,
}: {
  pageParam?: number;
  sorting: SortingState;
  dataType: DataType;
  filters?: F;
  url: string;
}): Promise<AxiosResponse<ApiResponse<T>, object>> => {
  const start = pageParam;

  const config = {
    params: {
      page: start,
      pageSize: fetchSize,
      ...filters,
    },
  };

  const response = await getAxiosInstance().get<ApiResponse<T>>(url, config);
  response.data.currentPage = start;
  response.data.nextPage = start + fetchSize < response.data.totalRowCount ? start + 1 : 0;
  return response;
};

export const useDataTableData = <T, F>(sorting: SortingState, dataType: DataType) => {
  const filters = useFilters(dataType) as F;
  const url = useFilterApi(dataType);
  const isNew = useNewRefetchFlag(dataType);
  const clearNewFlag = useClearNewFlag(dataType);
  const { data, fetchNextPage, isFetching, isLoading, refetch } = useInfiniteQuery({
    queryKey: [`data-${dataType}`, filters],
    queryFn: (lastPage) => fetchDataTableData<T, F>({ pageParam: lastPage.pageParam, sorting, dataType, filters, url }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextPage,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const flatData = React.useMemo(() => data?.pages?.flatMap((page) => page.data.data) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.data.totalRowCount ?? 0;
  const totalFetched = flatData.length;
  useEffect(() => {
    if (isNew) {
      refetch(); // Reload the data table
      clearNewFlag();
    }
  }, [isNew, refetch, clearNewFlag]);
  return { data, fetchNextPage, isFetching, isLoading, flatData, totalDBRowCount, totalFetched };
};

export type ApiResponse<T> = {
  data: T[];
  totalRowCount: number;
  currentPage: number;
  nextPage: number;
};
