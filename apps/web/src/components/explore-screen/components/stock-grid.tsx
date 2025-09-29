import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { tickersQueryOptions } from "@/lib/stocks-query";
import { showErrorToast } from "@/lib/toast-utils";
import { useSearch } from "@tanstack/react-router";
import {
  LoadingSkeleton,
  EmptyState,
  LoadingIndicator,
  EndOfResults,
  StockList,
} from "./stock-grid-helpers";

export function StockGrid() {
  const { q: query } = useSearch({ from: "/explore" });
  const lastErrorRef = useRef<Error | null>(null);

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(tickersQueryOptions(query));

  const stocks = data?.pages?.flatMap((page) => page.stocks) ?? [];
  const isEmpty = stocks.length === 0;

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      showErrorToast("Failed to load stocks", error);
      lastErrorRef.current = error;
    }

    if (!error && lastErrorRef.current) {
      lastErrorRef.current = null;
    }
  }, [error]);

  if (status === "pending" && isEmpty) {
    return <LoadingSkeleton />;
  }

  if (isEmpty) {
    return <EmptyState />;
  }

  return (
    <>
      <StockList stocks={stocks} />

      {isFetchingNextPage && <LoadingIndicator />}

      {hasNextPage && <div ref={loadMoreRef} className="h-4" />}

      {!hasNextPage && !isFetchingNextPage && <EndOfResults />}
    </>
  );
}

StockGrid.whyDidYouRender = true;
