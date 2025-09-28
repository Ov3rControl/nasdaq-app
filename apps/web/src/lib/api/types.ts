import { z } from "zod";

/**
 * API Request/Response Types and Schemas
 */

export const requestSchema = z.object({
  limit: z.number().int().min(1).max(1000).default(20),
  cursor: z.string().optional(),
  search: z.string().trim().min(1).max(50).optional(),
});

export const polygonTickerSchema = z.object({
  ticker: z.string(),
  name: z.string().optional().nullable(),
});

export const polygonResponseSchema = z.object({
  status: z.string(),
  error: z.string().optional(),
  results: z.array(polygonTickerSchema).default([]),
  next_url: z.string().optional().nullable(),
  request_id: z.string().optional(),
  count: z.number().int().optional(),
});

export type PolygonTicker = z.infer<typeof polygonTickerSchema>;
export type PolygonResponse = z.infer<typeof polygonResponseSchema>;

export type ListTickersParams = {
  search?: string;
  cursor?: string;
  limit?: number;
};

export type ListTickersResponse = {
  stocks: Array<{
    ticker: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  next_url?: string;
  nextCursor?: string;
  count?: number;
  request_id?: string;
};
