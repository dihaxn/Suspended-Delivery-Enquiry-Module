import React from 'react';

import { CommonProps } from '@cookers/models';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// const persister = createSyncStoragePersister({
//   storage: window.localStorage,
// });

export const ReactQueryProvider: React.FC<CommonProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" position="bottom" />
    </QueryClientProvider>
  );
};
