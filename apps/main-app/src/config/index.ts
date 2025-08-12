// 应用配置
const { VITE_SUB_VUE2_ENTRY, VITE_SUB_VUE3_ENTRY, VITE_SUB_REACT_ENTRY } =
  import.meta.env;
export const config = {
  // 子应用配置
  subApps: {
    vue2: {
      name: 'sub-vue2',
      entry: VITE_SUB_VUE2_ENTRY,
      activeRule: '/sub-vue2',
    },
    vue3: {
      name: 'sub-vue3',
      entry: VITE_SUB_VUE3_ENTRY,
      activeRule: '/sub-vue3',
    },
    react: {
      name: 'sub-react',
      entry: VITE_SUB_REACT_ENTRY,
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
