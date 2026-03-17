const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  // Enable standalone mode for Docker builds only
  ...(process.env.STANDALONE_BUILD === "true" && { output: "standalone" }),
});
