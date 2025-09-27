/**
 * Custom API Error Classes
 */

export class PolygonApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "PolygonApiError";
    this.status = status;
    this.code = code;
  }

  static fromResponse(status: number, errorMessage?: string): PolygonApiError {
    switch (status) {
      case 429:
        return new PolygonApiError(
          "Rate limit exceeded. Please try again later.",
          429,
          "RATE_LIMIT"
        );
      case 401:
        return new PolygonApiError("Invalid API key", 401, "UNAUTHORIZED");
      case 403:
        return new PolygonApiError(
          "Access forbidden. Check your API key permissions.",
          403,
          "FORBIDDEN"
        );
      default:
        return new PolygonApiError(
          errorMessage ?? `API request failed: ${status}`,
          status
        );
    }
  }

  static networkError(error: unknown): PolygonApiError {
    return new PolygonApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  static missingApiKey(): PolygonApiError {
    return new PolygonApiError(
      "Polygon API key is not configured. Set VITE_POLYGON_API_KEY in your environment."
    );
  }

  static invalidResponse(message: string): PolygonApiError {
    return new PolygonApiError(`Unexpected response from Polygon: ${message}`);
  }
}
