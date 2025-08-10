// 类型定义

// 子应用配置类型
export interface SubAppConfig {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
}

// 子应用生命周期类型
export interface SubAppLifecycle {
  bootstrap: () => Promise<void>;
  mount: (props: any) => Promise<void>;
  unmount: () => Promise<void>;
}

// 错误类型
export interface AppError {
  message: string;
  code?: string;
  stack?: string;
}

// 事件类型
export interface AppEvent {
  type: string;
  data?: any;
  timestamp: number;
}

// 配置类型
export interface AppConfig {
  subApps: {
    vue2: SubAppConfig;
    vue3: SubAppConfig;
    react: SubAppConfig;
  };
  dev: {
    port: number;
    host: string;
  };
  prod: {
    baseUrl: string;
  };
}

// 全局类型声明
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  }
}
