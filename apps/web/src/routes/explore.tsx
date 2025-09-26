import { Suspense, lazy } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { tickersQueryOptions } from "@/lib/stocks-query";

const ExploreScreen = lazy(async () => {
  const mod = await import("@/components/explore-screen");
  return { default: mod.ExploreScreen };
});

const searchSchema = z
  .object({
    q: z
      .string()
      .transform((s) => s.trim())
      .default(""),
  })
  .partial();

export const Route = createFileRoute("/explore")({
  validateSearch: zodValidator(searchSchema),
  search: { middlewares: [stripSearchParams({ q: "" })] },
  // Preload first page of tickers before navigation completes
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    // Get search query from deps
    const q = deps.search?.q ?? "";

    // Prime the cache with the first page of results
    try {
      await context.queryClient.ensureInfiniteQueryData(tickersQueryOptions(q));
    } catch {
      // Swallow preloading errors (e.g. 429) to keep page rendering
    }

    return null;
  },
  // Optional: Add pending component for better UX during navigation
  pendingComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-muted-foreground">Loading stocks...</div>
    </div>
  ),
  component: ExploreRoute,
});

function ExploreRoute() {
  const { q } = Route.useSearch();
  return (
    <Suspense fallback={null}>
      <ExploreScreen initialQuery={q ?? ""} />
    </Suspense>
  );
}
