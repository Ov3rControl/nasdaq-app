"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  startTransition,
} from "react";
import {
  Search,
  AlertCircle,
  Wifi,
  WifiOff,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { generateMockStockData } from "@/lib/utils";
import type { StockItem } from "@/types/stock";

export function StockExplorer() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const networkStatus = useNetworkStatus();
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Mock data loading function
  const loadStocks = useCallback(
    async (searchQuery: string = "", append: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generate mock data
        const mockData = generateMockStockData(20);
        const filteredData = searchQuery
          ? mockData.filter(
              (stock) =>
                stock.ticker
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                stock.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : mockData;

        startTransition(() => {
          if (append) {
            setStocks((prev) => [...prev, ...filteredData]);
          } else {
            setStocks(filteredData);
          }

          // Simulate pagination
          setNextCursor(filteredData.length >= 20 ? "next-page" : null);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stocks");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Filter stocks based on search
  const filteredStocks = useMemo(() => {
    if (!debouncedSearch) return stocks;
    return stocks.filter(
      (stock) =>
        stock.ticker.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        stock.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [stocks, debouncedSearch]);

  // Load more when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && !loading && nextCursor) {
      loadStocks(debouncedSearch, true);
    }
  }, [isIntersecting, loading, nextCursor, debouncedSearch, loadStocks]);

  useEffect(() => {
    loadStocks(debouncedSearch, false);
  }, [debouncedSearch, loadStocks]);

  // Calculate stats
  const totalMarketCap = stocks.reduce(
    (sum, stock) => sum + stock.price * 1000000,
    0
  );
  const gainers = stocks.filter((stock) => stock.change > 0).length;
  const losers = stocks.filter((stock) => stock.change < 0).length;
  const avgChange =
    stocks.length > 0
      ? stocks.reduce((sum, stock) => sum + stock.changePercent, 0) /
        stocks.length
      : 0;

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 p-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                NASDAQ Dashboard
              </h1>
              <p className="text-gray-600">
                Hi, Welcome back to your trading dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-80 h-12 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-0"
                />
              </div>
              <Button className="h-12 px-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Filter className="h-5 w-5 mr-2" />
                Filter Periods
              </Button>
              <div className="flex items-center gap-2">
                <Badge
                  variant={networkStatus.isOnline ? "default" : "destructive"}
                  className="border-2 border-black"
                >
                  {networkStatus.isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 mr-1" />
                      Online
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 mr-1" />
                      Offline
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Market Cap
                  </h3>
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-black">
                    <DollarSign className="h-6 w-6 text-black" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatNumber(totalMarketCap)}
                </div>
                <div className="flex items-center">
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    +2.5%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Gainers
                  </h3>
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-black">
                    <TrendingUp className="h-6 w-6 text-black" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {gainers}
                </div>
                <div className="flex items-center">
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    +12.5%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Losers
                  </h3>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center border-2 border-black">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {losers}
                </div>
                <div className="flex items-center">
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                    -8.5%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Average Change
                  </h3>
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-black">
                    <Activity className="h-6 w-6 text-black" />
                  </div>
                </div>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    avgChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {avgChange >= 0 ? "+" : ""}
                  {avgChange.toFixed(1)}%
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-sm px-2 py-1 rounded font-medium ${
                      avgChange >= 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {avgChange >= 0 ? "+2.5%" : "-2.5%"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="retro-card bg-destructive text-destructive-foreground p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error loading stocks</span>
            </div>
            <p className="mt-2">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Stock Data
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-gray-900">
                      Stock Details
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-900">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-900">
                      Change
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.slice(0, 10).map((stock, index) => (
                    <tr
                      key={`${stock.ticker}-${index}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-black">
                            <span className="font-bold text-sm">
                              {stock.ticker.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {stock.ticker}
                            </div>
                            <div className="text-sm text-gray-600">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-lg">
                          ${stock.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-lg">
                          ${stock.change.toFixed(2)}
                        </div>
                        <div
                          className={`text-sm ${
                            stock.changePercent >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`px-3 py-1 rounded-full font-medium border-2 border-black ${
                            stock.change >= 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stock.change >= 0 ? "Delivered" : "Cancelled"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Show All Button */}
        {filteredStocks.length > 10 && (
          <div className="mt-6 text-center">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Show All {filteredStocks.length} Stocks
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex space-x-4">
              <div
                className="w-6 h-6 retro-border animate-bounce retro-shadow"
                style={{ background: "var(--color-primary)" }}
              />
              <div
                className="w-6 h-6 retro-border animate-bounce retro-shadow"
                style={{
                  background: "var(--color-accent)",
                  animationDelay: "0.1s",
                }}
              />
              <div
                className="w-6 h-6 retro-border animate-bounce retro-shadow"
                style={{
                  background: "var(--color-secondary)",
                  animationDelay: "0.2s",
                }}
              />
            </div>
          </div>
        )}

        {/* Intersection Observer Target */}
        {nextCursor && !loading && (
          <div
            ref={targetRef}
            className="h-10 flex items-center justify-center"
          >
            <span className="text-muted-foreground">Loading more...</span>
          </div>
        )}
      </main>
    </div>
  );
}
