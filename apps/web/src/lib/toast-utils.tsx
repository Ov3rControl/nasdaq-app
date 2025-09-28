import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function showErrorToast(message: string, error?: Error) {
  const isRateLimit =
    error?.message?.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("rate limit");

  if (isRateLimit) {
    toast({
      variant: "warning",
      title: "Rate limit reached",
      description:
        "Please wait before loading more stocks. Try again in 15 seconds.",
      duration: 15000,
    });
  } else {
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
      duration: 10000,
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    });
  }
}
