import { z } from "zod";
import type { StockItem } from "@/types/stock";

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const BASE_URL = "https://api.polygon.io";

type RequestOptions = {
  signal?: AbortSignal;
};

export class PolygonApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "PolygonApiError";
    this.status = status;
    this.code = code;
  }
}

const requestSchema = z.object({
  limit: z.number().int().min(1).max(1000).default(20),
  cursor: z.string().optional(),
  search: z.string().trim().min(1).max(50).optional(),
});

const polygonTickerSchema = z.object({
  ticker: z.string(),
  name: z.string().optional().nullable(),
});

type PolygonTicker = z.infer<typeof polygonTickerSchema>;

const polygonResponseSchema = z.object({
  status: z.string(),
  error: z.string().optional(),
  results: z.array(polygonTickerSchema).default([]),
  next_url: z.string().optional().nullable(),
  request_id: z.string().optional(),
  count: z.number().int().optional(),
});

function normalizeSearch(search?: string) {
  const trimmed = search?.trim();
  return trimmed ? trimmed : undefined;
}

function deriveMetrics(ticker: string) {
  let hash = 0;
  for (let index = 0; index < ticker.length; index += 1) {
    hash = (hash * 31 + ticker.charCodeAt(index)) % 100000;
  }

  const price = 50 + (hash % 950);
  const changePercent = ((Math.floor(hash / 13) % 200) - 100) / 10;
  const change = (price * changePercent) / 100;

  return { price, change, changePercent };
}

function getNextCursor(nextUrl?: string | null) {
  if (!nextUrl) {
    return undefined;
  }

  try {
    const url = new URL(nextUrl);
    return url.searchParams.get("cursor") ?? undefined;
  } catch {
    return undefined;
  }
}

function mapToStocks(results: PolygonTicker[]): StockItem[] {
  return results.map((result) => {
    const metrics = deriveMetrics(result.ticker);
    return {
      ticker: result.ticker,
      name: result.name ?? result.ticker,
      price: metrics.price,
      change: metrics.change,
      changePercent: metrics.changePercent,
    };
  });
}

async function makeRequest(
  url: URL,
  options: RequestOptions
): Promise<unknown> {
  if (!POLYGON_API_KEY) {
    throw new PolygonApiError(
      "Polygon API key is not configured. Set VITE_POLYGON_API_KEY in your environment."
    );
  }

  const requestUrl = new URL(url.toString());
  requestUrl.searchParams.set("apikey", POLYGON_API_KEY);

  try {
    const response = await fetch(requestUrl.toString(), {
      signal: options.signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new PolygonApiError(
          "Rate limit exceeded. Please try again later.",
          429,
          "RATE_LIMIT"
        );
      }
      if (response.status === 401) {
        throw new PolygonApiError("Invalid API key", 401, "UNAUTHORIZED");
      }
      if (response.status === 403) {
        throw new PolygonApiError(
          "Access forbidden. Check your API key permissions.",
          403,
          "FORBIDDEN"
        );
      }

      let errorMessage = `API request failed: ${response.status}`;
      try {
        const errorBody = (await response.json()) as { error?: string };
        if (errorBody.error) {
          errorMessage = errorBody.error;
        }
      } catch {
        // Ignore JSON parse failures for error responses.
      }

      throw new PolygonApiError(errorMessage, response.status);
    }

    const json = await response.json();
    return json as unknown;
  } catch (error) {
    if (
      (error instanceof DOMException || error instanceof Error) &&
      error.name === "AbortError"
    ) {
      throw error;
    }
    if (error instanceof PolygonApiError) {
      throw error;
    }
    throw new PolygonApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// New API structure for better React Query integration
export type ListTickersParams = {
  search?: string;
  cursor?: string;
  limit?: number;
};

export type ListTickersResponse = {
  stocks: StockItem[];
  next_url?: string;
  nextCursor?: string;
  count?: number;
  request_id?: string;
};

/**
 * List NASDAQ tickers with improved response structure for React Query
 * @param params - Query parameters
 * @param signal - AbortSignal for request cancellation
 */
export async function listNasdaqTickers(
  params: ListTickersParams = {},
  signal?: AbortSignal
): Promise<ListTickersResponse> {
  const { search, cursor, limit = 20 } = params;

  // If a full next_url was accidentally passed as the cursor (from older code),
  // extract the actual cursor token from it.
  let safeCursor = cursor;
  if (cursor && /https?:\/\//i.test(cursor)) {
    try {
      const url = new URL(cursor);
      safeCursor = url.searchParams.get("cursor") ?? undefined;
    } catch {
      safeCursor = undefined;
    }
  }

  const parsedParams = requestSchema.parse({
    limit,
    cursor: safeCursor,
    search: normalizeSearch(search),
  });

  const url = new URL(`${BASE_URL}/v3/reference/tickers`);
  url.searchParams.set("market", "stocks");
  url.searchParams.set("exchange", "XNAS");
  url.searchParams.set("sort", "ticker");
  url.searchParams.set("limit", parsedParams.limit.toString());
  url.searchParams.set("active", "true");

  if (parsedParams.search) {
    url.searchParams.set("search", parsedParams.search);
  }

  if (parsedParams.cursor) {
    url.searchParams.set("cursor", parsedParams.cursor);
  }

  const rawResponse = await makeRequest(url, { signal });
  const parsedResponse = polygonResponseSchema.safeParse(rawResponse);

  if (!parsedResponse.success) {
    throw new PolygonApiError(
      `Unexpected response from Polygon: ${parsedResponse.error.message}`
    );
  }

  const data = parsedResponse.data;

  if (data.status !== "OK") {
    throw new PolygonApiError(
      data.error ?? `Polygon request failed with status: ${data.status}`
    );
  }

  return {
    stocks: mapToStocks(data.results),
    next_url: data.next_url ?? undefined,
    nextCursor: getNextCursor(data.next_url),
    count: data.count,
    request_id: data.request_id,
  };
}
