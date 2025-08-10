import { RegisteredApp, AppStatus } from "../types";

/**
 * 检查应用是否处于激活状态
 * @param app - 已注册的应用对象
 * @returns 如果应用状态为 MOUNTED 则返回 true，否则返回 false
 */
export function isActive(app: RegisteredApp) {
  return app.status === AppStatus.MOUNTED;
}

/**
 * 判断应用是否应该被激活
 * 根据应用的 activeWhen 配置和当前路由路径来判断应用是否应该被激活
 * @param app - 已注册的应用对象
 * @returns 如果应用应该被激活则返回 true，否则返回 false
 */
export function shouldBeActive(app: RegisteredApp): boolean {
  // 获取应用的激活条件配置
  const { activeWhen } = app;

  // 如果没有配置激活条件，则应用不应该被激活
  if (!activeWhen) {
    return false;
  }

  // 如果激活条件是字符串（路径前缀），检查当前路径是否以该前缀开头
  if (typeof activeWhen === "string") {
    return window.location.pathname.startsWith(activeWhen);
  }

  // 如果激活条件是函数，则调用该函数并传入当前 location 对象
  if (typeof activeWhen === "function") {
    return activeWhen(window.location);
  }

  // 如果激活条件既不是字符串也不是函数，则应用不应该被激活
  return false;
}
