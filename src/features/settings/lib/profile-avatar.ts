import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export type ProfileAvatarAsset = {
  uri: string;
  width: number;
  height: number;
  mimeType?: string;
  fileName?: string | null;
  fileSize?: number;
};

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
  preferredAssetRepresentationMode:
    ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
};

function toProfileAvatarAsset(
  asset: ImagePicker.ImagePickerAsset,
): ProfileAvatarAsset {
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType ?? undefined,
    fileName: asset.fileName,
    fileSize: asset.fileSize,
  };
}

function showPermissionAlert(source: "camera" | "library") {
  Alert.alert(
    "Permission required",
    source === "camera"
      ? "Camera access is required to take a profile photo."
      : "Photo library access is required to choose a profile photo.",
  );
}

export async function pickProfileAvatarFromLibrary(): Promise<ProfileAvatarAsset | null> {
  console.log("[profile-avatar] requesting library permission");
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    showPermissionAlert("library");
    return null;
  }

  console.log("[profile-avatar] launching library picker");
  const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
  console.log("[profile-avatar] library picker result:", result.canceled ? "canceled" : "success");

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return toProfileAvatarAsset(result.assets[0]);
}

export async function takeProfileAvatarPhoto(): Promise<ProfileAvatarAsset | null> {
  console.log("[profile-avatar] requesting camera permission");
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    showPermissionAlert("camera");
    return null;
  }

  console.log("[profile-avatar] launching camera");
  const result = await ImagePicker.launchCameraAsync({
    ...pickerOptions,
    presentationStyle:
      ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
  });
  console.log("[profile-avatar] camera result:", result.canceled ? "canceled" : "success");
  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return toProfileAvatarAsset(result.assets[0]);
}
