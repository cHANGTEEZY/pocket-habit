import { useCallback, useState } from "react";

import { useToast } from "heroui-native";

import { useUpdateProfileAvatar } from "@/api";
import { logger } from "@/utils/logger";

import {
  pickProfileAvatarFromLibrary,
  takeProfileAvatarPhoto,
  type ProfileAvatarAsset,
} from "../lib/profile-avatar";

export function useProfileAvatarPicker() {
  const [avatar, setAvatar] = useState<ProfileAvatarAsset | null>(null);
  const { mutateAsync: updateAvatar, isPending: isUploading } =
    useUpdateProfileAvatar();
  const { toast } = useToast();

  const uploadAvatar = useCallback(
    async (asset: ProfileAvatarAsset) => {
      // Optimistic local preview while the file uploads.
      setAvatar(asset);
      try {
        await updateAvatar(asset);
        setAvatar(null);
        toast.show({
          variant: "success",
          label: "Avatar updated",
          description: "Your profile photo was saved.",
        });
      } catch (error) {
        setAvatar(null);
        const description =
          error instanceof Error ? error.message : "Upload failed.";
        logger.error("[profile-avatar] upload failed:", description);
        toast.show({
          variant: "danger",
          label: "Couldn't update avatar",
          description,
        });
        throw error;
      }
    },
    [toast, updateAvatar],
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
