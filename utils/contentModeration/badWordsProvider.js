import { Filter } from "bad-words";

const FIELD_ERRORS = {
  name: "Pack name contains inappropriate language.",
  description: "Pack description contains inappropriate language.",
};

export class BadWordsProvider {
  constructor(filter = new Filter()) {
    this.filter = filter;
  }

  /**
   * @param {Record<string, string>} fields
   * @returns {{ ok: true } | { ok: false, error: string }}
   */
  moderate(fields) {
    for (const [field, value] of Object.entries(fields)) {
      if (typeof value !== "string" || !value) {
        continue;
      }

      if (this.filter.isProfane(value)) {
        return {
          ok: false,
          error:
            FIELD_ERRORS[field] || "Content contains inappropriate language.",
        };
      }
    }

    return { ok: true };
  }
}
