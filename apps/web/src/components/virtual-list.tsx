"use client"

import type React from "react"
import { useMemo, useState, useRef } from "react"
import type { StockItem } from "@/types/stock"

interface VirtualListProps {
  items: StockItem[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: StockItem, index: number) => React.ReactNode
  overscan?: number
}

export function VirtualList({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem, 
  overscan = 5 
}: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight), 
      items.length - 1
    )

    const start = Math.max(0, visibleStart - overscan)
    const end = Math.min(items.length - 1, visibleEnd + overscan)

    const visibleItems = items.slice(start, end + 1).map((item, index) => ({
      item,
      index: start + index,
    }))

    return {
      visibleItems,
      totalHeight: items.length * itemHeight,
      offsetY: start * itemHeight,
    }
  }, [scrollTop, itemHeight, containerHeight, items, overscan])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={scrollElementRef}
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={handleScroll}
      className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={`${item.ticker}-${index}`} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
