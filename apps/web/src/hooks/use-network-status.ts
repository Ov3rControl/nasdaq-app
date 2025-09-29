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
  // Initialize with current status to avoid re-render
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => {
    if (typeof navigator === "undefined") {
      return { isOnline: true };
    }

    const connection = navigator.connection;
    return {
      isOnline: navigator.onLine,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
    };
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

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    if (connection) {
      connection.addEventListener("change", updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);

      if (connection) {
        connection.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}
