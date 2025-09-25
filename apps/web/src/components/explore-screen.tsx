"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  startTransition,
} from "react";
import { Search, AlertCircle, Wifi, WifiOff, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StockCard } from "@/components/stock-card";
import { VirtualList } from "@/components/virtual-list";
import { StockCardSkeleton } from "@/components/stock-card-skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { generateMockStockData } from "@/lib/utils";
import type { StockItem } from "@/types/stock";

export function ExploreScreen() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [useVirtualization, setUseVirtualization] = useState(false);

  const networkStatus = useNetworkStatus();
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Intersection observer for infinite scroll
  const { targetRef: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  // Memoized filtered stocks for performance
  const filteredStocks = useMemo(() => {
    if (!debouncedSearch) return stocks;
    return stocks.filter(
      (stock) =>
        stock.ticker.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        stock.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [stocks, debouncedSearch]);

  const loadStocks = useCallback(
    async (search = "", isLoadMore = false) => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generate mock data
        const mockData = generateMockStockData(20);
        const result = {
          stocks: mockData,
          nextCursor: mockData.length >= 20 ? "next-page" : undefined,
        };

        startTransition(() => {
          if (isLoadMore) {
            setStocks((prev) => [...prev, ...result.stocks]);
          } else {
            setStocks(result.stocks);
          }
          setNextCursor(result.nextCursor);
        });
      } catch (err) {
        console.error("API Error:", err);
        setError("Network error. Please check your connection and try again.");

        if (!isLoadMore) {
          setStocks([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [nextCursor]
  );

  // Load more when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && !loading && nextCursor) {
      loadStocks(debouncedSearch, true);
    }
  }, [isIntersecting, loading, nextCursor, debouncedSearch, loadStocks]);

  useEffect(() => {
    loadStocks(debouncedSearch, false);
  }, [debouncedSearch, loadStocks]);

  // Enable virtualization for large datasets
  useEffect(() => {
    const shouldVirtualize =
      stocks.length > 100 &&
      (typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
    setUseVirtualization(shouldVirtualize);
  }, [stocks.length]);
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

  const renderStockItem = useCallback((stock: StockItem, index: number) => {
    return (
      <StockCard key={`${stock.ticker}-${index}`} stock={stock} index={index} />
    );
  }, []);

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 w-full bg-white border-[3px] border-black focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  style={{ borderRadius: "6px" }}
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
                  <Activity strokeWidth={3} className="w-4 h-4 me-1" />
                  <span className="font-body">Live</span>
                </Badge>

                {useVirtualization && (
                  <Badge
                    variant="outline"
                    className="cartoon-badge text-xs bg-white"
                  >
                    <span className="font-body">Virtual</span>
                  </Badge>
                )}
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
        {loading && filteredStocks.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <StockCardSkeleton key={i} />
            ))}
          </div>
        ) : useVirtualization ? (
          <VirtualList
            items={filteredStocks}
            itemHeight={180}
            containerHeight={600}
            renderItem={renderStockItem}
            overscan={5}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredStocks.map((stock, index) => (
              <StockCard
                key={`${stock.ticker}-${index}`}
                stock={stock}
                index={index}
              />
            ))}
          </div>
        )}

        {loading && filteredStocks.length > 0 && (
          <div className="flex justify-center py-12">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}

        {/* Infinite scroll trigger */}
        {!useVirtualization &&
          !loading &&
          filteredStocks.length > 0 &&
          nextCursor && (
            <div
              ref={loadMoreRef}
              className="h-10 flex items-center justify-center"
            >
              <span className="text-sm text-gray-500 font-body">
                Loading more...
              </span>
            </div>
          )}

        {!loading && filteredStocks.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg border border-gray-200 p-8 inline-block">
              <p className="text-gray-900 font-semibold text-xl mb-2 font-heading">
                No stocks found matching "{searchQuery}"
              </p>
              <p className="text-gray-600 text-sm font-body">
                Try a different search term or browse all stocks
              </p>
            </div>
          </div>
        )}

        {!loading && filteredStocks.length === 0 && !searchQuery && error && (
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
