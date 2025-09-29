import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./use-debounce";

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 300 },
      }
    );
    expect(result.current).toBe("a");
  });

  it("updates only after the delay window (debounces rapid changes)", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 300 },
      }
    );

    // rapid changes within 300ms should not update immediately
    rerender({ value: "ab", delay: 300 });
    rerender({ value: "abc", delay: 300 });
    expect(result.current).toBe("a");

    // advance less than debounce
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");

    // advance past debounce
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("abc");

    vi.useRealTimers();
  });

  it("resets timer when value changes again within the window", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 1, delay: 200 },
      }
    );

    act(() => {
      rerender({ value: 2, delay: 200 });
      vi.advanceTimersByTime(150);
    });

    // change again before 200ms, should restart timer
    act(() => {
      rerender({ value: 3, delay: 200 });
    });
    expect(result.current).toBe(1);

    // advance to just before the new debounce expires
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe(1);

    // cross the debounce boundary
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(3);

    vi.useRealTimers();
  });
});
