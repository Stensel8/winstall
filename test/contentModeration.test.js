const test = require("node:test");
const assert = require("node:assert/strict");

test("moderatePackFields allows clean pack content", async () => {
  const { moderatePackFields } = await import(
    "../utils/contentModeration/index.js"
  );

  const result = moderatePackFields({
    name: "My Dev Tools",
    description: "A collection of useful developer apps.",
  });

  assert.deepEqual(result, { ok: true });
});

test("BadWordsProvider rejects blocked words with field-specific errors", async () => {
  const { Filter } = await import("bad-words");
  const { BadWordsProvider } = await import(
    "../utils/contentModeration/badWordsProvider.js"
  );

  const filter = new Filter({ list: ["blockedword"] });
  const provider = new BadWordsProvider(filter);

  assert.deepEqual(provider.moderate({ name: "blockedword tools" }), {
    ok: false,
    error: "Pack name contains inappropriate language.",
  });

  assert.deepEqual(provider.moderate({ description: "Uses blockedword daily" }), {
    ok: false,
    error: "Pack description contains inappropriate language.",
  });

  assert.deepEqual(provider.moderate({ name: "Clean name" }), { ok: true });
});
