import * as SecureStore from "expo-secure-store";
import PocketBase, {
  AsyncAuthStore,
  ClientResponseError,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { Platform } from "react-native";

import { getPocketBaseUrl } from "@/utils/env";

const AUTH_STORE_KEY = "pb_auth";

function createAuthStore() {
  if (Platform.OS === "web") {
    return undefined;
  }

  return new AsyncAuthStore({
    save: async (serialized) => {
      await SecureStore.setItemAsync(AUTH_STORE_KEY, serialized);
    },
    clear: async () => {
      await SecureStore.deleteItemAsync(AUTH_STORE_KEY);
    },
    initial: SecureStore.getItemAsync(AUTH_STORE_KEY),
  });
}

export const pb = new PocketBase(getPocketBaseUrl(), createAuthStore());

pb.autoCancellation(false);

/** Re-resolve base URL before auth calls (host IP can be missing at module load). */
function ensureBaseUrl() {
  const url = getPocketBaseUrl();
  if (pb.baseUrl !== url) {
    pb.baseUrl = url;
  }
  if (__DEV__) {
    console.log(`[pocketbase] baseUrl=${pb.baseUrl}`);
  }
}

export interface AuthState {
  isValid: boolean;
  record: RecordModel | null;
  token: string;
}

export function getAuthState(): AuthState {
  return {
    isValid: pb.authStore.isValid,
    record: pb.authStore.record,
    token: pb.authStore.token,
  };
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<RecordAuthResponse<RecordModel>> {
  ensureBaseUrl();
  return pb.collection("users").authWithPassword(email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
): Promise<RecordModel> {
  ensureBaseUrl();
  return pb.collection("users").create({
    email,
    password,
    passwordConfirm: password,
    name,
  });
}

export type UpdateProfileInput = {
  name: string;
  email: string;
  bio: string;
};

function saveAuthRecord(record: RecordModel) {
  if (pb.authStore.token && pb.authStore.record?.id === record.id) {
    pb.authStore.save(pb.authStore.token, record);
  }
}

export async function updateCurrentUserProfile(
  data: UpdateProfileInput,
): Promise<RecordModel> {
  ensureBaseUrl();
  const id = pb.authStore.record?.id;
  if (!id) {
    throw new Error("You need to be signed in to update your profile.");
  }

  const record = await pb.collection("users").update(id, {
    name: data.name.trim(),
    email: data.email.trim(),
    bio: data.bio.trim(),
  });
  saveAuthRecord(record);
  return record;
}

export type ProfileAvatarUpload = {
  uri: string;
  mimeType?: string;
  fileName?: string | null;
};

/** Public URL for the signed-in user's avatar file, or null. */
export function getCurrentUserAvatarUrl(
  thumb = "200x200",
): string | null {
  const record = pb.authStore.record;
  const filename = record?.avatar;
  if (!record || typeof filename !== "string" || !filename) {
    return null;
  }
  return pb.files.getURL(record, filename, { thumb });
}

const AVATAR_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

function resolveAvatarMime(mimeType?: string): string {
  if (mimeType && AVATAR_MIME_TYPES.has(mimeType)) {
    return mimeType;
  }
  return "image/jpeg";
}

function resolveAvatarFileName(
  fileName: string | null | undefined,
  mimeType: string,
): string {
  const trimmed = fileName?.trim();
  if (trimmed) return trimmed;
  const ext =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : mimeType === "image/gif"
          ? "gif"
          : "jpg";
  return `avatar.${ext}`;
}

/**
 * React Native's fetch often fails multipart file uploads (ClientResponseError 0).
 * XMLHttpRequest correctly serializes the { uri, type, name } FormData file shape.
 */
function patchRecordMultipart(
  url: string,
  formData: FormData,
  token: string,
): Promise<RecordModel> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", url);
    if (token) {
      xhr.setRequestHeader("Authorization", token);
    }
    xhr.onload = () => {
      let response: Record<string, unknown> = {};
      try {
        response = JSON.parse(xhr.responseText || "{}") as Record<
          string,
          unknown
        >;
      } catch {
        // Non-JSON body — still surface status via ClientResponseError.
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response as unknown as RecordModel);
        return;
      }

      reject(
        new ClientResponseError({
          url,
          status: xhr.status,
          response,
        }),
      );
    };
    xhr.onerror = () => {
      reject(
        new ClientResponseError({
          url,
          status: 0,
          response: {},
          originalError: new Error("Network request failed"),
        }),
      );
    };
    xhr.send(formData);
  });
}

export async function updateCurrentUserProfileAvatar(
  avatar: ProfileAvatarUpload,
): Promise<RecordModel> {
  ensureBaseUrl();
  const id = pb.authStore.record?.id;
  if (!id) {
    throw new Error("You need to be signed in to update your profile.");
  }

  const mimeType = resolveAvatarMime(avatar.mimeType);
  const fileName = resolveAvatarFileName(avatar.fileName, mimeType);
  const formData = new FormData();

  if (Platform.OS === "web") {
    const blob = await (await fetch(avatar.uri)).blob();
    formData.append("avatar", blob, fileName);
    const record = await pb.collection("users").update(id, formData);
    saveAuthRecord(record);
    return record;
  }

  // Native: { uri, type, name } — only reliable with XMLHttpRequest, not fetch/SDK.
  formData.append("avatar", {
    uri: avatar.uri,
    type: mimeType,
    name: fileName,
  } as unknown as Blob);

  const record = await patchRecordMultipart(
    `${pb.baseUrl}/api/collections/users/records/${id}`,
    formData,
    pb.authStore.token,
  );
  saveAuthRecord(record);
  return record;
}

export function signOut(): void {
  pb.authStore.clear();
}

export function onAuthChange(callback: (state: AuthState) => void): () => void {
  const unsubscribe = pb.authStore.onChange(() => {
    callback(getAuthState());
  });

  return unsubscribe;
}
