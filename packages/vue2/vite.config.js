const { defineConfig } = require("vite")
const { createVuePlugin } = require("vite-plugin-vue2")

const path = require("path")

module.exports = defineConfig({
  resolve: {
    alias: { "@": path.resolve("src") },
  },
  optimizeDeps: {
    include: ["@visual-filter/common", "@visual-filter/applyer"],
  },
  plugins: [createVuePlugin()],
})
