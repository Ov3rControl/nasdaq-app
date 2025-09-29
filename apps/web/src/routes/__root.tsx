import { Suspense } from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border-[3px] border-black rounded-lg p-8 retro-shadow-lg">
        <h1 className="text-2xl font-black font-heading text-destructive mb-4">
          Something went wrong
        </h1>
        <p className="text-foreground/80 font-body mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-primary border-[3px] border-black rounded font-bold hover:transform hover:translate-y-[-2px] transition-transform"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-white border-[3px] border-black rounded font-bold hover:transform hover:translate-y-[-2px] transition-transform"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

const RootLayout = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
    <Toaster />
  </ErrorBoundary>
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});
