import { useEffect, useState } from "react";
import { SplashScreen } from "./components/splash-screen";
import { ExploreScreen } from "./components/explore-screen";

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
      </>
    );
  }

  return (
    <>
      <ExploreScreen />
    </>
  );
}

export default App;
