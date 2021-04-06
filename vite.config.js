const { defineConfig } = require("vite")

const path = require("path")

module.exports = defineConfig({
  resolve: {
    alias: { "@": path.resolve("src") },
  },
  optimizeDeps: {
    include: ["@visual-filter/common", "@visual-filter/applyer"],
  },
})
