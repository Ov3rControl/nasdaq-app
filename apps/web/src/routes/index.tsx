import { useEffect } from "react";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { SplashScreen } from "@/components/splash-screen";
import { useQueryClient } from "@tanstack/react-query";
import { tickersQueryOptions } from "@/lib/stocks-query";

const SPLASH_DURATION_MS = 3000;

export const Route = createFileRoute("/")({
  component: SplashRoute,
});

function SplashRoute() {
  const navigate = useNavigate({ from: "/" });
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    let isActive = true;

    qc.prefetchInfiniteQuery(tickersQueryOptions());

    const timer = window.setTimeout(() => {
      if (!isActive) return;
      navigate({
        to: "/explore",
        replace: true,
        viewTransition: { types: ["slide-left"] },
      });
    }, SPLASH_DURATION_MS);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [navigate, qc, router]);

  return <SplashScreen />;
}
