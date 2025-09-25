export interface StockItem {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface PolygonStock {
  ticker: string
  name: string
  market: string
  locale: string
  primary_exchange: string
  type: string
  active: boolean
  currency_name: string
  cik?: string
  composite_figi?: string
  share_class_figi?: string
  last_updated_utc: string
}

export interface PolygonResponse {
  results: PolygonStock[]
  status: string
  request_id: string
  count: number
  next_url?: string
}

export interface StockSearchResult {
  stocks: StockItem[]
  nextCursor?: string
  hasMore: boolean
}

export interface MarketStatus {
  isOpen: boolean
  nextOpen?: string
  nextClose?: string
}

export interface WatchlistItem extends StockItem {
  addedAt: string
  notes?: string
}

export interface Portfolio {
  id: string
  name: string
  stocks: WatchlistItem[]
  totalValue: number
  totalChange: number
  totalChangePercent: number
  createdAt: string
  updatedAt: string
}
