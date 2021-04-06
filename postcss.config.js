const path = require("path")

module.exports = {
  plugins: [
    require("tailwindcss")({
      config: path.resolve("../../tailwind.config.js"),
    }),
  ],
}
