import PocketBase, { AsyncAuthStore, RecordAuthResponse, RecordModel } from "pocketbase";
import * as SecureStore from "expo-secure-store";
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
  password: string
): Promise<RecordAuthResponse<RecordModel>> {
  ensureBaseUrl();
  return pb.collection("users").authWithPassword(email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<RecordModel> {
  ensureBaseUrl();
  return pb.collection("users").create({
    email,
    password,
    passwordConfirm: password,
    name,
  });
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
