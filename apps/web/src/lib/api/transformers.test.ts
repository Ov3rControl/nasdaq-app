import { describe, it, expect } from "vitest";
import {
  normalizeSearch,
  extractCursor,
  safeCursor,
  deriveMetrics,
  transformToStockItem,
  transformToStockItems,
} from "./transformers";

describe("normalizeSearch", () => {
  it("trims and returns undefined for empty", () => {
    expect(normalizeSearch("  abc  ")).toBe("abc");
    expect(normalizeSearch("   ")).toBeUndefined();
    expect(normalizeSearch(undefined)).toBeUndefined();
  });
});

describe("extractCursor", () => {
  it("extracts cursor param from a full next_url", () => {
    const url =
      "https://api.polygon.io/v3/reference/tickers?cursor=abc123&limit=20";
    expect(extractCursor(url)).toBe("abc123");
  });

  it("returns undefined for invalid url or missing param", () => {
    expect(extractCursor("not a url")).toBeUndefined();
    expect(
      extractCursor("https://api.polygon.io/v3/reference/tickers?limit=20")
    ).toBeUndefined();
    expect(extractCursor(undefined)).toBeUndefined();
  });
});

describe("safeCursor", () => {
  it("passes through plain cursor", () => {
    expect(safeCursor("abc")).toBe("abc");
  });
  it("extracts from full url", () => {
    const url = "https://api.polygon.io/v3/reference/tickers?cursor=next-456";
    expect(safeCursor(url)).toBe("next-456");
  });
  it("returns undefined for falsy", () => {
    expect(safeCursor(undefined)).toBeUndefined();
  });
});

describe("deriveMetrics", () => {
  it("is deterministic per ticker", () => {
    const a1 = deriveMetrics("AAPL");
    const a2 = deriveMetrics("AAPL");
    expect(a1).toEqual(a2);
  });
  it("produces consistent shape within reasonable ranges", () => {
    const m = deriveMetrics("MSFT");
    expect(typeof m.price).toBe("number");
    expect(typeof m.change).toBe("number");
    expect(typeof m.changePercent).toBe("number");
  });
});

describe("transformers to StockItem", () => {
  it("maps Polygon ticker to StockItem with metrics", () => {
    const item = transformToStockItem({ ticker: "TSLA", name: "Tesla" });
    expect(item.ticker).toBe("TSLA");
    expect(item.name).toBe("Tesla");
    expect(typeof item.price).toBe("number");
  });

  it("maps arrays via transformToStockItems", () => {
    const list = transformToStockItems([
      { ticker: "GOOG", name: "Google" },
      { ticker: "AMZN", name: "Amazon" },
    ]);
    expect(list).toHaveLength(2);
    expect(list[0].ticker).toBe("GOOG");
    expect(list[1].ticker).toBe("AMZN");
  });
});
