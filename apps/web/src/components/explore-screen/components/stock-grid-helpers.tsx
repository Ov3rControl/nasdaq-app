import { StockCard } from "./stock-card";
import { StockCardSkeleton } from "./stock-card-skeleton";
import type { StockItem } from "../types";

const SKELETON_COUNT = 12;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => i);
const GRID_CLASS_NAME =
  "grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";

export function LoadingSkeleton() {
  return (
    <div className={GRID_CLASS_NAME}>
      {SKELETON_KEYS.map((i) => (
        <StockCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="bg-white rounded-lg border border-gray-200 p-8 inline-block">
        <p className="text-gray-900 font-semibold text-xl mb-2 font-heading">
          No stocks found
        </p>
        <p className="text-gray-600 text-sm font-body">
          Try adjusting your search or check back later.
        </p>
      </div>
    </div>
  );
}

export function LoadingIndicator() {
  return (
    <div className="flex justify-center py-12">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100" />
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  );
}

export function EndOfResults() {
  return (
    <div className="text-center py-10 text-gray-500 text-sm font-body">
      End of results
    </div>
  );
}

export function StockList({ stocks }: { stocks: StockItem[] }) {
  return (
    <div className={GRID_CLASS_NAME}>
      {stocks.map((stock) => (
        <StockCard key={stock.ticker} stock={stock} />
      ))}
    </div>
  );
}

StockList.whyDidYouRender = true;
