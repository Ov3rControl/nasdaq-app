import { API_CONFIG } from "./config";
import { PolygonApiError } from "./errors";

type RequestOptions = {
  signal?: AbortSignal;
};

export async function makeRequest(
  url: URL,
  options: RequestOptions = {}
): Promise<unknown> {
  if (!API_CONFIG.POLYGON_API_KEY) {
    throw PolygonApiError.missingApiKey();
  }

  const requestUrl = new URL(url.toString());
  requestUrl.searchParams.set("apikey", API_CONFIG.POLYGON_API_KEY);

  try {
    const response = await fetch(requestUrl.toString(), {
      signal: options.signal,
    });

    if (!response.ok) {
      let errorMessage: string | undefined;
      try {
        const errorBody = (await response.json()) as { error?: string };
        errorMessage = errorBody.error;
      } catch {
        errorMessage = undefined;
      }

      throw PolygonApiError.fromResponse(response.status, errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (
      (error instanceof DOMException || error instanceof Error) &&
      error.name === "AbortError"
    ) {
      throw error;
    }

    if (error instanceof PolygonApiError) {
      throw error;
    }

    throw PolygonApiError.networkError(error);
  }
}

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
