// ============================================================
// TeamHub Frontend — Typed API Request Wrapper
// ============================================================

import { getAuthToken } from "./auth";
import { ApiError } from "@/types";

const API_BASE = "/api";

class ApiRequestError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

/**
 * Typed API request wrapper. Routes through Next.js BFF API routes
 * which proxy to the backend, injecting the auth token.
 */
export async function makeRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, params, headers = {} } = options;

  // Build URL with query params
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  // Inject auth token
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set content type for requests with body
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle non-OK responses
  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: "UNKNOWN_ERROR",
        message: response.statusText || "An unknown error occurred",
        statusCode: response.status,
      };
    }
    throw new ApiRequestError(
      errorData.message,
      errorData.statusCode,
      errorData.error
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// --- Convenience Methods ---

export function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  return makeRequest<T>(path, { method: "GET", params });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return makeRequest<T>(path, { method: "POST", body });
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return makeRequest<T>(path, { method: "PUT", body });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return makeRequest<T>(path, { method: "PATCH", body });
}

export function apiDelete<T>(path: string): Promise<T> {
  return makeRequest<T>(path, { method: "DELETE" });
}

export { ApiRequestError };
