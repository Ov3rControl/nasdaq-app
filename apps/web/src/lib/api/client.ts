import { API_CONFIG } from "./config";
import { PolygonApiError } from "./errors";

/**
 * Base HTTP client for Polygon API
 */

type RequestOptions = {
  signal?: AbortSignal;
};

/**
 * Make authenticated request to Polygon API
 */
export async function makeRequest(
  url: URL,
  options: RequestOptions = {}
): Promise<unknown> {
  if (!API_CONFIG.POLYGON_API_KEY) {
    throw PolygonApiError.missingApiKey();
  }

  // Add API key to URL
  const requestUrl = new URL(url.toString());
  requestUrl.searchParams.set("apikey", API_CONFIG.POLYGON_API_KEY);

  try {
    const response = await fetch(requestUrl.toString(), {
      signal: options.signal,
    });

    if (!response.ok) {
      // Try to extract error message from response body
      let errorMessage: string | undefined;
      try {
        const errorBody = (await response.json()) as { error?: string };
        errorMessage = errorBody.error;
      } catch {
        // Ignore JSON parse failures for error responses
      }

      throw PolygonApiError.fromResponse(response.status, errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Re-throw abort errors
    if (
      (error instanceof DOMException || error instanceof Error) &&
      error.name === "AbortError"
    ) {
      throw error;
    }

    // Re-throw our custom errors
    if (error instanceof PolygonApiError) {
      throw error;
    }

    // Wrap network errors
    throw PolygonApiError.networkError(error);
  }
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  endpoint: string,
  params: Record<string, string | undefined>
): URL {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}
