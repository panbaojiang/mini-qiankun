// 应用常量

// 路由常量
export const ROUTES = {
  HOME: '/',
  VUE2: '/sub-vue2',
  VUE3: '/sub-vue3',
  REACT: '/sub-react',
} as const;

// 子应用名称
export const SUB_APP_NAMES = {
  VUE2: 'vue2-app',
  VUE3: 'vue3-app',
  REACT: 'react-app',
} as const;

// 端口配置
export const PORTS = {
  MAIN: 5173,
  VUE2: 7101,
  VUE3: 7102,
  REACT: 7103,
} as const;

// 环境变量
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const;

// 事件类型
export const EVENTS = {
  APP_LOADED: 'app-loaded',
  APP_ERROR: 'app-error',
  APP_UNLOADED: 'app-unloaded',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  APP_LOAD_FAILED: '应用加载失败',
  NETWORK_ERROR: '网络错误',
  TIMEOUT: '请求超时',
} as const;
