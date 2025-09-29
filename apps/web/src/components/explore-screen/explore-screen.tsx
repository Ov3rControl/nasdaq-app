import { Header } from "./components/header";
import { StockGrid } from "./components/stock-grid";

export function ExploreScreen() {
  return (
    <div className="min-h-screen paper-bg">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <StockGrid />
      </main>
    </div>
  );
}
