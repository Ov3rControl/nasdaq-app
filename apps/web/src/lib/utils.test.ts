import { describe, it, expect } from "vitest";
import { cn, formatCurrency } from "./utils";

describe("cn", () => {
  it("merges class names and removes conflicts", () => {
    expect(cn("p-2", "p-3")).toBe("p-3");
    expect(cn("text-red-500", undefined, "font-bold")).toBe(
      "text-red-500 font-bold"
    );
  });

  it("handles arrays and falsy values", () => {
    expect(cn(["p-2", null, "mx-1"], undefined, "rounded")).toBe(
      "p-2 mx-1 rounded"
    );
  });
});

describe("formatCurrency", () => {
  it("formats positive numbers as USD with 2 decimals", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats negative numbers correctly", () => {
    expect(formatCurrency(-98.765)).toBe("-$98.77");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});
