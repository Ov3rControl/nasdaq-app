import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { StockItem } from "@/types/stock";

interface StockCardProps {
  stock: StockItem;
  index: number;
}

export const StockCard = memo(function StockCard({ stock }: StockCardProps) {
  const isGain = stock.change >= 0;

  return (
    <Card className="cartoon-card h-full overflow-hidden">
      <CardContent className="p-5 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="mb-1.5">
              <h3 className="font-black text-base text-foreground uppercase tracking-wide font-body">
                {stock.ticker}
              </h3>
              <p className="text-xs text-foreground/70 line-clamp-1 font-body">
                {stock.name}
              </p>
            </div>
          </div>
          <div className="text-end">
            <p className="text-xl font-black text-foreground font-body">
              {formatCurrency(stock.price)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div
              className={`${
                isGain ? "text-green-700" : "text-red-700"
              } flex items-center gap-1`}
            >
              {isGain ? (
                <TrendingUp strokeWidth={3} className="w-4 h-4" />
              ) : (
                <TrendingDown strokeWidth={3} className="w-4 h-4" />
              )}
              <span className="font-black font-body">
                {isGain ? "+" : ""}
                {formatCurrency(stock.change)}
              </span>
            </div>
            <Badge
              className={`cartoon-badge px-3 py-1 font-body ${
                isGain
                  ? "bg-green-100 text-green-900"
                  : "bg-red-100 text-red-900"
              }`}
            >
              {isGain ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
