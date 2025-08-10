const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    port: 7101,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    entry: "./src/main.js",
    output: {
      library: "vue2App",
      libraryTarget: "umd",
      chunkLoadingGlobal: "webpackJsonp_myApp", // ✅ 替换为这个
    },
  },
  publicPath: "/",
});
