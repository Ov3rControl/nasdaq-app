import type { StockItem } from "@/types/stock";

export type Stock = StockItem;

export type LoadingState =
  | { tag: "idle" }
  | { tag: "fetching-next"; stocks: Stock[] }
  | { tag: "loading-more" };
