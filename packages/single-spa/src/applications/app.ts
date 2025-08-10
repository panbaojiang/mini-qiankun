import {
  MicroAppConfig,
  RegisteredApp,
  AppStatus,
  GlobalLifecycleHooks,
  RegisterApplicationConfig,
} from "../types";
import { reroute } from "../navigation/reroute";
import { shouldBeActive } from "./app.helper";
import { isInBrowser } from "../utils";

// 注册应用参数类型
interface RegistrationParams {
  name: string;
  loadApp: MicroAppConfig | (() => Promise<MicroAppConfig>);
  activeWhen?: string | ((location: Location) => boolean);
  customProps?: Record<string, any>;
}

export const registeredApps: RegisteredApp[] = [];

// 全局生命周期钩子
const globalLifecycleHooks: GlobalLifecycleHooks = {};

/**
 * 验证注册应用配置对象的有效性
 *
 * 执行步骤：
 * 1. 检查配置对象是否存在且为对象类型
 * 2. 验证应用名称是否存在且为字符串类型
 * 3. 验证应用配置或加载函数是否存在
 *
 * @param config 注册应用配置对象
 * @throws Error 当配置无效时抛出错误
 */
function validateRegisterWithConfig(config: RegisterApplicationConfig): void {
  // 步骤1: 检查配置对象是否存在且为对象类型
  if (!config || typeof config !== "object") {
    throw new Error("配置对象不能为空");
  }

  // 步骤2: 验证应用名称是否存在且为字符串类型
  if (!config.name || typeof config.name !== "string") {
    throw new Error("应用名称必须是字符串");
  }

  // 步骤3: 验证应用配置或加载函数是否存在
  if (!config.app) {
    throw new Error("应用配置或加载函数不能为空");
  }
}

/**
 * 验证注册应用参数的有效性
 *
 * 执行步骤：
 * 1. 验证应用名称是否存在且为字符串类型
 * 2. 验证应用配置或加载函数是否存在
 *
 * @param name 应用名称
 * @param app 应用配置或加载函数
 * @param activeWhen 激活条件（可选）
 * @param customProps 自定义属性（可选）
 * @throws Error 当参数无效时抛出错误
 */
function validateRegisterWithArguments(
  name: string,
  app: MicroAppConfig | (() => Promise<MicroAppConfig>),
  activeWhen?: string | ((location: Location) => boolean),
  customProps?: Record<string, any>
): void {
  // 步骤1: 验证应用名称是否存在且为字符串类型
  if (!name || typeof name !== "string") {
    throw new Error("应用名称必须是字符串");
  }

  // 步骤2: 验证应用配置或加载函数是否存在
  if (!app) {
    throw new Error("应用配置或加载函数不能为空");
  }
}

/**
 * 清理和验证loadApp参数
 *
 * 执行步骤：
 * 1. 检查是否为函数类型（异步加载函数）
 * 2. 检查是否为对象类型（直接配置对象）
 * 3. 如果都不是，抛出错误
 *
 * @param loadApp 应用配置或加载函数
 * @returns 清理后的loadApp参数
 * @throws Error 当loadApp格式无效时抛出错误
 */
function sanitizeLoadApp(
  loadApp: MicroAppConfig | (() => Promise<MicroAppConfig>)
): MicroAppConfig | (() => Promise<MicroAppConfig>) {
  // 步骤1: 检查是否为函数类型（异步加载函数）
  if (typeof loadApp === "function") {
    return loadApp;
  }

  // 步骤2: 检查是否为对象类型（直接配置对象）
  if (typeof loadApp === "object" && loadApp !== null) {
    return loadApp;
  }

  // 步骤3: 如果都不是，抛出错误
  throw new Error("loadApp必须是函数或有效的应用配置对象");
}

/**
 * 清理和验证customProps参数
 *
 * 执行步骤：
 * 1. 检查是否为undefined或null，返回空对象
 * 2. 检查是否为对象类型
 * 3. 如果不是对象类型，抛出错误
 *
 * @param customProps 自定义属性对象
 * @returns 清理后的customProps对象
 * @throws Error 当customProps格式无效时抛出错误
 */
