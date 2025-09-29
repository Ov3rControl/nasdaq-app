import type { PolygonTicker } from "./types";
import type { StockItem } from "@/components/explore-screen/types";

export function normalizeSearch(search?: string): string | undefined {
  const trimmed = search?.trim();
  return trimmed || undefined;
}

export function extractCursor(nextUrl?: string | null): string | undefined {
  if (!nextUrl) return undefined;

  try {
    const url = new URL(nextUrl);
    return url.searchParams.get("cursor") ?? undefined;
  } catch {
    return undefined;
  }
}

export function safeCursor(cursor?: string): string | undefined {
  if (!cursor) return undefined;

  if (/https?:\/\//i.test(cursor)) {
    return extractCursor(cursor);
  }

  return cursor;
}

export function deriveMetrics(ticker: string): {
  price: number;
  change: number;
  changePercent: number;
} {
  let hash = 0;
  for (let index = 0; index < ticker.length; index += 1) {
    hash = (hash * 31 + ticker.charCodeAt(index)) % 100000;
  }

  const price = 50 + (hash % 950);
  const changePercent = ((Math.floor(hash / 13) % 200) - 100) / 10;
  const change = (price * changePercent) / 100;

  return { price, change, changePercent };
}

export function transformToStockItem(ticker: PolygonTicker): StockItem {
  const metrics = deriveMetrics(ticker.ticker);
  return {
    ticker: ticker.ticker,
    name: ticker.name ?? ticker.ticker,
    price: metrics.price,
    change: metrics.change,
    changePercent: metrics.changePercent,
  };
}

export function transformToStockItems(tickers: PolygonTicker[]) {
  return tickers.map(transformToStockItem);
}
