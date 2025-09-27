import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import { listNasdaqTickers, type ListTickersParams } from "./api";

export const STOCKS_PAGE_SIZE = 20;

/**
 * Creates infinite query options for fetching NASDAQ tickers with search
 * @param search - Optional search query for filtering tickers
 */
export function tickersQueryOptions(search: string = "") {
  const normalizedSearch = search.trim();

  return infiniteQueryOptions({
    queryKey: ["tickers", { q: normalizedSearch }] as const,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }) => {
      const params: ListTickersParams = {
        search: normalizedSearch || undefined,
        cursor: pageParam,
        limit: STOCKS_PAGE_SIZE,
      };

      return listNasdaqTickers(params, signal);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      const err = error as unknown as { code?: string; status?: number };
      if (err?.code === "RATE_LIMIT" || err?.status === 429) return false;
      return failureCount < 2;
    },
  });
}

export const stocksInfiniteQueryOptions = tickersQueryOptions;
