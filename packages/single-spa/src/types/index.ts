// 微应用配置类型 - single-spa 应用配置
export interface MicroAppConfig {
  bootstrap?: () => Promise<void> | void;
  mount?: () => Promise<void> | void;
  unmount?: () => Promise<void> | void;
  unload?: () => Promise<void> | void;
}

// 注册应用配置类型
export interface RegisterApplicationConfig {
  name: string;
  app: MicroAppConfig | (() => Promise<MicroAppConfig>);
  activeWhen?: string | ((location: Location) => boolean);
  customProps?: Record<string, any>;
}

// 生命周期钩子类型
export interface LifecycleHooks {
  beforeLoad?: (app: MicroAppConfig) => Promise<void> | void;
  beforeMount?: (app: MicroAppConfig) => Promise<void> | void;
  afterMount?: (app: MicroAppConfig) => Promise<void> | void;
  beforeUnmount?: (app: MicroAppConfig) => Promise<void> | void;
  afterUnmount?: (app: MicroAppConfig) => Promise<void> | void;
}

// 应用状态枚举
export enum AppStatus {
  /* 启动阶段 */
  NOT_LOADED = "NOT_LOADED", // 未加载
  LOADING = "LOADING", // 加载中
  LOADED = "LOADED", // 已加载
  /* 挂载阶段 */
  NOT_MOUNTED = "NOT_MOUNTED", // 未挂载
  BOOTSTRAPPING = "BOOTSTRAPPING", // 启动中
  MOUNTED = "MOUNTED", // 已挂载
  /* 卸载阶段 */
  UNMOUNTING = "UNMOUNTING", // 卸载中
  UNLOADING = "UNLOADING", // 卸载完成
  SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN", // 跳过因为破损
}

// 注册的应用信息
export interface RegisteredApp {
  name: string;
  loadApp: MicroAppConfig | (() => Promise<MicroAppConfig>);
  activeWhen?: string | ((location: Location) => boolean);
  customProps?: Record<string, any>;
  status: AppStatus;
  loadPromise?: Promise<any>;
  bootstrapPromise?: Promise<any>;
  mountPromise?: Promise<any>;
  unmountPromise?: Promise<any>;
  unloadPromise?: Promise<any>;
  loadError?: Error;
  bootstrapError?: Error;
  mountError?: Error;
  unmountError?: Error;
  unloadError?: Error;
}

// 全局生命周期钩子
export interface GlobalLifecycleHooks {
  beforeLoad?: (app: MicroAppConfig) => Promise<void> | void;
  beforeMount?: (app: MicroAppConfig) => Promise<void> | void;
  afterMount?: (app: MicroAppConfig) => Promise<void> | void;
  beforeUnmount?: (app: MicroAppConfig) => Promise<void> | void;
  afterUnmount?: (app: MicroAppConfig) => Promise<void> | void;
}
