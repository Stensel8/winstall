import { BadWordsProvider } from "./badWordsProvider.js";

const globalKey = "_winstallContentModerator";

/**
 * @returns {BadWordsProvider}
 */
export function getContentModerator() {
  if (!globalThis[globalKey]) {
    globalThis[globalKey] = new BadWordsProvider();
  }

  return globalThis[globalKey];
}

/**
 * @param {Record<string, string>} fields
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function moderatePackFields(fields) {
  if (!fields || typeof fields !== "object") {
    return { ok: true };
  }

  return getContentModerator().moderate(fields);
}

/**
 * @param {unknown} result
 * @returns {result is { ok: false, error: string }}
 */
export function isModerationFailure(result) {
  return Boolean(result && result.ok === false);
}
