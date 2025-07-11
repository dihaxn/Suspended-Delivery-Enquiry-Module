import React, { PropsWithChildren, forwardRef } from 'react';

interface DataTableScrollContainerProps extends PropsWithChildren {
  totalDBRowCount: number;
  totalFetched: number;
  isFetching: boolean;
  fetchNextPage: () => void;
}

export const DataTableScrollContainer = forwardRef<HTMLDivElement, DataTableScrollContainerProps>(
  ({ isFetching, totalFetched, totalDBRowCount, fetchNextPage, children }, elementRef) => {
    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = React.useCallback(
      (containerRefElement?: HTMLDivElement | null) => {
        if (containerRefElement) {
          const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
          //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
          if (scrollHeight - scrollTop - clientHeight < 500 && !isFetching && totalFetched < totalDBRowCount) {
            fetchNextPage();
          }
        }
      },
      [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
    );

    //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    React.useEffect(() => {
      const ref = elementRef as React.MutableRefObject<HTMLDivElement | null>;
      fetchMoreOnBottomReached(ref.current);
    }, [elementRef, fetchMoreOnBottomReached]);

    return (
      <div
        className="container !max-w-[5000px]"
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={elementRef}
        style={{
          overflow: 'auto',
          position: 'relative',
          height: 'calc(100vh - 164px)',
        }}
      >
        {/* // <ScrollArea
      //   type="auto"
      //   scrollbars="vertical"
      //   onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      //   ref={elementRef}
      //   style={{
      //     overflow: 'auto', //our scrollable table container
      //     position: 'relative', //needed for sticky header
      //     height: 'calc(100vh - 200px)', //should be a fixed height
      //   }}
      // > */}
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        {children}
        {/* // </ScrollArea> */}
      </div>
    );
  }
);
