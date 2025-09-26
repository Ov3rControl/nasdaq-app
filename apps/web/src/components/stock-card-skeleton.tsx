import { Card, CardContent } from "@/components/ui/card";

export function StockCardSkeleton() {
  return (
    <Card className="cartoon-card overflow-hidden h-full">
      <CardContent className="p-5 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="space-y-2">
              <div className="h-5 w-16 skeleton rounded" />
              <div className="h-3 w-40 skeleton rounded" />
            </div>
          </div>
          <div className="text-end">
            <div className="h-7 w-24 skeleton rounded" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 skeleton rounded-full" />
            <div className="h-4 w-16 skeleton rounded" />
          </div>
          <div className="h-6 w-16 skeleton rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
