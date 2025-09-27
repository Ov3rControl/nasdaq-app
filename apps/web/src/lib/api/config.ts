/**
 * API Configuration
 */

export const API_CONFIG = {
  POLYGON_API_KEY: import.meta.env.VITE_POLYGON_API_KEY as string | undefined,
  BASE_URL: "https://api.polygon.io",
  ENDPOINTS: {
    TICKERS: "/v3/reference/tickers",
  },
  DEFAULTS: {
    MARKET: "stocks",
    EXCHANGE: "XNAS", // NASDAQ
    SORT: "ticker",
    ACTIVE: true,
    LIMIT: 20,
    MAX_LIMIT: 1000,
  },
} as const;
