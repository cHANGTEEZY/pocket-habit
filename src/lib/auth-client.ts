import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

import { getApiUrl } from "@/utils/env";

export const authClient = createAuthClient({
  baseURL: getApiUrl(),
  plugins: [
    expoClient({
      scheme: "expoboilerplate",
      storagePrefix: "expoboilerplate",
      storage: SecureStore,
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export const getCookie = () => authClient.getCookie();
