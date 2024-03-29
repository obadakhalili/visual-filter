const ignoreImport = require("rollup-plugin-ignore-import")
const { babel } = require("@rollup/plugin-babel")
const { terser } = require("rollup-plugin-terser")
const { nodeResolve } = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const postcss = require("rollup-plugin-postcss")

const sharedConfig = {
  input: "src/main.js",
  external: ["@visual-filter/common", "@visual-filter/applyer"],
}
const buildsConfig = []

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
  ignoreImport({
    extensions: [".css"],
  }),
  babel({
    babelHelpers: "bundled",
    extensions: [".js", ".vue", ".ts", ".tsx"],
    configFile: "../../babel.config.js",
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
