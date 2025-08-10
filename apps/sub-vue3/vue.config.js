const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    port: 7102,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    entry: "./src/main.ts",
    output: {
      library: "vue3App",
      libraryTarget: "umd",
      globalObject: "window",
    },
    resolve: {
      extensions: [".ts", ".js", ".vue", ".json"],
    },
  },
  transpileDependencies: true,
  publicPath: "/",
});
