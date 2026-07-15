import { useAuth } from "@/api/hooks/use-auth";

/**
 * Thin wrapper around PocketBase auth for consistent imports from `@/api`.
 */
export function useAuthSession() {
  return useAuth();
}

export { useAuth as useSession };
