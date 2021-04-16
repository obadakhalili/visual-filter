const baseConfig = require("../../jest.config.js")

module.exports = {
  ...baseConfig,
  transform: {
    ...baseConfig.transform,
    "\\.vue$": "vue-jest",
  },
}
