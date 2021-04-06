const { defineConfig } = require("vite")
const vue = require("@vitejs/plugin-vue")

module.exports = defineConfig({
  ...require("../../vite.config.js"),
  plugins: [vue()],
})
