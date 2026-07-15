import axios, { type AxiosInstance } from "axios";
import { router } from "expo-router";

import { pb } from "@/lib/pocketbase";
import { getPocketBaseUrl } from "@/utils/env";

function serializeParams(params: Record<string, unknown> | undefined): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          searchParams.append(key, String(v));
        }
      }
    } else if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: getPocketBaseUrl(),
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: false,
    paramsSerializer: {
      serialize: serializeParams,
    },
  });

  client.interceptors.request.use(
    (config) => {
      if (pb.authStore.isValid && pb.authStore.token) {
        config.headers.Authorization = `Bearer ${pb.authStore.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        router.replace("/sign-in");
      }
      return Promise.reject(error);
    },
  );

  return client;
}

/** Shared axios instance for domain API calls. */
export const api = createApiClient();
