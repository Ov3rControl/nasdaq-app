import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

export function generateMockStockData(count: number = 20) {
  const tickers = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 
    'ADBE', 'CRM', 'ORCL', 'INTC', 'AMD', 'PYPL', 'UBER', 'SPOT',
    'ZOOM', 'DOCU', 'SHOP', 'SQ', 'ROKU', 'TWLO', 'OKTA', 'ZM'
  ]
  
  const companies = [
    'Apple Inc.', 'Alphabet Inc.', 'Microsoft Corporation', 'Amazon.com Inc.',
    'Tesla Inc.', 'Meta Platforms Inc.', 'NVIDIA Corporation', 'Netflix Inc.',
    'Adobe Inc.', 'Salesforce Inc.', 'Oracle Corporation', 'Intel Corporation',
    'Advanced Micro Devices', 'PayPal Holdings', 'Uber Technologies', 'Spotify Technology',
    'Zoom Video Communications', 'DocuSign Inc.', 'Shopify Inc.', 'Block Inc.',
    'Roku Inc.', 'Twilio Inc.', 'Okta Inc.', 'Zoom Video Communications'
  ]

  return Array.from({ length: count }, (_, index) => {
    const basePrice = Math.random() * 500 + 50
    const changePercent = (Math.random() - 0.5) * 10
    const change = (basePrice * changePercent) / 100
    
    return {
      ticker: tickers[index % tickers.length],
      name: companies[index % companies.length],
      price: basePrice,
      change: change,
      changePercent: changePercent,
    }
  })
}
