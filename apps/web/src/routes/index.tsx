import { useEffect } from "react";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { SplashScreen } from "@/components/splash-screen";

const SPLASH_DURATION_MS = 3000;

export const Route = createFileRoute("/")({
  component: SplashRoute,
});

function SplashRoute() {
  const navigate = useNavigate({ from: "/" });
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    router.preloadRoute({ to: "/explore" }).catch((error) => {
      if (import.meta.env.DEV) {
        console.error("Failed to preload explore route", error);
      }
    });

    const timer = window.setTimeout(() => {
      if (!isActive) return;

      // Use TanStack Router's built-in view transitions
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
  }, [navigate, router]);

  return <SplashScreen />;
}
