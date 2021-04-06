const alias = require("@rollup/plugin-alias")
const { nodeResolve } = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const ignoreImport = require("rollup-plugin-ignore-import")
const { babel } = require("@rollup/plugin-babel")
const { terser } = require("rollup-plugin-terser")
const postcss = require("rollup-plugin-postcss")

const path = require("path")

const sharedConfig = { input: "src/main.js" }
const buildsConfig = []

Object.assign(sharedConfig, {
  external: ["@visual-filter/common", "@visual-filter/applyer"],
})

if (process.env.package.startsWith("vue")) {
  sharedConfig.external.push("vue")

  if (process.env.package.endsWith("2")) {
    Object.assign(sharedConfig, {
      plugins: [
        require("rollup-plugin-vue2")({
          template: { isProduction: true },
        }),
      ],
    })
  } else {
    Object.assign(sharedConfig, { plugins: [require("rollup-plugin-vue3")()] })
  }
}

sharedConfig.plugins.push(
  alias({
    entries: [{ find: "@", replacement: path.resolve("src") }],
  }),
  ignoreImport({
    extensions: [".css"],
  }),
  babel({
    babelHelpers: "bundled",
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
    presets: [
      [
        "@babel/preset-env",
        {
          targets: ["current node", "last 2 versions and > 2%", "ie > 10"],
        },
      ],
    ],
  }),
  terser(),
)

buildsConfig.push(
  {
    ...sharedConfig,
    output: {
      file: "dist/component.esm.js",
      format: "esm",
    },
  },
  {
    ...sharedConfig,
    output: {
      file: "dist/component.cjs.js",
      format: "cjs",
      exports: "auto",
    },
  },
  {
    ...sharedConfig,
    external: "vue",
    plugins: [...sharedConfig.plugins, nodeResolve(), commonjs()],
    output: {
      file: "dist/component.min.js",
      format: "iife",
      name: "VueVisualFilter",
      globals: { vue: "Vue" },
    },
  },
  {
    input: "src/index.css",
    output: {
      file: "dist/styles.css",
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
)

module.exports = buildsConfig
