// 应用配置
export const config = {
  // 子应用配置
  subApps: {
    vue2: {
      name: 'sub-vue2',
      entry: '//localhost:7101',
      activeRule: '/sub-vue2',
    },
    vue3: {
      name: 'sub-vue3',
      entry: '//localhost:7102',
      activeRule: '/sub-vue3',
    },
    react: {
      name: 'sub-react',
      entry: '//localhost:7103',
      activeRule: '/sub-react',
    },
  },

  // 开发环境配置
  dev: {
    port: 5173,
    host: 'localhost',
  },

  // 生产环境配置
  prod: {
    baseUrl: '/',
  },
};

export default config;
