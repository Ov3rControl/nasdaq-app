import { Suspense, lazy } from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { PerformanceMonitor } from "@/components/performance-monitor";
import { Toaster } from "@/components/ui/toaster";

const RouterDevtools = lazy(async () => {
  const mod = await import("@tanstack/react-router-devtools");
  return { default: mod.TanStackRouterDevtools };
});

const RootLayout = () => (
  <>
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
    <PerformanceMonitor />
    <Toaster />
    {import.meta.env.DEV ? (
      <Suspense fallback={null}>
        <RouterDevtools />
      </Suspense>
    ) : null}
  </>
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});
