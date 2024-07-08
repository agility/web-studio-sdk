const { build } = require("esbuild")
const { dependencies, peerDependencies } = require("./package.json")
const { Generator } = require("npm-dts")
const { sassPlugin } = require("esbuild-sass-plugin")

new Generator({
  entry: "src/index.ts",
  output: "dist/index.d.ts",
}).generate()

// Config for esbuild that's shared between the various builds
const sharedTSConfig = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  platform: "node",
  external: [
    ...Object.keys(dependencies || {}),
    ...Object.keys(peerDependencies || {}),
  ],
}

const buildCSS = build({
  entryPoints: ["./src/agility-live-preview.scss"],
  bundle: true,
  plugins: [sassPlugin({})],
  minify: true,
  sourcemap: true,
  outdir: "./dist",
})

build({
  ...sharedTSConfig,
  platform: "node", // for CJS
  outfile: "dist/index.js",
})

build({
  ...sharedTSConfig,
  outfile: "dist/index.esm.js",
  platform: "neutral", // for ESM
  format: "esm",
})
