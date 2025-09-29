import { toast } from "sonner";

export function showErrorToast(message: string, error?: Error) {
  const isRateLimit =
    error?.message?.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("rate limit");

  if (isRateLimit) {
    toast.warning("Rate limit reached", {
      description:
        "Please wait before loading more stocks. Try again in 15 seconds.",
      duration: 15000,
    });
  } else {
    toast.error("Error", {
      description: message,
      duration: 10000,
    });
  }
}
