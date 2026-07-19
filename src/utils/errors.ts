import axios from "axios";
import { ClientResponseError } from "pocketbase";

export class ApiError extends Error {
  readonly status?: number;
  readonly data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const message =
      (typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string" &&
        (data as { message: string }).message) ||
      error.message ||
      "Request failed";

    return new ApiError(message, status, data);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Unknown error");
}

/** Normalize TanStack Form / Standard Schema field errors to a display string. */
export function getFieldError(errors: unknown[]): string | undefined {
  const first = errors[0];
  if (first == null) {
    return undefined;
  }
  if (typeof first === "string") {
    return first;
  }
  if (
    typeof first === "object" &&
    "message" in first &&
    typeof first.message === "string"
  ) {
    return first.message;
  }
  return undefined;
}

/** Human-readable PocketBase ClientResponseError, including field messages. */
export function formatPocketBaseError(error: unknown): string {
  if (!(error instanceof ClientResponseError)) {
    return error instanceof Error ? error.message : "Request failed";
  }

  const fieldErrors = error.data ?? {};
  const details = Object.entries(fieldErrors)
    .filter(([, value]) => value && typeof value === "object")
    .map(([key, value]) => {
      const message =
        typeof value === "object" &&
        value !== null &&
        "message" in value &&
        typeof value.message === "string"
          ? value.message
          : JSON.stringify(value);
      return `${key}: ${message}`;
    });

  if (details.length > 0) {
    return `${error.message} (${details.join("; ")})`;
  }

  return error.message;
}
