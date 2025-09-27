import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect, useRef } from "react";
import { Search, AlertCircle, Wifi, WifiOff, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { StockCard } from "@/components/stock-card";
import { StockCardSkeleton } from "@/components/stock-card-skeleton";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { tickersQueryOptions } from "@/lib/stocks-query";
import { useSearchWithURL } from "@/hooks/use-search-with-url";

export function ExploreScreen() {
  const [error, setError] = useState<string | null>(null);
  const useVirtualization = false;
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const { input, setInput, query, isPending } = useSearchWithURL();
  const networkStatus = useNetworkStatus();

  // Always use the regular hook to avoid conditional hook issues
  const {
    data,
    status,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(tickersQueryOptions(query));

  const stocks = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((page) => page.stocks);
  }, [data]);

  const { targetRef: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: "300px 0px 300px 0px",
    enabled: hasNextPage && hasUserScrolled,
  });

  // Enable auto-loading next pages only after the user scrolls at least once
  useEffect(() => {
    const onScroll = () => setHasUserScrolled(true);
    if (typeof window !== "undefined") {
      const options: AddEventListenerOptions = { passive: true, once: true };
      window.addEventListener("scroll", onScroll, options);
      return () => window.removeEventListener("scroll", onScroll, options);
    }
  }, []);

  useEffect(() => {
    if (!queryError) {
      setError(null);
      return;
    }

    const message =
      queryError instanceof Error
        ? queryError.message
        : "Unable to fetch stocks at this time.";

    // Keep previous stocks rendered; only show inline error banner
    setError(message);
  }, [queryError]);

  // Trigger on rising edge of intersection to avoid duplicate calls
  const prevIntersectingRef = useRef(false);
  useEffect(() => {
    if (!hasUserScrolled || !hasNextPage || isFetchingNextPage) return;
    if (isIntersecting && !prevIntersectingRef.current) {
      fetchNextPage();
    }
    prevIntersectingRef.current = isIntersecting;
  }, [
    isIntersecting,
    hasUserScrolled,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const isInitialLoading = status === "pending";
  const isEmpty = stocks.length === 0;

  // Virtualization disabled
  const [skeletonCount, setSkeletonCount] = useState(6);

  useEffect(() => {
    const update = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      setSkeletonCount(w >= 1024 ? 12 : 6);
    };
    update();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
  }, []);

  // No virtualization

  return (
    <div className="min-h-screen paper-bg">
      {/* Header */}
      <div className="bg-background border-b-[2px] border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div
                className="w-12 h-12 bg-[var(--primary)] flex items-center justify-center border-[3px] border-black nasdaq-icon"
                style={{ borderRadius: "6px" }}
              >
                <span className="text-black font-bold text-xl font-heading">
                  N
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">
                  NASDAQ Explorer
                </h1>
                <span className="cartoon-pill font-body">
                  Real-time Stock Explorer
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:flex-1 md:max-w-4xl">
              <div className="relative flex-1">
                <Search
                  strokeWidth={3}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70 h-5 w-5"
                />
                <Input
                  placeholder="Search stocks by symbol or name"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{
                    opacity: isPending ? 0.7 : 1,
                    borderRadius: "6px",
                  }}
                  className="pl-12 h-12 w-full bg-white border-[3px] border-black focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={networkStatus.isOnline ? "default" : "destructive"}
                  className={
                    networkStatus.isOnline
                      ? "cartoon-badge bg-emerald-100 text-emerald-900"
                      : "cartoon-badge bg-red-100 text-red-900"
                  }
                >
                  {networkStatus.isOnline ? (
                    <Wifi strokeWidth={3} className="w-4 h-4 me-1" />
                  ) : (
                    <WifiOff strokeWidth={3} className="w-4 h-4 me-1" />
                  )}
                  <span className="font-body">
                    {networkStatus.isOnline ? "Online" : "Offline"}
                  </span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="cartoon-badge bg-yellow-100 text-black"
                >
                  {/* Will keep this here incase we implement live updates via WS */}
                  <Activity strokeWidth={3} className="w-4 h-4 me-1" />
                  <span className="font-body">Live</span>
                </Badge>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium font-body">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isInitialLoading && isEmpty ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <StockCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {stocks.map((stock, index) => (
              <StockCard
                key={`${stock.ticker}-${index}`}
                stock={stock}
                index={index}
              />
            ))}
          </div>
        )}

        {isFetchingNextPage && stocks.length > 0 && (
          <div className="flex justify-center py-12">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}

        {/* Infinite scroll trigger */}
        {!useVirtualization && stocks.length > 0 && hasNextPage && (
          <div className="flex flex-col items-center gap-2 py-6">
            <div ref={loadMoreRef} className="h-4" />
            {!isFetchingNextPage && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                className="text-sm text-gray-600 underline font-body"
              >
                Load more
              </button>
            )}
          </div>
        )}

        {!useVirtualization && stocks.length > 0 && !hasNextPage && (
          <div className="text-center py-10 text-gray-500 text-sm font-body">
            End of results
          </div>
        )}

        {/* Empty results (no error) */}
        {!isFetching && isEmpty && !error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg border border-gray-200 p-8 inline-block">
              <p className="text-gray-900 font-semibold text-xl mb-2 font-heading">
                No stocks found
              </p>
              <p className="text-gray-600 text-sm font-body">
                {query
                  ? `We couldn't find results for "${query}". Try a different term.`
                  : "There are no stocks to display right now."}
              </p>
            </div>
          </div>
        )}

        {!isFetching && isEmpty && error && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg border border-gray-200 p-8 inline-block">
              <p className="text-gray-900 font-semibold text-xl mb-2 font-heading">
                Unable to load stock data
              </p>
              <p className="text-gray-600 text-sm font-body">
                Please check your connection and try refreshing the page
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
