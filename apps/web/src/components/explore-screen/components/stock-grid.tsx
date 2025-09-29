import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { match } from "ts-pattern";
import { StockCard } from "./stock-card";
import { StockCardSkeleton } from "./stock-card-skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { tickersQueryOptions } from "@/lib/stocks-query";
import { showErrorToast } from "@/lib/toast-utils";
import type { LoadingState } from "../types";
import { useSearch } from "@tanstack/react-router";

const SKELETON_COUNT = 12;

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="bg-white rounded-lg border border-gray-200 p-8 inline-block">
        <p className="text-gray-900 font-semibold text-xl mb-2 font-heading">
          No stocks found
        </p>
        <p className="text-gray-600 text-sm font-body">
          Try adjusting your search or check back later.
        </p>
      </div>
    </div>
  );
}

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

  const gridClassName =
    "grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";

  return match({ status, isEmpty })
    .with({ status: "pending" }, () =>
      isEmpty ? (
        <div className={gridClassName}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <StockCardSkeleton key={i} />
          ))}
        </div>
      ) : null
    )
    .with({ isEmpty: true }, () => <EmptyState />)
    .otherwise(() => (
      <>
        <div className={gridClassName}>
          {stocks.map((stock) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))}
        </div>

        {isFetchingNextPage && (
          <LoadingIndicator state={{ tag: "loading-more" }} />
        )}

        {hasNextPage && loadMoreRef && fetchNextPage && (
          <div className="flex flex-col items-center gap-2 py-6">
            <div ref={loadMoreRef} className="h-4" />
            {!isFetchingNextPage && (
              <LoadingIndicator
                state={{ tag: "fetching-next", stocks }}
                onLoadMore={fetchNextPage}
              />
            )}
          </div>
        )}

        {!hasNextPage && <EndOfResults />}
      </>
    ));
}

function LoadingIndicator({
  state,
  onLoadMore,
}: {
  state: LoadingState;
  onLoadMore?: () => void;
}) {
  return match(state)
    .with({ tag: "loading-more" }, () => (
      <div className="flex justify-center py-12">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    ))
    .with({ tag: "fetching-next" }, ({ stocks }) =>
      stocks.length > 0 ? (
        <div className="flex flex-col items-center gap-2 py-6">
          {onLoadMore && (
            <button
              type="button"
              onClick={onLoadMore}
              className="text-sm text-gray-600 underline font-body"
            >
              Load more
            </button>
          )}
        </div>
      ) : null
    )
    .exhaustive();
}

function EndOfResults() {
  return (
    <div className="text-center py-10 text-gray-500 text-sm font-body">
      End of results
    </div>
  );
}
