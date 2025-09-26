import { useEffect, useState } from "react";
import { SplashScreen } from "./components/splash-screen";
import { ExploreScreen } from "./components/explore-screen";
import { PerformanceMonitor } from "./components/performance-monitor";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <>
        <SplashScreen />
        <PerformanceMonitor />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <ExploreScreen />
      <PerformanceMonitor />
      <Toaster />
      <Analytics />
    </>
  );
}

export default App;
