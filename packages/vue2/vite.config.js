const { defineConfig } = require("vite")
const vue2 = require("@vitejs/plugin-vue2")

module.exports = defineConfig({
  ...require("../../vite.config.js"),
  plugins: [vue2()],
})