function sanitizeCustomProps(
  customProps?: Record<string, any>
): Record<string, any> {
  // 步骤1: 检查是否为undefined或null，返回空对象
  if (customProps === undefined || customProps === null) {
    return {};
  }

  // 步骤2: 检查是否为对象类型
  if (typeof customProps === "object") {
    return customProps;
  }

  // 步骤3: 如果不是对象类型，抛出错误
  throw new Error("customProps必须是对象类型");
}

/**
 * 清理和验证activeWhen参数
 *
 * 执行步骤：
 * 1. 检查是否为undefined或null，返回默认路径"/"
 * 2. 检查是否为字符串或函数类型
 * 3. 如果不是有效类型，抛出错误
 *
 * @param activeWhen 激活条件
 * @returns 清理后的activeWhen参数
 * @throws Error 当activeWhen格式无效时抛出错误
 */
function sanitizeActiveWhen(
  activeWhen?: string | ((location: Location) => boolean)
): string | ((location: Location) => boolean) {
  // 步骤1: 检查是否为undefined或null，返回默认路径"/"
  if (activeWhen === undefined || activeWhen === null) {
    return "/";
  }

  // 步骤2: 检查是否为字符串或函数类型
  if (typeof activeWhen === "string" || typeof activeWhen === "function") {
    return activeWhen;
  }

  // 步骤3: 如果不是有效类型，抛出错误
  throw new Error("activeWhen必须是字符串或函数类型");
}

/**
 * 处理传入的参数，支持对象形式和参数形式
 *
 * 执行步骤：
 * 1. 判断使用的是对象API还是参数API
 * 2. 如果是对象API：
 *    - 验证配置对象
 *    - 提取配置中的各个字段
 * 3. 如果是参数API：
 *    - 验证各个参数
 *    - 构建注册参数对象
 * 4. 清理和验证各个字段
 * 5. 返回标准化的注册参数对象
 *
 * @param appNameOrConfig 应用名称或配置对象
 * @param appOrLoadApp 应用配置或加载函数（仅在参数形式时使用）
 * @param activeWhen 激活条件（仅在参数形式时使用）
 * @param customProps 自定义属性（仅在参数形式时使用）
 * @returns 处理后的参数对象
 * @throws Error 当参数格式无效时抛出错误
 */
function sanitizeArguments(
  appNameOrConfig: string | RegisterApplicationConfig,
  appOrLoadApp?: MicroAppConfig | (() => Promise<MicroAppConfig>),
  activeWhen?: string | ((location: Location) => boolean),
  customProps?: Record<string, any>
): RegistrationParams {
  // 步骤1: 判断使用的是对象API还是参数API
  const usingObjectAPI = typeof appNameOrConfig === "object";

  // 初始化注册参数对象
  const registration: RegistrationParams = {
    name: "",
    loadApp: {} as MicroAppConfig,
    activeWhen: "/",
    customProps: {},
  };

  if (usingObjectAPI) {
    // 步骤2a: 对象API格式处理
    const config = appNameOrConfig as RegisterApplicationConfig;
    validateRegisterWithConfig(config);

    // 提取配置中的各个字段
    registration.name = config.name;
    registration.loadApp = config.app;
    registration.activeWhen = config.activeWhen;
    registration.customProps = config.customProps;
  } else {
    // 步骤2b: 参数API格式处理
    const name = appNameOrConfig as string;
    const app = appOrLoadApp;

    // 验证app参数是否存在
    if (!app) {
      throw new Error("使用参数API格式时，appOrLoadApp参数不能为空");
    }

    validateRegisterWithArguments(name, app, activeWhen, customProps);

    // 构建注册参数对象
    registration.name = name;
    registration.loadApp = app;
    registration.activeWhen = activeWhen;
    registration.customProps = customProps;
  }

  // 步骤4: 清理和验证各个字段
  registration.loadApp = sanitizeLoadApp(registration.loadApp);
  registration.customProps = sanitizeCustomProps(registration.customProps);
  registration.activeWhen = sanitizeActiveWhen(registration.activeWhen);

  // 步骤5: 返回标准化的注册参数对象
  return registration;
}

