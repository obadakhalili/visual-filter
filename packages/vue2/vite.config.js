const { defineConfig } = require("vite")
const { createVuePlugin } = require("vite-plugin-vue2")

module.exports = defineConfig({
  ...require("../../vite.config.js"),
  plugins: [createVuePlugin()],
})
