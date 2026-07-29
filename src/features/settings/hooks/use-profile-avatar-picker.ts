import { useCallback, useState } from "react";

import {
  pickProfileAvatarFromLibrary,
  takeProfileAvatarPhoto,
  type ProfileAvatarAsset,
} from "../lib/profile-avatar";

export function useProfileAvatarPicker() {
  const [avatar, setAvatar] = useState<ProfileAvatarAsset | null>(null);

  const pickFromLibrary = useCallback(async () => {
    try {
      const asset = await pickProfileAvatarFromLibrary();
      if (!asset) return;

      setAvatar(asset);
      console.log("[profile-avatar] chosen from library:", asset);
    } catch (error) {
      console.error("[profile-avatar] library pick failed:", error);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const asset = await takeProfileAvatarPhoto();
      if (!asset) return;

      setAvatar(asset);
      console.log("[profile-avatar] taken with camera:", asset);
    } catch (error) {
      console.error("[profile-avatar] camera capture failed:", error);
    }
  }, []);

  return {
    avatar,
    setAvatar,
    pickFromLibrary,
    takePhoto,
  };
}
