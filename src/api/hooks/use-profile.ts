import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/api/hooks/use-auth";
import {
  getCurrentUserAvatarUrl,
  updateCurrentUserProfileAvatar,
  type ProfileAvatarUpload,
} from "@/lib/pocketbase";
import { formatPocketBaseError } from "@/utils/errors";

export const profileKeys = {
  all: ["profile"] as const,
  avatar: (userId?: string, filename?: unknown, updated?: unknown) =>
    [...profileKeys.all, "avatar", userId, filename, updated] as const,
};

function withCacheBust(url: string, version: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}

/** Reactive avatar URL for the signed-in user (cache-busted when the file changes). */
export function useCurrentUserAvatarUrl(localOverride?: string | null) {
  const { session } = useAuth();
  const record = session?.record;
  const userId = record?.id;
  const avatar = record?.avatar;
  const updated = record?.updated;

  const { data: avatarUrl } = useQuery({
    queryKey: profileKeys.avatar(userId, avatar, updated),
    queryFn: () => {
      const base = getCurrentUserAvatarUrl();
      if (!base) return null;
      return withCacheBust(base, String(updated ?? avatar ?? userId ?? ""));
    },
    enabled: Boolean(session?.isValid && avatar && !localOverride),
  });

  if (localOverride) return localOverride;
  if (!session?.isValid || !avatar) return null;
  return avatarUrl ?? null;
}

export function useUpdateProfileAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatar: ProfileAvatarUpload) => {
      try {
        return await updateCurrentUserProfileAvatar(avatar);
      } catch (error) {
        throw new Error(formatPocketBaseError(error));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
