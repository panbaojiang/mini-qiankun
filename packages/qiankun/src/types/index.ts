// 基础对象类型 - 使用 unknown 更安全
export type ObjectType = Record<string, unknown>;

// 微应用配置类型
export interface MicroAppConfig {
  name: string;
  entry: string;
  container: string | HTMLElement;
  activeRule: string | ((location: Location) => boolean);
  props?: Record<string, any>;
}

// 路由配置类型
export interface RouterConfig {
  path: string;
  component?: any;
  children?: RouterConfig[];
}

// 生命周期钩子类型
export interface LifecycleHooks {
  beforeLoad?: (app: MicroAppConfig) => Promise<void> | void;
  beforeMount?: (app: MicroAppConfig) => Promise<void> | void;
  afterMount?: (app: MicroAppConfig) => Promise<void> | void;
  beforeUnmount?: (app: MicroAppConfig) => Promise<void> | void;
  afterUnmount?: (app: MicroAppConfig) => Promise<void> | void;
}

// 生命周期类型
export type LifeCycles<T> = {
  beforeLoad?: (app: T) => Promise<void> | void;
  beforeMount?: (app: T) => Promise<void> | void;
  afterMount?: (app: T) => Promise<void> | void;
  beforeUnmount?: (app: T) => Promise<void> | void;
  afterUnmount?: (app: T) => Promise<void> | void;
};

// 可注册应用类型
export interface RegistrableApp<T extends ObjectType = ObjectType> {
  name: string;
  entry: string;
  container: string | HTMLElement;
  activeRule: string | ((location: Location) => boolean);
  props?: T;
}
