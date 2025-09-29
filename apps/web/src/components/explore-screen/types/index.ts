export interface StockItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export type LoadingState =
  | { tag: "fetching-next"; stocks: StockItem[] }
  | { tag: "loading-more" };
