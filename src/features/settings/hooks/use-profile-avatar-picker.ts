import { useCallback, useState } from "react";

import { useToast } from "heroui-native";

import { updateCurrentUserProfileAvatar } from "@/lib/pocketbase";
import { formatPocketBaseError } from "@/utils/errors";
import { logger } from "@/utils/logger";

import {
  pickProfileAvatarFromLibrary,
  takeProfileAvatarPhoto,
  type ProfileAvatarAsset,
} from "../lib/profile-avatar";

export function useProfileAvatarPicker() {
  const [avatar, setAvatar] = useState<ProfileAvatarAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = useCallback(
    async (asset: ProfileAvatarAsset) => {
      setIsUploading(true);
      try {
        // Optimistic local preview while the file uploads.
        setAvatar(asset);
        await updateCurrentUserProfileAvatar(asset);
        toast.show({
          variant: "success",
          label: "Avatar updated",
          description: "Your profile photo was saved.",
        });
      } catch (error) {
        setAvatar(null);
        const description = formatPocketBaseError(error);
        logger.error("[profile-avatar] upload failed:", description);
        toast.show({
          variant: "danger",
          label: "Couldn't update avatar",
          description,
        });
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [toast],
  );

  const pickFromLibrary = useCallback(async () => {
    try {
      const asset = await pickProfileAvatarFromLibrary();
      if (!asset) return;
      await uploadAvatar(asset);
    } catch (error) {
      // uploadAvatar already toasts; keep catch so the promise settles.
      logger.error("[profile-avatar] library pick failed:", error);
    }
  }, [uploadAvatar]);

  const takePhoto = useCallback(async () => {
    try {
      const asset = await takeProfileAvatarPhoto();
      if (!asset) return;
      await uploadAvatar(asset);
    } catch (error) {
      logger.error("[profile-avatar] camera capture failed:", error);
    }
  }, [uploadAvatar]);

  return {
    avatar,
    setAvatar,
    isUploading,
    pickFromLibrary,
    takePhoto,
  };
}
