import { API_CONFIG } from "./config";
import { buildUrl, makeRequest } from "./client";
import { PolygonApiError } from "./errors";
import {
  requestSchema,
  polygonResponseSchema,
  type ListTickersParams,
  type ListTickersResponse,
} from "./types";
import {
  normalizeSearch,
  safeCursor,
  extractCursor,
  transformToStockItems,
} from "./transformers";

/**
 * Ticker-specific API operations
 */

/**
 * List NASDAQ tickers with improved response structure for React Query
 */
export async function listNasdaqTickers(
  params: ListTickersParams = {},
  signal?: AbortSignal
): Promise<ListTickersResponse> {
  // Validate and normalize parameters
  const parsedParams = requestSchema.parse({
    limit: params.limit ?? API_CONFIG.DEFAULTS.LIMIT,
    cursor: safeCursor(params.cursor),
    search: normalizeSearch(params.search),
  });

  // Build request URL
  const url = buildUrl(API_CONFIG.ENDPOINTS.TICKERS, {
    market: API_CONFIG.DEFAULTS.MARKET,
    exchange: API_CONFIG.DEFAULTS.EXCHANGE,
    sort: API_CONFIG.DEFAULTS.SORT,
    active: String(API_CONFIG.DEFAULTS.ACTIVE),
    limit: String(parsedParams.limit),
    search: parsedParams.search,
    cursor: parsedParams.cursor,
  });

  // Make request
  const rawResponse = await makeRequest(url, { signal });

  // Validate response shape
  const parsedResponse = polygonResponseSchema.safeParse(rawResponse);
  if (!parsedResponse.success) {
    throw PolygonApiError.invalidResponse(parsedResponse.error.message);
  }

  const data = parsedResponse.data;

  // Check API status
  if (data.status !== "OK") {
    throw new PolygonApiError(
      data.error ?? `Polygon request failed with status: ${data.status}`
    );
  }

  // Transform and return data
  return {
    stocks: transformToStockItems(data.results),
    next_url: data.next_url ?? undefined,
    nextCursor: extractCursor(data.next_url),
    count: data.count,
    request_id: data.request_id,
  };
}
