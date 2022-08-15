const { defineConfig } = require("vitest/config")
const vue = require("@vitejs/plugin-vue")

module.exports = defineConfig({
  ...require("../../vite.config.js"),
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})