/**
 * 获取当前应该激活的应用列表
 *
 * 执行步骤：
 * 1. 遍历所有已注册的应用
 * 2. 使用shouldBeActive函数判断每个应用是否应该激活
 * 3. 返回符合条件的应用列表
 *
 * @returns 当前应该激活的应用数组
 */
export function getActiveApps(): RegisteredApp[] {
  return registeredApps.filter((app) => shouldBeActive(app));
}

/**
 * 获取当前已挂载的应用列表
 *
 * 执行步骤：
 * 1. 遍历所有已注册的应用
 * 2. 检查应用状态是否为MOUNTED
 * 3. 返回已挂载的应用列表
 *
 * @returns 当前已挂载的应用数组
 */
export function getMountedApps(): RegisteredApp[] {
  return registeredApps.filter((app) => app.status === AppStatus.MOUNTED);
}

/**
 * 获取所有注册的应用列表
 *
 * 执行步骤：
 * 1. 返回registeredApps数组的浅拷贝
 * 2. 避免外部直接修改内部数组
 *
 * @returns 所有已注册应用的副本数组
 */
export function getRegisteredApps(): RegisteredApp[] {
  return [...registeredApps];
}

/**
 * 获取指定应用的状态
 *
 * 执行步骤：
 * 1. 在registeredApps中查找指定名称的应用
 * 2. 如果找到应用，返回其状态
 * 3. 如果未找到应用，返回null
 *
 * @param name 应用名称
 * @returns 应用状态或null（如果应用不存在）
 */
export function getAppStatus(name: string): AppStatus | null {
  const app = registeredApps.find((app) => app.name === name);
  return app ? app.status : null;
}

/**
 * 注册微应用
 *
 * 执行步骤：
 * 1. 使用sanitizeArguments处理传入的参数
 * 2. 创建RegisteredApp对象，设置初始状态为NOT_LOADED
 * 3. 将应用添加到registeredApps数组中
 * 4. 调用reroute()重新计算路由
 *
 * @param appNameOrConfig 应用名称或配置对象
 * @param appOrLoadApp 应用配置或加载函数（仅在参数形式时使用）
 * @param activeWhen 激活条件（仅在参数形式时使用）
 * @param customProps 自定义属性（仅在参数形式时使用）
 * @throws Error 当参数无效时抛出错误
 */
export function registerApplication(
  appNameOrConfig: string | RegisterApplicationConfig,
  appOrLoadApp?: MicroAppConfig | (() => Promise<MicroAppConfig>),
  activeWhen?: string | ((location: Location) => boolean),
  customProps?: Record<string, any>
): void {
  // 步骤1: 处理传入的参数
  const registration = sanitizeArguments(
    appNameOrConfig,
    appOrLoadApp,
    activeWhen,
    customProps
  );

  // 步骤2: 创建RegisteredApp对象，设置初始状态为NOT_LOADED
  const registeredApp: RegisteredApp = {
    ...registration,
    status: AppStatus.NOT_LOADED,
  };

  // 步骤3: 将应用添加到registeredApps数组中
  registeredApps.push(registeredApp);
  if (isInBrowser()) {
    // 步骤4: 重新计算路由
    reroute();
  }
}

/**
 * 设置全局生命周期钩子
 *
 * 执行步骤：
 * 1. 使用Object.assign将传入的钩子合并到globalLifecycleHooks中
 * 2. 如果钩子已存在，会被新的钩子覆盖
 *
 * @param hooks 全局生命周期钩子对象
 */
export function setGlobalLifecycleHooks(hooks: GlobalLifecycleHooks): void {
  Object.assign(globalLifecycleHooks, hooks);
}
