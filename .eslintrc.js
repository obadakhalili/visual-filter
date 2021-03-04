module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
  },
  plugins: ["vue"],
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "vue/no-multiple-template-root": "off",
        "vue/no-mutating-props": "off"
      }
    }
  ]
}
