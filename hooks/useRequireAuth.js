import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useAuthGate } from "../ctx/AuthGateContext";
import { consumeAuthGateIntent } from "../utils/authGate";

export default function useRequireAuth({
  resumeKey,
  onSuccess,
  beforeSignIn,
  callbackUrl,
  successMessage,
} = {}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { openLogin, showToast } = useAuthGate();

  useEffect(() => {
    if (!resumeKey || !session?.user) return;
    if (!consumeAuthGateIntent(resumeKey)) return;

    onSuccess?.();

    if (successMessage) {
      showToast(successMessage);
    }
  }, [session, resumeKey, onSuccess, successMessage, showToast]);

  const requireAuth = useCallback(
    (overrides = {}) => {
      const runOnSuccess = overrides.onSuccess ?? onSuccess;

      if (session?.user) {
        runOnSuccess?.();
        return true;
      }

      openLogin({
        resumeKey: overrides.resumeKey ?? resumeKey,
        beforeSignIn: overrides.beforeSignIn ?? beforeSignIn,
        callbackUrl: overrides.callbackUrl ?? callbackUrl ?? router.asPath,
      });

      return false;
    },
    [
      session,
      openLogin,
      resumeKey,
      onSuccess,
      beforeSignIn,
      callbackUrl,
      router.asPath,
    ]
  );

  return {
    requireAuth,
    isAuthenticated: !!session?.user,
  };
}
