import { useEffect, useState, useCallback } from "react";

import {
  getAuthState,
  onAuthChange,
  signInWithEmail,
  signUpWithEmail,
  signOut as pbSignOut,
  type AuthState,
} from "@/lib/pocketbase";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => getAuthState());
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((state) => {
      setAuthState(state);
      if (isPending) {
        setIsPending(false);
      }
    });

    return unsubscribe;
  }, [isPending]);

  const signIn = useCallback(async (email: string, password: string) => {
    return signInWithEmail(email, password);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      return signUpWithEmail(email, password, name);
    },
    []
  );

  const signOut = useCallback(() => {
    pbSignOut();
  }, []);

  return {
    session: authState.isValid ? authState : null,
    isPending,
    signIn,
    signUp,
    signOut,
  };
}
