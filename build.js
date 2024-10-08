require("dotenv").config()
const { build } = require("esbuild")
const { dependencies, peerDependencies } = require("./package.json")
const { Generator } = require("npm-dts")
const { sassPlugin } = require("esbuild-sass-plugin")

// Generate TypeScript declarations
new Generator({
  entry: "src/index.ts",
  output: "dist/index.d.ts",
}).generate()

// Shared config for esbuild
const sharedTSConfig = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  external: [
    ...Object.keys(dependencies || {}),
    ...Object.keys(peerDependencies || {}),
  ],
}

// Build CSS
const buildCSS = () =>
  build({
    entryPoints: ["./src/web-studio.scss"],
    bundle: true,
    plugins: [sassPlugin({})],
    minify: true,
    sourcemap: true,
    outdir: "./dist",
  })

// Build TypeScript
const buildTS = () =>
  build({
    ...sharedTSConfig,
    platform: "node", // for CJS
    outfile: "dist/index.js",
  })

// Build ESM
const buildESM = () =>
  build({
    ...sharedTSConfig,
    platform: "node", // for ESM
    format: "esm",
    outfile: "dist/index.esm.js",
  })

// Execute builds
Promise.all([buildCSS(), buildTS(), buildESM()])
  .then(() => console.log("Build completed successfully."))
  .catch((error) => {
    console.error("Build failed:", error)
    process.exit(1)
  })
