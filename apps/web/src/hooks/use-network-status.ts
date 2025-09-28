import { useState, useEffect } from "react";

interface ConnectionProperties {
  effectiveType: string;
  downlink: number;
  rtt: number;
}

interface NetworkInformation extends EventTarget, ConnectionProperties {}

interface NetworkStatus {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}
export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const connection = navigator.connection;

    const updateNetworkStatus = () => {
      setNetworkStatus({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
      });
    };

    const handleNetworkChange = () => updateNetworkStatus();

    updateNetworkStatus();

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    if (connection) {
      connection.addEventListener("change", handleNetworkChange);
    }

    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);

      if (connection) {
        connection.removeEventListener("change", handleNetworkChange);
      }
    };
  }, []);

  return networkStatus;
}
