import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "./use-intersection-observer";

interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasNextPage = false,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0,
  rootMargin = "300px 0px 300px 0px",
}: UseInfiniteScrollOptions) {
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const { targetRef: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    enabled: hasNextPage && hasUserScrolled,
  });

  useEffect(() => {
    const onScroll = () => setHasUserScrolled(true);
    if (typeof window !== "undefined") {
      const options: AddEventListenerOptions = { passive: true, once: true };
      window.addEventListener("scroll", onScroll, options);
      return () => window.removeEventListener("scroll", onScroll, options);
    }
  }, []);

  const prevIntersectingRef = useRef(false);
  useEffect(() => {
    if (!hasUserScrolled || !hasNextPage || isFetchingNextPage) return;
    if (isIntersecting && !prevIntersectingRef.current) {
      fetchNextPage();
    }
    prevIntersectingRef.current = isIntersecting;
  }, [
    isIntersecting,
    hasUserScrolled,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return {
    loadMoreRef,
    hasUserScrolled,
  };
}
