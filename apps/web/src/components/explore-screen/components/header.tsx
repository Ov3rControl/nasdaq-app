import { Search, Wifi, WifiOff, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useSearchWithURL } from "../hooks/use-search-with-url";
import { match } from "ts-pattern";

type NetworkStatusVariant = "online" | "offline";

function StatusBadges() {
  const networkStatus = useNetworkStatus();
  const networkVariant: NetworkStatusVariant = networkStatus.isOnline
    ? "online"
    : "offline";

  const NetworkBadge = match(networkVariant)
    .with("online", () => (
      <Badge
        variant="default"
        className="cartoon-badge bg-emerald-100 text-emerald-900"
      >
        <Wifi strokeWidth={3} className="w-4 h-4 me-1" />
        <span className="font-body">Online</span>
      </Badge>
    ))
    .with("offline", () => (
      <Badge
        variant="destructive"
        className="cartoon-badge bg-red-100 text-red-900"
      >
        <WifiOff strokeWidth={3} className="w-4 h-4 me-1" />
        <span className="font-body">Offline</span>
      </Badge>
    ))
    .exhaustive();

  return (
    <div className="flex items-center gap-2">
      {NetworkBadge}
      <Badge
        variant="secondary"
        className="cartoon-badge bg-yellow-100 text-black"
      >
        <Activity strokeWidth={3} className="w-4 h-4 me-1" />
        <span className="font-body">Live</span>
      </Badge>
    </div>
  );
}

export function Header() {
  const { input, setInput, isPending } = useSearchWithURL();
  return (
    <div className="bg-background border-b-[2px] border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div
              className="w-12 h-12 bg-[var(--primary)] flex items-center justify-center border-[3px] border-black nasdaq-icon"
              style={{ borderRadius: "6px" }}
            >
              <span className="text-black font-bold text-xl font-heading">
                N
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">
                NASDAQ Explorer
              </h1>
              <span className="cartoon-pill font-body">
                Real-time Stock Explorer
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:flex-1 md:max-w-4xl">
            <div className="relative flex-1">
              <Search
                strokeWidth={3}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70 h-5 w-5"
              />
              <Input
                placeholder="Search stocks by symbol or name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ opacity: isPending ? 0.7 : 1, borderRadius: "6px" }}
                className="pl-12 h-12 w-full bg-white border-[3px] border-black focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </div>

            <StatusBadges />
          </div>
        </div>
      </div>
    </div>
  );
}

Header.whyDidYouRender = true;
