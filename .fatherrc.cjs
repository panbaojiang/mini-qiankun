module.exports = {
  platform: 'browser',        // 目标平台：浏览器环境
  esm: {},                    // ES Module 输出配置
  cjs: {},                    // CommonJS 输出配置  
  sourcemap: true,            // 生成 sourcemap
  extraBabelPlugins: [        // 额外的 Babel 插件
    [
      'babel-plugin-import',  // lodash 按需导入插件
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
    ],
  ],
};