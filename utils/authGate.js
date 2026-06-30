export const AUTH_GATE_STORAGE_PREFIX = "authGate:";

export const AUTH_ERROR_MESSAGE =
  "Authentication failed. Please try again.";

export function setAuthGateIntent(resumeKey) {
  if (!resumeKey) return;
  sessionStorage.setItem(`${AUTH_GATE_STORAGE_PREFIX}${resumeKey}`, "1");
}

export function consumeAuthGateIntent(resumeKey) {
  if (!resumeKey) return false;

  const key = `${AUTH_GATE_STORAGE_PREFIX}${resumeKey}`;
  if (!sessionStorage.getItem(key)) return false;

  sessionStorage.removeItem(key);
  return true;
}
