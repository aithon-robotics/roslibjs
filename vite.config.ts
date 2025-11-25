import { resolve } from "path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "tsconfig.json",
      insertTypesEntry: true,
      // Only generate types for our actual source code, obv
      include: ["src"],
    }),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.json",
      },
      eslint: {
        lintCommand: "eslint .",
        useFlatConfig: true,
      },
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/RosLib.ts"),
      name: "ROSLIB",
      // the proper extensions will be added
      fileName: "RosLib",
      formats: ["es", "umd"],
    },
    // Keep synchronized with minimum engine specified in CI & package.json
    target: "node18",
    minify: "esbuild",
    rollupOptions: {
      output: {
        // Create both regular and minified versions
        assetFileNames: "roslib.[ext]",
      },
    },
  },
  test: {
    include: ["{src,test}/**/*.{test,spec,example}.?(c|m)[jt]s?(x)"],
    exclude: ["dist"],
    globalSetup: "./test/setup/vitest-setup.ts",
    setupFiles: "./test/setup/per-suite-setup.ts",
    projects: [
      {
        extends: true,
        test: {
          environment: "jsdom",
          name: "jsdom",
        },
      },
    ],
  },
});
